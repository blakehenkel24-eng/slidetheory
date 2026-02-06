# 🎯 SlideTheory

> AI-powered slide generation for strategy consultants

**Mission:** Build SlideTheory to $1K MRR and beyond.

## 📁 Repository Structure

```
slidetheory/
├── apps/
│   ├── web/              # Next.js 14 app (main application)
│   └── landing/          # Static site for slidetheory.io (VPS)
├── infrastructure/       # Deployment & infrastructure
│   ├── nginx/            # Nginx configuration
│   ├── deployment/       # Deploy scripts, PM2 config
│   └── vercel/           # Vercel-specific configs
├── packages/
│   ├── api/              # Shared API types/routes
│   └── ui/               # Shared UI components (future)
├── docs/                 # Documentation
│   ├── specs/            # Product specs, PRDs
│   ├── guides/           # Runbooks, how-tos
│   └── decisions/        # Architecture Decision Records
├── resources/            # Non-code resources
│   ├── reference-decks/  # McKinsey/BCG PDFs for RAG
│   └── marketing/        # Copy, campaigns, assets
└── supabase/             # Database schema, migrations, edge functions
```

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
# Static files - serve with any web server
# For local: npx serve .
```

## 🏗️ Deployment

- **Landing (slidetheory.io):** VPS via PM2 + Nginx
- **Web App:** Vercel (frontend-rose-chi-52.vercel.app/app)

See `infrastructure/deployment/` for detailed guides.

## 📊 Current Status

- ✅ Sprint 1: Auth, UI scaffold, basic slide generation
- 🔄 Sprint 2: RAG integration with reference decks
- 📋 Next: User testing, Stripe integration

---

*Built with Next.js, Supabase, Kimi API, and relentless resourcefulness.*
