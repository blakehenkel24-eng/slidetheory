# Blog Post Generator for SlideTheory
# Generates AI-powered blog posts about consulting and presentations

from dataclasses import dataclass
from typing import List, Optional, Dict
from datetime import datetime
import json
import re

@dataclass
class BlogPost:
    title: str
    slug: str
    excerpt: str
    content: str
    tags: List[str]
    category: str
    reading_time: int
    seo_title: str
    seo_description: str
    keywords: List[str]
    publish_date: Optional[str] = None
    author: str = "SlideTheory Team"
    
class BlogPostGenerator:
    """Generate engaging blog posts about presentations and consulting"""
    
    CATEGORIES = [
        "presentation-design",
        "consulting-tips", 
        "storytelling",
        "data-visualization",
        "pitch-decks",
        "client-communication"
    ]
    
    TEMPLATES = {
        "how_to": {
            "structure": [
                "hook_problem",
                "agitate_pain",
                "introduce_solution",
                "step_by_step_guide",
                "real_example",
                "common_mistakes",
                "actionable_tips",
                "conclusion_cta"
            ],
            "tone": "helpful, authoritative"
        },
        "listicle": {
            "structure": [
                "intriguing_hook",
                "promise_value",
                "numbered_items_with_details",
                "bonus_tip",
                "recap",
                "engagement_question"
            ],
            "tone": "energetic, scannable"
        },
        "case_study_style": {
            "structure": [
                "client_challenge",
                "what_didnt_work",
                "the_approach",
                "implementation",
                "results_metrics",
                "lessons_learned",
                "how_to_apply"
            ],
            "tone": "story-driven, credible"
        },
        "thought_leadership": {
            "structure": [
                "bold_opener",
                "industry_context",
                "the_shift",
                "evidence_examples",
                "framework_introduction",
                "practical_application",
                "future_prediction",
                "call_to_discuss"
            ],
            "tone": "insightful, forward-thinking"
        }
    }
    
    TOPIC_IDEAS = [
        {
            "title": "The 7 Deadly Sins of Consulting Presentations",
            "category": "consulting-tips",
            "template": "listicle",
            "keywords": ["consulting presentations", "presentation mistakes", "client pitches"]
        },
        {
            "title": "How to Structure a Winning Board Presentation",
            "category": "presentation-design",
            "template": "how_to",
            "keywords": ["board presentation", "executive presentation", "board deck"]
        },
        {
            "title": "From Data Dump to Story: Transforming Your Analysis",
            "category": "data-visualization",
            "template": "how_to",
            "keywords": ["data storytelling", "data visualization", "analysis presentation"]
        },
        {
            "title": "Why 90% of Strategy Decks Fail (And How to Fix Yours)",
            "category": "consulting-tips",
            "template": "thought_leadership",
            "keywords": ["strategy presentation", "consulting deck", "presentation strategy"]
        },
        {
            "title": "The Consultant's Guide to Visual Storytelling",
            "category": "storytelling",
            "template": "how_to",
            "keywords": ["visual storytelling", "consultant presentation", "storytelling techniques"]
        },
        {
            "title": "How We Helped a Fortune 500 Close $50M with One Deck",
            "category": "pitch-decks",
            "template": "case_study_style",
            "keywords": ["pitch deck", "sales presentation", "winning pitch"]
        },
        {
            "title": "15 PowerPoint Alternatives Consultants Should Know",
            "category": "presentation-design",
            "template": "listicle",
            "keywords": ["presentation tools", "PowerPoint alternatives", "consulting software"]
        },
        {
            "title": "The SCQA Framework: McKinsey's Secret Weapon",
            "category": "consulting-tips",
            "template": "how_to",
            "keywords": ["SCQA framework", "McKinsey presentation", "consulting frameworks"]
        }
    ]
    
    def __init__(self):
        self.generated_posts: List[BlogPost] = []
    
    def generate_slug(self, title: str) -> str:
        """Convert title to URL-friendly slug"""
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug[:60]
    
    def estimate_reading_time(self, content: str) -> int:
        """Estimate reading time in minutes"""
        word_count = len(content.split())
        return max(1, round(word_count / 200))
    
    def generate_seo_metadata(self, title: str, content: str, keywords: List[str]) -> Dict:
        """Generate SEO-optimized metadata"""
        return {
            "title": f"{title} | SlideTheory",
            "description": content[:155] + "..." if len(content) > 155 else content,
            "keywords": ", ".join(keywords)
        }
    
    def create_post(self, topic_index: int, custom_content: Optional[str] = None) -> BlogPost:
        """Generate a blog post from template"""
        topic = self.TOPIC_IDEAS[topic_index % len(self.TOPIC_IDEAS)]
        template = self.TEMPLATES[topic["template"]]
        
        slug = self.generate_slug(topic["title"])
        
        # Generate excerpt
        excerpt = f"Discover how to {topic['title'].lower().replace('how to ', '').replace('the ', '')}. Essential insights for consultants and executives."
        
        # Build content outline
        content_sections = []
        for section in template["structure"]:
            content_sections.append(f"## {section.replace('_', ' ').title()}\n\n[Content generated based on {topic['template']} template]\n")
        
        content = f"# {topic['title']}\n\n" + "\n".join(content_sections)
        
        if custom_content:
            content += f"\n\n---\n\n{custom_content}"
        
        seo_meta = self.generate_seo_metadata(topic["title"], excerpt, topic["keywords"])
        
        post = BlogPost(
            title=topic["title"],
            slug=slug,
            excerpt=excerpt,
            content=content,
            tags=[topic["category"]] + topic["keywords"][:3],
            category=topic["category"],
            reading_time=self.estimate_reading_time(content),
            seo_title=seo_meta["title"],
            seo_description=seo_meta["description"],
            keywords=topic["keywords"],
            publish_date=datetime.now().isoformat()
        )
        
        self.generated_posts.append(post)
        return post
    
    def generate_batch(self, count: int = 5) -> List[BlogPost]:
        """Generate multiple blog posts"""
        posts = []
        for i in range(count):
            post = self.create_post(i)
            posts.append(post)
        return posts
    
    def export_to_markdown(self, post: BlogPost) -> str:
        """Export post as markdown with frontmatter"""
        frontmatter = f"""---
title: "{post.title}"
slug: "{post.slug}"
excerpt: "{post.excerpt}"
category: "{post.category}"
tags: {json.dumps(post.tags)}
reading_time: {post.reading_time}
seo_title: "{post.seo_title}"
seo_description: "{post.seo_description}"
keywords: {json.dumps(post.keywords)}
author: "{post.author}"
publish_date: "{post.publish_date or datetime.now().isoformat()}"
---

"""
        return frontmatter + post.content
    
    def export_to_json(self, post: BlogPost) -> str:
        """Export post as JSON"""
        return json.dumps({
            "title": post.title,
            "slug": post.slug,
            "excerpt": post.excerpt,
            "content": post.content,
            "category": post.category,
            "tags": post.tags,
            "reading_time": post.reading_time,
            "seo": {
                "title": post.seo_title,
                "description": post.seo_description,
                "keywords": post.keywords
            },
            "author": post.author,
            "publish_date": post.publish_date
        }, indent=2)
    
    def get_editorial_calendar(self, weeks: int = 4) -> List[Dict]:
        """Generate editorial calendar"""
        calendar = []
        for week in range(weeks):
            for day, topic in enumerate(self.TOPIC_IDEAS[:3]):
                calendar.append({
                    "week": week + 1,
                    "day": ["Monday", "Wednesday", "Friday"][day],
                    "title": topic["title"],
                    "category": topic["category"],
                    "status": "planned"
                })
        return calendar


# CLI Interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="SlideTheory Blog Post Generator")
    parser.add_argument("--batch", type=int, default=1, help="Number of posts to generate")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown", help="Output format")
    parser.add_argument("--output", type=str, help="Output directory")
    parser.add_argument("--calendar", action="store_true", help="Generate editorial calendar")
    
    args = parser.parse_args()
    
    generator = BlogPostGenerator()
    
    if args.calendar:
        calendar = generator.get_editorial_calendar()
        print(json.dumps(calendar, indent=2))
    else:
        posts = generator.generate_batch(args.batch)
        for post in posts:
            if args.format == "markdown":
                output = generator.export_to_markdown(post)
            else:
                output = generator.export_to_json(post)
            
            if args.output:
                import os
                os.makedirs(args.output, exist_ok=True)
                filename = f"{post.slug}.{args.format if args.format == 'json' else 'md'}"
                filepath = os.path.join(args.output, filename)
                with open(filepath, 'w') as f:
                    f.write(output)
                print(f"Generated: {filepath}")
            else:
                print(output)
                print("\n" + "="*60 + "\n")
