# SlideTheory Design System v2.0

## Design Philosophy

**"Consulting precision meets modern SaaS delight"**

Transform SlideTheory from a functional tool into an experience that feels like Notion, Linear, or Vercel — premium, fast, and visually stunning while maintaining the trust and professionalism consultants expect.

---

## Visual Direction

### Color Palette (Evolved)

**Primary - Electric Blue Evolution**
```
--blue-50: #eff6ff    (Background tints)
--blue-100: #dbeafe   (Hover states)
--blue-200: #bfdbfe   (Borders)
--blue-400: #60a5fa   (Icons, accents)
--blue-500: #3b82f6   (Primary actions)
--blue-600: #2563eb   (Hover)
--blue-700: #1d4ed8   (Active, emphasis)
--blue-900: #1e3a8a   (Deep accents)
```

**Neutral - Refined Slate**
```
--slate-50: #f8fafc   (Backgrounds)
--slate-100: #f1f5f9  (Cards, sections)
--slate-200: #e2e8f0  (Borders)
--slate-300: #cbd5e1  (Disabled)
--slate-400: #94a3b8  (Placeholder)
--slate-500: #64748b  (Secondary text)
--slate-600: #475569  (Body text)
--slate-700: #334155  (Headings)
--slate-800: #1e293b  (Strong emphasis)
--slate-900: #0f172a  (Primary text, dark)
```

**Accent - Emerald Success**
```
--emerald-400: #34d399 (Highlights)
--emerald-500: #10b981 (Success states)
--emerald-600: #059669 (Hover)
```

**Gradient Accents**
```
--gradient-hero: linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%)
--gradient-card: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)
--gradient-dark: linear-gradient(180deg, #0f172a 0%, #1e293b 100%)
```

---

## Typography

**Font Family**
```
Primary: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
Monospace: JetBrains Mono, 'Fira Code', monospace (for code/data)
```

**Type Scale**
```
--text-xs: 12px / 16px line-height / 500 weight
--text-sm: 14px / 20px / 400
--text-base: 16px / 24px / 400
--text-lg: 18px / 28px / 500
--text-xl: 20px / 30px / 600
--text-2xl: 24px / 32px / 700
--text-3xl: 30px / 36px / 700
--text-4xl: 36px / 40px / 800
--text-5xl: 48px / 48px / 800
--text-6xl: 60px / 60px / 800
--text-7xl: 72px / 72px / 800
```

---

## Spacing System

```
--space-0: 0
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
```

---

## Border Radius

```
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 24px
--radius-full: 9999px
```

---

## Shadows

```
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
--shadow-glow: 0 0 40px -10px rgba(59, 130, 246, 0.4)
--shadow-glow-lg: 0 0 60px -15px rgba(59, 130, 246, 0.5)
```

---

## Animations

### Durations
```
--duration-fast: 150ms
--duration-base: 200ms
--duration-slow: 300ms
--duration-slower: 500ms
```

### Easings
```
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)
```

### Key Animations

**Fade In Up**
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Scale In**
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**Slide In Right**
```css
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

**Pulse Glow**
```css
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0); }
}
```

**Shimmer**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

**Float**
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

## Component Patterns

### Buttons

**Primary Button**
- Background: gradient (blue-500 to blue-600)
- Text: white, font-semibold
- Padding: 12px 24px
- Border-radius: radius-lg
- Shadow: shadow-md on hover
- Transform: translateY(-1px) on hover
- Transition: all 200ms ease-out

**Secondary Button**
- Background: white
- Border: 1px solid slate-200
- Text: slate-700
- Hover: bg-slate-50, border-slate-300

**Ghost Button**
- Background: transparent
- Text: slate-600
- Hover: bg-slate-100

### Cards

**Feature Card**
- Background: white
- Border: 1px solid slate-200
- Border-radius: radius-xl
- Padding: space-6
- Shadow: shadow-sm
- Hover: shadow-lg, translateY(-4px), border-blue-200
- Transition: all 300ms ease-spring

**Glass Card**
- Background: rgba(255, 255, 255, 0.8)
- Backdrop-filter: blur(12px)
- Border: 1px solid rgba(255, 255, 255, 0.3)
- Shadow: shadow-lg

### Inputs

**Text Input**
- Background: white
- Border: 1px solid slate-200
- Border-radius: radius-lg
- Padding: 12px 16px
- Focus: ring-2 ring-blue-500, border-blue-500
- Placeholder: slate-400

**Textarea (Large)**
- Min-height: 120px
- Resize: vertical

### Navigation

**Header**
- Position: fixed
- Background: rgba(255, 255, 255, 0.9)
- Backdrop-filter: blur(20px)
- Border-bottom: 1px solid slate-200/60
- Height: 68px
- Z-index: 50

---

## Landing Page Structure

### Sections

1. **Hero Section**
   - Full viewport height (100vh)
   - Animated gradient background
   - Large headline with gradient text
   - Subheadline
   - CTA buttons with hover effects
   - Trust badges
   - Animated scroll indicator

2. **Social Proof Bar**
   - Logos of MBB firms
   - Stats: "10,000+ slides generated"
   - Horizontal scroll animation

3. **Demo/Interactive Section**
   - Live slide generation preview
   - Interactive before/after
   - Typewriter effect showing input

4. **Features Grid**
   - 6 feature cards in 3x2 grid
   - Icons with gradient backgrounds
   - Hover lift effects

5. **How It Works**
   - 3-step process
   - Animated step indicators
   - Visual examples

6. **Templates Showcase**
   - Horizontal scroll of slide templates
   - Hover to expand

7. **Testimonials**
   - Quote cards
   - Avatar + name + title

8. **Pricing/CTA Section**
   - Dark gradient background
   - Final CTA

9. **Footer**
   - Multi-column layout
   - Newsletter signup

---

## App Interface Structure

### Layout

**Header**
- Logo + navigation
- User menu (avatar, settings)
- Credits/usage indicator

**Main Workspace**
- Left panel (35%): Input form
- Right panel (65%): Preview
- Resizable panels
- Collapsible sections

### Input Panel

**Progressive Disclosure**
1. **Context Section** (expanded by default)
   - Context textarea
   - Audience selector (chips)
   - Objective dropdown

2. **Data Section** (collapsible)
   - File upload zone (drag & drop)
   - Manual data input toggle

3. **Advanced Options** (collapsible)
   - Tone selector
   - Layout preference
   - Brand voice

**Generate Button**
- Full width at bottom
- Animated state (idle → loading → success)
- Progress indicator

### Preview Panel

**Toolbar**
- Layout selector (dropdown)
- Download options
- Regenerate button
- Fullscreen toggle

**Slide Canvas**
- 16:9 aspect ratio maintained
- Smooth transitions between slides
- Zoom controls
- Pan on overflow

**Empty State**
- Illustrated placeholder
- Sample prompts to try
- "Generate your first slide" CTA

---

## Micro-interactions

### Loading States
- Skeleton screens
- Pulse animations
- Progress bars for generation
- "Thinking..." with animated dots

### Success States
- Checkmark animation
- Confetti for first slide
- Toast notifications
- Smooth slide-in of results

### Hover Effects
- Cards: lift + shadow
- Buttons: glow + translateY
- Links: underline animation
- Images: subtle zoom

### Focus States
- Ring with offset
- Smooth transition
- High contrast

---

## Responsive Breakpoints

```
sm: 640px   (Mobile landscape)
md: 768px   (Tablet)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
2xl: 1536px (Extra large)
```

### Mobile Adaptations
- Stack panels vertically
- Bottom sheet for preview
- Simplified navigation
- Touch-friendly tap targets (min 44px)
- Swipe gestures for slide navigation

---

## Accessibility

- WCAG 2.1 AA compliance
- Focus indicators on all interactive elements
- Color contrast ratios ≥ 4.5:1
- Screen reader labels
- Keyboard navigation
- Reduced motion support
- Alt text for images

---

## Implementation Priority

### Phase 1: Foundation
1. Update globals.css with new design tokens
2. Create shared animation components
3. Update color system

### Phase 2: Landing Page
1. Redesign hero section with animations
2. Add social proof section
3. Rebuild features grid
4. Add testimonials

### Phase 3: App Interface
1. Redesign input panel with progressive disclosure
2. Enhance preview panel
3. Add micro-interactions
4. Improve empty states

### Phase 4: Polish
1. Add dark mode
2. Performance optimization
3. Animation refinement
4. Mobile responsiveness

---

## Success Metrics

- **Visual Appeal**: Feels premium, modern, trustworthy
- **UX Flow**: Clear hierarchy, intuitive navigation
- **Performance**: Fast load times, smooth animations (60fps)
- **Accessibility**: Passes WCAG AA, usable with keyboard/screen reader
- **Brand**: Consistent, memorable, differentiated
