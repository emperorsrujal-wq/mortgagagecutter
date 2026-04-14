
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
  Home, 
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
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/firebase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
          <Home className="h-4 w-4" />
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

  const stories = [
    { name: "The Millers", location: "Austin, TX", outcome: "Paid off $312k in 4.2 years", saving: "$142,000", quote: "We cut 19 years off our 30-year fixed. No extra income, just velocity." },
    { name: "Sarah & Dave", location: "Toronto, ON", outcome: "6-Year Payoff on $540k", saving: "$84,000", quote: "The STEP hack was the missing link. Our bank didn't want us to know." },
    { name: "James P.", location: "London, UK", outcome: "Mortgage Free in 7 Years", saving: "£62,000", quote: "Offsetting our daily cash changed the math. The bank now owes us." },
    { name: "The Nguyens", location: "Sydney, AU", outcome: "3rd Property Debt-Free", saving: "$210,000", quote: "90% of multi-owners here use this. It's the standard for the 1%." }
  ];

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
                  { term: "Principal", desc: "This is the actual cost of your house. It is the 'Stuff' you are trying to own.", icon: <Home className="h-5 w-5 text-blue-500" /> },
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
                <TranslatedText>{`Use the 'Evidence Locker' below to see exactly how much 'Invisible Rent' you are currently paying to ${country.banks[0]} every single hour of every single day.`}</TranslatedText>
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
                <TranslatedText>Phase 1: The Internal Audit</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Secret Scorecard:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Mastering the Stress Test.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`In ${country.name}, lenders use a specific 'Stress Test' logic. We're going to flip the script and use their own math to force them to give you the keys to the vault.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                <h3 className="text-3xl font-black text-slate-900"><TranslatedText>The Physics of Approval</TranslatedText></h3>
                <p>
                  <TranslatedText>{`Lenders in ${country.name} don't just look at your income. They look at your 'Debt Velocity'. They want to see that your income is a stable dam, and your debts are small enough not to burst it.`}</TranslatedText>
                </p>
              </div>

              <QualificationCalc />

              <EpiphanyBox>
                <TranslatedText>{`Your Credit Score isn't a measure of wealth. It's a measure of how good you are at being a profitable customer for major lenders. We're going to optimize your score so you become too 'safe' for them to ignore.`}</TranslatedText>
              </EpiphanyBox>

              <InfoBox title="The DTI Loophole" color="emerald">
                <p><TranslatedText>{`Did you know that by moving high-interest credit card debt into a lower-interest vehicle, you can drop your DTI (Debt-to-Income) ratio by up to 15 points in 30 days? This is the first step to qualifying for the 1%ers strategy.`}</TranslatedText></p>
              </InfoBox>
            </section>
          </div>
        )}

        {/* LESSON 3: THE HIDDEN VAULT */}
        {id === 3 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-purple-200">
                <Search className="h-4 w-4" />
                <TranslatedText>Phase 2: The Acquisition</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Hidden Vault:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Finding Your Strategic Partner.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Retail banks will often try to keep you in their '30-year cage'. To break free, you have to speak the language of Private Wealth and find the right tool.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                <h3 className="text-3xl font-black text-slate-900"><TranslatedText>The Banker Archetypes</TranslatedText></h3>
                <p>
                  <TranslatedText>{`There are two types of lenders in ${country.name}. There are 'Retail Giants' who want you in a standard amortization path. And then there are 'Strategic Partners'—often local credit unions or Private Wealth divisions—who offer the tools we need.`}</TranslatedText>
                </p>
              </div>

              <CourseCard title="The Strategic Must-Haves">
                <ul className="space-y-4">
                  <TaskItem id="must_1" label="First-Lien Position (The Keys to the Kingdom)" />
                  <TaskItem id="must_2" label="Full Transactionality (Debit/Checks/Bill Pay)" />
                  <TaskItem id="must_3" label="Direct Deposit Capability (Auto-Liquidation)" />
                  <TaskItem id="must_4" label="No-Fee Principal Paydown (Zero Resistance)" />
                </ul>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`When you call a bank, don't just ask for a mortgage. Ask for a 'Flexible Equity Line with Full Transactionality'. This signals that you aren't a regular consumer—you're a strategist.`}</TranslatedText>
              </EpiphanyBox>

              <div className="space-y-8">
                <h3 className="text-3xl font-black text-slate-900 text-center"><TranslatedText>The Negotiation Script</TranslatedText></h3>
                <ScriptGenerator />
              </div>

              <BankRateChart />
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
                    <SearchCode className="h-4 w-4" />
                    <TranslatedText>Phase 3: The Decoding</TranslatedText>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                    <TranslatedText>The Legal Loophole:</TranslatedText>
                    <span className="block text-blue-600 italic mt-4"><TranslatedText>Finding the 'Two-Way' Street.</TranslatedText></span>
                  </h1>
                  <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                    <TranslatedText>{`Lenders love to hide 'Kill Switches' in the fine print. We're going to find them and disarm them before you sign.`}</TranslatedText>
                  </p>
                </header>

                <section className="space-y-16">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <h3 className="text-3xl font-black text-slate-900"><TranslatedText>Spotting the TIP Scam</TranslatedText></h3>
                    <p>
                      <TranslatedText>{`Check your regulatory disclosure for the 'Total Interest Percentage' (TIP). If it's over 90%, you are in a front-loaded trap. A strategic line should reflect a lower effective cost over time because YOU control the balance.`}</TranslatedText>
                    </p>
                  </div>

                  <ContractSimulator />

                  <EpiphanyBox>
                    <TranslatedText>{`A traditional mortgage is a 'One-Way Street'. Money goes in, but it never comes out without another loan application. A strategic line is a 'Two-Way Street'. You use it, you pay it, you reuse it. You are now the controller of your own liquidity.`}</TranslatedText>
                  </EpiphanyBox>
                </section>
              </>
            )}
          </div>
        )}

        {/* LESSON 5: THE AUTOMATED HEIST (PREMIUM) */}
        {id === 5 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-200">
                <RefreshCcw className="h-4 w-4" />
                <TranslatedText>Phase 4: Execution</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Automated Heist:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Putting the Bank on Autopilot.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`We want your paycheck hitting the principal on Day 1 without you lifting a finger. This is the moment the bank starts working for YOU.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <AutomationSimulator />

              <EpiphanyBox>
                <TranslatedText>{`Think of your debt like a leaking bathtub. Traditional banking keeps the water level high. Our automation 'dumps the bucket' (your income) in immediately, stopping the interest 'drain' before it can even start for the month.`}</TranslatedText>
              </EpiphanyBox>
            </section>
          </div>
        )}

        {/* LESSON 6: THE 1% MULTIPLIER (PREMIUM) */}
        {id === 6 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-amber-200">
                <Star className="h-4 w-4" />
                <TranslatedText>Phase 5: Scaling</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The 1% Multiplier:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Scaling Your Empire.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Debt reduction was just the beginning. Now we use the bank's own inventory to build your wealth fortress.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <WealthSimulator />

              <EpiphanyBox>
                <TranslatedText>{`Once your home is a 'Two-Way Street', you have a permanent source of low-cost capital. You can deploy it for investments or property scaling. You aren't just saving money; you're creating a wealth machine.`}</TranslatedText>
              </EpiphanyBox>

              <LadderVisual />
            </section>
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
