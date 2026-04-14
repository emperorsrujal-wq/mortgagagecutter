
'use client';
import React, { use, useState, useEffect } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { 
  InterestCalc, 
  AmortViz, 
  PayoffRace, 
  TruthCalculator, 
  QualificationCalc, 
  ScriptGenerator, 
  BankRateChart, 
  ContractSimulator, 
  AutomationSimulator, 
  WealthSimulator, 
  LadderVisual, 
  HyperdriveSim, 
  BiWeeklyCalc, 
  OffsetVisual 
} from '@/components/course/Calculators';
import { 
  CourseCard, 
  InfoBox, 
  ExpandSection, 
  StatBox, 
  ChatBubble, 
  TaskItem, 
  CaseStudy, 
  Quiz 
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
  Landmark, 
  ShieldAlert, 
  GraduationCap, 
  ArrowRight, 
  UserCircle2, 
  Timer, 
  Zap, 
  ShieldCheck,
  CreditCard,
  Activity,
  TrendingUp,
  Flame,
  MessageSquare,
  FileText,
  Search,
  Target,
  BarChart,
  Lock,
  Star,
  Award,
  Trophy,
  Download,
  History,
  Scale,
  Sparkles,
  TrendingDown,
  SearchCode,
  RefreshCcw,
  Layers,
  Globe,
  Play,
  Quote,
  ZapOff,
  BookOpen,
  DollarSign,
  Calculator,
  Clock,
  ArrowUpRight,
  Gavel,
  ScrollText,
  ListChecks
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/firebase';

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8ECF2]">
      <div className="h-1 bg-slate-100 w-full">
        <div 
          className="h-full bg-[#2563EB] transition-all duration-500" 
          style={{ width: `${(current / 8) * 100}%` }}
        />
      </div>
      <div className="max-w-[720px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/learn" className="flex items-center gap-2 text-[#5A6175] font-black text-sm">
          <HomeIcon className="h-4 w-4" />
          <span className="hidden sm:inline uppercase tracking-widest"><TranslatedText>Course Hub</TranslatedText></span>
        </Link>
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
          <TranslatedText>Secret</TranslatedText> {current} <TranslatedText>of</TranslatedText> 8
        </div>
        <div className="w-20" />
      </div>
    </div>
  );
}

function EpiphanyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 bg-blue-600 text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
        <Sparkles className="h-32 w-32" />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-black">!</div>
          <span className="font-black text-xs uppercase tracking-[0.3em] text-blue-200">The Epiphany</span>
        </div>
        <div className="text-xl font-bold leading-relaxed italic">
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
    else router.push('/questionnaire');
  };

  const prevLesson = () => {
    if (id > 1) router.push(`/learn/lesson/${id - 1}`);
    else router.push('/learn');
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-32">
      <ProgressBar current={id} />
      
      <div className="max-w-[800px] mx-auto px-4 py-16 space-y-24">
        
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
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Understanding the One-Way Street.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Before you can beat the bank's math, you must understand the rules of the game they built in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            {/* 1. CONCEPT */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Lego Loan</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you want to buy a giant $100 Lego set from a friend, but you only have $10. You go to a "Banker Friend" and borrow the other $90.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>They say: "Sure! Just pay me $10 a month for 12 months." You think, "Great! After 10 months, I've paid back the $100!"</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>But here is the catch...</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>The Banker Friend says the first $8 of every $10 payment is a "rental fee" for letting you use their money. Only $2 goes toward actually owning the Legos. This is how a mortgage works in the real world.</TranslatedText>
                  </p>
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

            {/* 2. TERMINOLOGY */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Key Terminology</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "Principal", desc: "This is the actual cost of your house. It is the 'Stuff' you are trying to own.", icon: <HomeIcon className="h-5 w-5 text-blue-500" /> },
                  { term: "Interest", desc: "This is the 'Rental Fee'. It is the money you pay the bank for the privilege of using their money.", icon: <DollarSign className="h-5 w-5 text-red-500" /> },
                  { term: "Amortization", desc: "A fancy word meaning 'killing the debt'. It is the long-term schedule (usually 25-30 years) to pay it all back.", icon: <Clock className="h-5 w-5 text-emerald-500" /> },
                  { term: "Front-Loading", desc: "The bank's strategy to make you pay almost all your interest in the first 15 years, before you pay for the house.", icon: <TrendingUp className="h-5 w-5 text-amber-500" /> },
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

            {/* 3. IMPORTANCE */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: The Treadmill</TranslatedText></h2>
              </div>
              
              <CourseCard className="border-l-[12px] border-l-red-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Activity className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Most homeowners in ${country.name} spend the first 10-15 years of their lives on a 'Financial Treadmill'. You are working hard, making big monthly payments, but your actual ownership of the house (Equity) barely moves.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`Because the system is 'Front-Loaded', the bank captures its profit first. If you sell your house after 7 years, you might find that you still owe almost exactly what you borrowed, despite paying thousands in interest. This is the 'Interest Trap'.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`The "Amortization Table" is likely the most expensive document you will ever sign. It is not a goal; it is a mathematical trap designed to harvest your labor for 30 years.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            {/* 4. ACTION */}
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
                <p className="text-lg text-slate-500 text-center font-medium">
                  <TranslatedText>Slide the timer to see how slowly your equity grows compared to the bank's interest profit in the early years.</TranslatedText>
                </p>
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
                <TranslatedText>{`Lenders in ${country.name} have a secret 'Report Card' they use to decide who gets the best tools. We're going to learn how to ace it.`}</TranslatedText>
              </p>
            </header>

            {/* 1. CONCEPT */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Heavy Backpack Test</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you want to borrow your friend's really fast racing bike. Your friend says, "I'll let you use it, but first I need to know if you're strong enough to pedal it up a steep hill."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>They put a heavy backpack on you and ask you to walk around. If you can walk easily, they know you're strong. If you struggle, they won't give you the bike because they're afraid you'll fall.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>In the bank's world, this is the "Stress Test."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>Lenders don't just want to know if you can pay your bills today. They want to know if you could still pay them if the world changed tomorrow. They measure this using a few secret numbers.</TranslatedText>
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

            {/* 2. TERMINOLOGY */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Key Terminology</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "DTI (Debt-to-Income)", desc: "Your 'Backpack Weight'. It is the percentage of your monthly income that goes toward paying back debts.", icon: <Scale className="h-5 w-5 text-blue-500" /> },
                  { term: "LTV (Loan-to-Value)", desc: "How much of the house the bank still owns versus how much you own. Most strategic tools require an LTV below 80%.", icon: <HomeIcon className="h-5 w-5 text-emerald-500" /> },
                  { term: "Stress Test", desc: `A mandatory calculation where ${country.name} lenders pretend your interest rate is 2% higher to see if you can still survive.`, icon: <Activity className="h-5 w-5 text-red-500" /> },
                  { term: "Tier 1 Credit", desc: "Your 'Behavior Report Card'. A score (usually above 740) that tells the bank you are a low-risk strategist, not a risky debtor.", icon: <ShieldCheck className="h-5 w-5 text-amber-500" /> },
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

            {/* 3. IMPORTANCE */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: The Key to the Vault</TranslatedText></h2>
              </div>
              
              <CourseCard className="border-l-[12px] border-l-blue-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Lock className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Lenders treat people differently based on their scorecard. If you look like a "Traditional Debtor" (high DTI, low credit), they will lock you in the 30-year amortized cage because it's profitable for them.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`But if you look like a "Strategist" (low DTI, high credit), they will give you the keys to the vault: the first-lien HELOCs, the Offset accounts, and the flexible credit lines we need to execute the Mortgage Cutter Method.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`Your Credit Score isn't a measure of wealth. It's a measure of how good you are at being a profitable, low-risk partner for major lenders. We're going to optimize your scorecard so you become too "safe" for them to ignore.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            {/* 4. ACTION */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Run Your Scorecard</TranslatedText></h2>
              </div>
              
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the "Lender Probability" simulator below. It uses ${country.name}'s specific regulatory limits to show you how a Senior Loan Officer sees your financial profile.`}</TranslatedText>
              </p>

              <QualificationCalc />

              <div className="p-8 bg-blue-50 border-4 border-dashed border-blue-200 rounded-[40px] text-center space-y-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-blue-600 fill-blue-600" />
                </div>
                <p className="text-xl text-blue-900 font-bold leading-relaxed">
                  <TranslatedText>{`💡 STRATEGY HACK: If your DTI is too high, focus on "Choking" small, high-interest debts first. Clearing a $500/mo car payment can drop your DTI significantly, instantly unlocking the 1%ers strategy.`}</TranslatedText>
                </p>
              </div>

              <Quiz 
                question="Why does the bank pretend your interest rate is 2% higher during the Stress Test?"
                options={[
                  "To make more money off you immediately",
                  "To see if you can still pay your mortgage if the economy changes",
                  "Because they are legally required to be mean to borrowers",
                  "It's a secret tax collected by the government"
                ]}
                correctAnswer={1}
                explanation={`In ${country.name}, the Stress Test is a safety buffer. Lenders want to ensure that if interest rates rise, you won't default on your loan. Aceing this test is the first step to securing a high-leverage strategic credit line.`}
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
                <TranslatedText>{`Not all banking tools are created equal. In this module, we identify the exact 'Super-Account' you need to execute the Mortgage Cutter strategy in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            {/* 1. CONCEPT */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Swiss Army Wallet</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>Imagine you're going on a long hike. A traditional mortgage is like a heavy bag that locks once you put something in it. If you need your money back for an emergency, you have to find a locksmith, pay a fee, and wait weeks.</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>A Strategic Arsenal tool (like a first-lien HELOC) is like a high-tech "Swiss Army Wallet." It's a bag that stays open. You put your money in to make it lighter (reducing interest), but you can reach in and take it out whenever you want.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>This is the difference between "Frozen Equity" and "Liquid Power."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>We want a tool that lets our paycheck hit the principal immediately, neutralizing the bank's daily math, while keeping that cash 100% accessible for our lives.</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Zap className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Strategic Shift</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">LIQUID</h3>
                    <p className="text-lg font-bold text-slate-400">Debt Reduction without Sacrifice</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. TERMINOLOGY */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Key Terminology</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "First-Lien Position", desc: "This means your strategic line is the ONLY loan on the house. It's not a 'second mortgage'; it's the primary engine.", icon: <Award className="h-5 w-5 text-blue-500" /> },
                  { term: "Revolving Credit", desc: "Unlike a mortgage that only goes down, this balance can go down (as you pay) and back up (as you spend) without a new application.", icon: <RefreshCcw className="h-5 w-5 text-emerald-500" /> },
                  { term: "Transactionality", desc: "The ability to pay bills, use a debit card, and write checks directly from the loan account.", icon: <CreditCard className="h-5 w-5 text-purple-500" /> },
                  { term: "Readvanceable", desc: `A standard in ${country.name} where your credit limit grows automatically as you pay down your principal.`, icon: <ArrowUpRight className="h-5 w-5 text-amber-500" /> },
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

            {/* 3. IMPORTANCE */}
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
                      <TranslatedText>{`Traditional banking forces you into a "One-Way Street." Once you send money to the mortgage, it's GONE. If you have an emergency, you're "House Rich and Cash Poor."`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`By utilizing a Strategic Arsenal tool, we turn the mortgage into a "Two-Way Street." Every dollar of your income hits the debt on Day 1, which stops the interest calculation. But if you need that dollar back for groceries or a repair, it's there. You've neutralised the bank's profit without losing your safety net.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`You don't need a lower interest rate to win. You need an "Open Valve" that lets your entire income flow against the principal balance 24 hours a day, 7 days a week.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            {/* 4. ACTION */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Screen Your Lenders</TranslatedText></h2>
              </div>
              
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Lenders in ${country.name} won't always offer these tools upfront. You have to speak their language. Use the Audit and Script below to find your partner.`}</TranslatedText>
              </p>

              <CourseCard title="The Strategic Must-Haves Checklist">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TaskItem id="must_1" label="First-Lien Refinance Capability" />
                  <TaskItem id="must_2" label="Full ATM/Check/Debit Access" />
                  <TaskItem id="must_3" label="Direct Paycheck Deposit Support" />
                  <TaskItem id="must_4" label="Simple Daily Interest (Not Tiered)" />
                  <TaskItem id="must_5" label="Zero Prepayment Penalties" />
                  <TaskItem id="must_6" label="10-Year (Minimum) Draw Period" />
                </div>
              </CourseCard>

              <div className="space-y-8">
                <h3 className="text-3xl font-fraunces font-black text-center text-slate-900"><TranslatedText>The Negotiation Script</TranslatedText></h3>
                <ScriptGenerator />
              </div>

              <div className="space-y-8 pt-12">
                <h3 className="text-3xl font-fraunces font-black text-center text-slate-900"><TranslatedText>Arsenal vs. Retail Rates</TranslatedText></h3>
                <p className="text-lg text-slate-500 text-center font-medium">
                  <TranslatedText>{`Even if an Arsenal tool has a slightly higher rate, the daily velocity logic saves you more total interest than a standard low-rate mortgage.`}</TranslatedText>
                </p>
                <BankRateChart />
              </div>

              <Quiz 
                question="What is the most important feature of a Strategic Arsenal tool?"
                options={[
                  "Having the lowest possible interest rate",
                  "A fancy metal debit card",
                  "First-lien position with full transactionality",
                  "A branch located within 5 miles of your home"
                ]}
                correctAnswer={2}
                explanation={`To execute the Mortgage Cutter strategy, you MUST be able to deposit your entire income directly into the loan and pay your life's expenses from it. This requires a first-position line with checking features.`}
              />
            </section>
          </div>
        )}

        {/* LESSON 4: THE LEGAL LOOPHOLE (PREMIUM) */}
        {id === 4 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            {isLocked ? (
              <section className="text-center space-y-10 py-20">
                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-5xl font-fraunces font-black text-slate-900 leading-tight">
                  <TranslatedText>Unlock the Private Vault</TranslatedText>
                </h2>
                <p className="text-xl text-slate-500 max-w-xl mx-auto">
                  <TranslatedText>The Legal Loophole, Automated Heist, and 1% Scaling modules are reserved for Mortgage Cutter Pro members. Stop being a tenant and start being the bank.</TranslatedText>
                </p>
                <Button size="lg" className="h-16 px-12 text-xl font-black rounded-2xl shadow-2xl shadow-blue-500/20" asChild>
                  <Link href="/purchase?plan=pro_197">Unlock The Full Blueprint ($197)</Link>
                </Button>
              </section>
            ) : (
              <>
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

                {/* 1. CONCEPT */}
                <section className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                    <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Magic Library Card</TranslatedText></h2>
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
                      <p>
                        <TranslatedText>We are looking for the specific legal language that turns your house from a locked cage into a flexible tool that lets your money move in and out like a two-way street.</TranslatedText>
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

                {/* 2. TERMINOLOGY */}
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
                      { term: "Seasoning", desc: "A bank rule that says you must wait (usually 6-12 months) before they will let you use your new home value for more credit.", icon: <Timer className="h-5 w-5 text-amber-500" /> },
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

                {/* 3. IMPORTANCE */}
                <section className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                    <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: The Escape Hatch</TranslatedText></h2>
                  </div>
                  
                  <CourseCard className="border-l-[12px] border-l-amber-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                      <ListChecks className="h-96 w-96" />
                    </div>
                    <div className="relative z-10 space-y-10">
                      <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                        <p>
                          <TranslatedText>{`Most homeowners in ${country.name} sign their contracts without reading the "Payment Application" clause. This clause usually says: "We apply your money to interest first, then escrow, then insurance... and IF there is anything left, we'll let you have some principal."`}</TranslatedText>
                        </p>
                        <p>
                          <TranslatedText>{`By decoding the contract and finding the "Open Loophole," we flip the script. We find the tools where the law REQUIRES the bank to apply your deposit to the principal balance IMMEDIATELY. This one sentence is the difference between a 30-year sentence and a 7-year sprint.`}</TranslatedText>
                        </p>
                      </div>
                    </div>
                  </CourseCard>

                  <EpiphanyBox>
                    <TranslatedText>{`The "Loophole" isn't a secret law—it's a structural choice. You are choosing to move your debt from a "Closed Amortized Shell" into an "Open Daily Calculation." The bank can't stop you if you know what to ask for.`}</TranslatedText>
                  </EpiphanyBox>
                </section>

                {/* 4. ACTION */}
                <section className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                    <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: The Math Audit</TranslatedText></h2>
                  </div>
                  
                  <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                    <TranslatedText>{`Use the "True Cost" simulator below. It reveals the "Total Interest Percentage" (TIP) that your lender is legally required to show you, but often hides in the back of the package.`}</TranslatedText>
                  </p>

                  <ContractSimulator />

                  <div className="p-8 bg-amber-50 border-4 border-dashed border-amber-200 rounded-[40px] text-center space-y-4">
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                      <SearchCode className="h-6 w-6 text-amber-600 fill-amber-600" />
                    </div>
                    <p className="text-xl text-amber-900 font-bold leading-relaxed">
                      <TranslatedText>{`🚨 AUDIT WARNING: If your current TIP is over 90%, you are in a "Max Harvest" contract. Your first priority is to move your debt into a structure with a TIP under 40% using the Mortgage Cutter method.`}</TranslatedText>
                    </p>
                  </div>

                  <Quiz 
                    question="What is a 'Prepayment Penalty' in a mortgage contract?"
                    options={[
                      "A reward for paying your bills on time",
                      "A fee the bank charges you for paying off your loan too fast",
                      "The interest rate you pay every month",
                      "A mandatory tax paid to the local government"
                    ]}
                    correctAnswer={1}
                    explanation={`In ${country.name}, some lenders use prepayment penalties to stop you from escaping the interest trap. We always seek "Zero Penalty" contracts to maintain our speed and freedom.`}
                  />
                </section>
              </>
            )}
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

            {/* 1. CONCEPT */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Leaking Bathtub</TranslatedText></h2>
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

            {/* 2. TERMINOLOGY */}
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

            {/* 3. IMPORTANCE */}
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
                      <TranslatedText>{`Most homeowners in ${country.name} think the 'Interest Rate' is the most important number. They are wrong. The most important factor is the TIME that the bank is allowed to charge you interest on your money.`}</TranslatedText>
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

            {/* 4. ACTION */}
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

        {/* LESSON 6: THE 1% MULTIPLIER (PREMIUM) */}
        {id === 6 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            {isLocked ? (
              <section className="text-center space-y-10 py-20">
                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-5xl font-fraunces font-black text-slate-900 leading-tight">
                  <TranslatedText>Unlock the Private Vault</TranslatedText>
                </h2>
                <p className="text-xl text-slate-500 max-w-xl mx-auto">
                  <TranslatedText>The 1% Multiplier, The Escape Hatch, and The Proof modules are reserved for Mortgage Cutter Pro members. Start building your portfolio empire today.</TranslatedText>
                </p>
                <Button size="lg" className="h-16 px-12 text-xl font-black rounded-2xl shadow-2xl shadow-blue-500/20" asChild>
                  <Link href="/purchase?plan=pro_197">Unlock The Full Blueprint ($197)</Link>
                </Button>
              </section>
            ) : (
              <>
                <header className="space-y-10 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-amber-200">
                    <Star className="h-4 w-4" />
                    <TranslatedText>Mastery Level: 06 — Portfolio Scaling</TranslatedText>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                    <TranslatedText>The 1% Multiplier:</TranslatedText>
                    <span className="block text-blue-600 italic mt-4"><TranslatedText>Scaling Your Empire.</TranslatedText></span>
                  </h1>
                  <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                    <TranslatedText>{`Debt reduction was just the beginning. Now we use the bank's own inventory to build your wealth fortress in ${country.name}.`}</TranslatedText>
                  </p>
                </header>

                {/* 1. CONCEPT */}
                <section className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                    <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: Green Houses to Red Hotels</TranslatedText></h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                      <p>
                        <TranslatedText>In the game of Monopoly, you win by turning "Green Houses" into "Red Hotels." A traditional mortgage only lets you have one green house, and you must pay for it for 30 years before you can get another one.</TranslatedText>
                      </p>
                      <p>
                        <TranslatedText>The "1% Multiplier" strategy treats your home equity as a "Storage Tank" of capital. As you drop your principal using velocity, the tank fills up with available credit.</TranslatedText>
                      </p>
                      <p className="text-blue-600 font-black italic">
                        <TranslatedText>You then "Recycle" that capital.</TranslatedText>
                      </p>
                      <p>
                        <TranslatedText>Instead of letting your money sit "dead" in a wall, you deploy it to acquire another asset. Now, you have TWO properties, and your income chokes the interest on both simultaneously. This is how empires are built from a single paycheck.</TranslatedText>
                      </p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Layers className="h-32 w-32 text-blue-400" /></div>
                      <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Multiplier Effect</p>
                        <h3 className="text-6xl font-black text-white tracking-tighter">RECYCLE</h3>
                        <p className="text-lg font-bold text-slate-400">Capital Mobility Mastery</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. TERMINOLOGY */}
                <section className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                    <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { term: "LTV Buffer", desc: `The safe "Safety Net" of equity (usually 20%) that we never touch. In ${country.name}, we only deploy capital that exists above this line.`, icon: <ShieldCheck className="h-5 w-5 text-blue-500" /> },
                      { term: "Yield Spread", desc: "The gap between the interest you pay the bank (e.g., 6%) and the return you earn on your new asset (e.g., 10%). The 1%er lives in this gap.", icon: <TrendingUp className="h-5 w-5 text-emerald-500" /> },
                      { term: "Asset Velocity", desc: "The speed at which an investment returns your original capital so you can use it again for the next property.", icon: <Zap className="h-5 w-5 text-amber-500" /> },
                      { term: "Readvanceable Limit", desc: "A feature where every dollar of principal paid on Property A instantly becomes available to borrow for Property B.", icon: <ArrowUpRight className="h-5 w-5 text-purple-500" /> },
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

                {/* 3. IMPORTANCE */}
                <section className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                    <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Why This Matters: Financial Sovereignty</TranslatedText></h2>
                  </div>
                  
                  <CourseCard className="border-l-[12px] border-l-amber-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                      <Trophy className="h-96 w-96" />
                    </div>
                    <div className="relative z-10 space-y-10">
                      <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                        <p>
                          <TranslatedText>{`Most homeowners in ${country.name} spend their entire lives trying to "Get Out of Debt." The 1% Multiplier shifts the goal to "Building an Empire."`}</TranslatedText>
                        </p>
                        <p>
                          <TranslatedText>{`When you realize that your home equity is just "Frozen Cash" that the bank is charging you to store, you stop being a tenant and start being the manager of your own capital. By keeping your capital liquid and moving it into higher-yielding assets, you achieve financial freedom 20 years sooner than those who just make extra monthly payments.`}</TranslatedText>
                        </p>
                      </div>
                    </div>
                  </CourseCard>

                  <EpiphanyBox>
                    <TranslatedText>{`Wealth isn't created by working for money. It's created by having your capital work for you. Once your home equity is liquid, every brick in your house becomes a soldier in your financial army.`}</TranslatedText>
                  </EpiphanyBox>
                </section>

                {/* 4. ACTION */}
                <section className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">4</div>
                    <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Model Your Scaling</TranslatedText></h2>
                  </div>
                  
                  <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                    <TranslatedText>{`Use the "Leverage Simulator" below to see how deploying just a portion of your unlocked equity can generate more wealth in 10 years than 30 years of traditional saving.`}</TranslatedText>
                  </p>

                  <WealthSimulator />

                  <div className="space-y-8 pt-12">
                    <h3 className="text-3xl font-fraunces font-black text-center text-slate-900"><TranslatedText>The Property Ladder Blueprint</TranslatedText></h3>
                    <p className="text-lg text-slate-500 text-center font-medium">
                      <TranslatedText>{`See the exact sequence used to turn one primary residence into a $3M+ portfolio in under 15 years.`}</TranslatedText>
                    </p>
                    <LadderVisual />
                  </div>

                  <Quiz 
                    question="What is the main danger of 'Dead Equity' sitting in your home?"
                    options={[
                      "It might get stolen by a neighbor",
                      "It earns 0% return while your loan costs you 6%+",
                      "It makes the house too heavy for the foundation",
                      "It attracts unwanted taxes from the city"
                    ]}
                    correctAnswer={1}
                    explanation={`In ${country.name}, home equity is an illiquid asset. If it sits in your walls while you carry a mortgage, you are paying the bank interest for the privilege of storing your own wealth. The 1% Multiplier unlocks this cash to work for you.`}
                  />
                </section>
              </>
            )}
          </div>
        )}

        {/* LESSON 7: THE ESCAPE HATCH (PREMIUM) */}
        {id === 7 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-red-200">
                <Rocket className="h-4 w-4" />
                <TranslatedText>Final Phase: Max Velocity</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Escape Hatch:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Collapsing Time Itself.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`It's time to trigger the final 'Hyperdrive'. By combining 'Principal Chunks' with 'Offset Timing', we're going to shave decades off your term.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <OffsetVisual />

              <HyperdriveSim />

              <BiWeeklyCalc />
            </section>
          </div>
        )}

        {/* LESSON 8: THE PROOF */}
        {id === 8 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10 shadow-xl">
                <Globe className="h-4 w-4 text-blue-400" />
                <TranslatedText>{`The Global Movement`}</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Proof:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Joining the 39 Million.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`In the top 1%, this model is the standard. Today, you are joining the movement of homeowners who actually understand the math.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white border-2 border-slate-100 p-10 rounded-[40px] shadow-xl text-center space-y-6">
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <History className="h-10 w-10 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Historical Standard</p>
                    <h3 className="text-6xl font-black text-slate-900 tracking-tighter">100%</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Open Credit Adoption Pre-1913</p>
                  </div>
                </Card>
                <Card className="bg-blue-600 text-white p-10 rounded-[40px] shadow-2xl text-center space-y-6 border-none">
                  <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Modern Day</p>
                    <h3 className="text-6xl font-black tracking-tighter">90%</h3>
                    <p className="text-sm font-bold uppercase tracking-widest mt-2">Of Professional Investors</p>
                  </div>
                </Card>
              </div>

              <section className="bg-gradient-to-br from-blue-700 to-indigo-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16 text-center">
                <div className="space-y-8">
                  <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                    <Award className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                    <TranslatedText>Mastery Achieved</TranslatedText>
                  </h2>
                  <p className="text-blue-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>{`You have completed the core Mortgage Freedom Accelerator. Go build your empire.`}</TranslatedText>
                  </p>
                </div>

                <div className="pt-16 border-t border-white/10 text-center space-y-10">
                  <button 
                    onClick={() => router.push('/members/chunker')}
                    className="bg-white text-blue-900 hover:bg-blue-50 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <TranslatedText>Launch My Wealth Simulator</TranslatedText>
                    <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              </section>
            </section>
          </div>
        )}

        <div className="flex items-center justify-between pt-20 border-t-2 border-[#E8ECF2]">
          <button 
            onClick={prevLesson}
            className="flex items-center gap-4 text-[#5A6175] hover:text-[#1A1D26] font-black transition-all group text-xl"
          >
            <ChevronLeft className="h-8 w-8 group-hover:-translate-x-2 transition-transform" />
            <TranslatedText>Previous Secret</TranslatedText>
          </button>
          
          {(id < 8 && (!isLocked || isPrivileged)) && (
            <button 
                onClick={nextLesson}
                className="group flex items-center gap-4 bg-[#2563EB] text-white px-12 py-6 rounded-[24px] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 text-2xl"
            >
                <TranslatedText>{id === 3 ? "Unlock The Vault" : "Next Secret"}</TranslatedText>
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
