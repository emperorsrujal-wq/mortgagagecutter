
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, XCircle, Star, Lock, Target, Gift, FileText, Bot, ListChecks, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Pay Off Your House in About 5 Years',
  description: 'Discover the simple HELOC-based system that turns your current income into a debt-destroying machine so you can own your home free and clear years sooner.',
  robots: { 
    index: true,
    follow: true,
  }
};

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

export default function BookSalesPageV2() {
  const authorImage = PlaceHolderImages.find(p => p.id === 'author-portrait');
  const productBundleImage = PlaceHolderImages.find(p => p.id === 'product-bundle');

  return (
    <div className="bg-gray-50 text-slate-900">
      <div className="text-center py-2 bg-blue-100 border-b border-blue-200">
        <Link href="/book-sales/hindi" className="text-blue-700 font-semibold hover:underline">
          हिंदी में पढ़ने के लिए यहां क्लिक करें (Click here to read in Hindi)
        </Link>
      </div>

      {/* 1. The Headline Section */}
      <header className="bg-gray-900 text-white text-center py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
            <p className="font-semibold text-yellow-400">For U.S. & Canadian Homeowners Stuck in a 25–30 Year Mortgage…</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mt-2">
                How to Pay Off Your House in About 5 Years Without Earning a Single Extra Dollar
            </h1>
            <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300">
                Discover the simple HELOC-based system that turns your current income into a debt-destroying machine… so you can own your home free and clear years sooner, without cutting your lifestyle to the bone.
            </p>
             <div className="mt-8">
                <Button asChild size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 text-lg font-bold py-7 px-10 animate-pulse">
                    <Link href="#offer">Get Instant Access for $27</Link>
                </Button>
            </div>
        </div>
      </header>
      
      {/* 2. The Lead */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center">Let me ask you a blunt question:</h2>
          <p className="text-2xl font-semibold text-center mt-2 text-primary">How many more years are you willing to work… just to keep your bank rich?</p>
          <p className="text-lg text-slate-700 mt-6">Every month, you send in that mortgage payment. You do what you’re “supposed” to do. You pay on time. You follow the rules. And yet… if you look at your statement, almost nothing goes to the actual loan. Most of it is interest.</p>
          <p className="text-lg text-slate-700 mt-4">If you’re like most U.S. and Canadian homeowners, you’re on track to pay back one house for you… and one house for the bank over 25–30 years. All with the income you’re already sweating for.</p>
          
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
                <h3 className="text-xl font-bold text-center">But what if:</h3>
                <ul className="mt-4 space-y-3 text-lg">
                    <li className="flex items-start gap-3"><XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" /><span>You could change <span className="font-bold">nothing</span> about your job.</span></li>
                    <li className="flex items-start gap-3"><XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" /><span>Change <span className="font-bold">almost nothing</span> about your lifestyle.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" /><span>And still pay off your home in about <span className="font-bold">5–7 years</span> instead of 25–30?</span></li>
                </ul>
                <p className="text-center font-semibold mt-4">No side hustle. No risky investments. Just a smarter way to route the income you ALREADY earn.</p>
            </CardContent>
          </Card>
          
          <p className="text-lg text-slate-700 mt-8">That’s exactly what my system shows you inside:</p>
          <h3 className="text-2xl font-bold text-center mt-2 p-4 bg-yellow-200 rounded-lg">"How to Pay Off Your House in 5 Years Without Earning More Money"</h3>
          <p className="text-lg text-slate-700 mt-4">This is a step-by-step ebook + tools designed for U.S. and Canadian homeowners who are tired of being stuck in a “death pledge” and ready to own their home outright in a fraction of the time.</p>
        </div>

        {/* 3. The Story */}
        <section id="story" className="mt-20">
            <Card className="max-w-4xl mx-auto bg-white shadow-xl overflow-hidden md:flex">
                {authorImage && (
                    <div className="md:w-1/3">
                        <Image src={authorImage.imageUrl} alt={authorImage.description} width={400} height={600} className="object-cover h-full w-full" data-ai-hint={authorImage.imageHint}/>
                    </div>
                )}
                <div className="p-8 md:w-2/3">
                    <h2 className="text-2xl font-bold text-primary">Why I Was Angry Enough to Create This</h2>
                    <p className="mt-4 text-slate-600">When I got my first mortgage, I did what everyone else does. I smiled and signed the 25-year papers. Then I looked at my statement. After a full year of payments, I saw I had paid tens of thousands, and only a tiny slice had gone to the principal.</p>
                    <p className="mt-2 text-slate-600 font-semibold italic">“I’m working this hard… and most of my house payment doesn’t even go toward my house.”</p>
                    <p className="mt-2 text-slate-600">I felt trapped. So I started digging. I discovered that mortgages are front-loaded with interest on purpose. The first 10–15 years are designed so the bank gets paid first. Then I discovered a different tool: the Home Equity Line of Credit (HELOC).</p>
                     <p className="mt-2 text-slate-600">Not a “second mortgage to blow on a kitchen remodel,” but a first-lien HELOC strategy that lets you use simple daily interest math to crush the balance. I didn't earn more money or change my life. I just changed where my money flowed. My payoff date dropped from 25 years to under 7.</p>
                    <p className="mt-4 font-bold">That's why I wrote this ebook—so regular homeowners can finally see the game the banks are playing and learn the simple system that flips the script.</p>
                </div>
            </Card>
        </section>

        {/* 4. The Pitch */}
        <section id="pitch" className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center">What You’ll Get Inside</h2>
            <p className="text-lg text-muted-foreground text-center mt-2">This isn’t theory. It’s a <span className="font-bold">do this, then do this</span> system.</p>
            <div className="mt-8 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Target className="h-6 w-6 text-primary"/>Why Your Mortgage Is Your #1 Wealth Blocker</CardTitle>
                        <CardDescription>Learn how 25–30 year mortgages quietly steal hundreds of thousands from average families.</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Bot className="h-6 w-6 text-primary"/>The HELOC Explained in Plain English</CardTitle>
                        <CardDescription>No jargon. You’ll see exactly how a HELOC works and why it can be your secret weapon.</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><ListChecks className="h-6 w-6 text-primary"/>The 5-Step Fast Track Plan</CardTitle>
                        <CardDescription>A simple, repeatable process for using the income you already earn to hammer down your balance.</CardDescription>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><CalendarClock className="h-6 w-6 text-primary"/>Day-by-Day Money Flow Blueprint</CardTitle>
                        <CardDescription>Precisely what to do when your paycheck hits and when to pay bills to shrink your payoff date.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
            <p className="text-center mt-8 text-lg">...and you're not guessing. The system plugs into a simple online calculator (like the one on this site) where you can see the plan working with your real numbers.</p>
        </section>

        {/* 5. The Evidence (Objections) */}
        <section id="evidence" className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center">Let’s Address the Voices In Your Head...</h2>
             <Accordion type="single" collapsible className="w-full mt-8">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-lg text-left font-semibold">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pt-2">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </section>
        
        {/* 6. The Offer */}
        <section id="offer" className="mt-20">
            <Card className="max-w-3xl mx-auto bg-gray-900 text-white shadow-2xl border-4 border-yellow-400">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-yellow-400">Here’s Everything You Get When You Order Today</CardTitle>
                    <CardDescription className="text-gray-300">You’re not just getting a PDF. You’re getting a complete home payoff mini-system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {productBundleImage && <Image src={productBundleImage.imageUrl} alt="Bundle of ebook and checklists" width={800} height={400} className="rounded-lg mb-6" data-ai-hint={productBundleImage.imageHint} />}
                    <ul className="space-y-3 text-lg">
                        <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" /><div><strong className="text-white">The Core Ebook: "How to Pay Off Your House in 5 Years"</strong> (Value: $97)</div></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" /><div><strong className="text-white">The 5-Year Payoff Calculator Access</strong> (Value: $47)</div></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" /><div><strong className="text-white">HELOC Bank Call Script & Checklist</strong> (Value: $27)</div></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" /><div><strong className="text-white">HELOC vs. Mortgage Cheat Sheet</strong> (Value: $27)</div></li>
                        <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Credit Tune-Up Checklist</strong> (Value: $37)</div></li>
                         <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" /><div><strong className="text-white">"First 90 Days" Action Plan</strong> (Value: $27)</div></li>
                    </ul>
                    <div className="text-center pt-4">
                        <p className="text-gray-400">Total Real-World Value: <span className="line-through">$262</span></p>
                        <p className="text-xl mt-2">Your Price Today: Just...</p>
                        <p className="text-6xl font-extrabold text-yellow-400 mt-1">$27</p>
                        <p className="text-gray-400">One time. No subscriptions. Instant access.</p>
                    </div>
                </CardContent>
                <CardContent>
                     <Button asChild size="lg" className="w-full text-xl py-8 animate-pulse bg-green-600 hover:bg-green-700">
                        <Link href="/purchase?plan=book_27">
                            👉 Click Here to Get Instant Access for $27
                        </Link>
                    </Button>
                    <p className="text-xs text-gray-400 mt-2 flex items-center justify-center"><Lock className="h-3 w-3 mr-1" /> Secure 128-bit SSL Encrypted Payment</p>
                </CardContent>
            </Card>
        </section>

        {/* 7. The Close */}
        <section id="close" className="mt-20 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold">This Is Worth 10–100X What You’ll Pay</h2>
            <p className="text-lg mt-4 text-slate-700">Let’s be blunt. If your current path has you paying $150,000… $200,000… even $300,000+ in interest, and this system helps you save even $30,000–$50,000, then a $27 decision is nothing.</p>
            <p className="text-lg font-semibold mt-4 text-primary">Every month you wait is a month you could have been saving interest and pulling your payoff date closer.</p>
            
            <Card className="mt-12 text-left bg-green-50 border-green-300">
                 <CardHeader>
                    <CardTitle className="text-2xl text-green-800">30-Day Money-Back Guarantee</CardTitle>
                 </CardHeader>
                <CardContent>
                    <p className="text-green-900">Try the ebook. Run your numbers. If within 30 days you don’t feel clear on the strategy and confident in your next steps, just send a quick email for a full refund. No hoops. No hard feelings. You risk $0.</p>
                </CardContent>
            </Card>

            <div className="mt-12">
                 <h3 className="text-2xl font-bold">Your Move.</h3>
                 <p className="text-lg text-slate-600 mt-2">You can close this page and keep sending thousands to the bank for the next 20–25 years. Or you can spend $27 one time and learn how to flip the math.</p>
                  <Button asChild size="lg" className="mt-6 w-full max-w-lg text-xl py-8 bg-green-600 hover:bg-green-700">
                    <Link href="/purchase?plan=book_27">
                        Get Instant Access for $27
                    </Link>
                </Button>
                <p className="text-xs text-slate-500 mt-2">Own your home faster. Keep more of your money.</p>
            </div>
        </section>
      </main>
    </div>
  );
}
