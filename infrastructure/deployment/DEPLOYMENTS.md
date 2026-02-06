# Current Deployments

## 🌐 Production URLs

| Property | URL | Platform | Repo Path |
|----------|-----|----------|-----------|
| Landing | https://slidetheory.io | VPS (Hostinger) | `apps/landing/` |
| Web App | https://frontend-rose-chi-52.vercel.app/app | Vercel | `apps/web/` |

## 🖥️ VPS Details

- **Host:** Hostinger (76.13.122.30)
- **Web Server:** Nginx
- **Process Manager:** PM2
- **Backend Port:** 3000
- **SSH Key:** `~/.ssh/slidetheory_ed25519`

### Deploy Landing Site

```bash
# From slidetheory/ directory
rsync -avz --exclude='node_modules' apps/landing/ root@76.13.122.30:/var/www/slidetheory/

# SSH in and restart if needed
ssh root@76.13.122.30
pm2 restart slidetheory-backend  # if backend changed
```

## ▲ Vercel Details

- **Project:** frontend-rose-chi-52
- **Framework:** Next.js 14
- **Node Version:** 18.x

### Deploy Web App

```bash
cd apps/web
vercel --prod
```

Or automatic via Git push to main branch.

## ⚙️ Environment Variables

### Landing/VPS
```bash
# /var/www/slidetheory/.env
KIMI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Web App
```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
KIMI_API_KEY=
```

## 🔧 Useful Commands

```bash
# Check VPS status
ssh root@76.13.122.30 "pm2 status"

# View logs
ssh root@76.13.122.30 "pm2 logs slidetheory-backend"

# Restart services
ssh root@76.13.122.30 "pm2 restart all"

# Nginx reload
ssh root@76.13.122.30 "nginx -s reload"
```

