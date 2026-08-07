import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createHybridRetriever,
  documentDigest,
  documents,
  retrieveLexical,
} from './retrieval.js';

test('document ids are stable and unique', () => {
  assert.equal(new Set(documents.map((document) => document.id)).size, documents.length);
});

test('lexical aliases find location and meeting documents', () => {
  assert.equal(retrieveLexical('Where are your offices?')[0].id, 'locations');
  assert.equal(retrieveLexical('Can I schedule a discovery call?')[0].id, 'contact');
});

test('hybrid retrieval can recover a semantic paraphrase with no lexical match', async () => {
  const target = documents.find((document) => document.id === 'contact');
  const embed = async (text, task) => {
    if (task === 'RETRIEVAL_QUERY') return [1, 0];
    return text === `${target.label}\n${target.text}` ? [0.9, 0.1] : [0.1, 0.9];
  };
  const retrieve = createHybridRetriever({ embed, semanticThreshold: 0.5 });
  const matches = await retrieve('contat your teem');
  assert.equal(matches[0].id, 'contact');
  assert.equal(matches[0].retrievalMode, 'hybrid');
});

test('embedding failure falls back to lexical retrieval', async () => {
  const retrieve = createHybridRetriever({ embed: async () => { throw new Error('offline'); } });
  const matches = await retrieve('privacy policy');
  assert.equal(matches[0].id, 'legal-privacy');
  assert.equal(matches[0].retrievalMode, 'lexical-fallback');
});

test('document index uses bounded batches when batch embedding is available', async () => {
  const batchSizes = [];
  const embedMany = async (contents) => {
    batchSizes.push(contents.length);
    return contents.map((_, index) => index === 0 ? [0.9, 0.1] : [0.1, 0.9]);
  };
  const retrieve = createHybridRetriever({
    embed: async () => [1, 0],
    embedMany,
    semanticThreshold: 0,
    batchSize: 5,
  });
  await retrieve('company');
  assert.ok(batchSizes.every((size) => size <= 5));
  assert.equal(batchSizes.reduce((total, size) => total + size, 0), documents.length);
});

test('precomputed document embeddings avoid rebuilding the corpus at runtime', async () => {
  let batchCalls = 0;
  const precomputedIndex = {
    documentDigest: documentDigest(),
    vectors: documents.map((document, index) => ({
      id: document.id,
      values: [index === 0 ? 1 : 0, index === 0 ? 0 : 1],
    })),
  };
  const retrieve = createHybridRetriever({
    precomputedIndex,
    embed: async () => [1, 0],
    embedMany: async () => {
      batchCalls += 1;
      return [];
    },
    semanticThreshold: 0.1,
  });

  const matches = await retrieve('What does DEKODE do?');
  assert.equal(batchCalls, 0);
  assert.equal(matches[0].id, 'company-about');
});

test('precomputed indexes lazily embed only newly added corpus documents', async () => {
  const missing = documents.slice(-2);
  const batchSizes = [];
  const precomputedIndex = {
    documentDigest: documentDigest(),
    vectors: documents.slice(0, -2).map((document) => ({ id: document.id, values: [0, 1] })),
  };
  const retrieve = createHybridRetriever({
    precomputedIndex,
    embed: async () => [1, 0],
    embedMany: async (contents) => {
      batchSizes.push(contents.length);
      return contents.map(() => [1, 0]);
    },
    semanticThreshold: 0,
  });

  await retrieve(missing[0].label);
  assert.deepEqual(batchSizes, [2]);
});
