
export type AcademyUnit = {
  number: number;
  title: string;
  description: string;
  lessons: AcademyLessonMeta[];
};

export type AcademyLessonMeta = {
  id: string;
  number: number;
  title: string;
  slug: string;
  category: string;
  wordCount: number;
  readingTime: number;
};

export const academyUnits: AcademyUnit[] = [
  {
    number: 1,
    title: "How Banks Really Work",
    description: "Decoding the fractional reserve system and how banks profit from your deposits.",
    lessons: [
      { id: "al_1", number: 1, title: "How Banks Really Work", slug: "how-banks-work", category: "Banking", wordCount: 2800, readingTime: 15 },
      { id: "al_2", number: 2, title: "How Banks Make Money Off You", slug: "bank-profit-mechanics", category: "Banking", wordCount: 2850, readingTime: 15 },
      { id: "al_3", number: 3, title: "Your Savings Account is Making You Poorer", slug: "savings-trap", category: "Banking", wordCount: 2700, readingTime: 14 },
      { id: "al_4", number: 4, title: "What Happens When Banks Fail", slug: "bank-failures", category: "Banking", wordCount: 2900, readingTime: 16 },
      { id: "al_5", number: 5, title: "Credit Scores: The Secret Report Card", slug: "credit-score-secrets", category: "Banking", wordCount: 2800, readingTime: 15 },
    ]
  },
  {
    number: 2,
    title: "How Insurance Really Works",
    description: "The math behind risk and why most people buy the wrong products.",
    lessons: [
      { id: "al_6", number: 6, title: "What is Insurance, Really?", slug: "insurance-fundamentals", category: "Insurance", wordCount: 2600, readingTime: 13 },
      { id: "al_7", number: 7, title: "How Insurance Companies Make Billions", slug: "insurance-profit-models", category: "Insurance", wordCount: 2750, readingTime: 14 },
      { id: "al_8", number: 8, title: "Life Insurance: The Biggest Misunderstood Product", slug: "life-insurance-truth", category: "Insurance", wordCount: 3100, readingTime: 17 },
      { id: "al_9", number: 9, title: "The Fine Print They Never Explain", slug: "insurance-fine-print", category: "Insurance", wordCount: 2800, readingTime: 15 },
      { id: "al_10", number: 10, title: "What Insurance You Actually Need?", slug: "essential-insurance", category: "Insurance", wordCount: 2950, readingTime: 16 },
    ]
  },
  {
    number: 3,
    title: "How the Economy Really Works",
    description: "Understanding inflation, central banks, and the invisible forces moving your money.",
    lessons: [
      { id: "al_11", number: 11, title: "What is 'The Economy' and Who Controls It?", slug: "economy-basics", category: "Economics", wordCount: 2800, readingTime: 15 },
      { id: "al_12", number: 12, title: "How Central Banks Control Your Mortgage", slug: "central-banks-mortgages", category: "Economics", wordCount: 3000, readingTime: 16 },
      { id: "al_13", number: 13, title: "What is Inflation and Why Money is Shrinking?", slug: "inflation-explained", category: "Economics", wordCount: 2700, readingTime: 14 },
      { id: "al_14", number: 14, title: "Recession vs. Depression", slug: "recessions", category: "Economics", wordCount: 2650, readingTime: 13 },
      { id: "al_15", number: 15, title: "Supply and Demand Rules Everything", slug: "supply-demand", category: "Economics", wordCount: 2550, readingTime: 12 },
    ]
  },
  {
    number: 4,
    title: "What Government Does With Your Money",
    description: "Taxes, national debt, and the programs designed to help (or hinder) you.",
    lessons: [
      { id: "al_16", number: 16, title: "What is a Government Budget?", slug: "govt-budgets", category: "Government", wordCount: 2700, readingTime: 14 },
      { id: "al_17", number: 17, title: "Where Do Your Tax Dollars Actually Go?", slug: "tax-allocation", category: "Government", wordCount: 2800, readingTime: 15 },
      { id: "al_18", number: 18, title: "How Income Tax Works", slug: "income-tax-mechanics", category: "Government", wordCount: 3200, readingTime: 18 },
      { id: "al_19", number: 19, title: "The National Debt", slug: "national-debt", category: "Government", wordCount: 2900, readingTime: 16 },
      { id: "al_20", number: 20, title: "Government Programs That Give You Free Money", slug: "govt-benefits", category: "Government", wordCount: 3000, readingTime: 16 },
    ]
  },
  {
    number: 5,
    title: "Debt, Credit & The Traps",
    description: "Breaking the cycle of high-interest consumer debt.",
    lessons: [
      { id: "al_21", number: 21, title: "How Credit Card Companies Make Money Off You", slug: "credit-card-traps", category: "Debt", wordCount: 2850, readingTime: 15 },
      { id: "al_22", number: 22, title: "The Minimum Payment Trap", slug: "minimum-payment-trap", category: "Debt", wordCount: 2600, readingTime: 13 },
      { id: "al_23", number: 23, title: "Good Debt vs. Bad Debt", slug: "good-vs-bad-debt", category: "Debt", wordCount: 2750, readingTime: 14 },
      { id: "al_24", number: 24, title: "How Compound Interest Works Against You", slug: "compound-debt", category: "Debt", wordCount: 3100, readingTime: 17 },
    ]
  },
  {
    number: 6,
    title: "Investing: The Secret Rich Know",
    description: "Moving from saving to building real wealth.",
    lessons: [
      { id: "al_25", number: 25, title: "Why Stock Market Isn't Gambling", slug: "investing-basics", category: "Investing", wordCount: 2900, readingTime: 16 },
      { id: "al_26", number: 26, title: "Mutual Funds and How Banks Destroy Returns", slug: "mutual-fund-traps", category: "Investing", wordCount: 3000, readingTime: 16 },
      { id: "al_27", number: 27, title: "The Retirement Account Strategy", slug: "retirement-accounts", category: "Investing", wordCount: 3200, readingTime: 18 },
      { id: "al_28", number: 28, title: "The Index Fund Secret", slug: "index-fund-strategy", category: "Investing", wordCount: 2800, readingTime: 15 },
    ]
  },
  {
    number: 7,
    title: "Money Lessons for Kids",
    description: "Financial literacy foundations for the next generation.",
    lessons: [
      { id: "al_29", number: 29, title: "What is Money and Where Does it Come From?", slug: "what-is-money", category: "Family", wordCount: 2500, readingTime: 12 },
      { id: "al_30", number: 30, title: "Spend, Save, Give", slug: "spend-save-give", category: "Family", wordCount: 2400, readingTime: 11 },
      { id: "al_31", number: 31, title: "Why a Dollar Today is Worth More", slug: "time-value-kids", category: "Family", wordCount: 2600, readingTime: 13 },
      { id: "al_32", number: 32, title: "How Advertising Tricks You Into Spending", slug: "advertising-traps", category: "Family", wordCount: 2700, readingTime: 14 },
      { id: "al_33", number: 33, title: "Your First Job and Your First Paycheck", slug: "first-paycheck", category: "Family", wordCount: 2800, readingTime: 15 },
    ]
  },
  {
    number: 8,
    title: "The Mortgage Truth",
    description: "The high-stakes math of home ownership.",
    lessons: [
      { id: "al_34", number: 34, title: "Renting vs. Buying", slug: "rent-vs-buy", category: "Mortgage", wordCount: 3000, readingTime: 16 },
      { id: "al_35", number: 35, title: "How 0.5% Rate Difference Costs You $40K", slug: "rate-impact", category: "Mortgage", wordCount: 2900, readingTime: 16 },
      { id: "al_36", number: 36, title: "The Amortization Illusion", slug: "amortization-truth", category: "Mortgage", wordCount: 3200, readingTime: 18 },
    ]
  }
];
