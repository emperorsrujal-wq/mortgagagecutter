import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO Snippets | Mortgage Cutter',
  description: 'Quick answers to common questions about HELOCs, mortgage amortization, and debt reduction strategies.',
};

const faqItems = [
  {
    question: 'What is a HELOC payoff estimator?',
    answer: 'A HELOC payoff estimator is a financial calculator that models how a Home Equity Line of Credit (HELOC) can be used to pay off a mortgage and other debts. It contrasts the daily interest calculation of a HELOC with a traditional mortgage\'s amortization schedule to project potential savings.',
    bullets: [
      'Estimates time to become debt-free.',
      'Calculates potential interest savings.',
      'Models the effect of using cash flow to reduce principal.',
    ],
  },
  {
    question: 'How do you pay off a mortgage faster?',
    answer: 'Paying off a mortgage faster involves strategies to reduce the principal balance more quickly than the original schedule. Common methods include making extra payments, switching to bi-weekly payments, or using a financial tool like a HELOC to lower the total interest paid over the life of the loan.',
    bullets: [
      'Increase payment frequency (e.g., bi-weekly).',
      'Add a set amount to each monthly payment.',
      'Use a lump-sum payment from savings or a bonus.',
      'Restructure the loan using a different financial product.',
    ],
  },
  {
    question: 'HELOC vs. mortgage: what\'s the difference?',
    answer: 'A traditional mortgage is an installment loan with a fixed payment schedule used to buy a home. A HELOC is a revolving line of credit secured by home equity. The key difference is that a mortgage balance only goes down, while a HELOC balance can go up and down as you borrow and repay funds.',
    bullets: [
      'Mortgage: Fixed term, predictable payments, amortized interest.',
      'HELOC: Flexible access to funds, variable interest rate, daily interest calculation.',
      'Mortgages are typically used for purchase; HELOCs are used for accessing equity.',
    ],
  },
  {
    question: 'What is a mortgage accelerator?',
    answer: 'A mortgage accelerator is a financial strategy, not a specific product, designed to pay off a mortgage faster. It typically involves using a line of credit (like a HELOC) as the primary account for both income and expenses to reduce the average daily principal balance and minimize interest costs.',
    bullets: [
      'Uses cash flow to lower the interest-bearing balance.',
      'Often involves a Home Equity Line of Credit (HELOC).',
      'The goal is to pay more towards principal without changing your budget.',
    ],
  },
  {
    question: 'How is average daily balance interest calculated?',
    answer: 'Average daily balance interest is calculated by taking the balance of your loan at the end of each day, adding those balances together for the billing period, and dividing by the number of days. This average is then multiplied by the daily interest rate to determine your interest charge.',
    bullets: [
      'Sum the ending balance for each day of the period.',
      'Divide by the number of days to find the average.',
      'Multiply the average balance by the daily interest rate.',
    ],
  },
  {
    question: 'Amortization vs. simple interest: what saves more?',
    answer: 'Simple interest, as used in a HELOC, can save more money because interest is calculated on the exact principal balance daily. Amortized loans have pre-set schedules where payments are mostly interest in the early years, causing the principal to decline very slowly compared to a simple interest loan.',
    bullets: [
      'Simple Interest: Calculated on the current principal; payments have an immediate impact.',
      'Amortized Interest: Pre-calculated schedule; early payments are heavily interest-weighted.',
    ],
  },
  {
    question: 'Why is a 15-year mortgage cheaper than a 30-year?',
    answer: 'A 15-year mortgage is cheaper because you are borrowing money for half the time, resulting in significantly less total interest paid. Lenders also typically offer lower interest rates on 15-year loans as they are considered less risky, further increasing the savings over a 30-year term.',
    bullets: [
      'You pay interest over a much shorter period.',
      'Lenders often offer a lower interest rate.',
      'More of each payment goes toward principal from the start.',
    ],
  },
   {
    question: 'What is a readvanceable mortgage in Canada?',
    answer: 'A readvanceable mortgage in Canada combines a traditional mortgage and a HELOC under one registration. As you pay down the mortgage principal, the credit limit on the HELOC portion automatically increases or "readvances," providing access to your equity without needing to refinance or re-apply for a new loan.',
    bullets: [
      'An integrated mortgage and HELOC product.',
      'HELOC credit limit grows as the mortgage balance shrinks.',
      'Also known as an "all-in-one" mortgage.',
    ],
  },
  {
    question: 'How does the Smith Manoeuvre work?',
    answer: 'The Smith Manoeuvre is a Canadian financial strategy that uses a readvanceable mortgage to convert the interest on a mortgage into tax-deductible investment loan interest. As equity becomes available in the HELOC portion, the funds are borrowed to invest, making the interest on that loan potentially tax-deductible.',
    bullets: [
      'Uses a readvanceable mortgage.',
      'Borrows from the HELOC to invest in income-producing assets.',
      'Aims to make interest payments tax-deductible.',
      'Requires consultation with a financial advisor.',
    ],
  },
  {
    question: 'What is the 65% LTV rule in Canada?',
    answer: 'In Canada, the revolving credit portion of a mortgage (the HELOC) is federally regulated to not exceed 65% of the property\'s value. While the total combined loan (mortgage + HELOC) can go up to 80% LTV, the amount you can access as a revolving line of credit is capped at 65%.',
    bullets: [
      'Applies to the HELOC portion of a readvanceable mortgage.',
      'The revolving credit limit cannot exceed 65% of home value.',
      'The total loan amount can still reach 80% LTV.',
    ],
  },
    {
    question: 'How do you budget with a HELOC?',
    answer: 'To budget with a HELOC, you treat it as your primary chequing account. All income is deposited into it to lower the balance, and all expenses are paid from it. The goal is to maximize the time your money sits in the account, thereby keeping the average daily balance as low as possible.',
    bullets: [
      'Deposit all income directly into the HELOC.',
      'Pay all monthly expenses from the HELOC.',
      'Track your net cash flow (income minus expenses).',
      'Ensure your balance consistently decreases over time.',
    ],
  },
  {
    question: 'What is a mortgage recast?',
    answer: 'A mortgage recast is when a lender re-amortizes your remaining loan balance after you\'ve made a large lump-sum payment. The loan term and interest rate stay the same, but your monthly payments are recalculated and lowered based on the new, smaller balance, which can improve your monthly cash flow.',
    bullets: [
      'Requires a significant lump-sum principal payment.',
      'Lowers your monthly payment amount.',
      'Loan term and interest rate do not change.',
    ],
  },
];


export default function SnippetsPage() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: `<p>${item.answer}</p><ul>${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
            }
        }))
    };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
          Quick Answers
        </h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
          Common questions about mortgage acceleration, HELOCs, and financial strategies.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground space-y-4">
                    <p>{faq.answer}</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {faq.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                    </ul>
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
    </>
  );
}
