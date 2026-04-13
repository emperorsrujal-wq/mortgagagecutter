
'use client';
import React, { use, useState, useEffect } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { InterestCalc, AmortViz, PayoffRace, TruthCalculator, QualificationCalc, ScriptGenerator, BankRateChart, ContractSimulator, AutomationSimulator, WealthSimulator, LadderVisual, HyperdriveSim, BiWeeklyCalc, OffsetVisual } from '@/components/course/Calculators';
import { CourseCard, InfoBox, ExpandSection, StatBox, ChatBubble, TaskItem, CaseStudy, Quiz } from '@/components/course/UIComponents';
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
  Ghost, 
  Timer, 
  Droplets, 
  Waves, 
  Zap, 
  ShieldCheck,
  CreditCard,
  Activity,
  TrendingUp,
  PiggyBank,
  Flame,
  MessageSquare,
  FileText,
  Search,
  AlertTriangle,
  Target,
  BarChart,
  Coins,
  Lock,
  Star,
  Gem,
  CheckCircle,
  Award,
  Trophy,
  Download,
  History,
  Scale,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Hammer,
  ShieldHalf,
  Construction,
  Calculator,
  ListChecks,
  FileSearch,
  ScrollText,
  Gavel,
  ShieldX,
  RefreshCcw,
  MousePointer2,
  Layers,
  Diamond
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
  const { country, completeLesson, language, setLanguage } = useCourse();
  const { user } = useUser();
  const meta = lessonMeta.find(l => l.id === id);
  const router = useRouter();

  if (!meta) return <div>Lesson not found</div>;

  const isPrivileged = user?.email === 'emperorsrujal@gmail.com';
  // Module 4 through 8 are Premium
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
              <div className="pt-6">
                <Button size="lg" variant="outline" className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 font-bold h-14 px-8">
                  <Download className="mr-2 h-5 w-5" /> Download "Half Your Mortgage" PDF Blueprint
                </Button>
              </div>
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

              <section className="bg-gradient-to-br from-blue-700 to-indigo-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16">
                <div className="text-center space-y-8">
                  <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                    <Rocket className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                    <TranslatedText>{`Unlock the ${country.name} Strategy`}</TranslatedText>
                  </h2>
                  <p className="text-blue-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>{`In Lesson 2, we dive into the specific account types at ${country.banks.slice(0, 3).join(', ')} and the step-by-step setup for your region.`}</TranslatedText>
                  </p>
                </div>

                <div className="pt-16 border-t border-white/10 text-center space-y-10">
                  <div className="flex items-center justify-center gap-4 text-yellow-400 font-black uppercase text-sm tracking-[0.4em]">
                    <ShieldCheck className="h-6 w-6" />
                    <TranslatedText>End of Masterclass Module 1</TranslatedText>
                  </div>
                  <button 
                    onClick={nextLesson}
                    className="bg-white text-blue-900 hover:bg-blue-50 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <TranslatedText>{`Lesson 2: ${country.productShort} Setup`}</TranslatedText>
                    <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              </section>
            </section>
          </div>
        )}

        {id === 7 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            {isLocked ? (
              <section className="bg-white p-20 rounded-[80px] border-4 border-dashed border-slate-200 text-center space-y-12 shadow-inner">
                  <div className="bg-blue-100 w-40 h-40 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20 border-4 border-white">
                      <Lock className="h-20 w-14 text-blue-600" />
                  </div>
                  <div className="space-y-8">
                      <h2 className="text-5xl md:text-7xl font-fraunces font-black text-slate-900 leading-tight tracking-tight">
                          <TranslatedText>Hyperdrive Strategy: Locked</TranslatedText>
                      </h2>
                      <p className="text-slate-500 text-2xl max-w-xl mx-auto font-medium leading-relaxed italic">
                          <TranslatedText>{`The final "Hyperdrive" module reveals how to collapse the remaining 50% of your debt in record time. Reserved for Pro Members.`}</TranslatedText>
                      </p>
                  </div>
                  <div className="pt-10 space-y-8">
                      <Button size="lg" className="w-full sm:w-auto px-20 py-12 text-3xl font-black rounded-[32px] shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95" asChild>
                          <Link href="/purchase?plan=pro_197">
                              <TranslatedText>Unlock Full Accelerator</TranslatedText>
                              <ArrowRight className="ml-4 h-10 w-10" />
                          </Link>
                      </Button>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]"><TranslatedText>Includes 90-Day Planner</TranslatedText></p>
                  </div>
              </section>
            ) : (
              <div className="space-y-24">
                <header className="space-y-10 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-white/10 shadow-xl">
                    <Rocket className="h-4 w-4 text-emerald-400" />
                    <TranslatedText>Step 7: The Hyperdrive Execution</TranslatedText>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                    <TranslatedText>{`Kill the Tail:`}</TranslatedText>
                    <span className="block text-emerald-600 italic mt-4"><TranslatedText>20% Faster Offset, 43% Hyperdrive.</TranslatedText></span>
                  </h1>
                  <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                    <TranslatedText>{`The final 10 years of a mortgage are the most expensive in terms of time. We use chunks and timing to collapse them entirely.`}</TranslatedText>
                  </p>
                </header>

                <section className="space-y-24">
                  <OffsetVisual />

                  <div className="space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Rocket className="h-6 w-6" />
                      </div>
                      <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] tracking-tight"><TranslatedText>Hyperdrive Principal Simulator</TranslatedText></h2>
                    </div>
                    <HyperdriveSim />
                  </div>

                  <div className="space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] tracking-tight"><TranslatedText>Bi-Weekly Frequency Hack</TranslatedText></h2>
                    </div>
                    <BiWeeklyCalc />
                  </div>

                  <Quiz 
                    question={`If you receive a tax refund or bonus, which execution path yields the highest ROI?`}
                    options={[
                      "Keep it in a high-yield savings account for emergencies",
                      "Inject it as a 'Hyperdrive Chunk' directly into the HELOC principal",
                      "Buy a diversified index fund yielding 8%",
                      "Pay off a 0% interest car loan"
                    ]}
                    correctAnswer={1}
                    explanation={`Injecting into the HELOC is the winner. Not only do you save the interest cost (e.g. 7%), but you keep that same capital 100% LIQUID. You can withdraw it 5 minutes later if needed. It is the only 'Investment' that provides a guaranteed return with zero loss of liquidity.`}
                  />

                  <section className="bg-gradient-to-br from-slate-900 to-blue-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16 text-center">
                    <div className="space-y-8">
                      <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                        <CheckCircle className="h-12 w-12 text-emerald-400" />
                      </div>
                      <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                        <TranslatedText>Course Complete</TranslatedText>
                      </h2>
                      <p className="text-blue-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                        <TranslatedText>{`You have mastered the mechanics, the mindset, and the execution. The final step is Lesson 8: The Evidence & Proof.`}</TranslatedText>
                      </p>
                    </div>

                    <div className="pt-16 border-t border-white/10 text-center space-y-10">
                      <div className="flex items-center justify-center gap-4 text-yellow-400 font-black uppercase text-sm tracking-[0.4em]">
                        <Trophy className="h-6 w-6" />
                        <TranslatedText>End of Masterclass Module 7</TranslatedText>
                      </div>
                      <button 
                        onClick={nextLesson}
                        className="bg-white text-slate-900 hover:bg-slate-50 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                      >
                        <TranslatedText>Lesson 8: The Proof</TranslatedText>
                        <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                      </button>
                    </div>
                  </section>
                </section>
              </div>
            )}
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
