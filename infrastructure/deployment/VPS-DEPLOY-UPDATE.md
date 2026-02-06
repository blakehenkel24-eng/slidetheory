# VPS Deployment Update Guide

## Overview
The VPS has been updated to pull from the new organized GitHub repo:
**https://github.com/blakehenkel24-eng/slidetheory**

## Quick Deploy

```bash
# SSH to VPS
ssh root@76.13.122.30

# Run deployment script
cd /var/www/slidetheory
bash infrastructure/deployment/deploy-vps.sh
```

## Manual Deploy (if needed)

```bash
# On VPS:
cd /var/www/slidetheory

# Backup current
tar czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# Pull new code
git remote set-url origin https://github.com/blakehenkel24-eng/slidetheory.git
git fetch origin main
git reset --hard origin/main

# Deploy landing site
rsync -avz --delete apps/landing/ /var/www/slidetheory/

# Restart services
pm2 restart slidetheory-backend
nginx -s reload
```

## What's Changed

| Before | After |
|--------|-------|
| `app/` → VPS | `apps/landing/` → VPS |
| `frontend/` → Vercel | `apps/web/` → Vercel (unchanged) |
| Scattered docs | `docs/` organized |
| Manual file copying | `git pull` from GitHub |

## Directory Structure on VPS

```
/var/www/slidetheory/
├── index.html          (from apps/landing/)
├── styles.css
├── app.js
├── blog.html
├── ...
└── infrastructure/     (deployment scripts)
```

## Environment Variables

Still in `/var/www/slidetheory/.env`:
- KIMI_API_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## Troubleshooting

**Git not installed on VPS:**
```bash
apt-get update && apt-get install -y git
```

**Permission denied:**
```bash
# Make sure you're root or use sudo
ssh root@76.13.122.30
```

**PM2 not running:**
```bash
pm2 start /var/www/slidetheory/app.js --name slidetheory-backend
pm2 save
pm2 startup
```

## Next Deployments

1. Push changes to GitHub: `git push origin main`
2. SSH to VPS and run: `bash infrastructure/deployment/deploy-vps.sh`
3. Or set up GitHub Actions for automatic deployment

