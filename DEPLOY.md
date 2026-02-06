# ⚡ Deploy to Vercel (2 Minutes)

## Prerequisites
- Vercel account (free)
- Supabase project
- Kimi API key

## Step 1: Deploy Supabase Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Deploy all functions
cd supabase/functions
supabase functions deploy get-templates
supabase functions deploy generate-slide
supabase functions deploy export-slide
supabase functions deploy save-slide
supabase functions deploy get-slides
supabase functions deploy search-slides

# Set secrets
supabase secrets set KIMI_API_KEY=your_kimi_key
supabase secrets set KIMI_BASE_URL=https://api.moonshot.cn/v1
```

## Step 2: Create Vercel Project

1. **Go to:** https://vercel.com/new
2. **Import:** `blakehenkel24-eng/slidetheory`
3. **Root Directory:** `apps/slidetheory`
4. **Framework:** Next.js
5. **Click:** Deploy

## Step 3: Environment Variables

Vercel Dashboard → Project → Settings → Environment Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://yourproject.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your_anon_key |
| `SUPABASE_SERVICE_ROLE_KEY` | your_service_key |
| `KIMI_API_KEY` | your_kimi_key |
| `KIMI_BASE_URL` | https://api.moonshot.cn/v1 |

## Step 4: Domain

Vercel Dashboard → Project → Settings → Domains

Add: `slidetheory.io`

## Step 5: DNS

In your DNS provider (where you manage slidetheory.io):

**Remove old VPS record:**
```
DELETE: A @ → 76.13.122.30
```

**Add Vercel record:**
```
ADD: CNAME @ → cname.vercel-dns.com
```

## ✅ Done!

- **Landing:** https://slidetheory.io
- **App:** https://slidetheory.io/app

Wait 5-10 minutes for DNS, then cancel your VPS! 🎉

---

## Troubleshooting

**Build fails?**
- Check all env vars are set
- Redeploy from Vercel dashboard

**DNS not working?**
- DNS propagation takes 10-60 min
- Check Vercel domain settings for verification steps

**API errors?**
- Verify Supabase functions deployed
- Check browser console for CORS errors
- Confirm env vars in Vercel

