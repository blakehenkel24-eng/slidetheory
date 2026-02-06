# How I Use Claude for Consulting Work

## The moment I realized AI could change my workflow

It was 6:47 AM on the Metra train into Chicago. I had a diligence report due by 10 AM, 40 slides of analysis that I'd somehow compressed into exactly 3 hours of actual work the night before. The partner was expecting it. The client was paying for it. And I was staring at a blank slide titled "Technology Risk Assessment" with exactly zero coherent thoughts.

I pulled out my phone, opened Claude, and typed: "I'm reviewing a healthcare SaaS company for PE acquisition. Their tech stack is 40% legacy COBOL, they've had 3 outages in 6 months, and their CTO is leaving. Structure a risk assessment slide that doesn't scare the deal but doesn't bury the problems either."

45 seconds later, I had a framework. Three buckets: Immediate Risks (mitigatable), Medium-Term Concerns (plan required), Strategic Limitations (disclosure item). By the time I got to Union Station, I had the outline. By 9:30, I had the deck.

That was 8 months ago. I haven't worked the same way since.

---

## What consulting work actually looks like

If you don't work in consulting, you probably think it's about big ideas and strategic frameworks. And sometimes it is. But most days? It's the relentless production of clear communication under impossible time constraints.

A typical week looks like:

- **Monday:** 3-hour call with a PE firm, then turn my notes into a 20-slide summary by EOD
- **Tuesday:** Research day — read 200 pages of documentation, interview 4 stakeholders, somehow synthesize it into "key findings"
- **Wednesday:** Draft a 50-page diligence report that 3 people will read in full
- **Thursday:** Revise everything based on feedback that arrives at 7 PM
- **Friday:** Pitch deck for a new engagement, strategy memo for an existing one, and somewhere in there respond to 47 Slack messages

The work product isn't the insight. The work product is the *articulation* of the insight — the slide that makes the complex simple, the email that moves the project forward, the framework that structures the conversation.

And until recently, that articulation took 80% of my time.

---

## How I actually use Claude day-to-day

I don't use AI to replace thinking. I use it to accelerate the gap between "I understand this" and "I've communicated this effectively."

Here's my actual workflow:

### Morning: Prioritizing the day (5 minutes)

Every morning on the train, I dump my thoughts into Claude:

> "I have 6 hours of actual work time today. I need to: finish the cloud infrastructure assessment, review 2 vendor contracts, prep for tomorrow's client presentation, and respond to 12 emails. What's the highest-leverage order?"

The AI doesn't just list tasks. It forces me to think about dependencies: *You can't finish the assessment until you get the AWS architecture docs, which means email that architect first. The contracts are lower stakes and can be batched for the afternoon energy dip.*

It's like having a skeptical colleague who asks the obvious questions I'm too in the weeds to see.

### Research: Synthesizing information (saves 2-3 hours)

PE diligence means reading everything: financial models, technical architecture docs, security audits, org charts. Hundreds of pages. Most of it boilerplate. Some of it critical.

My prompt:

> "I'm reviewing a technology due diligence packet. Extract: 1) All forward-looking statements about product roadmap, 2) Any mentions of technical debt or legacy systems, 3) Key personnel changes or retention risks, 4) Anything that contradicts other parts of the document. Format as bullets with page references."

What used to take 4 hours of careful reading now takes 45 minutes of verification. The AI finds the needles. I decide if they're important.

### Slides: Structuring arguments (this is where SlideTheory came from)

The real magic happens in presentation structure. Most consultants are good at analysis. We're terrible at deciding what to leave out.

Here's a real prompt I used last week:

> "I need to present a 'proceed with caution' recommendation to a PE firm that's excited about this deal. The company has solid growth but serious technical risk. Structure a 5-slide summary that: leads with the opportunity (so they don't get defensive), quantifies the technical risk in business terms (not engineering jargon), offers a specific mitigation path (not just 'fix the tech'), and gives them a clear decision framework. McKinsey-style: one insight per slide, supportive data only."

The first draft isn't perfect. But it's 70% there. The structure is sound. The logic flows. What used to be a 3-hour staring-at-a-blank-screen ordeal is now a 45-minute refinement exercise.

This workflow — the specific way I use AI to structure arguments — is exactly why I started building SlideTheory. I realized the bottleneck wasn't the writing. It was the *architecture* of the thinking. And that architecture can be systematized.

### Emails: Clearer communication (saves 30 min/day)

Consulting email is an art form. You need to be direct without being rude, comprehensive without being verbose, and action-oriented without being demanding.

My move: I write the email quickly (stream of consciousness), then prompt Claude:

> "Make this email clearer and more direct. Keep the tone consultative but not apologetic. Ensure there's a specific ask with a deadline. Remove any filler."

The result isn't robotic. It's just... cleaned up. The kind of email that gets read and responded to instead of buried in an overflowing inbox.

---

## Real prompts you can steal

Here are three prompts I use weekly, verbatim:

**For structuring analysis:**
```
I'm analyzing [TOPIC] for [CLIENT TYPE]. I have the following data points:
- [DATA POINT 1]
- [DATA POINT 2]
- [DATA POINT 3]

Structure this into a 3-part argument that leads to [RECOMMENDATION]. Each part should have a clear insight, supporting evidence, and a "so what" for the client. Avoid jargon. Use active voice.
```

**For executive summaries:**
```
Turn this 2,000-word analysis into a 150-word executive summary. Lead with the recommendation. Include only the 2-3 most critical supporting facts. Write for a CEO who has 60 seconds to read this.
```

**For difficult conversations:**
```
I need to tell a client that [BAD NEWS]. Draft an email that: acknowledges the impact, explains what happened (without making excuses), describes what we're doing about it, and proposes a path forward. Tone: accountable, not defensive. Professional but human.
```

---

## The results: Time and quality

I've tracked my hours for the past 6 months. Here's what changed:

| Task | Before AI | After AI | Time Saved |
|------|-----------|----------|------------|
| Research synthesis | 4 hours | 1.5 hours | 2.5 hours |
| Slide structure | 3 hours | 1 hour | 2 hours |
| Email drafting | 45 min | 15 min | 30 min |
| Document review | 3 hours | 1 hour | 2 hours |

**Weekly savings: ~7 hours**

But here's what matters more than time: the quality went *up*. I'm not rushing through the same work faster. I'm spending my time on the parts that actually require judgment — the nuanced recommendations, the client relationships, the strategic thinking — while AI handles the scaffolding.

The slides are better structured. The emails are clearer. The research is more comprehensive because I can actually read everything instead of skimming.

---

## What I don't use AI for

Worth saying: I don't use Claude for the actual thinking. I don't ask it "what should I recommend?" I ask it "how should I structure this recommendation I've already formed?"

The judgment is still mine. The client relationships are still mine. The expertise — knowing what questions to ask, what risks matter, what the client actually cares about — that's still human.

AI is a multiplier, not a replacement. It makes me faster at the things that don't require my specific expertise so I can spend more time on the things that do.

---

## The bottom line

If you're a consultant — strategy, tech, PE, whatever — and you're not using AI daily, you're working harder than you need to for worse output.

Start small. Pick one task. Use one of the prompts above. Refine it for your specific work. Build from there.

**If you want the slides version of this** — the specific frameworks, templates, and AI workflows I use to build presentations in 30 minutes instead of 3 hours — join the SlideTheory waitlist. I'm building exactly that: the tool I wish I had when I started.

👉 **[Join the waitlist →]**

The future of consulting isn't AI replacing consultants. It's consultants who use AI replacing consultants who don't.

---

*Blake is a technology consultant specializing in private equity technology diligence. He writes about consulting workflows, AI tools, and the occasional hard lesson at slidetheory.com.*
