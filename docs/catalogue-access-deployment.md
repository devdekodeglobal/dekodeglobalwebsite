# Clinics On Cloud catalogue access handoff

The catalogue password dialog is backed by Cloudflare Pages Functions. Each Cloudflare Pages project must set two encrypted secrets in its own account, for the environment serving the site:

- `CATALOGUE_PASSWORD_HASH`: PBKDF2 SHA-256 hash of the visitor password, with salt `dekode-clinics-catalogue-v1`, 100,000 iterations, and 32 output bytes in lowercase hex.
- `CATALOGUE_SESSION_SECRET`: an independent random 32-byte hex value used to sign two-hour login cookies. Generate a different value for each environment.

To generate both values, run `node scripts/generate-catalogue-credentials.mjs` in an interactive terminal. It prompts for the visitor password without echoing it or putting it in shell history. Copy each output value into Cloudflare Dashboard → Workers & Pages → the production Pages project → Settings → Variables and Secrets → Production → Add variable, and select **Encrypt**. Enter the variable names exactly as written above. Deploy the commit containing `functions/api/catalogue/`, `functions/_middleware.js`, and `public/_routes.json` to that project.

To use the same visitor password as preview, the owner can share that password privately with the production administrator, who runs the script. The resulting password hash should match across accounts; the session secret should be different. Neither value belongs in Git, `.env` files committed to Git, or a public message. Cloudflare does not reveal encrypted secret values after saving, so keep an approved copy in the team's password manager if operationally required.

After deployment, test `/api/catalogue/session` (logged out: `authenticated: false`), a direct `/clinics-on-cloud/catalogue/page-01.jpg` URL (logged out: HTTP 401), the catalogue password dialog, then image and PDF access after login. A direct PDF URL should also return HTTP 401 before login.

This protects files served by the Cloudflare Pages project. The catalogue files are currently committed in a publicly readable GitHub repository, so the original files remain accessible through GitHub. If catalogue confidentiality is required, move the assets to private storage and remove public repository copies and history before treating this as restricted distribution.
