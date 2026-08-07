# DEKODE GCP and Vertex AI Milestone Runbook

Last updated: 2026-08-07
Environment: Development sandbox
Status: First private Cloud Run + Vertex AI milestone deployed and tested

## 1. Purpose

This runbook records how DEKODE created a safe Google Cloud development sandbox,
enabled Vertex AI, deployed a private Cloud Run chat endpoint, and verified that
the endpoint can answer from approved DEKODE knowledge without a Gemini API key.

Use it when repeating the setup for staging or production. Never copy OAuth
verification codes, access tokens, payment details, refresh tokens, API keys, or
service-account JSON keys into this document.

## 2. Target Architecture

```text
Authenticated caller
        |
        v
Private Cloud Run service: dekode-vertex-chat
        |
        | runs as dekode-chat-runtime
        v
Approved DEKODE knowledge retrieval
        |
        v
Vertex AI Gemini
```

The development endpoint is deliberately private. The public website has not
been switched from Vercel to this endpoint yet.

## 3. Resources Created

| Resource | Value |
| --- | --- |
| Google account | `yuvraj.sharma@dekodeglobal.com` |
| Organization | `dekodeglobal.com` |
| Project name | `DEKODE AI Development` |
| Project ID | `dekode-ai-dev` |
| Project number | `739875238095` |
| Billing mode | Google Cloud Free Trial |
| Trial observed | INR 28,694 credit, 90 days |
| Trial expiry observed | 2026-11-06 |
| Monthly alert budget | INR 500 |
| Budget name | `DEKODE AI Dev - INR 500 monthly alert` |
| Cloud Run region | `asia-south1` |
| Vertex AI location | `global` |
| Gemini test model | `gemini-2.5-flash` |
| Cloud Run service | `dekode-vertex-chat` |
| Runtime service account | `dekode-chat-runtime@dekode-ai-dev.iam.gserviceaccount.com` |
| Build identity | `739875238095-compute@developer.gserviceaccount.com` |

## 4. Safety Rules Used

1. Use a company-owned Google account, not a personal Gmail account.
2. Keep the project separate from the existing Calendar project.
3. Stay in Free Trial mode.
4. Do not click `Activate`, `Activate full account`, `Upgrade`, `Pay as you go`,
   or `Prepay` during sandbox work.
5. Use a project-scoped budget alert before deploying workloads.
6. Never put Google credentials or Gemini keys in React or `VITE_*` variables.
7. Do not create service-account JSON keys.
8. Use separate service identities for build-time and runtime permissions.
9. Keep the first Cloud Run endpoint private.
10. Grant predefined least-privilege roles instead of broad `Editor` access.

The Free Trial required a payment method for identity verification. Google can
place a temporary authorization hold, but the account is not billed while it
remains a Free Trial account. A budget alert is not a hard spending cap.

## 5. Step-by-Step Setup

### Step 1: Sign in with the company account

Open Google Cloud Console and choose:

```text
yuvraj.sharma@dekodeglobal.com
```

Why: company resources, billing, logs, and IAM must not depend on a personal
account.

### Step 2: Start and verify the Free Trial

Complete Google's Free Trial verification. After returning to the Console,
confirm that the home page says `You're in Free Trial` and shows remaining
credit and days.

Do not activate a full paid account. For this setup, the Console showed INR 0
used and a 2026-11-06 expiration date.

### Step 3: Create an isolated development project

Create the following project under the `dekodeglobal.com` organization:

```text
Project name: DEKODE AI Development
Project ID:   dekode-ai-dev
Parent:       dekodeglobal.com
```

Why: development AI usage, IAM, quotas, logs, and costs remain isolated from
the production website and the existing `dekode-website-calendar` project.

### Step 4: Open and authorize Cloud Shell

Open Cloud Shell from the Console. Authorize it to use the signed-in company
account for Google Cloud API calls.

If `gcloud auth list` reports no credentialed accounts, run:

```bash
gcloud auth login yuvraj.sharma@dekodeglobal.com
```

Complete the Google sign-in flow yourself. Never record the verification code.

Verify the active environment:

```bash
gcloud auth list --filter='status:ACTIVE' --format='value(account)'
gcloud config get-value project
gcloud billing projects describe dekode-ai-dev \
  --format='yaml(billingAccountName,billingEnabled,projectId)'
```

Expected essentials:

```text
Account:        yuvraj.sharma@dekodeglobal.com
Project:        dekode-ai-dev
Billing enabled: true
```

### Step 5: Enable only required APIs

```bash
gcloud services enable \
  aiplatform.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  --project=dekode-ai-dev
```

Purpose of each API:

| API | Purpose |
| --- | --- |
| Vertex AI | Gemini model inference |
| Cloud Run | Private serverless chat API |
| Artifact Registry | Stores built container images |
| Cloud Build | Builds the Node service from source |
| Secret Manager | Later stores Calendar and proposal secrets |

The budget-management flow also required:

```text
billingbudgets.googleapis.com
```

### Step 6: Create the project-scoped budget alert

```bash
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name='DEKODE AI Dev - INR 500 monthly alert' \
  --budget-amount=500INR \
  --calendar-period=month \
  --filter-projects=projects/dekode-ai-dev \
  --threshold-rule=percent=0.50 \
  --threshold-rule=percent=0.90 \
  --threshold-rule=percent=1.00
```

Verified result:

```text
Currency: INR
Amount: 500
Period: MONTH
Project: projects/739875238095
Thresholds: 0.5, 0.9, 1.0 current spend
```

Why: the budget makes sandbox usage visible early. It does not automatically
stop usage and should not be treated as a hard cap.

### Step 7: Create the runtime service identity

```bash
gcloud iam service-accounts create dekode-chat-runtime \
  --project=dekode-ai-dev \
  --display-name='DEKODE Chat Runtime' \
  --description='Cloud Run identity for the grounded DEKODE website chat API'

gcloud projects add-iam-policy-binding dekode-ai-dev \
  --member='serviceAccount:dekode-chat-runtime@dekode-ai-dev.iam.gserviceaccount.com' \
  --role='roles/aiplatform.user' \
  --condition=None
```

Why: Cloud Run obtains short-lived Google credentials automatically and calls
Vertex AI as this identity. No API key or downloaded JSON key is required.

Verified security state:

```text
Runtime role: roles/aiplatform.user
User-managed service-account keys: none
```

### Step 8: Prepare the disposable prototype

The website repository had unrelated uncommitted homepage work, so the proof
was prepared outside that repository at:

```text
C:\Users\abc\Desktop\website\gcp-vertex-milestone
```

Files:

```text
package.json
server.js
companyKnowledge.json
```

The prototype:

- uses Node's built-in HTTP server;
- exposes `GET /health` and `POST /chat`;
- retrieves relevant approved DEKODE knowledge;
- obtains a short-lived access token from the Cloud Run metadata service;
- calls the Vertex AI REST `generateContent` endpoint;
- contains no credentials;
- refuses questions when keyword retrieval finds no evidence.

The package passed a local syntax and health check before upload.

### Step 9: Upload source to Cloud Shell

The prototype was compressed and uploaded to the Cloud Shell home directory,
then unpacked into:

```text
/home/yuvraj_sharma/dekode-vertex-chat
```

No `.env`, credential file, OAuth code, or API key was included.

### Step 10: Resolve the first source-build permission failure

The initial deployment failed with `storage.objects.get denied` for:

```text
739875238095-compute@developer.gserviceaccount.com
```

Reason: new Google Cloud projects use the Compute Engine default service account
for source builds, and organization policy correctly avoids automatically giving
it the broad `Editor` role.

Google's documented least-privilege fix is Cloud Run Builder:

```bash
gcloud projects add-iam-policy-binding dekode-ai-dev \
  --member='serviceAccount:739875238095-compute@developer.gserviceaccount.com' \
  --role='roles/run.builder' \
  --condition=None
```

This role permits source reading, Artifact Registry image writes, and build-log
writes. It does not grant Vertex AI or billing access.

### Step 11: Deploy the private Cloud Run service

From `/home/yuvraj_sharma/dekode-vertex-chat`:

```bash
gcloud run deploy dekode-vertex-chat \
  --source . \
  --project=dekode-ai-dev \
  --region=asia-south1 \
  --service-account=dekode-chat-runtime@dekode-ai-dev.iam.gserviceaccount.com \
  --no-allow-unauthenticated \
  --set-env-vars=GOOGLE_CLOUD_PROJECT=dekode-ai-dev,GOOGLE_CLOUD_LOCATION=global,GEMINI_MODEL=gemini-2.5-flash \
  --min=0 \
  --max=1 \
  --memory=256Mi \
  --cpu=1 \
  --concurrency=20 \
  --timeout=60 \
  --quiet
```

Why these settings:

- `--no-allow-unauthenticated`: keeps the proof private.
- `--min=0`: scales to zero when idle.
- `--max=1`: limits sandbox cost and blast radius.
- dedicated runtime service account: isolates model permissions.
- Mumbai Cloud Run region: close to the initial India-based development team.
- global Vertex endpoint: broad Gemini model availability for the first test.

## 6. Verification Results

### Private IAM policy

`gcloud run services get-iam-policy` returned no public binding. A request
without an identity token returned:

```text
HTTP 403
```

### Health endpoint

Authenticated `GET /health` returned:

```json
{
  "ok": true,
  "service": "dekode-vertex-chat",
  "project": "dekode-ai-dev",
  "location": "global",
  "model": "gemini-2.5-flash"
}
```

### Grounded service question

Question:

```text
What AI services does DEKODE offer?
```

Result: Vertex AI returned a concise answer based on the retrieved `DEKODE
services` source. This confirms the complete path:

```text
Cloud Run -> runtime service account -> Vertex AI -> generated answer
```

### Unsupported question

Question:

```text
quantum banana weather
```

Result: deterministic refusal with no sources. Vertex AI was not given unrelated
company evidence.

### Known retrieval limitation found

Question:

```text
Where are DEKODE offices located?
```

The keyword retriever did not match `offices located` to the stored `locations`
wording and returned the safe refusal. This is not a Vertex AI failure. It is a
known limitation of exact-word retrieval and is evidence for the next semantic
RAG phase.

## 7. What Has Not Been Changed

- The public Vercel website still uses its existing `/api/chat` flow.
- `GEMINI_API_KEY` has not been removed from Vercel.
- Calendar OAuth credentials remain in their existing environment.
- The Cloud Run endpoint is not public and is not called by browser JavaScript.
- No production project or production service has been created.
- No repository branch, commit, push, or pull request was created for this proof.
- No paid billing activation was performed.

## 8. Next Steps

1. Build a permanent evaluation set of 30-50 DEKODE questions.
2. Improve retrieval with aliases and then semantic embeddings/vector search.
3. Add source IDs and confidence thresholds to every answer.
4. Create a dedicated implementation branch after preserving the dirty homepage
   work.
5. Move the reusable Cloud Run service into the repository with tests.
6. Choose secure website-to-Cloud-Run authentication before connecting Vercel.
7. Store Calendar and proposal secrets in Secret Manager when those APIs move.
8. Add Cloud Logging metrics for errors, latency, token usage, and refusals.
9. Run old and new chat against the same evaluation set.
10. Cut over only after accuracy, security, latency, and cost checks pass.

## 9. Useful Audit Commands

```bash
# Confirm project and account
gcloud config get-value project
gcloud auth list

# List enabled APIs
gcloud services list --enabled --project=dekode-ai-dev

# Audit runtime roles
gcloud projects get-iam-policy dekode-ai-dev \
  --flatten='bindings[].members' \
  --filter='bindings.members:dekode-chat-runtime@dekode-ai-dev.iam.gserviceaccount.com' \
  --format='value(bindings.role)'

# Confirm no user-managed runtime keys
gcloud iam service-accounts keys list \
  --iam-account=dekode-chat-runtime@dekode-ai-dev.iam.gserviceaccount.com \
  --filter='keyType=USER_MANAGED'

# Describe the private service
gcloud run services describe dekode-vertex-chat \
  --region=asia-south1 \
  --project=dekode-ai-dev

# Read service IAM policy
gcloud run services get-iam-policy dekode-vertex-chat \
  --region=asia-south1 \
  --project=dekode-ai-dev

# Read recent application logs
gcloud run services logs read dekode-vertex-chat \
  --region=asia-south1 \
  --project=dekode-ai-dev \
  --limit=50
```

## 10. Cloud Shell Testing Guide

Use this section when you want to verify the private Cloud Run + Vertex AI
prototype from Google Cloud Shell.

### 10.1 Confirm Cloud Shell Context

When Cloud Shell shows a prompt like this:

```bash
yuvraj_sharma@cloudshell:~/dekode-vertex-chat (dekode-ai-dev)$
```

it means:

- You are inside Google Cloud Shell.
- The current folder is `~/dekode-vertex-chat`.
- The active GCP project is `dekode-ai-dev`.

Still confirm the active account and project before testing:

```bash
gcloud auth list
gcloud config get-value project
```

Expected project:

```text
dekode-ai-dev
```

If the project is not correct, set it:

```bash
gcloud config set project dekode-ai-dev
```

### 10.2 Get the Cloud Run Service URL

Run:

```bash
gcloud run services describe dekode-vertex-chat \
  --region asia-south1 \
  --format="value(status.url)"
```

This returns the real private Cloud Run URL, for example:

```text
https://dekode-vertex-chat-ung7qzfv5a-el.a.run.app
```

Do not run commands with the literal placeholder `YOUR_SERVICE_URL`.
That placeholder must be replaced by the actual URL. If you run this:

```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  YOUR_SERVICE_URL/health
```

Cloud Shell will fail with:

```text
curl: (6) Could not resolve host: YOUR_SERVICE_URL
```

because `YOUR_SERVICE_URL` is not a real host.

Optional safer approach: store the URL in a shell variable:

```bash
SERVICE_URL=$(gcloud run services describe dekode-vertex-chat --region asia-south1 --format="value(status.url)")
echo $SERVICE_URL
```

### 10.3 Test Service Health

Run:

```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  "$SERVICE_URL/health"
```

Expected result:

```json
{"ok":true}
```

This checks:

- The Cloud Run service exists.
- The service is reachable from your authenticated Google account.
- Private authentication is working.
- The backend server starts correctly.
- The service is not publicly open.

### 10.4 Test Chat Route

The `/chat` endpoint expects the request field to be `question`, not `message`.

This will fail:

```bash
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{"message":"What AI services does DEKODE offer?"}' \
  "$SERVICE_URL/chat"
```

Expected failure:

```json
{"ok":false,"error":"A question is required."}
```

Use this correct request:

```bash
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{"question":"What AI services does DEKODE offer?"}' \
  "$SERVICE_URL/chat"
```

This checks:

- The backend accepts a user question.
- The backend searches DEKODE knowledge.
- The backend calls Vertex AI Gemini.
- The backend returns an answer.

### 10.5 Test Booking Intent

Run:

```bash
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{"question":"I want to book a meeting with DEKODE"}' \
  "$SERVICE_URL/chat"
```

Expected behavior:

- The answer should recognize meeting or booking intent.
- It should not answer like a generic company-info query.
- In the future website integration, this intent should open or guide the
  calendar booking experience.

### 10.6 Test Out-of-Scope Refusal

Run:

```bash
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{"question":"Tell me about quantum banana weather"}' \
  "$SERVICE_URL/chat"
```

Expected behavior:

- The service should politely refuse or redirect.
- It should explain that it only answers DEKODE-related questions.
- It should not invent unrelated information.

### 10.7 What This Proves And What It Does Not Prove

These Cloud Shell checks prove that the private GCP prototype works:

- Cloud Run is deployed.
- Authentication works.
- Vertex AI Gemini can be called from the backend.
- DEKODE-related questions can be answered through the prototype service.

These checks do not prove that the live website is using the GCP service yet.
The current website still needs a secure integration step where Vercel calls the
private Cloud Run service.

Known limitation:

- Vertex AI hosting does not automatically make the chatbot more accurate.
- Accuracy still depends on retrieval quality, company knowledge coverage,
  prompts, intent detection, and evaluation tests.
- Some wording may fail until retrieval is improved with aliases, embeddings,
  or a stronger evaluation set.

## 11. Production Checklist

Do not treat this development proof as production-ready until all items pass:

- [ ] Separate production GCP project and production budget
- [ ] Approved region and data-residency decision
- [ ] Evaluation suite and acceptance threshold
- [ ] Semantic retrieval and low-confidence refusal
- [ ] Rate limiting and abuse controls
- [ ] Structured logs without sensitive prompt leakage
- [ ] Secret Manager migration
- [ ] CI/CD through Workload Identity Federation
- [ ] Staging and rollback process
- [ ] Website-to-backend authentication design
- [ ] Team review and production approval

## 12. Phase 2: Evaluation Suite And Semantic Retrieval

### 12.1 Date And Isolation

Phase 2 began on 7 August 2026.

The work was placed on the dedicated Git branch:

```text
vertex-ai-integration
```

A linked worktree was created at:

```text
C:\Users\abc\Desktop\website\dekodeglobalwebsite-vertex-evaluation
```

This was necessary because the existing `homepage-content-hierarchy-redesign`
worktree contains uncommitted website changes. The linked worktree keeps the AI
prototype changes separate without moving, stashing, or altering that work.

### 12.2 Problem Being Solved

The milestone-one retriever only counted exact shared keywords. This caused
several accuracy problems:

- A visitor could ask for an office while the knowledge used the word location.
- A small typing mistake such as `contat your teem` produced no result.
- A delivery-process paraphrase could retrieve unrelated support text.
- An unrelated question could match a company document because of one accidental
  word, such as `Delhi` in a weather question.
- Broad documents such as `all services` made source selection imprecise.

Vertex AI Gemini still needs the correct evidence. A stronger generation model
cannot repair missing or incorrectly retrieved context by itself.

### 12.3 Architecture Decision

The retriever now uses a hybrid strategy:

1. Preserve lexical matching for exact service names, contact details, legal
   terms, and aliases.
2. Generate document embeddings with `gemini-embedding-001` using the
   `RETRIEVAL_DOCUMENT` task type.
3. Generate visitor-query embeddings with the `RETRIEVAL_QUERY` task type.
4. Rank documents with an 82% semantic and 18% lexical blended score.
5. Require semantic confidence of at least `0.55`, unless a strong lexical match
   exists.
6. Return no evidence when confidence is low, causing the existing grounded
   refusal instead of a guessed answer.
7. Fall back to lexical retrieval if the embedding API is temporarily
   unavailable.

Google recommends using `RETRIEVAL_DOCUMENT` for corpus content and
`RETRIEVAL_QUERY` for user searches. The selected model supports up to 3072
dimensions; this prototype requests 768 dimensions to reduce memory and response
size while the corpus is small.

Official references:

- https://docs.cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings
- https://docs.cloud.google.com/vertex-ai/generative-ai/docs/embeddings/task-types

No vector database was added. The approved public knowledge corpus is currently
small enough to keep the document vectors in Cloud Run memory. Reassess this
decision if the corpus grows substantially or needs incremental indexing.

### 12.4 Retrieval Document Design

The original broad documents were divided into stable, focused records:

- Company overview and company values
- Industries and technology platforms
- Contact and office locations
- One document per service
- One document per solution area
- One document per delivery stage
- One document per approved case study
- Separate privacy and terms documents
- One document per FAQ

Each record has a stable source ID. This makes evaluation deterministic and lets
the chat response cite the exact evidence it used.

### 12.5 Evaluation Suite

`evaluation-cases.json` contains 34 version-controlled cases covering:

- Direct company questions
- Natural-language paraphrases
- AI, web, mobile, cloud, automation, and integration services
- Delivery methodology
- Food manufacturing and primary school case studies
- Contact, meeting, location, privacy, and terms questions
- A deliberate spelling-error case
- Unknown pricing, where the assistant must not invent a number
- Weather, recipe, politics, medical, and random out-of-scope prompts

Each case declares whether the expected behavior is `answer` or `refuse` and the
acceptable stable source IDs or source prefixes.

`evaluate.mjs` runs the lexical baseline locally. When `SERVICE_URL` and
`AUTH_TOKEN` are supplied, it also calls the private Cloud Run diagnostic route
and reports hybrid retrieval results. It writes both machine-readable JSON and a
Markdown report.

### 12.6 Local Baseline And Verification

Commands:

```bash
npm test
npm run evaluate
node --check server.js
node --check retrieval.js
node --check evaluate.mjs
```

Results before cloud semantic evaluation:

- Retrieval unit tests: 4 passed, 0 failed
- Evaluation cases: 34
- Lexical baseline: 29/34 passed, 85.3%
- Local `/health`: HTTP 200
- Reported generation model: `gemini-2.5-flash`
- Reported embedding model: `gemini-embedding-001`
- Requested embedding dimensions: 768

The Node version on this workstation does not support the newer
`--test-isolation=none` flag, and the sandbox blocks the test runner's default
child-process isolation with `spawn EPERM`. The test script therefore executes
the `node:test` file directly in-process. The same five assertions run and pass.

### 12.7 Files Added Or Changed

```text
gcp/vertex-chat/retrieval.js
gcp/vertex-chat/retrieval.test.mjs
gcp/vertex-chat/evaluation-cases.json
gcp/vertex-chat/evaluate.mjs
gcp/vertex-chat/server.js
gcp/vertex-chat/package.json
gcp/vertex-chat/GCP_VERTEX_AI_MILESTONE_RUNBOOK.md
```

Cloud deployment, threshold calibration, and the final hybrid score are recorded
in the next subsection after the private service is redeployed and evaluated.

### 12.8 First Cloud Evaluation And Quota Failure

The first Phase 2 deployment created revision:

```text
dekode-vertex-chat-00002-g72
```

The revision served 100% of traffic and remained private. Authenticated
`/health` returned HTTP 200 and confirmed:

```text
model: gemini-2.5-flash
embeddingModel: gemini-embedding-001
embeddingDimensions: 768
```

The first 34-case cloud evaluation reported:

- Lexical: 29/34, 85.3%
- Hybrid: 29/34, 85.3%

This was not accepted as a semantic result. Cloud Run logs showed that semantic
retrieval had fallen back on every request:

```text
EMBEDDING_429_RESOURCE_EXHAUSTED
```

Cause: the cold-start index used `Promise.all` and sent one embedding request for
every knowledge document simultaneously. `gemini-embedding-001` accepts one
input text per REST request, and the burst exceeded the development project's
shared embedding quota.

Fix:

- Build the in-memory document index sequentially instead of as a burst.
- Generate the query vector after the cold index is ready.
- Retry only HTTP 429 responses with bounded delays of 0.5, 1, 2, 4, and 8
  seconds.
- Preserve lexical fallback after retries are exhausted.

The evaluation cases and expected outcomes were not changed after observing the
failure. This prevents tuning the test set to make the implementation look
better.

### 12.9 Sequential Retry Result

The quota-safe implementation was deployed as revision:

```text
dekode-vertex-chat-00003-m7q
```

The simultaneous request burst was removed, but the first cold index build
exceeded the existing 60-second Cloud Run timeout and returned HTTP 504. Waiting
for the container and retrying did not produce a warm index because the build
continued to exhaust the embedding allocation before it could be cached.

The next diagnostic step is a single-input REST probe. Its purpose is to capture
the complete Vertex AI error payload and distinguish among rate quota, model
availability, and project allocation problems before changing the architecture
or model.

### 12.10 Exact Quota Diagnosis And Trial-Safe Model Choice

A direct single-input request to `gemini-embedding-001` returned:

```text
Quota exceeded for
aiplatform.googleapis.com/online_prediction_requests_per_base_model
with base model: gemini-embedding.
```

This proves the problem is the project's base-model allocation, not the request
body, Cloud Run identity, Vertex AI API, or request concurrency. Google suggests
submitting a quota increase request. No quota increase, billing activation, or
account upgrade was requested because this milestone must remain within the free
trial controls.

A second single-input probe using Vertex AI `text-embedding-005` succeeded and
returned a 768-dimensional vector with no truncation. This model is suitable for
the current English public knowledge corpus and supports the same asymmetric
retrieval pattern:

- `RETRIEVAL_DOCUMENT` for approved knowledge
- `RETRIEVAL_QUERY` for visitor questions

Final development choice:

- Conversational answer generation: `gemini-2.5-flash`
- Semantic retrieval: `text-embedding-005`
- Requested embedding dimensions: 768
- Runtime fallback: lexical retrieval

`gemini-embedding-001` can be reconsidered after a quota increase is approved.

### 12.11 Cold-Start Batch Indexing

Revision `dekode-vertex-chat-00004-l47` used `text-embedding-005` successfully,
but the first request still returned HTTP 504 because embedding every document
in an individual request exceeded the 60-second service timeout.

The timeout was deliberately not increased. Instead, the document indexer was
changed to send at most five knowledge texts per Vertex prediction request,
which is supported by `text-embedding-005`. The current corpus therefore needs
approximately seven document requests instead of one request per document.

New control:

```text
EMBEDDING_BATCH_SIZE=5
```

The query remains a single `RETRIEVAL_QUERY` input. Batch size and vector count
are validated before an index is accepted. A unit test verifies that no batch
exceeds five documents and that every document is indexed exactly once.

### 12.12 First Successful Semantic Evaluation

Revision `dekode-vertex-chat-00005-xdm` completed the authenticated 34-case
evaluation against the private Cloud Run endpoint:

- Lexical baseline: 29/34, 85.3%
- Hybrid endpoint: 33/34, 97.1%
- Improvement: four additional passing cases, or 11.8 percentage points

Semantic retrieval recovered the typo-based contact question and correctly
rejected weather and political questions that lexical matching treated as
relevant. The only remaining miss asked how DEKODE takes a project from an idea
through ongoing support. The corpus had five separate process-stage documents,
but no single document represented the complete lifecycle.

Cloud logs also recorded occasional 429 responses during the long evaluation.
Those requests used the designed lexical fallback and still returned HTTP 200.
The 97.1% score therefore represents the production hybrid endpoint, including
its fallback behavior, rather than an embedding-only benchmark.

### 12.13 Delivery Lifecycle Fix

A stable `process-overview` document was added. It combines Discover, Design,
Build, Secure, and Run & Optimise into one approved retrieval unit and explicitly
describes the path from idea to ongoing support. The expected evaluation case
was not changed.

Local verification after the change:

- Lexical baseline: 30/34, 88.2%
- Unit tests: 5/5 passing
- `git diff --check`: passing

Revision `dekode-vertex-chat-00006-l84` deployed the updated corpus and served
100% of traffic.

### 12.14 Cold-Start Demo Fix

The first targeted request to revision `00006-l84` returned HTTP 504. A new
scale-to-zero instance needed longer than the original 60-second request timeout
to create the in-memory semantic index. Keeping a minimum instance active would
reduce latency but would also create continuous cost, so it was not enabled.

Cloud Run request timeout was changed to 300 seconds, producing revision:

```text
dekode-vertex-chat-00007-cch
```

This does not activate billing, increase quota, or keep an instance running.
The service remains `min instances = 0`, `max instances = 1`, private, and
protected by Cloud Run IAM.

The previously failing delivery case was then run by itself to conserve trial
credits. It passed both lexical and hybrid checks, with these top sources:

```text
process-overview, faq-3, process-build, process-discover, process-design
```

An unauthenticated health request returned HTTP 403. An authenticated health
request returned HTTP 200 and confirmed:

```text
generation model: gemini-2.5-flash
embedding model: text-embedding-005
embedding dimensions: 768
embedding batch size: 5
```

The complete 34-case suite was deliberately not rerun after this focused fix to
avoid unnecessary free-trial usage. The defensible result is therefore:

- Full pre-fix hybrid suite: 33/34, 97.1%
- Formerly failing case after fix: PASS
- No claim of a newly measured 34/34 full-suite score

### 12.15 Low-Cost Evaluation And Meeting Demo

`evaluate.mjs` accepts a comma-separated `CASE_IDS` filter. Filtered runs write
`evaluation-smoke-report.json` and `evaluation-smoke-report.md`, leaving the full
evaluation evidence untouched.

Example authenticated smoke check from Cloud Shell:

```bash
AUTH_TOKEN="$(gcloud auth print-identity-token)" \
SERVICE_URL="https://dekode-vertex-chat-739875238095.asia-south1.run.app" \
CASE_IDS="delivery,contact-typo,weather" \
npm run evaluate
```

For a meeting, warm the private service a few minutes before the live demo and
show these three behaviors:

1. Delivery paraphrase retrieves the complete DEKODE methodology.
2. Misspelled contact wording retrieves approved contact information.
3. An unrelated weather request returns no DEKODE sources.

The service URL is not a public demo page. Requests require an identity token;
the website-to-service authentication layer remains a later integration task.

## 13. Vercel Website Integration

### 13.1 Final Architecture

The public website keeps its existing browser contract:

```text
Visitor -> Vercel /api/chat -> private Cloud Run -> Vertex AI
```

The browser never receives a Google credential or Cloud Run identity token.
The Vercel function exchanges its short-lived platform OIDC token through GCP
Workload Identity Federation, impersonates a dedicated invocation-only service
account, and sends a short-lived ID token to Cloud Run.

Cloud Run remains private. Making it unauthenticated was rejected because a
public caller could consume the free-trial Vertex quota directly.

### 13.2 Least-Privilege Identities

| Resource | Value |
| --- | --- |
| Workload identity pool | `vercel` |
| OIDC provider | `vercel` |
| Trusted issuer | `https://oidc.vercel.com/yuuvi` |
| Allowed audience | `https://vercel.com/yuuvi` |
| Vercel invoker | `vercel-chat-invoker@dekode-ai-dev.iam.gserviceaccount.com` |
| Cloud Run runtime | `dekode-chat-runtime@dekode-ai-dev.iam.gserviceaccount.com` |

The exact Vercel subjects for `dekodeglobalwebsite` Preview and Production have
`roles/iam.workloadIdentityUser` on the invoker identity. The invoker has
`roles/run.invoker` only on `dekode-vertex-chat` and can mint short-lived tokens
for itself. It has no Vertex AI project role. The Cloud Run runtime remains the
identity with `roles/aiplatform.user`.

### 13.3 Vercel Environment

The following non-secret values are configured for Preview and Production:

```text
VERTEX_CLOUD_RUN_URL
GCP_PROJECT_NUMBER
GCP_SERVICE_ACCOUNT_EMAIL
GCP_WORKLOAD_IDENTITY_POOL_ID
GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID
```

No Google service-account key was created or stored in Vercel.

### 13.4 Website Adapter And Fallback

`api/chat.js` keeps deterministic handling for gibberish, out-of-scope queries,
knowledge gaps, contact details, locations, privacy, and terms. Other grounded
company questions use the Vertex Cloud Run adapter first. If that request is
temporarily unavailable, the existing server-side Gemini-key path remains a
controlled fallback when its environment variables are present.

The adapter forwards the six most recent bounded conversation messages. Cloud
Run includes that history before the current grounded question, while retrieved
DEKODE knowledge remains the only approved factual source.

### 13.5 Persistent Semantic Index

The original scale-to-zero service embedded every document on the first request.
That caused 60-second timeouts and repeated quota usage. The final design builds
the approved corpus index once with `build-embedding-index.mjs` and deploys the
result as `document-embeddings.json`.

Current index evidence:

```text
model: text-embedding-005
dimensions: 768
documents: 36
digest: 4602adeed7864996e97ff5ae2f1d946fc7c5eb28607fc56ab6c55a701d4ab3df
```

At startup, Cloud Run verifies the model, dimensions, document IDs, and corpus
digest. A mismatch fails closed. Revision `dekode-vertex-chat-00008-k4d` reports
`documentIndex: precomputed` and completed the focused delivery retrieval within
the normal 60-second request timeout.

### 13.6 Verification Notes

- Root Vercel build: passing
- Root lint: passing with six pre-existing unused-import warnings
- Focused website chat/knowledge tests: 31/31 passing
- Vertex retrieval tests: 6/6 passing
- Full inherited suite: 83/90 passing
- Seven failures are in proposal snapshots/security expectations changed by the
  latest upstream proposal commits; no Vertex integration file is involved

The first CLI preview build was blocked by Vercel because upstream `HEAD` used a
teammate email not linked to the Vercel Git account. The integration commit uses
the repository's configured Yuvraj Git identity before the final redeploy.

### 13.7 Public Preview Evidence

Final public Preview:
`https://dekodeglobalwebsite-7m7efj4tl-yuuvi.vercel.app`

Vercel deployment: `dpl_CwP9Pt5W4Qs7bNagMy4G9vEWkKRc` (READY)

The final live check asked:
`How do you take a project from idea to ongoing support?`

The response identified `provider: vertex-ai`, `model: gemini-2.5-flash`, and
`retrievalMode: hybrid`. It answered with DEKODE's five stages and cited the
process overview, delivery FAQ, and relevant stage documents. A narrow intent
rule was added after the first preview revealed that natural "How do you..."
delivery phrasing could otherwise be mistaken for an external question.

Only focused demo checks were run after deployment to conserve free-trial
credits. The historical full-suite result remains 33/34; it was not rerun and
must not be presented as a newly measured 34/34.
