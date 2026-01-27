
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, XCircle, Star, Lock, Target, Gift, FileText, Bot, ListChecks, CalendarClock, Award, ChevronsRight, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generatePersonalizedIntro } from '@/ai/flows/personalized-book-intro';
import { Textarea } from '@/components/ui/textarea';


const FAQ_ITEMS = [
    {
        question: "If this works, why doesn’t everyone do it?",
        answer: "Because banks make way more money on 25–30 year mortgages than on fast, efficient HELOC strategies. Most bankers are trained to sell mortgages, not to teach you how to pay them off fast. This isn’t magic; it’s just simple interest vs amortized interest, plus a different flow of money."
    },
    {
        question: "This sounds too good to be true. Is it a scam?",
        answer: "No. HELOCs are standard, regulated products in both the U.S. and Canada from real banks. You are paying back real debt in a legal, normal way. The “scam” is how traditional mortgages front-load interest and stretch your payments over decades. This system just flips the script."
    },
    {
        question: "Do I need a perfect credit score or giant income?",
        answer: "No. We talk inside about typical credit score ranges that work for HELOCs, how to clean up your profile fast, and how much equity you really need. If you can qualify for a mortgage, you’re usually not far from qualifying for a HELOC too."
    },
    {
        question: "What if I try this and it doesn’t fit my situation?",
        answer: "That’s why this is a low-cost digital product with a clear, step-by-step process, backed by a 30-day money-back guarantee. You’ll know very quickly if it fits your numbers. If not, you get your money back. No drama."
    }
];

function PersonalizedIntroGenerator() {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [generatedIntro, setGeneratedIntro] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setGeneratedIntro('');
        try {
            const result = await generatePersonalizedIntro({ name, mortgageBalance: parseFloat(balance) });
            setGeneratedIntro(result.intro);
        } catch (err) {
            setError('Could not generate your preview. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-slate-800 border-yellow-400 border-2 shadow-2xl shadow-yellow-500/20 text-white">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl text-yellow-400">Read YOUR Personalized First Page</CardTitle>
                <CardDescription className="text-slate-300">Enter your info below to see the book come to life with your numbers.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="text-slate-300">First Name</Label>
                            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane" required className="bg-slate-900 border-slate-700 text-white"/>
                        </div>
                        <div>
                            <Label htmlFor="balance" className="text-slate-300">Mortgage Balance</Label>
                            <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="e.g., 450000" required className="bg-slate-900 border-slate-700 text-white"/>
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold text-lg">
                        {isLoading ? <Loader2 className="animate-spin" /> : <><Zap className="mr-2 h-5 w-5"/>Generate My Preview</>}
                    </Button>
                </form>

                {generatedIntro && (
                    <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-lg text-yellow-300 mb-2">Here is your personalized Chapter 1 preview:</h4>
                        <p className="text-slate-200 whitespace-pre-wrap font-serif text-lg leading-relaxed">{generatedIntro}</p>
                    </div>
                )}
                {error && <p className="mt-4 text-center text-red-400">{error}</p>}
            </CardContent>
        </Card>
    );
}


export default function BookSalesPageV5() {
  const authorImage = PlaceHolderImages.find(p => p.id === 'author-portrait');
  const productBundleImage = PlaceHolderImages.find(p => p.id === 'product-bundle');
  const bookCoverImage = PlaceHolderImages.find(p => p.id === 'book-cover');


  return (
    <div className="bg-gray-900 text-slate-100 font-sans" dir="ltr">
       <div className="text-center py-2 bg-blue-100 border-b border-blue-200">
        <Link href="/book-sales/hindi" className="text-blue-700 font-semibold hover:underline">
          हिंदी में पढ़ने के लिए यहां क्लिक करें (Click here to read in Hindi)
        </Link>
      </div>

      <header className="text-center pt-16 pb-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
            <p className="font-semibold text-yellow-400">For U.S. & Canadian Homeowners Stuck in a 25–30 Year Mortgage…</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mt-2 text-white">
                How to Pay Off Your House in About 5 Years Without Earning a Single Extra Dollar
            </h1>
            <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300">
                Discover the simple HELOC-based system that turns your current income into a debt-destroying machine… so you can own your home free and clear years sooner, without cutting your lifestyle to the bone.
            </p>
             <div className="mt-8">
                <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700 text-xl font-bold py-8 px-12 animate-pulse shadow-lg shadow-green-500/30">
                    <Link href="#offer">YES, Show Me The System! <ChevronsRight className="ml-2 h-6 w-6" /></Link>
                </Button>
                 <p className="text-sm text-gray-400 mt-3">Instant Access for Just $27</p>
            </div>
        </div>
      </header>
      
      <main className="bg-slate-50 text-slate-900 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Let me ask you a blunt question:</h2>
              <p className="text-2xl md:text-3xl font-semibold mt-2 text-primary">How many more years are you willing to work… <span className="underline decoration-yellow-400">just to keep your bank rich?</span></p>
              
              <div className="mt-8 text-left text-lg text-slate-700 space-y-4 prose prose-lg max-w-none">
                  <p>Every month, you send in that mortgage payment. You do what you’re “supposed” to do. You pay on time. You follow the rules.</p>
                  <p>And yet… if you look at your statement, <strong className="text-red-600">almost nothing goes to the actual loan.</strong> Most of it is interest.</p>
                  <p>If you’re like most U.S. and Canadian homeowners, you’re on track to pay back <strong>one house for you… and one house for the bank</strong> over 25–30 years. All with the income you’re already sweating for.</p>
              </div>

              <Card className="mt-10 bg-blue-50 border-2 border-blue-200 shadow-xl text-left">
                <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-center mb-4">But what if you could...</h3>
                    <ul className="mt-4 space-y-3 text-lg">
                        <li className="flex items-start gap-3"><XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" /><span>Change <span className="font-bold">nothing</span> about your job.</span></li>
                        <li className="flex items-start gap-3"><XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" /><span>Change <span className="font-bold">almost nothing</span> about your lifestyle.</span></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" /><span>And still pay off your home in about <span className="font-bold text-primary">5–7 years</span> instead of 25–30?</span></li>
                    </ul>
                    <p className="text-center font-semibold mt-6 text-lg">No side hustle. No risky investments. Just a smarter way to route the income you ALREADY earn.</p>
                </CardContent>
              </Card>
              
              <div className="mt-12">
                <p className="text-lg text-slate-700">That’s exactly what my system shows you inside:</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-center mt-2 p-4 bg-yellow-200 rounded-lg shadow-md">"How to Pay Off Your House in 5 Years Without Earning More Money"</h3>
                <p className="text-lg text-slate-600 mt-4">This is a step-by-step ebook + tools designed for U.S. and Canadian homeowners who are tired of being stuck in a “death pledge” and ready to own their home outright in a fraction of the time.</p>
              </div>
            </div>
        </div>
      </main>

        <section id="story" className="py-16 md:py-24 bg-gray-800 text-slate-200">
            <div className="container mx-auto px-4">
                <Card className="max-w-4xl mx-auto bg-gray-900 shadow-xl overflow-hidden md:flex">
                    {authorImage && (
                        <div className="md:w-1/3">
                            <Image src={authorImage.imageUrl} alt={authorImage.description} width={400} height={600} className="object-cover h-full w-full" data-ai-hint={authorImage.imageHint}/>
                        </div>
                    )}
                    <div className="p-8 md:w-2/3">
                        <h2 className="text-2xl font-bold text-yellow-400">Why I Was Angry Enough to Create This</h2>
                        <p className="mt-4 text-slate-300">When I got my first mortgage, I did what everyone else does. I smiled and signed the 25-year papers. Then I looked at my statement.</p>
                        <blockquote className="mt-4 p-4 border-l-4 border-yellow-400 bg-gray-800 rounded-r-lg italic text-xl font-semibold">
                            “I’m working this hard… and most of my house payment doesn’t even go toward my house.”
                        </blockquote>
                        <p className="mt-4 text-slate-300">I felt trapped. So I started digging. I discovered that mortgages are front-loaded with interest on purpose. Then I discovered a different tool: the Home Equity Line of Credit (HELOC).</p>
                        <p className="mt-2 text-slate-300">Not a “second mortgage to blow on a kitchen remodel,” but a first-lien HELOC strategy that lets you use simple daily interest math to crush the balance. I didn't earn more money. I just changed where my money flowed. My payoff date dropped from 25 years to under 7.</p>
                        <p className="mt-4 font-bold text-white">That's why I wrote this ebook—so regular homeowners can finally see the game the banks are playing and learn the simple system that flips the script.</p>
                    </div>
                </Card>
            </div>
        </section>
        
        <div className="py-16 md:py-24 bg-gray-900">
             <div className="container mx-auto px-4 max-w-4xl text-center">
                <PersonalizedIntroGenerator />
            </div>
        </div>

        <section id="offer" className="py-16 md:py-24 bg-blue-50 text-slate-900">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold">Here’s Everything You Get When You Order Today</h2>
                <p className="text-lg text-slate-600 mt-2">You’re not just getting a PDF. You’re getting a complete home payoff mini-system.</p>
                
                <div className="mt-10 text-left bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-gray-200">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">WHAT YOU GET:</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-600 mt-1 shrink-0" /><div><h4 className="font-bold">The Core Ebook: "How to Pay Off Your House in 5 Years"</h4><p className="text-sm text-slate-500">(Value: $97)</p></div></li>
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-600 mt-1 shrink-0" /><div><h4 className="font-bold">The 5-Year Payoff Calculator Access</h4><p className="text-sm text-slate-500">(Value: $47)</p></div></li>
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-600 mt-1 shrink-0" /><div><h4 className="font-bold">HELOC Bank Call Script & Checklist</h4><p className="text-sm text-slate-500">(Value: $27)</p></div></li>
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-600 mt-1 shrink-0" /><div><h4 className="font-bold">HELOC vs Mortgage Cheat Sheet</h4><p className="text-sm text-slate-500">(Value: $27)</p></div></li>
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-600 mt-1 shrink-0" /><div><h4 className="font-bold">Credit Tune-Up Checklist</h4><p className="text-sm text-slate-500">(Value: $37)</p></div></li>
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-600 mt-1 shrink-0" /><div><h4 className="font-bold">"First 90 Days" Action Plan</h4><p className="text-sm text-slate-500">(Value: $27)</p></div></li>
                        </ul>
                      </div>
                       <div className="text-center">
                        {bookCoverImage && <Image src={bookCoverImage.imageUrl} alt={bookCoverImage.description} width={400} height={600} className="rounded-lg shadow-xl mx-auto" data-ai-hint={bookCoverImage.imageHint} />}
                      </div>
                    </div>
                     <div className="text-center pt-8 mt-8 border-t-2 border-dashed">
                        <p className="text-gray-500 font-semibold">Total Real-World Value: <span className="line-through">$262</span></p>
                        <p className="text-xl mt-2">Your Price Today: Just...</p>
                        <p className="text-7xl font-extrabold text-primary mt-1">$27</p>
                        <p className="text-gray-500">One time. No subscriptions. Instant access.</p>
                    </div>
                     <div className="mt-8">
                         <Button asChild size="lg" className="w-full text-xl py-8 animate-pulse bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50">
                            <Link href="/purchase?plan=book_27">
                                <Lock className="mr-3 h-6 w-6"/> Get Instant Access Now For Just $27
                            </Link>
                        </Button>
                        <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-2"><Lock className="h-3 w-3" /> Secure 128-bit SSL Encrypted Payment</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="evidence" className="py-16 md:py-24 bg-gray-800 text-slate-200">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center">Let’s Address the Voices In Your Head...</h2>
                 <Accordion type="single" collapsible className="w-full mt-8" defaultValue="item-1">
                  {FAQ_ITEMS.map((item, index) => (
                    <AccordionItem value={`item-${index + 1}`} key={index} className="bg-gray-900/50 rounded-lg mb-3 border-b-0 px-4">
                      <AccordionTrigger className="text-lg text-left font-semibold text-white hover:no-underline">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-base text-slate-300 pt-2 pb-4 prose prose-invert max-w-none">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </div>
        </section>
        
        <section id="close" className="py-16 md:py-24 bg-gray-900 text-white">
            <div className="container mx-auto px-4 max-w-3xl text-center">
                
                <Card className="text-left bg-yellow-400 text-gray-900 border-4 border-yellow-500 shadow-2xl shadow-yellow-500/20">
                     <CardHeader className="flex-row items-center gap-4">
                        <Award className="h-16 w-16 text-yellow-800 flex-shrink-0" />
                        <CardTitle className="text-3xl text-yellow-900">Our 30-Day, 100% Money-Back Guarantee</CardTitle>
                     </CardHeader>
                    <CardContent className="text-lg text-yellow-900/80">
                        <p>Try the ebook. Run your numbers. If within 30 days you don’t feel clear on the strategy and confident in your next steps, just send a quick email for a full refund. No hoops. No hard feelings. <strong className="text-yellow-900">You risk $0.</strong></p>
                    </CardContent>
                </Card>

                <div className="mt-16">
                     <h3 className="text-4xl font-bold">Your Move.</h3>
                     <p className="text-lg text-slate-300 mt-4">You can close this page and keep sending thousands to the bank for the next 20–25 years. Or you can spend $27 one time and learn how to flip the math.</p>
                      <Button asChild size="lg" className="mt-8 w-full max-w-lg text-2xl py-10 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/40">
                        <Link href="/purchase?plan=book_27">
                           Yes! Give Me Instant Access for $27
                        </Link>
                    </Button>
                    <p className="text-sm text-slate-400 mt-3">Own your home faster. Keep more of your money.</p>
                </div>
                
                 <div className="mt-16 pt-8 border-t border-gray-700 text-base text-slate-400">
                    <p><strong>P.S.</strong> Every month you wait is another full-interest payment to the bank. For just $27, you can learn how to break the cycle starting today. The risk is all on me. <Link href="/purchase?plan=book_27" className="underline hover:text-yellow-400">Click here to get started.</Link></p>
                 </div>
            </div>
        </section>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'How to Pay Off Your House in About 5 Years',
  description: 'Discover the simple HELOC-based system that turns your current income into a debt-destroying machine so you can own your home free and clear years sooner.',
  robots: { 
    index: true,
    follow: true,
  }
};

    