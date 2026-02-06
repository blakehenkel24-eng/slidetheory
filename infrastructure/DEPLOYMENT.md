# Vercel Deployment Configuration

## Projects

This repo is configured for TWO Vercel projects:

### 1. Landing Site (slidetheory.io)
- **Directory:** `apps/landing/`
- **Type:** Static HTML/CSS/JS
- **Config:** `apps/landing/vercel.json`

### 2. Web App (app.slidetheory.io)
- **Directory:** `apps/web/`
- **Type:** Next.js 14
- **Config:** `apps/web/next.config.mjs`

## Auto-Deploy

Both projects deploy automatically on every push to `main`:

```
Developer → GitHub → Vercel → Production
```

No manual steps needed!

## Preview Deployments

Pull requests get automatic preview URLs:
- `https://slidetheory-landing-git-feature.vercel.app`
- `https://slidetheory-app-git-feature.vercel.app`

## Manual Deploy

If needed:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy landing
cd apps/landing
vercel --prod

# Deploy web app
cd apps/web
vercel --prod
```

