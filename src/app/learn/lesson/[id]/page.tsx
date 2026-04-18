
'use client';
import React, { use, useState, useEffect } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { 
  InterestCalc,
  TruthCalculator,
  AmortViz,
  BankRateChart,
  PayoffRace
} from '@/components/course/Calculators';
import { 
  CourseCard, 
  Quiz,
  CaseStudy,
  StatBox,
  ExpandSection,
  InfoBox,
  ChatBubble,
  TaskItem
} from '@/components/course/UIComponents';
import { TranslatedText } from '@/components/course/TranslatedText';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home as HomeIcon, 
  CheckCircle2, 
  CheckCircle,
  Rocket, 
  Zap, 
  ShieldCheck,
  Activity,
  TrendingUp,
  Flame,
  MessageSquare,
  Target,
  BarChart,
  Lock,
  Award,
  Trophy,
  History,
  Scale,
  Sparkles,
  TrendingDown,
  FileSearch,
  RefreshCcw,
  Layers,
  Globe,
  BookOpen,
  DollarSign,
  Clock,
  Gavel,
  ScrollText,
  SearchCode,
  ArrowRight,
  Timer,
  AlertCircle,
  UserCircle2,
  Landmark,
  ShieldAlert,
  Ghost,
  Camera,
  Hammer,
  Coins,
  Warehouse,
  Building2,
  UserPlus2,
  Table as TableIcon,
  HelpCircle,
  AlertTriangle,
  HeartPulse,
  Waves,
  MousePointer2,
  ListChecks,
  ArrowUpRight,
  GanttChartSquare,
  Milestone
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';

function ProgressBar({ current }: { current: number }) {
  const total = 13;
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
          {current === 0 ? <TranslatedText>Module 1: Awakening</TranslatedText> : current === 1 ? <TranslatedText>Module 2: History</TranslatedText> : current === 2 ? <TranslatedText>Module 3: The Proof</TranslatedText> : <><TranslatedText>Module</TranslatedText> {current + 1} <TranslatedText>of</TranslatedText> {total + 1}</>}
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

function LessonHeader({ title, number, subtitle }: { title: string, number: number, subtitle?: string }) {
  return (
    <div className="space-y-6 pt-12 border-t border-slate-100 mt-12 first:pt-0 first:border-none first:mt-0">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
        Lesson {number}
      </div>
      <h2 className="text-3xl md:text-5xl font-fraunces font-black text-slate-900 leading-tight">
        <TranslatedText>{title}</TranslatedText>
      </h2>
      {subtitle && <p className="text-lg text-slate-500 font-medium italic"><TranslatedText>{subtitle}</TranslatedText></p>}
    </div>
  );
}

function MilestoneCard({ year, event, description, icon: Icon }: { year: string, event: string, description: string, icon: any }) {
  return (
    <div className="flex gap-6 items-start group">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10">
          <Icon className="h-5 w-5" />
        </div>
        <div className="w-0.5 h-full bg-slate-200 mt-2" />
      </div>
      <div className="space-y-2 pb-12">
        <span className="text-blue-600 font-black text-sm uppercase tracking-widest">{year}</span>
        <h4 className="text-xl font-bold text-slate-900">{event}</h4>
        <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
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
  const isLocked = id >= 13 && !isPrivileged;

  const nextLesson = () => {
    completeLesson(id);
    if (id < 13) router.push(`/learn/lesson/${id + 1}`);
    else router.push('/members/chunker');
  };

  const prevLesson = () => {
    if (id > 0) router.push(`/learn/lesson/${id - 1}`);
    else router.push('/learn');
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-32">
      <ProgressBar current={id} />
      
      <div className="max-w-[850px] mx-auto px-4 py-16 space-y-24">
        
        {/* MODULE 1: YOU ARE PAYING TWICE FOR YOUR HOME */}
        {id === 0 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
             <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10">
                <Flame className="h-4 w-4 text-orange-500" />
                <TranslatedText>Module 01 — The Awakening</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>You Are Paying Twice</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>For Your Home.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium italic">
                <TranslatedText>"The banker never highlighted the one number that should have stopped you cold: The Total Amount You Will Actually Pay."</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <LessonHeader 
                number={1} 
                title="The Number Nobody Shows You at Closing" 
                subtitle="The Forensic Truth of the $400k Dream"
              />
              <div className="space-y-8 text-xl text-slate-600 leading-relaxed font-medium">
                <p>
                  <TranslatedText>{`When you signed your closing documents, there was a stack of paper roughly 100 pages high. Somewhere in that stack, usually near the back, is a single table titled "Federal Truth in Lending Disclosure."`}</TranslatedText>
                </p>
                <p>
                  <TranslatedText>{`Most homeowners see the purchase price ($400,000) and the monthly payment ($2,528). But they skip the most important box: "Total of Payments."`}</TranslatedText>
                </p>
                <p className="text-blue-600 font-black p-6 bg-blue-50 rounded-3xl border-l-8 border-blue-600">
                  <TranslatedText>For a $400,000 home at 6.5% interest over 30 years, that number is $910,080. You aren't just buying one house. You are buying your house once for you, and a second, more expensive house for the bank.</TranslatedText>
                </p>
              </div>

              <div className="bg-slate-900 rounded-[48px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Landmark className="h-64 w-64 text-blue-400" /></div>
                <div className="text-center space-y-2 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-blue-400"><TranslatedText>The Double Cost Proof</TranslatedText></h3>
                  <p className="text-slate-400 font-bold"><TranslatedText>The Financial Lifecycle of a $400k Loan</TranslatedText></p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-end justify-center pt-10">
                  <div className="w-full md:w-32 flex flex-col items-center gap-4">
                    <div className="w-full h-32 bg-emerald-500 rounded-t-2xl shadow-lg flex items-center justify-center font-black text-xl">$400k</div>
                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest text-center">Your House<br/>(Principal)</p>
                  </div>
                  <div className="hidden md:block pb-16"><Sparkles className="h-8 w-8 text-slate-700" /></div>
                  <div className="w-full md:w-32 flex flex-col items-center gap-4">
                    <div className="w-full h-[400px] bg-red-500 rounded-t-2xl shadow-lg flex items-center justify-center font-black text-xl">$510k</div>
                    <p className="text-[10px] font-black uppercase text-red-400 tracking-widest text-center">Their House<br/>(Interest)</p>
                  </div>
                  <div className="w-full md:w-48 bg-white/5 p-6 rounded-3xl border border-white/10 text-center space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-500">Total Lifecycle Cost</p>
                    <p className="text-4xl font-black text-white">$910,080</p>
                    <p className="text-xs font-bold text-blue-400 uppercase">227% of Purchase Price</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={2} 
                title="How Amortization Front-Loads Interest" 
                subtitle="The Banker's Profit Defense System"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>{`Amortization is not just a schedule; it is an "Engine of Inequality." It is meticulously designed to ensure that if you sell or refinance in the first 10 years, the bank has already captured 70-80% of their total profit.`}</TranslatedText>
                  </p>
                  <InfoBox title="ELI14: The Cover Charge" color="amber">
                    Think of a mortgage like a club. The first 15 years are just the "Cover Charge" to get in. You're paying for the privilege of being there, but you haven't bought a single drink (equity) yet.
                  </InfoBox>
                </div>
                <AmortViz />
              </div>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={3} 
                title="Why the Monthly Payment is Misleading" 
                subtitle="The Trap of 'Affordability'"
              />
              <CourseCard className="border-l-[12px] border-l-red-600 p-12 bg-white">
                <div className="space-y-8 text-xl text-slate-600 font-medium">
                  <p><TranslatedText>{`Lenders sell you on the "Monthly Payment" because it fits into a budget. They ask: "Can you afford $2,500 a month?"`}</TranslatedText></p>
                  <p><TranslatedText>{`But this is like asking if you can afford the monthly maintenance on a plane you'll never own. It ignores the $510,000 "Lifetime Interest Drain" that is quietly siphoning your wealth every single day.`}</TranslatedText></p>
                  <EpiphanyBox>
                    Monthly payments are for consumers. Total interest cost is for strategists. We are going to stop looking at the drip and start looking at the reservoir.
                  </EpiphanyBox>
                </div>
              </CourseCard>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={4} 
                title="Mortgage Debt in North America" 
                subtitle="The $12 Trillion National Energy Siphon"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatBox label="Total US Debt" value="$12.1T" colorClass="text-red-600" />
                <StatBox label="Avg Canadian Loan" value="$372k" />
                <StatBox label="Interest Capture" value="62%" colorClass="text-blue-600" />
              </div>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                <TranslatedText>{`The traditional mortgage is the primary source of revenue for the global banking machine. In ${country.name}, the system is tuned to keep you in debt until retirement, effectively capturing the most productive 30 years of your life force.`}</TranslatedText>
              </p>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={5} 
                title="Why This System Was Built This Way" 
                subtitle="A History of Controlled Liquidity"
              />
              <div className="space-y-8 text-xl text-slate-600 font-medium">
                <p><TranslatedText>{`In the 1930s, the government and banks collaborated to create the long-term amortizing mortgage. It wasn't to help you build wealth—it was to stabilize the housing market by making debt "socially acceptable" and "manageable."`}</TranslatedText></p>
                <InfoBox title="The Design Flaw" color="red">
                  The system was built to prioritize "Market Stability" (Bank Profit) over "Personal Net Worth" (Your Freedom). You are currently playing a game where the rules were written by your opponent.
                </InfoBox>
              </div>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={6} 
                title="Mortgage vs. Wealth-Building Mindset" 
                subtitle="The Wall vs. The Engine"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-[40px] border-2 border-slate-100 space-y-4">
                  <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest flex items-center gap-2"><Lock className="h-4 w-4" /> The Wall (Standard)</h4>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">Equity is "dead" money trapped inside your walls. You have to ask the bank's permission and pay a fee to use your own savings.</p>
                </div>
                <div className="p-8 bg-blue-600 rounded-[40px] text-white space-y-4 shadow-xl shadow-blue-500/20">
                  <h4 className="font-black text-xs uppercase text-blue-200 tracking-widest flex items-center gap-2"><Zap className="h-4 w-4 fill-white" /> The Engine (Strategy)</h4>
                  <p className="text-sm font-bold opacity-90 leading-relaxed">Your home becomes a revolving engine of liquidity. Every dollar of income hits the principal immediately, cancelling interest 24/7.</p>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Face Your Truth</TranslatedText></h3>
                <p className="text-xl text-slate-500 font-medium"><TranslatedText>Calculate the real hourly cost of your debt.</TranslatedText></p>
              </div>
              <InterestCalc />
            </section>

            <section className="space-y-12">
               <Quiz 
                  question="If you buy a $400,000 home at 6.5% interest for 30 years, roughly how much will you pay in total?"
                  options={["$400,000", "$650,000", "$910,000", "$1.2 Million"]}
                  correctAnswer={2}
                  explanation="Because interest is calculated on the remaining balance every month for 360 months, the total cost of borrowing $400k at current rates results in paying back more than double the original price."
               />
               <Quiz 
                  question="What does 'Amortization Front-Loading' actually mean?"
                  options={[
                    "You pay the principal off early to save time.",
                    "The bank ensures interest is paid first before principal.",
                    "Your payments get cheaper over time.",
                    "The government pays your interest for the first 5 years."
                  ]}
                  correctAnswer={1}
                  explanation="Amortization schedules are mathematically designed so that in the first 10-15 years, the majority of your check goes to interest profit, protecting the bank's earnings if you sell or refinance."
               />
            </section>

            <div className="pt-20 border-t-4 border-blue-600 text-center space-y-8">
               <div className="inline-flex h-20 w-20 rounded-full bg-blue-600 items-center justify-center shadow-2xl shadow-blue-500/40">
                  <Award className="h-10 w-10 text-white" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-fraunces font-black text-slate-900">Module 1 Complete</h2>
                  <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">You've decoded the bank's profit engine. Now, let's learn the history of how this trap was set.</p>
               </div>
               <button 
                  onClick={nextLesson}
                  className="group flex items-center gap-4 bg-[#2563EB] text-white px-12 py-6 rounded-[32px] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 text-2xl mx-auto"
               >
                  <TranslatedText>Start Module 2: Forensic History</TranslatedText>
                  <ChevronRight className="h-8 w-8 group-hover:translate-x-3 transition-transform" />
               </button>
            </div>
          </div>
        )}

        {/* MODULE 2: THE DIRTY HISTORY OF BANKING */}
        {id === 1 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10">
                <History className="h-4 w-4 text-blue-400" />
                <TranslatedText>Module 02 — Forensic History</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Dirty History</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Of Banking.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium italic">
                <TranslatedText>"To understand why you are trapped in a 30-year contract, you must understand the profit motives of the men who designed it."</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <LessonHeader 
                number={1} 
                title="Early Lending & The Goldsmith's Secret" 
                subtitle="How Fractional Reserve Banking was Born"
              />
              <div className="space-y-8 text-xl text-slate-600 leading-relaxed font-medium">
                <p>
                  <TranslatedText>{`In the 1600s, London's goldsmiths offered a safe place for people to store their gold. They issued paper "receipts" for the gold. Soon, people began trading the receipts as money instead of the actual gold.`}</TranslatedText>
                </p>
                <p>
                  <TranslatedText>{`The goldsmiths noticed that people rarely came back for their physical gold all at once. They realized they could issue more paper receipts than they had gold—and charge interest on those receipts. This was the birth of "Fractional Reserve Banking."`}</TranslatedText>
                </p>
                <EpiphanyBox>
                  Banking was founded on a secret: you can lend money that doesn't exist, provided everyone doesn't ask for it at the same time. This "Goldsmith's Secret" is the engine behind every modern mortgage.
                </EpiphanyBox>
              </div>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={2} 
                title="How Modern Banks Gained Power" 
                subtitle="From Private Guilds to Centralized Control"
              />
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <MilestoneCard 
                    year="1694" 
                    event="Bank of England Founded" 
                    description="The first private institution granted the right to issue a nation's currency. The government became the bank's largest debtor." 
                    icon={Landmark}
                  />
                  <MilestoneCard 
                    year="1913" 
                    event="The Federal Reserve Act" 
                    description="A secret meeting at Jekyll Island created a centralized banking system for the US, essentially outsourcing the dollar to private banks." 
                    icon={Gavel}
                  />
                  <MilestoneCard 
                    year="1933" 
                    event="Ending the Gold Standard" 
                    description="Money was decoupled from physical assets, allowing banks to expand the debt bubble to unprecedented levels." 
                    icon={ShieldAlert}
                  />
                  <MilestoneCard 
                    year="1970" 
                    event="MBS Securitization" 
                    description="The birth of the Mortgage-Backed Security. Loans were no longer held by banks; they were sold to investors as 'products'." 
                    icon={RefreshCcw}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={3} 
                title="The Birth of the 30-Year Mortgage" 
                subtitle="The 1933 Great Depression Pivot"
              />
              <div className="space-y-8 text-xl text-slate-600 font-medium">
                <p><TranslatedText>{`Before the 1930s, mortgages were rarely longer than 5 years. You paid interest annually and the principal at the end. If you couldn't pay, you lost the home.`}</TranslatedText></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-red-50 rounded-[40px] border-2 border-red-100 space-y-4">
                      <h4 className="font-black text-xs uppercase text-red-700 tracking-widest flex items-center gap-2"><Lock className="h-4 w-4" /> Pre-1933 (Traditional)</h4>
                      <p className="text-sm font-bold text-red-900 leading-relaxed">Short terms, balloon payments, high ownership risk. Banks were local and held the risk.</p>
                   </div>
                   <div className="p-8 bg-blue-600 rounded-[40px] text-white space-y-4 shadow-xl shadow-blue-500/20">
                      <h4 className="font-black text-xs uppercase text-blue-200 tracking-widest flex items-center gap-2"><Trophy className="h-4 w-4 fill-white" /> Post-1933 (Modern)</h4>
                      <p className="text-sm font-bold opacity-90 leading-relaxed">The 30-year term was created to prevent mass foreclosures during the Depression. It made debt "affordable" by extending the sentence.</p>
                   </div>
                </div>
                <EpiphanyBox>
                   The 30-year mortgage was a government-sponsored stabilization tool, not a wealth-building one. It was designed to keep people in homes, but also in debt for their entire working lives.
                </EpiphanyBox>
              </div>
            </section>

            <section className="space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Historical Audit</TranslatedText></h3>
                <p className="text-xl text-slate-500 font-medium"><TranslatedText>Review your current loan through a historical lens.</TranslatedText></p>
              </div>
              <BankRateChart />
            </section>

            <section className="space-y-12">
               <Quiz 
                  question="What was the 'Goldsmith's Secret' that birthed modern banking?"
                  options={[
                    "Lending physical gold at 0% interest.",
                    "Issuing more paper receipts than they had gold in reserve.",
                    "Charging fees to protect gold from thieves.",
                    "Creating the first credit card in 1690."
                  ]}
                  correctAnswer={1}
                  explanation="Goldsmiths noticed that only a fraction of gold was withdrawn at any time, allowing them to issue multiple paper receipts (loans) for the same gold, effectively creating money."
               />
            </section>

            <div className="pt-20 border-t-4 border-blue-600 text-center space-y-8">
               <div className="inline-flex h-20 w-20 rounded-full bg-blue-600 items-center justify-center shadow-2xl shadow-blue-500/40">
                  <Milestone className="h-10 w-10 text-white" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-fraunces font-black text-slate-900">History Decoded</h2>
                  <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">You've seen the historical design. Now, let's look at the Mathematical Proof of why the system is failing you.</p>
               </div>
               <button 
                  onClick={nextLesson}
                  className="group flex items-center gap-4 bg-[#2563EB] text-white px-12 py-6 rounded-[32px] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 text-2xl mx-auto"
               >
                  <TranslatedText>Start Module 3: Mathematical Proof</TranslatedText>
                  <ChevronRight className="h-8 w-8 group-hover:translate-x-3 transition-transform" />
               </button>
            </div>
          </div>
        )}

        {/* MODULE 3: THE MATHEMATICAL PROOF (THE SCAM) */}
        {id === 2 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10">
                <GanttChartSquare className="h-4 w-4 text-emerald-400" />
                <TranslatedText>Module 03 — The Scam Proof</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Math is Rigged.</TranslatedText>
                <span className="block text-emerald-600 italic mt-4"><TranslatedText>Here is the Proof.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium italic">
                <TranslatedText>"DTI is not a judgment of your character. It is arithmetic. Your mortgage is not a loan; it is a wealth extraction instrument."</TranslatedText>
              </p>
            </header>

            {/* THE PROOF LADDER */}
            <section className="space-y-12">
               <div className="text-center space-y-4">
                  <h3 className="text-3xl font-fraunces font-black text-slate-900 tracking-tight">The Proof Ladder</h3>
                  <p className="text-lg text-slate-500 font-medium">Five undeniable mathematical reasons the system works against you.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { step: "01", title: "Interest First", desc: "The bank takes its profit before you pay a dollar of principal.", icon: <TrendingUp className="h-6 w-6" /> },
                    { step: "02", title: "Daily Siphon", desc: "Interest is calculated nightly, but you only pay monthly.", icon: <Activity className="h-6 w-6" /> },
                    { step: "03", title: "Static Capital", desc: "Your equity is 'dead money' trapped inside your walls.", icon: <Lock className="h-6 w-6" /> },
                    { step: "04", title: "Time Multiplier", desc: "A 30-year term is a 30-year interest-bearing treadmill.", icon: <Clock className="h-6 w-6" /> },
                    { step: "05", title: "Closed Loop", desc: "You cannot move capital freely to minimize daily charges.", icon: <RefreshCcw className="h-6 w-6" /> }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-3 group hover:border-emerald-500 transition-all">
                      <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">{s.icon}</div>
                      <h4 className="font-black text-sm uppercase text-slate-900 tracking-tight">{s.title}</h4>
                      <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
               </div>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={1} 
                title="Structural Unfairness: The Closed Loop" 
                subtitle="Why installment debt is a borrower's prison."
              />
              <div className="space-y-8 text-xl text-slate-600 leading-relaxed font-medium">
                <p>
                  <TranslatedText>{`A traditional mortgage is a "Closed Loop." Once you pay a dollar to the bank, you can never get it back without asking permission, paying a fee, and going through a weeks-long appraisal process. This design is deliberate.`}</TranslatedText>
                </p>
                <div className="p-8 bg-slate-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10"><Lock className="h-32 w-32" /></div>
                   <h4 className="text-xl font-black mb-4">The Banker's Advantage</h4>
                   <p className="opacity-80">By keeping your capital "Trapped" in equity, the bank ensures you cannot use that same money to reduce the daily interest on the remaining principal. They win by keeping your money stationary while their interest calculation runs 24/7.</p>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={2} 
                title="Affordability vs. Total Cost" 
                subtitle="The psychological mirage of the monthly payment."
              />
              <CourseCard className="border-l-[12px] border-emerald-500">
                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <p className="font-black text-xs uppercase text-slate-400 tracking-widest">The Consumer Trap</p>
                          <p className="text-2xl font-black text-slate-900 leading-tight">"Can I afford $2,800 per month?"</p>
                          <p className="text-sm text-slate-500 font-medium">This focuses on budget, which feels manageable, but hides the systemic cost.</p>
                       </div>
                       <div className="space-y-4">
                          <p className="font-black text-xs uppercase text-emerald-600 tracking-widest">The Strategist Proof</p>
                          <p className="text-2xl font-black text-emerald-700 leading-tight">"Can I afford to pay $510,000 for a $400,000 loan?"</p>
                          <p className="text-sm text-emerald-900/60 font-medium">This focuses on net worth, which is the only number that matters for freedom.</p>
                       </div>
                    </div>
                    <EpiphanyBox>
                      Monthly payments are designed to keep you comfortable with being in debt. Total lifecycle cost is designed to make you uncomfortable enough to act.
                    </EpiphanyBox>
                 </div>
              </CourseCard>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={3} 
                title="Interest Timing: The Hidden Weapon" 
                subtitle="How 'Daily Balance' math works against you."
              />
              <div className="space-y-8 text-xl text-slate-600 font-medium">
                 <p><TranslatedText>{`Most people think their interest is calculated once a month when the bill arrives. It isn't. In ${country.name}, the bank calculates your interest every single night at midnight based on your outstanding principal balance.`}</TranslatedText></p>
                 <InfoBox title="ELI14: The Midnight Thief" color="red">
                    Think of interest like a burglar who checks your house every single night. If he sees $400k in your safe, he takes a small cut. If he sees $0, he takes nothing. By paying once a month, you let him steal for 29 days before you hide your money.
                 </InfoBox>
              </div>
            </section>

            <section className="space-y-12">
              <LessonHeader 
                number={4} 
                title="The Myth vs. Math Forensic Audit" 
                subtitle="Replacing cultural dogma with data."
              />
              <div className="space-y-6">
                 {[
                   { myth: "Renting is throwing money away.", math: "Traditional homeowners 'throw away' 1.5x more in interest than average renters do in rent over 30 years." },
                   { myth: "I get a tax deduction for interest.", math: "A deduction is just an 80% discount on a bill you shouldn't have to pay in the first place." },
                   { myth: "Property appreciation will save me.", math: "Nominal gains are often eaten entirely by interest, taxes, and maintenance, resulting in 0% real return." }
                 ].map((m, i) => (
                   <div key={i} className="grid grid-cols-1 md:grid-cols-2 border rounded-[32px] overflow-hidden">
                      <div className="p-8 bg-red-50 text-red-900 flex items-center gap-4">
                         <ShieldAlert className="h-6 w-6 shrink-0 opacity-40" />
                         <div><p className="text-[10px] font-black uppercase opacity-60">Myth</p><p className="font-bold">{m.myth}</p></div>
                      </div>
                      <div className="p-8 bg-emerald-50 text-emerald-900 flex items-center gap-4">
                         <ShieldCheck className="h-6 w-6 shrink-0 opacity-40" />
                         <div><p className="text-[10px] font-black uppercase opacity-60">Math</p><p className="font-bold">{m.math}</p></div>
                      </div>
                   </div>
                 ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Payoff Velocity Race</TranslatedText></h3>
                <p className="text-xl text-slate-500 font-medium"><TranslatedText>See how cash-flow velocity crushes the bank's schedule.</TranslatedText></p>
              </div>
              <PayoffRace />
            </section>

            <section className="space-y-12">
               <Quiz 
                  question="Why does 'Daily Interest Calculation' make a monthly mortgage inefficient?"
                  options={[
                    "Because the bank charges you extra fees every day.",
                    "Because you only pay down the balance once a month, leaving it high for 29 days.",
                    "Because interest rates change every night.",
                    "Because the bank doesn't accept bi-weekly payments."
                  ]}
                  correctAnswer={1}
                  explanation="By only paying once a month, you keep the principal balance at its highest possible level for most of the cycle, allowing the bank to charge interest on that full amount every single night."
               />
               <Quiz 
                  question="In the 'Proof Ladder', why is a 30-year term considered a 'Time Multiplier'?"
                  options={[
                    "It gives you more time to save for retirement.",
                    "It multiplies the amount of interest the bank can charge by extending the duration of the debt.",
                    "It helps the government stabilize the housing market.",
                    "It allows your home value to triple before you finish paying."
                  ]}
                  correctAnswer={1}
                  explanation="The bank profits from the duration of your debt. The longer the term, the more 'daily cycles' they have to calculate interest, resulting in a total cost that is often double the purchase price."
               />
            </section>

            <div className="pt-20 border-t-4 border-emerald-600 text-center space-y-8">
               <div className="inline-flex h-20 w-20 rounded-full bg-emerald-600 items-center justify-center shadow-2xl shadow-emerald-500/40">
                  <GanttChartSquare className="h-10 w-10 text-white" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-fraunces font-black text-slate-900">Proof Established</h2>
                  <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">You've seen the mathematical evidence. Now, let's expose the specific hidden scams they use to inflate your costs.</p>
               </div>
               <button 
                  onClick={nextLesson}
                  className="group flex items-center gap-4 bg-[#059669] text-white px-12 py-6 rounded-[32px] font-black shadow-2xl shadow-emerald-500/30 hover:bg-emerald-700 transition-all active:scale-95 text-2xl mx-auto"
               >
                  <TranslatedText>Start Module 4: Hidden Scams</TranslatedText>
                  <ChevronRight className="h-8 w-8 group-hover:translate-x-3 transition-transform" />
               </button>
            </div>
          </div>
        )}

        {/* Placeholder for remaining lessons */}
        {id >= 3 && (
          <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">
            {meta.title} <TranslatedText>Module Content Loading...</TranslatedText>
          </div>
        )}

        <div className="flex items-center justify-between pt-20 border-t-2 border-[#E8ECF2]">
          <button 
            onClick={prevLesson}
            className="flex items-center gap-4 text-[#5A6175] hover:text-[#1A1D26] font-black transition-all group text-xl"
          >
            <ChevronLeft className="h-8 w-8 group-hover:-translate-x-2 transition-transform" />
            <TranslatedText>Previous Module</TranslatedText>
          </button>
          
          {(id < 13 && (!isLocked || isPrivileged)) && (
            <button 
                onClick={nextLesson}
                className="group flex items-center gap-4 bg-[#2563EB] text-white px-12 py-6 rounded-[24px] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 text-2xl"
            >
                <TranslatedText>Next Module</TranslatedText>
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
