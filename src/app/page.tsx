
import Image from 'next/image';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, CheckCircle, TrendingUp, Target, Award } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  const founderImage = PlaceHolderImages.find((p) => p.id === 'testimonial-person');

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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/80" />
          
          {/* Scarcity Bar */}
          <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-black text-center py-2 text-sm font-semibold z-20">
            Only 12 free blueprints left this month—grab yours now!
          </div>

          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center gap-8">
            <div className="max-w-4xl text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
                How Most Homeowners Overpay $50,000+ In Interest
                <span className="block text-yellow-300 mt-2">Discover How To Pay Off Your Mortgage Years Faster!</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                Find out in 60 seconds how much interest you could be saving—even if you keep your current bank and budget.
              </p>
            </div>

            <div className="w-full max-w-md">
                <div className="text-center text-white mb-4">
                    <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                        <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                        <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                        <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                        <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-sm mt-1">"I saved $34,000 in interest!" - 4.8/5 from 500+ happy homeowners</p>
                </div>
                <HeroForm />
                <div className="text-center text-gray-300 text-xs mt-4">
                    <p>100% Free & Private. Trusted by 1,200+ Canadians.</p>
                    <p className="mt-1">As featured in: <span className="font-semibold">Forbes, Globe and Mail</span></p>
                </div>
            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-background py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <Target className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">1. Enter Details</h3>
                        <p className="text-muted-foreground mt-2">Provide your current mortgage numbers. It's fast, secure, and private.</p>
                    </div>
                    <div className="flex flex-col items-center">
                         <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <TrendingUp className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">2. Get Your Savings Blueprint</h3>
                        <p className="text-muted-foreground mt-2">Instantly see your potential interest savings and new debt-free date.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-4">
                            <CheckCircle className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">3. Pay Off Faster</h3>
                        <p className="text-muted-foreground mt-2">Follow the simple plan to start saving thousands and build equity sooner.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Founder's Note Section */}
        <section className="bg-secondary py-16">
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
                        <h3 className="text-2xl font-bold">A Note From Our Founder</h3>
                        <p className="text-muted-foreground mt-2 italic">"I created Mortgage Cutter after watching my own family lose thousands to hidden interest. I knew there had to be a way for regular people to beat the system. This is it."</p>
                    </div>
                </div>
             </div>
        </section>

      </div>
    </>
  );
}
