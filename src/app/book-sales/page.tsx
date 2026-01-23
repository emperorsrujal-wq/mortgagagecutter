
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Lock, AlertTriangle, ChevronsRight, Award } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Mortgage-Free Manifesto - Your Escape Route from the 30-Year Trap',
  description: 'Discover the underground playbook to paying off your mortgage in as little as 7-10 years using the bank\'s own money. Get the Manifesto for just $37.',
  robots: { 
    index: true,
    follow: true,
  }
};

export default function BookSalesPage() {
  const bookCoverImage = PlaceHolderImages.find(p => p.id === 'book-cover');
  const testimonial1 = PlaceHolderImages.find(p => p.id === 'testimonial-person');
  const testimonial2 = PlaceHolderImages.find(p => p.id === 'testimonial-person-2');
  const testimonial3 = PlaceHolderImages.find(p => p.id === 'testimonial-person-3');

  return (
    <div className="bg-gray-50 text-gray-800">
      <div className="text-center py-3 bg-yellow-400 text-black font-bold text-sm px-4 shadow-md">
        <AlertTriangle className="inline-block h-4 w-4 mr-1" /> WARNING: This page contains a strategy your bank prays you never discover.
      </div>
      
      <div className="text-center py-2 bg-blue-100 border-b border-blue-200">
        <Link href="/book-sales/hindi" className="text-blue-700 font-semibold hover:underline">
          हिंदी में पढ़ने के लिए यहां क्लिक करें (Click here to read in Hindi)
        </Link>
      </div>
      
      {/* Main Headline Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            The Underground Playbook That Frees You From Your 30-Year Mortgage Prison
          </h1>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 font-semibold">
            How to Use the Bank's <span className="underline decoration-yellow-400 decoration-4">Own Money</span> to Obliterate Your Debt in as Little as 7-10 Years—Without Changing Your Income or Switching Lenders.
          </p>
        </div>

        {/* The Story & Problem */}
        <Card className="mt-12 max-w-3xl mx-auto bg-white shadow-xl">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              For years, I did everything "right." I paid my mortgage on time, every single month. I dutifully sent in my payment, convinced I was building equity and securing my family's future.
              <br/><br/>
              Then one day, I looked at my mortgage statement after five years of faithful payments and <strong className="font-bold">the truth hit me like a ton of bricks.</strong> 
              <br/><br/>
              My balance had barely budged. I had paid the bank over $80,000, and almost all of it had vanished into thin air as PURE INTEREST.
              <br/><br/>
              <span className="bg-red-100 p-2 rounded-md">It's a rigged game. I wasn't building wealth; I was treading water in a financial prison, and the bank held the keys. My 30-year sentence was making them rich.</span>
              <br/><br/>
              Do you realize that on a typical $400,000 mortgage, you're on track to hand over <strong className="text-red-700 text-xl font-bold">$500,000+</strong> in PURE INTEREST to the bank? That's more than the house itself! It's a system designed to keep you paying, and paying... and paying.
            </p>
          </CardContent>
        </Card>

        {/* The Solution / Book Reveal */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">But what if you could turn their system against them?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">A method so powerful, it uses your normal, everyday income to act like a wrecking ball against your principal balance. A strategy that forces the bank to give you credit for every single dollar, every single day.</p>
          <h3 className="mt-8 text-2xl sm:text-3xl font-bold">INTRODUCING...</h3>
        </div>

        <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-900 text-white p-8 rounded-2xl shadow-2xl">
          <div className="text-center md:text-left">
            <h4 className="text-4xl font-bold tracking-tighter">The Mortgage-Free Manifesto</h4>
            <p className="mt-4 text-gray-300 text-lg">The 220-Page Underground Playbook to Reclaiming Your Financial Freedom.</p>
            {bookCoverImage && (
              <div className="mt-6 md:hidden">
                <Image src={bookCoverImage.imageUrl} alt="The Mortgage-Free Manifesto Book Cover" width="400" height="600" className="rounded-lg shadow-lg mx-auto" />
              </div>
            )}
            <ul className="mt-6 space-y-3 text-left">
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">The ‘Interest-Evaporation’ Secret:</strong> Why your mortgage statement is engineered to hide where your money really goes.</span></li>
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">The ‘Paycheck-as-a-Weapon’ System:</strong> Turn your everyday chequing account into a debt-obliterating machine that works for you 24/7.</span></li>
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">The ‘Principal Predator’ Strike:</strong> Make targeted attacks on your mortgage balance that save you tens of thousands in future interest.</span></li>
               <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">The ‘Extra Payments’ Myth:</strong> Why the common advice to "just pay extra" is the slow boat to nowhere... and the powerful alternative.</span></li>
               <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">The ‘HELOC Hijack’:</strong> A step-by-step blueprint to ethically hijacking a simple line of credit to pay the bank off with their own money.</span></li>
            </ul>
          </div>
          <div className="hidden md:block">
            {bookCoverImage && (
              <Image src={bookCoverImage.imageUrl} alt="The Mortgage-Free Manifesto Book Cover" width="400" height="600" className="rounded-lg shadow-2xl" />
            )}
          </div>
        </div>
        
        {/* The Offer */}
        <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-white shadow-2xl border-4 border-yellow-400">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">YES, I Want My Freedom! Send The Manifesto Now.</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-left bg-gray-50 p-4 rounded-lg border">
                      <h4 className="font-bold mb-2">Here's Everything You Get:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span>The Mortgage-Free Manifesto (220-Page eBook)</span> <span className="font-semibold text-gray-500 line-through">$97 Value</span></li>
                        <li className="flex justify-between"><span><strong className="text-primary">BONUS #1:</strong> The Perfect HELOC Bank Screener</span> <span className="font-semibold text-gray-500 line-through">$27 Value</span></li>
                        <li className="flex justify-between"><span><strong className="text-primary">BONUS #2:</strong> The 'Payoff vs. Invest' Decision Matrix</span> <span className="font-semibold text-gray-500 line-through">$19 Value</span></li>
                        <li className="flex justify-between"><span><strong className="text-primary">BONUS #3:</strong> Instant Digital Access + Lifetime Updates</span> <span className="font-semibold text-gray-500">Priceless!</span></li>
                      </ul>
                    </div>
                    <p className="font-bold">Total Value: $143+</p>
                    <p className="text-5xl font-extrabold text-gray-900">
                        Get Everything Today For Just...
                        <span className="text-green-600 block mt-2">One payment of $37</span>
                    </p>
                    
                    <Button asChild size="lg" className="mt-4 w-full text-xl py-8 animate-pulse bg-green-600 hover:bg-green-700">
                        <Link href="/purchase?plan=book_37">
                            <ChevronsRight className="mr-2 h-6 w-6"/> Yes! I Want My Manifesto for $37!
                        </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center"><Lock className="h-3 w-3 mr-1" /> Secure 128-bit SSL Encrypted Payment</p>
                </CardContent>
            </Card>
        </div>

        {/* Social Proof */}
        <div id="social-proof" className="my-16">
            <h2 className="text-3xl font-bold mb-8 text-center">What Homeowners Are Saying After Reading the Manifesto...</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <div className="flex justify-center mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}</div>
                    <p className="italic text-gray-600 flex-grow">"We shaved 9 years and about $42,000 in interest — without switching banks. This book is the reason why."</p>
                    <div className="flex items-center justify-center mt-4">
                        {testimonial1 && <Image src={testimonial1.imageUrl} alt={testimonial1.description} width={40} height={40} className="rounded-full mr-3" data-ai-hint={testimonial1.imageHint}/>}
                        <p className="font-semibold text-sm">- Sarah L., Toronto</p>
                    </div>
                </Card>
                <Card className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <div className="flex justify-center mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}</div>
                    <p className="italic text-gray-600 flex-grow">"The 'Chunk Down' strategy is no joke. I finally see a clear path to beating the interest game. This changed our entire financial timeline."</p>
                     <div className="flex items-center justify-center mt-4">
                        {testimonial2 && <Image src={testimonial2.imageUrl} alt={testimonial2.description} width={40} height={40} className="rounded-full mr-3" data-ai-hint={testimonial2.imageHint}/>}
                        <p className="font-semibold text-sm">- Michael R., Calgary</p>
                    </div>
                </Card>
                <Card className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <div className="flex justify-center mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}</div>
                    <p className="italic text-gray-600 flex-grow">"I read it in one night and called my bank the next day. The blueprint inside is crystal clear. We're on track to save over $60k."</p>
                     <div className="flex items-center justify-center mt-4">
                        {testimonial3 && <Image src={testimonial3.imageUrl} alt={testimonial3.description} width={40} height={40} className="rounded-full mr-3" data-ai-hint={testimonial3.imageHint}/>}
                        <p className="font-semibold text-sm">- Priya P., Vancouver</p>
                    </div>
                </Card>
            </div>
        </div>

        {/* Guarantee */}
        <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto border-dashed border-2 p-6 bg-green-50 border-green-300">
                 <div className="mx-auto bg-green-200 h-16 w-16 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-inner">
                    <Award className="h-8 w-8 text-green-700"/>
                 </div>
                <h3 className="text-xl font-bold text-green-800">The 60-Day "Keep The Book & Get Your Money Back" Promise</h3>
                <p className="mt-2 text-gray-600">My promise to you is simple: Get the manifesto. Read it. If you don't see a clear, actionable path to saving at least $20,000 on your mortgage, just send us an email within 60 days, and we'll refund your $37. No questions asked. <strong className="font-bold text-gray-800">You can even keep the book as our gift for taking action today.</strong> That's how certain I am that this will change your family's financial future.</p>
            </Card>
        </div>

         {/* Final CTA */}
         <div className="mt-16 text-center">
             <h2 className="text-3xl font-bold">Choose Your Future: 30 More Years of Payments, or Freedom in 7-10?</h2>
             <p className="mt-4 text-lg text-gray-600">For just $37, you get the blueprint. Your future self will thank you.</p>
             <Button asChild size="lg" className="mt-6 w-full max-w-lg text-xl py-8 bg-green-600 hover:bg-green-700">
                <Link href="/purchase?plan=book_37">
                    YES! I WANT MY FREEDOM! Send the Manifesto for $37
                </Link>
            </Button>
            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center"><Lock className="h-3 w-3 mr-1" /> 100% Secure Payment via Stripe</p>
         </div>

      </main>
    </div>
  );
}

    
    