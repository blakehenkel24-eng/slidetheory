# Blake + SAKI Workspace

**Your universal project management dashboard.**

🔗 **Live Dashboard:** [blakehenkel24-eng.github.io/workspace](https://blakehenkel24-eng.github.io/workspace/)

---

## 📁 Repository Structure

```
workspace/
├── 📋 index.html                 ← Main dashboard (start here)
├── 📋 kanban-board.html          ← Task management
├── 📋 backlog.html               ← Master backlog (68 items)
├── 📄 README.md                  ← This file
│
├── 🏭 products/                  ← PRODUCT FOLDERS
│   │
│   ├── 🎯 slidetheory/           ← SlideTheory Product
│   │   ├── marketing/            ← Content, emails, social, lead magnet
│   │   ├── research/             ← Competitor analysis, pricing
│   │   ├── infrastructure/       ← Deployment, SSH, SSL guides
│   │   └── website/              ← Website files (index-v4.html, logos, etc.)
│   │
│   └── 🦅 client-hawk/           ← Client Hawk Product (NEW IDEA)
│       ├── PRODUCT-SPEC.md       ← Full product specification
│       ├── marketing/            ← (empty - future content)
│       └── research/             ← (empty - future research)
│
├── 🗂️ general/                  ← SHARED RESOURCES
│   ├── ideas/                    ← Business ideas, feature requests
│   └── shared/                   ← Resources used across products
│
└── 📊 Root Files
    ├── kanban-board.html         ← Task tracker
    ├── backlog.html              ← 68-item strategic roadmap
    ├── master-backlog.csv        ← CSV version
    └── index-dashboard.html      ← Alternative dashboard
```

---

## 🚀 Quick Access by Product

### SlideTheory (AI Slide Generator)
**Status:** Website v4 ready, awaiting deployment  
**Next:** Deploy to slidetheory.io, SSL, logo selection

| Resource | Path |
|----------|------|
| **Website** | `products/slidetheory/website/index-v4.html` |
| **Lead Magnet** | `products/slidetheory/marketing/lead-magnet.html` |
| **Article** | `products/slidetheory/marketing/article-claude-consulting.md` |
| **Social Posts** | `products/slidetheory/marketing/launch-posts-*.md` |
| **Email Setup** | `products/slidetheory/marketing/formspree-*.md` |
| **Deploy Guide** | `products/slidetheory/infrastructure/SSL-SETUP-GUIDE.md` |
| **Competitors** | `products/slidetheory/research/competitor-analysis.md` |

### Client Hawk (Client Intelligence)
**Status:** Product spec complete, not started  
**Next:** Validate with users, decide to build or park

| Resource | Path |
|----------|------|
| **Full Spec** | `products/client-hawk/PRODUCT-SPEC.md` |

---

## 📋 Current Priorities

### This Week (P0)
1. **SlideTheory:** Deploy website v4 → `products/slidetheory/infrastructure/`
2. **SlideTheory:** SSL certificate → `products/slidetheory/infrastructure/SSL-SETUP-GUIDE.md`
3. **SlideTheory:** Pick logo → `products/slidetheory/website/logo-*.svg`

### This Month (P1)
4. **SlideTheory:** Convert lead magnet to PDF → `products/slidetheory/marketing/lead-magnet.html`
5. **SlideTheory:** Set up ConvertKit → `products/slidetheory/marketing/formspree-alternatives.md`
6. **SlideTheory:** Launch social media → `products/slidetheory/marketing/launch-posts-*.md`

### Future (P2)
7. **Client Hawk:** Validate idea or park it

---

## 💡 How to Use This Repo

**Finding things:**
- **Product-specific docs** → `products/[product-name]/[category]/`
- **Shared ideas** → `general/ideas/`
- **Dashboard** → `index.html` (root level)

**Adding new products:**
1. Create `products/[new-product]/`
2. Add subfolders: `marketing/`, `research/`, `infrastructure/`
3. Document in this README

**Rule:** If it's specific to one product, put it in that product's folder. If shared, put in `general/`.

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Live Website** | https://slidetheory.io |
| **Workspace Dashboard** | https://blakehenkel24-eng.github.io/workspace/ |
| **GitHub Repo** | https://github.com/blakehenkel24-eng/workspace |
| **Formspree** | https://formspree.io/f/mjgojzby |

---

*Built with ⚡ by Blake + SAKI*  
*Last updated: February 3, 2026*
