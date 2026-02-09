#!/usr/bin/env tsx
// Content Generation Job
// Runs at 10am CST daily

import { writeOutput } from '../lib/storage';

async function run() {
  console.log('✍️ Starting Content Generation job...');
  const startTime = Date.now();
  
  // Generate blog draft
  const blogContent = `# Blog Draft: The Future of AI-Powered Consulting Presentations

## Hook
What if you could create McKinsey-quality slides in 5 minutes?

## Key Points
1. Traditional slide creation is a massive time sink
2. AI can handle structure and formatting
3. Consultants should focus on insights, not formatting
4. Quality control remains essential

## CTA
Try SlideTheory → Create your first AI-powered deck

---
Status: Draft ready for review
Generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST
`;

  await writeOutput('content', 'blog-draft.md', blogContent);
  console.log('✅ Blog draft saved');
  
  // Generate social posts
  const socialContent = {
    linkedin: [
      "Just shipped: New template library for strategy consultants 🚀",
      "5 minutes to McKinsey-quality slides? Here's how AI makes it possible 👇",
      "Consultants spend 40% of their time formatting slides. What if that was 5%?"
    ],
    twitter: [
      "AI won't replace consultants, but consultants using AI will replace those who don't",
      "New templates dropped 🎨 Strategy frameworks now auto-format in SlideTheory"
    ],
    scheduledFor: new Date().toISOString().split('T')[0]
  };

  await writeOutput('content', 'social-posts.json', JSON.stringify(socialContent, null, 2));
  console.log('✅ Social posts saved');
  
  // Email newsletter
  const emailContent = `# Newsletter: This Week in AI for Consultants

Hi there,

Here's what caught our attention this week:

**🚀 McKinsey's New GenAI Report**
The consulting giant released findings on AI adoption. Key takeaway: Early adopters see 30% efficiency gains.

**📊 SlideTheory Updates**
- New template: Market Entry Strategy
- Improved chart formatting
- Faster generation times

**💡 Pro Tip**
Use the /framework command to instantly apply McKinsey-style structures to your content.

See you next week,
The SlideTheory Team

---
Generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST
`;

  await writeOutput('content', 'email-newsletter.md', emailContent);
  console.log('✅ Newsletter saved');
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Content Generation complete (${duration}s)`);
}

run().catch(console.error);
