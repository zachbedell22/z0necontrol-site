# Z0neControl Site

A modern Next.js (App Router) landing page for Z0neControl with a real qualification form.

## Stack
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Serverless API route (`/api/beta`) that emails submissions via SMTP (Google Workspace recommended)

## Quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Form / Email (Google Workspace)
This site sends form submissions to your inbox via SMTP.

1) Copy env template
```bash
cp .env.example .env.local
```

2) Fill in SMTP vars in `.env.local`:
- `SMTP_USER` = your Google Workspace inbox (e.g. `Z0neMaster@z0necontrol.com`)
- `SMTP_PASS` = an **App Password** (recommended) or SMTP password
- `SMTP_TO` = where submissions should go

> Tip: if your Workspace uses 2FA (it should), generate an **App Password**.

## Deploy (Vercel recommended)
1) Push this repo to GitHub (`Z0neControl-site`)
2) Import into Vercel
3) Add the environment variables from `.env.example` in Vercel → Project Settings → Environment Variables
4) Deploy

## Assets
Brand SVGs live in `public/brand/` and are used via `next/image`.
You can replace them with your final artwork by keeping the same filenames.

- `public/brand/logo.svg`
- `public/brand/hero-grid.svg`
- `public/brand/flow.svg`

## Notes
- `.gitignore` already excludes `.next`, `node_modules`, etc.
- The form includes a hidden honeypot field to cut basic spam.

