import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Lock, AlertTriangle, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Mortgage-Free Manifesto - Your Escape Route',
  description: 'Discover the secret to paying off your mortgage in as little as 7-10 years using the bank\'s own money. Get the book for just $7.',
  robots: { // Good for sales pages that might be part of a funnel
    index: true,
    follow: true,
  }
};

export default function BookSalesPage() {
  const bookCoverImage = PlaceHolderImages.find(p => p.id === 'book-cover');

  return (
    <div className="bg-gray-50 text-gray-800 font-body">
      <div className="text-center py-3 bg-yellow-400 text-black font-bold text-sm">
        <AlertTriangle className="inline-block h-4 w-4 mr-1" /> WARNING: This page contains a strategy your bank hopes you never discover.
      </div>
      
      {/* Main Headline Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Are You <span className="text-red-600">Trapped</span> in a 30-Year Mortgage? Here’s the Escape Route They Hoped You’d Never Find.
          </h1>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 font-semibold">
            Discover the 'Cashflow Cannon' Secret That <span className="underline decoration-yellow-400 decoration-4">Obliterates Your Mortgage in 7-10 Years</span>... Using the Bank's Own Money... Without Changing Your Job or Winning the Lottery.
          </p>
        </div>

        {/* The Story & Problem */}
        <Card className="mt-12 max-w-3xl mx-auto bg-white shadow-xl">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              For years, I was a "good" homeowner. I paid my mortgage on time, every single month. I even tried to throw an extra $50 at it when I could.
              <br/><br/>
              But when I looked at my statement after five years of faithful payments, <strong className="font-bold">I felt sick to my stomach.</strong> My balance had barely budged. I had paid the bank tens of thousands of dollars, and almost all of it had vanished into thin air as pure interest.
              <br/><br/>
              <span className="bg-red-100 p-2 rounded-md">I was trapped in a financial prison, and the bank was getting rich off my "slow and steady" sentence.</span>
              <br/><br/>
              Do you realize that on a typical $400,000 mortgage, you're on track to hand over <strong className="text-red-700 text-xl font-bold">$500,000+</strong> in PURE INTEREST to the bank? That's more than the house itself!
            </p>
          </CardContent>
        </Card>

        {/* The Solution / Book Reveal */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">But what if there was a way to turn the tables?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">A method so powerful, it uses your normal, everyday income to act like a wrecking ball against your principal balance. A method that lets you pay off your home in a third of the time.</p>
          <h3 className="mt-8 text-2xl sm:text-3xl font-bold">INTRODUCING...</h3>
        </div>

        <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-900 text-white p-8 rounded-2xl shadow-2xl">
          <div className="text-center md:text-left">
            <h4 className="text-4xl font-bold tracking-tighter">The Mortgage-Free Manifesto</h4>
            <p className="mt-4 text-gray-300">The Underground Playbook to Paying Off Your Mortgage in Record Time.</p>
            {bookCoverImage && (
              <div className="mt-6 md:hidden">
                <Image src={bookCoverImage.imageUrl} alt="The Mortgage-Free Manifesto Book Cover" width={400} height={600} className="rounded-lg shadow-lg mx-auto" data-ai-hint={bookCoverImage.imageHint} />
              </div>
            )}
            <ul className="mt-6 space-y-3 text-left">
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>The #1 Lie on your mortgage statement that keeps you paying interest for decades.</span></li>
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>How to turn your chequing account into a debt-crushing weapon that works for you 24/7.</span></li>
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>The "Chunk Down" trick for making targeted principal strikes that save you thousands in future interest.</span></li>
               <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Why making "extra payments" is the slow, inefficient way to get debt-free (and what to do instead).</span></li>
            </ul>
          </div>
          <div className="hidden md:block">
            {bookCoverImage && (
              <Image src={bookCoverImage.imageUrl} alt="The Mortgage-Free Manifesto Book Cover" width={400} height={600} className="rounded-lg shadow-2xl" data-ai-hint={bookCoverImage.imageHint} />
            )}
          </div>
        </div>
        
        {/* The Offer */}
        <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-white shadow-2xl border-4 border-yellow-400">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Get Instant Access to the Digital Book Now</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-extrabold text-gray-900">
                        <span className="line-through text-3xl text-gray-400 mr-2">$49</span>
                        Just $7
                    </p>
                    <p className="text-yellow-600 font-semibold mt-2">Special Introductory Price - Ends Soon!</p>
                    <Button asChild size="lg" className="mt-6 w-full text-xl py-8 animate-pulse">
                        <Link href="/purchase?plan=pro_297">
                            <ChevronsRight className="mr-2 h-6 w-6"/> Yes! I Want the $7 Book! (Instant Access)
                        </Link>
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 flex items-center justify-center"><Lock className="h-3 w-3 mr-1" /> Secure 128-bit SSL Encrypted Payment</p>
                </CardContent>
            </Card>
        </div>

        {/* Social Proof */}
        <div id="social-proof" className="my-16">
            <h2 className="text-3xl font-bold mb-8 text-center">What Homeowners Are Saying...</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Card className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="flex justify-center mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}</div>
                    <p className="italic">"We shaved 9 years and about $42,000 in interest — without switching banks. This book is the reason why."</p>
                    <p className="font-semibold mt-2">- Sarah L., Toronto</p>
                </Card>
                <Card className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="flex justify-center mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}</div>
                    <p className="italic">"The 'Cashflow Cannon' is no joke. I finally see how to beat the interest game. This changed our entire financial timeline."</p>
                    <p className="font-semibold mt-2">- Michael R., Calgary</p>
                </Card>
                <Card className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="flex justify-center mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}</div>
                    <p className="italic">"I read it in one night and called my bank the next day. The blueprint inside is crystal clear. We're on track to save over $60k."</p>
                    <p className="font-semibold mt-2">- Priya P., Vancouver</p>
                </Card>
            </div>
        </div>

        {/* Upsell (OTO) */}
        <div className="mt-16 py-12 bg-gray-100 border-t-4 border-b-4 border-dashed border-gray-300">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-red-600 font-bold text-2xl animate-pulse">WAIT! Your Order Is Not Complete...</h2>
                <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">Want to Put This Entire System on Autopilot?</h3>
                <p className="mt-4 text-lg text-gray-600">For a small, one-time investment, add our **'Chunker' Strategy Calculator & Toolkit** to your order and let our system do the heavy lifting for you.</p>

                <Card className="mt-8 bg-white shadow-lg text-left">
                    <CardHeader>
                        <CardTitle>Here's What The Calculator Does:</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <li className="flex items-start"><Check className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Tells you EXACTLY how much to "chunk" down from your mortgage for maximum impact. No guesswork.</span></li>
                        <li className="flex items-start"><Check className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Calculates your new, ACCELERATED "Debt-Free Date" and updates it in real-time as you make progress.</span></li>
                        <li className="flex items-start"><Check className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Models different scenarios so you can see how a small change in income or expenses can shave off even MORE years.</span></li>
                    </CardContent>
                </Card>
                
                <p className="mt-6 text-lg font-semibold">This is the difference between <em className="font-bold">knowing</em> the path and having a <em className="font-bold">GPS guide you every single step of the way.</em></p>
                
                <div className="mt-8 p-6 bg-green-50 border-2 border-green-500 rounded-lg shadow-2xl">
                     <p className="text-lg">Normally $297, add the Complete Chunker Toolkit to your order right now for a single, one-time payment of...</p>
                     <p className="text-6xl font-bold my-2">$97</p>
                     <Button asChild size="lg" className="w-full text-xl py-8">
                        <Link href="/purchase?plan=pro_297">Yes, Add the Calculator Toolkit for $97!</Link>
                    </Button>
                    <Link href="/purchase?plan=pro_297" className="text-sm text-gray-500 mt-4 underline hover:text-gray-700 block">No thanks, I'll do the math myself and just take the book for $7</Link>
                </div>
            </div>
        </div>

        {/* Guarantee */}
        <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto border-dashed border-2 p-6">
                <h3 className="text-xl font-bold">The 60-Day "It Works" Guarantee</h3>
                <p className="mt-2 text-gray-600">My promise to you is simple: Get the book. Read it. If you don't see a clear, actionable path to saving at least $20,000 on your mortgage, just send us an email within 60 days, and we'll refund your $7. No questions asked. You can even keep the book.</p>
            </Card>
        </div>

         {/* Final CTA */}
         <div className="mt-16 text-center">
             <h2 className="text-3xl font-bold">Stop Letting the Bank Dictate Your Next 30 Years.</h2>
             <p className="mt-4 text-lg text-gray-600">For just $7, you get the blueprint to freedom. Click the button below to get started.</p>
             <Button asChild size="lg" className="mt-6 w-full max-w-md text-xl py-8">
                <Link href="/purchase?plan=pro_297">
                    Get My $7 Manifesto Now
                </Link>
            </Button>
         </div>

      </main>
    </div>
  );
}
