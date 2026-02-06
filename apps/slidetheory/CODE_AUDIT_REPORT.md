# SlideTheory Code Quality Audit Report

**Date:** 2026-02-06  
**Scope:** Frontend application code, API routes, configuration, and file organization

---

## Executive Summary

The SlideTheory codebase is generally well-structured with clear separation of concerns. However, there are several opportunities for simplification, cleanup, and standardization that can improve maintainability and reduce bundle size.

**Overall Assessment:** Good foundation with room for optimization

---

## 1. Simplification Recommendations

### 🔴 HIGH PRIORITY

#### 1.1 Remove Unused Dependencies
**File:** `frontend/package.json`  
**Impact:** Bundle size reduction (~20-30KB), faster installs

**Unused packages detected:**
- `@hookform/resolvers` - Not used
- `react-hook-form` - Not used (forms use plain useState)
- `zod` - Not used (no schema validation)

**Action:**
```bash
npm uninstall @hookform/resolvers react-hook-form zod
```

---

#### 1.2 Fix Environment Variable Configuration
**File:** `frontend/next.config.mjs`  
**Impact:** Prevents build issues, removes redundancy

**Issues:**
1. `env` block is redundant - Next.js automatically exposes `NEXT_PUBLIC_*` vars
2. Hardcoded production URL in rewrites should use env var
3. TypeScript/ESLint ignore flags suggest code quality issues

**Recommended changes:**
```javascript
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Remove: env block (redundant)
  // Remove: typescript.ignoreBuildErrors (fix the errors instead)
  // Remove: eslint.ignoreDuringBuilds (fix linting issues)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_PROXY_URL || 'https://slidetheory.vercel.app'}/api/:path*`,
      },
    ];
  },
};
```

---

#### 1.3 Extract API Error Handling
**Files:** `frontend/lib/api.ts`, `frontend/app/api/generate-slide-v2/route.ts`  
**Impact:** DRY code, consistent error responses

**Current:** Error handling duplicated and slightly different across files
**Recommended:** Create centralized error utilities

```typescript
// lib/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return { success: false, error: error.message, code: error.code };
  }
  return { success: false, error: 'Internal server error', code: 'UNKNOWN' };
}
```

---

#### 1.4 Fix JSON Parsing Fragility
**File:** `frontend/app/api/generate-slide-v2/route.ts` (lines 70-90)  
**Impact:** More reliable AI response parsing

**Current:** Regex-based extraction is brittle
**Recommended:** Use a library like `jsonrepair` or structured output

```typescript
// Option 1: Use jsonrepair
import { jsonrepair } from 'jsonrepair';

// Option 2: Request JSON mode from AI
const completion = await openai.chat.completions.create({
  model: 'moonshot-v1-128k',
  messages: [...],
  response_format: { type: 'json_object' }, // If supported
});
```

---

### 🟡 MEDIUM PRIORITY

#### 2.1 Create Custom Hooks
**Impact:** Simplify components, improve reusability

**A. useSlideForm Hook**
```typescript
// hooks/use-slide-form.ts
export function useSlideForm() {
  const [formData, setFormData] = useState<GenerateSlideRequest>({...});
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileChange = useCallback((file: File) => {
    // File reading logic
  }, []);
  
  const isValid = formData.context.length >= 10 && formData.keyTakeaway.length >= 5;
  
  return { formData, setFormData, fileName, handleFileChange, isValid };
}
```

**B. useExport Hook**
```typescript
// hooks/use-export.ts
export function useExport(slideRef: RefObject<HTMLElement>, slideId: string) {
  const exportPNG = useCallback(async () => {...}, []);
  const exportPDF = useCallback(async () => {...}, []);
  return { exportPNG, exportPDF };
}
```

---

#### 2.2 Simplify Auth Modal State
**File:** `frontend/components/auth-modal.tsx`  
**Impact:** ~30 lines removed, simpler state management

**Current:** Duplicate state for login/signup
**Recommended:** Single form state with mode toggle

```typescript
// Instead of:
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [signupEmail, setSignupEmail] = useState("");
// ... etc

// Use:
const [formData, setFormData] = useState({
  email: '',
  password: '',
  name: ''
});
const [mode, setMode] = useState<'login' | 'signup'>('login');
```

---

#### 2.3 Add Barrel Exports
**Files:** Create `frontend/components/index.ts`, `frontend/hooks/index.ts`  
**Impact:** Cleaner imports

```typescript
// components/index.ts
export { SlideForm } from './slide-form';
export { SlidePreview } from './slide-preview';
export { Header } from './header';
export { AuthModal } from './auth-modal';

// Then import as:
import { SlideForm, SlidePreview, Header } from '@/components';
```

---

#### 2.4 Extract HTML Template
**File:** `frontend/app/api/generate-slide-v2/route.ts`  
**Impact:** ~80 lines removed from route, testable template

Move the HTML generation to a separate file:
```typescript
// lib/slide-template.ts
export function generateSlideHTML(content: SlideContent): string {
  // Template logic here
}
```

---

#### 2.5 Type Safety Improvements
**File:** `frontend/lib/types.ts`  
**Impact:** Better type inference, fewer `any` types

Add response types:
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export type GenerateSlideResponse = ApiResponse<{
  slide: SlideData;
}>;
```

---

### 🟢 LOW PRIORITY

#### 3.1 Consolidate UI Imports
**Impact:** Minor DX improvement

Create a UI index file for frequently used components:
```typescript
// components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Card, CardContent, CardHeader } from './card';
// etc
```

---

#### 3.2 Add Loading State Types
```typescript
// lib/types.ts
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

---

#### 3.3 File Upload Validation
**File:** `frontend/components/slide-form.tsx`  
**Current:** No file size or type validation beyond accept attribute
**Add:**
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['.csv', '.txt', '.json', '.xlsx', '.xls'];
```

---

## 2. Quick Wins (Can Do Immediately)

| # | Task | File(s) | Effort | Impact |
|---|------|---------|--------|--------|
| 1 | Remove unused deps | `package.json` | 2 min | High |
| 2 | Fix next.config env | `next.config.mjs` | 5 min | High |
| 3 | Add barrel exports | `components/index.ts` | 5 min | Medium |
| 4 | Extract HTML template | New file + route | 10 min | Medium |
| 5 | Consolidate auth state | `auth-modal.tsx` | 15 min | Medium |
| 6 | Add file size validation | `slide-form.tsx` | 5 min | Low |

---

## 3. Code Quality Issues Found

### 3.1 Duplicate Form Validation
**Location:** `slide-form.tsx` (client) and `route.ts` (server)  
Validation logic is duplicated. Consider sharing a validation function.

### 3.2 Missing Error Boundaries
No error boundaries exist for component error handling.

### 3.3 Console Errors in Production
Both `api.ts` and `route.ts` have `console.error` that should be proper logging.

### 3.4 `dangerouslySetInnerHTML` Without Sanitization
**File:** `slide-preview.tsx` line 140  
Though content comes from AI, consider basic sanitization.

### 3.5 Missing `key` Prop Warning Potential
In `slide-form.tsx`, SelectItem children have complex JSX that may cause key warnings.

---

## 4. File Organization Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| Folder Structure | ✅ Good | Clear separation of concerns |
| Naming | ✅ Good | Consistent kebab-case |
| Component Size | ⚠️ Okay | slide-preview.tsx is borderline |
| Dead Code | ⚠️ Okay | Unused dependencies |
| Barrel Exports | ❌ Missing | Would improve imports |

---

## 5. Dependency Analysis

### Currently Used (Keep)
- `next`, `react`, `react-dom` - Core
- `@radix-ui/*` - UI primitives
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `html2canvas`, `jspdf` - Export functionality
- `@supabase/*` - Auth
- `openai` - AI integration

### Potentially Unused (Verify)
- `@hookform/resolvers` - Form validation
- `react-hook-form` - Form management
- `zod` - Schema validation

### Consider Adding
- `jsonrepair` - More robust JSON parsing from AI

---

## 6. Recommended Action Plan

### Week 1 (Quick Wins)
1. Remove unused dependencies
2. Fix next.config.mjs
3. Add barrel exports
4. Extract HTML template

### Week 2 (Refactoring)
1. Create useSlideForm hook
2. Simplify auth-modal state
3. Add centralized error handling

### Week 3 (Polish)
1. Fix JSON parsing reliability
2. Add error boundaries
3. Improve type safety

---

## Summary

| Category | Count |
|----------|-------|
| High Priority | 4 |
| Medium Priority | 5 |
| Low Priority | 3 |
| Quick Wins | 6 |
| Est. LOC Removed | ~150-200 |
| Est. Bundle Savings | ~25-35KB |

The codebase is in good shape overall. The main opportunities are:
1. Removing unused dependencies
2. Standardizing error handling
3. Creating custom hooks for form/export logic
4. Improving the AI JSON parsing reliability

**Estimated effort:** 1-2 days of focused work for all improvements.
