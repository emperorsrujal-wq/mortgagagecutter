import Image from 'next/image';
import Link from 'next/link';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Calculator, Landmark, ShieldCheck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a mortgage payoff estimator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A mortgage payoff estimator is a tool that calculates how quickly you can pay off your mortgage based on different scenarios, such as making extra payments or using a different financial strategy.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does this calculator help me pay my mortgage off faster?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our calculator models the Mortgage Cutter method, which uses a Home Equity Line of Credit (HELOC) to reduce the total interest you pay, allowing more of your payment to go towards principal each month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this just making extra payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. While extra payments help, this method is different. It changes how your loan interest is calculated (from monthly amortization to daily interest), which can lead to more significant savings.",
      },
    },
     {
      '@type': 'Question',
      name: 'What is a HELOC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A HELOC (Home Equity Line of Credit) is a type of loan that works like a revolving credit line, similar to a credit card, but is secured by the equity in your home.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a guaranteed way to save money?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This estimator provides an educational illustration based on the numbers you provide. Actual savings depend on your financial discipline, interest rates, and final lender terms. It is not a guarantee of savings.',
      },
    },
     {
      '@type': 'Question',
      name: 'Do I need a specific bank for this?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No, this method is a financial strategy, not a specific product from one bank. Many financial institutions offer HELOCs that can be used for this purpose.",
      },
    },
  ],
};


export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
                <h3 className="text-xl font-semibold mb-2">1. Get Your Free Estimate</h3>
                <p className="text-muted-foreground">
                  Provide your current mortgage, debts, and cash flow information in our free HELOC calculator.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
                <Landmark className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">2. See Your Accelerated Timeline</h3>
                <p className="text-muted-foreground">
                  Our mortgage payoff estimator compares your current timeline to the Mortgage Cutter method side-by-side.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">3. Unlock Your Savings Blueprint</h3>
                <p className="text-muted-foreground">
                  Get a personalized blueprint illustrating your potential savings in interest and time.
                </p>
              </div>
            </div>
             <div className="mt-12">
              <Button asChild size="lg">
                <Link href="/questionnaire">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 bg-secondary">
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
             Ready to learn more? Dive into our resources to understand the powerful strategies behind the Mortgage Cutter method.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" size="lg">
                <Link href="/questionnaire">Use our free mortgage payoff calculator</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/learn">Learn more about the HELOC strategy</Link>
              </Button>
               <Button asChild variant="outline" size="lg">
                <Link href="/learn#faq">Read our FAQ for more details</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/learn">Compare a HELOC vs. a traditional mortgage</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
