# Environment Variables Template

Copy these to Vercel dashboard (Settings → Environment Variables):

## Required for Web App

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
KIMI_API_KEY=
KIMI_BASE_URL=https://api.moonshot.cn/v1
```

## Optional (for image generation)

```
GEMINI_API_KEY=
```

## How to Add

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add each key-value pair
5. Save
6. Redeploy (Vercel will prompt)

## Local Development

Create `.env.local` in `apps/web/`:

```bash
cd apps/web
cp .env.local.example .env.local
# Edit with your values
```

