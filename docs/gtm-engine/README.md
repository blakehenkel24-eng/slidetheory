# SlideTheory Autonomous GTM Engine
## Complete Self-Running Go-to-Market System

---

## SYSTEM OVERVIEW

This is a fully autonomous GTM system that runs daily in the background. It executes marketing, research, content, and outreach tasks without requiring your daily input.

**Core Philosophy:** Compound momentum through consistent daily actions.

---

## DAILY AUTONOMOUS ACTIVITIES

### Morning (8 AM) — Market Intelligence
```
Task: Spawn Market Intel Agent
Duration: 15 minutes
Output: Daily market brief saved to /gtm/daily-briefs/
```

**Agent Instructions:**
1. Search for "AI presentation tools" news from last 24h
2. Check competitor pricing/pages for changes
3. Identify 1-2 content opportunities (trends, questions, gaps)
4. Summarize findings + recommend actions

---

### Mid-Morning (10 AM) — Content Creation
```
Task: Spawn Content Agent  
Duration: 30 minutes
Output: 1 piece of content ready for review
```

**Weekly Rotation:**
- **Monday:** LinkedIn post (consulting tip/framework)
- **Tuesday:** Twitter/X thread (AI + consulting insight)
- **Wednesday:** Blog post draft (SEO-targeted)
- **Thursday:** Newsletter content (value-packed)
- **Friday:** Case study or testimonial content

**Agent Instructions:**
1. Reference past high-performing content
2. Include SlideTheory mention naturally
3. Add CTA only if value is established
4. Save to /gtm/content-queue/ for approval

---

### Afternoon (2 PM) — Prospect Research
```
Task: Spawn Prospecting Agent
Duration: 20 minutes
Output: 5 qualified leads with personalized outreach
```

**Target Profile:**
- Strategy consultants (independent or Big 4)
- LinkedIn headline includes: "consultant", "strategy", "MBA"
- Recent activity: posting about consulting/decks
- Followers: 500-10,000 (engaged micro-influencers)

**Agent Instructions:**
1. Search LinkedIn/Twitter for target profile
2. Analyze their recent posts for context
3. Draft personalized connection message
4. Save to /gtm/outreach-queue/ for approval

---

### Evening (6 PM) — Analytics & Optimization
```
Task: Spawn Analytics Agent
Duration: 10 minutes
Output: Daily metrics report + recommendations
```

**Metrics to Track:**
- Website traffic (if analytics accessible)
- Content engagement (likes, shares, comments)
- New signups/trials
- Conversion rates

**Agent Instructions:**
1. Pull available metrics
2. Compare to previous week
3. Identify 1 optimization opportunity
4. Log to /gtm/analytics/

---

## WEEKLY AUTONOMOUS ACTIVITIES

### Sunday Evening — Week Planning
```
Task: Spawn Strategy Agent
Duration: 20 minutes
Output: Weekly GTM plan with priorities
```

**Agent Instructions:**
1. Review last week's results
2. Analyze what's working/not working
3. Set 3 priorities for upcoming week
4. Update /gtm/weekly-plans/

---

### Wednesday — Deep Research
```
Task: Spawn Deep Research Agent
Duration: 45 minutes
Output: Comprehensive research report
```

**Weekly Rotation:**
- Week 1: Competitor deep-dive
- Week 2: Customer persona research
- Week 3: Content gap analysis
- Week 4: Partnership/opportunity scan

---

## CRON JOB SETUP

Add these to your OpenClaw cron system:

```json
{
  "name": "SlideTheory GTM - Morning Intel",
  "schedule": { "kind": "cron", "expr": "0 8 * * *" },
  "payload": {
    "kind": "agentTurn",
    "message": "AUTONOMOUS GTM TASK: Daily Market Intelligence\n\n1. Search web for 'AI presentation tools' + 'consulting' news from last 24h\n2. Check landing pages of Gamma, Tome, Beautiful.ai for changes\n3. Find 1-2 trending topics in consulting/strategy space\n4. Write brief summary (max 300 words)\n5. Save to: /gtm/daily-briefs/YYYY-MM-DD.md\n6. If major competitor change detected, notify Blake immediately\n\nDO NOT ask for clarification. Execute and report completion."
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "announce", "channel": "telegram", "to": "6809895825" }
}
```

```json
{
  "name": "SlideTheory GTM - Content Creation",
  "schedule": { "kind": "cron", "expr": "0 10 * * *" },
  "payload": {
    "kind": "agentTurn",
    "message": "AUTONOMOUS GTM TASK: Daily Content Creation\n\nCONTEXT: SlideTheory - AI slide generator for strategy consultants\nGOAL: Create 1 piece of platform-native content\n\nDETERMINE DAY TYPE:\n- Monday = LinkedIn post (consulting framework/tip)\n- Tuesday = Twitter/X thread (AI + consulting insight)\n- Wednesday = Blog post (SEO: 'consulting presentations', 'strategy decks')\n- Thursday = Newsletter content\n- Friday = Case study/testimonial format\n\nTODAY IS [determine day]\n\nREQUIREMENTS:\n- Lead with value, not product pitch\n- Include concrete example/framework\n- Natural SlideTheory mention only if relevant\n- End with soft CTA or engagement question\n- Save to: /gtm/content-queue/YYYY-MM-DD-[platform].md\n\nDO NOT ask for approval. Create and save. Blake will review queue."
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "none" }
}
```

```json
{
  "name": "SlideTheory GTM - Prospect Research",
  "schedule": { "kind": "cron", "expr": "0 14 * * 1-5" },
  "payload": {
    "kind": "agentTurn",
    "message": "AUTONOMOUS GTM TASK: Daily Prospecting (Weekdays Only)\n\nTARGET PROFILE:\n- Strategy consultants (independent or Big 4/Accenture)\n- LinkedIn/Twitter active in last 7 days\n- Posts about: consulting, strategy, presentations, client work\n- Follower range: 500-10,000 (engaged, not celebrity)\n\nTASK:\n1. Identify 5 prospects matching profile\n2. Analyze their recent 3-5 posts for context/interests\n3. Draft personalized connection message (1-2 sentences)\n4. Suggest value-first engagement (comment on post, share insight)\n\nOUTPUT FORMAT (for each prospect):\n- Name:\n- Platform:\n- Why qualified:\n- Recent post topic:\n- Suggested message:\n- First engagement action:\n\nSave to: /gtm/outreach-queue/YYYY-MM-DD-prospects.md\n\nDO NOT send any messages. Queue for Blake approval."
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "none" }
}
```

```json
{
  "name": "SlideTheory GTM - Analytics Review",
  "schedule": { "kind": "cron", "expr": "0 18 * * *" },
  "payload": {
    "kind": "agentTurn",
    "message": "AUTONOMOUS GTM TASK: Daily Analytics\n\nTRACK (if accessible):\n- Website: visitors, signups, conversion rate\n- Content: engagement rates by platform\n- Growth: new followers, newsletter subs\n\nANALYSIS:\n1. Calculate vs. previous day/week\n2. Identify top-performing content type/topic\n3. Flag any anomalies (spikes, drops)
4. Recommend 1 optimization action\n\nOUTPUT:\nSave to: /gtm/analytics/YYYY-MM-DD-metrics.md\n\nNOTIFY BLAKE IF:\n- Signup rate drops >20%\n- Major traffic spike (>50% increase)\n- Competitor makes significant move\n\nOtherwise, log silently."
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "none" }
}
```

```json
{
  "name": "SlideTheory GTM - Weekly Strategy",
  "schedule": { "kind": "cron", "expr": "0 20 * * 0" },
  "payload": {
    "kind": "agentTurn",
    "message": "AUTONOMOUS GTM TASK: Weekly Strategy Review\n\nCONTEXT: Reviewing last week's GTM performance for SlideTheory\n\nANALYSIS:\n1. Read /gtm/daily-briefs/ from last 7 days\n2. Read /gtm/content-queue/ - what was created?\n3. Read /gtm/analytics/ - what were the trends?\n4. Read /gtm/outreach-queue/ - prospecting activity\n\nOUTPUT:\nCreate: /gtm/weekly-plans/YYYY-MM-DD-weekly-review.md\n\nInclude:\n- What worked well\n- What underperformed\n- 3 priorities for next week\n- Content themes to focus on\n- 1 experiment to run\n\nDELIVER: Send summary to Blake via Telegram"
  },
  "sessionTarget": "isolated",
  "delivery": { "mode": "announce", "channel": "telegram", "to": "6809895825" }
}
```

---

## FOLDER STRUCTURE

```
gtm/
├── daily-briefs/           # Market intel reports
├── content-queue/          # Content ready for review
├── outreach-queue/         # Prospects + messages ready
├── analytics/              # Daily metrics reports
├── weekly-plans/           # Strategy reviews
├── templates/              # Reusable content templates
└── experiments/            # A/B test results
```

---

## CONTENT TEMPLATES

### LinkedIn Post Template (Monday)
```
[Hook - contrarian take or bold statement]

[Problem setup]

[Framework/Solution - numbered or bulleted]
1. 
2. 
3. 

[Your insight/take]

[Soft CTA or question to drive engagement]

#consulting #strategy #[relevant]
```

### Twitter Thread Template (Tuesday)
```
Tweet 1/5: [Hook - strong opinion or surprising stat]

Tweet 2/5: [The problem everyone ignores]

Tweet 3/5: [The framework that actually works]

Tweet 4/5: [How to apply it]

Tweet 5/5: [CTA - follow for more + link to tool]
```

### Blog Post Template (Wednesday)
```
Title: [SEO keyword] + [Benefit]

Intro: [Problem + promise of solution]

Section 1: [Why current approach fails]

Section 2: [The better way - framework]

Section 3: [Step-by-step implementation]

Section 4: [Real example/case study]

Conclusion: [Summary + soft CTA to try SlideTheory]
```

---

## SUCCESS METRICS

**Daily Targets:**
- 1 market intel brief created
- 1 content piece drafted
- 5 prospects researched
- 1 optimization identified

**Weekly Targets:**
- 5 content pieces in queue
- 25 prospects researched
- 7 daily briefs analyzed
- 1 strategic experiment designed

**Monthly Goals:**
- 20 content pieces published (with Blake approval)
- 100 prospects identified
- 4 strategic deep-dives completed
- 1 major GTM insight/action implemented

---

## EXCEPTION HANDLING

**When Agent Can't Complete Task:**
1. Log specific blocker to /gtm/errors/
2. Notify Blake with: "GTM Task Blocked: [task] - [specific issue]"
3. Suggest alternative approach

**When Major Opportunity/Threat Detected:**
1. Immediately notify Blake via Telegram
2. Include context + recommended action
3. Pause other tasks if urgent

**When API/Tools Fail:**
1. Retry with exponential backoff (3 attempts)
2. If still failing, log error + notify
3. Proceed with partial data if possible

---

## HUMAN REVIEW POINTS

These require Blake approval before execution:

- ❌ Posting content publicly (always queue for review)
- ❌ Sending outreach messages (always queue for review)
- ❌ Changing pricing or major positioning
- ❌ Responding to customer complaints/issues
- ❌ Any external commitment or partnership

These run fully autonomously:

- ✅ Market research and monitoring
- ✅ Content drafting and queuing
- ✅ Prospect identification and research
- ✅ Analytics collection and reporting
- ✅ Internal documentation and organization

---

## GETTING STARTED

1. **Create folder structure** in your workspace
2. **Install cron jobs** using the JSON configs above
3. **Set up delivery** to your Telegram for notifications
4. **Review first week** - adjust agent instructions based on output quality
5. **Approve/reject content** from the queue daily (5 min review)

---

## EXPECTED RESULTS

**Week 1:** System operational, learning your preferences
**Week 2-4:** Content backlog building, insights emerging
**Month 2:** Consistent presence, compound growth starting
**Month 3:** Measurable traffic/signup increase from content

**Time Investment Required From You:**
- Daily: 5 min to review/approve content queue
- Weekly: 15 min to review weekly strategy report
- Monthly: 30 min to adjust system based on results

**Total: ~2 hours/month for full GTM execution**
