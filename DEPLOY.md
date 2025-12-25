# Deploying to Vercel

This repository now includes a minimal Vercel setup with two serverless endpoints under `api/`:

- `POST /api/contact` — validates a contact form payload and forwards it via Mailgun or SendGrid.
- `POST /api/deploy` — triggers a Vercel deploy hook, protected by a shared secret.

## Prerequisites

- Vercel account and either the Vercel CLI (`npm i -g vercel`) or access to the Vercel dashboard.
- Mail provider credentials (Mailgun or SendGrid) if you want to enable contact form delivery.
- A Vercel deploy hook URL if you want to trigger deployments via `/api/deploy`.

## Environment variables

Copy `.env.example` to `.env.local` (for local development) and populate the values in the Vercel dashboard (Project → Settings → Environment Variables). **Do not commit real secrets.**

- `VITE_GEMINI_KEY` — client-exposed key (if the frontend needs it).
- `MAIL_PROVIDER` — `mailgun` | `sendgrid` | `none` (disables delivery if set to `none`).
- `MAIL_FROM` — sender email (should be a domain you control for deliverability).
- `CONTACT_EMAIL` — destination inbox for contact form submissions.
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — required when `MAIL_PROVIDER=mailgun`.
- `SENDGRID_API_KEY` — required when `MAIL_PROVIDER=sendgrid`.
- `VERCEL_DEPLOY_HOOK` — deploy hook URL generated in Vercel dashboard.
- `WEBHOOK_SECRET` — shared secret required in `x-webhook-secret` header for `/api/deploy`.

## Local testing

You can run the functions locally with Vercel’s dev server after installing the CLI:

```bash
vercel dev
```

Example requests (replace placeholders):

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"user@example.com","message":"Hello!"}'

curl -X POST http://localhost:3000/api/deploy \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: $WEBHOOK_SECRET" \
  -d '{}'
```

## Deploying

1. Ensure the project root in Vercel is this repository root (where `package.json` and `vercel.json` live).
2. Add environment variables in Vercel (dashboard or CLI):
   - `vercel env add VARIABLE_NAME production`
   - Repeat for preview/development as needed.
3. Deploy via CLI (uses pnpm by default):

   ```bash
   pnpm install --frozen-lockfile
   pnpm run build
   vercel --prod
   ```

   or push to a connected repo to trigger Vercel’s build.

## What `vercel.json` does

- Uses `@vercel/static-build` with the `dist` output for the Vite SPA.
- Runs `pnpm install --frozen-lockfile` and `pnpm run build` during deployment.
- Runs serverless functions under `api/` on Node.js 22 (`@vercel/node`).
- Routes `/api/*` to your functions and falls back everything else to `index.html` so client-side routing works.

## Notes

- `vercel.json` pins the runtime for functions to `nodejs22.x` and ensures `/api/*` routes go to serverless functions.
- `.vercelignore` keeps local dependencies, caches, and secrets out of deployments.
- `.env.example` documents all required variables; never commit real values.
