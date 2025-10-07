import Image from 'next/image';
import Link from 'next/link';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calculator, Landmark, ShieldCheck } from 'lucide-react';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Mortgage Cutter method?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Mortgage Cutter method is a financial strategy that uses a Home Equity Line of Credit (HELOC) to help you pay off your mortgage and other debts faster. It works by using your cash flow to reduce your average daily loan balance, which can lower the amount of interest you pay over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this method the same as making extra payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, it is a different approach. While making extra payments reduces your principal, the Mortgage Cutter method changes the fundamental way your interest is calculated—from a traditional amortization schedule to a daily interest calculation on a line of credit. This can lead to significant savings beyond just extra payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does a HELOC help pay off a mortgage faster?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A HELOC is a revolving line of credit. By depositing your income into the HELOC, you immediately reduce the principal balance that accrues interest. Your expenses are paid from the HELOC, but for the time your money sits in the account, it's actively working to lower your interest costs.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a guaranteed way to save money?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This estimator provides an educational illustration based on the information you provide. Actual savings depend on many factors, including your real income, spending habits, interest rate fluctuations, and the terms offered by a lender. It is not a guarantee of savings or loan approval.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a specific bank to use this strategy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, this strategy is not tied to a specific bank. Many financial institutions offer HELOCs or readvanceable mortgages that can be used for this purpose. We recommend researching lenders to find one that offers favorable terms for your situation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do I need to get started?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To get started, you can use our free mortgage payoff estimator. Simply enter your current mortgage details, income, and expenses to get a personalized blueprint showing how this method could work for you.',
      },
    },
  ],
};

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full flex-1 flex items-center justify-center py-20 md:py-32">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Couple reviewing their plan from a mortgage payoff estimator to achieve financial freedom sooner."
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white drop-shadow-lg">
                The Smarter Mortgage Payoff Estimator
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
                Discover how our HELOC calculator can model a path to pay off your mortgage years sooner. Get a free, personalized estimate in minutes.
              </p>
            </div>
            <HeroForm />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A Simpler Path to Financial Freedom
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12">
              Our estimator shows you how to use a simple home equity strategy to potentially save thousands and cut years off your loan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">1. Enter Your Details</h3>
                <p className="text-muted-foreground">
                  Provide your current mortgage, debts, and cash flow information in our free HELOC calculator.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
                <Landmark className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">2. See the Comparison</h3>
                <p className="text-muted-foreground">
                  Our mortgage payoff estimator compares your current timeline to the Mortgage Cutter method side-by-side.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">3. Unlock Your Plan</h3>
                <p className="text-muted-foreground">
                  Get a personalized blueprint illustrating your potential savings in interest and time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqSchema.mainEntity.map((faq, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-lg text-left">{faq.name}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.acceptedAnswer.text}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore More
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
              Learn more about the concepts behind the Mortgage Cutter method and how it could work for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" size="lg">
                <Link href="/questionnaire">Use the Mortgage Payoff Calculator</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#">Learn About HELOCs vs. Mortgages</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#">Understand Daily Interest</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/#faq">Read Our FAQ</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
