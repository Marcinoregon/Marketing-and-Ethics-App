// ============================================================
//  SIMULATION DATA — Marketing to Vulnerable Populations
//  Each scenario has 5 steps. Each step has 3 choices scored
//  0 (worst), 1 (partial), or 2 (best). Max per scenario = 10.
// ============================================================

export const BADGES = [
  {
    id: 'ethics_champion',
    emoji: '🏆',
    label: 'Ethics Champion',
    description: 'Scored 28–30 points across all scenarios',
    threshold: 28,
    type: 'total',
    color: '#f59e0b',
  },
  {
    id: 'reformer',
    emoji: '🌱',
    label: 'Reformer',
    description: 'Scored 20–27 points — mostly ethical choices',
    threshold: 20,
    type: 'total',
    color: '#10b981',
  },
  {
    id: 'fence_sitter',
    emoji: '⚖️',
    label: 'The Gray Area',
    description: 'Scored 10–19 points — consistently chose the middle path',
    threshold: 10,
    type: 'total',
    color: '#818cf8',
  },
  {
    id: 'complicit',
    emoji: '🚨',
    label: 'Complicit',
    description: 'Scored below 10 — chose profit over people',
    threshold: 0,
    type: 'total',
    color: '#ef4444',
  },
  {
    id: 'streak_master',
    emoji: '🔥',
    label: 'Streak Master',
    description: 'Made 4 consecutive ethical choices in a single scenario',
    threshold: 4,
    type: 'streak',
    color: '#f97316',
  },
  {
    id: 'perfect_scenario',
    emoji: '💎',
    label: 'Flawless',
    description: 'Scored 10/10 on any single scenario',
    threshold: 10,
    type: 'scenario',
    color: '#06b6d4',
  },
];

export const CLASS_AVERAGE = 17; // mock baseline for comparison

export const scenarios = [
  // ─────────────────────────────────────────────────────────
  //  SCENARIO 1: PharmaEdge
  // ─────────────────────────────────────────────────────────
  {
    id: 'pharmaedge',
    title: 'PharmaEdge',
    subtitle: 'The Rural Pain Campaign',
    emoji: '💊',
    difficulty: 'Hard',
    difficultyColor: '#ef4444',
    population: 'Elderly rural patients',
    context:
      'You are the VP of Marketing at PharmaEdge, a mid-size pharmaceutical company. Your flagship product is ZenRelief — a powerful opioid-adjacent analgesic with a high efficacy rate for chronic pain but also a significant dependency risk that your internal studies have documented. The company is under pressure to grow market share in economically depressed rural regions where chronic pain rates are high, physician-to-patient ratios are low, and opioid addiction has already devastated communities.',
    steps: [
      {
        id: 'pe-1',
        stepLabel: 'Step 1: Targeting Strategy',
        scenario:
          'Your data science team delivers a targeting model that identifies rural clinic physicians who serve predominantly elderly patients (65+) on fixed incomes. These physicians are overwhelmed — they average 40+ patients per day and have limited time for detailed consultations. The model shows that physicians in this cluster have a 3× higher prescribing rate when given pharmaceutical samples.',
        dilemma:
          'How do you proceed with your physician outreach strategy in these rural clusters?',
        concept: {
          framework: 'Consumer Vulnerability',
          text: 'Elderly patients on fixed incomes represent compound vulnerability: cognitive changes reduce their capacity to critically evaluate medication risks, while financial constraints limit their ability to seek alternatives or pursue litigation.',
        },
        choices: [
          {
            label: 'Launch a high-frequency sample drop program exclusively targeting these rural clinics, pairing samples with data-driven detailing scripts optimized to close prescriptions quickly.',
            ethicalScore: 0,
            ethicalImpact: 'Exploitative',
            framework: 'Kantian Violation',
            consequence:
              'ZenRelief prescriptions surge 240% in the target region within 90 days. Twelve months later, your company faces its first wrongful death lawsuit as dependency-related overdoses emerge in rural communities. Your internal emails are subpoenaed.',
          },
          {
            label: 'Proceed with a modified outreach that includes clear printed materials about dependency risks, and require sales reps to discuss alternative pain management options when appropriate.',
            ethicalScore: 1,
            ethicalImpact: 'Partially Ethical',
            framework: 'Informed Consent',
            consequence:
              'Prescriptions grow modestly (+40%). Regulatory review later finds your risk disclosures were technically compliant but formatted in small print designed to minimize salience. A partial consent defense holds, but consumer advocates flag your tactics.',
          },
          {
            label: 'Decline to use the dependency-risk profile for targeting. Redirect the campaign to focus on physicians seeking alternatives to existing high-dependency opioids, with robust risk disclosure and patient monitoring protocols.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Virtue Ethics + Harm Prevention',
            consequence:
              'Growth is slower (+15%), but PharmaEdge earns a designation from a national physicians\' association for responsible analgesic marketing. This repositions the brand as a trusted partner rather than a pure sales machine.',
          },
        ],
      },
      {
        id: 'pe-2',
        stepLabel: 'Step 2: The Research Disclosure',
        scenario:
          'Your R&D team presents updated internal data: ZenRelief patients who take the drug for more than 90 days have a 34% dependency rate — substantially higher than the 12% figure cited in your approved labeling (which was derived from a shorter-term trial). The FDA has not yet requested an updated label. Going public would require a voluntary label amendment and would likely crater your stock price.',
        dilemma:
          'What do you do with this new internal dependency data?',
        concept: {
          framework: 'Post-Market Surveillance',
          text: 'The "reasonable producer" standard demands active post-market vigilance. A company that accumulates credible evidence of product-linked harm and delays action until legally compelled has already committed an ethical failure — independent of regulatory status.',
        },
        choices: [
          {
            label: 'Classify the findings as "preliminary" and commission a new study designed with shorter observation windows that will reproduce the original 12% figure.',
            ethicalScore: 0,
            ethicalImpact: 'Fraudulent',
            framework: 'Deception + Negligence',
            consequence:
              'The new study produces the expected result. Three years later, an investigative journalist obtains the original dataset through a whistleblower. Congressional hearings follow. The resulting settlement costs $1.2B — and five executives face criminal charges.',
          },
          {
            label: 'Share the updated data internally with medical affairs and pause new rural campaign launches while the team evaluates next steps — but do not proactively disclose to the FDA.',
            ethicalScore: 1,
            ethicalImpact: 'Insufficient',
            framework: 'Partial Accountability',
            consequence:
              'The pause limits near-term harm. However, when the FDA later conducts a routine audit, the data gap is discovered. PharmaEdge faces a consent decree requiring supervised label updates and a compliance monitor — a costly but survivable outcome.',
          },
          {
            label: 'Voluntarily submit the updated dependency data to the FDA and initiate a label amendment process, even though this will restrict marketing claims and reduce near-term revenue.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'J&J Benchmark — Proactive Accountability',
            consequence:
              'The FDA commends PharmaEdge\'s transparency. The label amendment is completed in 6 months. While Q3 revenue dips, analysts note that PharmaEdge avoided the existential liability risk that has destroyed other pharma companies. Long-term brand equity strengthens.',
          },
        ],
      },
      {
        id: 'pe-3',
        stepLabel: 'Step 3: The Influencer Physician',
        scenario:
          'Your medical affairs team proposes paying Dr. Ramirez — a prominent rural family physician with a large regional following — $80,000 per year as a "Key Opinion Leader" (KOL). In exchange, she will present at regional CME conferences, give testimonials, and post clinical insights on her professional LinkedIn. The content will be drafted by your medical communications agency. She will not be required to disclose the payment in her posts.',
        dilemma:
          'Do you move forward with the undisclosed KOL arrangement?',
        concept: {
          framework: 'Stealth Marketing',
          text: 'Stealth marketing deliberately hides commercial intent, disarming the audience\'s natural skepticism. When the "audience" is a physician making prescribing decisions that affect vulnerable patients, the ethical stakes are exponentially higher.',
        },
        choices: [
          {
            label: 'Proceed with the arrangement as proposed — the FDA does not explicitly require KOL disclosure in all contexts, and the content is scientifically accurate.',
            ethicalScore: 0,
            ethicalImpact: 'Deceptive',
            framework: 'Stealth Marketing Violation',
            consequence:
              'Dr. Ramirez\'s influence drives a significant prescribing spike. Eighteen months later, ProPublica\'s "Dollars for Docs" database flags the undisclosed payments. Two hospitals bar Dr. Ramirez from their networks. PharmaEdge faces an HHS investigation.',
          },
          {
            label: 'Proceed but require Dr. Ramirez to include a standard disclosure phrase at the end of her posts: "This content was developed in collaboration with PharmaEdge."',
            ethicalScore: 1,
            ethicalImpact: 'Partially Transparent',
            framework: 'Informed Consent — Minimal Compliance',
            consequence:
              'The disclosure is technically present but buried. Attendees at her CME talks are not informed. Regulatory review later finds the disclosure format inadequate under FTC guidance for healthcare influencers. A corrective advertising order is issued.',
          },
          {
            label: 'Require full, prominent financial disclosure in all content and live presentations. Brief Dr. Ramirez on FDA guidance for healthcare KOLs and ensure all content is independently reviewed for balance before publication.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Transparency + Informed Consent',
            consequence:
              'Dr. Ramirez\'s credibility is actually enhanced by the disclosure — audiences respect her transparency. The CME presentations are highly rated. PharmaEdge\'s medical affairs compliance program becomes a model cited in an industry white paper.',
          },
        ],
      },
      {
        id: 'pe-4',
        stepLabel: 'Step 4: The Direct-to-Patient Ad',
        scenario:
          'Your agency proposes a direct-to-patient television campaign targeting daytime programming — channels heavily watched by retired, elderly audiences. The creative concept shows a 70-year-old man returning to gardening and playing with his grandchildren after starting ZenRelief. The voiceover lists side effects at rapid-fire speed. An alternative concept leads with the patient\'s story but gives equivalent time to the dependency risk and the importance of short-term use protocols.',
        dilemma:
          'Which creative direction do you approve?',
        concept: {
          framework: 'Persuasion vs. Manipulation',
          text: 'Emotional appeals using compelling imagery of restored vitality are ethically legitimate only when they do not crowd out material safety information. Burying risk disclosures in rapid fine print undermines informed consent.',
        },
        choices: [
          {
            label: 'Approve the original concept — the rapid side-effect disclosure meets FDA minimum requirements and the gardening imagery will drive maximum emotional resonance and conversion.',
            ethicalScore: 0,
            ethicalImpact: 'Manipulative',
            framework: 'Manipulation + Consumer Vulnerability',
            consequence:
              'The ad tests beautifully in focus groups. Prescription requests from patients surge. However, a consumer advocacy group files an FDA complaint citing the rapid disclosure as intentionally obscuring material risk for an elderly audience with potential auditory processing challenges. An FDA warning letter follows.',
          },
          {
            label: 'Modify the ad to slightly slow the side-effect disclosure and add a line directing patients to "talk to your doctor about whether ZenRelief is right for you."',
            ethicalScore: 1,
            ethicalImpact: 'Minimally Improved',
            framework: 'Partial Informed Consent',
            consequence:
              'The ad complies with technical standards. Consumer sentiment improves marginally. However, the physician consult directive is generic and doesn\'t specifically flag the dependency risk for elderly patients. FDA finds no violation but recommends enhanced labeling protocols.',
          },
          {
            label: 'Adopt the balanced creative concept that gives equal narrative weight to the patient\'s recovery and the dependency risk — including specific guidance that ZenRelief is intended for short-term use with a physician-monitored taper plan.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Informed Consent + Virtue Ethics',
            consequence:
              'The ad receives unexpectedly strong patient trust scores in testing. Physicians report that informed patients have better conversations about appropriate use. Long-term, ZenRelief\'s patient retention — based on appropriate prescribing — outperforms competitors who face recall risk.',
          },
        ],
      },
      {
        id: 'pe-5',
        stepLabel: 'Step 5: The Crisis Point',
        scenario:
          'An investigative news outlet contacts your PR team. They have three former PharmaEdge sales reps willing to go on record alleging that they were trained to downplay the dependency risk with physicians and to specifically target "Medicare patients with no prior opioid history" because "they were most likely to get full courses of ZenRelief." They are running the story in 48 hours regardless of your response.',
        dilemma:
          'How does PharmaEdge respond?',
        concept: {
          framework: 'Accountability and Respondeat Superior',
          text: 'Under respondeat superior, corporations bear ethical and legal responsibility for the conduct of employees acting within the scope of their ordinary duties. A training program that systematically directed unethical targeting behavior cannot be legally or morally disclaimed by executive leadership.',
        },
        choices: [
          {
            label: 'Issue a blanket denial through outside counsel, threatening the outlet with a defamation suit. Internally launch an investigation designed to challenge the reps\' credibility.',
            ethicalScore: 0,
            ethicalImpact: 'Cover-Up',
            framework: 'Accountability Failure',
            consequence:
              'The story runs. The lawsuit threat makes national headlines and is widely condemned as intimidation. Within 30 days, the DOJ opens a False Claims Act investigation. PharmaEdge\'s market cap drops 38%. The CEO eventually resigns.',
          },
          {
            label: 'Issue a statement acknowledging that "some training materials may have been misinterpreted" and announce an internal review — without accepting specific fault or suspending the rural campaign.',
            ethicalScore: 1,
            ethicalImpact: 'Deflection',
            framework: 'Partial Transparency',
            consequence:
              'The hedged response satisfies no one. The story includes the statement alongside the reps\' on-record allegations. Analysts downgrade PharmaEdge stock. A class-action plaintiff\'s firm files within 60 days. The partial admission is later used against you in discovery.',
          },
          {
            label: 'Issue a full public acknowledgment that the training program fell short of PharmaEdge\'s stated ethical standards. Announce an immediate independent audit, suspension of the rural campaign, and creation of a patient harm fund. Cooperate fully with regulators.',
            ethicalScore: 2,
            ethicalImpact: 'Accountable Leadership',
            framework: 'J&J Benchmark — Proactive Accountability',
            consequence:
              'The response is widely cited as a benchmark of corporate crisis ethics. The independent audit identifies specific training failures and results in disciplinary action. PharmaEdge negotiates a consent decree — costly, but the company avoids criminal charges. Five years later, it is profitable and credible.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  //  SCENARIO 2: QuickCash
  // ─────────────────────────────────────────────────────────
  {
    id: 'quickcash',
    title: 'QuickCash',
    subtitle: 'The Predatory Lending App',
    emoji: '💸',
    difficulty: 'Medium',
    difficultyColor: '#f59e0b',
    population: 'Financially distressed young adults',
    context:
      'You are the Chief Marketing Officer of QuickCash, a fintech startup offering short-term personal loans at APRs ranging from 129% to 399%. Your primary customer segment is adults aged 18–34 who have thin or poor credit histories, limited savings, and are living paycheck to paycheck. The company is VC-backed and under intense pressure to hit user acquisition targets before its Series B close. Your AI targeting system can identify users in financial distress in real time — payday proximity, overdraft signals, and credit inquiry spikes.',
    steps: [
      {
        id: 'qc-1',
        stepLabel: 'Step 1: Targeting the Distressed',
        scenario:
          'Your engineering team has built a "Distress Score" model that flags users experiencing acute financial stress — overdrafts in the past 48 hours, multiple credit rejections, or payday proximity. The model has 87% accuracy. Your growth team proposes targeting these high-score users with push notifications offering "Instant Cash — No Credit Check" within minutes of the distress signal firing.',
        dilemma:
          'Do you deploy the Distress Score model for real-time push notification targeting?',
        concept: {
          framework: 'General Vulnerability',
          text: 'General vulnerability occurs when individuals are susceptible to specific harms due to their circumstances — here, acute financial desperation. Targeting someone at the precise moment of their maximum psychological distress is a paradigmatic case of exploiting general vulnerability.',
        },
        choices: [
          {
            label: 'Deploy the model in full — real-time delivery at peak distress signals maximizes conversion and serves users who genuinely need fast cash.',
            ethicalScore: 0,
            ethicalImpact: 'Exploitative',
            framework: 'Manipulation + Vulnerability Exploitation',
            consequence:
              'Conversion rates hit historic highs. Six months later, the CFPB launches a supervisory exam after a state AG complaint describes your push notification strategy as "digital predatory lending." Journalists obtain your internal "Distress Score" documentation through a regulatory filing. The story goes viral.',
          },
          {
            label: 'Use the model to identify and schedule outreach — but with a 24-hour delay from the distress signal and a plainly disclosed APR front and center in the notification.',
            ethicalScore: 1,
            ethicalImpact: 'Reduced Harm',
            framework: 'Partial Informed Consent',
            consequence:
              'The delay reduces peak-distress exploitation and the disclosure improves informed consent. Conversion dips 30%. The CFPB exam finds the practice "improved but still concerning" — you avoid enforcement but are placed on supervisory watch. Consumer advocates publish a mixed review.',
          },
          {
            label: 'Shelve the Distress Score for marketing targeting entirely. Build a product feature instead that allows users to opt into financial wellness alerts and proactively request loan information — keeping them in control of the interaction.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Autonomy + Data Minimization',
            consequence:
              'The opt-in feature generates lower volume but substantially higher user satisfaction scores. QuickCash is cited positively in a CFPB fintech report on emerging responsible lending practices. The opt-in cohort has 40% lower default rates — improving your unit economics.',
          },
        ],
      },
      {
        id: 'qc-2',
        stepLabel: 'Step 2: The APR Disclosure',
        scenario:
          'Your UX team presents two app interface options. Option A buries the APR in a scrollable "Loan Details" section accessed via a small link beneath the "Get Cash Now" button — average user scroll rate to that section: 6%. Option B places the effective APR prominently at the top of the loan confirmation screen in a bold, colored box before the user confirms. Option B test users complete the loan at a 22% lower rate but report significantly higher trust scores.',
        dilemma:
          'Which interface design do you ship?',
        concept: {
          framework: 'Dark Patterns',
          text: 'Dark patterns are user interface designs engineered to suppress information that would affect consumer decision-making. Deliberately architecting low visibility for material rate disclosures is not aggressive UX — it is a form of designed consumer fraud.',
        },
        choices: [
          {
            label: 'Ship Option A — it meets disclosure requirements technically and maximizes conversion. Users can find the APR if motivated to look.',
            ethicalScore: 0,
            ethicalImpact: 'Dark Pattern',
            framework: 'FTC Enforcement Risk + Consumer Deception',
            consequence:
              'An FTC investigation 18 months later finds your interface design constitutes a deceptive practice under Section 5. You are required to redesign the UX and pay $140M in consumer redress. The settlement requires a compliance monitor for 5 years. Your Series C valuation drops sharply.',
          },
          {
            label: 'Add the APR to the confirmation screen but in smaller text below the loan amount, ensuring it is visible without requiring a scroll.',
            ethicalScore: 1,
            ethicalImpact: 'Minimal Compliance',
            framework: 'Technical Disclosure',
            consequence:
              'The FTC\'s examination finds your disclosure technically adequate. Consumer advocates give you a marginal improvement rating. Default rates remain high — suggesting borrowers did not fully internalize the APR. The reputational risk continues.',
          },
          {
            label: 'Ship Option B — the prominent APR disclosure box. Invest in user education content that helps borrowers calculate total repayment before confirming.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Informed Consent + Autonomy',
            consequence:
              'QuickCash\'s Net Promoter Score jumps 18 points over 6 months. Regulators cite your disclosure design as a positive model. Default rates fall as borrowers self-select more appropriately. Your VC investors initially protest the conversion drop, but the lower default rate improves your loan book quality.',
          },
        ],
      },
      {
        id: 'qc-3',
        stepLabel: 'Step 3: The Social Media Campaign',
        scenario:
          'Your growth team proposes an Instagram and TikTok campaign featuring young influencers — all in their late teens and early 20s — showing QuickCash funding spontaneous experiences: concert tickets, weekend trips, new sneakers. The tagline: "Your money, your moment." No mention of APRs, repayment terms, or financial risk. The targeting parameters include users as young as 18.',
        dilemma:
          'Do you greenlight this social media campaign?',
        concept: {
          framework: 'The Dependence Effect + Consumer Vulnerability',
          text: 'Marketing debt products to young adults using aspirational lifestyle imagery manufactures desires (spontaneous spending) that create real financial liability. Young adults with limited financial literacy face compound vulnerability: they lack both financial sophistication and the life experience to contextualize high-cost debt.',
        },
        choices: [
          {
            label: 'Launch as proposed — the targeting is legal, the influencers are adults, and aspirational marketing is standard practice in financial services.',
            ethicalScore: 0,
            ethicalImpact: 'Manipulative',
            framework: 'Dependence Effect + Compound Vulnerability',
            consequence:
              'The campaign generates massive awareness. A significant portion of new borrowers are 18–21 with no prior loan experience. Default rates in this cohort reach 58%. A state AG investigation cites the campaign as evidence of predatory marketing to financially unsophisticated youth. The influencers publicly distanced themselves after the investigation is reported.',
          },
          {
            label: 'Keep the aspirational creative but require each post to include a visible APR disclosure and a "responsible borrowing" link, and restrict targeting to users 21+.',
            ethicalScore: 1,
            ethicalImpact: 'Partially Responsible',
            framework: 'Disclosure + Age Restriction',
            consequence:
              'The revised campaign is technically compliant. The disclosure is present but visually secondary to the lifestyle imagery. Consumer finance advocates give QuickCash a neutral rating — "better, but the fundamental framing glorifies debt for spontaneous consumption among financially vulnerable young adults."',
          },
          {
            label: 'Decline this campaign concept entirely. Redirect the creative budget to a campaign that honestly shows QuickCash helping users bridge income gaps for genuine necessities (medical bills, car repairs) with clear cost disclosures.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Autonomy + Accurate Representation',
            consequence:
              'The new campaign attracts a different user profile — lower volume but with a use case that better fits QuickCash\'s product. Default rates in this cohort are 30% lower. Industry press covers QuickCash as a fintech showing that "responsible lending marketing is a viable strategy," attracting a series of ESG-aligned investor inquiries.',
          },
        ],
      },
      {
        id: 'qc-4',
        stepLabel: 'Step 4: The Collections Protocol',
        scenario:
          'Twenty percent of QuickCash borrowers default within 90 days. Your collections team proposes a multi-channel escalation strategy: daily calls, texts every 6 hours, emails at 6 a.m., and — in a new proposal — automated push notifications during known stress periods (Sunday evenings, payday) labeled "URGENT: Account Action Required" with a countdown timer.',
        dilemma:
          'How do you design your collections communication protocol?',
        concept: {
          framework: 'Dark Patterns + General Vulnerability',
          text: 'Artificial urgency signals (countdown timers, "URGENT" labels) deployed against financially distressed borrowers who already cannot repay are a compound manipulation — exploiting behavioral vulnerability at its lowest point.',
        },
        choices: [
          {
            label: 'Approve the full escalation strategy — borrowers owe the debt and maximum contact pressure optimizes recovery rates.',
            ethicalScore: 0,
            ethicalImpact: 'Harassment',
            framework: 'FDCPA Violation Risk',
            consequence:
              'Recovery rates initially improve. Six months later, you face a class-action lawsuit under the FDCPA (Fair Debt Collection Practices Act) for harassment frequency and the artificial countdown timers. A $95M settlement is reached. Your bank partner suspends the relationship pending a compliance review.',
          },
          {
            label: 'Cap contacts at once per day per channel, remove countdown timers, but retain the Sunday and payday timing as high-response windows.',
            ethicalScore: 1,
            ethicalImpact: 'Partly Improved',
            framework: 'Legal Compliance — Not Ethical Excellence',
            consequence:
              'The protocol is technically within FDCPA limits. However, targeting distressed borrowers at their lowest points (Sunday anxiety, payday desperation) is still ethically questionable. Consumer finance researchers note the timing optimization as a lingering vulnerability exploitation.',
          },
          {
            label: 'Design a borrower-centered collections protocol: a single weekly outreach with clear repayment options, hardship deferral information, and free financial counseling referrals. Remove all countdown timers and stress-period targeting.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Virtue Ethics + Harm Reduction',
            consequence:
              'Recovery rates are lower in the short term, but borrowers who engage with the hardship deferral program repay at 3× the rate of those in standard collections. Net recovery over 24 months is statistically comparable. QuickCash\'s collections protocol is referenced positively in a CFPB fintech guidance document.',
          },
        ],
      },
      {
        id: 'qc-5',
        stepLabel: 'Step 5: The Regulator Arrives',
        scenario:
          'A CFPB examiner arrives for a supervisory review with a specific focus on your targeting methodology and collections practices. Your legal counsel advises that you have two options: full voluntary disclosure of all internal data and decision memos, or providing only what is explicitly requested under the examination scope — a legally defensible but clearly minimalist posture.',
        dilemma:
          'How do you engage with the regulator?',
        concept: {
          framework: 'Respondeat Superior + Accountability',
          text: 'A corporation\'s ethical posture toward regulators signals its genuine commitment to the values it publicly claims. Minimalist regulatory engagement is a form of institutional deception — calibrated to limit accountability rather than pursue it.',
        },
        choices: [
          {
            label: 'Provide only what is explicitly requested and brief your team to answer narrowly. This limits regulatory exposure and preserves negotiating leverage.',
            ethicalScore: 0,
            ethicalImpact: 'Evasive',
            framework: 'Accountability Failure',
            consequence:
              'The examiner finds the minimalist posture suspicious and expands the scope of the review. A subsequent civil investigative demand requests two additional years of internal communications. The narrow disclosure is later characterized in the final report as evidence of a lack of supervisory cooperation — adding a public relations penalty.',
          },
          {
            label: 'Provide everything explicitly requested, plus voluntarily flag two data practices you know are under-disclosed but haven\'t been specifically asked about.',
            ethicalScore: 1,
            ethicalImpact: 'Partially Candid',
            framework: 'Partial Proactive Transparency',
            consequence:
              'The examiner notes your partial candor positively in the supervisory letter. The flagged practices are addressed in a consent arrangement rather than a formal enforcement action. The outcome is favorable relative to the alternative, though consumer advocates note the voluntary disclosure was selective.',
          },
          {
            label: 'Provide full, proactive disclosure — including internal data, targeting model documentation, and all decision memos — and present a concrete remediation plan for every identified risk area.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Proactive Accountability',
            consequence:
              'The CFPB supervisory letter commends QuickCash\'s "exemplary cooperation" and "self-identified remediation proposals." No enforcement action is filed. The remediation plan is embedded in a consent order — but one without civil money penalties. QuickCash is positioned to close its Series B on favorable terms, citing the clean supervisory outcome.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  //  SCENARIO 3: VapeVault
  // ─────────────────────────────────────────────────────────
  {
    id: 'vapevault',
    title: 'VapeVault',
    subtitle: 'The Youth Nicotine Dilemma',
    emoji: '💨',
    difficulty: 'Medium',
    difficultyColor: '#f59e0b',
    population: 'Teenagers and young adults',
    context:
      'You are the Head of Marketing at VapeVault, a direct-to-consumer nicotine vape brand. Your flagship product — CloudX — is a sleek, USB-stick-shaped device that comes in 16 flavors including Mango Ice, Cotton Candy, and Watermelon Burst. You have recently been acquired by a larger tobacco conglomerate, which is under intense regulatory scrutiny. Your predecessor\'s social media strategy — meme pages, young lifestyle influencers, and school-adjacent event sponsorships — generated massive growth but has drawn regulatory action. You must navigate a product relaunch while managing aggressive growth targets from your new parent company.',
    steps: [
      {
        id: 'vv-1',
        stepLabel: 'Step 1: Flavor Portfolio Decision',
        scenario:
          'Internal market research shows that 68% of your current CloudX users first tried the product in a youth-appeal flavor (Cotton Candy, Watermelon Burst, Mango Ice). The same research shows these flavors have 4× the trial rate among first-time users aged 17–22. The FDA is actively moving toward a flavor ban for non-tobacco vaping products. Your parent company wants to maximize flavor portfolio revenue before any regulatory action.',
        dilemma:
          'How do you manage your flavor portfolio strategy?',
        concept: {
          framework: 'Compound Vulnerability + Marketing Vice',
          text: 'Flavors that specifically maximize appeal among teenagers exploit compound vulnerability: consumer vulnerability (lack of cognitive maturity to evaluate long-term addiction risk) combined with general vulnerability (youth brain development makes nicotine particularly addictive at this stage).',
        },
        choices: [
          {
            label: 'Accelerate youth-appeal flavor production and maximize sales velocity before any FDA ban takes effect — competitors will do the same.',
            ethicalScore: 0,
            ethicalImpact: 'Exploitative',
            framework: 'JUUL Precedent — Catastrophic Liability',
            consequence:
              'Sales spike 180% in the 12 months before the FDA ban. When the enforcement action arrives, VapeVault is specifically named in the FDA press release as a "leading driver" of the youth vaping epidemic. The resulting $420M multi-state settlement is closely modeled on the JUUL resolution.',
          },
          {
            label: 'Voluntarily discontinue the three highest youth-appeal flavors (Cotton Candy, Watermelon Burst, Gummy Bear) while retaining fruit flavors that also have substantial adult user bases.',
            ethicalScore: 1,
            ethicalImpact: 'Partially Responsible',
            framework: 'Harm Reduction',
            consequence:
              'The voluntary discontinuation is read positively by regulators and generates favorable press coverage. Consumer advocates note it falls short of eliminating the primary youth gateway products. The FDA\'s enforcement priority list, however, no longer features VapeVault on its first page.',
          },
          {
            label: 'Proactively discontinue all youth-appeal flavors and petition the FDA for a formal adult-verified flavor designation program — positioning VapeVault as a harm reduction tool for existing adult smokers only.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Virtue Ethics + Harm Prevention',
            consequence:
              'The repositioning is challenging initially — net revenue drops 35%. But VapeVault emerges as the only major vape brand not named in the multi-state litigation. Two years later, with the flavor ban in effect for competitors, VapeVault\'s adult-certified product line has a significant compliance advantage and commands premium pricing.',
          },
        ],
      },
      {
        id: 'vv-2',
        stepLabel: 'Step 2: The Influencer Network',
        scenario:
          'Your predecessor left behind a network of 340 lifestyle influencers across TikTok and Instagram. Their follower demographics show that 41% of their combined audience is under 18. Several influencers have disclosed paid partnerships; others have not. Your agency proposes "refreshing" rather than terminating this network — keeping the high-performing influencers active with new CloudX content while adding proper disclosures.',
        dilemma:
          'What do you do with the existing influencer network?',
        concept: {
          framework: 'Stealth Marketing + Consumer Vulnerability',
          text: 'Marketing nicotine products through social media influencers whose primary audience is minors is not a disclosure issue — it is a targeting issue. Even fully disclosed influencer content for addictive vice products targeting underage audiences is an ethical violation.',
        },
        choices: [
          {
            label: 'Retain the full influencer network and add disclosures. The content is legally protected speech and the influencers already have established audiences.',
            ethicalScore: 0,
            ethicalImpact: 'Deceptive',
            framework: 'Stealth Marketing + Minor Targeting',
            consequence:
              'An FTC complaint and a state AG investigation follow. The influencer contracts are obtained through discovery. The combined audience age analysis is published in a congressional hearing. VapeVault is named in a Senate subcommittee report on nicotine marketing to minors.',
          },
          {
            label: 'Retain only influencers whose audience is demonstrably 80%+ adult (verified by third-party analytics), add mandatory disclosure language, and discontinue any school-adjacent content.',
            ethicalScore: 1,
            ethicalImpact: 'Improved',
            framework: 'Partial Audience Protection',
            consequence:
              'The audit reduces the network to 87 influencers. Regulatory scrutiny decreases significantly. Consumer advocates rate the move as a "meaningful step" but note that even the retained influencers reach young adults who may share content with minors on unverified networks.',
          },
          {
            label: 'Terminate the entire influencer network and rebuild from zero with an over-21-verified ambassador program using age-gated platforms only — no TikTok or Instagram.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Harm Prevention + Consumer Vulnerability Protection',
            consequence:
              'The termination costs significant short-term brand awareness. However, VapeVault avoids regulatory action and positions its marketing platform as the industry\'s most compliant. Tobacco harm reduction organizations — influential with adult former smokers — begin to engage with VapeVault\'s adult-directed content positively.',
          },
        ],
      },
      {
        id: 'vv-3',
        stepLabel: 'Step 3: The School Proximity Algorithm',
        scenario:
          'Your retail placement team has been using a geo-targeting algorithm to prioritize CloudX distribution in convenience stores and vape shops within 1,000 feet of high schools and colleges — areas with high foot traffic from young consumers. The algorithm was built under your predecessor and has never been formally reviewed for ethical compliance. Removing these locations would reduce retail footprint by 34%.',
        dilemma:
          'What do you do with the school-proximity distribution algorithm?',
        concept: {
          framework: 'Intentional Targeting of Vulnerable Populations',
          text: 'Deliberately optimizing distribution density near schools is not incidental market coverage — it is engineered proximity targeting of the most vulnerable consumer demographic for an addictive product. Intent embedded in an algorithm is still intent.',
        },
        choices: [
          {
            label: 'Leave the algorithm in place — retail proximity is a standard distribution optimization and the stores are legally operating.',
            ethicalScore: 0,
            ethicalImpact: 'Exploitative',
            framework: 'Intentional Vulnerability Targeting',
            consequence:
              'A public health researcher independently maps VapeVault\'s retail footprint against school locations and publishes the finding. The resulting media coverage is damaging. Multiple state legislatures cite the mapping in passing buffer zone laws specifically targeting VapeVault\'s distribution pattern.',
          },
          {
            label: 'Expand the exclusion zone to 1,500 feet from high schools (but retain college-adjacent locations) and add an audit process to review new store applications.',
            ethicalScore: 1,
            ethicalImpact: 'Partially Improved',
            framework: 'Harm Reduction',
            consequence:
              'The change is logged as a compliance improvement. However, retaining college-adjacent locations — where 18–20 year old students are concentrated — still draws criticism, as many are at the cusp of cognitive maturity for evaluating addiction risk. Advocates call the change "insufficient."',
          },
          {
            label: 'Immediately decommission the school-proximity algorithm and rebuild distribution strategy around adult-destination retail (tobacco shops, adult beverage outlets, over-21 venues) with no proximity-to-school component.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Harm Prevention + Intentional De-targeting',
            consequence:
              'The retail footprint reduction hurts short-term revenue. However, VapeVault\'s new distribution map — focused on adult destinations — becomes evidence of systematic ethical compliance when regulators review the industry. The company is specifically excluded from a multi-state retail enforcement action.',
          },
        ],
      },
      {
        id: 'vv-4',
        stepLabel: 'Step 4: The Health Claim',
        scenario:
          'Your parent company\'s R&D team has produced a white paper suggesting CloudX delivers "up to 70% fewer toxicants than traditional cigarettes." They propose centering the relaunch campaign around this as a harm reduction message: "Make the Switch — Smarter Nicotine." The FDA has not reviewed or approved this claim. Your medical affairs team notes the underlying study design has significant limitations.',
        dilemma:
          'Do you use the "70% fewer toxicants" claim in the relaunch campaign?',
        concept: {
          framework: 'Informed Consent + Modified Risk Tobacco Products (MRTP)',
          text: 'Health claims for tobacco and nicotine products require FDA MRTP authorization. Using unreviewed comparative health claims to market an addictive product exploits consumers\' desire for harm reduction — manufacturing the appearance of medical legitimacy where none has been conferred.',
        },
        choices: [
          {
            label: 'Use the claim prominently in the relaunch — it is based on your own research and represents a competitive differentiator. Many competitors make similar claims.',
            ethicalScore: 0,
            ethicalImpact: 'False Health Claim',
            framework: 'FDA MRTP Violation',
            consequence:
              'The FDA issues a warning letter within 45 days of the campaign launch, citing the unauthorized modified risk claim. The campaign must be pulled immediately. The company is required to run a corrective advertising campaign. The total cost exceeds the revenue the campaign would have generated.',
          },
          {
            label: 'Use softened language — "May deliver fewer toxicants — we\'re investing in the research." — without the specific 70% figure.',
            ethicalScore: 1,
            ethicalImpact: 'Ambiguous',
            framework: 'Technical Avoidance',
            consequence:
              'The hedged language avoids the specific MRTP trigger. However, the implied health superiority claim still generates an FTC inquiry about its substantiation. A 90-day review results in a guidance letter requiring VapeVault to remove the comparative health implication entirely.',
          },
          {
            label: 'Do not use the claim. Instead, invest in a rigorous clinical study and submit the product for FDA MRTP review. Market as "nicotine for adults who already smoke" without comparative health claims pending authorization.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Informed Consent + Regulatory Integrity',
            consequence:
              'The decision to pursue MRTP authorization positions VapeVault as the only major brand investing in FDA-reviewed harm reduction claims. Two years later, a partial MRTP authorization is granted — creating a sustainable, legally defensible competitive advantage no competitor can claim quickly.',
          },
        ],
      },
      {
        id: 'vv-5',
        stepLabel: 'Step 5: The Youth Testimony',
        scenario:
          'A 16-year-old testifies before a state legislative committee that she became addicted to CloudX after receiving a free sample at a music festival VapeVault sponsored while she was 14. Festival age verification had been contracted to a third-party vendor who your team knew had a documented failure rate allowing minors through. You have internal emails suggesting your predecessor\'s team was aware of this failure rate and proceeded anyway.',
        dilemma:
          'VapeVault is now under public and legislative scrutiny. How do you respond?',
        concept: {
          framework: 'Respondeat Superior + Compound Vulnerability',
          text: 'When a corporation profits from a marketing activity conducted by third-party agents whose failures were known and tolerated, respondeat superior-style accountability attaches. The identity of the minor — 14 years old, at peak neurological vulnerability to nicotine addiction — represents the clearest possible case of compound exploitation.',
        },
        choices: [
          {
            label: 'Blame the third-party age verification contractor entirely. Argue VapeVault acted in good faith and the vendor failed its contractual obligations. Let the contractor bear the liability.',
            ethicalScore: 0,
            ethicalImpact: 'Accountability Evasion',
            framework: 'Respondeat Superior Ignored',
            consequence:
              'The internal emails are subpoenaed within 60 days. They show VapeVault knew the verification failure rate. The deflection strategy becomes the story. The state passes the strictest vaping restrictions in the country, specifically citing VapeVault by name. Federal legislation follows.',
          },
          {
            label: 'Issue a statement acknowledging the vendor\'s failure, announce future enhanced age verification standards, and offer to create a $5M youth prevention fund — while disputing the claim that your internal team had advance knowledge.',
            ethicalScore: 1,
            ethicalImpact: 'Partial Accountability',
            framework: 'Incomplete Transparency',
            consequence:
              'The prevention fund generates goodwill. However, the denial of internal knowledge is contradicted when the emails surface in discovery six months later. The partial accountability is seen as calculated — and the subsequent revelation makes the response look dishonest rather than responsible.',
          },
          {
            label: 'Issue a full public apology acknowledging VapeVault\'s own internal knowledge of the age verification failures, the harm caused, and the company\'s moral responsibility. Establish a $25M youth addiction treatment fund. Immediately commit to eliminating all event marketing.',
            ethicalScore: 2,
            ethicalImpact: 'Ethical',
            framework: 'Accountability + Reparative Justice',
            consequence:
              'The response is painful and expensive. The treatment fund is praised by public health advocates. The legislative committee hearing shifts its focus from VapeVault specifically to industry-wide regulation — a broader outcome. VapeVault\'s parent company, seeing the accountability posture, replaces company leadership but redirects the brand toward a genuinely adult-only positioning for the first time.',
          },
        ],
      },
    ],
  },
];
