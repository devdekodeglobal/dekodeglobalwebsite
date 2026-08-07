# DEKODE Vertex AI RAG Meeting Evidence

## What Is Working

- Private Cloud Run service in `asia-south1`
- Gemini 2.5 Flash for conversational generation
- Vertex AI `text-embedding-005` for semantic retrieval
- Approved DEKODE knowledge split into stable, source-labelled documents
- Hybrid semantic and lexical ranking with lexical fallback
- Retrieval filters that return no DEKODE sources for unrelated questions
- IAM protection: unauthenticated health request returns HTTP 403

## Measured Evidence

| Check | Result |
| --- | --- |
| Lexical baseline, full 34 cases | 29/34 (85.3%) |
| Hybrid endpoint, full 34 cases | 33/34 (97.1%) |
| Previously failing delivery case after corpus fix | PASS |
| Local unit tests | 5/5 PASS |
| Authenticated health | HTTP 200 |
| Unauthenticated health | HTTP 403 |

The full suite was not rerun after the focused delivery fix in order to conserve
free-trial credits. Do not present the result as a measured 34/34.

## Three-Question Live Demo

1. `How do you take a project from idea to ongoing support?`
2. `How can I contat your teem?`
3. `Will it rain in Delhi tomorrow?`

Expected behavior:

- Question 1 retrieves `process-overview` and relevant delivery stages.
- Question 2 retrieves the approved `contact` source despite the typo.
- Question 3 returns no DEKODE source and should be politely kept out of scope.

## Low-Cost Demo Command

Run from the prepared Cloud Shell directory:

```bash
AUTH_TOKEN="$(gcloud auth print-identity-token)" \
SERVICE_URL="https://dekode-vertex-chat-739875238095.asia-south1.run.app" \
CASE_IDS="delivery,contact-typo,weather" \
npm run evaluate
```

Use the targeted smoke check for meetings. Reserve the complete 34-case suite
for release gates or meaningful retrieval changes.

## Important Boundary

The Cloud Run service is a private backend endpoint, not a public presentation
URL. The current website chat is not yet wired to this service. A production
integration should call it through an authenticated server-side adapter, never
from browser code with long-lived credentials.
