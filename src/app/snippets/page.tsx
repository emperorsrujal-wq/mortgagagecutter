
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
  }
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
