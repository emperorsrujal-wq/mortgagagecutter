
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
  Milestone,
  FileText,
  Check
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
           <TranslatedText>Module 1: Total Cost Reality Check</TranslatedText>
        </div>
        <div className="w-20" />
      </div>
    </div>
  );
}

function TermMaster({ term, definition }: { term: string, definition: string }) {
  return (
    <div className="p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl space-y-2 mb-6 group hover:bg-blue-100 transition-colors">
      <div className="flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest">
        <BookOpen className="h-4 w-4" />
        <span>Term Master</span>
      </div>
      <h4 className="text-xl font-black text-slate-900">{term}</h4>
      <p className="text-slate-600 font-medium leading-relaxed">{definition}</p>
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
        Section {number}
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
        
        {/* MODULE 1: THE TOTAL COST REALITY CHECK */}
        {id === 0 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
             <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10">
                <Flame className="h-4 w-4 text-orange-500" />
                <TranslatedText>Module 01 — The Awakening</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Total Cost</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Reality Check.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium italic">
                <TranslatedText>"Master the terminology the banks use to hide the true cost of your freedom."</TranslatedText>
              </p>
            </header>

            {/* LESSON 1: THE NUMBER THEY HIDE */}
            <section className="space-y-12">
              <LessonHeader 
                number={1} 
                title="Total of All Payments: The Forensic Truth" 
                subtitle="Why your $400k home actually costs $909k."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <TermMaster 
                    term="Principal vs. Interest" 
                    definition="Principal is the actual bricks and mortar of your home. Interest is the rent you pay the bank to use their money. Over 30 years, the 'rent' usually costs more than the 'bricks'."
                  />
                  <p>
                    <TranslatedText>{`Sarah thought her $2,500/month payment was 'affordable'. She never turned to page 83 of her closing documents to see the 'Total of All Payments'.`}</TranslatedText>
                  </p>
                  <EpiphanyBox>
                    Sarah isn't just buying one house. She is buying a $400k house for herself and a $509k house for the bank's shareholders.
                  </EpiphanyBox>
                </div>
                <div className="bg-slate-900 rounded-[48px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                   <div className="text-center space-y-2 relative z-10">
                      <h3 className="text-lg font-black uppercase tracking-[0.2em] text-blue-400"><TranslatedText>The Double Cost Proof</TranslatedText></h3>
                    </div>
                    <div className="flex flex-col items-center gap-8 pt-4">
                      <div className="w-full h-12 bg-white/10 rounded-2xl flex items-center px-4 justify-between border border-white/5">
                        <span className="text-[10px] font-black uppercase text-slate-400">Principal</span>
                        <span className="text-emerald-400 font-black">$400,000 (44%)</span>
                      </div>
                      <div className="w-full h-12 bg-white/10 rounded-2xl flex items-center px-4 justify-between border border-white/5">
                        <span className="text-[10px] font-black uppercase text-slate-400">Interest Profit</span>
                        <span className="text-red-400 font-black">$509,000 (56%)</span>
                      </div>
                      <div className="pt-6 border-t border-white/10 w-full text-center">
                        <p className="text-4xl font-black text-white">$909,000</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total of All Payments</p>
                      </div>
                    </div>
                </div>
              </div>
            </section>

            {/* LESSON 2: AMORTIZATION EXPOSED */}
            <section className="space-y-12">
              <LessonHeader 
                number={2} 
                title="Amortization Schedule: The Front-Loading Scam" 
                subtitle="The Banker's Profit Defense System."
              />
              <div className="space-y-8">
                 <TermMaster 
                    term="Amortization Allocation" 
                    definition="The math that ensures the bank takes its profit first. In the early years, roughly 85% of your payment goes to the bank's interest, leaving only 15% to actually own your home."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-slate-50 rounded-[40px] border-2 border-slate-100 space-y-6">
                       <h4 className="font-black text-xs uppercase text-slate-400 tracking-widest flex items-center gap-2"><Lock className="h-4 w-4" /> First Payment Breakdown</h4>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm font-bold">
                             <span className="text-slate-500 uppercase">To Bank (Interest)</span>
                             <span className="text-red-600 text-lg">$1,733 (86%)</span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-bold">
                             <span className="text-slate-500 uppercase">To Equity (Principal)</span>
                             <span className="text-emerald-600 text-lg">$290 (14%)</span>
                          </div>
                       </div>
                    </div>
                    <AmortViz />
                  </div>
              </div>
            </section>

            {/* LESSON 3: THE PITI TRAP */}
            <section className="space-y-12">
              <LessonHeader 
                number={3} 
                title="Why Monthly PITI Misleads You" 
                subtitle="Focusing on the drip, ignoring the reservoir."
              />
              <div className="space-y-8 text-xl text-slate-600 font-medium">
                <TermMaster 
                  term="PITI" 
                  definition="Principal, Interest, Taxes, Insurance. Lenders combine these into one manageable monthly number to hide the $500,000+ total interest cost."
                />
                <p><TranslatedText>{`Lenders ask: 'Can you afford $2,023 per month?' They want you to focus on the monthly cash flow because it feels safe. But it hides the total cost monster waiting at the end of 30 years.`}</TranslatedText></p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatBox label="Monthly PITI" value="$2,023" />
                  <div className="flex items-center justify-center"><ArrowRight className="h-8 w-8 text-slate-300" /></div>
                  <StatBox label="Total Lifecycle Cost" value="$909,000" colorClass="text-red-600" />
                </div>
              </div>
            </section>

            {/* LESSON 4: DEBT COMPOSITION */}
            <section className="space-y-12">
              <LessonHeader 
                number={4} 
                title="Household Debt Composition" 
                subtitle="The $12 Trillion National Energy Siphon."
              />
              <div className="space-y-8">
                <TermMaster 
                  term="Debt-to-Income (DTI)" 
                  definition="A context used by banks to see how much of your labor is already 'pre-spent' on debt. If your DTI is high, you are a slave to the lender's schedule."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-4">
                    <p className="text-lg text-slate-600 font-medium">In North America, mortgage debt is the single largest capture of family wealth. In the US, it accounts for **71%** of all household debt. In Canada, it is **74%**.</p>
                    <ul className="space-y-2">
                       <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> US: $12.1 Trillion in Mortgages</li>
                       <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Canada: $1.8 Trillion in Mortgages</li>
                    </ul>
                  </div>
                   <div className="bg-slate-50 border-2 border-slate-100 rounded-[40px] p-8 text-center space-y-4">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Debt Snapshot</p>
                      <StatBox label="Mortgage Share" value="71-74%" colorClass="text-blue-600" />
                   </div>
                </div>
              </div>
            </section>

            {/* LESSON 5: MORTGAGE EVOLUTION */}
            <section className="space-y-12">
              <LessonHeader 
                number={5} 
                title="Mortgage Evolution" 
                subtitle="Why the 30-year lie exists."
              />
              <div className="space-y-8">
                <TermMaster 
                  term="MBS (Mortgage-Backed Securities)" 
                  definition="The process of 'Origination' (making the loan) and then 'Securitization' (selling it to Wall Street). Banks make profit upfront, while you pay interest for decades."
                />
                <div className="space-y-12">
                   <MilestoneCard 
                    year="1934" 
                    event="HOLC Created" 
                    description="The birth of the long-term amortizing mortgage. Designed to prevent mass foreclosure, but unintentionally locked families into interest-bearing contracts for life." 
                    icon={History}
                  />
                  <MilestoneCard 
                    year="1970" 
                    event="Ginnie Mae & Securitization" 
                    description="The moment mortgages became stock market products. Lenders stopped caring about your home and started caring about volume lending." 
                    icon={Target}
                  />
                </div>
              </div>
            </section>

            {/* QUIZ SECTION */}
            <section className="space-y-12">
               <div className="text-center space-y-4">
                  <h3 className="text-3xl font-fraunces font-black text-slate-900 tracking-tight"><TranslatedText>Terminology & Math Mastery Quiz</TranslatedText></h3>
                  <p className="text-lg text-slate-500 font-medium">Verify your mathematical conviction before moving to Module 2.</p>
               </div>
               <Quiz 
                  question="If a home costs $400,000, roughly how much will you pay in total interest over 30 years at 6.5%?"
                  options={["$100,000", "$250,000", "$509,000", "$909,000"]}
                  correctAnswer={2}
                  explanation="Interest is cumulative. Over 360 months, a 6.5% rate on $400k results in over $500,000 in interest profit for the bank."
               />
               <Quiz 
                  question="What does 'PITI' stand for in banking terminology?"
                  options={[
                    "Payment, Interest, Taxes, Income",
                    "Principal, Interest, Taxes, Insurance",
                    "Private Insurance, Total Interest",
                    "Principal, Installment, Term, Index"
                  ]}
                  correctAnswer={1}
                  explanation="PITI is the full 'bundle' of costs lenders use to show you an 'affordable' monthly payment."
               />
               <Quiz 
                  question="In Year 1 of a standard mortgage, roughly how much of your payment goes to Interest?"
                  options={["15%", "50%", "85%", "100%"]}
                  correctAnswer={2}
                  explanation="Amortization is front-loaded. Lenders take nearly 85% of early payments as profit before you pay down significant bricks."
               />
            </section>

            {/* GLOSSARY SECTION */}
            <section className="space-y-12">
               <div className="p-12 bg-white border-2 border-slate-100 rounded-[48px] shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><FileText className="h-6 w-6 text-blue-600" /> Module 1 Glossary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                     {[
                        { term: "Principal", def: "The actual amount you borrowed for the home." },
                        { term: "Interest", def: "The 'rent' you pay the bank to use their money." },
                        { term: "Total of Payments", def: "The true cost of the home (Principal + Total Interest)." },
                        { term: "Amortization", def: "The mathematical treadmill that ensures the bank gets paid first." },
                        { term: "PITI", def: "The bundle of P, I, Taxes, and Insurance." },
                        { term: "DTI", def: "Your debt compared to your income ratio." },
                        { term: "Secured Debt", def: "Debt tied to an asset (like your home)." },
                        { term: "Unsecured Debt", def: "Debt not tied to an asset (like credit cards)." },
                        { term: "Origination", def: "The creation of a new loan." },
                        { term: "Securitization", def: "Packaging loans together to sell to investors." },
                        { term: "MBS", def: "The stock market product made from your home loan." },
                        { term: "Front-Loading", def: "Applying interest charges primarily in the early years." }
                     ].map((g, i) => (
                        <div key={i} className="space-y-1">
                           <p className="font-black text-slate-900 text-sm uppercase tracking-wider">{g.term}</p>
                           <p className="text-sm text-slate-500 font-medium">{g.def}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            <div className="pt-20 border-t-4 border-blue-600 text-center space-y-8">
               <div className="inline-flex h-20 w-20 rounded-full bg-blue-600 items-center justify-center shadow-2xl shadow-blue-500/40">
                  <Check className="h-10 w-10 text-white" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-fraunces font-black text-slate-900">Module 1 Mastery Achieved</h2>
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

        {/* MODULE 2 AND BEYOND - Placeholder for expansion logic */}
        {id > 0 && (
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
          
          {(id < 13) && (
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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <CourseProvider>
      <LessonContent id={Number(id)} />
    </CourseProvider>
  );
}
