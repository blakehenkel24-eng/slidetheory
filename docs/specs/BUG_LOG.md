# SlideTheory Bug Log

**Project:** SlideTheory - AI-powered slide generator for strategy consultants  
**Maintained by:** QA Agent  
**Last Updated:** February 6, 2026

---

## Bug Status Legend
- 🔴 **Critical (P0)** - Blocks production deployment
- 🟠 **High (P1)** - Significant impact, fix in current sprint
- 🟡 **Medium (P2)** - Should be fixed, not blocking
- 🟢 **Low (P3)** - Nice to have, backlog

---

## Open Bugs

### 🔴 BUG-009: AI Generation Does Not Follow MECE Structure (Potential)
| Field | Details |
|-------|---------|
| **Priority** | P0 - Critical (if confirmed) |
| **Status** | 🔍 Monitor during Sprint 2 testing |
| **Reference** | [PROMPT_INSTRUCTIONS.md](./PROMPT_INSTRUCTIONS.md) |
| **Impact** | Core product value proposition - consulting-quality slides |

**Watch For:**
- Content with overlapping points (not Mutually Exclusive)
- Content missing key aspects (not Collectively Exhaustive)
- Raw prose instead of structured bullets
- Missing key insight at top (not pyramid principle)
- Training data directly quoted (not transformed)

**Validation Tests:**
1. Generate Executive Summary slide
2. Check: Is the "so-what" first?
3. Check: Are there 3-4 supporting bullets max?
4. Check: Is content MECE?
5. Check: Is tone executive-level consulting?

---

### 🔴 BUG-001: Error Handler Crashes on Template Errors
| Field | Details |
|-------|---------|
| **Priority** | P0 - Critical |
| **Status** | Open |
| **File** | `middleware/error-handler.js:29` |
| **Error** | `TypeError: logger.error is not a function` |
| **Impact** | All template-related errors return 500 instead of proper 4xx |
| **Discovered** | February 5, 2026 (V2 Quality Report) |

**Steps to Reproduce:**
1. `GET /api/templates/non-existent-id`
2. Observe 500 response instead of 404

**Expected Behavior:**
- Non-existent template should return 404
- Path traversal attempt should return 403

**Actual Behavior:**
- Returns 500 Internal Server Error due to logger.error not being a function

**Proposed Fix:**
```javascript
// Import logger correctly or use console.error as fallback
const logger = require('../utils/logger') || { error: console.error };
```

---

### 🔴 BUG-002: AI Service Authentication Failing
| Field | Details |
|-------|---------|
| **Priority** | P0 - Critical |
| **Status** | Open |
| **File** | `services/ai-service.js` |
| **Error** | "Invalid Authentication" |
| **Impact** | All AI-generated content falls back to templates |
| **Discovered** | February 5, 2026 (V2 Quality Report) |

**Steps to Reproduce:**
1. Attempt to generate any slide with AI
2. Observe fallback to template mode

**Expected Behavior:**
- AI service should authenticate and generate content

**Actual Behavior:**
- Authentication fails, falls back to template generation

**Proposed Fix:**
- Verify API key configuration in production environment
- Check environment variable `AI_API_KEY` is set correctly

---

### 🟠 BUG-003: Puppeteer/Chromium Dependencies Missing
| Field | Details |
|-------|---------|
| **Priority** | P1 - High |
| **Status** | Open |
| **File** | `lib/slide-generator.js` |
| **Error** | Chromium not found / Puppeteer launch fails |
| **Impact** | Image generation falls back to SVG (lower quality) |
| **Discovered** | February 5, 2026 (V2 Quality Report) |

**Steps to Reproduce:**
1. Attempt to generate PNG export
2. Observe SVG fallback instead of rendered image

**Expected Behavior:**
- Puppeteer renders HTML to high-quality PNG

**Actual Behavior:**
- Falls back to SVG generation

**Proposed Fix:**
- Install Chromium dependencies: `npx puppeteer browsers install chrome`
- Or use Puppeteer Docker image with bundled Chromium

---

### 🟠 BUG-004: Slow Generation Performance
| Field | Details |
|-------|---------|
| **Priority** | P1 - High |
| **Status** | Open |
| **Impact** | User experience degraded (6-9s wait times vs <5s target) |
| **Discovered** | February 5, 2026 (V2 Quality Report) |

**Metrics:**
- Target: < 5 seconds per slide
- Actual: 4.3s - 9.5s (avg ~6s)

**Proposed Fix:**
- Implement caching layer (Redis)
- Optimize AI prompts for faster response
- Consider pre-generation for common templates
- Add progress indicators for better UX

---

### 🟡 BUG-005: Missing API Key Enforcement
| Field | Details |
|-------|---------|
| **Priority** | P2 - Medium |
| **Status** | Open |
| **File** | `middleware/auth.js` |
| **Impact** | API is publicly accessible without authentication |
| **Discovered** | February 5, 2026 (V2 Quality Report) |

**Proposed Fix:**
- Make API key required in production environment
- Add `REQUIRE_API_KEY=true` environment variable check

---

### 🟡 BUG-006: In-Memory Rate Limiting
| Field | Details |
|-------|---------|
| **Priority** | P2 - Medium |
| **Status** | Open |
| **File** | `middleware/rate-limiter.js` |
| **Impact** | Rate limits don't persist across server restarts |
| **Discovered** | February 5, 2026 (V2 Quality Report) |

**Proposed Fix:**
- Implement Redis-based rate limiting
- Or use persistent store for rate limit counters

---

### 🟢 BUG-007: Missing Icon Button Labels
| Field | Details |
|-------|---------|
| **Priority** | P3 - Low |
| **Status** | Open |
| **File** | `public/index.html` |
| **Impact** | Screen reader users may not understand icon buttons |
| **Discovered** | February 5, 2026 (V2 Quality Report) |

**Proposed Fix:**
- Add `aria-label` attributes to all icon-only buttons

---

### 🟢 BUG-008: No Response Compression
| Field | Details |
|-------|---------|
| **Priority** | P3 - Low |
| **Status** | Open |
| **File** | `app.js` or server entry |
| **Impact** | Larger response sizes, slower transfers |
| **Discovered** | February 5, 2026 (V2 Quality Report) |

**Proposed Fix:**
- Add `compression` middleware for gzip/deflate

---

## Closed Bugs

*No closed bugs yet.*

---

## Bug Statistics

| Priority | Open | Closed | Total |
|----------|------|--------|-------|
| 🔴 Critical (P0) | 3 | 0 | 3 |
| 🟠 High (P1) | 2 | 0 | 2 |
| 🟡 Medium (P2) | 2 | 0 | 2 |
| 🟢 Low (P3) | 2 | 0 | 2 |
| **Total** | **9** | **0** | **9** |

---

## Sprint Bug Tracking

### Sprint 1
**Status:** 🔴 Not Started - Waiting for Backend/Frontend Agents

**Expected Bugs to Watch For:**
- Supabase auth configuration issues
- Database RLS policy misconfigurations
- Protected route middleware bugs
- UI layout issues on different screen sizes

---

### Sprint 2
**Status:** 🔴 Not Started - Waiting for Sprint 1 completion

**Expected Bugs to Watch For:**
- AI generation quality issues (MECE structure)
- Prompt template errors
- 16:9 aspect ratio rendering problems
- Puppeteer/Chromium screenshot failures
- Kimi API rate limiting issues
- Template rendering inconsistencies

---

### Sprint 3
**Status:** 🔴 Not Started - Waiting for Sprint 2 completion

**Expected Bugs to Watch For:**
- File upload security vulnerabilities
- Excel/CSV parsing errors
- Export format compatibility issues
- Performance bottlenecks
- Cross-browser rendering differences
- Accessibility violations

---

**Note:** This bug log is maintained by the QA Agent. Bugs are discovered through automated testing, manual testing, and user reports.
