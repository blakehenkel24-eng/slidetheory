# Email Newsletter System for SlideTheory
# Weekly tips and insights for better presentations

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from enum import Enum
import json
import uuid

class NewsletterType(Enum):
    WEEKLY_TIPS = "weekly_tips"
    CASE_STUDY_SPOTLIGHT = "case_study"
    PRODUCT_UPDATE = "product_update"
    INDUSTRY_INSIGHTS = "industry_insights"
    CURATED_RESOURCES = "curated"

class Segment(Enum):
    ALL = "all_subscribers"
    FREE_USERS = "free_users"
    PAID_USERS = "paid_users"
    CONSULTANTS = "consultants"
    EXECUTIVES = "executives"
    INACTIVE = "inactive_users"

@dataclass
class Article:
    title: str
    excerpt: str
    url: str
    image_url: Optional[str] = None
    author: str = "SlideTheory Team"
    reading_time: int = 5

@dataclass
class Tip:
    title: str
    content: str
    action_item: str
    difficulty: str = "easy"  # easy, medium, advanced

@dataclass
class Newsletter:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    subject_line: str = ""
    preview_text: str = ""
    newsletter_type: NewsletterType = NewsletterType.WEEKLY_TIPS
    segment: Segment = Segment.ALL
    
    # Content sections
    greeting: str = ""
    main_article: Optional[Article] = None
    tips: List[Tip] = field(default_factory=list)
    resources: List[Dict] = field(default_factory=list)
    cta_section: Optional[Dict] = None
    
    # Metadata
    send_date: Optional[datetime] = None
    status: str = "draft"  # draft, scheduled, sent
    ab_test_variant: Optional[str] = None
    
    # Performance (populated after send)
    open_rate: Optional[float] = None
    click_rate: Optional[float] = None
    unsubscribe_rate: Optional[float] = None


class NewsletterEngine:
    """Generate and schedule SlideTheory's email newsletter"""
    
    # Subject line formulas
    SUBJECT_LINES = {
        NewsletterType.WEEKLY_TIPS: [
            "🎯 This week's 3 presentation tips",
            "The 5-minute presentation upgrade",
            "Your slides called. They want an upgrade.",
            "💡 Tip Tuesday: {tip_title}",
            "The 'so what?' test every consultant needs"
        ],
        NewsletterType.CASE_STUDY_SPOTLIGHT: [
            "How {company} closed {result} with one deck",
            "Inside a $24M pitch deck",
            "Case study: From 40 slides to 12",
            "What we learned from 100 winning presentations"
        ],
        NewsletterType.PRODUCT_UPDATE: [
            "✨ New: {feature_name} is here",
            "Your SlideTheory got smarter",
            "Product update: {month} edition",
            "You asked, we built: {feature}"
        ],
        NewsletterType.INDUSTRY_INSIGHTS: [
            "The state of consulting presentations 2024",
            "What top firms know about storytelling",
            "Industry report: Presentation trends",
            "McKinsey's secret weapon (revealed)"
        ],
        NewsletterType.CURATED_RESOURCES: [
            "📚 5 resources worth your time",
            "The best presentation content this week",
            "What we're reading: {month} edition",
            "Resources that made us think"
        ]
    }
    
    # Weekly tip themes
    TIP_THEMES = [
        {
            "week": 1,
            "theme": "Story Structure",
            "tips": [
                Tip(
                    title="Start with the 'So What?'",
                    content="Before adding any data point, ask: So what? Why does this matter to my audience? If you can't answer, cut it.",
                    action_item="Review your last deck. Remove 3 data points that don't pass the 'so what' test.",
                    difficulty="easy"
                ),
                Tip(
                    title="The Rule of Three",
                    content="Human brains process information in threes. Structure your key points as three pillars, three options, or three phases.",
                    action_item="Restructure your next presentation around three key messages maximum.",
                    difficulty="easy"
                ),
                Tip(
                    title="SCQA in Action",
                    content="Situation, Complication, Question, Answer. This McKinsey framework works because it mirrors how we naturally process problems.",
                    action_item="Rewrite your next deck's opening using SCQA structure.",
                    difficulty="medium"
                )
            ]
        },
        {
            "week": 2,
            "theme": "Visual Design",
            "tips": [
                Tip(
                    title="White Space is Not Empty Space",
                    content="Crammed slides overwhelm. Generous margins and spacing actually increase comprehension and retention.",
                    action_item="Add 20% more white space to your current deck by increasing margins.",
                    difficulty="easy"
                ),
                Tip(
                    title="One Message Per Slide",
                    content="If you have two ideas, you need two slides. Period. This forces clarity and prevents audience confusion.",
                    action_item="Split any slide with multiple charts or bullet sections into separate slides.",
                    difficulty="easy"
                ),
                Tip(
                    title="Typography Hierarchy",
                    content="Use size and weight to guide attention. Titles should dominate, supporting text should whisper.",
                    action_item="Establish a 3-level type hierarchy for your deck: Title (32pt), Subtitle (24pt), Body (18pt).",
                    difficulty="medium"
                )
            ]
        },
        {
            "week": 3,
            "theme": "Data Visualization",
            "tips": [
                Tip(
                    title="Chart Choice Matters",
                    content="Bar charts for comparison. Line charts for trends. Pie charts... rarely. Choose intentionally, not by default.",
                    action_item="Audit your charts. Convert any pie chart with more than 3 segments to a bar chart.",
                    difficulty="easy"
                ),
                Tip(
                    title="Annotate Your Data",
                    content="Don't make your audience interpret. Add callouts that explain what the data means and why it matters.",
                    action_item="Add one annotation to each chart explaining the key takeaway.",
                    difficulty="easy"
                ),
                Tip(
                    title="The Waterfall Chart",
                    content="For showing how you get from A to B (revenue build-ups, cost bridges), waterfalls are unbeatable.",
                    action_item="Identify one walk-forward analysis in your deck and convert it to a waterfall chart.",
                    difficulty="advanced"
                )
            ]
        },
        {
            "week": 4,
            "theme": "Delivery",
            "tips": [
                Tip(
                    title="Practice Out Loud",
                    content="Reading silently isn't practice. You need to hear yourself say the words—three times minimum.",
                    action_item="Schedule three run-throughs before your next important presentation.",
                    difficulty="easy"
                ),
                Tip(
                    title="The 10-Second Rule",
                    content="If you can't explain a slide in 10 seconds, it's too complex. Simplify until you can.",
                    action_item="Time yourself explaining each slide. Simplify any that take longer than 10 seconds.",
                    difficulty="medium"
                ),
                Tip(
                    title="Handle Questions with Grace",
                    content=""You don't know" is a valid answer. "I'll get back to you by [time]" shows professionalism. Never guess publicly.""",
                    action_item="Prepare 3 graceful responses for questions you might not know the answer to.",
                    difficulty="medium"
                )
            ]
        }
    ]
    
    # Curated resources
    RESOURCES = [
        {"title": "The Pyramid Principle", "author": "Barbara Minto", "type": "book", "why": "The bible of consulting communication"},
        {"title": "Resonate", "author": "Nancy Duarte", "type": "book", "why": "Transform presentations into stories that move audiences"},
        {"title": "Storytelling with Data", "author": "Cole Nussbaumer", "type": "book", "why": "The definitive guide to data visualization"},
        {"title": "The Presentation Secrets of Steve Jobs", "author": "Carmine Gallo", "type": "book", "why": "Learn from the master presenter"},
        {"title": "HBR Guide to Persuasive Presentations", "author": "Nancy Duarte", "type": "book", "why": "Harvard Business Review's practical guide"}
    ]
    
    def __init__(self):
        self.newsletters: List[Newsletter] = []
        self.sent_count = 0
    
    def generate_weekly_tips(self, week_number: int = None, 
                            segment: Segment = Segment.ALL) -> Newsletter:
        """Generate the weekly tips newsletter"""
        week_num = (week_number or 1) % 4
        theme = self.TIP_THEMES[week_num]
        
        # Create subject line
        subject = self.SUBJECT_LINES[NewsletterType.WEEKLY_TIPS][week_num]
        if "{tip_title}" in subject:
            subject = subject.format(tip_title=theme["tips"][0].title)
        
        newsletter = Newsletter(
            subject_line=subject,
            preview_text=f"This week: {theme['theme']} tips for better presentations",
            newsletter_type=NewsletterType.WEEKLY_TIPS,
            segment=segment,
            greeting="Here's your weekly dose of presentation wisdom 👇",
            tips=theme["tips"],
            send_date=datetime.now() + timedelta(days=1)
        )
        
        # Add main article
        newsletter.main_article = Article(
            title=f"Deep Dive: {theme['theme']}",
            excerpt=f"This week we're focusing on {theme['theme'].lower()}—one of the most impactful areas for improving your presentations. Here are three actionable tips to implement immediately.",
            url=f"https://slidetheory.com/blog/{theme['theme'].lower().replace(' ', '-')}",
            reading_time=5
        )
        
        # Add CTA
        newsletter.cta_section = {
            "headline": "Ready to level up your presentations?",
            "text": "Try SlideTheory free for 14 days and see the difference professional-grade tools make.",
            "button_text": "Start Free Trial",
            "button_url": "https://slidetheory.com/signup"
        }
        
        self.newsletters.append(newsletter)
        return newsletter
    
    def generate_case_study_spotlight(self, case_study_data: Dict = None) -> Newsletter:
        """Generate a case study spotlight newsletter"""
        
        # Default case study if none provided
        case = case_study_data or {
            "company": "TechFlow",
            "result": "$24M in funding",
            "challenge": "40-slide deck confusing investors",
            "solution": "12-slide story-first narrative"
        }
        
        subject = self.SUBJECT_LINES[NewsletterType.CASE_STUDY_SPOTLIGHT][0].format(
            company=case["company"],
            result=case["result"]
        )
        
        newsletter = Newsletter(
            subject_line=subject,
            preview_text=f"How {case['company']} transformed their pitch and raised {case['result']}",
            newsletter_type=NewsletterType.CASE_STUDY_SPOTLIGHT,
            greeting="Real results from real clients. Here's the story 👇",
            send_date=datetime.now() + timedelta(days=2)
        )
        
        newsletter.main_article = Article(
            title=f"Case Study: {case['company']}'s Winning Pitch",
            excerpt=f"See how {case['company']} went from {case['challenge']} to closing {case['result']} using the SlideTheory framework.",
            url="https://slidetheory.com/case-studies/techflow",
            reading_time=7
        )
        
        # Add tips related to case study
        newsletter.tips = [
            Tip(
                title="The Before/After Framework",
                content=f"Like {case['company']}, start by documenting your current state. You can't measure improvement without a baseline.",
                action_item="Document your current deck stats: slide count, creation time, win rate.",
                difficulty="easy"
            )
        ]
        
        self.newsletters.append(newsletter)
        return newsletter
    
    def generate_curated_resources(self) -> Newsletter:
        """Generate a curated resources newsletter"""
        
        newsletter = Newsletter(
            subject_line=self.SUBJECT_LINES[NewsletterType.CURATED_RESOURCES][0],
            preview_text="5 presentation resources worth your time this week",
            newsletter_type=NewsletterType.CURATED_RESOURCES,
            greeting="What we're reading, watching, and recommending 👇",
            send_date=datetime.now() + timedelta(days=3)
        )
        
        newsletter.resources = self.RESOURCES[:5]
        
        # Add a quick tip
        newsletter.tips = [
            Tip(
                title="Schedule Learning Time",
                content="The best consultants dedicate time to improving their craft. Block 30 minutes this week to dive into one of these resources.",
                action_item="Put 30 minutes of 'learning time' on your calendar right now.",
                difficulty="easy"
            )
        ]
        
        self.newsletters.append(newsletter)
        return newsletter
    
    def generate_product_update(self, feature_name: str, feature_description: str) -> Newsletter:
        """Generate a product update newsletter"""
        
        subject = self.SUBJECT_LINES[NewsletterType.PRODUCT_UPDATE][0].format(
            feature_name=feature_name
        )
        
        newsletter = Newsletter(
            subject_line=subject,
            preview_text=f"{feature_name} is now live in SlideTheory",
            newsletter_type=NewsletterType.PRODUCT_UPDATE,
            segment=Segment.ALL,
            greeting="We built something we think you'll love 👇",
            send_date=datetime.now()
        )
        
        newsletter.main_article = Article(
            title=f"New: {feature_name}",
            excerpt=feature_description,
            url=f"https://slidetheory.com/features/{feature_name.lower().replace(' ', '-')}",
            reading_time=3
        )
        
        newsletter.cta_section = {
            "headline": f"Try {feature_name} now",
            "text": f"{feature_name} is available in your account right now. Give it a try and let us know what you think!",
            "button_text": "Check It Out",
            "button_url": "https://slidetheory.com/app"
        }
        
        self.newsletters.append(newsletter)
        return newsletter
    
    def generate_monthly_schedule(self, month: int, year: int) -> List[Newsletter]:
        """Generate a full month of newsletters"""
        newsletters = []
        
        # Week 1: Tips
        newsletters.append(self.generate_weekly_tips(week_number=0))
        
        # Week 2: Case Study
        newsletters.append(self.generate_case_study_spotlight())
        
        # Week 3: Tips
        newsletters.append(self.generate_weekly_tips(week_number=2))
        
        # Week 4: Curated Resources
        newsletters.append(self.generate_curated_resources())
        
        # Set dates for the month
        for i, nl in enumerate(newsletters):
            nl.send_date = datetime(year, month, (i * 7) + 3)  # Send on Wednesdays
        
        return newsletters
    
    def render_html(self, newsletter: Newsletter) -> str:
        """Render newsletter as HTML email"""
        html = f"""<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a;">SlideTheory</h1>
    </div>
    
    <p style="font-size: 18px; color: #333;">{newsletter.greeting}</p>
"""
        
        if newsletter.main_article:
            html += f"""
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">{newsletter.main_article.title}</h2>
        <p>{newsletter.main_article.excerpt}</p>
        <a href="{newsletter.main_article.url}" style="color: #0066cc;">Read more →</a>
    </div>
"""
        
        if newsletter.tips:
            html += "<h3>This Week's Tips</h3>"
            for tip in newsletter.tips:
                html += f"""
    <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #0066cc;">
        <h4 style="margin-top: 0;">{tip.title} <span style="font-size: 12px; color: #666;">[{tip.difficulty}]</span></h4>
        <p>{tip.content}</p>
        <p style="background: #e8f4f8; padding: 10px; border-radius: 4px;">
            <strong>Action Item:</strong> {tip.action_item}
        </p>
    </div>
"""
        
        if newsletter.resources:
            html += "<h3>Recommended Resources</h3><ul>"
            for r in newsletter.resources:
                html += f"""
    <li><strong>{r['title']}</strong> by {r['author']}
        <br><span style="color: #666; font-size: 14px;">{r['why']}</span>
    </li>
"""
            html += "</ul>"
        
        if newsletter.cta_section:
            html += f"""
    <div style="background: #0066cc; color: white; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
        <h3 style="margin-top: 0;">{newsletter.cta_section['headline']}</h3>
        <p>{newsletter.cta_section['text']}</p>
        <a href="{newsletter.cta_section['button_url']}" style="background: white; color: #0066cc; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            {newsletter.cta_section['button_text']}
        </a>
    </div>
"""
        
        html += """
    <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
    
    <p style="font-size: 12px; color: #666; text-align: center;">
        You're receiving this because you subscribed to SlideTheory updates.<br>
        <a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="https://slidetheory.com/preferences">Update preferences</a>
    </p>
</body>
</html>"""
        
        return html
    
    def render_text(self, newsletter: Newsletter) -> str:
        """Render newsletter as plain text"""
        text = f"{newsletter.subject_line}\n\n"
        text += f"{newsletter.greeting}\n\n"
        
        if newsletter.main_article:
            text += f"{newsletter.main_article.title}\n"
            text += f"{newsletter.main_article.excerpt}\n"
            text += f"Read more: {newsletter.main_article.url}\n\n"
        
        if newsletter.tips:
            text += "THIS WEEK'S TIPS\n"
            text += "=" * 40 + "\n\n"
            for tip in newsletter.tips:
                text += f"{tip.title} [{tip.difficulty}]\n"
                text += f"{tip.content}\n"
                text += f"Action Item: {tip.action_item}\n\n"
        
        if newsletter.cta_section:
            text += f"{newsletter.cta_section['headline']}\n"
            text += f"{newsletter.cta_section['text']}\n"
            text += f"{newsletter.cta_section['button_url']}\n\n"
        
        text += "---\n"
        text += "You're receiving this because you subscribed to SlideTheory.\n"
        text += "Unsubscribe: {{unsubscribe_url}}\n"
        
        return text
    
    def export_schedule(self) -> str:
        """Export newsletter schedule as JSON"""
        schedule = []
        for nl in self.newsletters:
            schedule.append({
                "id": nl.id,
                "type": nl.newsletter_type.value,
                "subject": nl.subject_line,
                "segment": nl.segment.value,
                "send_date": nl.send_date.isoformat() if nl.send_date else None,
                "status": nl.status
            })
        return json.dumps(schedule, indent=2)


# CLI Interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="SlideTheory Newsletter Engine")
    parser.add_argument("--weekly", action="store_true", help="Generate weekly tips newsletter")
    parser.add_argument("--case-study", action="store_true", help="Generate case study newsletter")
    parser.add_argument("--curated", action="store_true", help="Generate curated resources newsletter")
    parser.add_argument("--monthly", action="store_true", help="Generate full month schedule")
    parser.add_argument("--html", action="store_true", help="Output HTML version")
    parser.add_argument("--text", action="store_true", help="Output plain text version")
    parser.add_argument("--schedule", action="store_true", help="Export schedule")
    
    args = parser.parse_args()
    
    engine = NewsletterEngine()
    
    if args.monthly:
        from datetime import datetime
        now = datetime.now()
        newsletters = engine.generate_monthly_schedule(now.month, now.year)
        print(f"Generated {len(newsletters)} newsletters for {now.strftime('%B %Y')}")
        for nl in newsletters:
            print(f"  {nl.send_date.strftime('%Y-%m-%d')}: {nl.subject_line}")
    
    elif args.weekly:
        nl = engine.generate_weekly_tips()
        if args.html:
            print(engine.render_html(nl))
        elif args.text:
            print(engine.render_text(nl))
        else:
            print(f"Subject: {nl.subject_line}")
            print(f"Preview: {nl.preview_text}")
            print(f"\nTips: {[t.title for t in nl.tips]}")
    
    elif args.case_study:
        nl = engine.generate_case_study_spotlight()
        print(f"Subject: {nl.subject_line}")
    
    elif args.curated:
        nl = engine.generate_curated_resources()
        print(f"Subject: {nl.subject_line}")
        print(f"Resources: {[r['title'] for r in nl.resources]}")
    
    elif args.schedule:
        engine.generate_monthly_schedule(2, 2026)
        print(engine.export_schedule())
    
    else:
        print("Newsletter Engine - use --help for options")
