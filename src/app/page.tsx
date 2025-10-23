
import Image from 'next/image';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, CheckCircle, TrendingUp, Target, Award, ShieldCheck, Landmark, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  const founderImage = PlaceHolderImages.find((p) => p.id === 'testimonial-person');

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Scarcity Bar */}
        <div className="bg-yellow-400 text-black text-center py-2 text-sm font-semibold z-20">
          Only 25 free plans left this week. Secure yours now!
        </div>
          
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/80" />

          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center gap-8">
            <div className="max-w-4xl text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
                How Smart Homeowners Pay Off Their Mortgage Years Faster
                <span className="block text-yellow-300 mt-2">—Without Earning More or Changing Banks</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                Discover exactly how much you could save—see your custom plan in under 60 seconds.
              </p>
            </div>

            <div className="w-full max-w-md">
                <HeroForm />
                 <p className="text-center text-xs text-gray-300 mt-2">(no credit card needed, no obligation)</p>
                <div className="text-center text-gray-300 text-sm mt-4">
                    <p className="font-semibold">Trusted by over 2,000 families | As featured in: Forbes, Globe and Mail</p>
                </div>
            </div>

          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-background py-16">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl font-bold mb-8 text-center">Most homeowners overpay $44,000+ in interest—don’t let your bank win.</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-card p-6 rounded-lg shadow-md text-center">
                        <div className="flex justify-center mb-2">
                           {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                        </div>
                        <p className="italic">"I saved $32,800! This was the simplest financial decision we've ever made."</p>
                        <p className="font-semibold mt-2">- Sarah K.</p>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md text-center">
                        <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                        </div>
                        <p className="italic">"Paid off our mortgage 8 years sooner. I can't recommend this enough."</p>
                        <p className="font-semibold mt-2">- Mike & Jen T.</p>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md text-center">
                        <div className="flex justify-center mb-2">
                             {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                        </div>
                        <p className="italic">"My bank couldn't believe it. I'm on track to save over $50k."</p>
                        <p className="font-semibold mt-2">- David L.</p>
                    </div>
                </div>
            </div>
        </section>


        {/* How It Works Section */}
        <section className="bg-secondary py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <Calculator className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">1. Enter Details</h3>
                        <p className="text-muted-foreground mt-2">Securely provide your current mortgage numbers in 60 seconds.</p>
                    </div>
                    <div className="flex flex-col items-center">
                         <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <TrendingUp className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">2. Get Your Personalized Report</h3>
                        <p className="text-muted-foreground mt-2">Instantly see your potential interest savings and new debt-free date.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">3. Start Saving Smarter</h3>
                        <p className="text-muted-foreground mt-2">Follow our simple, proven plan to accelerate your financial freedom.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Founder's Note Section */}
        <section className="bg-background py-16">
             <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto bg-card p-8 rounded-xl shadow-lg">
                    {founderImage && (
                        <Image 
                            src={founderImage.imageUrl} 
                            alt="Founder of Mortgage Cutter" 
                            width={150} 
                            height={150} 
                            className="rounded-full object-cover w-[150px] h-[150px]"
                            data-ai-hint={founderImage.imageHint}
                        />
                    )}
                    <div>
                        <h3 className="text-2xl font-bold">Meet the Creator</h3>
                        <p className="text-muted-foreground mt-2 italic">"I built Mortgage Cutter after my own family escaped an $87,000 interest trap. I knew there had to be a simpler way for everyday people to beat the system. This is it."</p>
                    </div>
                </div>
             </div>
        </section>

      </div>
    </>
  );
}
