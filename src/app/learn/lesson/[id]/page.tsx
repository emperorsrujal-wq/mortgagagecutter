
'use client';
import React, { use, useState, useEffect } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { 
  InterestCalc, 
  AmortViz, 
  QualificationCalc, 
  ScriptGenerator, 
  BankRateChart, 
  ContractSimulator, 
  AutomationSimulator, 
  WealthSimulator, 
  LadderVisual, 
  HyperdriveSim, 
  BiWeeklyCalc, 
  OffsetVisual,
  TruthCalculator
} from '@/components/course/Calculators';
import { 
  CourseCard, 
  TaskItem, 
  Quiz,
  CaseStudy,
  StatBox,
  InfoBox
} from '@/components/course/UIComponents';
import { TranslatedText } from '@/components/course/TranslatedText';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home as HomeIcon, 
  CheckCircle2, 
  Rocket, 
  Zap, 
  ShieldCheck,
  CreditCard,
  Activity,
  TrendingUp,
  Flame,
  MessageSquare,
  Target,
  BarChart,
  Lock,
  Star,
  Award,
  Trophy,
  History,
  Scale,
  Sparkles,
  TrendingDown,
  SearchCode,
  RefreshCcw,
  Layers,
  Globe,
  Play,
  ZapOff,
  BookOpen,
  DollarSign,
  Clock,
  ArrowUpRight,
  Gavel,
  ScrollText,
  ListChecks,
  ArrowRight,
  Timer,
  AlertCircle,
  UserCircle2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUser } from '@/firebase';

function ProgressBar({ current }: { current: number }) {
  const total = 8;
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8ECF2]">
      <div className="h-1 bg-slate-100 w-full">
        <div 
          className="h-full bg-[#2563EB] transition-all duration-500" 
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <div className="max-w-[720px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/learn" className="flex items-center gap-2 text-[#5A6175] font-black text-sm hover:text-blue-600 transition-colors">
          <HomeIcon className="h-4 w-4" />
          <span className="hidden sm:inline uppercase tracking-widest"><TranslatedText>Course Hub</TranslatedText></span>
        </Link>
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
          {current === 0 ? <TranslatedText>Phase 0: Awakening</TranslatedText> : <><TranslatedText>Phase</TranslatedText> {current} <TranslatedText>of</TranslatedText> {total}</>}
        </div>
        <div className="w-20" />
      </div>
    </div>
  );
}

function EpiphanyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 bg-blue-600 text-white rounded-[40px] shadow-2xl relative overflow-hidden group border-4 border-white/10">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
        <Sparkles className="h-32 w-32" />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-black shadow-lg">!</div>
          <span className="font-black text-xs uppercase tracking-[0.3em] text-blue-200">The Core Epiphany</span>
        </div>
        <div className="text-xl md:text-2xl font-bold leading-relaxed italic">
          {children}
        </div>
      </div>
    </div>
  );
}

function LessonContent({ id }: { id: number }) {
  const { country, completeLesson } = useCourse();
  const { user } = useUser();
  const meta = lessonMeta.find(l => l.id === id);
  const router = useRouter();

  if (!meta) return <div className="p-20 text-center">Lesson not found</div>;

  const isPrivileged = user?.email === 'emperorsrujal@gmail.com';
  const isLocked = id >= 4 && !isPrivileged;

  const nextLesson = () => {
    completeLesson(id);
    if (id < 8) router.push(`/learn/lesson/${id + 1}`);
    else router.push('/members/chunker');
  };

  const prevLesson = () => {
    if (id > 0) router.push(`/learn/lesson/${id - 1}`);
    else router.push('/learn');
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-32">
      <ProgressBar current={id} />
      
      <div className="max-w-[800px] mx-auto px-4 py-16 space-y-24">
        
        {/* PHASE 0: THE AWAKENING */}
        {id === 0 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
             <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10">
                <Flame className="h-4 w-4 text-orange-500" />
                <TranslatedText>Level 00 — The Financial Awakening</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The 2x Cost Trap:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>You Are Paying Twice.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium italic">
                <TranslatedText>"The banker never highlighted the one number that should have stopped you cold: The Total Amount You Will Actually Pay."</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Invisible Contract</TranslatedText></h2>
              </div>
              <div className="space-y-8 text-xl text-slate-600 leading-relaxed font-medium">
                <p>
                  <TranslatedText>{`Somewhere in your home is a piece of paper that represents your proudest financial moment. But inside that fine print, the math is working against you. On a typical $400,000 home purchase in ${country.name}, by the time you make your final payment, you will have handed the bank approximately $909,000.`}</TranslatedText>
                </p>
                <p className="text-blue-600 font-black">
                  <TranslatedText>The extra $509,000? Not equity. Not your future. Pure bank profit.</TranslatedText>
                </p>
              </div>

              <div className="bg-slate-900 rounded-[48px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Landmark className="h-64 w-64 text-blue-400" /></div>
                <div className="text-center space-y-2 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-blue-400"><TranslatedText>The Price of Silence</TranslatedText></h3>
                  <p className="text-slate-400 font-bold"><TranslatedText>Assumes a 30-year term at 6.5% interest</TranslatedText></p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {[
                    { label: "Purchase Price", val: "$400,000", sub: "The Sticker Price" },
                    { label: "Total Paid", val: "$909,000", sub: "The Real Price", highlight: true },
                    { label: "Bank Profit", val: "$509,000", sub: "Interest Captured", danger: true }
                  ].map((s, i) => (
                    <div key={i} className={cn("p-8 rounded-3xl text-center space-y-2 border border-white/10", s.highlight ? "bg-blue-600 border-none shadow-xl" : "bg-white/5")}>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-60"><TranslatedText>{s.label}</TranslatedText></p>
                       <p className={cn("text-3xl font-black", s.danger ? "text-red-400" : "text-white")}>{s.val}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase"><TranslatedText>{s.sub}</TranslatedText></p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-slate-400 text-sm italic font-medium">
                  <TranslatedText>In every single case, the interest you pay is equal to or greater than the original cost of the home.</TranslatedText>
                </p>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Three Destinies</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium">
                <TranslatedText>Abstract numbers lose impact. Let's look at three families making choices right now that will define their next 30 years.</TranslatedText>
              </p>

              <div className="space-y-8">
                <CaseStudy 
                  name="The Patels (Suburban Homeowners)"
                  savings="$190,000 Saved"
                  timeline="Mortgage-Free at 51"
                  quote="We were on track to finish at 63. Using the Chunker logic, we reclaim 12 years of our life and keep $190k in interest."
                />
                <CaseStudy 
                  name="The Tremblays (Montreal Condo)"
                  savings="$220,000 Saved"
                  timeline="Mortgage-Free at 52"
                  quote="Our condo will cost us $1M under standard terms. By age 52, we will own it outright and be ready for full-scale investing."
                />
                <CaseStudy 
                  name="The Garcias (LA Property)"
                  savings="$500,000+ Saved"
                  timeline="Cut 14 Years Off"
                  quote="A $780k home was going to cost us $1.5M. We aren't just saving money; we are saving our children's future."
                />
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Renting Myth</TranslatedText></h2>
              </div>
              <CourseCard className="border-l-[12px] border-l-amber-500 shadow-2xl p-12 md:p-16 bg-white">
                 <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`You've heard it a hundred times: "Renting is throwing money away." But the framing obscures a bigger lie. Traditional homeowners "throw away" an average of 128% of their home's price in interest payments.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`This course is not arguing against homeownership. It is arguing for the REAL cost of it—and then teaching you how to cut that cost in half while still building equity.`}</TranslatedText>
                    </p>
                  </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`You buy your home twice. Once for you (Principal), and once for the bank (Interest). The Mortgage Cutter method is about legally opting out of the second purchase.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Face Your Truth</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the 'Truth Calculator' below to see your current "Freedom Date" and the monthly interest bite you are currently suffering in ${country.name}.`}</TranslatedText>
              </p>
              <TruthCalculator />
              <Quiz 
                question="Why is the 'Sticker Price' of your home a distraction?"
                options={[
                  "Because property taxes are even more expensive",
                  "Because the bank collects nearly double that amount in interest profit",
                  "Because houses lose value every single year",
                  "Because you never actually own the land"
                ]}
                correctAnswer={1}
                explanation="Lenders market 'affordable monthly payments' because they don't want you to see the Total Amount Paid, which often exceeds 200% of the home's value."
              />
            </section>
          </div>
        )}

        {/* LESSON 1: THE NATURE OF THE AMORTIZED LOAN */}
        {id === 1 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-100">
                <BookOpen className="h-4 w-4" />
                <TranslatedText>Mastery Level: 01 — Structural Awareness</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Amortized Path:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>The Invisible Rent Strategy.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Before you can beat the bank's math, you must understand the rules of the game they built in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Lego Loan (ELI14)</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p><TranslatedText>Imagine you want to buy a giant $100 Lego set from a friend, but you only have $10. You go to a "Banker Friend" and borrow the other $90.</TranslatedText></p>
                  <p><TranslatedText>They say: "Sure! Just pay me $10 a month for 12 months." You think, "Great! After 10 months, I've paid back the $100!"</TranslatedText></p>
                  <p className="text-blue-600 font-black italic"><TranslatedText>But here is the structural catch that everyone misses...</TranslatedText></p>
                  <p><TranslatedText>The Banker Friend says the first $8 of every $10 payment is a "rental fee" for letting you use their money. Only $2 goes toward actually owning the Legos. In the mortgage world, this is called "Amortization," and it ensures the bank gets paid before you do.</TranslatedText></p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Layers className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Math Reality</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">80 / 20</h3>
                    <p className="text-lg font-bold text-slate-400">Interest vs. Principal Ratio</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "Principal (The Stuff)", desc: "This is the actual cost of your house. Every dollar of principal you pay is a dollar of the house you finally 'own'.", icon: <HomeIcon className="h-5 w-5 text-blue-500" /> },
                  { term: "Interest (The Rent)", desc: "This is the fee the bank charges you. In Lesson 1, we call this 'Invisible Rent' because it disappears from your net worth forever.", icon: <DollarSign className="h-5 w-5 text-red-500" /> },
                  { term: "Amortization (The Kill)", desc: `From the Latin 'amortis' (to kill). It's the process of 'killing' your debt over ${country.amortYears} years.`, icon: <Clock className="h-5 w-5 text-emerald-500" /> },
                  { term: "Front-Loading (The Trap)", desc: "The bank's strategy to make you pay almost all your interest in the first 10-15 years, ensuring their profit is safe even if you move.", icon: <TrendingUp className="h-5 w-5 text-amber-500" /> },
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">{t.icon}</div>
                      <h4 className="font-black text-lg text-slate-900"><TranslatedText>{t.term}</TranslatedText></h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed"><TranslatedText>{t.desc}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: The 15-Year Treadmill</TranslatedText></h2>
              </div>
              <CourseCard className="border-l-[12px] border-l-red-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12"><Activity className="h-96 w-96" /></div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p><TranslatedText>{`Most homeowners in ${country.name} spend the first decade of their lives on a 'Financial Treadmill'. You are working hard, making big monthly payments, but your actual ownership of the house barely moves.`}</TranslatedText></p>
                    <p><TranslatedText>{`Because the system is 'Front-Loaded', if you sell your house after 7 years, you might find that you still owe almost exactly what you borrowed. You've essentially been a 'tenant' to the bank for 7 years, paying for repairs and property taxes while the bank kept the 'rent' (interest).`}</TranslatedText></p>
                  </div>
                </div>
              </CourseCard>
              <EpiphanyBox>
                <TranslatedText>{`The "Amortization Table" is not a plan for freedom; it is a mathematical harvesting machine designed to capture the first 15 years of your labor as pure interest profit for the bank.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: The Math Audit</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the 'Evidence Locker' below to see exactly how much 'Invisible Rent' you are currently paying to your lender every single hour of every single day.`}</TranslatedText>
              </p>
              <InterestCalc />
              <div className="space-y-8">
                <h3 className="text-3xl font-fraunces font-black text-center text-slate-900"><TranslatedText>The Equity Visualization</TranslatedText></h3>
                <p className="text-lg text-slate-500 text-center font-medium"><TranslatedText>Slide the timer to see how slowly your equity grows compared to the bank's interest profit in the early years.</TranslatedText></p>
                <AmortViz />
              </div>
              <Quiz 
                question="In the first 5 years of a typical mortgage, where does the majority of your payment go?"
                options={[
                  "Toward owning your house (Principal)",
                  "Toward the 'Rental Fee' (Interest)",
                  "Toward your local property taxes",
                  "Toward a secret savings account the bank keeps for you"
                ]}
                correctAnswer={1}
                explanation="Lenders use a 'Front-Loaded' schedule. During the first decade, up to 80% of your monthly payment is captured as interest profit, leaving very little to reduce the actual cost of the home."
              />
            </section>
          </div>
        )}

        {/* LESSON 2: THE SECRET SCORECARD */}
        {id === 2 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-200">
                <Lock className="h-4 w-4" />
                <TranslatedText>Mastery Level: 02 — Qualification & Power</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Secret Scorecard:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Mastering the Gatekeeper's Math.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Lenders in ${country.name} have a secret 'Report Card' they use to decide who gets the high-performance tools. We're going to learn how to ace it.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Heavy Backpack Test (ELI14)</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you want to borrow your friend's really fast racing bike (The HELOC). Your friend says, "I'll let you use it, but first I need to know if you're strong enough to pedal it up a steep hill without crashing."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>To test you, they put a heavy backpack on you and ask you to run. The weight in the backpack represents your other debts (car loans, credit cards, taxes). If the backpack is too heavy for your body weight (income), your friend won't give you the bike because they're afraid you'll fall.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>In the bank's world, this is the "Stress Test."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>Lenders don't care how much money you make; they care about your "Net Strength." They use a secret report card to decide if you are a "Low-Risk Strategist" or a "High-Risk Debtor."</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Target className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Gatekeeper's Metric</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">DTI</h3>
                    <p className="text-lg font-bold text-slate-400">Debt-to-Income Capacity</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "DTI (Debt-to-Income)", desc: "Your 'Backpack Weight'. It is the percentage of your monthly income that goes toward paying back debts. Lenders want this under 43%.", icon: <Scale className="h-5 w-5 text-blue-500" /> },
                  { term: "LTV (Loan-to-Value)", desc: "How much of the house you own. Most high-performance tools require you to own at least 20% of the home (80% LTV).", icon: <HomeIcon className="h-5 w-5 text-emerald-500" /> },
                  { term: "The Stress Test", desc: `A mandatory check where ${country.name} lenders pretend your interest rate is much higher to see if you can still survive.`, icon: <Activity className="h-5 w-5 text-red-500" /> },
                  { term: "Tier 1 Credit", desc: "Your 'Trust Rating'. A score (usually above 740) that tells the bank you are an expert at managing other people's money.", icon: <ShieldCheck className="h-5 w-5 text-amber-500" /> },
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">{t.icon}</div>
                      <h4 className="font-black text-lg text-slate-900"><TranslatedText>{t.term}</TranslatedText></h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed"><TranslatedText>{t.desc}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: Moving from Debtor to Strategist</TranslatedText></h2>
              </div>
              
              <CourseCard className="border-l-[12px] border-l-blue-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Lock className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Lenders in ${country.name} give two different types of products. To the "Uninformed Debtor," they give the 30-year fixed cage—because it's the most profitable for the bank.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`But to the "Strategic Owner," they give the flexible, interest-canceling tools like first-lien HELOCs and Offset accounts. Why? Because they trust the Strategist to manage the capital without failing the Stress Test.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`You don't apply for a mortgage; you audition for a partnership. When your Scorecard is optimized, the bank stops being your landlord and starts being your capital supplier.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Run Your Scorecard</TranslatedText></h2>
              </div>
              
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the "Lender Probability" simulator below. It uses ${country.name}'s specific regulatory limits to show you how a Senior Loan Officer sees your financial profile.`}</TranslatedText>
              </p>

              <QualificationCalc />

              <Quiz 
                question="Why does the bank care about your DTI (Debt-to-Income) ratio?"
                options={[
                  "They want to know if you are a nice person",
                  "To see if you have enough 'Strength' to handle more debt weight",
                  "It's a secret way to charge you more fees",
                  "Because they are required to report your hobbies to the government"
                ]}
                correctAnswer={1}
                explanation={`In ${country.name}, DTI is the measure of your financial bandwidth. If your "backpack" of other debts is too heavy, the bank won't trust you with a high-performance revolving credit line.`}
              />
            </section>
          </div>
        )}

        {/* LESSON 3: THE STRATEGIC ARSENAL */}
        {id === 3 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-purple-200">
                <Zap className="h-4 w-4" />
                <TranslatedText>Mastery Level: 03 — Tool Acquisition</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Strategic Arsenal:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Choosing the Right Tool.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`In the top 1%, the tools are different. Today, you learn to swap your "Cage" for a "Swiss Army Wallet" in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Swiss Army Wallet (ELI14)</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you're going on a long hike. A traditional mortgage is like a heavy bag that locks once you put something in it. If you need your money back for an emergency, you have to find a locksmith, pay a huge fee, and wait weeks.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>A "Strategic Arsenal" tool (like a first-lien HELOC) is like a high-tech "Swiss Army Wallet." It's a bag that stays open. You put your money in to make the load lighter (reducing interest), but you can reach in and take it out whenever you want for life's expenses.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>This is the shift from "Frozen Equity" to "Liquid Power."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>We aren't looking for a "loan." we are looking for a structural environment where your paycheck hits the principal balance on Day 1, neutralizing the bank's daily math while keeping that cash 100% accessible.</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Zap className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Tactical Advantage</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">LIQUID</h3>
                    <p className="text-lg font-bold text-slate-400">Zero Separation Between Income & Debt</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "First-Lien Position", desc: "This means the strategic line is your ONLY loan. It is not a 'second mortgage'; it is the primary engine sitting in the first position on your title.", icon: <Award className="h-5 w-5 text-blue-500" /> },
                  { term: "Revolving Credit", desc: "Unlike a mortgage that only goes down, a revolving balance can go down (as you pay) and back up (as you spend) without a new application.", icon: <RefreshCcw className="h-5 w-5 text-emerald-500" /> },
                  { term: "Transactionality", desc: "The ability to pay bills, write checks, and use a debit card directly from the loan account. This is essential for the 'Velocity' logic.", icon: <CreditCard className="h-5 w-5 text-purple-500" /> },
                  { term: "Readvanceable", desc: `A standard in ${country.name} (like the ${country.products[0].name}) where every dollar of principal paid instantly increases your borrowing limit.`, icon: <ArrowUpRight className="h-5 w-5 text-amber-500" /> },
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">{t.icon}</div>
                      <h4 className="font-black text-lg text-slate-900"><TranslatedText>{t.term}</TranslatedText></h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed"><TranslatedText>{t.desc}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: The Two-Way Street</TranslatedText></h2>
              </div>
              
              <CourseCard className="border-l-[12px] border-l-purple-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <RefreshCcw className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Most homeowners in ${country.name} are forced into a "One-Way Street." Once you send money to the mortgage, it is effectively GONE. If you need it back, the bank makes you beg for a new loan.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`By acquiring a Strategic Arsenal tool, we turn the mortgage into a "Two-Way Street." Your income flows IN to kill interest, and your expenses flow OUT to pay for life. You never lose access to your cash, but the bank loses its ability to charge you interest on the days your money is sitting there.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`You don't necessarily need a lower interest rate to win. You need an "Open Valve" that allows your entire net worth to work against the principal balance 24 hours a day.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: The Lender Audit</TranslatedText></h2>
              </div>
              
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Lenders in ${country.name} won't volunteer these tools. They are too profitable for YOU and not profitable enough for THEM. You must use the script and checklist below to identify the right partner.`}</TranslatedText>
              </p>

              <div className="space-y-8">
                <h3 className="text-3xl font-fraunces font-black text-center text-slate-900"><TranslatedText>The Loan Officer Negotiation Script</TranslatedText></h3>
                <ScriptGenerator />
              </div>

              <Quiz 
                question="What is the most important feature of your Strategic Arsenal tool?"
                options={[
                  "The lowest possible fixed interest rate",
                  "A pretty metal credit card",
                  "First-lien position with full transactionality",
                  "A bank branch located within walking distance"
                ]}
                correctAnswer={2}
                explanation={`To execute the Mortgage Cutter strategy, you MUST be able to deposit your entire income directly into the loan and pay your bills from it. This requires a first-position account with 'checking' features.`}
              />
            </section>
          </div>
        )}

        {/* LESSON 4: THE LEGAL LOOPHOLE */}
        {id === 4 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-amber-200">
                <Gavel className="h-4 w-4" />
                <TranslatedText>Mastery Level: 04 — Structural Decoding</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Legal Loophole:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Finding the 'Two-Way' Street.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Lenders love to hide 'Cage' clauses in the fine print. We're going to find the 'Escape Hatch' in your ${country.name} contracts.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Magic Library Card (ELI14)</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you borrowed a book from a library. A traditional mortgage is like a library that says: "You can keep this book for 30 years, but you must pay us $5 every week. If you want to return it early, we will charge you a $500 fee!"</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>The "Legal Loophole" is finding the library that gives you a "Magic Library Card." This card says: "Borrow as many books as you want. Pay us back whenever you have time. If you return them early, we won't charge you a dime—in fact, we'll stop charging you interest the second you bring them back!"</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>This is what we call an "Open Credit Structure."</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><ScrollText className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Contract Secret</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">OPEN</h3>
                    <p className="text-lg font-bold text-slate-400">End of the One-Way Debt</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "TIP (Total Interest %)", desc: `A mandatory disclosure in ${country.name} that shows the total interest you'll pay as a percentage of the loan. Traditional paths often hit 90-110%.`, icon: <SearchCode className="h-5 w-5 text-blue-500" /> },
                  { term: "Prepayment Penalty", desc: "A 'Cage Clause' that charges you for being smart and paying off your debt early. We require zero penalties.", icon: <ShieldAlert className="h-5 w-5 text-red-500" /> },
                  { term: "Draw Period", desc: "The 'Golden Window' (usually 10 years) during which you can put money in and take it out freely without applying again.", icon: <History className="h-5 w-5 text-emerald-500" /> },
                  { term: "Payment Application", desc: "The secret rules in your contract that decide if your money hits the interest or the principal first. We need 'Principal-First' daily benefit.", icon: <ListChecks className="h-5 w-5 text-amber-500" /> },
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">{t.icon}</div>
                      <h4 className="font-black text-lg text-slate-900"><TranslatedText>{t.term}</TranslatedText></h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed"><TranslatedText>{t.desc}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: The Escape Hatch</TranslatedText></h2>
              </div>
              
              <CourseCard className="border-l-[12px] border-l-amber-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Gavel className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`By decoding the contract and finding the "Open Loophole," we flip the script. We find the tools where the law REQUIRES the bank to apply your deposit to the principal balance IMMEDIATELY. This one sentence is the difference between a 30-year sentence and a 7-year sprint.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`The "Loophole" isn't a secret law—it's a structural choice. You are choosing to move your debt from a "Closed Amortized Shell" into an "Open Daily Calculation."`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: The Contract Audit</TranslatedText></h2>
              </div>
              <ContractSimulator />
            </section>
          </div>
        )}

        {/* LESSON 5: THE AUTOMATED HEIST */}
        {id === 5 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-100">
                <RefreshCcw className="h-4 w-4" />
                <TranslatedText>Mastery Level: 05 — Process Automation</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Automated Heist:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Putting the Bank on Autopilot.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`We want your paycheck hitting the principal on Day 1 without you lifting a finger. This is the moment the bank starts working for YOU.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Leaking Bathtub (ELI14)</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine your debt is like a bathtub with a small hole in the bottom. Every day, some water leaks out—that is the "Interest" you pay to the bank.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>If you keep the tub full of water, the pressure is higher and it leaks faster. But if you keep the tub almost empty, it leaks much slower.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>The "Automated Heist" is your water pump.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>It ensures that every time you get a "bucket" of new water (your paycheck), it immediately jumps into the tub to lower the debt balance. This stops the interest leak for as long as possible each month, before you have to pump some back out for bills.</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><RefreshCcw className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Velocity Logic</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">DAY 1</h3>
                    <p className="text-lg font-bold text-slate-400">Income Integration Impact</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "ADB (Average Daily Balance)", desc: "The average amount you owe over 30 days. The bank uses this single number to decide your monthly 'rent' cost.", icon: <BarChart className="h-5 w-5 text-blue-500" /> },
                  { term: "Automatic Sweep", desc: "A bank feature that 'vacuums' money from your checking account into your loan account every night.", icon: <Zap className="h-5 w-5 text-amber-500" /> },
                  { term: "Interest Recalculation", desc: "The magic moment at midnight when the bank checks how much you owe and decides your rent for the next 24 hours.", icon: <History className="h-5 w-5 text-emerald-500" /> },
                  { term: "Velocity", desc: "The speed at which your income hits the principal. Higher velocity means less interest can grow.", icon: <Rocket className="h-5 w-5 text-purple-500" /> },
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">{t.icon}</div>
                      <h4 className="font-black text-lg text-slate-900"><TranslatedText>{t.term}</TranslatedText></h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed"><TranslatedText>{t.desc}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: Speed vs. Rate</TranslatedText></h2>
              </div>
              
              <CourseCard className="border-l-[12px] border-l-blue-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <RefreshCcw className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Most homeowners think the 'Interest Rate' is the most important number. They are wrong. The most important factor is the TIME that the bank is allowed to charge you interest on your money.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`When you automate your income to hit the principal on Day 1, you effectively 'choke' the interest calculation for the rest of the month. Your money isn't just sitting in a checking account doing nothing—it's actively working 24/7 to cancel the bank's profit.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`Your income is your most powerful employee. If it sits in a checking account for 20 days before you pay your mortgage, you are essentially giving the bank an interest-free loan of your labor.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Model Your Velocity</TranslatedText></h2>
              </div>
              
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the "Velocity Simulator" below to see the 'V-Shape' cycle of a healthy strategy. Watch how much interest disappears when you toggle 'Hyperdrive Mode'.`}</TranslatedText>
              </p>

              <AutomationSimulator />

              <div className="p-8 bg-blue-50 border-4 border-dashed border-blue-200 rounded-[40px] text-center space-y-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <RefreshCcw className="h-6 w-6 text-blue-600 animate-spin-slow" />
                </div>
                <p className="text-xl text-blue-900 font-bold leading-relaxed">
                  <TranslatedText>{`💡 STRATEGY HACK: In ${country.name}, set your paycheck direct deposit to hit the loan account directly. Then, set your bills to pay from that same account on the last possible due date. This maximizes the 'Offset Time' your money spends killing interest.`}</TranslatedText>
                </p>
              </div>

              <Quiz 
                question="What is the main goal of the 'Automated Heist' strategy?"
                options={[
                  "To hide your money from the local government",
                  "To minimize the Average Daily Balance (ADB) of your debt",
                  "To earn a higher interest rate on your savings account",
                  "To avoid paying your monthly utilities"
                ]}
                correctAnswer={1}
                explanation={`The strategy is built on velocity. By dumping your income into the debt immediately, you lower the Average Daily Balance that the bank uses to calculate your nightly interest charge.`}
              />
            </section>
          </div>
        )}

        {/* LESSON 6: THE 1% MULTIPLIER */}
        {id === 6 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-100">
                <Trophy className="h-4 w-4" />
                <TranslatedText>Mastery Level: 06 — Portfolio Scaling</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The 1% Multiplier:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Turning Walls into Engines.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Debt reduction was just the beginning. Now we use your home's equity as "Live Capital" to build a multi-property empire in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Monopoly Secret (ELI14)</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you're playing Monopoly. Most players save their money and wait 30 turns before they buy their first "Green House." They think the goal is just to "not owe any money."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>The winners (The 1%) realize that once you own a Green House, you can use its value to borrow enough to buy a "Red Hotel." You aren't "spending" your house; you are "recycling" the energy trapped inside its walls.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>This is "Equity Harvesting."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>A traditional mortgage keeps your equity "Frozen." A Strategic Arsenal tool keeps it "Liquid." As your balance drops using our velocity method, your credit limit expands, giving you the "Dry Powder" to buy your next property without ever opening a savings account.</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Layers className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Recycled Dollar</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">1 = 3</h3>
                    <p className="text-lg font-bold text-slate-400">Homes Owned via One Strategy</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "Equity Harvesting", desc: "The legal process of moving your home's 'Dead Equity' into 'Live Capital' without selling the property or paying taxes.", icon: <Zap className="h-5 w-5 text-amber-500" /> },
                  { term: "Yield Spread", desc: "The gap between the cost of your HELOC (e.g., 6%) and the return on your new asset (e.g., 10%). This gap is where your wealth is built.", icon: <TrendingUp className="h-5 w-5 text-emerald-500" /> },
                  { term: "Readvanceable Expansion", desc: `In ${country.name}, as you pay down $1,000 of principal, your credit limit increases by $1,000 automatically. This is your 'Down Payment Engine'.`, icon: <ArrowUpRight className="h-5 w-5 text-blue-500" /> },
                  { term: "LTV Buffer", desc: "The 20% 'Safety Net' of equity we never touch. We only harvest capital that exists above this conservative line.", icon: <ShieldCheck className="h-5 w-5 text-purple-500" /> },
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">{t.icon}</div>
                      <h4 className="font-black text-lg text-slate-900"><TranslatedText>{t.term}</TranslatedText></h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed"><TranslatedText>{t.desc}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: The Two Financial Destinies</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-red-50 border-l-[12px] border-red-600 rounded-r-3xl space-y-4">
                    <h4 className="font-black text-xl text-red-900 uppercase tracking-tight">The Traditional Saver</h4>
                    <p className="text-red-900/70 font-medium leading-relaxed">
                        <TranslatedText>{`Works for 30 years to pay off ONE home. At age 65, they have zero debt but zero secondary income. They are "House Rich and Cash Poor," forced to live on a fixed government pension.`}</TranslatedText>
                    </p>
                </div>
                <div className="p-8 bg-emerald-50 border-l-[12px] border-emerald-600 rounded-r-3xl space-y-4">
                    <h4 className="font-black text-xl text-emerald-900 uppercase tracking-tight">The Strategic Stacker</h4>
                    <p className="text-emerald-900/70 font-medium leading-relaxed">
                        <TranslatedText>{`Uses the 1% Multiplier. By year 12, they own THREE homes free and clear. The rental income from Properties 2 and 3 pays for their lifestyle, leaving their primary income for pure legacy building.`}</TranslatedText>
                    </p>
                </div>
              </div>

              <EpiphanyBox>
                <TranslatedText>{`The bank doesn't want you to pay off your house; they want you to RENT your house from them for 30 years. When you harvest your equity, you stop being the bank's tenant and start being the bank's competitor.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Model Your Scaling</TranslatedText></h2>
              </div>
              
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the "Wealth Multiplier" simulator below to see how a single ${country.symbol}100k harvest, deployed into a ${country.name} income property, generates millions in long-term net worth through the power of leveraged velocity.`}</TranslatedText>
              </p>

              <WealthSimulator />

              <div className="space-y-8 pt-12">
                <h3 className="text-3xl font-fraunces font-black text-center text-slate-900"><TranslatedText>The Property Ladder Blueprint</TranslatedText></h3>
                <LadderVisual />
              </div>

              <div className="p-8 bg-blue-50 border-4 border-dashed border-blue-200 rounded-[40px] text-center space-y-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xl text-blue-900 font-bold leading-relaxed">
                    <TranslatedText>{`⚖️ RISK MANAGEMENT: Never harvest more than 80% of your total value. In ${country.name}, market shifts can happen. Maintaining a 20% LTV Buffer ensures you are never 'underwater' and your portfolio remains a fortress, not a house of cards.`}</TranslatedText>
                </p>
              </div>

              <Quiz 
                question="What is the primary advantage of 'Equity Harvesting' with a Strategic Arsenal tool?"
                options={[
                  "It allows you to buy a new car every two years",
                  "It turns 'Frozen' home equity into 'Liquid' capital for more assets",
                  "It makes the bank feel sorry for you and lower your rate",
                  "It is a secret way to avoid paying property taxes"
                ]}
                correctAnswer={1}
                explanation={`In the Mortgage Cutter Method, we don't just want to 'own' our home. We want our home's equity to be a mobile engine that can fund the acquisition of new income-producing assets while still working to cancel primary mortgage interest.`}
              />
            </section>
          </div>
        )}

        {/* LESSON 7: THE SPEEDRUN */}
        {id === 7 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-red-200">
                <Rocket className="h-4 w-4" />
                <TranslatedText>Mastery Level: 07 — Max Velocity</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Speedrun:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Collapsing Time Itself.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`It's time to trigger the final 'Hyperdrive'. By combining 'Principal Chunks' with 'Offset Timing', we're going to shave decades off your term.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Level Skip (ELI14)</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you're playing a long video game with 30 levels. Most players walk through every room, fighting every enemy (paying every cent of interest) for 30 years.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>A "Speedrun" is finding a "Hidden Glitch" in the bank's math called the "Principal Chunk." This is a hidden door that lets you skip level 5 to level 15 instantly. You aren't playing the game "better"—you are finding a shortcut the developers (banks) didn't want you to use.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>This is not working harder; it's taking a mathematical shortcut.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>We use a specialized credit line to apply a large "Chunk" of money to the mortgage principal. This immediately stops the interest from growing on that money for the rest of the 30-year term. Then, we use your monthly income to pay back the credit line over 6 months and repeat.</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Rocket className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Time Collapse</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">7 YRS</h3>
                    <p className="text-lg font-bold text-slate-400">Typical Accelerated Goal</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "Principal Chunk", desc: "A one-time large payment (usually $10k - $20k) applied directly to the mortgage principal using borrowed revolving credit.", icon: <Zap className="h-5 w-5 text-blue-500" /> },
                  { term: "Offset Timing (The Float)", desc: "The strategic practice of using a credit card for all daily spending to keep your income inside the loan for 25+ days longer.", icon: <Timer className="h-5 w-5 text-emerald-500" /> },
                  { term: "The Chunker Loop", desc: "The repeatable 6-month cycle of: 1. Inject Chunk, 2. Apply Income to Line, 3. Neutralize Interest, 4. Repeat.", icon: <RefreshCcw className="h-5 w-5 text-purple-500" /> },
                  { term: "Interest Arbitrage", desc: `The mathematical gap between your mortgage rate and your HELOC rate. In ${country.name}, we look for products where the velocity of paydown beats the interest cost.`, icon: <Scale className="h-5 w-5 text-amber-500" /> },
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">{t.icon}</div>
                      <h4 className="font-black text-lg text-slate-900"><TranslatedText>{t.term}</TranslatedText></h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed"><TranslatedText>{t.desc}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: Collapsing the Amortization</TranslatedText></h2>
              </div>
              
              <CourseCard className="border-l-[12px] border-l-red-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Clock className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Time is the most expensive commodity in ${country.name}. Every month you delay implementation of "The Loop" is a month of future labor you are handing to the bank for free.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`By using "Principal Chunks," you are effectively buying back your life. A single $15,000 chunk today can shave 18 months off a 30-year term. That isn't just money; it's 18 months of freedom you no longer have to work for.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`Every $10,000 "Chunk" applied to the principal today cancels up to $30,000 in future interest over the life of the loan. You are essentially trading a temporary credit balance for permanent financial sovereignty.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-16">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Speedrun Blueprint</TranslatedText></h3>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto"><TranslatedText>Use the tools below to calculate your exact "Freedom Date" using current regional rates and your personal cash flow surplus.</TranslatedText></p>
              </div>
              <OffsetVisual />
              <HyperdriveSim />
              <BiWeeklyCalc />
              
              <Quiz 
                question="What is a 'Principal Chunk' in the context of the Mortgage Cutter method?"
                options={[
                  "A large savings deposit into a low-yield bank account",
                  "A strategic prepayment to the mortgage using a revolving credit line",
                  "A special gift the bank gives you for being a good customer",
                  "A hidden fee mentioned in the fine print of your contract"
                ]}
                correctAnswer={1}
                explanation={`A Principal Chunk is the "Hyperdrive" engine. By borrowing from a revolving line to pay down the mortgage principal, you collapse the amortization schedule and stop the future interest from ever growing on that capital.`}
              />
            </section>
          </div>
        )}

        {/* LESSON 8: THE EXPERT CLUB */}
        {id === 8 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10 shadow-xl">
                <Globe className="h-4 w-4 text-blue-400" />
                <TranslatedText>{`Global Standard: Mathematical Physics`}</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Proof:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Joining the Private Wealth Club.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`In the top 1%, these tools aren't "secrets"—they are the standard. Today, you graduate from "Debtor" to "Expert Architect."`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Gravity of Math (ELI14)</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you're standing on top of a building with a ball. If you let go, the ball falls. It doesn't matter if you believe in gravity, if you're a nice person, or if your bank likes you. The ball must fall.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>Math is financial gravity. If you move your income from a low-yield savings account (where it does nothing) into an open-credit principal line (where it chokes daily interest), the debt MUST die. It is a mathematical certainty.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>You aren't "trying" to pay off your house; you are applying the physics of wealth to a math problem.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>{`In ${country.name}, millions of people use standard mortgages because they don't know the ball can fall faster. You now know how to change the gravity.`}</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Trophy className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Expert Consensus</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">100%</h3>
                    <p className="text-lg font-bold text-slate-400">Mathematical Certainty</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Master's Lexicon</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "Sovereignty", desc: "The state of being in full control of your capital flow, without requiring bank permission for your own equity.", icon: <Award className="h-5 w-5 text-blue-500" /> },
                  { term: "Implementation", desc: "The transition from 'learning' to 'doing'. The final step where theory becomes visceral reality.", icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" /> },
                  { term: "Generational Wealth", desc: "A debt-free fortress that provides stability and opportunity for your family for decades to come.", icon: <UserCircle2 className="h-5 w-5 text-purple-500" /> },
                  { term: "The Velocity Floor", desc: "The point at which your monthly surplus is so large compared to your debt that interest becomes statistically irrelevant.", icon: <ArrowUpRight className="h-5 w-5 text-amber-500" /> },
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">{t.icon}</div>
                      <h4 className="font-black text-lg text-slate-900"><TranslatedText>{t.term}</TranslatedText></h4>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed"><TranslatedText>{t.desc}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: The Biological Dividend</TranslatedText></h2>
              </div>
              
              <CourseCard className="border-l-[12px] border-l-blue-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <UserCircle2 className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Most financial courses focus on the numbers. We focus on the HOURS. If you shave 15 years off your mortgage, you aren't just saving $150,000; you are reclaiming 131,400 hours of your life that you no longer have to trade for bank profit.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`That is time with your children, time for your passions, and the freedom to retire while you still have your health. The Mortgage Cutter Method isn't a "money trick"—it is a biological time-machine.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <div className="p-8 bg-emerald-50 border-4 border-emerald-200 rounded-[40px] text-center space-y-4">
                <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-2xl text-emerald-900 font-black leading-tight">
                  <TranslatedText>{`Graduation Notice: Your mathematical understanding now exceeds 99% of homeowners in ${country.name}. You are now ready to implement.`}</TranslatedText>
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-700 to-indigo-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16 text-center overflow-hidden relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                  <Award className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                </div>
                <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                  <TranslatedText>Mastery Achieved</TranslatedText>
                </h2>
                <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto font-medium">
                  <TranslatedText>{`You have the logic. You have the tools. You have the physics. It's time to build your debt-free fortress.`}</TranslatedText>
                </p>
              </div>

              <div className="pt-16 border-t border-white/10 text-center space-y-10 relative z-10">
                <button 
                  onClick={() => router.push('/members/chunker')}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                >
                  <TranslatedText>Launch My Chunker Simulator</TranslatedText>
                  <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                </button>
                <div className="flex justify-center gap-8 text-[10px] font-black uppercase text-blue-300 tracking-widest">
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Calculator Unlocked</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Screener Unlocked</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Strategy Archive Unlocked</span>
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="flex items-center justify-between pt-20 border-t-2 border-[#E8ECF2]">
          <button 
            onClick={prevLesson}
            className="flex items-center gap-4 text-[#5A6175] hover:text-[#1A1D26] font-black transition-all group text-xl"
          >
            <ChevronLeft className="h-8 w-8 group-hover:-translate-x-2 transition-transform" />
            <TranslatedText>Previous Phase</TranslatedText>
          </button>
          
          {(id < 8 && (!isLocked || isPrivileged)) && (
            <button 
                onClick={nextLesson}
                className="group flex items-center gap-4 bg-[#2563EB] text-white px-12 py-6 rounded-[24px] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 text-2xl"
            >
                <TranslatedText>{id === 3 ? "Unlock The Vault" : "Next Phase"}</TranslatedText>
                <ChevronRight className="h-8 w-8 group-hover:translate-x-3 transition-transform" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <CourseProvider>
      <LessonContent id={Number(id)} />
    </CourseProvider>
  );
}
