export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  cluster: string;
  targetKeyword: string;
  intent: 'Informational' | 'Transactional' | 'Commercial';
  brief: string;
  h2Outline: string[];
  faqs: { question: string; answer: string }[];
  internalLinks: { anchor: string; url: string }[];
};

export const blogPosts: BlogPost[] = [
    {
        slug: 'what-is-a-heloc',
        title: 'What Is a HELOC and How Can It Help You Pay Your Mortgage Faster?',
        date: '2024-10-26',
        cluster: 'HELOC Fundamentals',
        targetKeyword: 'what is a heloc',
        intent: 'Informational',
        brief: 'A foundational guide for homeowners who have heard of HELOCs but don\'t understand them. This post explains a Home Equity Line of Credit in simple terms, differentiating it from a traditional mortgage and setting the stage for the Mortgage Cutter method.',
        h2Outline: [
            'What is a Home Equity Line of Credit (HELOC)?',
            'How a HELOC Differs From a Traditional Mortgage',
            'The Two Phases of a HELOC: Draw and Repayment',
            'Why a HELOC Can Be a Powerful Financial Tool',
            'Using a HELOC to Consolidate Debt',
        ],
        faqs: [
            {
                question: 'Is a HELOC a second mortgage?',
                answer: 'Not always. While many HELOCs are "second mortgages" that sit behind your primary loan, a "first-lien" HELOC can replace your mortgage entirely. This is the structure used in the Mortgage Cutter method.'
            },
            {
                question: 'What are the general requirements for a HELOC?',
                answer: 'Lenders typically look for sufficient home equity (usually up to 80-85% loan-to-value), a good credit score (often 680+), and a verifiable source of income to ensure you can make payments.'
            },
            {
                question: 'Can I use a HELOC for anything?',
                answer: 'Yes, once the line of credit is open, you can typically use the funds for any purpose, from home renovations to debt consolidation. However, the most effective strategies use it in a disciplined way to reduce high-interest debt.'
            }
        ],
        internalLinks: [
            { anchor: 'See how it works with our free estimator', url: '/questionnaire' },
            { anchor: 'Learn more about the payoff strategy', url: '/learn' },
        ]
    },
    // The other 19 blog post objects would be added here over time.
];
