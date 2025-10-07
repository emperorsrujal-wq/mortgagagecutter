import Image from 'next/image';
import Link from 'next/link';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Calculator, Landmark, ShieldCheck } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <>
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
             <div className="mt-12">
              <Button asChild size="lg">
                <Link href="/questionnaire">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
