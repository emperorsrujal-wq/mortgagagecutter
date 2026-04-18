
'use client';
import React, { use, useState, useEffect } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { 
  InterestCalc,
  TruthCalculator,
  AmortViz
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
  ArrowUpRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
          {current === 0 ? <TranslatedText>Module 1: Awakening</TranslatedText> : <><TranslatedText>Module</TranslatedText> {current} <TranslatedText>of</TranslatedText> {total}</>}
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

            {/* LESSON 1: THE NUMBER NOBODY SHOWS YOU */}
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

              {/* SHOCK CHART */}
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

            {/* LESSON 2: AMORTIZATION FRONT-LOADS INTEREST */}
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

            {/* LESSON 3: THE MISLEADING MONTHLY PAYMENT */}
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

            {/* LESSON 4: NORTH AMERICAN DEBT CONTEXT */}
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

            {/* LESSON 5: WHY THE SYSTEM WAS BUILT THIS WAY */}
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

            {/* LESSON 6: MORTGAGE VS WEALTH MINDSET */}
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

            {/* TOTAL COST CALCULATOR */}
            <section className="space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Face Your Truth</TranslatedText></h3>
                <p className="text-xl text-slate-500 font-medium"><TranslatedText>Calculate the real hourly cost of your debt.</TranslatedText></p>
              </div>
              <InterestCalc />
            </section>

            {/* END OF MODULE QUIZ */}
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

            {/* GLOSSARY ITEMS */}
            <section className="space-y-6">
              <h3 className="text-xl font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Module 1 Glossary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ExpandSection title="Principal">The original amount of money you borrowed. This is the only number that reduces your debt.</ExpandSection>
                <ExpandSection title="Interest">The 'rent' you pay to the bank to use their money. This is pure expense and builds no wealth.</ExpandSection>
                <ExpandSection title="Amortization">The mathematical schedule that determines how much interest vs. principal you pay each month.</ExpandSection>
                <ExpandSection title="Equity">The portion of the home you actually own. (Market Value - Total Debt).</ExpandSection>
              </div>
            </section>

            {/* CTA TO MODULE 2 */}
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

        {/* Lessons 1-13 Placeholder */}
        {id >= 1 && (
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
