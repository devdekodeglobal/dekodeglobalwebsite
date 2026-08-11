# DEKODE Website Workspace Structure

## Canonical repository

`dekodeglobalwebsite` is the canonical Git repository. Application code and
platform configuration belong inside this repository:

```text
dekodeglobalwebsite/
  api/                 Vercel server functions and server-only adapters
  gcp/vertex-chat/     Cloud Run service, retrieval code, index, and evaluation
  public/              Static assets copied into the website build
  scripts/             Repeatable build and content-generation tools
  src/                 React website source
  tests/               Automated website tests
  docs/                Engineering and operating documentation
  package.json         Website dependencies and commands
  vercel.json          Vercel build, routing, and response headers
```

The GCP service lives in `gcp/vertex-chat` because it is part of the same product
and shares reviewed DEKODE knowledge, but it is deployed independently to Cloud
Run. Vercel calls that private service through OIDC and Workload Identity
Federation.

## Git worktrees

`dekodeglobalwebsite-vertex-evaluation` is a Git worktree for the
`vertex-ai-integration` branch. A worktree is a second checkout of
the same repository, not a second product or repository.

Keep worktrees as sibling folders. Do not copy or move a worktree inside
`dekodeglobalwebsite`; nested repositories can be uploaded accidentally, confuse
editor tooling, and create ambiguous Git status results. After a branch is merged
and no local changes remain, remove its worktree with `git worktree remove` from
the canonical repository.

## Commit to GitHub

- Website, Vercel API, and Cloud Run source code
- `package.json` and lock files for repeatable installs
- Build and deployment configuration
- Tests, evaluation cases, runbooks, and approved knowledge
- Product assets used by the website
- `document-embeddings.json`, intentionally, because the private Cloud Run
  service validates and loads this approved precomputed index at startup
- `.env.example` containing variable names and safe placeholder values only

## Keep local or in platform settings

- `.env`, `.env.local`, and every real secret or access token
- Google service-account keys and downloaded credential JSON files
- `.vercel/`, which links one machine to a Vercel project
- `node_modules/`, `dist/`, coverage, caches, and logs
- Temporary ZIP transfer packages and Cloud Shell download bundles
- Design experiments and screenshots unless they become actual product assets

Real environment values belong in Vercel Environment Variables, Google Secret
Manager, or the relevant platform IAM configuration. Never place them in browser
code or commit them to Git.

## Platform boundaries

- GitHub stores reviewed source and history.
- Vercel builds the website and runs `api/` functions.
- Cloud Run deploys `gcp/vertex-chat` as a private backend.
- Vertex AI provides Gemini generation and embedding APIs.
- Vercel OIDC and GCP Workload Identity Federation connect the two runtimes
  without a long-lived Google key.

`.vercelignore` excludes `gcp`, tests, internal docs, coverage, and ZIP files from
website deployment uploads. Those files remain available in GitHub and can still
be deployed to Cloud Run from their own directory.
