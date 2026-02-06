# 🎯 SlideTheory — Unified App

**One app. Two experiences.**
- **slidetheory.io** — Landing page with features, pricing, info
- **slidetheory.io/app** — The slide generation tool (auth required)

## 🚀 Quick Start

```bash
cd apps/slidetheory
npm install
npm run dev
```

Visit:
- http://localhost:3000 — Landing page
- http://localhost:3000/app — Slide generator

## 📁 Structure

```
apps/slidetheory/
├── app/
│   ├── page.tsx          # Landing page (slidetheory.io/)
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   ├── app/
│   │   ├── page.tsx      # Slide generator (slidetheory.io/app)
│   │   └── layout.tsx    # App layout with auth
│   ├── api/              # API routes (if needed)
│   ├── fonts/
│   └── favicon.ico
├── components/           # Shared React components
│   ├── header.tsx
│   ├── slide-form.tsx
│   ├── slide-preview.tsx
│   └── auth-modal.tsx
├── lib/                  # Utilities
│   ├── api.ts
│   ├── types.ts
│   └── utils.ts
├── hooks/                # Custom hooks
├── public/               # Static assets
├── next.config.mjs
├── package.json
└── tailwind.config.ts
```

## 🏗️ Deployment (Vercel)

### 1. Create Vercel Project
1. Go to https://vercel.com/new
2. Import `blakehenkel24-eng/slidetheory`
3. **Root Directory:** `apps/slidetheory`
4. **Framework:** Next.js
5. Click **Deploy**

### 2. Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
KIMI_API_KEY=your_kimi_key
KIMI_BASE_URL=https://api.moonshot.cn/v1
```

### 3. Domain
- Add custom domain: `slidetheory.io`
- Both `/` and `/app` will work automatically

### 4. DNS
In your DNS provider:
```
DELETE:
  A @ 76.13.122.30

ADD:
  CNAME @ cname.vercel-dns.com
```

## 🔄 Auto-Deploy

Every push to `main` automatically deploys:
```
git push origin main → Vercel builds → Live in 30 seconds
```

## 📊 Current Status

- ✅ Sprint 1: Landing + Auth + UI scaffold
- 🔄 Sprint 2: RAG integration with reference decks
- 📋 Next: End-to-end slide generation testing

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Supabase Auth
- **Database:** Supabase PostgreSQL + pgvector
- **AI:** Kimi API (moonshot-v1-128k)
- **Hosting:** Vercel

---

*Built with relentless resourcefulness.* ⚡
