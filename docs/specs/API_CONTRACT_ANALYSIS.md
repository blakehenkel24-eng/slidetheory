# SlideTheory API Contract Analysis

## Problem: 400 "Invalid input" on `/api/generate`

---

## ROOT CAUSE IDENTIFIED

The V1 API has a **VALID slideType validation**, but all V1 form options match the backend constants.
The actual issue is likely one of:
1. Field name mismatch (frontend sends `targetAudience`, NOT `audience` for v1)
2. Missing required fields
3. String length validation failures

---

## COMPLETE API CONTRACT

### V1 Endpoint: `POST /api/generate`

| Field | Type | Required | Constraints | Frontend Field Name |
|-------|------|----------|-------------|---------------------|
| slideType | string | YES | Must be one of: `Executive Summary`, `Market Analysis`, `Financial Model`, `Competitive Analysis`, `Growth Strategy`, `Risk Assessment` | slideType |
| context | string | YES | Min 10, Max 2000 chars | context |
| targetAudience | string | YES | Any string | audience (mapped to targetAudience) |
| dataPoints | array | NO | Max 10 items | dataPoints (split by newlines) |
| framework | string | NO | Any string | framework |

### V2 Endpoint: `POST /api/generate-slide-v2`

| Field | Type | Required | Constraints | Frontend Field Name |
|-------|------|----------|-------------|---------------------|
| slideType | string | YES | Any string (no enum validation!) | slideType |
| context | string | YES | Min 10, Max 2000 chars | context |
| audience | string | YES | Any string | audience |
| keyTakeaway | string | YES | Min 5, Max 150 chars | keyTakeaway |
| presentationMode | string | NO | Must be: `presentation` or `read` | presentationMode |
| dataInput | string | NO | Any string | dataInput |

---

## KEY FINDINGS

### 1. Field Name Mismatch (CRITICAL)
- **Frontend V1** sends `targetAudience` (correct!)
- **Frontend V2** sends `audience` (correct!)
- Backend validator for v1 expects `targetAudience`
- Backend validator for v2 expects `audience`

This is actually CORRECT in the code - no mismatch here!

### 2. slideType Validation Difference
- **V1**: STRICT enum validation - MUST be one of the 6 SLIDE_TYPES
- **V2**: No enum validation - accepts ANY string

### 3. The Real Issue
Looking at valid SLIDE_TYPES:
```javascript
['Executive Summary', 'Market Analysis', 'Financial Model', 
 'Competitive Analysis', 'Growth Strategy', 'Risk Assessment']
```

These match the V1 form dropdown EXACTLY. So the 400 error is likely from:
- context < 10 characters
- missing targetAudience
- dataPoints being sent as wrong type

---

## WORKING CURL COMMANDS

### Test V1 (/api/generate) - Should Work
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "slideType": "Executive Summary",
    "context": "This is a test context that is definitely longer than ten characters to satisfy the minimum length requirement.",
    "targetAudience": "C-Suite",
    "dataPoints": ["Point 1", "Point 2"],
    "framework": "Pyramid Principle"
  }'
```

### Test V2 (/api/generate-slide-v2) - Should Work
```bash
curl -X POST http://localhost:3000/api/generate-slide-v2 \
  -H "Content-Type: application/json" \
  -d '{
    "slideType": "Horizontal Flow",
    "context": "This is a test context that is definitely longer than ten characters to satisfy the minimum length requirement.",
    "audience": "C-Suite/Board",
    "keyTakeaway": "Revenue growth of 25% positions us for Series B funding",
    "presentationMode": "presentation",
    "dataInput": "Revenue: $5.2M (+23%)"
  }'
```

---

## MINIMAL FIX NEEDED

If generation is failing, the most likely causes are:

1. **context too short** (< 10 chars)
2. **keyTakeaway too short** for V2 (< 5 chars)  
3. **Server not running** or wrong port
4. **Missing required field**

### Quick Debug Script
```bash
# Test with minimal valid payload
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "slideType": "Executive Summary",
    "context": "This context is long enough to pass validation requirements for the API endpoint.",
    "targetAudience": "C-Suite"
  }' -v
```

---

## VALIDATION MIDDLEWARE LOCATION

File: `/home/node/.openclaw/workspace/products/slidetheory/mvp/build/middleware/validator.js`

The validator uses a custom validation function (not Joi) defined in `rules` object.
Validation errors return:
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input",
  "errors": [
    { "field": "context", "message": "context must be at least 10 characters" }
  ]
}
```

---

## FILE REFERENCES

- Routes: `/home/node/.openclaw/workspace/products/slidetheory/mvp/build/routes/slide-routes.js`
- Frontend: `/home/node/.openclaw/workspace/products/slidetheory/mvp/build/public/app.js`
- Validator: `/home/node/.openclaw/workspace/products/slidetheory/mvp/build/middleware/validator.js`
- Constants: `/home/node/.openclaw/workspace/products/slidetheory/mvp/build/config/constants.js`
- HTML Form: `/home/node/.openclaw/workspace/products/slidetheory/mvp/build/public/index.html`
