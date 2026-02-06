# Case Study Builder for SlideTheory
# Template system for creating compelling customer success stories

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum
import json
import uuid

class Industry(Enum):
    TECHNOLOGY = "Technology"
    FINANCE = "Financial Services"
    HEALTHCARE = "Healthcare"
    CONSULTING = "Consulting"
    RETAIL = "Retail & E-commerce"
    ENERGY = "Energy & Utilities"
    MANUFACTURING = "Manufacturing"
    PHARMA = "Pharmaceuticals"

class CompanySize(Enum):
    STARTUP = "Startup (1-50)"
    SMB = "Small-Medium (51-500)"
    ENTERPRISE = "Enterprise (500-5000)"
    FORTUNE = "Fortune 500 (5000+)"

@dataclass
class Challenge:
    description: str
    business_impact: str
    urgency: str  # Why now?

@dataclass
class Solution:
    approach: str
    implementation: str
    tools_used: List[str]
    timeline: str

@dataclass
class Result:
    metric: str
    value: str
    before: Optional[str] = None
    after: Optional[str] = None
    percentage_change: Optional[str] = None

@dataclass
class Testimonial:
    quote: str
    author_name: str
    author_title: str
    author_company: str
    author_photo_url: Optional[str] = None

@dataclass
class CaseStudy:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str = ""
    subtitle: str = ""
    client_name: str = ""
    industry: Industry = Industry.TECHNOLOGY
    company_size: CompanySize = CompanySize.ENTERPRISE
    
    challenge: Optional[Challenge] = None
    solution: Optional[Solution] = None
    results: List[Result] = field(default_factory=list)
    testimonial: Optional[Testimonial] = None
    
    tags: List[str] = field(default_factory=list)
    featured: bool = False
    published: bool = False
    publish_date: Optional[str] = None
    
    # Media
    hero_image: Optional[str] = None
    before_after_slides: List[str] = field(default_factory=list)
    video_url: Optional[str] = None
    
    # SEO
    meta_description: str = ""
    keywords: List[str] = field(default_factory=list)


class CaseStudyBuilder:
    """Build compelling case studies that convert prospects"""
    
    # Proven case study templates
    TEMPLATES = {
        "transformation": {
            "name": "The Transformation Story",
            "structure": [
                "hero_hook",           # Attention-grabbing opening
                "client_intro",        # Who they are
                "the_stakes",          # What was at risk
                "breaking_point",      # The moment of crisis
                "the_solution",        # How SlideTheory helped
                "implementation",      # The process
                "dramatic_reveal",     # Results reveal
                "future_outlook",      # Where they are now
            ],
            "best_for": "High-impact transformations with clear before/after"
        },
        "metric_driven": {
            "name": "The Metrics-Driven Study",
            "structure": [
                " executive_summary",   # Key numbers up front
                "challenge_breakdown",  # Detailed problem analysis
                "methodology",          # How we approached it
                "quantified_results",   # Deep dive on metrics
                "process_insights",     # What we learned
                "recommendations",      # Applicable advice
            ],
            "best_for": "Data-focused clients who want proof"
        },
        "narrative": {
            "name": "The Narrative Journey",
            "structure": [
                "character_intro",      # Meet the protagonist
                "ordinary_world",       # Life before
                "call_to_adventure",    # The challenge emerges
                "meeting_the_guide",    # Finding SlideTheory
                "the_journey",          # Working together
                "the_victory",          # Results achieved
                "return_with_elixir",   # Lessons for others
            ],
            "best_for": "Stories with strong personal/team elements"
        }
    }
    
    # Industry-specific hooks
    INDUSTRY_HOOKS = {
        Industry.TECHNOLOGY: [
            "From product confusion to market clarity",
            "Scaling the technical narrative",
            "Making complex simple for investors"
        ],
        Industry.FINANCE: [
            "Turning data into decisions",
            "Risk communication that resonates",
            "Regulatory reporting, elevated"
        ],
        Industry.HEALTHCARE: [
            "Patient outcomes, powerfully presented",
            "Medical innovation deserves better slides",
            "Clinical data that convinces"
        ],
        Industry.CONSULTING: [
            "Consultants consulting consultants",
            "When experts need expert decks",
            "Raising the bar on client deliverables"
        ]
    }
    
    # Sample case study data for demo
    SAMPLE_CASE_STUDIES = [
        {
            "title": "How TechFlow Raised Their Series B with a Single Deck",
            "subtitle": "From 40 slides of confusion to 12 slides of conviction",
            "client_name": "TechFlow Inc.",
            "industry": Industry.TECHNOLOGY,
            "company_size": CompanySize.STARTUP,
            "challenge": {
                "description": "TechFlow had developed revolutionary logistics software but couldn't articulate their value proposition to investors. Their pitch deck was 40 slides of technical specifications that lost audiences by slide 5.",
                "business_impact": "Without funding, they had 3 months of runway remaining",
                "urgency": "Series B roadshow scheduled in 6 weeks"
            },
            "solution": {
                "approach": "Applied the SlideTheory Story-First framework to restructure their narrative around customer outcomes rather than product features",
                "implementation": "Intensive 2-week sprint including narrative coaching, slide redesign, and pitch rehearsal",
                "tools_used": ["SlideTheory Narrative Canvas", "Visual Hierarchy System", "Rehearsal Coach"],
                "timeline": "3 weeks from kickoff to roadshow-ready"
            },
            "results": [
                {"metric": "Funding Raised", "value": "$24M", "before": "$0 committed", "percentage_change": "100% success"},
                {"metric": "Deck Length", "value": "12 slides", "before": "40 slides", "percentage_change": "70% reduction"},
                {"metric": "Investor Meetings", "value": "8 of 10", "before": "N/A", "percentage_change": "80% conversion"}
            ],
            "testimonial": {
                "quote": "SlideTheory didn't just redesign our deck—they transformed how we think about storytelling. We went from confusing investors to closing our round in 4 weeks.",
                "author_name": "Sarah Chen",
                "author_title": "CEO & Co-founder",
                "author_company": "TechFlow Inc."
            },
            "tags": ["fundraising", "pitch-deck", "startups", "series-b"],
            "keywords": ["startup pitch deck", "series b fundraising", "investor presentation"]
        },
        {
            "title": "Global Bank Cuts Board Meeting Prep Time by 60%",
            "subtitle": "Standardizing executive presentations across 12 business units",
            "client_name": "Meridian Global Bank",
            "industry": Industry.FINANCE,
            "company_size": CompanySize.FORTUNE,
            "challenge": {
                "description": "Executive presentations varied wildly in quality across business units. Board members struggled to compare performance when each division told their story differently.",
                "business_impact": "Decision-making delays costing estimated $50M in opportunity cost",
                "urgency": "New board chair demanding standardization within one quarter"
            },
            "solution": {
                "approach": "Created a unified Executive Presentation System with templates, training, and quality gates",
                "implementation": "3-month rollout across all 12 divisions with hands-on workshops",
                "tools_used": ["SlideTheory Enterprise Framework", "Template Library", "Executive Coaching"],
                "timeline": "12 weeks for full deployment"
            },
            "results": [
                {"metric": "Prep Time", "value": "8 hours", "before": "20 hours", "percentage_change": "-60%"},
                {"metric": "Board Satisfaction", "value": "4.6/5", "before": "2.8/5", "percentage_change": "+64%"},
                {"metric": "First-Pass Approvals", "value": "89%", "before": "34%", "percentage_change": "+162%"}
            ],
            "testimonial": {
                "quote": "For the first time, our board can focus on decisions instead of deciphering slides. The SlideTheory system paid for itself in the first quarter.",
                "author_name": "Marcus Williams",
                "author_title": "Chief of Staff to the CEO",
                "author_company": "Meridian Global Bank"
            },
            "tags": ["enterprise", "board-presentations", "standardization", "financial-services"],
            "keywords": ["board presentation", "executive communication", "presentation standards"]
        }
    ]
    
    def __init__(self):
        self.case_studies: List[CaseStudy] = []
    
    def create_from_template(self, template_name: str, data: Dict) -> CaseStudy:
        """Create a case study using a template structure"""
        template = self.TEMPLATES.get(template_name, self.TEMPLATES["transformation"])
        
        cs = CaseStudy(
            title=data.get("title", ""),
            subtitle=data.get("subtitle", ""),
            client_name=data.get("client_name", ""),
            industry=data.get("industry", Industry.TECHNOLOGY),
            company_size=data.get("company_size", CompanySize.ENTERPRISE),
            tags=data.get("tags", []),
            keywords=data.get("keywords", [])
        )
        
        # Add challenge
        if "challenge" in data:
            c = data["challenge"]
            cs.challenge = Challenge(
                description=c.get("description", ""),
                business_impact=c.get("business_impact", ""),
                urgency=c.get("urgency", "")
            )
        
        # Add solution
        if "solution" in data:
            s = data["solution"]
            cs.solution = Solution(
                approach=s.get("approach", ""),
                implementation=s.get("implementation", ""),
                tools_used=s.get("tools_used", []),
                timeline=s.get("timeline", "")
            )
        
        # Add results
        if "results" in data:
            for r in data["results"]:
                cs.results.append(Result(
                    metric=r.get("metric", ""),
                    value=r.get("value", ""),
                    before=r.get("before"),
                    after=r.get("after"),
                    percentage_change=r.get("percentage_change")
                ))
        
        # Add testimonial
        if "testimonial" in data:
            t = data["testimonial"]
            cs.testimonial = Testimonial(
                quote=t.get("quote", ""),
                author_name=t.get("author_name", ""),
                author_title=t.get("author_title", ""),
                author_company=t.get("author_company", "")
            )
        
        self.case_studies.append(cs)
        return cs
    
    def load_sample_data(self) -> List[CaseStudy]:
        """Load sample case studies for demonstration"""
        studies = []
        for data in self.SAMPLE_CASE_STUDIES:
            studies.append(self.create_from_template("transformation", data))
        return studies
    
    def generate_full_narrative(self, cs: CaseStudy) -> str:
        """Generate the complete written case study"""
        sections = []
        
        # Header
        sections.append(f"# {cs.title}")
        sections.append(f"*{cs.subtitle}*\n")
        sections.append(f"**Client:** {cs.client_name}")
        sections.append(f"**Industry:** {cs.industry.value}")
        sections.append(f"**Company Size:** {cs.company_size.value}\n")
        
        # Challenge
        if cs.challenge:
            sections.append("## The Challenge")
            sections.append(cs.challenge.description)
            sections.append(f"\n**Business Impact:** {cs.challenge.business_impact}")
            sections.append(f"**Timeline Pressure:** {cs.challenge.urgency}\n")
        
        # Solution
        if cs.solution:
            sections.append("## The Solution")
            sections.append(cs.solution.approach)
            sections.append(f"\n**Implementation:** {cs.solution.implementation}")
            sections.append(f"**Tools Used:** {', '.join(cs.solution.tools_used)}")
            sections.append(f"**Timeline:** {cs.solution.timeline}\n")
        
        # Results
        if cs.results:
            sections.append("## The Results")
            for r in cs.results:
                change_info = f" ({r.percentage_change})" if r.percentage_change else ""
                sections.append(f"- **{r.metric}:** {r.value}{change_info}")
                if r.before:
                    sections.append(f"  - Before: {r.before}")
            sections.append("")
        
        # Testimonial
        if cs.testimonial:
            sections.append("## Client Testimonial")
            sections.append(f"> \"{cs.testimonial.quote}\"\n")
            sections.append(f"— **{cs.testimonial.author_name}**, {cs.testimonial.author_title}")
            sections.append(f"  {cs.testimonial.author_company}\n")
        
        return "\n".join(sections)
    
    def generate_one_pager(self, cs: CaseStudy) -> str:
        """Generate a one-page summary"""
        lines = [
            f"# {cs.title}",
            f"*{cs.subtitle}*\n",
            f"## Challenge",
            cs.challenge.description[:200] + "..." if cs.challenge else "",
            f"\n## Solution",
            cs.solution.approach[:200] + "..." if cs.solution else "",
            f"\n## Results",
        ]
        
        for r in cs.results[:3]:
            lines.append(f"• {r.metric}: {r.value}")
        
        if cs.testimonial:
            lines.append(f"\n> \"{cs.testimonial.quote[:150]}...\"\n")
            lines.append(f"— {cs.testimonial.author_name}, {cs.testimonial.author_company}")
        
        return "\n".join(lines)
    
    def export_to_json(self, cs: CaseStudy) -> str:
        """Export case study as JSON"""
        return json.dumps({
            "id": cs.id,
            "title": cs.title,
            "subtitle": cs.subtitle,
            "client": {
                "name": cs.client_name,
                "industry": cs.industry.value,
                "size": cs.company_size.value
            },
            "challenge": {
                "description": cs.challenge.description if cs.challenge else None,
                "impact": cs.challenge.business_impact if cs.challenge else None
            },
            "solution": {
                "approach": cs.solution.approach if cs.solution else None,
                "timeline": cs.solution.timeline if cs.solution else None
            },
            "results": [{"metric": r.metric, "value": r.value} for r in cs.results],
            "testimonial": {
                "quote": cs.testimonial.quote if cs.testimonial else None,
                "author": cs.testimonial.author_name if cs.testimonial else None
            },
            "tags": cs.tags
        }, indent=2)
    
    def get_by_industry(self, industry: Industry) -> List[CaseStudy]:
        """Filter case studies by industry"""
        return [cs for cs in self.case_studies if cs.industry == industry]
    
    def get_featured(self) -> List[CaseStudy]:
        """Get featured case studies"""
        return [cs for cs in self.case_studies if cs.featured]


# CLI Interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="SlideTheory Case Study Builder")
    parser.add_argument("--samples", action="store_true", help="Generate sample case studies")
    parser.add_argument("--format", choices=["full", "onepager", "json"], default="full", help="Output format")
    parser.add_argument("--list-templates", action="store_true", help="List available templates")
    parser.add_argument("--industry", choices=[i.value for i in Industry], help="Filter by industry")
    
    args = parser.parse_args()
    
    builder = CaseStudyBuilder()
    
    if args.list_templates:
        for key, template in builder.TEMPLATES.items():
            print(f"\n{key}: {template['name']}")
            print(f"  Best for: {template['best_for']}")
    
    elif args.samples:
        studies = builder.load_sample_data()
        for cs in studies:
            if args.format == "full":
                print(builder.generate_full_narrative(cs))
            elif args.format == "onepager":
                print(builder.generate_one_pager(cs))
            else:
                print(builder.export_to_json(cs))
            print("\n" + "="*60 + "\n")
    
    else:
        print("Case Study Builder - use --help for options")
