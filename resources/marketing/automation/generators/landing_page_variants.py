# Landing Page Variant Generator for SlideTheory
# A/B testing different homepage versions

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from enum import Enum
import json
import uuid

class VariantType(Enum):
    HERO_FOCUS = "hero_focus"           # Big bold hero
    SOCIAL_PROOF = "social_proof"       # Testimonials upfront
    PROBLEM_AGITATION = "problem_agitation"  # Pain-point focused
    PRODUCT_LED = "product_led"         # Show the product
    STORY_DRIVEN = "story_driven"       # Narrative approach
    DATA_DRIVEN = "data_driven"         # Stats and metrics

class CTAStyle(Enum):
    PRIMARY = "primary"           # Get Started Free
    SOFT = "soft"                 # See How It Works
    URGENCY = "urgency"           # Limited Time
    RISK_REVERSAL = "risk_reversal"  # Try Risk-Free
    OUTCOME = "outcome"           # Build Better Decks

@dataclass
class HeroSection:
    headline: str
    subheadline: str
    cta_primary: str
    cta_secondary: Optional[str] = None
    social_proof: Optional[str] = None

@dataclass
class ValueProp:
    title: str
    description: str
    icon: str

@dataclass
class TestimonialSection:
    quote: str
    author: str
    title: str
    company: str
    metrics: Optional[str] = None

@dataclass
class LandingPageVariant:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    variant_type: VariantType = VariantType.HERO_FOCUS
    cta_style: CTAStyle = CTAStyle.PRIMARY
    
    # Sections
    hero: Optional[HeroSection] = None
    value_props: List[ValueProp] = field(default_factory=list)
    testimonials: List[TestimonialSection] = field(default_factory=list)
    
    # Copy
    headline_angles: List[str] = field(default_factory=list)
    objection_handlers: List[str] = field(default_factory=list)
    
    # Testing
    traffic_split: float = 0.5  # Default 50/50
    target_audience: str = ""
    hypothesis: str = ""


class LandingPageGenerator:
    """Generate A/B test variants for SlideTheory homepage"""
    
    # Core value propositions to rotate
    VALUE_PROPS = [
        ValueProp(
            title="Story-First Framework",
            description="Structure your narrative before touching a single slide. Our proven framework ensures your message lands every time.",
            icon="layout"
        ),
        ValueProp(
            title="Consultant-Grade Templates",
            description="Built by ex-McKinsey and BCG consultants. Every template follows the standards that close deals at top firms.",
            icon="file-text"
        ),
        ValueProp(
            title="Data Visualization That Persuades",
            description="Turn complex data into compelling visuals. From waterfalls to Mekkos, create charts that drive decisions.",
            icon="bar-chart-2"
        ),
        ValueProp(
            title="Collaborate in Real-Time",
            description="Work together seamlessly. Comments, version control, and approval workflows built for consulting teams.",
            icon="users"
        ),
        ValueProp(
            title="Brand Consistency at Scale",
            description="Lock in your brand standards. Automatic formatting ensures every deck looks professional, every time.",
            icon="shield"
        ),
        ValueProp(
            title="From Blank Page to Boardroom",
            description="Staring at a blank slide? Our AI-powered assistant helps you start strong and finish faster.",
            icon="zap"
        )
    ]
    
    # Headline formulas by variant type
    HEADLINES = {
        VariantType.HERO_FOCUS: [
            "Presentations That Close Deals",
            "The Presentation Platform Built for Consultants",
            "Stop Making Slides. Start Winning Clients.",
            "Finally, Presentation Software That Gets Consulting"
        ],
        VariantType.SOCIAL_PROOF: [
            "Trusted by Consultants at 500+ Firms",
            "Join 10,000+ Consultants Who've Closed $2B+ with Better Decks",
            "The Presentation Tool Top-Tier Firms Don't Want You to Know About"
        ],
        VariantType.PROBLEM_AGITATION: [
            "Tired of Losing Hours to Slide Formatting?",
            "Your Ideas Deserve Better Than PowerPoint",
            "Stop Letting Bad Decks Kill Great Strategies",
            "Why Do Your Best Ideas Die in Presentations?"
        ],
        VariantType.PRODUCT_LED: [
            "See Your Best Presentation in 5 Minutes",
            "The Deck You Wish You Had. Now Yours in Minutes.",
            "Build Board-Ready Decks Without the All-Nighters"
        ],
        VariantType.STORY_DRIVEN: [
            "Every Great Consulting Career Starts with a Great Story",
            "From Junior Analyst to Partner: The Presentation Secret",
            "How the Best Consultants Structure Their Thinking"
        ],
        VariantType.DATA_DRIVEN: [
            "47% Higher Win Rates. 60% Less Prep Time.",
            "The Numbers Don't Lie: Better Decks = Better Outcomes",
            "Join Firms Seeing 3x Engagement in Client Meetings"
        ]
    }
    
    SUBHEADLINES = {
        VariantType.HERO_FOCUS: "Create consulting-grade presentations in half the time. Built by the people who've pitched to Fortune 500 boards.",
        VariantType.SOCIAL_PROOF: "From solo practitioners to global consulting firms, professionals trust SlideTheory to deliver their most important presentations.",
        VariantType.PROBLEM_AGITATION: "You spend 20+ hours on decks that clients barely remember. There's a better way—and it starts with your narrative, not your template.",
        VariantType.PRODUCT_LED: "Our AI-powered platform combines McKinsey-grade frameworks with beautiful design. Import your content, choose your story, export perfection.",
        VariantType.STORY_DRIVEN: "The difference between good consultants and great ones? They know presentation is storytelling. We'll teach you the framework that wins.",
        VariantType.DATA_DRIVEN: "SlideTheory users report faster prep times, higher win rates, and more confident deliveries. See why data-driven consultants make the switch."
    }
    
    CTAS = {
        CTAStyle.PRIMARY: {"primary": "Start Free Trial", "secondary": "Watch Demo"},
        CTAStyle.SOFT: {"primary": "See How It Works", "secondary": "View Templates"},
        CTAStyle.URGENCY: {"primary": "Get 50% Off First Month", "secondary": "Learn More"},
        CTAStyle.RISK_REVERSAL: {"primary": "Try Free for 14 Days", "secondary": "No Credit Card Required"},
        CTAStyle.OUTCOME: {"primary": "Build My Winning Deck", "secondary": "See Examples"}
    }
    
    OBJECTIONS = [
        "\"I don't have time to learn new software\" → Get productive in under 30 minutes with our guided onboarding",
        "\"My firm has strict brand guidelines\" → Import your brand kit once—automatic compliance forever",
        "\"I already have templates\" → Our templates think with you, not just for you. AI-powered suggestions as you build",
        "\"PowerPoint works fine\" → SlideTheory exports to PPTX. Use our tools, deliver in their format",
        "\"It's too expensive\" → One closed deal pays for a year. Most users see ROI in their first pitch"
    ]
    
    TESTIMONIALS = [
        TestimonialSection(
            quote="SlideTheory cut my deck prep time from 20 hours to 6. That extra day of sleep before the board meeting? Priceless.",
            author="Jennifer Walsh",
            title="Senior Manager",
            company="Deloitte",
            metrics="70% faster prep"
        ),
        TestimonialSection(
            quote="Our win rate jumped 40% after standardizing on SlideTheory. Clients actually compliment our presentations now.",
            author="Michael Torres",
            title="Partner",
            company="Atlas Consulting Group",
            metrics="40% higher win rate"
        ),
        TestimonialSection(
            quote="Finally, software that understands consulting. The SCQA framework alone is worth the subscription.",
            author="Rachel Kim",
            title="Engagement Manager",
            company="McKinsey & Company",
            metrics="Used on 50+ engagements"
        ),
        TestimonialSection(
            quote="I was skeptical. Then I built my best pitch deck ever in 3 hours instead of 2 days. Converted.",
            author="David Chen",
            title="Independent Consultant",
            company="Chen Strategy",
            metrics="First client closed in week 1"
        )
    ]
    
    def __init__(self):
        self.variants: List[LandingPageVariant] = []
    
    def generate_variant(self, variant_type: VariantType, 
                         cta_style: CTAStyle = CTAStyle.PRIMARY,
                         name: Optional[str] = None) -> LandingPageVariant:
        """Generate a landing page variant"""
        
        variant = LandingPageVariant(
            name=name or f"{variant_type.value}_{cta_style.value}",
            variant_type=variant_type,
            cta_style=cta_style,
            headline_angles=self.HEADLINES[variant_type][:2],
            objection_handlers=self.OBJECTIONS[:3]
        )
        
        # Create hero section
        cta = self.CTAS[cta_style]
        variant.hero = HeroSection(
            headline=self.HEADLINES[variant_type][0],
            subheadline=self.SUBHEADLINES[variant_type],
            cta_primary=cta["primary"],
            cta_secondary=cta.get("secondary"),
            social_proof="Join 10,000+ consultants"
        )
        
        # Add value props (rotate based on variant)
        start_idx = hash(variant_type.value) % len(self.VALUE_PROPS)
        for i in range(4):
            variant.value_props.append(self.VALUE_PROPS[(start_idx + i) % len(self.VALUE_PROPS)])
        
        # Add testimonials
        variant.testimonials = self.TESTIMONIALS[:2]
        
        # Set hypothesis
        variant.hypothesis = self._generate_hypothesis(variant_type, cta_style)
        variant.target_audience = "Consultants, strategy professionals, and client-facing executives"
        
        self.variants.append(variant)
        return variant
    
    def _generate_hypothesis(self, variant_type: VariantType, cta_style: CTAStyle) -> str:
        """Generate test hypothesis"""
        hypotheses = {
            (VariantType.HERO_FOCUS, CTAStyle.PRIMARY): "Direct value proposition with clear CTA will maximize trial signups",
            (VariantType.SOCIAL_PROOF, CTAStyle.SOFT): "Social proof upfront will build trust and reduce bounce rate",
            (VariantType.PROBLEM_AGITATION, CTAStyle.RISK_REVERSAL): "Pain-point focus with risk reversal will resonate with frustrated users",
            (VariantType.PRODUCT_LED, CTAStyle.OUTCOME): "Showing the product will increase qualified trial signups",
            (VariantType.DATA_DRIVEN, CTAStyle.PRIMARY): "Concrete metrics will appeal to analytical consultant mindset"
        }
        return hypotheses.get((variant_type, cta_style), 
                             f"Testing {variant_type.value} with {cta_style.value} CTA")
    
    def generate_test_matrix(self) -> List[LandingPageVariant]:
        """Generate comprehensive A/B test matrix"""
        variants = []
        
        # Core variants to test
        test_combinations = [
            (VariantType.HERO_FOCUS, CTAStyle.PRIMARY, "Control"),
            (VariantType.HERO_FOCUS, CTAStyle.RISK_REVERSAL, "Risk Reversal Test"),
            (VariantType.SOCIAL_PROOF, CTAStyle.PRIMARY, "Social Proof Test"),
            (VariantType.PROBLEM_AGITATION, CTAStyle.OUTCOME, "Problem-Focused Test"),
            (VariantType.PRODUCT_LED, CTAStyle.SOFT, "Product Demo Test"),
            (VariantType.DATA_DRIVEN, CTAStyle.PRIMARY, "Metrics Test")
        ]
        
        for vtype, cta, name in test_combinations:
            variant = self.generate_variant(vtype, cta, name)
            variant.traffic_split = 1.0 / len(test_combinations)
            variants.append(variant)
        
        return variants
    
    def export_html(self, variant: LandingPageVariant) -> str:
        """Generate HTML structure for variant"""
        hero = variant.hero
        html = f"""<!DOCTYPE html>
<html>
<head>
    <title>{hero.headline} | SlideTheory</title>
    <meta name="description" content="{hero.subheadline[:160]}">
</head>
<body>
    <!-- Hero Section -->
    <section class="hero">
        <h1>{hero.headline}</h1>
        <p class="subheadline">{hero.subheadline}</p>
        <div class="cta-group">
            <button class="cta-primary">{hero.cta_primary}</button>
            {'<button class="cta-secondary">' + hero.cta_secondary + '</button>' if hero.cta_secondary else ''}
        </div>
        <p class="social-proof">{hero.social_proof}</p>
    </section>
    
    <!-- Value Props -->
    <section class="value-props">
        <h2>Why Consultants Choose SlideTheory</h2>
        <div class="props-grid">
"""
        for prop in variant.value_props:
            html += f"""
            <div class="prop-card">
                <span class="icon">{prop.icon}</span>
                <h3>{prop.title}</h3>
                <p>{prop.description}</p>
            </div>
"""
        
        html += """
        </div>
    </section>
    
    <!-- Testimonials -->
    <section class="testimonials">
        <h2>Trusted by Top Consultants</h2>
"""
        for t in variant.testimonials:
            html += f"""
        <blockquote>
            <p>"{t.quote}"</p>
            <footer>
                <strong>{t.author}</strong>, {t.title} at {t.company}
                {f'<span class="metrics">{t.metrics}</span>' if t.metrics else ''}
            </footer>
        </blockquote>
"""
        
        html += """
    </section>
    
    <!-- Objection Handlers -->
    <section class="faq">
        <h2>Common Questions</h2>
"""
        for obj in variant.objection_handlers:
            html += f"""        <div class="faq-item">
            <p>{obj}</p>
        </div>
"""
        
        html += """
    </section>
</body>
</html>"""
        
        return html
    
    def export_test_plan(self, variants: List[LandingPageVariant]) -> str:
        """Generate A/B test plan document"""
        plan = ["# SlideTheory Landing Page A/B Test Plan\n"]
        
        plan.append("## Test Overview")
        plan.append(f"- **Number of Variants:** {len(variants)}")
        plan.append(f"- **Primary Metric:** Trial Signup Rate")
        plan.append(f"- **Secondary Metrics:** Time on Page, CTA Click Rate, Trial-to-Paid Conversion")
        plan.append(f"- **Minimum Sample Size:** 1,000 visitors per variant")
        plan.append(f"- **Test Duration:** 2 weeks\n")
        
        plan.append("## Variants\n")
        for v in variants:
            plan.append(f"### {v.name} (ID: {v.id})")
            plan.append(f"- **Type:** {v.variant_type.value}")
            plan.append(f"- **CTA Style:** {v.cta_style.value}")
            plan.append(f"- **Traffic Split:** {v.traffic_split*100:.0f}%")
            plan.append(f"- **Hypothesis:** {v.hypothesis}")
            plan.append(f"- **Headline:** {v.hero.headline if v.hero else 'N/A'}")
            plan.append(f"- **Primary CTA:** {v.hero.cta_primary if v.hero else 'N/A'}\n")
        
        plan.append("## Success Criteria")
        plan.append("- 20%+ improvement in trial signup rate vs control")
        plan.append("- Statistically significant result (p < 0.05)")
        plan.append("- No degradation in trial-to-paid conversion")
        
        return "\n".join(plan)
    
    def export_json(self, variant: LandingPageVariant) -> str:
        """Export variant as JSON for CMS import"""
        return json.dumps({
            "id": variant.id,
            "name": variant.name,
            "type": variant.variant_type.value,
            "cta_style": variant.cta_style.value,
            "traffic_split": variant.traffic_split,
            "hypothesis": variant.hypothesis,
            "hero": {
                "headline": variant.hero.headline if variant.hero else "",
                "subheadline": variant.hero.subheadline if variant.hero else "",
                "cta_primary": variant.hero.cta_primary if variant.hero else "",
                "cta_secondary": variant.hero.cta_secondary if variant.hero else ""
            },
            "value_props": [{"title": v.title, "description": v.description} for v in variant.value_props],
            "testimonials": [{"quote": t.quote, "author": t.author} for t in variant.testimonials]
        }, indent=2)


# CLI Interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="SlideTheory Landing Page Variant Generator")
    parser.add_argument("--matrix", action="store_true", help="Generate full test matrix")
    parser.add_argument("--variant", choices=[v.value for v in VariantType], help="Generate specific variant")
    parser.add_argument("--html", action="store_true", help="Output HTML")
    parser.add_argument("--test-plan", action="store_true", help="Generate test plan")
    parser.add_argument("--list-variants", action="store_true", help="List variant types")
    
    args = parser.parse_args()
    
    generator = LandingPageGenerator()
    
    if args.list_variants:
        for v in VariantType:
            print(f"- {v.value}: {generator.HEADLINES[v][0][:50]}...")
    
    elif args.matrix:
        variants = generator.generate_test_matrix()
        if args.test_plan:
            print(generator.export_test_plan(variants))
        else:
            for v in variants:
                print(f"\n{v.name} ({v.id})")
                print(f"  Headline: {v.hero.headline}")
                print(f"  CTA: {v.hero.cta_primary}")
                print(f"  Hypothesis: {v.hypothesis}")
    
    elif args.variant:
        vtype = VariantType(args.variant)
        variant = generator.generate_variant(vtype)
        if args.html:
            print(generator.export_html(variant))
        else:
            print(generator.export_json(variant))
    
    else:
        print("Landing Page Generator - use --help for options")
