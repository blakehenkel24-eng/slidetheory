# Architecture Decision Records

## ADR-001: Monorepo Structure

**Status:** Accepted  
**Date:** 2026-02-06

### Context
SlideTheory code was scattered across multiple directories with unclear boundaries:
- `frontend/` — Next.js app
- `app/` — VPS static site  
- `products/slidetheory/` — Planning docs
- Root level — 30+ loose files

This caused confusion about where things lived and how to deploy.

### Decision
Consolidate everything into a single monorepo with clear structure:
```
slidetheory/
├── apps/{web,landing}
├── infrastructure/{nginx,deployment}
├── docs/{specs,guides,decisions}
├── resources/{reference-decks,marketing}
└── supabase/
```

### Consequences
- ✅ Single source of truth
- ✅ Clear deployment paths
- ✅ Easy onboarding
- ✅ Can use Turborepo later if needed

---

## ADR-002: Dual Deployment Strategy

**Status:** Accepted  
**Date:** 2026-02-06

### Context
SlideTheory has two distinct user-facing properties:
1. Marketing site (slidetheory.io) — static, SEO-critical
2. Web app (app.slidetheory.io) — dynamic, auth-required

### Decision
- **Landing:** VPS (Hostinger) with Nginx + PM2 for static files
- **Web App:** Vercel for Next.js 14 with serverless functions

### Rationale
- VPS gives full control over SEO, caching, SSL
- Vercel optimizes for Next.js performance, previews, CI/CD
- Separation allows independent scaling

### Consequences
- ✅ Best tool for each job
- ✅ Marketing site survives even if app has issues
- ⚠️ Two deployment processes to maintain (mitigated with good docs)

---

## ADR-003: Supabase for Backend

**Status:** Accepted  
**Date:** 2026-02-05

### Context
Need auth, database, and vector search for RAG.

### Decision
Use Supabase for:
- Auth (Magic Link + OAuth)
- PostgreSQL with pgvector for embeddings
- Edge Functions for API routes
- Storage for reference decks

### Consequences
- ✅ Rapid development
- ✅ Built-in auth UI
- ✅ pgvector for semantic search
- ⚠️ Vendor lock-in (mitigated: standard PostgreSQL)

---

## ADR-004: Kimi API for Generation

**Status:** Accepted  
**Date:** 2026-02-05

### Context
Need high-quality slide generation with large context windows for RAG.

### Decision
Use Kimi API (moonshot-v1-128k) for:
- Slide content generation
- Structure inference from context
- Style matching to reference decks

### Consequences
- ✅ 128k context handles large reference material
- ✅ Good at structured output (JSON)
- ⚠️ Rate limits require queueing

---

## ADR-005: Reference Decks are Internal

**Status:** Accepted  
**Date:** 2026-02-06

### Context
Need McKinsey/BCG/Bain-quality style reference for RAG.

### Decision
- Store reference PDFs in `resources/reference-decks/`
- Mark as `source: 'internal_reference'` in database
- NOT a user-facing upload feature
- AI uses for style inspiration only

### Consequences
- ✅ Consistent quality baseline
- ✅ No copyright issues from user uploads
- ✅ Controlled training set

