import Image from 'next/image';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Users, BarChart, Rocket } from 'lucide-react';

const features = [
  {
    icon: Rocket,
    title: 'Pay Off Your Mortgage Faster',
    description: 'Our proven method helps you shave years off your loan term, freeing you from debt sooner than you thought possible.',
  },
  {
    icon: BarChart,
    title: 'Save Thousands in Interest',
    description: 'Keep more of your hard-earned money. The average Mortgage Cutter user saves over $75,000 in interest payments.',
  },
  {
    icon: CheckCircle,
    title: 'Simple & Secure Process',
    description: 'No complex financial jargon. Just a straightforward, step-by-step plan you can implement with confidence.',
  },
];

const testimonials = [
    {
        id: 'testimonial-1',
        name: 'Sarah L.',
        location: 'Austin, TX',
        quote: '“I was skeptical at first, but this method is incredible. We’re on track to pay off our house 11 years early. It’s life-changing!”'
    },
    {
        id: 'testimonial-2',
        name: 'Mike & Jenna R.',
        location: 'Chicago, IL',
        quote: '“The savings are real. We cut our projected interest payments by nearly half. I wish we had found this sooner!”'
    },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  const testimonialImage = PlaceHolderImages.find(p => p.id === 'testimonial-person');


  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center py-20 md:py-32">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
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
              Pay Off Your Mortgage 10+ Years Sooner
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
              Discover the simple, proven method to save thousands and achieve financial freedom. Get your free, personalized savings estimate in minutes.
            </p>
          </div>
          <HeroForm />
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">The Fastest Path to a Debt-Free Home</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop overpaying your bank. Start building your wealth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 bg-card rounded-lg border">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Join Thousands of Happy Homeowners</h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                      Don't just take our word for it. See what our members are saying.
                  </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-card p-8 rounded-lg shadow-md flex flex-col">
                        <p className="text-muted-foreground italic flex-grow">
                            {testimonial.quote}
                        </p>
                        <div className="flex items-center mt-6">
                            {testimonialImage && (
                                <Image
                                    src={testimonialImage.imageUrl}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full mr-4"
                                    data-ai-hint={testimonialImage.imageHint}
                                />
                            )}
                            <div>
                                <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
              </div>
          </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to See Your Savings?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            It takes less than 60 seconds to get a personalized report and see how much you can save.
          </p>
          <Button asChild size="lg" className="mt-8 transform hover:scale-105 transition-transform duration-200">
            <Link href="/questionnaire">Calculate My Savings Now!</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
