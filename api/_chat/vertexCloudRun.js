import { ExternalAccountClient, Impersonated } from 'google-auth-library';

const CLOUD_PLATFORM_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const TOKEN_REFRESH_MARGIN_MS = 60_000;
let cachedIdToken;

function readHeader(request, name) {
  const value = request.headers?.[name] ?? request.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : String(value || '');
}

function requiredEnvironment() {
  const values = {
    serviceUrl: String(process.env.VERTEX_CLOUD_RUN_URL || '').replace(/\/$/, ''),
    projectNumber: process.env.GCP_PROJECT_NUMBER,
    serviceAccountEmail: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    poolId: process.env.GCP_WORKLOAD_IDENTITY_POOL_ID,
    providerId: process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID,
  };
  const missing = Object.entries(values)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) throw new Error(`VERTEX_CONFIG_MISSING_${missing.join('_')}`);
  return values;
}

function tokenExpiry(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
    return Number(payload.exp || 0) * 1_000;
  } catch {
    return 0;
  }
}

async function createCloudRunIdToken(request, config) {
  const oidcToken = readHeader(request, 'x-vercel-oidc-token');
  if (!oidcToken) throw new Error('VERCEL_OIDC_TOKEN_MISSING');

  if (cachedIdToken?.subjectToken === oidcToken
    && cachedIdToken.expiresAt > Date.now() + TOKEN_REFRESH_MARGIN_MS) {
    return cachedIdToken.value;
  }

  const externalClient = ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience: `//iam.googleapis.com/projects/${config.projectNumber}/locations/global/workloadIdentityPools/${config.poolId}/providers/${config.providerId}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${config.serviceAccountEmail}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: async () => oidcToken,
    },
  });
  if (!externalClient) throw new Error('VERCEL_OIDC_CLIENT_INVALID');

  const impersonatedClient = new Impersonated({
    sourceClient: externalClient,
    targetPrincipal: config.serviceAccountEmail,
    lifetime: 600,
    delegates: [],
    targetScopes: [CLOUD_PLATFORM_SCOPE],
  });
  const idToken = await impersonatedClient.fetchIdToken(config.serviceUrl);
  cachedIdToken = {
    value: idToken,
    subjectToken: oidcToken,
    expiresAt: tokenExpiry(idToken),
  };
  return idToken;
}

export function isVertexCloudRunConfigured() {
  return Boolean(process.env.VERTEX_CLOUD_RUN_URL);
}

export async function requestVertexCloudRun(request, payload) {
  const config = requiredEnvironment();
  const idToken = await createCloudRunIdToken(request, config);
  const response = await fetch(`${config.serviceUrl}/chat`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${idToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(55_000),
  });
  const result = await response.json().catch(() => ({}));
  const finishReason = String(result.finishReason || 'STOP');
  if (!response.ok
    || !result.answer
    || !result.intent
    || !result.action
    || result.complete === false
    || finishReason !== 'STOP') {
    throw new Error(`VERTEX_CLOUD_RUN_${response.status}_${result.error || 'INVALID_RESPONSE'}`);
  }
  return result;
}
