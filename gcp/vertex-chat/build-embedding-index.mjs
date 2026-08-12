import fs from 'node:fs/promises';
import { documentDigest, documents } from './retrieval.js';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'dekode-ai-dev';
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'global';
const MODEL_ID = process.env.EMBEDDING_MODEL || 'text-embedding-005';
const DIMENSIONS = Number(process.env.EMBEDDING_DIMENSIONS || 768);
const BATCH_SIZE = Number(process.env.EMBEDDING_BATCH_SIZE || 5);
const BATCH_DELAY_MS = Number(process.env.EMBEDDING_BATCH_DELAY_MS || 15_000);
const ACCESS_TOKEN = process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
const DEFER_REBUILD = process.env.EMBEDDING_DEFER_REBUILD === 'true';
const REBUILD_IDS = new Set(String(process.env.EMBEDDING_REBUILD_IDS || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean));
const RETRY_DELAYS_MS = [5_000, 10_000, 20_000, 30_000, 60_000];

if (!Number.isInteger(BATCH_SIZE) || BATCH_SIZE < 1 || BATCH_SIZE > 5) {
  throw new Error('EMBEDDING_BATCH_SIZE must be between 1 and 5.');
}

const endpoint = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

async function embed(contents) {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${ACCESS_TOKEN}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        instances: contents.map((content) => ({
          content,
          task_type: 'RETRIEVAL_DOCUMENT',
        })),
        parameters: {
          autoTruncate: false,
          outputDimensionality: DIMENSIONS,
        },
      }),
    });
    const payload = await response.json();
    if (response.ok) {
      const vectors = payload?.predictions?.map((prediction) => prediction?.embeddings?.values);
      if (vectors?.length !== contents.length || vectors.some((values) => values?.length !== DIMENSIONS)) {
        throw new Error('EMBEDDING_RESPONSE_INVALID');
      }
      return vectors;
    }
    if (response.status !== 429 || attempt === RETRY_DELAYS_MS.length) {
      throw new Error(`EMBEDDING_${response.status}_${payload?.error?.status || 'ERROR'}`);
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
  }
  throw new Error('EMBEDDING_RETRY_EXHAUSTED');
}

let existingVectors = new Map();
if (REBUILD_IDS.size) {
  const existingIndex = JSON.parse(await fs.readFile('document-embeddings.json', 'utf8'));
  existingVectors = new Map(existingIndex.vectors.map((item) => [item.id, item.values]));
  const unknownIds = [...REBUILD_IDS].filter((id) => !documents.some((document) => document.id === id));
  if (unknownIds.length) throw new Error(`UNKNOWN_REBUILD_IDS_${unknownIds.join('_')}`);
}

const documentsToEmbed = REBUILD_IDS.size
  ? documents.filter((document) => REBUILD_IDS.has(document.id))
  : documents;
const pendingIds = new Set(REBUILD_IDS);
if (DEFER_REBUILD) {
  documents
    .filter((document) => !existingVectors.has(document.id))
    .forEach((document) => pendingIds.add(document.id));
}
if (!DEFER_REBUILD && documentsToEmbed.length && !ACCESS_TOKEN) {
  throw new Error('GOOGLE_OAUTH_ACCESS_TOKEN is required.');
}
const rebuiltVectors = new Map();
for (let offset = 0; !DEFER_REBUILD && offset < documentsToEmbed.length; offset += BATCH_SIZE) {
  if (offset > 0) await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
  const batch = documentsToEmbed.slice(offset, offset + BATCH_SIZE);
  const embeddings = await embed(batch.map((document) => `${document.label}\n${document.text}`));
  batch.forEach((document, index) => {
    rebuiltVectors.set(document.id, embeddings[index]);
  });
}

const vectors = documents
  .filter((document) => !(DEFER_REBUILD && pendingIds.has(document.id)))
  .map((document) => ({
    id: document.id,
    values: rebuiltVectors.get(document.id) || existingVectors.get(document.id),
  }));
if (vectors.some((item) => !Array.isArray(item.values) || item.values.length !== DIMENSIONS)) {
  throw new Error('INCREMENTAL_INDEX_INCOMPLETE');
}

const index = {
  generatedAt: new Date().toISOString(),
  project: PROJECT_ID,
  location: LOCATION,
  model: MODEL_ID,
  dimensions: DIMENSIONS,
  documentCount: documents.length,
  documentDigest: documentDigest(),
  pendingDocumentIds: DEFER_REBUILD ? [...pendingIds] : [],
  vectors,
};

await fs.writeFile('document-embeddings.json', `${JSON.stringify(index)}\n`);
console.log(JSON.stringify({
  output: 'document-embeddings.json',
  model: index.model,
  dimensions: index.dimensions,
  documents: index.documentCount,
  pendingDocuments: index.pendingDocumentIds.length,
  digest: index.documentDigest,
}, null, 2));
