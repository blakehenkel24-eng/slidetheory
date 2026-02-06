# SlideTheory Test Plan

**Project:** SlideTheory - AI-powered slide generator  
**Version:** v2.0 (MVP)  
**Maintained by:** QA Agent  
**Last Updated:** February 6, 2026

---

## Overview

This test plan covers quality assurance for the SlideTheory application. Testing is organized by sprint and includes unit tests, integration tests, E2E tests, and manual testing.

**Reference Documents:**
- [Prompt Instructions](./PROMPT_INSTRUCTIONS.md) - AI generation requirements
- [MVP Spec](./MVP-SPEC.md) - Feature specifications
- [Product Spec](./PRODUCT-SPEC.md) - Product requirements

## AI Generation Quality Standards

Per [PROMPT_INSTRUCTIONS.md](./PROMPT_INSTRUCTIONS.md), all generated slides MUST meet:

### Output Format Requirements
| Requirement | Test Method | Priority |
|-------------|-------------|----------|
| 16:9 aspect ratio wireframe format | Screenshot measurement | P0 |
| PNG format output | File validation | P0 |
| Clean bullet-point structure (never prose) | Content analysis | P0 |
| Executive-level consulting tone | Content review | P0 |
| Complete text content displayed | Visual verification | P0 |

### Slide Archetype Validation
| Archetype | MECE Check | Structure Validation | Priority |
|-----------|------------|---------------------|----------|
| Executive Summary | ✅ Required | Pyramid principle, so-what first | P0 |
| Horizontal Flow | ✅ Required | Left-to-right process flow | P0 |
| Vertical Flow | ✅ Required | Top-down hierarchy, MECE branches | P0 |
| Graph/Chart | N/A | Data viz with insight callouts | P0 |
| General | ✅ Required | Logical grouping | P0 |

### Quality Standards Checklist
- [ ] **MECE Principle:** Content is Mutually Exclusive and Collectively Exhaustive
- [ ] **Front-loaded messages:** Key insight appears first
- [ ] **Clear narrative flow:** Logical progression of ideas
- [ ] **Action-oriented headlines:** Headlines convey main message
- [ ] **No raw prose:** Only structured bullets and frameworks
- [ ] **No training data extraction:** Content is transformed, not copied

---

## Test Environment

### Required Tools
- **Node.js:** v22.22.0+
- **Puppeteer:** For screenshot testing
- **Jest:** Unit testing framework
- **Supertest:** API testing
- **Playwright:** E2E testing (optional)

### Test Environments
1. **Development:** Local machine (`npm run dev`)
2. **Staging:** VPS deployment (`https://staging.slidetheory.io`)
3. **Production:** Live deployment (`https://slidetheory.io`)

---

## Test Categories

### 1. Unit Tests ✅
**Location:** `mvp/build/tests/unit/`
**Status:** 81 tests passing

| Module | Tests | Status |
|--------|-------|--------|
| OpenAI Client | 15 | ✅ Pass |
| Slide Generator | 22 | ✅ Pass |
| Export Generator | 19 | ✅ Pass |
| Validation | 17 | ✅ Pass |
| Utilities | 8 | ✅ Pass |

**Command:** `npm test`

---

### 2. Integration Tests ⚠️
**Location:** `mvp/build/tests/integration/`
**Status:** 30/34 passing (88.2%)

| Endpoint | Tests | Status |
|----------|-------|--------|
| GET /api/health | 3 | ✅ Pass |
| GET /api/stats | 2 | ✅ Pass |
| GET /api/templates | 2 | ✅ Pass |
| GET /api/templates/:id | 3 | ❌ Fail (BUG-001) |
| POST /api/generate | 13 | ✅ Pass |
| POST /api/export/pptx | 3 | ✅ Pass |
| POST /api/export/pdf | 3 | ⚠️ Partial |

**Command:** `npm run test:integration`

---

### 3. E2E Tests ⚠️
**Status:** Partial - needs completion

| Scenario | Status |
|----------|--------|
| Full user journey | ✅ Pass |
| All slide types | ✅ Pass |
| Template-based generation | ✅ Pass |
| Different audiences | ✅ Pass |
| Export all formats | ⚠️ Partial |
| Error recovery | ✅ Pass |
| Concurrent requests | ✅ Pass |
| Stats tracking | ✅ Pass |
| Performance (<5s) | ❌ Fail (BUG-004) |
| Large context handling | ✅ Pass |
| Many data points | ✅ Pass |

---

### 4. Manual Testing Checklist

#### UI/UX Testing
- [ ] Form validation shows correct error messages
- [ ] Loading states display properly
- [ ] Progress bar updates during generation
- [ ] Keyboard shortcuts work (Ctrl+Enter, Ctrl+D, ?)
- [ ] Mobile responsive layout
- [ ] Dark/light mode (if applicable)

#### Slide Generation Testing
- [ ] Executive Summary slide generates correctly
- [ ] Market Analysis slide generates correctly
- [ ] Financial Model slide generates correctly
- [ ] Competitive Analysis slide generates correctly
- [ ] Growth Strategy slide generates correctly
- [ ] Risk Assessment slide generates correctly

#### Export Testing
- [ ] PNG export downloads correct file
- [ ] PPTX export downloads correct file
- [ ] PDF export downloads correct file
- [ ] HTML copy works correctly

---

## Sprint-Based Testing

### Sprint 1: Foundation
**Duration:** Weeks 1-2  
**Goal:** Establish core infrastructure - authentication, database schema, and basic UI shell  
**Status:** 🔴 Not Started - Waiting for Backend/Frontend Agents

#### Story 1.1: Supabase Auth Integration
**Assignee:** Backend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| User signup with valid email/password | Integration | P0 | 📝 Pending |
| User signup with invalid email format | Integration | P0 | 📝 Pending |
| User signup with weak password | Integration | P0 | 📝 Pending |
| User signup with duplicate email | Integration | P0 | 📝 Pending |
| User login with valid credentials | Integration | P0 | 📝 Pending |
| User login with invalid credentials | Integration | P0 | 📝 Pending |
| User login with non-existent email | Integration | P0 | 📝 Pending |
| Password reset flow - request email | Integration | P0 | 📝 Pending |
| Password reset flow - confirm reset | Integration | P0 | 📝 Pending |
| Session management - JWT validation | Integration | P0 | 📝 Pending |
| Session management - token refresh | Integration | P1 | 📝 Pending |
| Session management - expiration | Integration | P1 | 📝 Pending |
| Protected routes - access without auth | Integration | P0 | 📝 Pending |
| Protected routes - access with valid auth | Integration | P0 | 📝 Pending |
| Logout functionality | Integration | P0 | 📝 Pending |
| Logout - session invalidation | Integration | P1 | 📝 Pending |

#### Story 1.2: Database Schema Design
**Assignee:** Backend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Profiles table creation | Unit | P0 | 📝 Pending |
| Profiles table RLS policies | Integration | P0 | 📝 Pending |
| Slides table creation | Unit | P0 | 📝 Pending |
| Slides table RLS policies | Integration | P0 | 📝 Pending |
| Slide_outputs table creation | Unit | P0 | 📝 Pending |
| User_settings table creation | Unit | P0 | 📝 Pending |
| Foreign key constraints | Unit | P0 | 📝 Pending |
| TypeScript types generation | Unit | P1 | 📝 Pending |
| Database migrations run successfully | Integration | P0 | 📝 Pending |
| Row Level Security - user can only access own data | Integration | P0 | 📝 Pending |
| Row Level Security - admin access (if applicable) | Integration | P2 | 📝 Pending |

#### Story 1.3: Project Setup & UI Shell
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Next.js project builds successfully | Build | P0 | 📝 Pending |
| Tailwind CSS styles apply correctly | Visual | P0 | 📝 Pending |
| Custom design tokens work | Visual | P1 | 📝 Pending |
| shadcn/ui components render correctly | Visual | P0 | 📝 Pending |
| Project folder structure correct | Code Review | P1 | 📝 Pending |
| Environment variables loaded correctly | Integration | P0 | 📝 Pending |
| Supabase client initializes without errors | Integration | P0 | 📝 Pending |
| Basic layout component renders | Visual | P0 | 📝 Pending |
| Root layout loads without errors | E2E | P0 | 📝 Pending |
| Navigation between pages works | E2E | P0 | 📝 Pending |

#### Story 1.4: Auth Pages UI
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Login page renders correctly | Visual | P0 | 📝 Pending |
| Login form validation - empty fields | E2E | P0 | 📝 Pending |
| Login form validation - invalid email | E2E | P0 | 📝 Pending |
| Login loading state displays | Visual | P0 | 📝 Pending |
| Login error message displays | Visual | P0 | 📝 Pending |
| Signup page renders correctly | Visual | P0 | 📝 Pending |
| Signup form validation - empty fields | E2E | P0 | 📝 Pending |
| Signup form validation - password strength | E2E | P0 | 📝 Pending |
| Signup loading state displays | Visual | P0 | 📝 Pending |
| Password reset page renders | Visual | P0 | 📝 Pending |
| Password reset confirmation page renders | Visual | P0 | 📝 Pending |
| Redirect to dashboard after successful login | E2E | P0 | 📝 Pending |
| Link to switch between login/signup works | E2E | P0 | 📝 Pending |
| Mobile responsive - login page | Screenshot | P1 | 📝 Pending |
| Mobile responsive - signup page | Screenshot | P1 | 📝 Pending |

#### Story 1.5: Dashboard Shell & Navigation
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Dashboard layout renders correctly | Visual | P0 | 📝 Pending |
| Sidebar navigation displays all links | Visual | P0 | 📝 Pending |
| User avatar dropdown works | E2E | P0 | 📝 Pending |
| Logout button in user menu works | E2E | P0 | 📝 Pending |
| Protected route - redirects to login when unauthenticated | E2E | P0 | 📝 Pending |
| Protected route - allows access when authenticated | E2E | P0 | 📝 Pending |
| Sidebar collapses on mobile | Screenshot | P0 | 📝 Pending |
| Mobile navigation - hamburger menu | Screenshot | P0 | 📝 Pending |
| Breadcrumb or page title displays | Visual | P1 | 📝 Pending |
| Navigation items: New Slide, My Slides, Settings, Help | E2E | P0 | 📝 Pending |
| Page loads without JavaScript errors | E2E | P0 | 📝 Pending |

#### Sprint 1 Screenshot Tests (Puppeteer MCP)
| Breakpoint | Page | Status |
|------------|------|--------|
| 1920x1080 | Login Page | 📝 Pending |
| 1440x900 | Login Page | 📝 Pending |
| 1280x720 | Login Page | 📝 Pending |
| 768x1024 | Login Page (Tablet) | 📝 Pending |
| 390x844 | Login Page (Mobile) | 📝 Pending |
| 1920x1080 | Signup Page | 📝 Pending |
| 390x844 | Signup Page (Mobile) | 📝 Pending |
| 1920x1080 | Dashboard | 📝 Pending |
| 1440x900 | Dashboard | 📝 Pending |
| 768x1024 | Dashboard (Tablet) | 📝 Pending |
| 390x844 | Dashboard (Mobile) | 📝 Pending |
| 1920x1080 | Password Reset Page | 📝 Pending |

#### Sprint 1 Regression Tests
- [ ] All existing unit tests still pass
- [ ] No new console errors in browser
- [ ] Build completes without warnings
- [ ] No breaking changes to existing API (if any)

#### Sprint 1 Acceptance Criteria Checklist
- [ ] User can sign up with email/password
- [ ] User can log in with email/password
- [ ] User can reset password
- [ ] Session persists across page reloads
- [ ] Protected routes require authentication
- [ ] User can log out
- [ ] Dashboard displays with navigation
- [ ] UI is mobile responsive
- [ ] All database tables created with RLS
- [ ] TypeScript types generated

---

### Sprint 2: Core Features
**Duration:** Weeks 3-4  
**Goal:** Implement slide generation form, preview panel, and AI integration  
**Status:** 🔴 Not Started - Waiting for Sprint 1 completion

#### Story 2.1: Slide Input Form (Left Panel)
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Slide type dropdown displays all 5 options | Visual | P0 | 📝 Pending |
| Slide type selection updates UI appropriately | E2E | P0 | 📝 Pending |
| Audience dropdown displays all 4 options | Visual | P0 | 📝 Pending |
| Context textbox accepts rich text input | E2E | P0 | 📝 Pending |
| Context minimum character validation (10 chars) | E2E | P0 | 📝 Pending |
| Context maximum character validation | E2E | P1 | 📝 Pending |
| Presentation mode toggle works | E2E | P0 | 📝 Pending |
| Data input box accepts text entry | E2E | P0 | 📝 Pending |
| File upload accepts Excel/CSV (optional) | E2E | P0 | 📝 Pending |
| File upload validates file type | E2E | P0 | 📝 Pending |
| File upload validates file size (< 5MB) | E2E | P0 | 📝 Pending |
| Key Takeaway textbox accepts input | E2E | P0 | 📝 Pending |
| Generate button triggers submission | E2E | P0 | 📝 Pending |
| Form validation shows inline errors | Visual | P0 | 📝 Pending |
| Auto-save draft functionality works | Integration | P1 | 📝 Pending |
| Mobile responsive - form layout | Screenshot | P0 | 📝 Pending |

#### Story 2.2: Slide Preview Panel (Right Panel)
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Preview container maintains 16:9 aspect ratio | Visual | P0 | 📝 Pending |
| Empty state displays correctly | Visual | P0 | 📝 Pending |
| Loading state with progress indicator | Visual | P0 | 📝 Pending |
| Error state with retry option | Visual | P0 | 📝 Pending |
| Generated slide renders HTML correctly | Visual | P0 | 📝 Pending |
| Zoom controls work (fit, 100%, 150%) | E2E | P1 | 📝 Pending |
| Fullscreen preview mode works | E2E | P1 | 📝 Pending |
| Preview responsive on mobile (stacks vertically) | Screenshot | P0 | 📝 Pending |
| Preview maintains aspect ratio on resize | Visual | P0 | 📝 Pending |

#### Story 2.3: Kimi API Integration
**Assignee:** Backend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Edge Function receives valid requests | Integration | P0 | 📝 Pending |
| Kimi API authenticates successfully | Integration | P0 | 📝 Pending |
| Prompt includes all input parameters | Unit | P0 | 📝 Pending |
| Prompt follows template from PROMPT_INSTRUCTIONS.md | Code Review | P0 | 📝 Pending |
| Rate limiting prevents abuse | Integration | P0 | 📝 Pending |
| Generation status updates (polling/SSE) | Integration | P0 | 📝 Pending |
| API error handling - timeout | Integration | P0 | 📝 Pending |
| API error handling - rate limit | Integration | P0 | 📝 Pending |
| API error handling - invalid response | Integration | P0 | 📝 Pending |
| Fallback response when AI unavailable | Integration | P0 | 📝 Pending |

#### Story 2.4: HTML Slide Templates
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| General slide template renders correctly | Visual | P0 | 📝 Pending |
| Executive Summary template renders correctly | Visual | P0 | 📝 Pending |
| Executive Summary follows pyramid principle | Content | P0 | 📝 Pending |
| Horizontal Flow template renders correctly | Visual | P0 | 📝 Pending |
| Horizontal Flow has left-to-right structure | Visual | P0 | 📝 Pending |
| Vertical Flow template renders correctly | Visual | P0 | 📝 Pending |
| Vertical Flow has top-down hierarchy | Visual | P0 | 📝 Pending |
| Graph/Chart template renders correctly | Visual | P0 | 📝 Pending |
| Consistent styling across all templates | Visual | P0 | 📝 Pending |
| Navy (#003366) primary color applied | Visual | P0 | 📝 Pending |
| Proper typography and spacing | Visual | P1 | 📝 Pending |
| Template responsive scaling in 16:9 container | Visual | P0 | 📝 Pending |

#### Story 2.5: Slide Rendering Engine (Puppeteer)
**Assignee:** Backend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Puppeteer MCP integration works | Integration | P0 | 📝 Pending |
| HTML to PNG conversion endpoint works | Integration | P0 | 📝 Pending |
| PNG output is 1920x1080 (16:9) resolution | Validation | P0 | 📝 Pending |
| High-quality rendering (2x scale for retina) | Visual | P1 | 📝 Pending |
| Generated images stored in Supabase Storage | Integration | P0 | 📝 Pending |
| Public URL generation for downloads | Integration | P0 | 📝 Pending |
| Background processing with status tracking | Integration | P0 | 📝 Pending |
| Temporary files cleaned up | Integration | P1 | 📝 Pending |

#### Story 2.6: My Slides Gallery
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Grid layout displays slide thumbnails | Visual | P0 | 📝 Pending |
| Slide metadata displays (title, date, type) | Visual | P0 | 📝 Pending |
| Pagination or infinite scroll works | E2E | P1 | 📝 Pending |
| Search/filter by slide type works | E2E | P1 | 📝 Pending |
| Sort by date (newest first) works | E2E | P1 | 📝 Pending |
| Click to view/edit slide works | E2E | P0 | 📝 Pending |
| Empty state for new users displays | Visual | P0 | 📝 Pending |
| Mobile responsive gallery layout | Screenshot | P0 | 📝 Pending |

#### Sprint 2 AI Generation Quality Tests

**MECE Structure Validation (All Slide Types)**
| Test Case | Slide Type | Priority | Status |
|-----------|------------|----------|--------|
| Content is Mutually Exclusive (no overlap) | All | P0 | 📝 Pending |
| Content is Collectively Exhaustive (complete) | All | P0 | 📝 Pending |
| No duplicate or redundant points | All | P0 | 📝 Pending |
| All points are at same logical level | All | P0 | 📝 Pending |

**Executive Summary Specific Tests**
| Test Case | Validation Method | Priority | Status |
|-----------|-------------------|----------|--------|
| So-what appears first (pyramid principle) | Content order check | P0 | 📝 Pending |
| 3-4 supporting bullets maximum | Count validation | P0 | 📝 Pending |
| Headline is action-oriented | Content review | P0 | 📝 Pending |
| No prose paragraphs | Format check | P0 | 📝 Pending |

**Horizontal Flow Specific Tests**
| Test Case | Validation Method | Priority | Status |
|-----------|-------------------|----------|--------|
| Process steps flow left-to-right | Visual check | P0 | 📝 Pending |
| Clear sequence indicators present | Visual check | P0 | 📝 Pending |
| Steps are logically ordered | Content review | P0 | 📝 Pending |

**Vertical Flow Specific Tests**
| Test Case | Validation Method | Priority | Status |
|-----------|-------------------|----------|--------|
| Top-down hierarchy structure | Visual check | P0 | 📝 Pending |
| MECE branches at each level | Content review | P0 | 📝 Pending |
| Issue tree format correct | Structure check | P0 | 📝 Pending |

**Graph/Chart Specific Tests**
| Test Case | Validation Method | Priority | Status |
|-----------|-------------------|----------|--------|
| Clear axes and labels present | Visual check | P0 | 📝 Pending |
| Insight callouts included | Content check | P0 | 📝 Pending |
| Data viz type appropriate for data | Review | P0 | 📝 Pending |

**Content Quality Tests (All Types)**
| Test Case | Priority | Status |
|-----------|----------|--------|
| Executive-level consulting tone | P0 | 📝 Pending |
| No raw prose or text blocks | P0 | 📝 Pending |
| Key insight front-loaded | P0 | 📝 Pending |
| Action-oriented headlines | P0 | 📝 Pending |
| No training data directly copied | P0 | 📝 Pending |
| Complete text content visible | P0 | 📝 Pending |
| Appropriate for C-Suite/PE audience | P0 | 📝 Pending |

#### Sprint 2 Screenshot Tests (Puppeteer MCP)
| Breakpoint | Page/Component | Status |
|------------|----------------|--------|
| 1920x1080 | Slide Input Form | 📝 Pending |
| 1440x900 | Slide Input Form | 📝 Pending |
| 768x1024 | Slide Input Form (Tablet) | 📝 Pending |
| 390x844 | Slide Input Form (Mobile) | 📝 Pending |
| 1920x1080 | Preview Panel - Loading State | 📝 Pending |
| 1920x1080 | Preview Panel - Executive Summary | 📝 Pending |
| 1920x1080 | Preview Panel - Horizontal Flow | 📝 Pending |
| 1920x1080 | Preview Panel - Vertical Flow | 📝 Pending |
| 1920x1080 | Preview Panel - Graph/Chart | 📝 Pending |
| 768x1024 | Preview Panel (Tablet) | 📝 Pending |
| 390x844 | Preview Panel (Mobile) | 📝 Pending |
| 1920x1080 | My Slides Gallery | 📝 Pending |
| 768x1024 | My Slides Gallery (Tablet) | 📝 Pending |
| 390x844 | My Slides Gallery (Mobile) | 📝 Pending |

#### Sprint 2 Acceptance Criteria Checklist
- [ ] User can select all 5 slide types
- [ ] User can select all 4 audience types
- [ ] User can enter context (min 10 chars)
- [ ] User can toggle presentation mode
- [ ] User can enter data manually
- [ ] User can upload Excel/CSV files (optional)
- [ ] User can enter key takeaway
- [ ] Generate button triggers AI generation
- [ ] Preview panel maintains 16:9 ratio
- [ ] Generated slides follow MECE structure
- [ ] Executive Summary follows pyramid principle
- [ ] Content has executive consulting tone
- [ ] No prose, only structured bullets
- [ ] PNG export available
- [ ] Slides gallery displays user's slides
- [ ] All templates render consistently

---

### Sprint 3: Polish & Launch
**Duration:** Weeks 5-6  
**Goal:** File uploads, exports, QA, and production readiness  
**Status:** 🔴 Not Started - Waiting for Sprint 2 completion

#### Story 3.1: Excel/CSV File Upload
**Assignee:** Backend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| File upload accepts .xlsx format | Integration | P0 | 📝 Pending |
| File upload accepts .xls format | Integration | P1 | 📝 Pending |
| File upload accepts .csv format | Integration | P0 | 📝 Pending |
| File size limit enforced (< 5MB) | Integration | P0 | 📝 Pending |
| Invalid file type rejected | Integration | P0 | 📝 Pending |
| Files stored securely in Supabase Storage | Integration | P0 | 📝 Pending |
| Excel parsing with SheetJS works | Integration | P0 | 📝 Pending |
| CSV parsing with PapaParse works | Integration | P0 | 📝 Pending |
| Data extraction to JSON works | Integration | P0 | 📝 Pending |
| Malformed file error handling | Integration | P0 | 📝 Pending |
| File reference stored in database | Integration | P0 | 📝 Pending |

#### Story 3.2: Data Visualization in Slides
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Chart.js or Recharts integration works | Integration | P0 | 📝 Pending |
| Bar chart renders correctly | Visual | P0 | 📝 Pending |
| Line chart renders correctly | Visual | P0 | 📝 Pending |
| Pie/donut chart renders correctly | Visual | P0 | 📝 Pending |
| Waterfall chart for financial data | Visual | P0 | 📝 Pending |
| Automatic chart type selection works | E2E | P0 | 📝 Pending |
| Chart styling matches SlideTheory brand | Visual | P0 | 📝 Pending |
| Charts render in preview panel | Visual | P0 | 📝 Pending |
| Charts render in exports (PNG/PPTX/PDF) | Integration | P0 | 📝 Pending |
| Mobile responsive charts | Screenshot | P0 | 📝 Pending |

#### Story 3.3: Export Functionality
**Assignee:** Backend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| PPTX export endpoint works | Integration | P0 | 📝 Pending |
| PDF export endpoint works | Integration | P0 | 📝 Pending |
| PPTX uses pptxgenjs correctly | Integration | P0 | 📝 Pending |
| PPTX is editable | Manual | P0 | 📝 Pending |
| PPTX maintains 16:9 aspect ratio | Validation | P0 | 📝 Pending |
| PDF generation using Puppeteer works | Integration | P0 | 📝 Pending |
| PDF is high-quality print-ready | Visual | P0 | 📝 Pending |
| PDF has embedded fonts | Validation | P1 | 📝 Pending |
| Download links work correctly | E2E | P0 | 📝 Pending |
| Export status tracking works | Integration | P0 | 📝 Pending |
| Export progress indicators | Visual | P1 | 📝 Pending |

#### Story 3.4: Slide Regeneration & Iteration
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| "Regenerate" button appears on completed slides | Visual | P0 | 📝 Pending |
| Regenerate button triggers new generation | E2E | P0 | 📝 Pending |
| Can edit inputs before regenerating | E2E | P0 | 📝 Pending |
| "Make it more formal" quick option works | E2E | P1 | 📝 Pending |
| "Make it more casual" quick option works | E2E | P1 | 📝 Pending |
| Version history displays | Visual | P0 | 📝 Pending |
| Can compare previous versions | E2E | P1 | 📝 Pending |
| Can revert to previous version | E2E | P0 | 📝 Pending |
| Version metadata displays correctly | Visual | P0 | 📝 Pending |

#### Story 3.5: User Settings
**Assignee:** Frontend Agent

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Settings page renders correctly | Visual | P0 | 📝 Pending |
| Profile information can be edited | E2E | P0 | 📝 Pending |
| Default slide type selection works | E2E | P1 | 📝 Pending |
| Default audience selection works | E2E | P1 | 📝 Pending |
| Default presentation mode setting works | E2E | P1 | 📝 Pending |
| Password change functionality works | E2E | P0 | 📝 Pending |
| Account deletion option works | E2E | P0 | 📝 Pending |
| Form validation on settings | E2E | P0 | 📝 Pending |
| Success states display correctly | Visual | P0 | 📝 Pending |
| Settings persist across sessions | Integration | P0 | 📝 Pending |

#### Story 3.6: QA & Bug Fixes
**Assignee:** Both Agents + QA Agent

**End-to-End Test Scenarios**
| Scenario | Priority | Status |
|----------|----------|--------|
| Complete user journey: signup → generate → export | P0 | 📝 Pending |
| Edge case: empty inputs handled gracefully | P0 | 📝 Pending |
| Edge case: very long text (2000+ chars) | P0 | 📝 Pending |
| Edge case: special characters in input | P0 | 📝 Pending |
| Edge case: Unicode/emojis in input | P1 | 📝 Pending |
| Concurrent slide generations | P0 | 📝 Pending |
| Network failure recovery | P0 | 📝 Pending |
| File upload edge cases | P0 | 📝 Pending |

**Cross-Browser Testing**
| Browser | Version | Priority | Status |
|---------|---------|----------|--------|
| Chrome | Latest | P0 | 📝 Pending |
| Safari | Latest | P0 | 📝 Pending |
| Firefox | Latest | P0 | 📝 Pending |
| Edge | Latest | P1 | 📝 Pending |

**Mobile Device Testing**
| Device | OS | Priority | Status |
|--------|-----|----------|--------|
| iPhone 14 Pro | iOS 17 | P0 | 📝 Pending |
| iPhone SE | iOS 17 | P0 | 📝 Pending |
| iPad Pro | iPadOS 17 | P0 | 📝 Pending |
| Samsung Galaxy S24 | Android 14 | P0 | 📝 Pending |
| Pixel 8 | Android 14 | P1 | 📝 Pending |

**Accessibility Audit (WCAG 2.1 AA)**
| Check | Tool/Method | Priority | Status |
|-------|-------------|----------|--------|
| Keyboard navigation works | Manual | P0 | 📝 Pending |
| Screen reader compatibility | NVDA/VoiceOver | P0 | 📝 Pending |
| Color contrast ratios (4.5:1) | Lighthouse/axe | P0 | 📝 Pending |
| Focus indicators visible | Visual | P0 | 📝 Pending |
| Form labels associated | axe | P0 | 📝 Pending |
| Alt text for images | axe | P0 | 📝 Pending |
| ARIA landmarks present | axe | P1 | 📝 Pending |

**Performance Optimization (Lighthouse 90+)**
| Metric | Target | Tool | Status |
|--------|--------|------|--------|
| Performance score | 90+ | Lighthouse | 📝 Pending |
| Accessibility score | 100 | Lighthouse | 📝 Pending |
| Best Practices score | 90+ | Lighthouse | 📝 Pending |
| SEO score | 90+ | Lighthouse | 📝 Pending |
| First Contentful Paint | < 1.8s | Lighthouse | 📝 Pending |
| Largest Contentful Paint | < 2.5s | Lighthouse | 📝 Pending |
| Time to Interactive | < 3.8s | Lighthouse | 📝 Pending |
| Cumulative Layout Shift | < 0.1 | Lighthouse | 📝 Pending |

**Security Review**
| Check | Priority | Status |
|-------|----------|--------|
| Auth endpoints secured | P0 | 📝 Pending |
| API endpoints protected | P0 | 📝 Pending |
| SQL injection prevention | P0 | 📝 Pending |
| XSS prevention | P0 | 📝 Pending |
| CSRF protection | P0 | 📝 Pending |
| File upload security | P0 | 📝 Pending |
| Rate limiting effective | P0 | 📝 Pending |
| Environment variables secure | P0 | 📝 Pending |

**Load Testing**
| Scenario | Target | Tool | Status |
|----------|--------|------|--------|
| Concurrent users (100) | No errors | k6/Artillery | 📝 Pending |
| Slide generation under load | < 10s avg | k6 | 📝 Pending |
| API response times | < 500ms | k6 | 📝 Pending |
| Database query performance | < 100ms | pg_stat_statements | 📝 Pending |

#### Story 3.7: Production Deployment
**Assignee:** Both Agents

| Test Case | Type | Priority | Status |
|-----------|------|----------|--------|
| Production environment variables configured | Validation | P0 | 📝 Pending |
| Supabase production project connected | Integration | P0 | 📝 Pending |
| Vercel deployment successful | Deployment | P0 | 📝 Pending |
| Custom domain connected | DNS | P0 | 📝 Pending |
| SSL certificate valid | Security | P0 | 📝 Pending |
| Sentry error tracking integrated | Monitoring | P0 | 📝 Pending |
| Analytics (Plausible) working | Monitoring | P1 | 📝 Pending |
| Database backups scheduled | Operations | P0 | 📝 Pending |
| README with deployment instructions | Documentation | P1 | 📝 Pending |
| Smoke tests pass in production | E2E | P0 | 📝 Pending |

#### Sprint 3 Screenshot Tests (Puppeteer MCP) - Final Validation
| Breakpoint | Page | Status |
|------------|------|--------|
| 1920x1080 | Settings Page | 📝 Pending |
| 768x1024 | Settings Page (Tablet) | 📝 Pending |
| 390x844 | Settings Page (Mobile) | 📝 Pending |
| 1920x1080 | Slide Regeneration UI | 📝 Pending |
| 1920x1080 | Export Options Panel | 📝 Pending |
| 1920x1080 | Version History | 📝 Pending |
| 1920x1080 | File Upload Interface | 📝 Pending |
| 390x844 | Complete Mobile Flow | 📝 Pending |

#### Sprint 3 Final Regression Checklist
*Run before production deployment*

- [ ] All unit tests passing (> 95% coverage)
- [ ] All integration tests passing
- [ ] All E2E critical path tests passing
- [ ] No P0 or P1 bugs open
- [ ] Cross-browser testing completed (Chrome, Safari, Firefox)
- [ ] Mobile responsive testing completed (iOS, Android)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance targets met (Lighthouse 90+)
- [ ] Security review passed
- [ ] Load testing completed
- [ ] AI generation quality validated (MECE, consulting tone)
- [ ] Export formats working (PNG, PPTX, PDF)
- [ ] File upload secure and functional
- [ ] Documentation complete
- [ ] Monitoring and error tracking active
- [ ] Database backups configured
- [ ] Smoke tests pass in production

#### Final Acceptance Criteria (All Sprints Complete)
- [ ] User can sign up, log in, reset password
- [ ] User can generate all 5 slide types
- [ ] Generated slides follow MECE structure
- [ ] Executive consulting tone maintained
- [ ] 16:9 preview renders correctly
- [ ] User can upload Excel/CSV files
- [ ] Data visualizations render in charts
- [ ] User can export PNG, PPTX, PDF
- [ ] User can regenerate and iterate slides
- [ ] User can view version history
- [ ] User can customize settings
- [ ] Application is mobile responsive
- [ ] Application meets WCAG 2.1 AA accessibility
- [ ] Application achieves Lighthouse 90+ scores
- [ ] Application passes security review
- [ ] Application deployed to production

---

## Screenshot Testing (Puppeteer MCP)

### Test Scenarios

#### Desktop Breakpoints
| Breakpoint | Width | Tests |
|------------|-------|-------|
| Large Desktop | 1920px | Full layout, all features |
| Desktop | 1440px | Standard layout |
| Laptop | 1280px | Compact layout |
| Tablet Landscape | 1024px | Adjusted layout |

#### Mobile Breakpoints
| Breakpoint | Width | Tests |
|------------|-------|-------|
| Tablet Portrait | 768px | Touch-friendly layout |
| Mobile Large | 428px | iPhone 14 Pro Max |
| Mobile | 390px | iPhone 14 |
| Mobile Small | 375px | iPhone SE |

### Screenshot Test Cases
1. **Homepage** - All breakpoints
2. **Form Input** - All breakpoints
3. **Slide Preview** - All breakpoints
4. **Export Options** - All breakpoints
5. **Loading States** - Desktop + Mobile
6. **Error States** - Desktop + Mobile

---

## Supabase Integration Testing

### Authentication Tests
| Test | Status |
|------|--------|
| User signup with email/password | 📝 Pending |
| User login with email/password | 📝 Pending |
| Password reset flow | 📝 Pending |
| OAuth login (Google) | 📝 Pending |
| Session persistence | 📝 Pending |
| Logout functionality | 📝 Pending |

### Data Persistence Tests
| Test | Status |
|------|--------|
| Save slide to database | 📝 Pending |
| Retrieve saved slides | 📝 Pending |
| Update slide metadata | 📝 Pending |
| Delete slide | 📝 Pending |
| User preferences persistence | 📝 Pending |

---

## API Endpoint Testing

### Core Endpoints
| Endpoint | Method | Tests | Status |
|----------|--------|-------|--------|
| /api/health | GET | 3 | ✅ Pass |
| /api/stats | GET | 2 | ✅ Pass |
| /api/templates | GET | 2 | ✅ Pass |
| /api/templates/:id | GET | 3 | ❌ Fail |
| /api/generate | POST | 13 | ✅ Pass |
| /api/export/pptx | POST | 3 | ✅ Pass |
| /api/export/pdf | POST | 3 | ⚠️ Partial |
| /slides/:id.png | GET | 2 | ✅ Pass |

---

## Regression Testing

### Pre-Deployment Checklist
*Run before each production deployment*

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] E2E critical path tests passing
- [ ] No P0 or P1 bugs open
- [ ] Performance benchmarks met
- [ ] Security scan passed
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed

---

## Performance Benchmarks

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Health Check | <100ms | 3ms | ✅ |
| Stats | <100ms | 2ms | ✅ |
| Templates List | <200ms | 3ms | ✅ |
| Generate (cached) | <100ms | 3ms | ✅ |
| Generate (AI) | <5s | ~6s | ❌ |
| PPTX Export | <1s | 30ms | ✅ |
| PDF Export | <2s | N/A | ⚠️ |

---

## Bug Tracking

See: [BUG_LOG.md](./BUG_LOG.md)

Current open bugs: 8 (2 Critical, 2 High, 2 Medium, 2 Low)

---

## Test Reports

### Previous Reports
- [V2 Quality Report](./tests/V2-QUALITY-REPORT.md) - February 5, 2026

### Current Sprint Report
*Pending sprint completion...*

---

## Notes

- This test plan is a living document
- Update as new features are added
- Mark tests as complete in each sprint
- File bugs immediately when discovered
