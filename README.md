# 🎯 SlideTheory

> AI-powered slide generation for strategy consultants

**Mission:** Build SlideTheory to $1K MRR and beyond.

## 🚀 Quick Start

### Web App (Next.js)
```bash
cd apps/web
npm install
npm run dev
```

### Landing Site
```bash
cd apps/landing
npm install  # if needed
npm run dev  # or npx serve .
```

## 🏗️ Deployment (Vercel)

Both apps deploy automatically from GitHub:

| App | Domain | Vercel Project |
|-----|--------|----------------|
| **Landing** | slidetheory.io | Import `apps/landing` |
| **Web App** | app.slidetheory.io | Import `apps/web` |

### Setup

1. **Connect GitHub to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import `blakehenkel24-eng/slidetheory`
   - Set **Root Directory** to `apps/web` for main app
   - Repeat for `apps/landing`

2. **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   KIMI_API_KEY=
   KIMI_BASE_URL=https://api.moonshot.cn/v1
   ```

3. **Domains:**
   - Add `slidetheory.io` → landing project
   - Add `app.slidetheory.io` → web project

## 📁 Repository Structure

```
slidetheory/
├── apps/
│   ├── web/              # Next.js 14 app (app.slidetheory.io)
│   └── landing/          # Static site (slidetheory.io)
├── docs/                 # Documentation
├── infrastructure/       # Deployment configs
├── resources/            # Reference decks, marketing
└── supabase/             # Edge functions
```

## 📊 Current Status

- ✅ Sprint 1: Auth, UI scaffold
- 🔄 Sprint 2: RAG integration
- 📋 Next: User testing, Stripe

