



Conversation
Diff
Logs

.github/workflows/pages.yml
.github/workflows/pages.yml
New
+37
-0

docs/.nojekyll
docs/.nojekyll
New

docs/404.html
docs/404.html
New
+18
-0

docs/CNAME
docs/CNAME
New
+1
-0

docs/README_SITE_DEPLOY.md
…cs/README_SITE_DEPLOY.md
New
+50
-0

# Z0neControl Site-Only Deployment (Public Repo)

This guide is for a **public, site-only repo** that contains *only* the landing page files. It keeps private code out of the public repo.

## 1) Create a new public GitHub repo
1. GitHub → **New repository**.
2. Name it `z0necontrol-site` (or similar).
3. **Public** → Create repository.

## 2) Upload only these files into the new repo (repo root)
Upload the **contents** of the site bundle so the root of the new repo looks like this:

```
index.html
style.css
app.js
CNAME
.nojekyll
404.html
robots.txt
sitemap.xml
assets/
  ├─ system-diagram.png
  └─ favicon.svg
```

> Tip: If a README exists in the new repo, delete it before uploading to avoid conflicts.

## 3) Enable GitHub Pages
1. Repo → **Settings** → **Pages**.
2. **Source**: **Deploy from a branch**.
3. **Branch**: `main`.
4. **Folder**: `/` (root).
5. Save.

## 4) Set the custom domain
1. Still on **Settings → Pages**, set **Custom domain** to:
   - `www.z0necontrol.com`
2. Save.

## 5) Add DNS records
Copy the DNS records shown by GitHub Pages and paste them into your DNS provider (Squarespace). The records shown are the **only authoritative source** for your setup.

## 6) Enforce HTTPS
After DNS propagates, **Enforce HTTPS** will appear. Turn it on.

---

## ZIP bundle contents (if provided)
If you received a site-only ZIP bundle, it should contain exactly the files listed in section 2 above.
