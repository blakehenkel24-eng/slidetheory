# VPS → Vercel Migration Guide

## Goal
Move ALL hosting from VPS to Vercel. No more server management.

## Architecture

```
GitHub Repo
    ↓ (auto deploy on push)
Vercel
    ├── slidetheory.io (landing - static)
    └── app.slidetheory.io (web app - Next.js)
```

## Step 1: Vercel Setup

### Create Projects

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import `blakehenkel24-eng/slidetheory`

### Project 1: Landing Site
- **Name:** slidetheory-landing
- **Root Directory:** `apps/landing`
- **Framework:** Other (static)
- **Build Command:** (leave empty)
- **Output Directory:** (leave empty)

### Project 2: Web App
- **Name:** slidetheory-app
- **Root Directory:** `apps/web`
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

## Step 2: Environment Variables

Add to BOTH projects in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
KIMI_API_KEY=
KIMI_BASE_URL=https://api.moonshot.cn/v1
```

## Step 3: Domains

### Landing Project
Add domain: `slidetheory.io`

### Web App Project
Add domain: `app.slidetheory.io`

## Step 4: DNS Update

In your DNS provider (wherever you manage slidetheory.io):

### Remove old VPS records:
```
DELETE: A record @ → 76.13.122.30
DELETE: A record www → 76.13.122.30
```

### Add Vercel records:
```
# For root domain (slidetheory.io)
Type: A
Name: @
Value: 76.76.21.21

# OR use CNAME for better Vercel support:
Type: CNAME
Name: @
Value: cname.vercel-dns.com

# For app subdomain:
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

## Step 5: Verify

1. Push a change to GitHub
2. Check Vercel dashboard for auto-deploy
3. Visit slidetheory.io
4. Visit app.slidetheory.io

## Step 6: Cancel VPS

Once everything works:
1. Backup any data from VPS
2. Cancel Hostinger subscription
3. Save $50+/year

## Troubleshooting

### API routes not working
Landing site needs API routes moved to Supabase Edge Functions or Web App.

### Images not loading
Check if images are in repo, or use external CDN.

### Environment variables not working
- Must be added in Vercel dashboard
- Must redeploy after adding

