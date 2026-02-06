# SlideTheory MVP Spec — v1.1.0

## What It Is
AI-powered slide generator for strategy consultants. Takes user context → generates consulting-grade slide → exports as PNG/PPTX/PDF.

**Status:** Built, awaiting testing  
**Location:** `products/slidetheory/mvp/build/`

---

## User Flow
1. User opens web app → picks slide type
2. Inputs context (topic, audience, key message, data points)
3. AI (Kimi K2.5) structures content using MBB frameworks
4. HTML template renders slide with McKinsey styling
5. User downloads PNG, PPTX, PDF, or copies HTML

---

## Features

### Core
- **6 Slide Types:** Executive Summary, Market Analysis, Financial Model, Competitive Analysis, Growth Strategy, Risk Assessment
- **6 Templates:** Tech Startup Series B, European Market Entry, PE Due Diligence, DTC Growth Strategy, SaaS Competitive Analysis, Q3 Board Financials
- **4 Export Formats:** PNG, PPTX, PDF, HTML

### UX
- Split-panel UI (input left, preview right)
- Loading states with progress bar
- Keyboard shortcuts (Ctrl+Enter generate, Ctrl+D download, ? help)
- Mobile responsive

### Technical
- Express.js backend
- Kimi K2.5 for content generation
- HTML-to-image rendering (Puppeteer)
- PPTX export via pptxgenjs
- PDF export via Puppeteer

---

## Visual Design
- **Colors:** Navy #003366, Gray #F5F5F5, Accent #4A90E2
- **Font:** Inter
- **Style:** McKinsey-level professional (shadows, proper spacing, clean hierarchy)

---

## API Endpoints
| Endpoint | Purpose |
|----------|---------|
| `POST /api/generate` | Generate slide content |
| `GET /slides/:id.png` | Download slide image |
| `POST /api/export/pptx` | Export PowerPoint |
| `POST /api/export/pdf` | Export PDF |
| `GET /api/stats` | Usage analytics |

---

## Testing Checklist
- [ ] `npm install` completes without errors
- [ ] `npm start` launches server on :3000
- [ ] Generate Executive Summary slide
- [ ] Generate Market Analysis with waterfall chart
- [ ] Generate Financial Model with table
- [ ] Export PNG
- [ ] Export PPTX
- [ ] Export PDF
- [ ] Test keyboard shortcuts
- [ ] Test mobile responsiveness

---

## Deployment
1. SSH to VPS
2. `cd /opt/slidetheory`
3. `./deploy.sh`
4. Verify at `https://slidetheory.io`

---

## Success Criteria
- [ ] User can generate all 6 slide types
- [ ] All 4 export formats work
- [ ] Average generation time < 3 seconds
- [ ] Zero critical bugs

---

## Next After MVP
- Deploy to production
- Get 10 beta users
- Collect feedback
- Plan v2.0 (AI image generation)

---

**Questions?** See full docs: `mvp/build/README.md`, `TESTING.md`, `DEPLOYMENT.md`
