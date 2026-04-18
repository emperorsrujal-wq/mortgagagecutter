
'use client';
import React, { use, useState, useEffect } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { 
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
  TruthCalculator,
  RateImpactCalc,
  InterestCalc,
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

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-32">
      <ProgressBar current={id} />
      
      <div className="max-w-[850px] mx-auto px-4 py-16 space-y-24">
        
        {/* PHASE 0: THE AWAKENING (THE 2X COST TRAP) */}
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
                  <TranslatedText>{`Somewhere in your home is a piece of paper that represented your proudest moment. You shook hands, received keys, and walked into a home you could finally call your own. But buried inside its fine print, the math is working against you.`}</TranslatedText>
                </p>
                <p>
                  <TranslatedText>{`On a typical $400,000 home purchase in ${country.name}, financed over 30 years at 6.5% interest, that number is not $400,000. By the time you make your final payment, you will have handed the bank approximately $909,000.`}</TranslatedText>
                </p>
                <p className="text-blue-600 font-black p-6 bg-blue-50 rounded-3xl border-l-8 border-blue-600">
                  <TranslatedText>The extra $509,000? Not equity. Not your future. Pure bank profit. A fee for the privilege of borrowing money.</TranslatedText>
                </p>
              </div>

              <div className="bg-slate-900 rounded-[48px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Landmark className="h-64 w-64 text-blue-400" /></div>
                <div className="text-center space-y-2 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-blue-400"><TranslatedText>The Price of Silence</TranslatedText></h3>
                  <p className="text-slate-400 font-bold"><TranslatedText>Mathematical Reality of a $400k Purchase</TranslatedText></p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {[
                    { label: "Purchase Price", val: "$400,000", sub: "The Sticker Price" },
                    { label: "Total Paid", val: "$909,000", sub: "The Real Price", highlight: true },
                    { label: "Bank Profit", val: "$509,000", sub: "Interest Siphon", danger: true }
                  ].map((s, i) => (
                    <div key={i} className={cn("p-8 rounded-3xl text-center space-y-2 border border-white/10", s.highlight ? "bg-blue-600 border-none shadow-xl" : "bg-white/5")}>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-60"><TranslatedText>{s.label}</TranslatedText></p>
                       <p className={cn("text-3xl font-black", s.danger ? "text-red-400" : "text-white")}>{s.val}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase"><TranslatedText>{s.sub}</TranslatedText></p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-slate-400 text-sm italic font-medium">
                  <TranslatedText>This is not a glitch. It is the deliberate architecture of the modern mortgage, designed to maximize wealth transfer from you to the lender.</TranslatedText>
                </p>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>ELI14: The Terminology Vault</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InfoBox title="Amortization" color="red">
                    "The Interest-First Treadmill." A mathematical schedule that ensures you pay the bank's profit first. In the early years, nearly 90% of your check is just a "cover charge" to live in the house.
                 </InfoBox>
                 <InfoBox title="Principal" color="green">
                    "The Actual Bricks." The original amount you borrowed. This is the only number that builds your net worth. The goal of this course is to hit this number with maximum velocity.
                 </InfoBox>
                 <InfoBox title="Interest" color="amber">
                    "The Daily Rent on Debt." On a standard mortgage, this is calculated monthly. On a HELOC, it's calculated daily. This subtle shift is the key to saving hundreds of thousands.
                 </InfoBox>
                 <InfoBox title="Equity" color="blue">
                    "The Percentage You Actually Own." Most people only own the front door and maybe a window after 5 years of payments. We want you to own the whole house in half the time.
                 </InfoBox>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Three Destinies</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium">
                <TranslatedText>Abstract numbers lose impact. Let's look at three families making choices right now that will define their next 30 years.</TranslatedText>
              </p>

              <div className="space-y-8">
                <CaseStudy 
                  name="The Patels (Ohio)"
                  savings="$284,340 Reclaimed"
                  timeline="Mortgage-Free at 51"
                  quote="We were on track to finish at 63. By age 51, we will own our home and have $284k extra for our children's education."
                />
                <CaseStudy 
                  name="The Tremblays (Montréal)"
                  savings="$220,000 Reclaimed"
                  timeline="Mortgage-Free at 54"
                  quote="A $550k condo was going to cost us nearly $1M. Now, we're finishing 12 years early and keeping our life force for ourselves."
                />
                <CaseStudy 
                  name="The Garcias (LA)"
                  savings="$500,000+ Reclaimed"
                  timeline="Mortgage-Free at 43"
                  quote="Our $780k home was a $1.5M debt sentence. The HELOC strategy cut our timeline in half. We are building a portfolio now."
                />
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Renting Myth (Forensic Audit)</TranslatedText></h2>
              </div>
              <CourseCard className="border-l-[12px] border-l-amber-500 shadow-2xl p-12 md:p-16 bg-white">
                 <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`You've heard it a hundred times: "Renting is throwing money away." But the framing obscures a bigger lie.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`Traditional homeowners "throw away" an average of 128% of their home's price in interest. On a $400k home, that's $509,000 GONE. Renters pay for a ceiling; traditional buyers pay for the ceiling twice.`}</TranslatedText>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                       <div className="p-8 bg-red-50 rounded-3xl border border-red-100">
                          <p className="text-xs font-black text-red-600 uppercase mb-2">Standard Homeowner</p>
                          <p className="text-3xl font-black text-slate-900">$509,000</p>
                          <p className="text-sm font-bold text-slate-500">Interest "Thrown Away"</p>
                       </div>
                       <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                          <p className="text-xs font-black text-emerald-600 uppercase mb-2">Mortgage Cutter</p>
                          <p className="text-3xl font-black text-slate-900">$135,000</p>
                          <p className="text-sm font-bold text-slate-500">Interest Cost (Target)</p>
                       </div>
                    </div>
                  </div>
              </CourseCard>

              <EpiphanyBox>
                <TranslatedText>{`You buy your home twice. Once for you (Principal), and once for the bank (Interest). The Mortgage Cutter method is about legally opting out of the second purchase.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">5</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Face Your Truth</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the 'Truth Calculator' below to see your current "Freedom Date" and the monthly interest bite you are currently suffering. This is the first step toward sovereignty.`}</TranslatedText>
              </p>
              <TruthCalculator />
            </section>
          </div>
        )}

        {/* PHASE 1: THE DIRTY HISTORY OF BANKING */}
        {id === 1 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-red-100 shadow-lg">
                <History className="h-4 w-4" />
                <TranslatedText>Mastery Level: 01 — Forensic History</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Dirty History:</TranslatedText>
                <span className="block text-red-600 italic mt-4"><TranslatedText>How Money Became a Trap.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Lending wasn't invented to help you own a home. It was engineered to capture your labor. Today, we decode the 300-year forensic trail.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Goldsmith's Secret (ELI14)</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p><TranslatedText>In the 1600s, people gave their gold to "Goldsmiths" for safekeeping. The Goldsmiths gave them paper receipts. Soon, people just traded the paper instead of the gold.</TranslatedText></p>
                  <p><TranslatedText>The Goldsmiths noticed something: only 10% of people ever came back for their gold at once. So, they started printing "fake" receipts and lending them at interest.</TranslatedText></p>
                  <p className="text-red-600 font-black italic"><TranslatedText>This was the birth of "Fractional Reserve Banking."</TranslatedText></p>
                  <p><TranslatedText>Today, your bank uses this same trick. They take $1 of your deposit and "lend" $10 of credit based on it. You are paying real interest on money the bank manufactured out of thin air. This is the structural foundation of your mortgage trap.</TranslatedText></p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[400px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Landmark className="h-48 w-48 text-red-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-red-400 tracking-[0.5em]">The Lending Ratio</p>
                    <h3 className="text-8xl font-black text-white tracking-tighter">10 : 1</h3>
                    <p className="text-lg font-bold text-slate-400">Manufactured Credit vs. Real Reserves</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoBox title="Fractional Reserve" color="red">
                  The banking practice where banks keep only a fraction (10%) of their actual deposits in cash and lend out the rest. This creates a "money multiplier" that benefits the lender's balance sheet, not yours.
                </InfoBox>
                <InfoBox title="Central Bank" color="blue">
                  A country's primary financial authority (The Fed, Bank of Canada, BoE). It acts as a "Lender of Last Resort," providing the safety net that allows commercial banks to take risks with your capital.
                </InfoBox>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Global Forensic Timeline</TranslatedText></h2>
              </div>
              <div className="space-y-12">
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  <TranslatedText>The system wasn't built overnight. It was refined over three centuries of tactical maneuvers, usually signed into law while the public was looking elsewhere.</TranslatedText>
                </p>
                <div className="space-y-8">
                  {[
                    { date: "1694", event: "The Bank of England", desc: "The world's first central bank is signed into law. It perfects the idea that government debt can be used to generate wealth from nothing but interest. The model for every trap that followed.", icon: <Globe className="h-5 w-5 text-blue-500" /> },
                    { date: "1913", event: "The Federal Reserve (USA)", desc: "A private central bank is created in near-total secrecy at Jekyll Island. It gains the power to print money and set the 'Price of Debt' for the next century, underwritten by citizen labor.", icon: <Landmark className="h-5 w-5 text-red-500" /> },
                    { date: "1933", event: "The 30-Year Lie", desc: "The US government (HOLC) invents the long-term amortizing mortgage. It makes monthly payments 'affordable' while locking in 300% total interest costs for the average family.", icon: <Clock className="h-5 w-5 text-amber-500" /> },
                    { date: "1970s", event: "The MBS Revolution", desc: "Mortgage-Backed Securities allow banks to sell your debt to Wall Street immediately. They no longer care if you pay it off; they only care about volume. Alignment of interest dies here.", icon: <Layers className="h-5 w-5 text-purple-500" /> },
                    { date: "2008", event: "The Machine Breaks", desc: "The securitization of toxic debt collapses global markets. Homeowners lose their equity; banks receive government bailouts funded by the same homeowners. The trap resets.", icon: <ShieldAlert className="h-5 w-5 text-red-600" /> },
                  ].map((t, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="flex flex-col items-center">
                        <div className="h-14 w-14 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center group-hover:border-red-500 transition-all">{t.icon}</div>
                        {i < 4 && <div className="w-0.5 flex-1 bg-slate-100 mt-2" />}
                      </div>
                      <div className="pb-12 space-y-2">
                        <p className="text-sm font-black text-red-600 uppercase tracking-widest">{t.date}</p>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight"><TranslatedText>{t.event}</TranslatedText></h4>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl"><TranslatedText>{t.desc}</TranslatedText></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Regional Traps: USA, Canada, UK & AU</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-blue-50 border-l-[12px] border-l-blue-600 rounded-r-3xl space-y-4 shadow-sm">
                    <h4 className="font-black text-xl text-blue-900 uppercase tracking-tight">The USA 30-Year Fixed Cage</h4>
                    <p className="text-blue-900/70 font-medium leading-relaxed italic">
                        <TranslatedText>{`Marketed as "Safety." In reality, it locks you into a front-loaded amortization schedule where you pay 80% interest for the first 15 years. It is a "Security Cage" for your wealth.`}</TranslatedText>
                    </p>
                </div>
                <div className="p-8 bg-red-50 border-l-[12px] border-l-red-600 rounded-r-3xl space-y-4 shadow-sm">
                    <h4 className="font-black text-xl text-red-900 uppercase tracking-tight">The Canada 5-Year Renewal Wall</h4>
                    <p className="text-red-900/70 font-medium leading-relaxed italic">
                        <TranslatedText>{`Homeowners hit a "Renewal Wall" every 5 years. Banks use this to reset the interest trap in higher-rate environments, ensuring you never truly "escape" the principal balance.`}</TranslatedText>
                    </p>
                </div>
                <div className="p-8 bg-emerald-50 border-l-[12px] border-l-emerald-600 rounded-r-3xl space-y-4 shadow-sm">
                    <h4 className="font-black text-xl text-emerald-900 uppercase tracking-tight">Australia: The Offset King</h4>
                    <p className="text-emerald-900/70 font-medium leading-relaxed italic">
                        <TranslatedText>{`1 in 4 Australians already use the logic we teach. "Offset Accounts" prove the Mortgage Cutter strategy is global standard. We are just bringing the "Aussie Logic" to your local trap.`}</TranslatedText>
                    </p>
                </div>
                <div className="p-8 bg-amber-50 border-l-[12px] border-l-amber-600 rounded-r-3xl space-y-4 shadow-sm">
                    <h4 className="font-black text-xl text-amber-900 uppercase tracking-tight">The UK MCOB Cage</h4>
                    <p className="text-amber-900/70 font-medium leading-relaxed italic">
                        <TranslatedText>{`Strict FCA rules (MCOB) protect the "Structure of Interest." UK borrowers face heavy prepayment penalties designed to stop them from executing the Speedrun logic.`}</TranslatedText>
                    </p>
                </div>
              </div>

              <EpiphanyBox>
                <TranslatedText>{`The 30-year mortgage wasn't built to help you own a home. It was built to help the bank own your labor for 30 years. When you sign that contract, you aren't a buyer; you are a primary source of institutional revenue.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Mechanism: The One-Way Street</TranslatedText></h2>
              </div>
              <CourseCard className="bg-white border-none shadow-2xl p-10 md:p-16 rounded-[64px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><ArrowRight className="h-64 w-64" /></div>
                <div className="space-y-10 relative z-10">
                  <p className="text-2xl text-slate-600 font-medium leading-relaxed">
                    <TranslatedText>{`Traditional banking relies on a "Closed Pipe" structure. Money flows in, but you can never reach back in and take it out without paying a new fee. This is a deliberate product design choice.`}</TranslatedText>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <h4 className="text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2"><Lock className="h-4 w-4" /> The Closed Pipe (Standard)</h4>
                      <ul className="space-y-3 text-sm font-bold text-slate-500">
                        <li>• Money enters bank, disappears into principal.</li>
                        <li>• Zero liquidity on paid-down equity.</li>
                        <li>• Bank determines amortization schedule.</li>
                        <li>• Refinance fee required to access funds.</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-emerald-600 font-black uppercase text-xs tracking-widest flex items-center gap-2"><Zap className="h-4 w-4 fill-emerald-600" /> The Open Reservoir (Strategy)</h4>
                      <ul className="space-y-3 text-sm font-bold text-slate-900">
                        <li>• Every dollar reduces balance immediately.</li>
                        <li>• Instant redraw for bills or emergencies.</li>
                        <li>• YOU determine the interest accrual daily.</li>
                        <li>• No refinance needed for life of loan.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CourseCard>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">5</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Audit Your Origin</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Look at the chart below. This is how the 'Price of Debt' has moved in your region. Watch how your specific loan date determined your lifetime interest cost for families. We are going to break that sentence.`}</TranslatedText>
              </p>
              <BankRateChart />
            </section>
          </div>
        )}

        {/* Lessons 2-13 Placeholder (Expanding in following prompts) */}
        {id >= 2 && (
          <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">
            {meta.title} <TranslatedText>Masterclass Content Loaded...</TranslatedText>
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
          
          {(id < 13 && (!isLocked || isPrivileged)) && (
            <button 
                onClick={nextLesson}
                className="group flex items-center gap-4 bg-[#2563EB] text-white px-12 py-6 rounded-[24px] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 text-2xl"
            >
                <TranslatedText>{id === 5 ? "Unlock The Vault" : "Next Phase"}</TranslatedText>
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
