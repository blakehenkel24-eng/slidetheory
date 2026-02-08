# SlideTheory Landing Page Design Trends 2026

## Context
- **Product**: SlideTheory - AI-powered slide generator for strategy consultants
- **Current Palette**: Teal (#0D9488) + Orange (#F97316)
- **Target**: Professional but visually striking, memorable
- **Tech Stack**: Tailwind CSS + React

---

## 1. Animated Mesh Gradient Background
**Concept**: Dynamic, organic flowing gradients that shift and morph subtly

**Visual Description**:
- Multi-stop gradient mesh using teal-to-orange spectrum
- Soft, blob-like shapes that slowly animate (20-30s cycle)
- Creates depth without being distracting
- Perfect for hero section backdrop

**Color Stops**:
```
#0D9488 (teal-primary)
#14B8A6 (teal-light)
#F97316 (orange-primary)
#FB923C (orange-light)
#0F766E (teal-dark)
```

**CSS/Tailwind**:
```css
/* Custom animation */
@keyframes mesh-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.mesh-gradient {
  background: 
    radial-gradient(at 40% 20%, #0D9488 0px, transparent 50%),
    radial-gradient(at 80% 0%, #F97316 0px, transparent 50%),
    radial-gradient(at 0% 50%, #14B8A6 0px, transparent 50%),
    radial-gradient(at 80% 50%, #FB923C 0px, transparent 50%),
    radial-gradient(at 0% 100%, #0F766E 0px, transparent 50%);
  background-size: 200% 200%;
  animation: mesh-shift 20s ease infinite;
}
```

---

## 2. Aurora Borealis Effect
**Concept**: Ethereal, flowing light ribbons across dark background

**Visual Description**:
- Dark navy/slate base (#0F172A or #1E293B)
- Glowing teal and orange ribbons that wave gently
- Subtle opacity (15-30%) so it doesn't overpower content
- Creates premium, futuristic feel

**Implementation**:
```css
.aurora {
  background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
  position: relative;
  overflow: hidden;
}

.aurora::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(13, 148, 136, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(249, 115, 22, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(20, 184, 166, 0.2) 0%, transparent 40%);
  animation: aurora-flow 15s ease-in-out infinite;
  filter: blur(60px);
}

@keyframes aurora-flow {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(2%, 2%) rotate(5deg); }
  66% { transform: translate(-1%, 1%) rotate(-3deg); }
}
```

---

## 3. Glassmorphism Feature Cards
**Concept**: Frosted glass effect with subtle borders and depth

**Visual Description**:
- Semi-transparent white background (bg-white/10 or bg-white/5)
- Backdrop blur effect (backdrop-blur-xl)
- Subtle border (border-white/20)
- Soft shadow for depth
- Hover: border brightens, slight scale up

**Tailwind Classes**:
```jsx
<div className="
  bg-white/10 
  backdrop-blur-xl 
  border border-white/20 
  rounded-2xl 
  p-6 
  shadow-xl 
  hover:bg-white/15 
  hover:border-teal-400/30 
  hover:scale-[1.02]
  transition-all duration-300
">
  {/* Card content */}
</div>
```

**Dark Variant** (for contrast sections):
```jsx
<div className="
  bg-slate-900/60 
  backdrop-blur-xl 
  border border-teal-500/20 
  rounded-2xl 
  p-6 
  shadow-2xl
">
```

---

## 4. Bento Grid Layout
**Concept**: Asymmetric grid inspired by Apple's Bento UI

**Visual Description**:
- Grid with varying card sizes (1x1, 2x1, 1x2, 2x2)
- Clean white cards on subtle gray background
- Cards have rounded corners (rounded-2xl or rounded-3xl)
- Mix of solid and glassmorphism cards
- Subtle shadows create depth hierarchy

**Grid Structure**:
```jsx
<div className="grid grid-cols-4 gap-4 auto-rows-[180px]">
  <div className="col-span-2 row-span-2">{/* Large feature */}</div>
  <div className="col-span-1 row-span-1">{/* Small stat */}</div>
  <div className="col-span-1 row-span-2">{/* Tall card */}</div>
  <div className="col-span-2 row-span-1">{/* Wide card */}</div>
  <div className="col-span-1 row-span-1">{/* Small stat */}</div>
</div>
```

---

## 5. Gradient Border Cards
**Concept**: Cards with animated gradient borders

**Visual Description**:
- Card appears to have a flowing gradient border
- Teal to orange gradient that rotates around the edge
- Inner content area is solid (white or dark)
- Creates visual interest without being chaotic

**Implementation**:
```jsx
<div className="relative p-[2px] rounded-2xl overflow-hidden group">
  {/* Animated gradient border */}
  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-orange-500 to-teal-500 
                  animate-spin-slow rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity">
  </div>
  
  {/* Card content */}
  <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 h-full">
    {/* Content here */}
  </div>
</div>

/* Add to CSS */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
```

---

## 6. Kinetic Typography (Hero)
**Concept**: Text that animates on scroll or load with character/word staggering

**Visual Description**:
- Hero headline breaks into words/lines
- Each element fades in + slides up with staggered delay
- Accent words use gradient text (teal-to-orange)
- Subtle scale animation on scroll

**Tailwind + Framer Motion**:
```jsx
<h1 className="text-5xl md:text-7xl font-bold leading-tight">
  <span className="block overflow-hidden">
    <span className="block animate-slide-up">Generate slides</span>
  </span>
  <span className="block overflow-hidden">
    <span className="block animate-slide-up animation-delay-100">
      that <span className="bg-gradient-to-r from-teal-500 to-orange-500 
                          bg-clip-text text-transparent">win deals</span>
    </span>
  </span>
</h1>

/* CSS */
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}
.animation-delay-100 { animation-delay: 0.1s; }
```

---

## 7. Spotlight Hover Effect
**Concept**: Mouse-following spotlight glow on cards

**Visual Description**:
- Cards have a radial gradient that follows cursor position
- Creates a "flashlight" reveal effect
- Works great on dark-themed sections
- Adds interactivity without being overwhelming

**React + CSS Implementation**:
```jsx
const Card = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-slate-900 p-6"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }}
    >
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(13,148,136,0.15), transparent 40%)`
        }}
      />
      {/* Card content */}
    </div>
  );
};
```

---

## 8. Soft Neumorphism (Subtle)
**Concept**: Ultra-subtle 3D embossed effect for buttons/inputs

**Visual Description**:
- Light gray/off-white background
- Elements have both shadow and highlight
- Creates "pushed in" or "popped out" look
- Use sparingly for CTAs or feature highlights

**For Light Theme**:
```jsx
<button className="
  bg-gray-100 
  rounded-xl 
  px-6 py-3 
  shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff]
  hover:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]
  active:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]
  transition-shadow duration-200
">
  Get Started
</button>
```

---

## 9. Floating Island Navigation
**Concept**: Navigation that floats with blur background, detached from top

**Visual Description**:
- Nav bar has rounded-full or rounded-2xl shape
- Floats 16-24px from top of viewport
- Glassmorphism effect (blur + semi-transparent)
- Subtle shadow creates floating effect
- Stays visible on scroll with smooth transition

**Implementation**:
```jsx
<nav className="
  fixed top-4 left-1/2 -translate-x-1/2 z-50
  px-6 py-3
  bg-white/80 backdrop-blur-xl
  rounded-full
  border border-white/20
  shadow-lg shadow-black/5
  flex items-center gap-8
">
  <Logo className="h-8" />
  <div className="hidden md:flex gap-6">
    <a className="text-slate-600 hover:text-teal-600 transition-colors">Features</a>
    <a className="text-slate-600 hover:text-teal-600 transition-colors">Pricing</a>
    <a className="text-slate-600 hover:text-teal-600 transition-colors">Templates</a>
  </div>
  <button className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition-colors">
    Start Free
  </button>
</nav>
```

---

## 10. Teal-Orange Split Accent System
**Concept**: Strategic use of dual colors throughout UI

**Visual Description**:
- Teal (#0D9488) = Primary actions, trust, AI/tech
- Orange (#F97316) = Highlights, urgency, human/touch
- Gradient blends for transitions between concepts
- Use 60/30/10 rule: 60% neutral, 30% teal, 10% orange

**Color Application Guide**:
```
Primary Buttons:     bg-teal-600 hover:bg-teal-700
Secondary Buttons:   border-2 border-teal-600 text-teal-600
Accent Highlights:   text-orange-500 / bg-orange-500
Gradient CTAs:       bg-gradient-to-r from-teal-600 to-orange-500
Icons/Decorations:   Alternate teal/orange by feature
Links Hover:         text-teal-600 hover:text-orange-500
Success States:      text-teal-600
Attention/Warning:   text-orange-500
```

**Extended Palette**:
```
Teal Scale:
  Darkest: #134E4A (teal-900)
  Dark:    #0F766E (teal-700)
  Primary: #0D9488 (teal-600)
  Light:   #14B8A6 (teal-500)
  Lightest:#5EEAD4 (teal-300)

Orange Scale:
  Darkest: #9A3412 (orange-900)
  Dark:    #C2410C (orange-700)
  Primary: #F97316 (orange-500)
  Light:   #FB923C (orange-400)
  Lightest:#FDBA74 (orange-300)
```

---

## Implementation Priority

1. **Hero**: Aurora background + Kinetic typography
2. **Navigation**: Floating island style
3. **Features Section**: Bento grid with glassmorphism cards
4. **CTA Cards**: Gradient borders
5. **Feature Details**: Spotlight hover effects
6. **Buttons**: Teal-Orange split system

## Technical Notes for Frontend Developer

- All effects use standard CSS/Tailwind - no heavy libraries needed
- Framer Motion recommended for kinetic typography
- Consider `will-change: transform` for animated backgrounds
- Use `@media (prefers-reduced-motion: reduce)` for accessibility
- Mesh gradient animation can be GPU-intensive - test on lower-end devices
