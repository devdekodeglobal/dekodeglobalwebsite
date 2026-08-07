import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isVertexCloudRunConfigured,
  requestVertexCloudRun,
} from '../api/_chat/vertexCloudRun.js';

const CONFIG_KEYS = [
  'VERTEX_CLOUD_RUN_URL',
  'GCP_PROJECT_NUMBER',
  'GCP_SERVICE_ACCOUNT_EMAIL',
  'GCP_WORKLOAD_IDENTITY_POOL_ID',
  'GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID',
];

function preserveEnvironment() {
  return new Map(CONFIG_KEYS.map((key) => [key, process.env[key]]));
}

function restoreEnvironment(previous) {
  for (const [key, value] of previous) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

test('enables the Vertex route only when its Cloud Run URL is configured', () => {
  const previous = preserveEnvironment();
  try {
    delete process.env.VERTEX_CLOUD_RUN_URL;
    assert.equal(isVertexCloudRunConfigured(), false);
    process.env.VERTEX_CLOUD_RUN_URL = 'https://example.run.app';
    assert.equal(isVertexCloudRunConfigured(), true);
  } finally {
    restoreEnvironment(previous);
  }
});
test('fails closed when a Vercel function has no OIDC token', async () => {
  const previous = preserveEnvironment();
  Object.assign(process.env, {
    VERTEX_CLOUD_RUN_URL: 'https://example.run.app',
    GCP_PROJECT_NUMBER: '123456789',
    GCP_SERVICE_ACCOUNT_EMAIL: 'invoker@example.iam.gserviceaccount.com',
    GCP_WORKLOAD_IDENTITY_POOL_ID: 'vercel',
    GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: 'vercel',
  });
  try {
    await assert.rejects(
      requestVertexCloudRun({ headers: {} }, { question: 'Hello' }),
      /VERCEL_OIDC_TOKEN_MISSING/,
    );
  } finally {
    restoreEnvironment(previous);
  }
});
