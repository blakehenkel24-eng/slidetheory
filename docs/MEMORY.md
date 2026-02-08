# MEMORY.md - Long-Term Memory

> Curated memories about Blake and SlideTheory. Updated 2026-02-08.

---

## About Blake

### Identity
- **Name:** Blake Henkel
- **Location:** Chicago, IL (America/Chicago timezone)
- **Agent:** Saki ⚡ (relentlessly resourceful, proactive, direct)

### Preferences
| Topic | Preference | Confidence |
|-------|------------|------------|
| AI Model | Kimi K2.5 (cost efficiency, performance) | Certain |
| Models to Avoid | OpenAI models (dislikes) | Certain |
| Communication | Direct, high-signal, no filler | Certain |
| Decision Style | "Ask forgiveness, not permission" | High |
| Work Pattern | Morning productivity + late night bursts | High |
| Pet Peeve | Asking permission on safe, valuable work | High |
| **CRITICAL** | **100% functional builds only — no shells/prototypes** | **Certain** |
| **CRITICAL** | **NEVER switch AI model without explicit permission** | **Certain** |

### Goals
**Primary:** Build SlideTheory to **$1,000 MRR**

---

## Active Projects

### SlideTheory 🚀
**Status:** MVP live and deployed  
**URL:** https://slidetheory.io  
**Repository:** blakehenkel24-eng/workspace  
**Target:** $1,000 MRR

**Stack:**
- Frontend: Next.js 14, React, Tailwind CSS, shadcn/ui
- Backend: Supabase (Auth, PostgreSQL, Edge Functions, pgvector)
- AI: Kimi API (moonshot-v1-128k)
- Image Gen: **DISABLED** — Using HTML/CSS rendering for all slide text
- Hosting: Vercel + Hostinger VPS

**Key Decisions:**
1. **Reference decks INTERNAL** — McKinsey PDFs for AI training only, not user-facing
2. **AI image generation DISABLED** — Text hallucination is unsolvable with current tech
3. **HTML/CSS for all slide text** — AI only for decorative visuals
4. **Teal (#0D9488) + Orange (#F97316) design system** — Consulting-grade, distinctive
5. **Auto-select defaults** — Reduce friction, AI infers when possible
6. **Context dump first input flow** — Matches consultant workflow

**Open Threads:**
- [ ] Google Search Console setup
- [ ] LinkedIn company page optimization
- [ ] Twitter/X profile setup
- [ ] First 3 blog posts published
- [ ] Lead magnet creation (template pack)

---

## Autonomous Systems Deployed

### Agent Swarm Skill (2026-02-08)
**Location:** `/home/node/.openclaw/workspace/skills/agent-swarm`  
**Purpose:** Orchestrate multiple specialized agents for complex tasks  
**Status:** Active, packaged as `.skill` file  
**Use Cases:** Research, coding, GTM strategy, competitive analysis  
**GitHub:** Pushed to `blakehenkel24-eng/slidetheory/docs/agent-swarm/`

### Autonomous GTM Engine (2026-02-08)
**Status:** LIVE — 5 cron jobs running in CST timezone  
**Purpose:** 24/7 marketing execution without daily input  

**Daily Jobs:**
| Time (CST) | Task | Output |
|------------|------|--------|
| 8:00 AM | Market Intel | Competitor brief + trends |
| 10:00 AM | Content Creation | 1 piece for approval |
| 2:00 PM | Prospect Research | 5 qualified leads (weekdays) |
| 6:00 PM | Analytics | Metrics + optimization |
| 9:00 PM | Health Check | System status report |

**Weekly Jobs:**
| Time (CST) | Task |
|------------|------|
| Sunday 8:00 PM | Weekly Strategy Review |

**User Time Investment:**
- Daily: 5 min (review content queue)
- Weekly: 15 min (review strategy report)
- Monthly: 30 min (adjust system)

**Files:**
- Engine spec: `slidetheory-autonomous-gtm-engine.md`
- Outputs: `/home/node/.openclaw/workspace/gtm/`
- GitHub: `blakehenkel24-eng/slidetheory/docs/gtm-engine/`

---

## Design Assets Created

### Landing Page Design v2 (2026-02-08)
**Inspiration:** TalkNotes (pricing clarity) + Aerotime (bold hero)  
**Focus:** Conversion-optimized for consultants  
**Color System:** Teal/Orange with 60/30/10 distribution  
**Sections:** Hero, How It Works, Feature Bento, Pricing, Testimonials, CTA  
**File:** `slidetheory-landing-design-v2.md` (24KB)  
**GitHub:** Pushed to `docs/design-system/`

### Component Library (2026-02-08)
**Components:** 12 production-ready React components  
**Features:** Aurora backgrounds, kinetic typography, glassmorphism, bento grids  
**Stack:** Next.js 14, Tailwind CSS, TypeScript  
**Files:**
- `slidetheory-landing-components.md` (22KB)
- `slidetheory-components.md` (specs)
- `slidetheory-design-trends-2026.md` (reference)

---

## Documentation Created

| File | Purpose | Location |
|------|---------|----------|
| `slidetheory-autonomous-gtm-engine.md` | GTM system spec | Workspace + GitHub |
| `slidetheory-landing-design-v2.md` | Landing page design | Workspace + GitHub |
| `slidetheory-marketing-infrastructure.md` | Marketing setup checklist | Workspace |
| `slidetheory-tactical-setup.md` | Account creation guide | Workspace |
| `slidetheory-zero-to-1k-roadmap.md` | Complete roadmap | Workspace |

All docs pushed to: `blakehenkel24-eng/slidetheory/docs/`

---

## Key Learnings

### Critical Work Standards ⚡
**When Blake says "build/create something" → Deliver 100% functional implementation**
- NO shells, NO prototypes, NO placeholder functionality
- MUST integrate real data and services
- MUST test thoroughly and confirm working
- MUST verify all features are functional

*Established: 2026-02-07 after dashboard deployment*

### Model Switching Protocol ⚡
**NEVER switch AI models without explicit permission from Blake**
- Default: Kimi K2.5
- Only switch if explicitly requested
- Always confirm before changing

*Established: 2026-02-08 after unauthorized Opus switch*

### AI Limitations
> **AI image generators cannot reliably render coherent text as of 2026.**

Tested Gemini, DALL-E, GPT Image 1.5 — all produce gibberish text shapes. This is a fundamental limitation of diffusion models. Solution: HTML/CSS for text, AI only for decorative visuals.

### Consulting Best Practices
1. **Action Titles** — Every slide title must state the insight ("Revenue increased 23%") not just describe ("Revenue Chart")
2. **MECE Principle** — Mutually Exclusive, Collectively Exhaustive categories
3. **Pyramid Principle** — Main point → Arguments → Data (top-down structure)

### Technical Learnings
- **PM2 is essential** for Node.js production (auto-restart, boot persistence)
- **Vercel > VPS** for Next.js (automatic builds, edge functions, previews)
- **Field mapping bugs** common in full-stack apps — need runtime validation
- **Cron timezone matters** — Must specify `America/Chicago` for CST schedules

---

## Relationships

### MCP Servers Connected
- GitHub — Code management
- Supabase — Database operations
- Puppeteer — Browser automation

### Skills Installed
1. **agent-swarm** — Multi-agent orchestration for complex tasks
2. **proactive-agent** — Self-improving, anticipates needs
3. **ui-ux-pro-max** — UI/UX design intelligence
4. **deep-research** — Multi-step research with subagents
5. **humanizer** — Removes AI writing patterns
6. blogwatcher, github, nano-banana-pro, summarize, mcporter, copy-editing, copywriter

---

## Important Dates

| Date | Event |
|------|-------|
| 2026-02-05 | SlideTheory v2.0 production deployment |
| 2026-02-06 | UI/UX redesign + consulting standards implementation |
| 2026-02-06 | Memory system architecture implemented |
| 2026-02-08 | Agent Swarm skill created and deployed |
| 2026-02-08 | Autonomous GTM Engine activated (5 cron jobs) |
| 2026-02-08 | Landing page design v2 completed |

---

## Memory System

**Architecture:** Hybrid (Supermemory.ai + local fallback + file notes)  
**Status:** Active with 36+ memories stored  
**Containers:** blake, slidetheory, decisions, learnings, sessions

**Access Patterns:**
- Daily notes → `memory/YYYY-MM-DD.md`
- Semantic search → `tools/memory/index.ts`
- Architecture → `notes/memory-architecture.md`

---

*This file is curated. Daily notes are raw; this is distilled.*
