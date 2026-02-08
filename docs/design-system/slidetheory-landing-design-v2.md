# SlideTheory Landing Page Design
## Conversion-Focused UI/UX System

---

## 1. DESIGN STRATEGY

### Conversion Hierarchy
1. **Immediate Value Recognition** (Hero: What + Who + Why in 3 seconds)
2. **Credibility Transfer** (Social proof from trusted firms)
3. **Risk Elimination** (Free trial, no CC, consultant-grade guarantee)
4. **Feature Clarity** (Bento grid with consultant-specific outcomes)
5. **Pricing Anchoring** (Simple tiers, clear value)

### Visual Direction
- **Clean, spacious layouts** (TalkNotes inspiration)
- **Bold, confident typography** (Aerotime inspiration)
- **Teal/Orange accent system** (SlideTheory brand)
- **High contrast CTAs** (conversion priority)

---

## 2. COLOR SYSTEM

### Primary Palette
```
Teal (Trust/AI/Professional):
- 50: #F0FDFA
- 100: #CCFBF1
- 500: #14B8A6
- 600: #0D9488 (Primary)
- 700: #0F766E
- 900: #134E4A

Orange (Action/Urgency/Results):
- 50: #FFF7ED
- 100: #FFEDD5
- 400: #FB923C
- 500: #F97316 (Accent)
- 600: #EA580C
- 700: #C2410C
```

### Neutral Palette
```
Background: #FFFFFF (Light mode) / #0F172A (Dark mode)
Surface: #F8FAFC (Cards)
Border: #E2E8F0
Text Primary: #0F172A
Text Secondary: #64748B
Text Muted: #94A3B8
```

### Usage Rules
- **60%** Neutral (white/light gray backgrounds)
- **30%** Teal (primary actions, trust elements)
- **10%** Orange (CTAs, highlights, urgency)

---

## 3. TYPOGRAPHY SYSTEM

### Font Stack
```css
--font-heading: 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

### Type Scale
| Token | Size | Weight | Line | Usage |
|-------|------|--------|------|-------|
| Display | 56px / 3.5rem | 800 | 1.1 | Hero headline |
| H1 | 48px / 3rem | 700 | 1.2 | Page titles |
| H2 | 36px / 2.25rem | 700 | 1.25 | Section headers |
| H3 | 24px / 1.5rem | 600 | 1.3 | Card titles |
| H4 | 20px / 1.25rem | 600 | 1.4 | Subsection |
| Body Large | 18px / 1.125rem | 400 | 1.6 | Lead text |
| Body | 16px / 1rem | 400 | 1.6 | Paragraphs |
| Small | 14px / 0.875rem | 500 | 1.5 | Labels, captions |
| Tiny | 12px / 0.75rem | 500 | 1.5 | Badges, metadata |

---

## 4. SPACING SYSTEM

### Base Unit: 4px
```
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
```

### Section Spacing
- **Section padding**: 96px (vertical) / 24px (horizontal mobile), 48px (desktop)
- **Container max-width**: 1280px
- **Card padding**: 24px - 32px
- **Element gaps**: 16px - 24px

---

## 5. COMPONENT SPECIFICATIONS

### 5.1 Navigation (Floating Island)

```tsx
<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
  {/* Glassmorphism pill */}
  <div className="
    flex items-center gap-8
    px-6 py-3
    bg-white/90 backdrop-blur-xl
    rounded-full
    border border-slate-200/50
    shadow-lg shadow-slate-900/5
  ">
    {/* Logo */}
    <a href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">S</span>
      </div>
      <span className="font-semibold text-slate-900 hidden sm:block">SlideTheory</span>
    </a>

    {/* Nav Links */}
    <div className="hidden md:flex items-center gap-6">
      <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Features</a>
      <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Pricing</a>
      <a href="#templates" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Templates</a>
    </div>

    {/* CTA */}
    <button className="
      bg-teal-600 hover:bg-teal-700
      text-white text-sm font-medium
      px-5 py-2 rounded-full
      transition-colors
    ">
      Start Free
    </button>
  </div>
</nav>
```

---

### 5.2 Hero Section

**Layout**: Centered, large typography, dual CTAs, social proof strip

```tsx
<section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
  {/* Subtle gradient background */}
  <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white -z-10" />
  
  <div className="max-w-5xl mx-auto px-6 text-center">
    {/* Eyebrow Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 border border-teal-200 mb-8">
      <Sparkles className="w-4 h-4 text-teal-600" />
      <span className="text-sm font-medium text-teal-700">AI-Powered for Strategy Consultants</span>
    </div>

    {/* Headline */}
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
      Build consultant-grade slides
      <span className="block mt-2 bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">
        in minutes, not hours
      </span>
    </h1>

    {/* Subheadline */}
    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
      Transform your strategy briefs into McKinsey-quality presentations. 
      Used by consultants at top firms to cut deck creation time by 90%.
    </p>

    {/* CTAs */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
      <button className="
        w-full sm:w-auto
        bg-gradient-to-r from-teal-600 to-teal-500
        hover:from-teal-500 hover:to-teal-400
        text-white font-semibold
        px-8 py-4 rounded-full
        shadow-lg shadow-teal-500/25
        transition-all hover:scale-105 hover:shadow-xl hover:shadow-teal-500/30
        flex items-center justify-center gap-2
      ">
        Generate Your First Deck
        <ArrowRight className="w-5 h-5" />
      </button>
      
      <button className="
        w-full sm:w-auto
        border-2 border-slate-300
        text-slate-700 font-semibold
        px-8 py-4 rounded-full
        hover:border-teal-500 hover:text-teal-600
        transition-colors
      ">
        See Examples
      </button>
    </div>

    {/* Trust Bar */}
    <div className="pt-8 border-t border-slate-200">
      <p className="text-sm text-slate-500 mb-4">Trusted by strategy consultants at</p>
      <div className="flex flex-wrap justify-center gap-8 opacity-60">
        {['McKinsey', 'BCG', 'Bain', 'Deloitte', 'Accenture'].map(firm => (
          <span key={firm} className="text-slate-400 font-semibold">{firm}</span>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

### 5.3 How It Works (3-Step Flow)

**Layout**: Horizontal steps with numbered badges

```tsx
<section className="py-24 bg-slate-50">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">How It Works</span>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
        From brief to boardroom in 3 steps
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      {[
        {
          step: '01',
          title: 'Dump your context',
          description: 'Paste your strategy brief, client notes, or raw ideas. No formatting needed.',
          icon: FileText
        },
        {
          step: '02',
          title: 'AI structures your story',
          description: 'Our AI applies MECE frameworks and the Pyramid Principle to build your narrative.',
          icon: Brain
        },
        {
          step: '03',
          title: 'Export & present',
          description: 'Get a polished deck in PowerPoint, Google Slides, or PDF—ready for your client.',
          icon: Presentation
        }
      ].map((item, i) => (
        <div key={i} className="relative">
          {/* Connector line */}
          {i < 2 && (
            <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-slate-200" />
          )}
          
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-block text-4xl font-bold text-teal-100 mb-4">{item.step}</span>
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
              <item.icon className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### 5.4 Feature Bento Grid

**Layout**: Asymmetric grid with varying card sizes

```tsx
<section className="py-24">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Features</span>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
        Everything you need to close faster
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[180px]">
      {/* Large card - AI Generation */}
      <div className="col-span-1 md:col-span-2 row-span-2 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <Sparkles className="w-10 h-10 mb-4" />
        <h3 className="text-2xl font-bold mb-3">AI-Powered Generation</h3>
        <p className="text-teal-100 leading-relaxed mb-6">
          Transform your brief into a complete presentation in under 2 minutes. 
          Our AI understands consulting frameworks and applies them automatically.
        </p>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="bg-white/20 px-3 py-1 rounded-full">MECE</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Pyramid Principle</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Action Titles</span>
        </div>
      </div>

      {/* Small card - Templates */}
      <div className="col-span-1 bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 transition-colors">
        <Layout className="w-8 h-8 text-teal-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Expert Templates</h3>
        <p className="text-sm text-slate-600">50+ consultant-grade templates</p>
      </div>

      {/* Small card - Export */}
      <div className="col-span-1 bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 transition-colors">
        <Download className="w-8 h-8 text-orange-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">One-Click Export</h3>
        <p className="text-sm text-slate-600">PPTX, Google Slides, PDF</p>
      </div>

      {/* Wide card - Security */}
      <div className="col-span-1 md:col-span-2 bg-slate-900 rounded-2xl p-6 text-white flex items-center gap-6">
        <div className="w-16 h-16 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-8 h-8 text-teal-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">Enterprise Security</h3>
          <p className="text-slate-400 text-sm">SOC 2 Type II certified. Your client data stays protected.</p>
        </div>
      </div>

      {/* Tall card - Time Saved */}
      <div className="col-span-1 row-span-2 bg-orange-50 rounded-2xl p-6 border border-orange-100 flex flex-col justify-between">
        <div>
          <Clock className="w-8 h-8 text-orange-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Time Saved</h3>
        </div>
        <div>
          <div className="text-5xl font-bold text-orange-600 mb-2">90%</div>
          <p className="text-slate-600 text-sm">Average reduction in deck creation time</p>
        </div>
      </div>

      {/* Medium card - Collaboration */}
      <div className="col-span-1 bg-white rounded-2xl p-6 border border-slate-200">
        <Users className="w-8 h-8 text-teal-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Team Collaboration</h3>
        <p className="text-slate-600 text-sm">Share, comment, and iterate with your team in real-time.</p>
      </div>
    </div>
  </div>
</section>
```

---

### 5.5 Pricing Section

**Layout**: Clean 2-tier comparison (Free/Pro), TalkNotes-style

```tsx
<section id="pricing" className="py-24 bg-slate-50">
  <div className="max-w-5xl mx-auto px-6">
    <div className="text-center mb-12">
      <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Pricing</span>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
        Simple, consultant-friendly pricing
      </h2>
      <p className="text-slate-600 max-w-2xl mx-auto">
        Start free. Upgrade when you're ready to supercharge your workflow.
      </p>
    </div>

    {/* Toggle */}
    <div className="flex justify-center items-center gap-3 mb-12">
      <span className="text-sm font-medium text-slate-900">Monthly</span>
      <button className="relative w-14 h-7 bg-teal-600 rounded-full">
        <span className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full" />
      </button>
      <span className="text-sm font-medium text-slate-900">Yearly</span>
      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Save 20%</span>
    </div>

    {/* Pricing Cards */}
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Free Plan */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
        <p className="text-slate-600 mb-6">For trying out SlideTheory</p>
        
        <div className="mb-8">
          <span className="text-4xl font-bold text-slate-900">$0</span>
          <span className="text-slate-500">/month</span>
        </div>

        <button className="w-full py-3 px-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-teal-500 hover:text-teal-600 transition-colors mb-8">
          Get Started Free
        </button>

        <ul className="space-y-4">
          {[
            '3 decks per month',
            'Basic templates',
            'Export to PPTX',
            'Email support'
          ].map(feature => (
            <li key={feature} className="flex items-center gap-3 text-slate-700">
              <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Pro Plan */}
      <div className="bg-white rounded-2xl p-8 border-2 border-teal-500 relative shadow-xl shadow-teal-500/10">
        {/* Popular Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            MOST POPULAR
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
        <p className="text-slate-600 mb-6">For serious consultants</p>
        
        <div className="mb-8">
          <span className="text-4xl font-bold text-slate-900">$29</span>
          <span className="text-slate-500">/month</span>
          <span className="block text-sm text-slate-400 mt-1">Billed yearly ($348)</span>
        </div>

        <button className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold rounded-xl transition-all hover:shadow-lg mb-8">
          Start Free Trial
        </button>

        <ul className="space-y-4">
          {[
            'Unlimited decks',
            'All 50+ templates',
            'Advanced AI features',
            'Priority support',
            'Team collaboration',
            'Custom branding'
          ].map(feature => (
            <li key={feature} className="flex items-center gap-3 text-slate-700">
              <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <p className="text-center text-sm text-slate-500 mt-6">
          14-day free trial • No credit card required
        </p>
      </div>
    </div>

    {/* Trust Note */}
    <p className="text-center text-sm text-slate-500 mt-8">
      Join 500+ consultants already saving hours every week
    </p>
  </div>
</section>
```

---

### 5.6 Social Proof / Testimonials

```tsx
<section className="py-24">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
        Loved by strategy consultants
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {[
        {
          quote: "SlideTheory cut my deck creation time from 6 hours to 45 minutes. Game changer for tight deadlines.",
          author: 'Sarah Chen',
          role: 'Senior Consultant',
          firm: 'McKinsey'
        },
        {
          quote: "The AI actually understands consulting frameworks. It's like having a first-year analyst who never sleeps.",
          author: 'James Miller',
          role: 'Manager',
          firm: 'BCG'
        },
        {
          quote: "My clients have noticed the difference. The slides look sharper, and I spend more time on strategy.",
          author: 'Emma Rodriguez',
          role: 'Independent Consultant',
          firm: 'Former Bain'
        }
      ].map((testimonial, i) => (
        <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
            ))}
          </div>
          <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
          <div>
            <p className="font-semibold text-slate-900">{testimonial.author}</p>
            <p className="text-sm text-slate-500">{testimonial.role} • {testimonial.firm}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### 5.7 Final CTA Section

```tsx
<section className="py-24 bg-slate-900">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
      Ready to transform your
      <span className="block text-teal-400">presentation workflow?</span>
    </h2>
    
    <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
      Join 500+ consultants who've already cut their deck creation time by 90%.
      Start your free trial today.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button className="
        w-full sm:w-auto
        bg-gradient-to-r from-teal-600 to-teal-500
        hover:from-teal-500 hover:to-teal-400
        text-white font-semibold
        px-10 py-4 rounded-full
        text-lg
        shadow-lg shadow-teal-500/25
        transition-all hover:scale-105
      ">
        Start Free Trial
      </button>
      
      <button className="
        w-full sm:w-auto
        border border-slate-600
        text-slate-300 font-semibold
        px-10 py-4 rounded-full
        hover:border-teal-500 hover:text-teal-400
        transition-colors
      ">
        Schedule Demo
      </button>
    </div>

    <p className="text-sm text-slate-500 mt-8">
      14-day free trial • No credit card required • Cancel anytime
    </p>
  </div>
</section>
```

---

### 5.8 Footer

```tsx
<footer className="py-12 border-t border-slate-200">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      {/* Brand */}
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-slate-900">SlideTheory</span>
        </div>
        <p className="text-sm text-slate-500">
          AI-powered slide generation for strategy consultants.
        </p>
      </div>

      {/* Product */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Features</a></li>
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Pricing</a></li>
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Templates</a></li>
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Changelog</a></li>
        </ul>
      </div>

      {/* Company */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="text-slate-600 hover:text-teal-600">About</a></li>
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Blog</a></li>
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Careers</a></li>
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Contact</a></li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Privacy</a></li>
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Terms</a></li>
          <li><a href="#" className="text-slate-600 hover:text-teal-600">Security</a></li>
        </ul>
      </div>
    </div>

    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-slate-500">© 2026 SlideTheory. All rights reserved.</p>
      <div className="flex gap-4">
        {/* Social icons */}
        <a href="#" className="text-slate-400 hover:text-slate-600">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="#" className="text-slate-400 hover:text-slate-600">
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </div>
  </div>
</footer>
```

---

## 6. ANIMATION SPECIFICATIONS

### Page Load Sequence
```
0ms:    Navigation fades in
200ms:  Hero eyebrow badge slides up + fades
400ms:  Hero headline words stagger in
600ms:  Hero subheadline fades in
800ms:  CTA buttons fade in + slide up
1000ms: Trust bar fades in
```

### Scroll Animations
- **Sections**: Fade in + translate Y (20px) when entering viewport
- **Cards**: Stagger delay 100ms between items in grid
- **Numbers**: Count up animation for stats

### Hover States
- **Buttons**: Scale 1.02, shadow increase, 200ms ease
- **Cards**: Translate Y -4px, shadow increase, border color change
- **Links**: Color transition to teal, 150ms

---

## 7. RESPONSIVE BREAKPOINTS

```
Mobile:     < 640px   (Single column, stacked)
Tablet:     640px+    (2 columns, adjusted spacing)
Desktop:    1024px+   (Full layout)
Large:      1280px+   (Max container width)
```

---

## 8. IMPLEMENTATION CHECKLIST

- [ ] Install Inter font (Google Fonts or local)
- [ ] Add custom animations to globals.css
- [ ] Implement Navigation component
- [ ] Build Hero section
- [ ] Create How It Works section
- [ ] Build Feature Bento grid
- [ ] Implement Pricing section
- [ ] Add Testimonials
- [ ] Build CTA section
- [ ] Create Footer
- [ ] Add scroll animations (Framer Motion or CSS)
- [ ] Test all breakpoints
- [ ] Verify contrast ratios (WCAG AA)
- [ ] Add loading states
- [ ] Test keyboard navigation
