export const FUNDRAISING_CHAPTERS = [
  {
    id: 'stage-readiness',
    title: '1. Pre-Fundraising Blueprint & Readiness',
    subtitle: 'Benchmarks, clean cap tables, and metrics needed before pitching',
    icon: 'Compass',
    content: {
      overview: 'Fundraising is a structured milestone-driven process, not an open-ended sales pitch. Top VCs look for specific proof points at each stage.',
      sections: [
        {
          heading: 'Fundraising Benchmarks by Stage',
          points: [
            {
              stage: 'Pre-Seed ($250k - $1M)',
              dilution: '10% - 15%',
              valuation: '$2.5M - $6M Post',
              requirements: 'Compelling founder narrative, unique insight/unfair advantage, working prototype or early MVP, initial user feedback, clear bottom-up TAM.',
              instruments: 'Post-Money YC SAFE or Convertible Note with Valuation Cap.'
            },
            {
              stage: 'Seed ($1.5M - $4M)',
              dilution: '15% - 20%',
              valuation: '$8M - $18M Post',
              requirements: 'Early Product-Market Fit (PMF), $10k - $50k MRR (for SaaS/B2B) or 10k+ highly engaged DAU/WAU (for Consumer), repeatable acquisition channel, 10-20% MoM growth.',
              instruments: 'Priced Equity Round (Series Seed) or Post-Money SAFE.'
            },
            {
              stage: 'Series A ($8M - $20M)',
              dilution: '15% - 22%',
              valuation: '$35M - $80M Post',
              requirements: 'Proven, repeatable go-to-market engine, $1.5M - $3M ARR, strong net revenue retention (>115%), positive unit economics (LTV/CAC > 3x), clear path to $10M ARR in 24 months.',
              instruments: 'Priced Preferred Stock with 1x Non-Participating Liquidation Preference.'
            }
          ]
        },
        {
          heading: 'The 4 Golden Rules of Clean Cap Tables',
          rules: [
            'Founders should retain 80%+ equity entering the Seed stage (avoid giving away >20% to pre-launch advisors or sweat equity).',
            '4-year vesting with a 1-year cliff for all co-founders (protects against early co-founder departures).',
            'Create a standard 10-15% unallocated Employee Stock Option Pool (ESOP) to attract top engineering & sales talent.',
            'Never grant board seats or blocking vetoes to angel investors during pre-seed.'
          ]
        }
      ]
    }
  },
  {
    id: 'pitch-deck',
    title: '2. The Irresistible 10-Slide Pitch Deck',
    subtitle: 'Slide-by-slide structure that hooks top partners in under 3 minutes',
    icon: 'Layers',
    content: {
      overview: 'VCs spend an average of 2 minutes and 40 seconds reviewing a pitch deck. Your deck must tell a compelling, logically inevitable story.',
      slides: [
        {
          number: '01',
          title: 'Company Purpose & The Hook',
          description: 'One crisp sentence explaining what you do, who you do it for, and why it is 10x better. E.g., "Stripe is the financial infrastructure for the internet."'
        },
        {
          number: '02',
          title: 'The Problem & Market Pain',
          description: 'Describe the intense, bleeding-neck problem your customers face today. Show the quantifiable cost of doing nothing (wasted hours, lost revenue, compliance risk).'
        },
        {
          number: '03',
          title: 'The Solution & The Magic Demo',
          description: 'Showcase your product in action with 2-3 screenshots or visual flow. Highlight the "Aha!" moment where customers experience immediate value.'
        },
        {
          number: '04',
          title: 'Why Now? (Market Inflection Point)',
          description: 'Why was this impossible 3 years ago and mandatory today? (e.g., LLM breakthroughs, regulatory mandates, shifts in consumer behavior, API ubiquity).'
        },
        {
          number: '05',
          title: 'Market Size (Bottoms-Up TAM)',
          description: 'Avoid generic top-down reports ($50B market). Show bottoms-up arithmetic: (Total Potential Customers in Segment) × (Annual Contract Value / ARPU) = Real TAM.'
        },
        {
          number: '06',
          title: 'Secret Sauce & Defensibility Moats',
          description: 'What makes your company defensible over a 10-year horizon? (Proprietary data flywheels, high switching costs, network effects, distribution monopolies).'
        },
        {
          number: '07',
          title: 'Traction, Revenue & Cohort Metrics',
          description: 'The heartbeat of your deck: ARR/MRR growth chart, user retention curves, customer testimonials, logos, net revenue retention (NRR), and pipeline.'
        },
        {
          number: '08',
          title: 'Business Model & Go-To-Market (GTM)',
          description: 'How do you acquire customers predictably and scalably? (Product-led growth, outbound enterprise sales, partner ecosystem, viral referral loops).'
        },
        {
          number: '09',
          title: 'Team & Unfair Advantage',
          description: 'Why is your founding team uniquely qualified to win this specific category? Past founder exits, domain expertise from industry leaders, elite technical pedigree.'
        },
        {
          number: '10',
          title: 'The Ask, Milestones & Use of Funds',
          description: 'State the round size (e.g., "Raising $3.0M Seed"), runway runway provided (18-24 months), and exact milestones you will hit before Series A ($2M ARR, 50 enterprise pilots).'
        }
      ]
    }
  },
  {
    id: 'networking-intros',
    title: '3. The Warm Intro & Outreach Engine',
    subtitle: 'How to get into the inbox of Tier 1 partners with maximum credibility',
    icon: 'Share2',
    content: {
      overview: 'Top VC partners receive 500+ cold pitches weekly. The best way to guarantee a meeting is through trusted warm introductions.',
      strategies: [
        {
          level: 'Gold Standard (90% Response Rate)',
          source: 'Portfolio Founders Backed by the VC',
          tactic: 'Connect with a founder in the VC\'s active portfolio. Ask for 15 minutes of feedback on your product. If they love what you\'re building, they will enthusiastically introduce you to their lead partner.'
        },
        {
          level: 'Silver Standard (60% Response Rate)',
          source: 'Respected Angel Investors & Seed GPs',
          tactic: 'Have an angel investor or scout who backed your pre-seed send a personal recommendation email directly to the growth partner.'
        },
        {
          level: 'High-Converting Cold Outreach (25-35% Response Rate)',
          source: 'Direct Partner Email / Twitter DM',
          tactic: 'Keep it under 150 words. Focus strictly on: 1) What you built, 2) Jaw-dropping traction metric, 3) Why this specific partner\'s thesis matches, 4) Link to 3-min Loom / deck.'
        }
      ]
    }
  },
  {
    id: 'pitching-negotiation',
    title: '4. Pitch Meeting Mastery & Term Sheet Defense',
    subtitle: 'Running a competitive 4-week process and avoiding toxic clauses',
    icon: 'Scale',
    content: {
      overview: 'Fundraising is a game of momentum. Run all partner meetings in parallel over a tight 3 to 4-week sprint to create authentic competitive demand.',
      redFlags: [
        {
          term: 'Participating Preferred Stock',
          danger: 'HIGH DANGER: The investor gets their 1x money back AND also takes their percentage of remaining proceeds ("double dipping"). Always insist on 1x Non-Participating Preferred.',
          verdict: 'Strictly avoid. Standard is 1x Non-Participating.'
        },
        {
          term: 'The "Option Pool Shuffle" Pre-Money Trick',
          danger: 'VCs may insist on creating a 15-20% new unallocated option pool inside the PRE-MONEY valuation, which dilutes ONLY the founders rather than all shareholders.',
          verdict: 'Negotiate the option pool size down to realistic 12-month hiring needs (typically 7-10%).'
        },
        {
          term: 'Excessive Board Control & Vetoes',
          danger: 'Giving a single seed investor board control or broad veto power over future financings, hiring executives, or company sale.',
          verdict: 'At Seed stage, founders should retain 2 out of 3 board seats (or 2 founders + 1 investor).'
        },
        {
          term: 'Super Pro-Rata Rights',
          danger: 'Giving an early angel or seed fund the right to buy more than their pro-rata ownership in later rounds, which crowds out future lead Series A investors.',
          verdict: 'Grant standard pro-rata only to major institutional investors.'
        }
      ]
    }
  },
  {
    id: 'post-raise',
    title: '5. Post-Raise Execution & Scaling to $100M+',
    subtitle: 'Investor updates, default alive runway management, and Series A graduation',
    icon: 'TrendingUp',
    content: {
      overview: 'Raising money is the starting line, not the finish line. How you deploy capital in the first 180 days determines whether you graduate to Series A.',
      bestPractices: [
        {
          title: 'The Monthly Investor Update (Gold Standard)',
          desc: 'Send a crisp monthly update on the 1st of every month. Include: Highlights (MRR, big wins), Lowlights (what broke), Runway/Cash Balance, and 3 specific Asks (introductions, hiring candidates).'
        },
        {
          title: 'Default Alive vs Default Dead',
          desc: 'Always maintain at least 18-24 months of cash runway. Ensure your burn rate grows slower than your gross profit expansion.'
        },
        {
          title: 'Hire for Capability, Not Headcount',
          desc: 'Top startups stay lean with 8-15 exceptional engineers and operators until product-market fit reaches true hyperscale.'
        }
      ]
    }
  }
];

export const EMAIL_TEMPLATES = [
  {
    id: 'forwardable-intro',
    title: '1. The "Forwardable Intro" Email (Send to Mutual Contact)',
    subject: 'Intro: [Startup Name] ([One-liner]) <> [Partner Name] @ [VC Firm]',
    body: `Hi [Mutual Contact Name],

Thanks so much for offering to connect us with [Partner Name] at [VC Firm]! Below is a short forwardable blurb:

---

Hi [Partner Name],

[Founder Name] is the Founder & CEO of [Startup Name]. They are building [one-sentence value proposition].

Key Highlights:
• Traction: Grown from $0 to $[X]k MRR in [X] months ([X]% MoM growth) with [Key Customers/Logos].
• Secret Sauce: [1 key proprietary moat or technological breakthrough].
• Team: Ex-[Google/Stanford/Stripe/IIT], previously built and scaled [relevant past achievement].
• Round: Currently raising a $[X]M [Seed / Pre-Seed] round (50%+ already committed from [Top Angels/Funds]).

Deck & 2-Min Demo: [Link to DocSend / Loom]

Would you be open to a 20-minute chat with [Founder Name] this Thursday or Friday?`
  },
  {
    id: 'cold-vc-outreach',
    title: '2. High-Converting Direct Partner Email',
    subject: '[Startup Name] ([One-sentence hook]) — Raising $[X]M [Seed]',
    body: `Hi [Partner Name],

I've been following your thesis on [Specific Sector / Theme, e.g., AI vertical agents / Developer Tools] and loved your investment in [Portfolio Company Name].

I'm the founder of [Startup Name] — we are [one-sentence company hook, e.g., building autonomous billing infrastructure for modern AI APIs].

Why this is scaling fast:
1. Traction: We hit $[X]k ARR in [X] months, scaling [X]% MoM across [Number] enterprise customers including [Customer 1, Customer 2].
2. The Insight: [1 sentence on why incumbent solutions fail and why customers switch to you].
3. Team: Founding team previously led engineering at [Company 1] and [Company 2].

We are opening our $[X]M [Seed/Pre-Seed] round and would love to share what we're seeing on the ground.

Here is our 3-minute deck & product demo: [Link]

Are you free for a brief 15-minute intro this week?

Best,
[Founder Name]
[Founder Phone / LinkedIn]`
  },
  {
    id: 'monthly-investor-update',
    title: '3. Monthly Investor Update (For Current & Prospective Angels)',
    subject: '[Startup Name] — [Month Year] Investor Update: $[X]k MRR (+[X]%), Key Wins & Asks',
    body: `Hi Team & Investors,

Here is our update for [Month Year]:

📊 TL;DR Metrics:
• MRR: $[X]k (up +[X]% from $[X]k last month)
• Total Customers: [X] active ([+X] this month)
• Monthly Net Burn: $[X]k
• Cash in Bank: $[X]k ([X] months of runway remaining)

🚀 Highlights & Major Wins:
• Closed key enterprise contracts with [Customer 1] and [Customer 2].
• Shipped [Major Product Feature] which reduced churn by [X]%.
• Welcomed [Name], ex-[Company], as our Head of Engineering.

⚠️ Lowlights & Challenges:
• Enterprise sales cycle in [Sub-segment] took 2 weeks longer than anticipated.
• Pipeline in [Region] was affected by [Reason] — taking corrective action by [Fix].

🎯 Focus for Next Month:
1. Scale MRR to $[X]k.
2. Launch self-serve onboarding flow.
3. Close 3 pending pilots.

🤝 How You Can Help (Our Asks):
• Intro to VP of Engineering at [Target Account 1] or [Target Account 2].
• Looking for referrals for senior React/Go backend engineers in [City/Remote].

Thanks for your continued partnership and support!

Best,
[Founder Name]`
  }
];

export const READINESS_QUESTIONS = [
  {
    id: 'pmf',
    question: '1. What is your current product & traction status?',
    options: [
      { label: 'Idea / Concept only (no code/MVP yet)', points: 1 },
      { label: 'Working MVP with early beta user feedback', points: 3 },
      { label: 'Live in market with paying customers ($1k - $15k MRR, growing >15% MoM)', points: 5 },
      { label: 'Scalable revenue ($15k - $100k+ MRR, high retention cohorts)', points: 6 }
    ]
  },
  {
    id: 'team',
    question: '2. What is your founding team profile?',
    options: [
      { label: 'Solo founder looking for technical co-founder', points: 1 },
      { label: 'Complete team (Technical + Domain/Business lead) with strong chemistry', points: 4 },
      { label: 'Repeat founders or alumni from top tech tier (Google, Stripe, IIT, Stanford)', points: 5 }
    ]
  },
  {
    id: 'materials',
    question: '3. Are your fundraising materials & data room ready?',
    options: [
      { label: 'No deck or financial model yet', points: 1 },
      { label: 'Draft 10-slide deck created', points: 3 },
      { label: 'Polished 10-slide deck, 2-min Loom demo, clean cap table & financial model', points: 5 }
    ]
  },
  {
    id: 'network',
    question: '4. How are you approaching target VC partners?',
    options: [
      { label: 'Cold blasting emails without research', points: 1 },
      { label: 'Reaching out through LinkedIn and generic forms', points: 2 },
      { label: 'Curated list of 40+ partners with warm intro pathways mapped out', points: 5 }
    ]
  }
];
