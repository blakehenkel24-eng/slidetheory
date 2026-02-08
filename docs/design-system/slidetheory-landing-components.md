# SlideTheory Landing Page Components
## Copy-Paste Ready React + Tailwind Components

---

## 🚀 Quick Start: Hero Section with Aurora Background

```tsx
// components/sections/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn("relative min-h-[90vh] flex items-center justify-center overflow-hidden", className)}>
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 opacity-60">
          <div 
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-aurora"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(13, 148, 136, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 60%, rgba(249, 115, 22, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 80%, rgba(20, 184, 166, 0.25) 0%, transparent 40%)
              `,
              filter: "blur(80px)",
            }}
          />
        </div>
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-medium text-teal-300">AI-Powered Slide Generation</span>
        </div>

        {/* Kinetic Typography Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="block overflow-hidden">
            <span className="block animate-slide-up">Generate slides</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block animate-slide-up animation-delay-100">
              that{" "}
              <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
                win deals
              </span>
            </span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-200">
          McKinsey-quality presentations in minutes, not hours. Built for strategy consultants who need to move fast.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-300">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-teal-500/25 transition-all hover:scale-105"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg rounded-full"
          >
            See Examples
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mt-16 animate-fade-in animation-delay-400">
          <p className="text-sm text-slate-500 mb-4">Trusted by consultants at</p>
          <div className="flex justify-center gap-8 opacity-50">
            {["McKinsey", "BCG", "Bain", "Deloitte", "Accenture"].map((company) => (
              <span key={company} className="text-slate-400 font-semibold text-sm">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add to globals.css:
      @keyframes aurora {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(2%, 2%) rotate(5deg); }
        66% { transform: translate(-1%, 1%) rotate(-3deg); }
      }
      @keyframes slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-aurora { animation: aurora 15s ease-in-out infinite; }
      .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
      .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      .animation-delay-100 { animation-delay: 0.1s; }
      .animation-delay-200 { animation-delay: 0.2s; }
      .animation-delay-300 { animation-delay: 0.3s; }
      .animation-delay-400 { animation-delay: 0.4s; }
      */}
    </section>
  );
}
```

---

## 🎴 Bento Grid Feature Section

```tsx
// components/sections/FeatureBento.tsx
"use client";

import { cn } from "@/lib/utils";
import { 
  Zap, 
  Palette, 
  Clock, 
  Shield, 
  BarChart3, 
  Sparkles 
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  size: "small" | "medium" | "large" | "wide";
  gradient?: string;
}

const features: Feature[] = [
  {
    id: "1",
    title: "AI-Powered Generation",
    description: "Transform your brief into a complete presentation in under 2 minutes with our advanced AI engine.",
    icon: Sparkles,
    size: "large",
    gradient: "from-teal-500/20 to-teal-600/10",
  },
  {
    id: "2",
    title: "Consultant-Grade Templates",
    description: "McKinsey, BCG, and Bain-quality frameworks built-in.",
    icon: Palette,
    size: "small",
  },
  {
    id: "3",
    title: "Time Saved",
    description: "Reduce slide creation time by 90%",
    icon: Clock,
    size: "small",
    gradient: "from-orange-500/20 to-orange-600/10",
  },
  {
    id: "4",
    title: "Enterprise Security",
    description: "SOC 2 Type II certified with end-to-end encryption for all your sensitive client data.",
    icon: Shield,
    size: "wide",
  },
  {
    id: "5",
    title: "Real-time Analytics",
    description: "Track engagement, time spent, and conversion metrics on every slide.",
    icon: BarChart3,
    size: "medium",
    gradient: "from-teal-500/20 to-orange-500/20",
  },
  {
    id: "6",
    title: "Lightning Fast",
    description: "Export to PowerPoint, Google Slides, or PDF in seconds.",
    icon: Zap,
    size: "medium",
  },
];

const sizeClasses = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 row-span-2",
  large: "col-span-2 row-span-2",
  wide: "col-span-2 row-span-1",
};

export function FeatureBento() {
  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-400 font-medium text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
              close faster
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                sizeClasses[feature.size],
                "group relative rounded-2xl border border-slate-800/50 overflow-hidden",
                "bg-slate-900/50 backdrop-blur-sm",
                "hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/10",
                "transition-all duration-300 p-6 flex flex-col"
              )}
            >
              {/* Gradient Background */}
              {feature.gradient && (
                <div 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    feature.gradient
                  )}
                />
              )}

              {/* Spotlight Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors">
                  <feature.icon className="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 💎 Glassmorphism Feature Cards

```tsx
// components/sections/GlassFeatures.tsx
"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface GlassFeature {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

const glassFeatures: GlassFeature[] = [
  {
    title: "For Consultants",
    description: "Built by consultants, for consultants",
    features: [
      "MECE framework templates",
      "Pyramid principle structuring",
      "Action title generation",
      "So-what synthesis",
    ],
    icon: "💼",
  },
  {
    title: "For Teams",
    description: "Scale quality across your organization",
    features: [
      "Shared template library",
      "Brand compliance checks",
      "Collaborative editing",
      "Version control",
    ],
    icon: "👥",
  },
  {
    title: "For Enterprise",
    description: "Security and control at scale",
    features: [
      "SSO & SAML integration",
      "Audit logs & analytics",
      "Custom AI training",
      "Dedicated support",
    ],
    icon: "🏢",
  },
];

export function GlassFeatures() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(at 40% 20%, #0D9488 0px, transparent 50%),
              radial-gradient(at 80% 0%, #F97316 0px, transparent 50%),
              radial-gradient(at 0% 50%, #14B8A6 0px, transparent 50%),
              radial-gradient(at 80% 50%, #FB923C 0px, transparent 50%),
              radial-gradient(at 0% 100%, #0F766E 0px, transparent 50%)
            `,
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-teal-400 font-medium text-sm uppercase tracking-wider">Use Cases</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Built for every stage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {glassFeatures.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative rounded-2xl p-8",
                "bg-white/5 backdrop-blur-xl",
                "border border-white/10",
                "hover:bg-white/10 hover:border-teal-500/30",
                "transition-all duration-300"
              )}
            >
              {/* Gradient Border on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 mb-6">{feature.description}</p>

              <ul className="space-y-3">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-teal-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 🎯 Animated CTA Section

```tsx
// components/sections/CTASection.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Animated Gradient Border Card */}
      <div className="max-w-4xl mx-auto">
        <div className="relative p-[2px] rounded-3xl overflow-hidden group">
          {/* Rotating Gradient Border */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-teal-500 via-orange-500 to-teal-500 animate-spin-slow opacity-75 group-hover:opacity-100 transition-opacity"
            style={{ animationDuration: "8s" }}
          />

          {/* Inner Content */}
          <div className="relative bg-slate-950 rounded-3xl p-12 md:p-16 text-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 rounded-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to transform your
                <span className="block bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
                  presentations?
                </span>
              </h2>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                Join thousands of consultants who've cut their slide creation time by 90%. 
                Start your free trial today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-teal-500/25 transition-all hover:scale-105 group/btn"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg rounded-full"
                >
                  Book a Demo
                </Button>
              </div>

              <p className="mt-6 text-sm text-slate-500">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add to globals.css:
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
      */}
    </section>
  );
}
```

---

## 🧭 Floating Navigation Header

```tsx
// components/layout/FloatingHeader.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Templates", href: "#templates" },
  { label: "Enterprise", href: "#enterprise" },
];

export function FloatingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3",
          "flex items-center gap-8",
          "transition-all duration-300",
          isScrolled
            ? "bg-slate-950/90 backdrop-blur-xl border border-slate-800/50 shadow-lg shadow-black/20"
            : "bg-slate-950/50 backdrop-blur-sm border border-white/5",
          "rounded-full max-w-3xl w-[calc(100%-2rem)]"
        )}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-white hidden sm:block">SlideTheory</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button 
            size="sm" 
            className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-4 hidden sm:flex"
          >
            Start Free
          </Button>
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-x-4 top-20 z-40 md:hidden",
          "bg-slate-950/95 backdrop-blur-xl border border-slate-800/50",
          "rounded-2xl p-6 shadow-xl",
          "transition-all duration-300",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-lg text-slate-300 hover:text-teal-400 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Button className="bg-teal-600 hover:bg-teal-500 text-white rounded-full mt-4">
            Start Free Trial
          </Button>
        </div>
      </div>
    </>
  );
}
```

---

## 🎨 Complete Page Assembly

```tsx
// app/page.tsx
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureBento } from "@/components/sections/FeatureBento";
import { GlassFeatures } from "@/components/sections/GlassFeatures";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <FloatingHeader />
      <HeroSection />
      <FeatureBento />
      <GlassFeatures />
      <CTASection />
    </main>
  );
}
```

---

## 📝 Required CSS (globals.css additions)

```css
/* animations */
@keyframes aurora {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(2%, 2%) rotate(5deg); }
  66% { transform: translate(-1%, 1%) rotate(-3deg); }
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-aurora {
  animation: aurora 15s ease-in-out infinite;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animation-delay-100 { animation-delay: 0.1s; }
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-400 { animation-delay: 0.4s; }

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
```

---

## 🎨 Color Reference

| Token | Value | Usage |
|-------|-------|-------|
| Teal Primary | `#0D9488` | Primary buttons, links, accents |
| Teal Light | `#14B8A6` | Hover states, gradients |
| Teal Dark | `#0F766E` | Dark mode accents |
| Orange Primary | `#F97316` | CTAs, highlights, gradients |
| Orange Light | `#FB923C` | Hover states, badges |
| Background | `#020617` (slate-950) | Page background |
| Card BG | `#0F172A` (slate-900) | Card backgrounds |
| Text Primary | `#FFFFFF` | Headlines |
| Text Secondary | `#94A3B8` (slate-400) | Body text |

---

## 📦 Dependencies

```bash
npm install lucide-react
# Already included: tailwindcss, clsx, tailwind-merge (cn utility)
```

---

*Components are fully typed, responsive, and ready to drop into your Next.js + shadcn/ui project.*
