
'use client';

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
        <div id="urgency" className="bg-yellow-400 text-black text-center py-2 text-sm font-semibold z-20">
          🎯 Only 25 free plans left this week — claim yours before the limit resets on Sunday.
        </div>
          
        {/* Hero Section */}
        <section id="hero" className="relative w-full flex-1 flex items-center justify-center py-20 md:py-32">
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
            <div className="max-w-[680px] text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
                Cut 8–12 Years Off Your Mortgage &amp; Save $30,000–$60,000 — In 60 Seconds
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                Discover how thousands of homeowners pay off their mortgage years faster — without extra income or switching banks.
              </p>
            </div>

            <div className="w-full max-w-md">
                <HeroForm />
            </div>

          </div>
        </section>
        
        {/* Objection/Benefits Bullets */}
        <section id="objections" className="bg-background py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto">
                    {[
                        'Save $30,000–$60,000+ in potential interest',
                        'Cut 8–12 years — no extra income needed',
                        'Works with any bank — keep your current mortgage',
                        'No refinancing or paperwork — instant insights',
                        'Fast & private — see your plan in ~60 seconds',
                        '100% free — no obligation, no credit check'
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                            <span className="text-lg text-foreground">{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Social Proof */}
        <section id="social-proof" className="bg-secondary py-16">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl font-bold mb-8 text-center">Real homeowners. Real results.</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-card p-6 rounded-lg shadow-md text-center">
                        <div className="flex justify-center mb-2">
                           {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                        </div>
                        <p className="italic">"We shaved 9 years and about $42,000 in interest — without switching banks."</p>
                        <p className="font-semibold mt-2">- Sarah L., Toronto</p>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md text-center">
                        <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                        </div>
                        <p className="italic">"Our plan showed a clear path to being debt-free. We’re saving ~$500/month."</p>
                        <p className="font-semibold mt-2">- Michael R., Calgary</p>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-md text-center">
                        <div className="flex justify-center mb-2">
                             {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                        </div>
                        <p className="italic">"I finally see how to beat the interest game. This changed our timeline."</p>
                        <p className="font-semibold mt-2">- Priya P., Vancouver</p>
                    </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-8 max-w-3xl mx-auto">
                    Many users report $30,000–$60,000+ in projected interest avoided and 8–12 years off their term (varies by rate and balance).
                </p>
            </div>
        </section>


        {/* How It Works Section */}
        <section id="how-it-works" className="bg-background py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-10">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <Calculator className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">1. Enter Your Details</h3>
                        <p className="text-muted-foreground mt-2">Tell us your mortgage amount, rate, and term — takes about 60 seconds.</p>
                    </div>
                    <div className="flex flex-col items-center">
                         <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <TrendingUp className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">2. See Your Free Savings Blueprint</h3>
                        <p className="text-muted-foreground mt-2">We instantly estimate how much time and interest you could save.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">3. Start Saving Smartly</h3>
                        <p className="text-muted-foreground mt-2">Follow your plan to cut years off your mortgage without changing banks.</p>
                    </div>
                </div>
                 <p className="text-center text-sm text-muted-foreground mt-6">Fast. Private. No credit check.</p>
            </div>
        </section>

        {/* Founder's Note Section */}
        <section id="founder-story" className="bg-secondary py-16">
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
                        <h3 className="text-2xl font-bold">Why I Built Mortgage Cutter</h3>
                        <p className="text-muted-foreground mt-2 italic">I started Mortgage Cutter after my own family faced an $87,000 interest trap. We weren’t earning more, and we didn’t want to switch banks. By changing how we directed payments, we cut years off our term. Now, this simple blueprint helps families see how much faster they could be mortgage-free.</p>
                    </div>
                </div>
             </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-background py-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: "Do I need extra cash to make this work?", a: "No. The blueprint shows ways to reduce interest with your current income and loan." },
                        { q: "Will this affect my bank or current mortgage?", a: "No. You keep your bank and terms; this isn’t a refinance." },
                        { q: "Is my information safe?", a: "Yes. We don’t ask for banking logins or do credit checks to show your plan." },
                        { q: "What if my rates or numbers change?", a: "Update the inputs any time to see a fresh blueprint — still free." },
                        { q: "Does this work in Canada and the U.S.?", a: "Yes. Our approach adapts to both markets." },
                        { q: "What happens after I get the plan?", a: "You’ll see your estimated savings and next steps. You decide how to proceed." }
                    ].map((faq, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                            <h3 className="font-semibold">{faq.q}</h3>
                            <p className="text-muted-foreground mt-1">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Risk Reversal */}
        <section id="risk-reversal" className="bg-secondary py-12">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <p className="text-lg text-muted-foreground">This is free, private, and no-obligation. No credit checks, no bank changes — just a fast way to see what your interest really costs and how to cut it.</p>
            </div>
        </section>

        {/* Final CTA */}
        <section id="final-cta" className="bg-background py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold">Ready to See Your Savings?</h2>
                 <div className="mt-6">
                    <Button size="lg" asChild>
                        <Link href="#hero">Get My Free Savings Blueprint</Link>
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">Takes about 60 seconds — no credit check, no obligation.</p>
                </div>
            </div>
        </section>
      </div>
    </>
  );
}
