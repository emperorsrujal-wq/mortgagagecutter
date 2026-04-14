
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
  Play,
  Quote,
  ZapOff
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
    { name: "The Nguyens", location: "Sydney, AU", outcome: "3rd Property Debt-Free", saving: "$210,000", quote: "90% of multi-owners here use this. It's the standard for the 1%." }
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-32">
      <ProgressBar current={id} />
      
      <div className="max-w-[800px] mx-auto px-4 py-16 space-y-24">
        
        {/* LESSON 1: THE 30-YEAR LIE */}
        {id === 1 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-red-200">
                <ShieldAlert className="h-4 w-4" />
                <TranslatedText>WARNING: This is the math they hide from you</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The 30-Year Lie:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>How Banks Hijack Your Life.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`In ${country.name}, you aren't a homeowner. You're a high-efficiency interest generator for ${country.banks[0]}. Let's expose the heist.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <CourseCard className="border-l-[12px] border-l-red-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Quote className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                      <History className="h-8 w-8" />
                    </div>
                    <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] leading-tight">
                      <TranslatedText>The Banker's Secret Handshake</TranslatedText>
                    </h2>
                  </div>
                  
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Years ago, a senior bank executive leaned in and told me the truth: "We don't want people to pay off their houses. We want them to maintain them for us while we harvest their labor."`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`Most homeowners in ${country.name} believe their mortgage is a 30-year goal. It's not. It's a 30-year trap designed to front-load interest so the bank gets paid first, and you get equity last. By the time you "own" your home, you've often paid for it three times over.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`The "Amortization Table" is the most expensive document you will ever sign in ${country.name}. It's a mathematical engine built to separate you from your future wealth.`}</TranslatedText>
              </EpiphanyBox>

              <InterestCalc />

              <Quiz 
                question="If you pay your mortgage exactly as the bank tells you, who wins?"
                options={[
                  "You, because you have a 'safe' fixed rate",
                  "The bank, because they harvest your interest in the first 15 years",
                  "The government, because of the property taxes",
                  "Your neighbors, because your home value goes up"
                ]}
                correctAnswer={1}
                explanation="The bank front-loads interest. In the first few years of a 30-year mortgage, roughly 80% of your payment goes to interest, not principal. You are literally working for the bank's shareholders, not your family's future."
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
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Why Banks Want You to Fail.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`In ${country.name}, the bank uses a specific "Stress Test" logic. We're going to flip the script and use their own math to force them to give you the keys to the vault.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                <h3 className="text-3xl font-black text-slate-900"><TranslatedText>The Physics of Approval</TranslatedText></h3>
                <p>
                  <TranslatedText>{`Lenders in ${country.name} don't look at how much you make. They look at how much you "leak." They want to see that your income is a stable dam, and your debts are small enough not to burst it. But here's the secret: most people's debt is structured inefficiently, causing them to fail the test before they even start.`}</TranslatedText>
                </p>
              </div>

              <QualificationCalc />

              <EpiphanyBox>
                <TranslatedText>{`Your Credit Score isn't a measure of wealth. It's a measure of how good you are at being a profitable customer for ${country.banks[0]}. We're going to optimize your score so you become too 'safe' for them to ignore.`}</TranslatedText>
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
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Where the 1% Hide Their Debt.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Retail banks like ${country.banks[0]} will never show you their "Open Credit" products. You have to know the secret handshake. You have to speak the language of Private Wealth.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                <h3 className="text-3xl font-black text-slate-900"><TranslatedText>The Banker Archetypes</TranslatedText></h3>
                <p>
                  <TranslatedText>{`There are two types of banks in ${country.name}. There are "Retail Giants" who want you in a 30-year cage. And then there are "Strategic Partners"—often local credit unions or Private Wealth divisions—who will let you use a First-Lien ${country.productShort} to bypass the interest trap.`}</TranslatedText>
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
                <TranslatedText>{`When you call a bank, don't ask for a mortgage. Ask for a "Flexible Equity Line with Full Transactionality." This one phrase will immediately signal that you aren't a regular consumer—you're a strategist.`}</TranslatedText>
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
                    <TranslatedText>{`Lenders in ${country.name} love to hide "Kill Switches" in the fine print. We're going to find them and disarm them before you sign.`}</TranslatedText>
                  </p>
                </header>

                <section className="space-y-16">
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <h3 className="text-3xl font-black text-slate-900"><TranslatedText>Spotting the TIP Scam</TranslatedText></h3>
                    <p>
                      <TranslatedText>{`Check your ${country.regulatedBy} disclosure for the "Total Interest Percentage" (TIP). If it's over 90%, you are in a front-loaded trap. A strategic line should reflect a True Effective APR that is significantly lower over time because you control the balance.`}</TranslatedText>
                    </p>
                  </div>

                  <ContractSimulator />

                  <EpiphanyBox>
                    <TranslatedText>{`A traditional mortgage is a "One-Way Street." Money goes in, but it never comes out without another loan application. A strategic line is a "Two-Way Street." You use it, you pay it, you reuse it. You are now the controller of your own liquidity.`}</TranslatedText>
                  </EpiphanyBox>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InfoBox title="The 'Repayment' Trap" color="amber">
                      <p><TranslatedText>Some banks in ${country.name} try to enforce a "waiting period" on principal-only payments. This is a red flag. We want zero resistance to velocity.</TranslatedText></p>
                    </InfoBox>
                    <InfoBox title="The Draw Period Freeze" color="red">
                      <p><TranslatedText>Verify if the bank can freeze your access if home values drop. We look for "Immutable Draw" products to ensure you're never trapped in a downturn.</TranslatedText></p>
                    </InfoBox>
                  </div>
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
                <TranslatedText>{`In ${country.name}, we want your paycheck hitting the principal on Day 1 without you lifting a finger. This is the moment the bank starts working for YOU.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <AutomationSimulator />

              <EpiphanyBox>
                <TranslatedText>{`Think of your debt like a leaking bathtub. Traditional banking keeps the water level high. Our automation "dumps the bucket" (your income) in immediately, stopping the interest "drain" before it can even start for the month.`}</TranslatedText>
              </EpiphanyBox>

              <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                <h3 className="text-3xl font-black text-slate-900"><TranslatedText>The Velocity Sweep</TranslatedText></h3>
                <p><TranslatedText>{`By configuring a "Sweep" account in ${country.name}, you ensure that every dollar above your daily operating floor is working to cancel out the bank's daily interest calculation. You're effectively stealing back your future labor one day at a time.`}</TranslatedText></p>
              </div>
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
                <TranslatedText>{`Debt reduction was just the beginning. Now we use the bank's own inventory to build your wealth fortress in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <WealthSimulator />

              <EpiphanyBox>
                <TranslatedText>{`Once your home is a "Two-Way Street," you have a permanent source of low-cost capital. You can deploy it for investments, Renovations (Forced Appreciation), or the property ladder. You aren't just saving money; you're creating a wealth machine.`}</TranslatedText>
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
                <TranslatedText>{`It's time to trigger the final "Hyperdrive." By combining "Principal Chunks" with "Offset Timing," we're going to shave decades off your term in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <OffsetVisual />

              <HyperdriveSim />

              <BiWeeklyCalc />

              <div className="p-12 bg-slate-900 text-white rounded-[64px] border border-white/10 shadow-2xl text-center space-y-6">
                <Award className="h-16 w-16 text-yellow-400 mx-auto" />
                <h3 className="text-4xl font-black tracking-tight"><TranslatedText>The 90-Day Escape Plan</TranslatedText></h3>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  <TranslatedText>You've mastered the math. You've disarmed the traps. Now, download your 90-day execution planner and take back your life from the bank.</TranslatedText>
                </p>
                <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/5 font-bold">
                  <Download className="mr-2 h-5 w-5" /> Download The 90-Day Blueprint (PDF)
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
                <TranslatedText>The Proof:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Joining the 39 Million.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`In ${country.name}, the "Open Credit" model was the standard until the shift to the amortized trap. Today, the top 1% still use it. Now, you are one of them.`}</TranslatedText>
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
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"Before modern bankers created the amortized cage, homes were bought with simple interest velocity. We're just going back to what worked."</p>
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
                    <TranslatedText>{`While retail consumers use the 30-year trap, professional investors in ${country.name} use the Offset/HELOC velocity model to scale empires. Welcome to the other side.`}</TranslatedText>
                  </p>
                </Card>
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Star className="h-6 w-6 fill-blue-600" />
                  </div>
                  <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] tracking-tight"><TranslatedText>Evidence of the Movement</TranslatedText></h2>
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
                    <TranslatedText>Mastery Achieved</TranslatedText>
                  </h2>
                  <p className="text-blue-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>{`You have completed the core Mortgage Freedom Accelerator. You are now in the top 1% of ${country.name} homeowners who actually understand the math. Go build your empire.`}</TranslatedText>
                  </p>
                </div>

                <div className="pt-16 border-t border-white/10 text-center space-y-10">
                  <div className="flex items-center justify-center gap-4 text-yellow-400 font-black uppercase text-sm tracking-[0.4em]">
                    <Trophy className="h-6 w-6" />
                    <TranslatedText>Graduation Bonus Unlocked</TranslatedText>
                  </div>
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
