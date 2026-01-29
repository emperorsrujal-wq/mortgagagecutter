
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
  FileText, 
  Zap, 
  ShieldCheck, 
  BarChart, 
  Users, 
  Clock, 
  HelpCircle 
} from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Mortgage Cutter | Escape the 30-Year Mortgage Trap',
  description: 'A simple, bank-mechanics-based strategy to reduce interest drain and build a faster payoff plan for homeowners in Canada + USA.',
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
    answer: "It is written specifically for both Canadian and U.S. homeowners. The core financial mechanics apply to both markets, though specific product names may vary by bank."
  },
  {
    question: "Does this guarantee I’ll pay off in 5 years?",
    answer: "No. This is an educational strategy guide. Your results depend entirely on your specific numbers, interest rates, and your own discipline in following the plan."
  },
  {
    question: "Do I need a HELOC?",
    answer: "Not necessarily. The book explains the mechanics of how they work and helps you decide if that specific tool is right for your situation or if you should stick to other strategies."
  },
  {
    question: "Is this hard to understand?",
    answer: "No. We’ve stripped away the complex jargon. It is written in plain English with simple diagrams and step-by-step instructions."
  },
  {
    question: "What if I don’t like it?",
    answer: "We offer a 7-day 'Clarity or Refund' guarantee. If you don't feel more confident about your next steps after reading it, just email us for a full refund."
  }
];

export default function BookSalesPage() {
  const bookCoverImage = PlaceHolderImages.find(p => p.id === 'book-cover-en');
  const purchaseUrl = "/purchase?plan=book_37_en";

  return (
    <div className="bg-[#F6F7FB] text-[#0B1220] font-sans overflow-x-hidden">
      
      {/* TOP BAR */}
      <nav className="bg-[#0B1220] text-white py-4 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="font-bold tracking-tighter text-xl text-[#D4AF37]">MORTGAGE CUTTER</Link>
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-gray-400">
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
              <div className="flex items-center gap-2 text-sm font-semibold text-[#D4AF37] uppercase tracking-widest">
                <span>Built for Canada + USA</span>
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]"></span>
                <span>Simple Explanations</span>
                <span className="h-1 w-1 rounded-full bg-[#D4AF37]"></span>
                <span>Actionable Steps</span>
              </div>
              
              <div className="w-full max-w-md">
                {bookCoverImage && (
                  <div className="relative group perspective-1000 mb-10">
                    <Image 
                      src={bookCoverImage.imageUrl} 
                      alt="Mortgage Cutter PDF Book Cover" 
                      width={320} 
                      height={480} 
                      className="rounded-lg shadow-2xl mx-auto transform transition-transform duration-500 group-hover:rotate-y-12"
                      data-ai-hint={bookCoverImage.imageHint}
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <Button asChild size="lg" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xl font-bold py-8 rounded-xl shadow-xl shadow-green-900/20 transition-all active:scale-[0.98]">
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
            <div className="flex flex-col items-center gap-1">
              <Zap className="h-5 w-5" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">Instant PDF Access</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-black/10 hidden md:flex">
              <BarChart className="h-5 w-5" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">Step-by-step plan</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-black/10">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">Works for Canada + USA</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-black/10 hidden md:flex">
              <Users className="h-5 w-5" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">Plain-English</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-black/10">
              <Award className="h-5 w-5" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-tighter">7-Day clarity guarantee</span>
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

      {/* SECTION 6 — WHAT YOU GET (VALUE STACK) */}
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
                <li className="flex justify-between items-center border-b pb-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">2</div>
                    <div>
                      <span className="text-lg font-bold block">Bonus #1: The 5-Year Payoff Calculator Guide</span>
                      <span className="text-xs text-[#16A34A] font-bold uppercase tracking-wider">Included Free</span>
                    </div>
                  </div>
                  <span className="text-gray-400 font-medium">Value: $47</span>
                </li>
                <li className="flex justify-between items-center border-b pb-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">3</div>
                    <div>
                      <span className="text-lg font-bold block">Bonus #2: HELOC Bank Call Script & Checklist</span>
                      <span className="text-xs text-[#16A34A] font-bold uppercase tracking-wider">Included Free</span>
                    </div>
                  </div>
                  <span className="text-gray-400 font-medium">Value: $27</span>
                </li>
                <li className="flex justify-between items-center border-b pb-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">4</div>
                    <div>
                      <span className="text-lg font-bold block">Bonus #3: HELOC vs Mortgage Cheat Sheet</span>
                      <span className="text-xs text-[#16A34A] font-bold uppercase tracking-wider">Included Free</span>
                    </div>
                  </div>
                  <span className="text-gray-400 font-medium">Value: $27</span>
                </li>
                <li className="flex justify-between items-center border-b pb-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">5</div>
                    <div>
                      <span className="text-lg font-bold block">Bonus #4: Credit Tune-Up Checklist</span>
                      <span className="text-xs text-[#16A34A] font-bold uppercase tracking-wider">Included Free</span>
                    </div>
                  </div>
                  <span className="text-gray-400 font-medium">Value: $37</span>
                </li>
                <li className="flex justify-between items-center pb-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold">6</div>
                    <div>
                      <span className="text-lg font-bold block">Bonus #5: First 90 Days Action Plan</span>
                      <span className="text-xs text-[#16A34A] font-bold uppercase tracking-wider">Included Free</span>
                    </div>
                  </div>
                  <span className="text-gray-400 font-medium">Value: $27</span>
                </li>
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
              <Card key={i} className="bg-[#F6F7FB] border-none shadow-md hover:shadow-xl transition-shadow p-6 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, star) => <span key={star} className="text-xl">★</span>)}
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

      {/* SECTION 8 — CONTENT PREVIEW */}
      <section className="py-24 bg-[#0B1220] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">A Peek Inside the PDF</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              { title: "Part 1: The Mortgage Trap", desc: "The exact mechanics of how standard amortization front-loads your interest." },
              { title: "Part 2: How Banks Think", desc: "The strategies lenders use to keep you paying longer, explained simply." },
              { title: "Part 3: The HELOC Option", desc: "When it helps, when it actually hurts, and how to tell the difference." },
              { title: "Part 4: The Payoff Blueprint", desc: "Your step-by-step master plan to design your own debt-free roadmap." },
              { title: "Part 5: The 90-Day Kickstart", desc: "A practical guide to implementing these changes safely and effectively." },
              { title: "Bonus: The Checklists", desc: "Ready-to-use scripts and lists so you never feel overwhelmed." }
            ].map((part, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-4">
                <div className="h-8 w-8 rounded-full bg-[#D4AF37] text-[#0B1220] flex items-center justify-center font-bold shrink-0">{i+1}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{part.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{part.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — OBJECTION HANDLING */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-green-50 p-10 rounded-3xl border border-green-100">
              <h3 className="text-2xl font-extrabold text-[#16A34A] mb-6 flex items-center gap-2">
                <CheckCircle /> This is for you if:
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3"><span>•</span> <span>You have a mortgage and want a faster, smarter plan</span></li>
                <li className="flex gap-3"><span>•</span> <span>You want clarity before talking to your banker</span></li>
                <li className="flex gap-3"><span>•</span> <span>You’re tired of vague advice and want real mechanics</span></li>
              </ul>
            </div>
            <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
              <h3 className="text-2xl font-extrabold text-gray-400 mb-6 flex items-center gap-2">
                <XCircle /> NOT for you if:
              </h3>
              <ul className="space-y-4 text-gray-500">
                <li className="flex gap-3"><span>•</span> <span>You want a guaranteed “5-year promise” (this is education + strategy)</span></li>
                <li className="flex gap-3"><span>•</span> <span>You’re looking for a risky get-rich-quick trick</span></li>
                <li className="flex gap-3"><span>•</span> <span>You aren't willing to build and follow a real plan</span></li>
              </ul>
            </div>
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
                <p>Read the PDF. Look at the numbers. Apply the logic to your own mortgage situation.</p>
                <p>If you don’t feel significantly clearer and more confident about your next steps, email us within 7 days and we’ll refund your $37 immediately.</p>
                <p className="font-bold text-[#0B1220]">No forms. No stress. No arguing.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 11 — PRIMARY CTA (REPEAT) */}
      <section className="py-24 bg-[#0B1220] text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Get Mortgage Cutter (PDF) — $37</h2>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            The small investment you make today could be the catalyst that saves you thousands in interest and years off your mortgage debt.
          </p>
          <div className="space-y-6">
            <Button asChild size="lg" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-2xl font-bold py-10 rounded-xl shadow-2xl transition-transform hover:scale-[1.02]">
              <Link href={purchaseUrl}>Download the PDF Now — $37</Link>
            </Button>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1"><Lock className="h-4 w-4" /> Instant access after checkout</span>
              <span className="hidden sm:inline h-1 w-1 rounded-full bg-gray-700"></span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> One-time purchase</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12 — FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl px-6 bg-[#F6F7FB] border-none data-[state=open]:shadow-lg transition-all">
                <AccordionTrigger className="text-left text-lg font-bold py-6 hover:no-underline hover:text-[#D4AF37]">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg pb-6 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* SECTION 13 — FOOTER */}
      <footer className="bg-[#0B1220] text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="font-bold tracking-tighter text-2xl text-[#D4AF37]">MORTGAGE CUTTER</div>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Contact Support</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed italic">
              Disclaimer: Educational content only. This guide is for illustrative purposes and does not constitute financial, legal, or tax advice. Mortgage payoff results vary based on individual circumstances and bank terms.
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
