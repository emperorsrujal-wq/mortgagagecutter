import Image from 'next/image';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
      </div>
    </>
  );
}
