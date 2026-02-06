# SEO Content Generator for SlideTheory
# Long-form articles targeting high-value keywords

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Tuple
from datetime import datetime
from enum import Enum
import json
import uuid

class ContentPillar(Enum):
    PRESENTATION_DESIGN = "presentation_design"
    CONSULTING_CAREER = "consulting_career"
    DATA_STORYTELLING = "data_storytelling"
    PITCH_DECKS = "pitch_decks"
    EXECUTIVE_COMMUNICATION = "executive_communication"
    TOOLS_SOFTWARE = "tools_software"

class SearchIntent(Enum):
    INFORMATIONAL = "informational"      # How to, what is, guide
    COMMERCIAL = "commercial"            # Best, top, vs, review
    TRANSACTIONAL = "transactional"      # Buy, trial, demo
    NAVIGATIONAL = "navigational"        # Brand searches

@dataclass
class KeywordCluster:
    primary_keyword: str
    secondary_keywords: List[str]
    search_volume: int  # Monthly searches (est)
    difficulty: int     # 1-100
    intent: SearchIntent
    pillar: ContentPillar

@dataclass
class SEOSection:
    heading: str
    content_outline: List[str]
    target_keywords: List[str]
    word_count_target: int
    includes_faq: bool = False

@dataclass
class SEOArticle:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str = ""
    meta_title: str = ""
    meta_description: str = ""
    url_slug: str = ""
    
    # Content
    intro: str = ""
    sections: List[SEOSection] = field(default_factory=list)
    faq_section: List[Dict] = field(default_factory=list)
    conclusion: str = ""
    
    # SEO
    keyword_cluster: Optional[KeywordCluster] = None
    internal_links: List[Dict] = field(default_factory=list)
    external_citations: List[Dict] = field(default_factory=list)
    
    # Metadata
    reading_time: int = 0
    publish_date: Optional[str] = None
    updated_date: Optional[str] = None
    author: str = "SlideTheory Editorial Team"


class SEOContentEngine:
    """Generate SEO-optimized long-form content"""
    
    # High-value keyword clusters for SlideTheory
    KEYWORD_CLUSTERS = [
        # Pillar: Presentation Design
        KeywordCluster(
            primary_keyword="consulting presentation templates",
            secondary_keywords=[
                "mckinsey presentation template",
                "bcg slide template",
                "consulting deck format",
                "professional presentation templates consulting"
            ],
            search_volume=3200,
            difficulty=45,
            intent=SearchIntent.COMMERCIAL,
            pillar=ContentPillar.PRESENTATION_DESIGN
        ),
        KeywordCluster(
            primary_keyword="how to structure a presentation",
            secondary_keywords=[
                "presentation structure framework",
                "how to organize a presentation",
                "presentation outline template",
                "best way to structure a deck"
            ],
            search_volume=5400,
            difficulty=35,
            intent=SearchIntent.INFORMATIONAL,
            pillar=ContentPillar.PRESENTATION_DESIGN
        ),
        
        # Pillar: Consulting Career
        KeywordCluster(
            primary_keyword="consulting presentation skills",
            secondary_keywords=[
                "how to make presentations like mckinsey",
                "consultant presentation training",
                "presentation skills for consultants",
                "big 4 presentation tips"
            ],
            search_volume=1800,
            difficulty=40,
            intent=SearchIntent.INFORMATIONAL,
            pillar=ContentPillar.CONSULTING_CAREER
        ),
        KeywordCluster(
            primary_keyword="scqa framework",
            secondary_keywords=[
                "situation complication question answer",
                "scqa mckinsey",
                "scqa template",
                "how to use scqa"
            ],
            search_volume=1400,
            difficulty=25,
            intent=SearchIntent.INFORMATIONAL,
            pillar=ContentPillar.CONSULTING_CAREER
        ),
        
        # Pillar: Data Storytelling
        KeywordCluster(
            primary_keyword="data visualization best practices",
            secondary_keywords=[
                "how to present data effectively",
                "data storytelling techniques",
                "best charts for presentations",
                "data visualization consulting"
            ],
            search_volume=6600,
            difficulty=50,
            intent=SearchIntent.INFORMATIONAL,
            pillar=ContentPillar.DATA_STORYTELLING
        ),
        KeywordCluster(
            primary_keyword="waterfall chart",
            secondary_keywords=[
                "how to create a waterfall chart",
                "waterfall chart excel",
                "bridge chart presentation",
                "waterfall chart explained"
            ],
            search_volume=9900,
            difficulty=30,
            intent=SearchIntent.INFORMATIONAL,
            pillar=ContentPillar.DATA_STORYTELLING
        ),
        
        # Pillar: Pitch Decks
        KeywordCluster(
            primary_keyword="pitch deck examples",
            secondary_keywords=[
                "successful pitch decks",
                "startup pitch deck template",
                "investor presentation examples",
                "series a pitch deck"
            ],
            search_volume=12100,
            difficulty=55,
            intent=SearchIntent.INFORMATIONAL,
            pillar=ContentPillar.PITCH_DECKS
        ),
        KeywordCluster(
            primary_keyword="how to create a pitch deck",
            secondary_keywords=[
                "pitch deck structure",
                "what to include in pitch deck",
                "pitch deck tips",
                "investor deck guide"
            ],
            search_volume=8100,
            difficulty=48,
            intent=SearchIntent.INFORMATIONAL,
            pillar=ContentPillar.PITCH_DECKS
        ),
        
        # Pillar: Executive Communication
        KeywordCluster(
            primary_keyword="executive presentation tips",
            secondary_keywords=[
                "presenting to c suite",
                "board presentation tips",
                "executive summary presentation",
                "how to present to executives"
            ],
            search_volume=2900,
            difficulty=38,
            intent=SearchIntent.INFORMATIONAL,
            pillar=ContentPillar.EXECUTIVE_COMMUNICATION
        ),
        KeywordCluster(
            primary_keyword="board deck template",
            secondary_keywords=[
                "board presentation format",
                "board of directors presentation",
                "board meeting deck",
                "how to present to board"
            ],
            search_volume=2400,
            difficulty=42,
            intent=SearchIntent.COMMERCIAL,
            pillar=ContentPillar.EXECUTIVE_COMMUNICATION
        ),
        
        # Pillar: Tools & Software
        KeywordCluster(
            primary_keyword="best presentation software",
            secondary_keywords=[
                "powerpoint alternatives",
                "presentation tools for business",
                "best software for presentations",
                "presentation software comparison"
            ],
            search_volume=4400,
            difficulty=60,
            intent=SearchIntent.COMMERCIAL,
            pillar=ContentPillar.TOOLS_SOFTWARE
        ),
        KeywordCluster(
            primary_keyword="slide design software",
            secondary_keywords=[
                "presentation design tools",
                "slide creation software",
                "professional slide design",
                "consulting slide software"
            ],
            search_volume=1600,
            difficulty=35,
            intent=SearchIntent.COMMERCIAL,
            pillar=ContentPillar.TOOLS_SOFTWARE
        )
    ]
    
    # Content templates by type
    CONTENT_TEMPLATES = {
        SearchIntent.INFORMATIONAL: {
            "structure": [
                "What is [topic] and why it matters",
                "The problem with current approaches",
                "Our framework/methodology",
                "Step-by-step implementation guide",
                "Common mistakes to avoid",
                "Real-world examples",
                "Advanced tips",
                "Tools and resources",
                "FAQ"
            ],
            "tone": "educational, authoritative, helpful",
            "word_count": 2500
        },
        SearchIntent.COMMERCIAL: {
            "structure": [
                "The challenge everyone faces",
                "Why common solutions fall short",
                "What to look for in a solution",
                "Our recommendation",
                "Feature comparison/buying guide",
                "Implementation best practices",
                "ROI and results",
                "FAQ"
            ],
            "tone": "comparative, solution-oriented, trustworthy",
            "word_count": 2000
        }
    }
    
    # Article frameworks
    FRAMEWORKS = {
        "skyscraper": {
            "name": "The Skyscraper Technique",
            "description": "Find popular content, make something better, reach out to linkers",
            "approach": "Comprehensive, definitive guide"
        },
        "pillar": {
            "name": "Content Pillar",
            "description": "Broad topic coverage that links to cluster content",
            "approach": "Overview with deep links"
        },
        "cluster": {
            "name": "Topic Cluster",
            "description": "Deep dive on specific subtopic",
            "approach": "Expert-level detail"
        }
    }
    
    def __init__(self):
        self.articles: List[SEOArticle] = []
    
    def generate_article(self, keyword_cluster: KeywordCluster,
                         framework: str = "skyscraper") -> SEOArticle:
        """Generate a complete SEO article from keyword cluster"""
        
        template = self.CONTENT_TEMPLATES[keyword_cluster.intent]
        
        # Generate title options
        titles = self._generate_titles(keyword_cluster)
        
        # Create article structure
        article = SEOArticle(
            title=titles[0],
            meta_title=f"{titles[0]} | SlideTheory",
            meta_description=self._generate_meta_description(keyword_cluster),
            url_slug=self._generate_slug(keyword_cluster.primary_keyword),
            keyword_cluster=keyword_cluster,
            publish_date=datetime.now().isoformat()
        )
        
        # Generate intro
        article.intro = self._generate_intro(keyword_cluster)
        
        # Generate sections based on template structure
        for i, section_title in enumerate(template["structure"]):
            section = self._generate_section(
                section_title, 
                keyword_cluster,
                i,
                template["word_count"] // len(template["structure"])
            )
            article.sections.append(section)
        
        # Generate FAQ
        article.faq_section = self._generate_faq(keyword_cluster)
        
        # Generate conclusion
        article.conclusion = self._generate_conclusion(keyword_cluster)
        
        # Calculate reading time
        total_words = sum(s.word_count_target for s in article.sections)
        article.reading_time = max(5, total_words // 200)
        
        self.articles.append(article)
        return article
    
    def _generate_titles(self, cluster: KeywordCluster) -> List[str]:
        """Generate title variations"""
        titles = []
        
        if cluster.intent == SearchIntent.INFORMATIONAL:
            titles = [
                f"The Complete Guide to {cluster.primary_keyword.title()}",
                f"How to Master {cluster.primary_keyword.title()}: A Step-by-Step Guide",
                f"{cluster.primary_keyword.title()}: Everything You Need to Know",
                f"The Consultant's Guide to {cluster.primary_keyword.title()}"
            ]
        elif cluster.intent == SearchIntent.COMMERCIAL:
            titles = [
                f"Best {cluster.primary_keyword.title()} for 2024",
                f"The Ultimate {cluster.primary_keyword.title()} Comparison",
                f"How to Choose the Right {cluster.primary_keyword.title()}",
                f"Top-Rated {cluster.primary_keyword.title()}: Reviewed & Tested"
            ]
        
        return titles
    
    def _generate_meta_description(self, cluster: KeywordCluster) -> str:
        """Generate SEO meta description"""
        return f"Learn {cluster.primary_keyword} with our comprehensive guide. Tips from ex-McKinsey consultants on {', '.join(cluster.secondary_keywords[:2])}. Read now."
    
    def _generate_slug(self, keyword: str) -> str:
        """Generate URL slug"""
        return keyword.lower().replace(" ", "-").replace("'", "")[:60]
    
    def _generate_intro(self, cluster: KeywordCluster) -> str:
        """Generate article introduction"""
        return f"""[INTRO SECTION - Target: 150 words]

Hook: Address the pain point or promise of {cluster.primary_keyword}

Context: Why this matters for consultants and business professionals

Preview: What readers will learn in this guide

Thesis: SlideTheory's unique perspective/expertise on this topic

Keywords to include: {cluster.primary_keyword}, {', '.join(cluster.secondary_keywords[:2])}
"""
    
    def _generate_section(self, title: str, cluster: KeywordCluster,
                          index: int, word_target: int) -> SEOSection:
        """Generate a content section"""
        
        # Assign keywords to section
        all_keywords = [cluster.primary_keyword] + cluster.secondary_keywords
        section_keywords = [
            all_keywords[index % len(all_keywords)],
            all_keywords[(index + 1) % len(all_keywords)]
        ]
        
        # Generate outline
        outline = [
            f"Opening: Set up the section's focus on {title}",
            f"Main point 1: Detailed explanation with examples",
            f"Main point 2: Supporting evidence/case study",
            f"Main point 3: Practical application",
            f"Transition: Bridge to next section"
        ]
        
        return SEOSection(
            heading=title.replace("[topic]", cluster.primary_keyword.title()),
            content_outline=outline,
            target_keywords=section_keywords,
            word_count_target=word_target,
            includes_faq=(title == "FAQ")
        )
    
    def _generate_faq(self, cluster: KeywordCluster) -> List[Dict]:
        """Generate FAQ section"""
        faqs = []
        
        questions = [
            f"What is {cluster.primary_keyword}?",
            f"Why is {cluster.primary_keyword} important?",
            f"How do I get started with {cluster.primary_keyword}?",
            f"What are the best tools for {cluster.primary_keyword}?",
            f"How long does it take to learn {cluster.primary_keyword}?",
        ]
        
        for q in questions:
            faqs.append({
                "question": q,
                "answer": f"[Answer targeting related keywords from cluster: {', '.join(cluster.secondary_keywords[:3])}]"
            })
        
        return faqs
    
    def _generate_conclusion(self, cluster: KeywordCluster) -> str:
        """Generate article conclusion"""
        return f"""[CONCLUSION - Target: 100 words]

Summary: Recap key takeaways about {cluster.primary_keyword}

Call to action: Try SlideTheory or read related content

Final thought: Inspiring closing about better presentations

Next steps: Suggested related articles
"""
    
    def generate_content_calendar(self, months: int = 3) -> List[Dict]:
        """Generate SEO content calendar"""
        calendar = []
        
        for month in range(months):
            for cluster in self.KEYWORD_CLUSTERS[:4]:  # Top clusters per month
                article = self.generate_article(cluster)
                calendar.append({
                    "month": month + 1,
                    "publish_target": f"Week {month + 1}",
                    "keyword": cluster.primary_keyword,
                    "title": article.title,
                    "pillar": cluster.pillar.value,
                    "intent": cluster.intent.value,
                    "word_count": self.CONTENT_TEMPLATES[cluster.intent]["word_count"],
                    "status": "planned"
                })
        
        return calendar
    
    def export_article_markdown(self, article: SEOArticle) -> str:
        """Export article as markdown with frontmatter"""
        frontmatter = f"""---
title: "{article.title}"
meta_title: "{article.meta_title}"
meta_description: "{article.meta_description}"
slug: "{article.url_slug}"
author: "{article.author}"
reading_time: {article.reading_time}
publish_date: "{article.publish_date}"
keywords: {json.dumps([article.keyword_cluster.primary_keyword] + article.keyword_cluster.secondary_keywords)}
pillar: "{article.keyword_cluster.pillar.value}"
search_intent: "{article.keyword_cluster.intent.value}"
---

"""
        
        content = f"# {article.title}\n\n"
        content += f"{article.intro}\n\n"
        
        for section in article.sections:
            content += f"## {section.heading}\n\n"
            for point in section.content_outline:
                content += f"- {point}\n"
            content += f"\n[Target: {section.word_count_target} words]\n\n"
            content += f"*Keywords: {', '.join(section.target_keywords)}*\n\n"
        
        if article.faq_section:
            content += "## Frequently Asked Questions\n\n"
            for faq in article.faq_section:
                content += f"**Q: {faq['question']}\n\n"
                content += f"A:** {faq['answer']}\n\n"
        
        content += f"## Conclusion\n\n{article.conclusion}"
        
        return frontmatter + content
    
    def export_content_strategy(self) -> str:
        """Export comprehensive content strategy"""
        strategy = ["# SlideTheory SEO Content Strategy\n"]
        
        strategy.append("## Content Pillars")
        for pillar in ContentPillar:
            clusters = [c for c in self.KEYWORD_CLUSTERS if c.pillar == pillar]
            total_volume = sum(c.search_volume for c in clusters)
            strategy.append(f"\n### {pillar.value.replace('_', ' ').title()}")
            strategy.append(f"- Total Search Volume: {total_volume:,} monthly")
            strategy.append(f"- Target Clusters: {len(clusters)}")
            for c in clusters:
                strategy.append(f"  - {c.primary_keyword} ({c.search_volume:,}/mo, difficulty: {c.difficulty})")
        
        strategy.append("\n\n## Quarterly Content Plan")
        strategy.append("| Month | Content Focus | Target Keywords | Goal |")
        strategy.append("|-------|---------------|-----------------|------|")
        strategy.append("| Q1 M1 | Presentation Foundations | how to structure, scqa framework | Build authority |")
        strategy.append("| Q1 M2 | Data Visualization | waterfall charts, data storytelling | Capture high-volume |")
        strategy.append("| Q1 M3 | Executive Communication | board decks, c-suite tips | Premium positioning |")
        
        strategy.append("\n\n## Internal Linking Structure")
        strategy.append("- Pillar pages → 5-7 cluster content pieces")
        strategy.append("- Cluster content → Related clusters + Pillar")
        strategy.append("- All content → Product pages (contextual CTAs)")
        
        return "\n".join(strategy)
    
    def get_cluster_by_pillar(self, pillar: ContentPillar) -> List[KeywordCluster]:
        """Get all keyword clusters for a pillar"""
        return [c for c in self.KEYWORD_CLUSTERS if c.pillar == pillar]
    
    def get_high_opportunity_keywords(self, max_difficulty: int = 40) -> List[KeywordCluster]:
        """Find high-opportunity keywords (high volume, low difficulty)"""
        opportunities = [c for c in self.KEYWORD_CLUSTERS if c.difficulty <= max_difficulty]
        return sorted(opportunities, key=lambda x: x.search_volume, reverse=True)


# CLI Interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="SlideTheory SEO Content Engine")
    parser.add_argument("--generate", action="store_true", help="Generate articles for all clusters")
    parser.add_argument("--cluster", type=int, help="Generate specific cluster by index")
    parser.add_argument("--calendar", action="store_true", help="Generate content calendar")
    parser.add_argument("--strategy", action="store_true", help="Export content strategy")
    parser.add_argument("--opportunities", action="store_true", help="Show high-opportunity keywords")
    parser.add_argument("--pillar", choices=[p.value for p in ContentPillar], help="Filter by pillar")
    
    args = parser.parse_args()
    
    engine = SEOContentEngine()
    
    if args.strategy:
        print(engine.export_content_strategy())
    
    elif args.opportunities:
        opportunities = engine.get_high_opportunity_keywords()
        print("High-Opportunity Keywords (High Volume, Low Difficulty):")
        for c in opportunities:
            print(f"  {c.primary_keyword}: {c.search_volume:,}/mo, difficulty: {c.difficulty}")
    
    elif args.calendar:
        calendar = engine.generate_content_calendar()
        print(json.dumps(calendar, indent=2))
    
    elif args.cluster is not None:
        cluster = engine.KEYWORD_CLUSTERS[args.cluster % len(engine.KEYWORD_CLUSTERS)]
        article = engine.generate_article(cluster)
        print(engine.export_article_markdown(article))
    
    elif args.generate:
        for cluster in engine.KEYWORD_CLUSTERS[:3]:
            article = engine.generate_article(cluster)
            print(f"Generated: {article.title}")
            print(f"  Keywords: {article.keyword_cluster.primary_keyword}")
            print(f"  Word count target: {engine.CONTENT_TEMPLATES[cluster.intent]['word_count']}")
            print()
    
    elif args.pillar:
        pillar = ContentPillar(args.pillar)
        clusters = engine.get_cluster_by_pillar(pillar)
        print(f"Clusters for {pillar.value}:")
        for c in clusters:
            print(f"  - {c.primary_keyword} ({c.search_volume:,}/mo)")
    
    else:
        print("SEO Content Engine - use --help for options")
        print(f"\nAvailable keyword clusters: {len(engine.KEYWORD_CLUSTERS)}")
        print("Top clusters by volume:")
        for c in sorted(engine.KEYWORD_CLUSTERS, key=lambda x: x.search_volume, reverse=True)[:5]:
            print(f"  - {c.primary_keyword}: {c.search_volume:,}/mo")
