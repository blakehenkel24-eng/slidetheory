# ⚡ QUICK VERCEL SETUP (5 Minutes)

## Pre-Flight Checklist
- [ ] Supabase project created
- [ ] Kimi API key ready
- [ ] Vercel account (free tier works)
- [ ] Domain DNS access

---

## Step 1: Deploy Supabase Functions (2 min)

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login
supabase login

# Deploy all functions
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

---

## Step 2: Create Vercel Projects (2 min)

### Project A: Landing Site
1. https://vercel.com/new
2. Import `blakehenkel24-eng/slidetheory`
3. **Root Directory:** `apps/landing`
4. **Framework:** Other
5. Click **Deploy**

### Project B: Web App  
1. https://vercel.com/new
2. Import `blakehenkel24-eng/slidetheory`
3. **Root Directory:** `apps/web`
4. **Framework:** Next.js
5. Click **Deploy**

---

## Step 3: Environment Variables (30 sec)

Add to **BOTH** projects:
- Vercel Dashboard → Project → Settings → Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
KIMI_API_KEY=your_kimi_key
KIMI_BASE_URL=https://api.moonshot.cn/v1
```

---

## Step 4: Domains (30 sec)

### Landing Project:
- Settings → Domains
- Add: `slidetheory.io`

### Web App Project:
- Settings → Domains  
- Add: `app.slidetheory.io`

---

## Step 5: DNS (1 min)

In your DNS provider:

```
DELETE:
  A @ 76.13.122.30

ADD:
  CNAME @ cname.vercel-dns.com
  CNAME app cname.vercel-dns.com
```

---

## ✅ Done!

Wait 5-10 minutes, then visit:
- https://slidetheory.io
- https://app.slidetheory.io

Cancel your VPS and save $50/year! 🎉

---

## Troubleshooting

**"Build failed"**
- Check environment variables are set
- Redeploy from Vercel dashboard

**"Domain not working"**
- DNS can take 10-60 minutes to propagate
- Check Vercel domain settings for verification

**"API not working"**
- Verify Supabase functions deployed
- Check browser console for CORS errors

