# Social Media Scheduler for SlideTheory
# Queue and schedule posts to Twitter/X and LinkedIn

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from enum import Enum
import json
import uuid

class Platform(Enum):
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    BOTH = "both"

class ContentType(Enum):
    TIP = "tip"
    QUOTE = "quote"
    PROMOTION = "promotion"
    ENGAGEMENT = "engagement"
    THREAD = "thread"
    CAROUSEL = "carousel"

@dataclass
class SocialPost:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    platform: Platform = Platform.BOTH
    content_type: ContentType = ContentType.TIP
    content: str = ""
    hashtags: List[str] = field(default_factory=list)
    mentions: List[str] = field(default_factory=list)
    media_urls: List[str] = field(default_factory=list)
    scheduled_time: Optional[datetime] = None
    published_time: Optional[datetime] = None
    status: str = "draft"  # draft, scheduled, published, failed
    engagement_stats: Dict = field(default_factory=dict)
    parent_id: Optional[str] = None  # For threads
    
    def __post_init__(self):
        if not self.hashtags:
            self.hashtags = ["#SlideTheory", "#Presentations", "#Consulting"]

class SocialMediaScheduler:
    """Schedule and manage social media posts"""
    
    # Content templates for different post types
    TEMPLATES = {
        ContentType.TIP: [
            "💡 Tip: {tip}\n\n{hashtags}",
            "🎯 Pro tip for consultants:\n\n{tip}\n\n{hashtags}",
            "Quick win for your next presentation:\n\n{tip}\n\nSave this ↓\n\n{hashtags}"
        ],
        ContentType.QUOTE: [
            '"{quote}"\n\n— {author}\n\n{hashtags}',
            "Words to present by:\n\n\"{quote}\"\n\n— {author}\n\n{hashtags}",
        ],
        ContentType.PROMOTION: [
            "🚀 {message}\n\n{cta}\n\n{link}\n\n{hashtags}",
            "{message}\n\n👉 {cta}\n\n{link}\n\n{hashtags}"
        ],
        ContentType.ENGAGEMENT: [
            "Poll: {question}\n\n1️⃣ {option1}\n2️⃣ {option2}\n3️⃣ {option3}\n\n{hashtags}",
            "Question for my fellow consultants:\n\n{question}\n\nDrop your thoughts 👇\n\n{hashtags}",
            "Hot take: {opinion}\n\nAgree or disagree? 🧵👇\n\n{hashtags}"
        ]
    }
    
    # Best posting times (local time)
    OPTIMAL_TIMES = {
        Platform.TWITTER: [
            {"day": 0, "hour": 9},   # Monday 9am
            {"day": 0, "hour": 12},  # Monday noon
            {"day": 2, "hour": 9},   # Wednesday 9am
            {"day": 2, "hour": 15},  # Wednesday 3pm
            {"day": 4, "hour": 9},   # Friday 9am
        ],
        Platform.LINKEDIN: [
            {"day": 0, "hour": 8},   # Monday 8am
            {"day": 1, "hour": 12},  # Tuesday noon
            {"day": 2, "hour": 8},   # Wednesday 8am
            {"day": 3, "hour": 17},  # Thursday 5pm
        ]
    }
    
    CONTENT_BANK = {
        "tips": [
            "Start with the conclusion. Executives want the answer first, then the reasoning.",
            "One idea per slide. If you have two points, you need two slides.",
            "Use the 'so what?' test on every data point you include.",
            "Your title should tell the story. Don't waste it on "Agenda" or "Overview".",
            "White space is your friend. Crammed slides = confused audience.",
            "The 10/20/30 rule: 10 slides, 20 minutes, 30pt minimum font.",
            "Data without context is noise. Always answer 'why does this matter?'",
            "Practice out loud. 3 run-throughs minimum before the real thing.",
            "Know your audience's decision criteria before you design a single slide.",
            "End with clear next steps. Don't assume they'll know what to do."
        ],
        "quotes": [
            {"text": "The single biggest problem in communication is the illusion that it has taken place.", "author": "George Bernard Shaw"},
            {"text": "If I had more time, I would have written a shorter letter.", "author": "Blaise Pascal"},
            {"text": "Design is not just what it looks like and feels like. Design is how it works.", "author": "Steve Jobs"},
            {"text": "The best presentations are conversations, not lectures.", "author": "Nancy Duarte"},
            {"text": "Simple can be harder than complex. But it's worth it in the end.", "author": "Steve Jobs"}
        ],
        "engagement_questions": [
            "What's the worst presentation mistake you've seen?",
            "PowerPoint, Keynote, or Google Slides—and why?",
            "How many slides is too many for a 30-minute presentation?",
            "What's your go-to framework for structuring a pitch?",
            "Do you write the narrative first or design the slides first?"
        ]
    }
    
    def __init__(self):
        self.queue: List[SocialPost] = []
        self.published: List[SocialPost] = []
        self.content_calendar: List[Dict] = []
    
    def create_tip_post(self, tip_index: int = None) -> SocialPost:
        """Create a tip-based social post"""
        tips = self.CONTENT_BANK["tips"]
        tip = tips[tip_index % len(tips)] if tip_index else tips[0]
        
        template = self.TEMPLATES[ContentType.TIP][0]
        content = template.format(tip=tip, hashtags="#SlideTheory #Consulting")
        
        return SocialPost(
            platform=Platform.BOTH,
            content_type=ContentType.TIP,
            content=content,
            hashtags=["#SlideTheory", "#Consulting", "#PresentationTips"]
        )
    
    def create_quote_post(self, quote_index: int = None) -> SocialPost:
        """Create a quote post"""
        quotes = self.CONTENT_BANK["quotes"]
        quote_data = quotes[quote_index % len(quotes)] if quote_index else quotes[0]
        
        template = self.TEMPLATES[ContentType.QUOTE][0]
        content = template.format(
            quote=quote_data["text"],
            author=quote_data["author"],
            hashtags="#ConsultingWisdom #SlideTheory"
        )
        
        return SocialPost(
            platform=Platform.LINKEDIN,
            content_type=ContentType.QUOTE,
            content=content,
            hashtags=["#ConsultingWisdom", "#SlideTheory", "#Leadership"]
        )
    
    def create_promo_post(self, message: str, cta: str, link: str) -> SocialPost:
        """Create a promotional post"""
        template = self.TEMPLATES[ContentType.PROMOTION][0]
        content = template.format(
            message=message,
            cta=cta,
            link=link,
            hashtags="#SlideTheory #ConsultingTools"
        )
        
        return SocialPost(
            platform=Platform.BOTH,
            content_type=ContentType.PROMOTION,
            content=content,
            hashtags=["#SlideTheory", "#ConsultingTools"]
        )
    
    def create_engagement_post(self, question_index: int = None) -> SocialPost:
        """Create an engagement/poll post"""
        questions = self.CONTENT_BANK["engagement_questions"]
        question = questions[question_index % len(questions)] if question_index else questions[0]
        
        template = self.TEMPLATES[ContentType.ENGAGEMENT][1]
        content = template.format(question=question, hashtags="#ConsultingChat")
        
        return SocialPost(
            platform=Platform.LINKEDIN,
            content_type=ContentType.ENGAGEMENT,
            content=content,
            hashtags=["#ConsultingChat", "#SlideTheory"]
        )
    
    def create_thread(self, topic: str, points: List[str]) -> List[SocialPost]:
        """Create a Twitter/X thread"""
        posts = []
        
        # First post
        opener = f"🧵 {topic}\n\nA thread for consultants who want to level up their presentations:\n\n(1/{len(points) + 1})"
        first = SocialPost(
            platform=Platform.TWITTER,
            content_type=ContentType.THREAD,
            content=opener
        )
        posts.append(first)
        
        # Body posts
        for i, point in enumerate(points):
            content = f"{i+1}/ {point}\n\n({i+2}/{len(points) + 1})"
            post = SocialPost(
                platform=Platform.TWITTER,
                content_type=ContentType.THREAD,
                content=content,
                parent_id=first.id
            )
            posts.append(post)
        
        # Final CTA post
        closer = f"Follow @SlideTheory for more presentation tips that actually work.\n\nWhat should we cover next? 👇"
        final = SocialPost(
            platform=Platform.TWITTER,
            content_type=ContentType.THREAD,
            content=closer,
            parent_id=first.id
        )
        posts.append(final)
        
        return posts
    
    def schedule_post(self, post: SocialPost, scheduled_time: datetime) -> SocialPost:
        """Schedule a post for a specific time"""
        post.scheduled_time = scheduled_time
        post.status = "scheduled"
        self.queue.append(post)
        return post
    
    def auto_schedule(self, post: SocialPost, platform: Platform = None, 
                      start_from: datetime = None) -> SocialPost:
        """Automatically schedule at optimal time"""
        platform = platform or post.platform
        start_from = start_from or datetime.now()
        
        # Find next optimal time
        optimal = self.OPTIMAL_TIMES.get(
            platform if platform != Platform.BOTH else Platform.LINKEDIN
        )
        
        # Simple scheduling: next available optimal slot
        next_slot = start_from + timedelta(days=1)
        next_slot = next_slot.replace(hour=9, minute=0, second=0)
        
        return self.schedule_post(post, next_slot)
    
    def generate_weekly_schedule(self, start_date: datetime = None) -> List[SocialPost]:
        """Generate a full week of scheduled content"""
        start_date = start_date or datetime.now()
        posts = []
        
        schedule_plan = [
            # (day_offset, platform, content_type, generator)
            (0, Platform.LINKEDIN, "tip", lambda: self.create_tip_post(0)),
            (0, Platform.TWITTER, "tip", lambda: self.create_tip_post(1)),
            (1, Platform.LINKEDIN, "quote", lambda: self.create_quote_post(0)),
            (2, Platform.BOTH, "tip", lambda: self.create_tip_post(2)),
            (3, Platform.LINKEDIN, "engagement", lambda: self.create_engagement_post(0)),
            (4, Platform.TWITTER, "tip", lambda: self.create_tip_post(3)),
            (5, Platform.LINKEDIN, "quote", lambda: self.create_quote_post(1)),
        ]
        
        for day_offset, platform, content_type, generator in schedule_plan:
            post = generator()
            post.platform = platform
            scheduled_time = start_date + timedelta(days=day_offset)
            scheduled_time = scheduled_time.replace(hour=9, minute=0)
            self.schedule_post(post, scheduled_time)
            posts.append(post)
        
        return posts
    
    def get_queue(self, platform: Platform = None, status: str = None) -> List[SocialPost]:
        """Get scheduled posts with optional filters"""
        filtered = self.queue
        
        if platform:
            filtered = [p for p in filtered if p.platform == platform or p.platform == Platform.BOTH]
        if status:
            filtered = [p for p in filtered if p.status == status]
        
        return sorted(filtered, key=lambda p: p.scheduled_time or datetime.now())
    
    def export_schedule(self, format: str = "json") -> str:
        """Export schedule to various formats"""
        queue_data = []
        for post in sorted(self.queue, key=lambda p: p.scheduled_time or datetime.min):
            queue_data.append({
                "id": post.id,
                "platform": post.platform.value,
                "content_type": post.content_type.value,
                "content": post.content,
                "scheduled_time": post.scheduled_time.isoformat() if post.scheduled_time else None,
                "status": post.status,
                "hashtags": post.hashtags
            })
        
        if format == "json":
            return json.dumps(queue_data, indent=2)
        elif format == "csv":
            import csv
            import io
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=["id", "platform", "content_type", 
                                                        "scheduled_time", "content"])
            writer.writeheader()
            for item in queue_data:
                writer.writerow(item)
            return output.getvalue()
        
        return json.dumps(queue_data, indent=2)
    
    def publish_now(self, post_id: str) -> bool:
        """Mark a post as published (integration with APIs would go here)"""
        for post in self.queue:
            if post.id == post_id:
                post.status = "published"
                post.published_time = datetime.now()
                self.published.append(post)
                self.queue.remove(post)
                return True
        return False


# CLI Interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="SlideTheory Social Media Scheduler")
    parser.add_argument("--weekly", action="store_true", help="Generate weekly schedule")
    parser.add_argument("--export", choices=["json", "csv"], help="Export schedule")
    parser.add_argument("--queue", action="store_true", help="Show current queue")
    parser.add_argument("--tip", action="store_true", help="Generate tip post")
    parser.add_argument("--quote", action="store_true", help="Generate quote post")
    
    args = parser.parse_args()
    
    scheduler = SocialMediaScheduler()
    
    if args.weekly:
        posts = scheduler.generate_weekly_schedule()
        print(f"Generated {len(posts)} posts for the week")
        for post in posts:
            print(f"[{post.scheduled_time.strftime('%Y-%m-%d %H:%M')}] {post.platform.value}: {post.content[:50]}...")
    
    elif args.export:
        scheduler.generate_weekly_schedule()
        print(scheduler.export_schedule(args.export))
    
    elif args.queue:
        queue = scheduler.get_queue()
        for post in queue:
            print(f"[{post.status}] {post.platform.value}: {post.content[:60]}...")
    
    elif args.tip:
        post = scheduler.create_tip_post()
        print(post.content)
    
    elif args.quote:
        post = scheduler.create_quote_post()
        print(post.content)
    
    else:
        print("SlideTheory Social Media Scheduler")
        print("Use --help for options")
