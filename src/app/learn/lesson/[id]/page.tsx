
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
  HomeIcon, 
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
  Play
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
          <TranslatedText>Lesson</TranslatedText> {current} <TranslatedText>of</TranslatedText> 8
        </div>
        <div className="w-20" />
      </div>
    </div>
  );
}

function LessonContent({ id }: { id: number }) {
  const { country, completeLesson } = useCourse();
  const { user } = useUser();
  const meta = lessonMeta.find(l => l.id === id);
  const router = useRouter();

  if (!meta) return <div>Lesson not found</div>;

  const isPrivileged = user?.email === 'emperorsrujal@gmail.com';
  // Modules 4 through 8 are Premium
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
    { name: "The Nguyens", location: "Sydney, AU", outcome: "3rd Property Debt-Free", saving: "$210,000", quote: "90% of multi-owners here use this. It's the standard for the 1%." },
    { name: "Robert L.", location: "Denver, CO", outcome: "Cut 15 years off term", saving: "$110,000", quote: "The bi-weekly game was a joke compared to the First-Lien HELOC." },
    { name: "Amandeep K.", location: "Brampton, ON", outcome: "Saved 8 years of life", saving: "$72,000", quote: "Direct deposit automation made it invisible. We don't even think about it." },
    { name: "Maria G.", location: "Miami, FL", outcome: "Debt-free at 45", saving: "$155,000", quote: "We were trapped in the amortization curve until we pivot to an Open System." },
    { name: "Steve B.", location: "Melbourne, AU", outcome: "Portfolio built on equity", saving: "$190,000", quote: "Zero out-of-pocket cash for my next three rentals. Velocity is king." }
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-32">
      <ProgressBar current={id} />
      
      <div className="max-w-[800px] mx-auto px-4 py-16 space-y-24">
        
        {/* LESSON 1: THE INTEREST TRAP */}
        {id === 1 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-200">
                <Landmark className="h-4 w-4" />
                <TranslatedText>{`Exclusive for ${country.name} Homeowners`}</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>{`Why ${country.banks[0]} & ${country.banks[1]} Hide This:`}</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Payoff in 5-7 Years, Same Income.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Master the "Open Credit" secret that bypasses the ${country.amortYears}-year amortization trap used by the top 1%.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <CourseCard className="border-l-[12px] border-l-blue-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <UserCircle2 className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                      <Star className="h-8 w-8 fill-blue-600" />
                    </div>
                    <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] leading-tight">
                      <TranslatedText>The Banker Dinner Reveal</TranslatedText>
                    </h2>
                  </div>
                  
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p className="italic border-l-4 border-slate-200 pl-8 py-2">
                      <TranslatedText>{`Years ago, I sat across from a senior executive at ${country.banks[0]}. After a few drinks, he admitted something that changed my life: "We don't want you to pay off your home. We want you to maintain it for us while we harvest your labor through the amortization curve."`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`Most ${country.name} homeowners believe their mortgage is a straightforward loan. It's actually a "One-Way Street." Your bank has designed a system where money flows IN, but never OUT without a high-fee renegotiation. They call this "Truth In Lending" (TIL), but the real truth is buried in the math of front-loaded interest.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <InterestCalc />

              <Quiz 
                question="Why is a First-Lien HELOC/Offset cheaper than a mortgage even if the rate is slightly higher?"
                options={[
                  "Because it uses a special government subsidy for homeowners",
                  "It recalculates interest daily on your net balance (Income - Expenses)",
                  "Banks give a 50% discount to people who sign the 'Truth' waiver",
                  "It allows you to skip your property tax payments"
                ]}
                correctAnswer={1}
                explanation="Mortgages are 'One-Way' systems where interest is front-loaded on the full balance. An Open System (HELOC/Offset) calculates interest DAILY only on the money you actually owe after your paycheck hits. This is the structural arbitrage that saves thousands."
              />
            </section>
          </div>
        )}

        {/* LESSON 2: QUALIFICATION BLUEPRINT */}
        {id === 2 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                <TranslatedText>Step 1: The Lender Audit</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>{`Pass the ${country.name} Stress Test`}</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Before you call ${country.banks[0]}, you must audit your numbers. In ${country.name}, lenders use specific "Debt-to-Income" (DTI) math that determines your fate.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <InfoBox title="The Golden Ratios" color="emerald">
                <p><TranslatedText>{`In ${country.name}, the magic number is ${country.dtiLimit}%. If your total debt obligations (Mortgage + Taxes + Cards + Loans) exceed this percentage of your gross income, the bank sees you as a risk. Our first goal is to 'cleanse' your report to pass this threshold.`}</TranslatedText></p>
              </InfoBox>

              <QualificationCalc />

              <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                <h3 className="text-3xl font-black text-slate-900"><TranslatedText>The Credit Dispute Hack</TranslatedText></h3>
                <p><TranslatedText>{`Did you know that ${country.name} homeowners can often boost their score by 50 points in 30 days just by auditing their report? We teach our members how to identify 'Zombie Debts' that artificially inflate their DTI, allowing them to qualify for the high-LTV products required for this method.`}</TranslatedText></p>
              </div>
            </section>
          </div>
        )}

        {/* LESSON 3: LENDER HUNT & SCRIPTS */}
        {id === 3 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-purple-200">
                <Search className="h-4 w-4" />
                <TranslatedText>Step 2: The Search</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>How to Talk to Lenders</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`99% of loan officers at ${country.banks[0]} will try to sell you a traditional mortgage. You need to speak the 'Private Wealth' language to get what you actually need.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <CourseCard title="The 'Strategic' Must-Haves">
                <ul className="space-y-4">
                  <TaskItem id="must_1" label="First-Lien Position (Non-Negotiable)" />
                  <TaskItem id="must_2" label="Full Transactionality (Debit/Checks)" />
                  <TaskItem id="must_3" label="Direct Deposit Capability" />
                  <TaskItem id="must_4" label="No-Fee Principal Paydown" />
                </ul>
              </CourseCard>

              <div className="space-y-8">
                <h3 className="text-3xl font-black text-slate-900 text-center"><TranslatedText>The Script</TranslatedText></h3>
                <ScriptGenerator />
              </div>

              <BankRateChart />
            </section>
          </div>
        )}

        {/* LESSON 4: CONTRACT DECODER (PREMIUM) */}
        {id === 4 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            {isLocked ? (
              <section className="text-center space-y-10 py-20">
                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-5xl font-fraunces font-black text-slate-900 leading-tight">
                  <TranslatedText>Premium Access Required</TranslatedText>
                </h2>
                <p className="text-xl text-slate-500 max-w-xl mx-auto">
                  <TranslatedText>The Contract Decoder and advanced automation modules are reserved for Mortgage Cutter Pro members. Unlock the full strategy to continue.</TranslatedText>
                </p>
                <Button size="lg" className="h-16 px-12 text-xl font-black rounded-2xl shadow-2xl shadow-blue-500/20" asChild>
                  <Link href="/purchase?plan=pro_197">Unlock All Lessons ($197)</Link>
                </Button>
              </section>
            ) : (
              <>
                <header className="space-y-10 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-amber-200">
                    <SearchCode className="h-4 w-4" />
                    <TranslatedText>Step 3: Audit</TranslatedText>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                    <TranslatedText>The Contract Decoder</TranslatedText>
                  </h1>
                  <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                    <TranslatedText>{`Lenders in ${country.name} love to hide 'Prepayment Penalties' and 'Draw Period Freezes' in the fine print. Let's find them.`}</TranslatedText>
                  </p>
                </header>

                <section className="space-y-16">
                  <CourseCard title="Spotting the TIP Scam">
                    <p className="text-xl"><TranslatedText>{`Check your ${country.regulatedBy} disclosure for the 'Total Interest Percentage' (TIP). If it's over 90%, you are in a front-loaded trap. A strategic line should reflect a True Effective APR that is significantly lower over time.`}</TranslatedText></p>
                  </CourseCard>

                  <ContractSimulator />

                  <Quiz 
                    question="Which of these clauses is a 'Kill Switch' for our method?"
                    options={[
                      "Adjustable Interest Rate",
                      "Prepayment Penalty over $500",
                      "Annual Maintenance Fee under $100",
                      "Mandatory Title Insurance"
                    ]}
                    correctAnswer={1}
                    explanation="A prepayment penalty is the bank's way of locking you into the interest trap. If you pay off your loan too fast, they lose profit—so they charge you a fee to stop you. Avoid any product with significant penalties."
                  />
                </>
            )}
          </div>
        )}

        {/* LESSON 5: BILLING & AUTOMATION (PREMIUM) */}
        {id === 5 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-200">
                <RefreshCcw className="h-4 w-4" />
                <TranslatedText>Execution Phase</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>Billing & Automation</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Strategy is 10% math, 90% automation. In ${country.name}, we want your paycheck hitting the principal on Day 1 without you lifting a finger.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <AutomationSimulator />

              <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                <h3 className="text-3xl font-black text-slate-900"><TranslatedText>The 'Bathtub' Principle</TranslatedText></h3>
                <p><TranslatedText>{`Think of your debt like a leaking bathtub. The bank's interest is the drain. Traditional banking keeps the water level high. Our automation 'dumps the bucket' (income) in immediately, dropping the level and stopping the drain for the majority of the month.`}</TranslatedText></p>
              </div>

              <CourseCard title="Regional Automation Setup">
                <ExpandSection title={country.name === 'USA' ? "Setting up your 'Sweep' Account" : "Configuring Direct Deposit Strategy"}>
                  <p><TranslatedText>{`In ${country.name}, the most efficient setup is linking your ${country.productShort} directly to your primary checking and enabling an 'Automatic Sweep.' This ensures every dollar above your daily 'operating floor' hits the principal instantly.`}</TranslatedText></p>
                </ExpandSection>
              </CourseCard>
            </section>
          </div>
        )}

        {/* LESSON 6: 7 HELOC SECRETS (PREMIUM) */}
        {id === 6 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-amber-200">
                <Star className="h-4 w-4" />
                <TranslatedText>Advanced Velocity</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>7 HELOC Secrets</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`These are the high-leverage tactics used by the top 1% of property owners in ${country.name} to scale their portfolios.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CourseCard title="Secret 1: Appraisal Arbitrage">
                  <p className="text-sm"><TranslatedText>Use AVM (Automated Valuation Models) to spike your equity limits before a physical appraisal is even ordered. This often unlocks an extra $20k-$50k in credit capacity.</TranslatedText></p>
                </CourseCard>
                <CourseCard title="Secret 2: Freeze Immunity">
                  <p className="text-sm"><TranslatedText>Learn the 'Second-Line Bridge' technique. By maintaining a backup line with a local credit union, you ensure liquidity even if a national bank freezes your primary line during a downturn.</TranslatedText></p>
                </CourseCard>
              </div>

              <WealthSimulator />

              <LadderVisual />
            </section>
          </div>
        )}

        {/* LESSON 7: HELOC HYPERDRIVE (PREMIUM) */}
        {id === 7 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-red-200">
                <Rocket className="h-4 w-4" />
                <TranslatedText>Max Speed</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>HELOC Hyperdrive</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`It's time to collapse the timeline. By combining 'Chunks' with 'Offset' timing, we can achieve a 43% faster payoff than standard velocity.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <OffsetVisual />

              <HyperdriveSim />

              <BiWeeklyCalc />

              <div className="p-12 bg-slate-900 text-white rounded-[64px] border border-white/10 shadow-2xl text-center space-y-6">
                <Award className="h-16 w-16 text-yellow-400 mx-auto" />
                <h3 className="text-4xl font-black tracking-tight"><TranslatedText>The 90-Day Execution Plan</TranslatedText></h3>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  <TranslatedText>You've mastered the math. Now, download your 90-day planner to execute your first 'Chunk' and start your journey to a debt-free life.</TranslatedText>
                </p>
                <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/5 font-bold">
                  <Download className="mr-2 h-5 w-5" /> Download Execution Planner (PDF)
                </Button>
              </div>
            </section>
          </div>
        )}

        {/* LESSON 8: THE PROOF */}
        {id === 8 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10 shadow-xl">
                <Globe className="h-4 w-4 text-blue-400" />
                <TranslatedText>{`The Global ${country.name} Movement`}</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>{`39 Million People`}</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Have Already Beaten the Bank.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`In ${country.name}, the "Open Credit" model was the standard until the shift to amortized traps. Today, the top 1% still use it. Now, you can too.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white border-2 border-slate-100 p-10 rounded-[40px] shadow-xl text-center space-y-6">
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <History className="h-10 w-10 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Pre-1913 Era</p>
                    <h3 className="text-6xl font-black text-slate-900 tracking-tighter">100%</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Open Credit Adoption</p>
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"Before modern amortization, homes were bought with simple interest velocity. No traps."</p>
                </Card>
                <Card className="bg-blue-600 text-white p-10 rounded-[40px] shadow-2xl text-center space-y-6 border-none">
                  <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Current {country.name}</p>
                    <h3 className="text-6xl font-black tracking-tighter">90%</h3>
                    <p className="text-sm font-bold uppercase tracking-widest mt-2">Of Multi-Home Owners</p>
                  </div>
                  <p className="text-sm opacity-80 font-medium leading-relaxed">
                    <TranslatedText>{`While retail consumers use the 30-year trap, professional investors in ${country.name} use the Offset/HELOC velocity model to scale empires.`}</TranslatedText>
                  </p>
                </Card>
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Star className="h-6 w-6 fill-blue-600" />
                  </div>
                  <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] tracking-tight"><TranslatedText>Real-World Evidence</TranslatedText></h2>
                </div>

                <Carousel className="w-full max-w-full">
                  <CarouselContent>
                    {stories.map((s, i) => (
                      <CarouselItem key={i} className="md:basis-1/2">
                        <div className="p-2 h-full">
                          <CaseStudy 
                            name={s.name}
                            timeline={s.outcome}
                            savings={s.saving}
                            quote={s.quote}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-end gap-2 mt-6">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </Carousel>
              </div>

              <section className="bg-gradient-to-br from-blue-700 to-indigo-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16 text-center">
                <div className="space-y-8">
                  <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                    <Award className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                    <TranslatedText>Mastery Confirmed</TranslatedText>
                  </h2>
                  <p className="text-blue-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>{`You have completed the core Mortgage Freedom Accelerator. You are now in the top 1% of ${country.name} homeowners who actually understand the institutional math.`}</TranslatedText>
                  </p>
                </div>

                <div className="pt-16 border-t border-white/10 text-center space-y-10">
                  <div className="flex items-center justify-center gap-4 text-yellow-400 font-black uppercase text-sm tracking-[0.4em]">
                    <Trophy className="h-6 w-6" />
                    <TranslatedText>Accelerator Graduation Complete</TranslatedText>
                  </div>
                  <button 
                    onClick={() => router.push('/members/chunker')}
                    className="bg-white text-blue-900 hover:bg-blue-50 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <TranslatedText>Launch My Simulator</TranslatedText>
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
            <TranslatedText>Previous</TranslatedText>
          </button>
          
          {(id < 8 && (!isLocked || isPrivileged)) && (
            <button 
                onClick={nextLesson}
                className="group flex items-center gap-4 bg-[#2563EB] text-white px-12 py-6 rounded-[24px] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 text-2xl"
            >
                <TranslatedText>{id === 3 ? "Unlock Pro Plan" : "Next Lesson"}</TranslatedText>
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
