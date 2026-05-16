
export type CourseModule = {
  id: string;
  number: number;
  title: string;
  description: string;
  isPaid: boolean;
  lessons: CourseLesson[];
};

export type CourseLesson = {
  id: string;
  number: number;
  title: string;
  slug: string;
  moduleId: string;
  moduleNumber: number;
  duration: number; // minutes
  type: 'video' | 'reading' | 'quiz' | 'tool' | 'action';
  description: string;
  isPaid: boolean;
  hasQuiz: boolean;
  hasToolCallout: boolean;
  toolName?: string;
  toolLink?: string;
};

export const courseModules: CourseModule[] = [
  {
    id: 'mod_1',
    number: 1,
    title: 'The Foundation',
    description: 'Understanding the truth about mortgages and banking.',
    isPaid: false,
    lessons: [
      { id: 'l_1_1', number: 1, title: 'The 2x Cost Trap', slug: 'the-2x-cost-trap', moduleId: 'mod_1', moduleNumber: 1, duration: 12, type: 'video', description: 'Why your mortgage actually costs 2x what you think.', isPaid: false, hasQuiz: true, hasToolCallout: true, toolName: 'Mortgage Cost Calculator', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_1_2', number: 2, title: 'Dirty History of Banking', slug: 'dirty-history-of-banking', moduleId: 'mod_1', moduleNumber: 1, duration: 15, type: 'reading', description: 'The hidden history of how banks rigged the system.', isPaid: false, hasQuiz: true, hasToolCallout: false },
      { id: 'l_1_3', number: 3, title: 'The Mathematical Proof', slug: 'the-mathematical-proof', moduleId: 'mod_1', moduleNumber: 1, duration: 18, type: 'video', description: 'The math that proves you can pay off your home in 5-7 years.', isPaid: false, hasQuiz: true, hasToolCallout: true, toolName: 'Amortization Analyzer', toolLink: 'https://mortgagecutter.com' },
    ],
  },
  {
    id: 'mod_2',
    number: 2,
    title: 'The Awakening',
    description: 'Discover the secret that changes everything.',
    isPaid: false,
    lessons: [
      { id: 'l_2_1', number: 4, title: 'The Secret Banks Have Kept For 90 Years', slug: 'the-secret-banks-kept', moduleId: 'mod_2', moduleNumber: 2, duration: 20, type: 'video', description: "There's a reason the wealthiest homeowners pay off their homes in 5-7 years while everyone else takes 30. Your banker knows it. They just hope you never ask.", isPaid: false, hasQuiz: true, hasToolCallout: false },
      { id: 'l_2_2', number: 5, title: 'How Your Neighbor Paid Off Their Home 15 Years Sooner (Without Making More Money)', slug: 'neighbor-paid-off-faster', moduleId: 'mod_2', moduleNumber: 2, duration: 14, type: 'reading', description: "Same income. Same house price. Same interest rate. But one family is mortgage-free in 6 years while the other is trapped for 30. What's the difference?", isPaid: false, hasQuiz: true, hasToolCallout: false },
      { id: 'l_2_3', number: 6, title: 'The Mathematical Impossibility That Makes It Possible', slug: 'mathematical-impossibility', moduleId: 'mod_2', moduleNumber: 2, duration: 16, type: 'video', description: "By every conventional calculation, paying off a $300K home in 6 years shouldn't be possible on an average income. Yet thousands of families are doing it. The math tells a different story.", isPaid: false, hasQuiz: true, hasToolCallout: true, toolName: 'Credit Score Simulator', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_2_4', number: 7, title: 'Why Interest Rates Matter Way Less Than You Think', slug: 'interest-rates-matter-less', moduleId: 'mod_2', moduleNumber: 2, duration: 18, type: 'reading', description: "You've been conditioned to obsess over rate shopping. What if I told you the rate is a distraction from the real factor that determines how fast you become mortgage-free?", isPaid: false, hasQuiz: true, hasToolCallout: false },
    ],
  },
  {
    id: 'mod_3',
    number: 3,
    title: 'The Method Preview',
    description: 'How the Mortgage Cutter Method works without revealing the mechanism.',
    isPaid: false,
    lessons: [
      { id: 'l_3_1', number: 8, title: 'How Banks Lend to Each Other (And Why You Can\'t Do The Same)', slug: 'banks-lend-to-each-other', moduleId: 'mod_3', moduleNumber: 3, duration: 22, type: 'video', description: "There's a banking system that lets financial institutions move money in ways that regular homeowners are never told about. Until now.", isPaid: false, hasQuiz: true, hasToolCallout: false },
      { id: 'l_3_2', number: 9, title: 'The $5 Trillion Secret Hidden in Plain Sight', slug: '5-trillion-secret', moduleId: 'mod_3', moduleNumber: 3, duration: 15, type: 'reading', description: "Over $5 trillion moves through a system that most homeowners have never heard of. It's perfectly legal. It's available to you. But somehow, nobody talks about it.", isPaid: false, hasQuiz: true, hasToolCallout: false },
      { id: 'l_3_3', number: 10, title: 'Why This Was Only For the Wealthy (Until Now)', slug: 'only-for-wealthy', moduleId: 'mod_3', moduleNumber: 3, duration: 17, type: 'video', description: "For decades, the ultra-rich used a specific strategy to eliminate mortgage debt at record speed. Today, any homeowner can use it. But banks aren't exactly advertising it.", isPaid: false, hasQuiz: false, hasToolCallout: true, toolName: 'Auto-Payoff Planner', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_3_4', number: 11, title: 'The Preview: 7 Steps to Mortgage Freedom', slug: 'seven-steps-preview', moduleId: 'mod_3', moduleNumber: 3, duration: 19, type: 'reading', description: "Here's a preview of the 7-step system that transforms 30-year prisoners into mortgage-free homeowners in 5-7 years. This is what the full blueprint looks like.", isPaid: false, hasQuiz: true, hasToolCallout: false },
    ],
  },
  {
    id: 'mod_4',
    number: 4,
    title: 'The Peak Preview',
    description: 'The final free lessons before the blueprint is revealed.',
    isPaid: false,
    lessons: [
      { id: 'l_4_1', number: 12, title: 'The Credit Key That Unlocks Everything', slug: 'credit-key-unlocks', moduleId: 'mod_4', moduleNumber: 4, duration: 25, type: 'reading', description: "There's a specific credit score range that opens doors most homeowners don't even know exist. Hit this number, and everything changes.", isPaid: false, hasQuiz: true, hasToolCallout: true, toolName: 'Income Optimizer', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_4_2', number: 13, title: 'How Some Families Pay Off 43% Faster Than Others', slug: '43-percent-faster', moduleId: 'mod_4', moduleNumber: 4, duration: 20, type: 'video', description: "Same Mortgage Cutter Method. Same banking system. But some families are cutting their payoff time by nearly half. What's their secret?", isPaid: false, hasQuiz: true, hasToolCallout: true, toolName: 'HELOC Strategy Calculator', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_4_3', number: 14, title: 'What Happens After Your Mortgage Is Gone', slug: 'after-mortgage-gone', moduleId: 'mod_4', moduleNumber: 4, duration: 14, type: 'reading', description: "Picture this: Your last mortgage payment. Ever. What does life look like the day after? The month after? The year after? Let me show you.", isPaid: false, hasQuiz: false, hasToolCallout: false },
      { id: 'l_4_4', number: 15, title: 'Your Moment of Truth: The Full Blueprint Awaits', slug: 'moment-of-truth', moduleId: 'mod_4', moduleNumber: 4, duration: 16, type: 'video', description: "You've seen what the Mortgage Cutter Method can do. You've seen the proof. Now it's time to decide. Will you take the next step — or go back to 30 years of payments?", isPaid: false, hasQuiz: true, hasToolCallout: true, toolName: 'Extra Payment Calculator', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_4_5', number: 16, title: 'The Physics of Freedom', slug: 'physics-of-freedom', moduleId: 'mod_4', moduleNumber: 4, duration: 12, type: 'reading', description: 'The final framework that ties everything together.', isPaid: false, hasQuiz: false, hasToolCallout: false },
    ],
  },
  {
    id: 'mod_5',
    number: 5,
    title: 'Credit Mastery',
    description: 'Boost your credit score and unlock better rates.',
    isPaid: true,
    lessons: [
      { id: 'l_5_1', number: 17, title: 'Credit Score Anatomy', slug: 'credit-score-anatomy', moduleId: 'mod_5', moduleNumber: 5, duration: 18, type: 'video', description: 'The 5 factors that control your score and how to manipulate each one.', isPaid: true, hasQuiz: true, hasToolCallout: true, toolName: 'Credit Score Simulator', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_5_2', number: 18, title: 'The 90-Day Credit Boost', slug: '90-day-credit-boost', moduleId: 'mod_5', moduleNumber: 5, duration: 15, type: 'reading', description: 'A step-by-step plan to add 50+ points to your credit score in 90 days.', isPaid: true, hasQuiz: true, hasToolCallout: false },
      { id: 'l_5_3', number: 19, title: 'Debt-to-Income Hacking', slug: 'dti-hacking', moduleId: 'mod_5', moduleNumber: 5, duration: 12, type: 'video', description: 'How to legally improve your DTI ratio for better loan terms.', isPaid: true, hasQuiz: false, hasToolCallout: true, toolName: 'DTI Calculator', toolLink: 'https://mortgagecutter.com' },
    ],
  },
  {
    id: 'mod_6',
    number: 6,
    title: 'The Numbers Game',
    description: 'Calculate your exact qualification numbers.',
    isPaid: true,
    lessons: [
      { id: 'l_6_1', number: 20, title: 'How Much House Can You Really Afford', slug: 'affordability-math', moduleId: 'mod_6', moduleNumber: 6, duration: 20, type: 'video', description: 'The real math banks use — and how to game it in your favor.', isPaid: true, hasQuiz: true, hasToolCallout: true, toolName: 'Affordability Calculator', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_6_2', number: 21, title: 'Stress Test Survival', slug: 'stress-test-survival', moduleId: 'mod_6', moduleNumber: 6, duration: 14, type: 'reading', description: 'How to pass any bank stress test with flying colors.', isPaid: true, hasQuiz: true, hasToolCallout: false },
      { id: 'l_6_3', number: 22, title: 'The Pre-Approval Playbook', slug: 'pre-approval-playbook', moduleId: 'mod_6', moduleNumber: 6, duration: 16, type: 'video', description: 'Get pre-approved for the maximum amount without hurting your credit.', isPaid: true, hasQuiz: false, hasToolCallout: true, toolName: 'Pre-Approval Estimator', toolLink: 'https://mortgagecutter.com' },
    ],
  },
  {
    id: 'mod_7',
    number: 7,
    title: 'Bank Selection',
    description: 'Find and negotiate with the best banks.',
    isPaid: true,
    lessons: [
      { id: 'l_7_1', number: 23, title: 'Bank Comparison Matrix', slug: 'bank-comparison-matrix', moduleId: 'mod_7', moduleNumber: 7, duration: 18, type: 'reading', description: 'The exact spreadsheet to compare every bank in your country.', isPaid: true, hasQuiz: true, hasToolCallout: true, toolName: 'Bank Comparison Tool', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_7_2', number: 24, title: 'Negotiation Scripts That Work', slug: 'negotiation-scripts', moduleId: 'mod_7', moduleNumber: 7, duration: 22, type: 'video', description: 'Word-for-word scripts to negotiate lower rates and better terms.', isPaid: true, hasQuiz: true, hasToolCallout: false },
      { id: 'l_7_3', number: 25, title: 'Credit Unions vs. Big Banks', slug: 'credit-unions-vs-banks', moduleId: 'mod_7', moduleNumber: 7, duration: 12, type: 'reading', description: 'Why credit unions often beat the big banks by 0.5% or more.', isPaid: true, hasQuiz: false, hasToolCallout: false },
      { id: 'l_7_4', number: 26, title: 'The Hidden Fee Audit', slug: 'hidden-fee-audit', moduleId: 'mod_7', moduleNumber: 7, duration: 15, type: 'video', description: 'How to find and eliminate every junk fee in your loan.', isPaid: true, hasQuiz: true, hasToolCallout: true, toolName: 'Fee Audit Calculator', toolLink: 'https://mortgagecutter.com' },
    ],
  },
  {
    id: 'mod_8',
    number: 8,
    title: 'Application & Closing',
    description: 'Navigate every step of the mortgage process.',
    isPaid: true,
    lessons: [
      { id: 'l_8_1', number: 27, title: 'Document Checklist Mastery', slug: 'document-checklist', moduleId: 'mod_8', moduleNumber: 8, duration: 10, type: 'reading', description: 'Every document you need and exactly how to prepare it.', isPaid: true, hasQuiz: false, hasToolCallout: true, toolName: 'Document Checklist', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_8_2', number: 28, title: 'The Application Walkthrough', slug: 'application-walkthrough', moduleId: 'mod_8', moduleNumber: 8, duration: 25, type: 'video', description: 'Screen-by-screen guide to completing any mortgage application.', isPaid: true, hasQuiz: true, hasToolCallout: false },
      { id: 'l_8_3', number: 29, title: 'Closing Day Protection', slug: 'closing-day-protection', moduleId: 'mod_8', moduleNumber: 8, duration: 18, type: 'video', description: 'How to avoid last-minute surprises and junk fees at closing.', isPaid: true, hasQuiz: true, hasToolCallout: true, toolName: 'Closing Cost Estimator', toolLink: 'https://mortgagecutter.com' },
    ],
  },
  {
    id: 'mod_9',
    number: 9,
    title: 'Advanced Acceleration',
    description: 'Pay off your mortgage 43% faster with advanced techniques.',
    isPaid: true,
    lessons: [
      { id: 'l_9_1', number: 30, title: 'The Velocity Banking Method', slug: 'velocity-banking', moduleId: 'mod_9', moduleNumber: 9, duration: 28, type: 'video', description: 'Advanced HELOC strategies for maximum acceleration.', isPaid: true, hasQuiz: true, hasToolCallout: true, toolName: 'Velocity Calculator', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_9_2', number: 31, title: 'Income Stacking', slug: 'income-stacking', moduleId: 'mod_9', moduleNumber: 9, duration: 16, type: 'reading', description: 'How to layer multiple income streams to crush your mortgage.', isPaid: true, hasQuiz: false, hasToolCallout: false },
      { id: 'l_9_3', number: 32, title: 'The Lump Sum Leverage', slug: 'lump-sum-leverage', moduleId: 'mod_9', moduleNumber: 9, duration: 14, type: 'video', description: 'Using bonuses, tax refunds, and windfalls for maximum impact.', isPaid: true, hasQuiz: true, hasToolCallout: true, toolName: 'Lump Sum Impact Calculator', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_9_4', number: 33, title: 'Recasting vs. Refinancing', slug: 'recast-vs-refinance', moduleId: 'mod_9', moduleNumber: 9, duration: 20, type: 'reading', description: 'The $10,000+ decision most homeowners get wrong.', isPaid: true, hasQuiz: true, hasToolCallout: true, toolName: 'Recast vs Refi Calculator', toolLink: 'https://mortgagecutter.com' },
    ],
  },
  {
    id: 'mod_10',
    number: 10,
    title: 'Your Action Plan',
    description: 'Your personalized 90-day roadmap to mortgage freedom.',
    isPaid: true,
    lessons: [
      { id: 'l_10_1', number: 34, title: 'The 90-Day Roadmap', slug: '90-day-roadmap', moduleId: 'mod_10', moduleNumber: 10, duration: 22, type: 'video', description: 'Week-by-week plan to implement everything you have learned.', isPaid: true, hasQuiz: false, hasToolCallout: true, toolName: '90-Day Action Planner', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_10_2', number: 35, title: 'Monthly Check-In System', slug: 'monthly-checkin-system', moduleId: 'mod_10', moduleNumber: 10, duration: 12, type: 'reading', description: 'The simple monthly review that keeps you on track.', isPaid: true, hasQuiz: false, hasToolCallout: true, toolName: 'Progress Tracker', toolLink: 'https://mortgagecutter.com' },
      { id: 'l_10_3', number: 36, title: 'Building Your Support Team', slug: 'support-team', moduleId: 'mod_10', moduleNumber: 10, duration: 15, type: 'video', description: 'Accountability systems and communities for long-term success.', isPaid: true, hasQuiz: false, hasToolCallout: false },
      { id: 'l_10_4', number: 37, title: 'Graduation & Beyond', slug: 'graduation', moduleId: 'mod_10', moduleNumber: 10, duration: 10, type: 'reading', description: 'What to do after you are mortgage-free — building generational wealth.', isPaid: true, hasQuiz: false, hasToolCallout: true, toolName: 'Wealth Builder', toolLink: 'https://mortgagecutter.com' },
    ],
  },
];

export const allCourseLessons: CourseLesson[] = courseModules.flatMap(m => m.lessons);

export function getModuleByLessonSlug(slug: string): CourseModule | undefined {
  return courseModules.find(m => m.lessons.some(l => l.slug === slug));
}

export function getLessonBySlug(slug: string): CourseLesson | undefined {
  return allCourseLessons.find(l => l.slug === slug);
}

export function getAdjacentLessons(slug: string) {
  const idx = allCourseLessons.findIndex(l => l.slug === slug);
  return {
    prev: idx > 0 ? allCourseLessons[idx - 1] : null,
    next: idx < allCourseLessons.length - 1 ? allCourseLessons[idx + 1] : null,
    currentIndex: idx,
    total: allCourseLessons.length,
  };
}

export function getCourseProgressPercentage(completedIds: string[]): number {
  return Math.round((completedIds.length / allCourseLessons.length) * 100);
}

export function getModuleProgress(module: CourseModule, completedIds: string[]): number {
  const completed = module.lessons.filter(l => completedIds.includes(l.id)).length;
  return Math.round((completed / module.lessons.length) * 100);
}

export const FREE_MODULE_COUNT = 4;
export const PAID_MODULE_START = 5;
