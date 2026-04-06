
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle, 
  XCircle, 
  Award, 
  ChevronsRight, 
  Lock, 
  Zap, 
  ShieldCheck, 
  BarChart, 
  Users, 
  Star
} from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Pay Off Your House in About 5 Years | Mortgage Cutter',
  description: 'Discover the simple HELOC-based strategy to escape the 30-year mortgage trap and own your home free and clear years sooner.',
  robots: { 
    index: true,
    follow: true,
  }
};

const TESTIMONIALS = [
  { quote: "I finally understood why my mortgage wasn’t moving — this made it simple.", name: "Sarah L.", city: "Toronto, ON" },
  { quote: "Gave me the confidence I needed to talk to my bank about my options.", name: "Michael R.", city: "Calgary, AB" },
  { quote: "I feel in control of my money for the first time since signing the papers.", name: "David P.", city: "Austin, TX" },
  { quote: "The clarity I got from the PDF alone was worth 10x the price.", name: "Priya S.", city: "Vancouver, BC" },
  { quote: "Seeing a real plan instead of just 'paying extra' changed everything.", name: "John D.", city: "Denver, CO" },
  { quote: "No more banker jargon. Just simple steps that actually make sense.", name: "Nisha K.", city: "Brampton, ON" },
];

const FAQ_ITEMS = [
  {
    question: "Is this a PDF or physical book?",
    answer: "This is a digital PDF only. You will receive an instant download link immediately after your secure checkout."
  },
  {
    question: "Is this Canada or USA specific?",
    answer: "It is written for both Canada + USA homeowners. The core financial mechanics apply to both markets, though product names vary by bank."
  },
  {
    question: "Does this guarantee I’ll pay off in 5 years?",
    answer: "No. This is an educational strategy guide. Your results depend on your specific numbers, interest rates, and your own discipline."
  },
  {
    question: "Do I need a HELOC?",
    answer: "Not necessarily. The book explains the mechanics and helps you decide if that tool is right for you or if you should use other methods."
  },
  {
    question: "Is this hard to understand?",
    answer: "No. We’ve stripped away the complex jargon. It is written in plain English with simple diagrams."
  },
  {
    question: "What if I don’t like it?",
    answer: "We offer a 7-day 'Clarity or Refund' guarantee. If you don't feel more confident after reading it, just email us for a full refund."
  }
];

export default function BookSalesPage() {
  const bookCoverImage = PlaceHolderImages.find(p => p.id === 'book-cover-en');
  const purchaseUrl = "/purchase?plan=book_37_en";

  return (
    <div className="bg-[#F6F7FB] text-[#0B1220] font-sans">
      
      {/* TOP BAR */}
      <nav className="bg-[#0B1220] text-white py-4 sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-[#D4AF37]">MORTGAGE CUTTER</Link>
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
            <span>Instant PDF Download</span>
            <span className="h-3 w-px bg-white/20"></span>
            <span>Secure Checkout</span>
            <span className="h-3 w-px bg-white/20"></span>
            <span>7-Day Guarantee</span>
          </div>
          <Link href="#" className="text-sm font-medium hover:text-[#D4AF37] transition-colors">Support</Link>
        </div>
      </nav>

      {/* SECTION 1 — HERO */}
      <section className="bg-[#0B1220] text-white pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              How Ordinary Homeowners Escape the 30-Year Mortgage Trap… <span className="text-[#D4AF37]">And Take Back Control of Their Money Faster</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Mortgage Cutter shows you the simple, bank-mechanics-based strategy to reduce interest drain and build a payoff plan — without earning more income, taking crazy risks, or relying on confusing “banker math.”
            </p>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
                <span>Built for Canada + USA</span>
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]"></span>
                <span>Simple Explanations</span>
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]"></span>
                <span>Actionable Steps</span>
              </div>
              
              <div className="w-full max-w-md">
                {bookCoverImage && (
                  <div className="relative mb-10">
                    <Image 
                      src={bookCoverImage.imageUrl} 
                      alt="Mortgage Cutter PDF Book Cover" 
                      width={320} 
                      height={480} 
                      className="rounded-lg shadow-2xl mx-auto"
                      data-ai-hint={bookCoverImage.imageHint}
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <Button asChild size="lg" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xl font-bold py-8 rounded-xl shadow-xl transition-all">
                    <Link href={purchaseUrl}>
                      Get Instant Access — $37
                    </Link>
                  </Button>
                  <div className="text-sm text-gray-400">
                    <p>Download the PDF immediately after checkout.</p>
                    <p className="mt-1 font-medium text-white/80 italic">No subscription. One-time purchase. Yours forever.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TRUST STRIP */}
      <section className="bg-[#D4AF37] py-6 shadow-lg relative z-10 -mt-8 mx-4 md:mx-auto max-w-5xl rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center text-center text-[#0B1220]">
            <div className="flex flex-col items-center gap-1 font-bold text-xs uppercase tracking-tighter">
              <Zap className="h-5 w-5 mb-1" />
              <span>Instant PDF Access</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-black/10 hidden md:flex font-bold text-xs uppercase tracking-tighter">
              <BarChart className="h-5 w-5 mb-1" />
              <span>Step-by-step plan</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-black/10 font-bold text-xs uppercase tracking-tighter">
              <ShieldCheck className="h-5 w-5 mb-1" />
              <span>Works for Canada + USA</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-black/10 hidden md:flex font-bold text-xs uppercase tracking-tighter">
              <Users className="h-5 w-5 mb-1" />
              <span>Plain-English</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-black/10 font-bold text-xs uppercase tracking-tighter">
              <Award className="h-5 w-5 mb-1" />
              <span>7-Day clarity guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE PROBLEM */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ever feel like you keep paying… but the balance barely moves?</h2>
          <div className="text-lg md:text-xl text-gray-600 space-y-6 leading-relaxed">
            <p>You’re not alone.</p>
            <p>Most homeowners are trapped by a system optimized for one thing: <strong className="text-[#0B1220]">MAXIMUM interest collected over decades.</strong></p>
            <div className="bg-[#F6F7FB] p-8 rounded-2xl border-l-4 border-[#D4AF37] text-left mt-8">
              <p className="font-bold text-[#0B1220] mb-4">That’s why:</p>
              <ul className="space-y-4">
                <li className="flex gap-3"><XCircle className="h-6 w-6 text-red-500 shrink-0" /> <span>Paying <strong className="text-black">“a little extra”</strong> often feels pointless</span></li>
                <li className="flex gap-3"><XCircle className="h-6 w-6 text-red-500 shrink-0" /> <span>Refinancing can simply <strong className="text-black">reset the trap</strong></span></li>
                <li className="flex gap-3"><XCircle className="h-6 w-6 text-red-500 shrink-0" /> <span>And banks rarely explain <strong className="text-black">what actually moves the needle</strong></span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — THE BIG REFRAME */}
      <section className="py-24 bg-[#F6F7FB]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-4">Here’s the shift</h2>
          <div className="space-y-6">
            <p className="text-3xl md:text-5xl font-extrabold tracking-tight">This isn’t about willpower.<br/>It’s about <span className="underline decoration-[#D4AF37] decoration-4 underline-offset-8">STRUCTURE.</span></p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed pt-4">
              When you understand how interest is calculated and how cash flow timing works, you can build a payoff plan that attacks the mortgage more efficiently — <strong>while staying safe and liquid.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — INTRODUCE PRODUCT */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Introducing: Mortgage Cutter (PDF) — $37</h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>This is the plain-English playbook for homeowners who want clarity, control, and a smarter plan.</p>
                <p>No jargon. No hype. Just the mechanics, the mindset shift, and the steps.</p>
              </div>
              <div className="mt-8 space-y-4">
                <p className="font-bold text-[#0B1220]">Inside you’ll learn:</p>
                <ul className="space-y-3">
                  {[
                    "Why mortgages feel impossible to escape (and the exact reason)",
                    "The hidden math banks rely on (explained simply)",
                    "The safe way to compare mortgage vs HELOC strategies",
                    "A step-by-step plan to design YOUR payoff roadmap",
                    "The mistakes that cost homeowners the most (and how to avoid them)"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle className="h-5 w-5 text-[#16A34A] shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-center">
               {bookCoverImage && (
                  <div className="bg-[#0B1220] p-8 rounded-3xl shadow-2xl border border-white/10">
                    <Image 
                      src={bookCoverImage.imageUrl} 
                      alt="Mortgage Cutter PDF Bundle" 
                      width={300} 
                      height={450} 
                      className="rounded-lg shadow-xl"
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — VALUE STACK */}
      <section className="py-24 bg-[#F6F7FB]">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-4 border-[#D4AF37] shadow-2xl overflow-hidden">
            <CardHeader className="bg-[#0B1220] text-white text-center py-10">
              <CardTitle className="text-3xl font-bold">What’s Included in Your Order</CardTitle>
              <CardDescription className="text-gray-400 text-lg">Remove the overwhelm and know exactly what to do next.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <ul className="space-y-6">
                <li className="flex justify-between items-center border-b pb-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-[#0B1220] text-white flex items-center justify-center font-bold">1</div>
                    <span className="text-lg font-bold">Mortgage Cutter PDF (Full Book)</span>
                  </div>
                  <span className="text-gray-400 font-medium">Value: $97</span>
                </li>
                {[
                  { name: "Bonus #1: The 5-Year Payoff Calculator Guide", val: "$47" },
                  { name: "Bonus #2: HELOC Bank Call Script & Checklist", val: "$27" },
                  { name: "Bonus #3: HELOC vs Mortgage Cheat Sheet", val: "$27" },
                  { name: "Bonus #4: Credit Tune-Up Checklist", val: "$37" },
                  { name: "Bonus #5: First 90 Days Action Plan", val: "$27" }
                ].map((bonus, i) => (
                  <li key={i} className="flex justify-between items-center border-b pb-4">
                    <div className="flex gap-4 items-center">
                      <div className="h-10 w-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">{i+2}</div>
                      <div>
                        <span className="text-lg font-bold block">{bonus.name}</span>
                        <span className="text-xs text-[#16A34A] font-bold uppercase tracking-wider">Included Free</span>
                      </div>
                    </div>
                    <span className="text-gray-400 font-medium">Value: {bonus.val}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-12 bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                <p className="text-xl text-gray-500 font-medium">Total Real-World Value: <span className="line-through">$262+</span></p>
                <p className="text-4xl font-extrabold text-[#0B1220] mt-2">Get Everything Today for $37</p>
                <Button asChild size="lg" className="w-full mt-8 bg-[#16A34A] hover:bg-[#15803D] text-xl font-bold py-8 rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
                  <Link href={purchaseUrl}>Yes! Give Me Instant Access Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 7 — TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#0B1220]">Real Feedback from Early Readers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="bg-[#F6F7FB] border-none shadow-md p-6 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, star) => <Star key={star} className="h-4 w-4 fill-current" />)}
                  </div>
                  <blockquote className="text-lg italic text-gray-700 leading-relaxed">“{t.quote}”</blockquote>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="font-bold text-[#0B1220]">{t.name}</p>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{t.city}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — GUARANTEE */}
      <section className="py-24 bg-[#F6F7FB]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Card className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl border-4 border-[#D4AF37]">
            <div className="flex flex-col items-center gap-6">
              <Award className="h-20 w-20 text-[#D4AF37]" />
              <h2 className="text-3xl md:text-4xl font-extrabold">7-Day “Clarity or Refund” Guarantee</h2>
              <div className="text-lg text-gray-600 leading-relaxed space-y-4">
                <p>Read the PDF. Apply the logic to your own mortgage situation.</p>
                <p>If you don’t feel significantly clearer and more confident about your next steps, email us within 7 days and we’ll refund your $37 immediately.</p>
                <p className="font-bold text-[#0B1220]">No forms. No stress. No arguing.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 11 — FINAL CTA */}
      <section className="py-24 bg-[#0B1220] text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Get Mortgage Cutter (PDF) — $37</h2>
          <Button asChild size="lg" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-2xl font-bold py-10 rounded-xl shadow-2xl transition-transform hover:scale-[1.02]">
            <Link href={purchaseUrl}>Download the PDF Now — $37</Link>
          </Button>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1"><Lock className="h-4 w-4" /> Instant access after checkout</span>
            <span className="hidden sm:inline h-1 w-1 rounded-full bg-gray-700"></span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> One-time purchase</span>
          </div>
        </div>
      </section>

      {/* SECTION 12 — FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl px-6 bg-[#F6F7FB] border-none">
                <AccordionTrigger className="text-left text-lg font-bold py-6 hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B1220] text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="font-bold text-2xl text-[#D4AF37]">MORTGAGE CUTTER</div>
            <p className="text-xs text-gray-500 italic">
              Disclaimer: Educational content only. Not financial, legal, or tax advice. Mortgage payoff results vary based on individual circumstances and bank terms.
            </p>
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Mortgage Cutter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
