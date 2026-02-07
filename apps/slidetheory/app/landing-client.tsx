"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Zap, 
  Layout, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Play,
  Star,
  Quote,
  TrendingUp,
  Users,
  Clock,
  Shield,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";

// Animation hook
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
}

// Animated counter
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Navigation
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/60" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              ◆
            </div>
            <span className="font-bold text-xl text-slate-900">SlideTheory</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              How it Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Testimonials
            </Link>
            <Link 
              href="/app" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all hover:scale-105"
            >
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="#features" 
                className="block text-base font-medium text-slate-600 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="block text-base font-medium text-slate-600 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link 
                href="#testimonials" 
                className="block text-base font-medium text-slate-600 hover:text-slate-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link 
                href="/app" 
                className="block w-full text-center px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Launch App
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2394a3b8%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-blue-700">Now in Early Access</span>
          </div>

          {/* Headline */}
          <h1 
            className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Consultant-quality slides{" "}
            <span className="gradient-text">in 30 seconds</span>
          </h1>

          {/* Subheadline */}
          <p 
            className={`text-xl lg:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Generate McKinsey, Bain, BCG-quality slides using AI. Perfectly structured for your context, audience, and data.
          </p>

          {/* CTAs */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link 
              href="/app"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-700 font-semibold text-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <Play className="w-5 h-5 text-blue-500" />
              Watch Demo
            </a>
          </div>

          {/* Trust Badges */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-500 transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-medium">Trusted by consultants from McKinsey, Bain, BCG</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div 
          className={`mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            { value: 50000, suffix: "+", label: "Slides Generated" },
            { value: 1000, suffix: "+", label: "Consultants" },
            { value: 30, suffix: "s", label: "Avg. Generation Time" },
            { value: 99, suffix: "%", label: "Satisfaction Rate" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-slate-400" />
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const [ref, isInView] = useInView();

  const features = [
    {
      icon: Zap,
      title: "AI Slide Generation",
      description: "Describe what you need, get a consultant-quality slide in 30 seconds. Trained on MBB best practices.",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: Layout,
      title: "Proven Frameworks",
      description: "Executive summaries, 2x2 matrices, issue trees — structures that work at top consulting firms.",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Target,
      title: "Audience Optimization",
      description: "Automatically adjusts tone and detail level for C-suite, working teams, or board presentations.",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security. Your data is encrypted and never used to train models without consent.",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: Clock,
      title: "Instant Iteration",
      description: "Not quite right? Regenerate, refine, or adjust with natural language feedback in seconds.",
      color: "from-rose-400 to-rose-600",
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "Our models improve with every slide. The more you use it, the better it understands your style.",
      color: "from-cyan-400 to-cyan-600",
    },
  ];

  return (
    <section id="features" ref={ref} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Everything you need for{" "}
            <span className="gradient-text">consultant-quality slides</span>
          </h2>
          <p className="text-xl text-slate-600">
            Built by consultants, for consultants. Every feature designed to save you time and elevate your work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const [ref, isInView] = useInView();

  const steps = [
    {
      number: "01",
      title: "Describe Your Slide",
      description: "Tell us what you need. Context, audience, key points — the more detail, the better the result.",
    },
    {
      number: "02",
      title: "AI Generates Structure",
      description: "Our AI analyzes your input and selects the optimal framework: issue tree, executive summary, 2x2 matrix, and more.",
    },
    {
      number: "03",
      title: "Review & Refine",
      description: "Get a polished slide in seconds. Iterate with natural language feedback until it's perfect.",
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
            <Clock className="w-4 h-4" />
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Three steps to{" "}
            <span className="gradient-text">better slides</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 h-full">
                <div className="text-5xl font-bold text-slate-100 mb-6">{step.number}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const [ref, isInView] = useInView();

  const testimonials = [
    {
      quote: "SlideTheory cut my deck preparation time by 70%. The structure and insights are genuinely MBB-quality.",
      author: "Sarah Chen",
      role: "Senior Consultant, McKinsey",
      avatar: "SC",
    },
    {
      quote: "I was skeptical about AI-generated slides, but this actually understands consulting frameworks. Game changer.",
      author: "Marcus Johnson",
      role: "Engagement Manager, Bain",
      avatar: "MJ",
    },
    {
      quote: "Finally, a tool that speaks the language of strategy. My team uses this for every client presentation now.",
      author: "Emily Rodriguez",
      role: "Principal, BCG",
      avatar: "ER",
    },
  ];

  return (
    <section id="testimonials" ref={ref} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
            <Users className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Loved by{" "}
            <span className="gradient-text">top consultants</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className={`bg-slate-50 rounded-3xl p-8 border border-slate-100 transition-all duration-700 hover:shadow-lg ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Quote className="w-10 h-10 text-blue-200 mb-6" />
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.author}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const [ref, isInView] = useInView();

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to build{" "}
            <span className="text-blue-400">better slides?</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of strategy consultants who've transformed their workflow with SlideTheory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/app"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-semibold text-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
              Start Creating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Free tier available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-slate-950 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                ◆
              </div>
              <span className="font-bold text-lg text-white">SlideTheory</span>
            </Link>
            <p className="text-slate-500 text-sm">
              AI-powered slide generation for strategy consultants.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-slate-500 hover:text-white text-sm transition-colors">Features</Link></li>
              <li><Link href="/app" className="text-slate-500 hover:text-white text-sm transition-colors">Launch App</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">About</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2026 SlideTheory. Built for consultants who move fast.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-600 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-slate-600 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Client Component
export function LandingClient() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
