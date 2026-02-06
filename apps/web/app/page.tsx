import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SlideTheory — AI Slides for Strategy Consultants",
  description: "Generate McKinsey, Bain, BCG-quality slides in 30 seconds. Built for strategy consultants and PE professionals.",
};

export default function LandingPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SlideTheory — AI Slides for Strategy Consultants</title>
        <meta name="description" content="Generate McKinsey, Bain, BCG-quality slides in 30 seconds. Built for strategy consultants and PE professionals.">
        <style>
          :root {
            --primary: #0f172a;
            --primary-light: #1e293b;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --accent-light: #dbeafe;
            --text: #0f172a;
            --text-secondary: #475569;
            --text-muted: #64748b;
            --bg: #ffffff;
            --bg-secondary: #f8fafc;
            --bg-tertiary: #f1f5f9;
            --border: #e2e8f0;
            --border-light: #f1f5f9;
            --success: #10b981;
            --success-light: #d1fae5;
            --radius-sm: 8px;
            --radius-md: 12px;
            --radius-lg: 16px;
            --radius-xl: 24px;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            --shadow-glow: 0 0 40px -10px rgba(59, 130, 246, 0.3);
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--bg);
            -webkit-font-smoothing: antialiased;
          }
          .bg-pattern {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.08), transparent),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(16, 185, 129, 0.05), transparent),
              radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 50%),
              radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.03) 0%, transparent 40%);
            pointer-events: none;
            z-index: -1;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          .animate-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
          .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
          .stagger-1 { transition-delay: 0.1s; }
          .stagger-2 { transition-delay: 0.2s; }
          .stagger-3 { transition-delay: 0.3s; }
          nav {
            position: fixed; top: 0; left: 0; right: 0;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(226, 232, 240, 0.6);
            z-index: 1000; padding: 0 24px;
          }
          .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; height: 68px; }
          .logo { font-size: 22px; font-weight: 800; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 6px; }
          .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), #60a5fa); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; }
          .nav-links { display: flex; gap: 32px; align-items: center; }
          .nav-links a { color: var(--text-secondary); text-decoration: none; font-size: 14px; font-weight: 500; }
          .nav-links a:hover { color: var(--text); }
          .nav-cta { background: var(--accent); color: white !important; padding: 10px 18px; border-radius: var(--radius-md); font-weight: 600; }
          .nav-cta:hover { background: var(--accent-hover); }
          .hero { padding: 120px 24px 60px; text-align: center; max-width: 1200px; margin: 0 auto; }
          .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.08)); color: var(--accent); padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 600; margin-bottom: 28px; border: 1px solid rgba(59, 130, 246, 0.2); animation: fadeInUp 0.6s ease; }
          .pulse-dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
          .hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 800; line-height: 1.08; letter-spacing: -2px; max-width: 850px; margin: 0 auto 20px; animation: fadeInUp 0.6s ease 0.1s both; }
          .gradient-text { background: linear-gradient(135deg, var(--accent) 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .hero-subtitle { font-size: clamp(17px, 2vw, 20px); color: var(--text-secondary); max-width: 580px; margin: 0 auto 32px; line-height: 1.6; animation: fadeInUp 0.6s ease 0.2s both; }
          .hero-ctas { display: flex; gap: 12px; justify-content: center; margin-bottom: 48px; flex-wrap: wrap; animation: fadeInUp 0.6s ease 0.3s both; }
          .btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 26px; border-radius: var(--radius-md); font-size: 15px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s ease; }
          .btn-primary { background: linear-gradient(135deg, var(--accent), #2563eb); color: white; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35); }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.45); }
          .btn-secondary { background: white; color: var(--text); border: 1px solid var(--border); }
          .trust-badge { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; animation: fadeInUp 0.6s ease 0.4s both; color: var(--text-muted); font-size: 13px; }
          .trust-stars { color: #fbbf24; }
          .demo-section { padding: 50px 24px 80px; background: linear-gradient(180deg, var(--bg) 0%, var(--bg-secondary) 50%, var(--bg) 100%); }
          .demo-section-header { text-align: center; max-width: 600px; margin: 0 auto 48px; }
          .demo-section-header h2 { font-size: clamp(28px, 3vw, 36px); font-weight: 800; margin-bottom: 12px; }
          .demo-section-header p { font-size: 17px; color: var(--text-secondary); }
          .features { padding: 70px 24px; background: var(--bg); }
          .section-header { text-align: center; max-width: 600px; margin: 0 auto 40px; }
          .section-label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); margin-bottom: 16px; }
          .section-header h2 { font-size: clamp(28px, 3vw, 36px); font-weight: 800; margin-bottom: 12px; }
          .section-header p { font-size: 18px; color: var(--text-secondary); }
          .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
          .feature-card { background: white; padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--border); transition: all 0.3s ease; }
          .feature-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--accent-light); }
          .feature-icon { width: 48px; height: 48px; background: linear-gradient(135deg, var(--accent), #60a5fa); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px; }
          .feature-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
          .feature-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
          .cta { padding: 70px 24px; background: linear-gradient(135deg, var(--primary) 0%, #0a0f1d 100%); text-align: center; color: white; }
          .cta h2 { font-size: clamp(28px, 3vw, 36px); font-weight: 800; margin-bottom: 12px; }
          .cta p { font-size: 17px; color: #94a3b8; margin-bottom: 32px; }
          footer { padding: 60px 24px 28px; background: var(--primary); color: white; }
          .footer-inner { max-width: 1100px; margin: 0 auto; }
          .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .footer-column h4 { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
          .footer-column a { font-size: 14px; color: #64748b; text-decoration: none; display: block; margin-bottom: 10px; }
          .footer-column a:hover { color: white; }
          @media (max-width: 768px) {
            .features-grid { grid-template-columns: 1fr; }
            .footer-top { grid-template-columns: 1fr; }
            .nav-links { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="bg-pattern"></div>
        <nav>
          <div class="nav-inner">
            <a href="/" class="logo">
              <div class="logo-icon">◆</div>
              SlideTheory
            </a>
            <div class="nav-links">
              <a href="#features">Features</a>
              <a href="#demo">Demo</a>
              <a href="/app">Launch App</a>
            </div>
          </div>
        </nav>

        <section class="hero">
          <div class="hero-badge">
            <span class="pulse-dot"></span>
            Now accepting early access
          </div>
          <h1>Consultant-quality slides<br>in <span class="gradient-text">30 seconds</span></h1>
          <p class="hero-subtitle">Generate McKinsey, Bain, BCG-quality slides using AI. Perfectly structured for your context, audience, and data.</p>
          <div class="hero-ctas">
            <a href="/app" class="btn btn-primary">Launch App →</a>
            <a href="#features" class="btn btn-secondary">Learn More</a>
          </div>
          <div class="trust-badge">
            <span>★★★★★</span>
            <span>Trusted by consultants from McKinsey, Bain, BCG</span>
          </div>
        </section>

        <section class="features" id="features">
          <div class="section-header">
            <div class="section-label">Features</div>
            <h2>Everything you need for consultant-quality slides</h2>
          </div>
          <div class="features-grid">
            <div class="feature-card animate-on-scroll stagger-1">
              <div class="feature-icon">⚡</div>
              <h3>AI Slide Generation</h3>
              <p>Describe what you need, get a consultant-quality slide in 30 seconds. Trained on MBB best practices.</p>
            </div>
            <div class="feature-card animate-on-scroll stagger-2">
              <div class="feature-icon">📐</div>
              <h3>Proven Frameworks</h3>
              <p>Executive summaries, 2x2 matrices, issue trees — structures that work at top consulting firms.</p>
            </div>
            <div class="feature-card animate-on-scroll stagger-3">
              <div class="feature-icon">🎯</div>
              <h3>Audience Optimization</h3>
              <p>Automatically adjusts tone and detail level for C-suite, working teams, or board presentations.</p>
            </div>
          </div>
        </section>

        <section class="cta">
          <h2>Ready to build better slides?</h2>
          <p>Join strategy consultants from top firms using SlideTheory.</p>
          <a href="/app" class="btn btn-primary">Launch App →</a>
        </section>

        <footer>
          <div class="footer-inner">
            <div class="footer-top">
              <div>
                <strong>SlideTheory</strong>
                <p style="color: #64748b; margin-top: 12px;">AI-powered slide generation for strategy consultants.</p>
              </div>
              <div class="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="/app">Launch App</a>
              </div>
              <div class="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Contact</a>
              </div>
              <div class="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
            <p style="color: #475569; font-size: 13px;">© 2026 SlideTheory. Built for consultants who move fast.</p>
          </div>
        </footer>

        <script>
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
          }, { threshold: 0.1 });
          document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        </script>
      </body>
      </html>
    `}} />
  );
}
