
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
  RateImpactCalc
} from '@/components/course/Calculators';
import { 
  CourseCard, 
  Quiz,
  CaseStudy,
  StatBox,
  ExpandSection,
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
  Table as TableIcon
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
  const isLocked = id >= 6 && !isPrivileged;

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
                  savings="$284,340 Saved"
                  timeline="Mortgage-Free at 46"
                  quote="We were on track to finish at 63. Using the Chunker logic, we reclaim 17 years of our life and keep $284k in interest."
                />
                <CaseStudy 
                  name="The Tremblays (Montreal Condo)"
                  savings="$284,000 Saved"
                  timeline="Mortgage-Free at 54"
                  quote="Our condo will cost us $1M under standard terms. By age 54, we will own it outright and be ready for full-scale investing."
                />
                <CaseStudy 
                  name="The Garcias (LA Property)"
                  savings="$658,000 Saved"
                  timeline="Mortgage-Free at 43"
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
            </section>
          </div>
        )}

        {/* LESSON 1: THE DIRTY HISTORY OF BANKING */}
        {id === 1 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-red-100">
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
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Global Forensic Timeline</TranslatedText></h2>
              </div>
              <div className="space-y-8">
                {[
                  { date: "1694", event: "The Bank of England", desc: "The world's first central bank is signed into law. It perfects the idea that debt can be used to generate wealth from nothing but interest.", icon: <Globe className="h-5 w-5 text-blue-500" /> },
                  { date: "1913", event: "The Federal Reserve (USA)", desc: "A private central bank is created in near-total secrecy at Jekyll Island. It gains the power to print money and set the 'Price of Debt' for the next century.", icon: <Landmark className="h-5 w-5 text-red-500" /> },
                  { date: "1933", event: "The 30-Year Lie", desc: "The US government invents the long-term amortizing mortgage. It makes monthly payments 'affordable' while locking in 300% total interest costs.", icon: <Clock className="h-5 w-5 text-amber-500" /> },
                  { date: "1970s", event: "The MBS Revolution", desc: "Mortgage-Backed Securities allow banks to sell your debt to Wall Street immediately. They no longer care if you pay it off; they only care about volume.", icon: <Layers className="h-5 w-5 text-purple-500" /> },
                ].map((t, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="flex flex-col items-center">
                      <div className="h-14 w-14 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center group-hover:border-red-500 transition-all">{t.icon}</div>
                      {i < 3 && <div className="w-0.5 flex-1 bg-slate-100 mt-2" />}
                    </div>
                    <div className="pb-12 space-y-2">
                      <p className="text-sm font-black text-red-600 uppercase tracking-widest">{t.date}</p>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight"><TranslatedText>{t.event}</TranslatedText></h4>
                      <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl"><TranslatedText>{t.desc}</TranslatedText></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Regional Traps: USA, Canada, UK & AU</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-blue-50 border-l-[12px] border-l-blue-600 rounded-r-3xl space-y-4">
                    <h4 className="font-black text-xl text-blue-900 uppercase tracking-tight">The USA 30-Year Fixed</h4>
                    <p className="text-blue-900/70 font-medium leading-relaxed italic">
                        <TranslatedText>{`Marketed as "Safety." In reality, it locks you into a front-loaded amortization schedule where you pay 80% interest for the first 15 years. It is a "Security Cage" for your wealth.`}</TranslatedText>
                    </p>
                </div>
                <div className="p-8 bg-red-50 border-l-[12px] border-l-red-600 rounded-r-3xl space-y-4">
                    <h4 className="font-black text-xl text-red-900 uppercase tracking-tight">The Canada 5-Year Renewal</h4>
                    <p className="text-red-900/70 font-medium leading-relaxed italic">
                        <TranslatedText>{`Homeowners hit a "Renewal Wall" every 5 years. Banks use this to reset the interest trap in higher-rate environments, ensuring you never truly "escape" the principal balance.`}</TranslatedText>
                    </p>
                </div>
                <div className="p-8 bg-emerald-50 border-l-[12px] border-l-emerald-600 rounded-r-3xl space-y-4">
                    <h4 className="font-black text-xl text-emerald-900 uppercase tracking-tight">Australia: The Offset King</h4>
                    <p className="text-emerald-900/70 font-medium leading-relaxed italic">
                        <TranslatedText>{`1 in 4 Australians already use the logic we teach. "Offset Accounts" prove the Mortgage Cutter strategy is global standard. We are just bringing the "Aussie Logic" to your local trap.`}</TranslatedText>
                    </p>
                </div>
                <div className="p-8 bg-amber-50 border-l-[12px] border-l-amber-600 rounded-r-3xl space-y-4">
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
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Audit Your Origin</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Look at the chart below. This is how the "Price of Debt" has moved in your region. Watch how your specific loan date determined your lifetime interest sentence.`}</TranslatedText>
              </p>
              <BankRateChart />
            </section>
          </div>
        )}

        {/* LESSON 2: THE MATHEMATICAL PROOF (THE SCAM) */}
        {id === 2 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-emerald-200">
                <Scale className="h-4 w-4" />
                <TranslatedText>Mastery Level: 02 — Conviction & Math</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Scam Exposed:</TranslatedText>
                <span className="block text-emerald-600 italic mt-4"><TranslatedText>The Proof Across 4 Countries.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`We're moving from history to cold, hard mathematics. Whether you are in the US, Canada, UK, or Australia, the scam is exactly the same.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Proof in One Sentence</TranslatedText></h2>
              </div>
              <EpiphanyBox>
                <TranslatedText>{`On a standard amortizing mortgage, you will pay between 1.5x and 2.5x the purchase price of your home by the time you own it outright. This extra cost goes entirely to the bank and cannot be recovered through appreciation.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Global Audit (Select Your Region)</TranslatedText></h2>
              </div>
              
              <Tabs defaultValue="USA" className="w-full">
                <TabsList className="grid grid-cols-4 h-14 bg-slate-100 rounded-2xl p-1">
                  {['USA', 'Canada', 'UK', 'Australia'].map(c => (
                    <TabsTrigger key={c} value={c} className="rounded-xl font-black text-xs tracking-widest">{c}</TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="USA" className="mt-8 space-y-8 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-slate-900">USA — $420,000 Home</h4>
                      <ul className="space-y-4 text-lg text-slate-600 font-medium">
                        <li className="flex justify-between border-b pb-2"><span>Financed Amount (80%)</span> <span className="font-black text-slate-900">$336,000</span></li>
                        <li className="flex justify-between border-b pb-2"><span>Interest Paid (30 yrs @ 6.75%)</span> <span className="font-black text-red-600">$448,440</span></li>
                        <li className="flex justify-between border-b pb-2 font-black text-xl text-slate-900"><span>Total Cost of Home</span> <span>$868,440</span></li>
                      </ul>
                      <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <p className="text-sm font-bold text-blue-900 italic">"The American 30-year fixed is a front-loading machine. You pay 87% interest in Month 1. You don't own half your home until Year 19."</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-[48px] p-8 text-center flex flex-col justify-center space-y-2">
                       <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The US Multiple</p>
                       <h3 className="text-8xl font-black text-white tracking-tighter">2.07x</h3>
                       <p className="text-lg font-bold text-slate-400">Total Payout vs. Purchase Price</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Canada" className="mt-8 space-y-8 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-slate-900">Canada — $685,000 Home</h4>
                      <ul className="space-y-4 text-lg text-slate-600 font-medium">
                        <li className="flex justify-between border-b pb-2"><span>Financed Amount (80%)</span> <span className="font-black text-slate-900">$548,000</span></li>
                        <li className="flex justify-between border-b pb-2"><span>Interest Paid (25 yrs @ 5.54%)</span> <span className="font-black text-red-600">$455,200</span></li>
                        <li className="flex justify-between border-b pb-2 font-black text-xl text-slate-900"><span>Total Cost of Home</span> <span>$1,140,200</span></li>
                      </ul>
                      <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                        <p className="text-sm font-bold text-red-900 italic">"Canada's 5-year renewal cycle resets the trap every half-decade. If rates rise, your interest payout explodes even further."</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-[48px] p-8 text-center flex flex-col justify-center space-y-2">
                       <p className="text-[10px] font-black uppercase text-red-400 tracking-[0.5em]">The Canada Multiple</p>
                       <h3 className="text-8xl font-black text-white tracking-tighter">1.66x</h3>
                       <p className="text-lg font-bold text-slate-400">Excluding CMHC & Renewal Shocks</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="UK" className="mt-8 space-y-8 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-slate-900">UK — £290,000 Home</h4>
                      <ul className="space-y-4 text-lg text-slate-600 font-medium">
                        <li className="flex justify-between border-b pb-2"><span>Financed Amount (80%)</span> <span className="font-black text-slate-900">£232,000</span></li>
                        <li className="flex justify-between border-b pb-2"><span>Interest Paid (25 yrs @ 4.9%)</span> <span className="font-black text-red-600">£192,000</span></li>
                        <li className="flex justify-between border-b pb-2 font-black text-xl text-slate-900"><span>Total Cost of Home</span> <span>£482,000</span></li>
                      </ul>
                      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                        <p className="text-sm font-bold text-amber-900 italic">"UK Stamp Duty and £2,000 arrangement fees every 2 years add £15,000+ to the debt load that never builds equity."</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-[48px] p-8 text-center flex flex-col justify-center space-y-2">
                       <p className="text-[10px] font-black uppercase text-amber-400 tracking-[0.5em]">The UK Multiple</p>
                       <h3 className="text-8xl font-black text-white tracking-tighter">1.66x</h3>
                       <p className="text-lg font-bold text-slate-400">Total Interest vs. Purchase Price</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Australia" className="mt-8 space-y-8 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-slate-900">Australia — $780,000 Home</h4>
                      <ul className="space-y-4 text-lg text-slate-600 font-medium">
                        <li className="flex justify-between border-b pb-2"><span>Financed Amount (80%)</span> <span className="font-black text-slate-900">$624,000</span></li>
                        <li className="flex justify-between border-b pb-2"><span>Interest Paid (30 yrs @ 6.3%)</span> <span className="font-black text-red-600">$768,480</span></li>
                        <li className="flex justify-between border-b pb-2 font-black text-xl text-slate-900"><span>Total Cost of Home</span> <span>$1,548,480</span></li>
                      </ul>
                      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <p className="text-sm font-bold text-emerald-900 italic">"Australia has one of the world's highest variable rate exposures. 13 rate rises in 18 months directly siphons your cash flow."</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-[48px] p-8 text-center flex flex-col justify-center space-y-2">
                       <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.5em]">The Aussie Multiple</p>
                       <h3 className="text-8xl font-black text-white tracking-tighter">1.99x</h3>
                       <p className="text-lg font-bold text-slate-400">Pay 2 Houses to Own 1</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Appreciation Defense (ELI14)</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                    <p><TranslatedText>Banks love to say: "Don't worry about the interest, your home will double in value!"</TranslatedText></p>
                    <p><TranslatedText>But here is the trick: If your $420k home doubles to $840k, the $500k home you want to move into also doubled to $1 Million. You aren't richer in housing power; you've just inflated the environment.</TranslatedText></p>
                    <p className="text-red-600 font-black italic"><TranslatedText>Real appreciation (after inflation) is usually only 1-2% per year. Your interest cost is 6-7%.</TranslatedText></p>
                    <p><TranslatedText>Appreciation is a paper gain. Interest is a visceral, monthly cash loss of your life force.</TranslatedText></p>
                 </div>
                 <div className="bg-white border-2 border-slate-100 rounded-[48px] p-10 shadow-xl space-y-8">
                    <div className="text-center space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400">Annual Return Comparison</p>
                        <div className="flex justify-center gap-12 pt-4">
                            <div className="text-center">
                                <p className="text-4xl font-black text-red-600">6.5%</p>
                                <p className="text-[10px] font-bold uppercase text-slate-400">Interest Cost</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-black text-emerald-600">1.1%</p>
                                <p className="text-[10px] font-bold uppercase text-slate-400">Real Growth</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 text-center font-medium leading-relaxed italic">"The gap between what you pay (Interest) and what you gain (Real Growth) is the fundamental measure of the scam."</p>
                 </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Audit Your Amortization</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Watch the split between Interest (Red) and Principal (Green) below. Most people sell their home before the 'Crossover Point' (Year 19), meaning they spend their entire life only paying the bank's profit.`}</TranslatedText>
              </p>
              <AmortViz />
            </section>
          </div>
        )}

        {/* LESSON 3: THE SEVEN MORTGAGE SCAMS */}
        {id === 3 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-orange-200">
                <ShieldAlert className="h-4 w-4" />
                <TranslatedText>Mastery Level: 03 — Cost Awareness</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Seven Scams:</TranslatedText>
                <span className="block text-orange-600 italic mt-4"><TranslatedText>The Fine Print Exposed.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Beyond the amortization trap, lenders layer seven additional profit mechanisms into every transaction. Today, we price the silence.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Architecture of Obscurity</TranslatedText></h2>
              </div>
              
              <div className="space-y-8">
                <ExpandSection title="Scam #1: The Truth-in-Lending Illusion">
                  <p><TranslatedText>The APR is a distraction. In the US (TILA), Canada, and UK, regulations require rate disclosure. But rates are abstract. Lenders hide the total dollar cost because seeing "$448,440 in interest" would make you run. They want you to focus on the small, manageable monthly payment.</TranslatedText></p>
                  <p className="mt-4 font-bold text-orange-600"><TranslatedText>Cost: The entire interest bill — hidden until it's too late.</TranslatedText></p>
                </ExpandSection>

                <ExpandSection title="Scam #2: The One-Way Mortgage Pipe">
                  <p><TranslatedText>Traditional mortgages are "closed." Your money goes in and you can never touch it again without begging for a new loan. A HELOC is an open reservoir. The bank chooses the closed structure to maximize interest, not because it's a technical requirement.</TranslatedText></p>
                  <p className="mt-4 font-bold text-orange-600"><TranslatedText>Potential Loss: $150,000+ in preventable interest over loan life.</TranslatedText></p>
                </ExpandSection>

                <ExpandSection title="Scam #3: Closing Cost Compounding">
                  <p><TranslatedText>In the US, $15k in closing costs rolled into a 30-year mortgage at 6.75% actually costs you $37k. You are paying $22k in interest on fees you never even received as cash.</TranslatedText></p>
                  <p className="mt-4 font-bold text-orange-600"><TranslatedText>Real Cost: ~2.5x the original fee amount.</TranslatedText></p>
                </ExpandSection>

                <ExpandSection title="Scam #4: Bank-Only Insurance (PMI/CMHC/LMI)">
                  <p><TranslatedText>You pay the premium, but the bank gets the payout. This insurance protects the lender if you fail. If you're foreclosed on, you lose your house, your credit is destroyed, and the bank gets a check from the insurer. You paid to protect them from yourself.</TranslatedText></p>
                  <p className="mt-4 font-bold text-orange-600"><TranslatedText>Direct Loss: $20,000 - $50,000 in pure premiums.</TranslatedText></p>
                </ExpandSection>

                <ExpandSection title="Scam #5: The Rate Lock Ransom">
                  <p><TranslatedText>You pay to reserve a rate that should already be yours. If rates rise, the lock protects you. If rates fall, the bank keeps the difference unless you pay even more for a "float-down." It's a one-way insurance policy where you pay all the premiums.</TranslatedText></p>
                </ExpandSection>

                <ExpandSection title="Scam #6: The Discount Point Mirage">
                  <p><TranslatedText>Lenders let you "buy down" your rate. But the break-even is usually 5+ years. Since most homeowners refi or move in 7-9 years, the bank keeps the upfront cash and you never see the full savings.</TranslatedText></p>
                </ExpandSection>

                <ExpandSection title="Scam #7: Prepayment Penalties (The Cage)">
                  <p><TranslatedText>In Canada and the UK, being "too smart" and paying back your debt early can cost you $15k - $40k in Interest Rate Differential (IRD) penalties. The bank literally charges you for wanting to stop giving them money.</TranslatedText></p>
                </ExpandSection>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: The Five Defense Questions</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Ask these five questions before signing anything. A lender who cannot or will not answer them quickly is providing you with vital information about their product.`}</TranslatedText>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { q: "Total Payout", text: "What is the total of all payments in dollars over the full term? (Not the APR)." },
                  { q: "Prepayment Caps", text: "What are the exact prepayment limits and the formula for exceeding them?" },
                  { q: "Insurance Cost", text: "Is PMI/CMHC required, and what is its total dollar cost over the policy life?" },
                  { q: "Fee Audit", text: "Which closing costs are fixed vs. negotiable? (Ask for a line-item waiver)." },
                  { q: "Strategic Offer", text: "Do you offer an offset account or a first-lien HELOC as an alternative?" },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-2">
                    <h4 className="font-black text-orange-600 uppercase text-xs tracking-widest">{item.q}</h4>
                    <p className="text-slate-600 font-bold leading-relaxed"><TranslatedText>{item.text}</TranslatedText></p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* LESSON 4: THE SIX DEADLY MYTHS */}
        {id === 4 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-purple-200">
                <Ghost className="h-4 w-4" />
                <TranslatedText>Mastery Level: 03 — Mindset Shield</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Six Myths:</TranslatedText>
                <span className="block text-purple-600 italic mt-4"><TranslatedText>The Beliefs That Keep You in Debt.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`The mortgage industry's most powerful tool is not the amortization schedule. It is the collection of widely believed myths that prevent homeowners from questioning it.`}</TranslatedText>
              </p>
            </header>

            {/* MYTH 1: RENT VS BUY */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Myth: "Renting is Throwing Money Away"</TranslatedText></h2>
              </div>
              <div className="space-y-8">
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                    <TranslatedText>{`The myth says "Buying always builds wealth." In reality, a traditional homeowner "throws away" nearly 128% of their home's price in interest. Renting while investing the difference often creates more wealth than a traditional 30-year cage.`}</TranslatedText>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-10 bg-slate-900 text-white rounded-[40px] space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp className="h-32 w-32" /></div>
                        <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em]">The Renter-Investor</p>
                        <p className="text-5xl font-black text-emerald-400">$1,492,000</p>
                        <p className="text-sm text-slate-400 font-bold uppercase leading-tight"><TranslatedText>Total Invested Assets after 30 years (7% return)</TranslatedText></p>
                        <ul className="text-xs text-slate-500 space-y-2 pt-4 border-t border-white/5">
                            <li><CheckCircle2 className="inline h-3 w-3 mr-2" /> <TranslatedText>Zero Interest Paid</TranslatedText></li>
                            <li><CheckCircle2 className="inline h-3 w-3 mr-2" /> <TranslatedText>Zero Maintenance Costs</TranslatedText></li>
                            <li><CheckCircle2 className="inline h-3 w-3 mr-2" /> <TranslatedText>100% Capital Mobility</TranslatedText></li>
                        </ul>
                    </div>
                    <div className="p-10 bg-white border-4 border-slate-100 rounded-[40px] space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><HomeIcon className="h-32 w-32" /></div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">The Traditional Buyer</p>
                        <p className="text-5xl font-black text-slate-900">$900,000</p>
                        <p className="text-sm text-slate-400 font-bold uppercase leading-tight"><TranslatedText>Net Equity Position after 30 years (inc. int/tax/maint)</TranslatedText></p>
                        <ul className="text-xs text-slate-400 space-y-2 pt-4 border-t border-slate-100">
                            <li><AlertCircle className="inline h-3 w-3 mr-2" /> <TranslatedText>$509,000 in Interest "Thrown Away"</TranslatedText></li>
                            <li><AlertCircle className="inline h-3 w-3 mr-2" /> <TranslatedText>$216,000 in Property Taxes</TranslatedText></li>
                            <li><AlertCircle className="inline h-3 w-3 mr-2" /> <TranslatedText>Wealth trapped in "Dead Walls"</TranslatedText></li>
                        </ul>
                    </div>
                </div>
              </div>
            </section>

            {/* MYTH 3: RETIREMENT DATE GOAL */}
            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Myth: "Pay Off By Retirement (65)"</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium">
                <TranslatedText>{`Accepting the 30-year timeline means accepting that the bank gets your prime earning years. If you finish at 50 instead of 65 and invest the freed-up cash flow, you generate nearly $800k in additional retirement wealth.`}</TranslatedText>
              </p>
              <div className="bg-slate-900 text-white p-12 rounded-[56px] shadow-2xl space-y-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy className="h-64 w-64 text-blue-400" /></div>
                <div className="space-y-2 relative z-10">
                   <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Retirement Dividend</p>
                   <h3 className="text-7xl font-black tracking-tighter">+$791,000</h3>
                   <p className="text-lg font-bold text-slate-400 uppercase tracking-widest"><TranslatedText>Additional Wealth at Age 65</TranslatedText></p>
                </div>
                <div className="pt-6 border-t border-white/10 relative z-10 max-w-lg mx-auto">
                    <p className="text-sm text-slate-500 italic font-medium leading-relaxed">
                        <TranslatedText>{`Assumes a $2,500 monthly payment invested at 7% for the 15 years between age 50 (Mortgage Cutter finish) and age 65 (Traditional finish).`}</TranslatedText>
                    </p>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Mindset Graduation</TranslatedText></h2>
              </div>
              <Quiz 
                question="Why is the 'Tax Deduction' for mortgage interest often a net loss?"
                options={[
                  "Because the IRS takes the money back after 5 years",
                  "Because you spend $1 in interest to save only $0.20 in taxes, losing $0.80 overall",
                  "Because only renters are allowed to use it",
                  "Because it is only available for boat owners"
                ]}
                correctAnswer={1}
                explanation="Lenders love to mention the tax deduction to discourage you from paying off principal. But spending money on interest just to get a small tax credit is mathematically inefficient—you are still losing the majority of your cash to the bank."
              />
            </section>
          </div>
        )}

        {/* LESSON 5: THE SECRET SCORECARD */}
        {id === 5 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-200">
                <Lock className="h-4 w-4" />
                <TranslatedText>Mastery Level: 04 — Qualification & Power</TranslatedText>
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
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Run Your Scorecard</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the "Lender Probability" simulator below. It uses ${country.name}'s specific regulatory limits to show you how a Senior Loan Officer sees your financial profile.`}</TranslatedText>
              </p>
              <QualificationCalc />
            </section>
          </div>
        )}

        {/* LESSON 6: THE STRATEGIC ARSENAL */}
        {id === 6 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-purple-200">
                <Zap className="h-4 w-4" />
                <TranslatedText>Mastery Level: 05 — Tool Acquisition</TranslatedText>
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
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: The Lender Audit</TranslatedText></h2>
              </div>
              <ScriptGenerator />
            </section>
          </div>
        )}

        {/* LESSON 7: THE LEGAL LOOPHOLE */}
        {id === 7 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-amber-200">
                <Gavel className="h-4 w-4" />
                <TranslatedText>Mastery Level: 06 — Structural Decoding</TranslatedText>
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
                    <TranslatedText>The "Legal Loophole" is finding the library that gives you a "Magic Library Card." It says: "Borrow as many books as you want. Pay us back whenever. If you return them early, we stop charging interest the second you bring them back!"</TranslatedText>
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
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: The Contract Audit</TranslatedText></h2>
              </div>
              <ContractSimulator />
            </section>
          </div>
        )}

        {/* LESSON 8: THE AUTOMATED HEIST */}
        {id === 8 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-100">
                <RefreshCcw className="h-4 w-4" />
                <TranslatedText>Mastery Level: 07 — Process Automation</TranslatedText>
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
                    <TranslatedText>The "Automated Heist" ensures that every time you get a "bucket" of new water (your paycheck), it immediately jumps into the tub to lower the debt balance. This stops the interest leak for as long as possible each month.</TranslatedText>
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
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Model Your Velocity</TranslatedText></h2>
              </div>
              <AutomationSimulator />
            </section>
          </div>
        )}

        {/* LESSON 9: THE DETAILED MATH */}
        {id === 9 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
             <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-red-200 shadow-xl">
                <Rocket className="h-4 w-4" />
                <TranslatedText>Mastery Level: 08 — Strategy Verification</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Detailed Math:</TranslatedText>
                <span className="block text-red-600 italic mt-4"><TranslatedText>Proof on a $100K Benchmark.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`A lower balance compounding for fewer years always defeats a lower rate compounding for more years. Today, we run the side-by-side audit.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Side-by-Side Audit</TranslatedText></h2>
              </div>
              
              <div className="bg-slate-900 rounded-[48px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><BarChart className="h-64 w-64 text-blue-400" /></div>
                <div className="text-center space-y-2 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-blue-400"><TranslatedText>Benchmark Comparison</TranslatedText></h3>
                  <p className="text-slate-400 font-bold"><TranslatedText>Standard Mortgage vs. HELOC Strategy</TranslatedText></p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <div className="p-8 rounded-3xl text-center space-y-2 bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60"><TranslatedText>Total Interest (Mortgage)</TranslatedText></p>
                    <p className="text-3xl font-black text-red-400">$127,520</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase"><TranslatedText>30 Years at 6.5%</TranslatedText></p>
                  </div>
                  <div className="p-8 rounded-3xl text-center space-y-2 bg-emerald-600 shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80"><TranslatedText>Total Interest (HELOC)</TranslatedText></p>
                    <p className="text-3xl font-black text-white">$28,400</p>
                    <p className="text-[10px] font-bold text-white/70 uppercase"><TranslatedText>8.3 Years at 7.0%</TranslatedText></p>
                  </div>
                  <div className="p-8 rounded-3xl text-center space-y-2 bg-blue-600 shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80"><TranslatedText>Net Cash Saved</TranslatedText></p>
                    <p className="text-3xl font-black text-white">$99,120</p>
                    <p className="text-[10px] font-bold text-white/70 uppercase"><TranslatedText>78% Cost Reduction</TranslatedText></p>
                  </div>
                </div>
                <p className="text-center text-slate-400 text-sm italic font-medium">
                  <TranslatedText>Even with a 0.5% higher rate, the HELOC saves $99k through velocity alone. Speed always beats rate over a long enough horizon.</TranslatedText>
                </p>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Four-Stage Cycle</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { step: "01. Payday Injection", desc: "100% of income hits the loan on Day 1. Interest recalculates on a lower number immediately." },
                  { step: "02. The Spend Float", desc: "Draw living expenses throughout the month. Each day the cash sits, it chokes interest." },
                  { step: "03. Surplus Capture", desc: "The 'Gap' between income and expenses remains as a permanent principal reduction." },
                  { step: "04. Next Month Reset", desc: "Start the next cycle at a lower floor. Interest is lower. Velocity increases." }
                ].map((s, i) => (
                  <div key={i} className="p-8 bg-white border-2 border-slate-100 rounded-[40px] space-y-4">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{s.step}</p>
                    <p className="text-lg font-bold text-slate-900 leading-tight">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* LESSON 10: HELOC EQUITY SECRETS */}
        {id === 10 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
             <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-200 shadow-xl">
                <Warehouse className="h-4 w-4" />
                <TranslatedText>Mastery Level: 09 — Equity Engineering</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>Equity Secrets:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Turning Walls into Engines.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Equity is not a number on a statement. It is a live, working asset that can be recycled into a property empire. Today, we unlock the cage.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Mechanism: The Three Ways to Grow</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-emerald-50 border-t-8 border-t-emerald-500 rounded-b-[40px] space-y-4 shadow-lg">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm"><Rocket className="h-6 w-6"/></div>
                  <h4 className="font-black text-sm uppercase text-emerald-900">Principal Paydown</h4>
                  <p className="text-xs font-medium text-emerald-800/70 leading-relaxed">The only mechanism 100% in your control. The Chunker strategy builds this 4-8x faster than traditional amortization.</p>
                </div>
                <div className="p-8 bg-blue-50 border-t-8 border-t-blue-500 rounded-b-[40px] space-y-4 shadow-lg">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><Globe className="h-6 w-6"/></div>
                  <h4 className="font-black text-sm uppercase text-blue-900">Market Appreciation</h4>
                  <p className="text-xs font-medium text-blue-800/70 leading-relaxed">Outside your control, but captured more effectively when you own more property surface area earlier in your life.</p>
                </div>
                <div className="p-8 bg-amber-50 border-t-8 border-t-amber-500 rounded-b-[40px] space-y-4 shadow-lg">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-amber-600 shadow-sm"><Hammer className="h-6 w-6"/></div>
                  <h4 className="font-black text-sm uppercase text-amber-900">Forced appreciation</h4>
                  <p className="text-xs font-medium text-amber-800/70 leading-relaxed">Strategic improvements (kitchens, baths) that return $1.20 - $2.00 in value for every $1.00 spent. Equity engineering.</p>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: AVM vs. Full Appraisal</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Banks use robots (AVMs) to value your home. Robots don't see renovations. A $500 professional appraisal can unlock $30k+ in "Invisible Equity" for your next acquisition.`}</TranslatedText>
              </p>
              <CourseCard className="bg-white border-2 border-slate-100 shadow-2xl p-10 rounded-[56px] space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                       <h4 className="text-2xl font-black text-slate-900 flex items-center gap-2"><Camera className="h-6 w-6 text-blue-500" /> The Appraisal Delta</h4>
                       <ul className="space-y-4">
                          <li className="flex gap-4">
                             <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-1"><Lock className="h-3 w-3" /></div>
                             <p className="text-sm font-bold text-slate-600">AVM (The Robot): Only sees comparable sales. Ignores your $40k kitchen update.</p>
                          </li>
                          <li className="flex gap-4">
                             <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-1"><CheckCircle className="h-3 w-3" /></div>
                             <p className="text-sm font-bold text-slate-600">Appraisal (The Human): Captures the "Condition Premium." Assigns value to improvements.</p>
                          </li>
                       </ul>
                    </div>
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-4 text-center">
                       <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Average Value Gain</p>
                       <h3 className="text-6xl font-black tracking-tighter">+$30,600</h3>
                       <p className="text-xs text-slate-400 font-bold uppercase">Additional HELOC room on $500k home</p>
                    </div>
                 </div>
              </CourseCard>
            </section>
          </div>
        )}

        {/* LESSON 11: INTEREST RATE SECRETS */}
        {id === 11 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-amber-200">
                <TrendingUp className="h-4 w-4" />
                <TranslatedText>Mastery Level: 10 — Rate Dynamics</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>Rate Secrets:</TranslatedText>
                <span className="block text-amber-600 italic mt-4"><TranslatedText>Managing the Price of Debt.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Most people know their rate like their blood pressure—a number that exists but they don't control. Today, you gain the power to manage it.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Anatomy of a Rate</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p><TranslatedText>Every lending rate is built from two stacked components. The 'Base Rate' is set by your Central Bank (The Fed, BoC, BoE, RBA). The 'Margin' is the bank's profit slice.</TranslatedText></p>
                  <p className="text-amber-600 font-black italic"><TranslatedText>Your Rate = Prime + Margin</TranslatedText></p>
                  <p><TranslatedText>The Base Rate is non-negotiable. The Margin is a business decision—and business decisions can be changed with the right script.</TranslatedText></p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Coins className="h-48 w-48 text-amber-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-amber-400 tracking-[0.5em]">The Negotiable Slice</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">MARGIN</h3>
                    <p className="text-lg font-bold text-slate-400">The Bank's Negotiable Spread</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Rate Immunity Strategy</TranslatedText></h2>
              </div>
              <EpiphanyBox>
                <TranslatedText>{`The homeowner who obsessively predicts rates is playing the wrong game. The homeowner who obsessively reduces their balance is playing the right one. A $180,000 balance at 8% costs significantly less than a $300,000 balance at 6%. Principal reduction is the only guaranteed rate immunity.`}</TranslatedText>
              </EpiphanyBox>
              <RateImpactCalc />
            </section>
          </div>
        )}

        {/* LESSON 12: THE 1% MULTIPLIER (PORTFOLIO CASCADE) */}
        {id === 12 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-emerald-100">
                <Building2 className="h-4 w-4" />
                <TranslatedText>Mastery Level: 11 — Portfolio Cascading</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The 1% Multiplier:</TranslatedText>
                <span className="block text-emerald-600 italic mt-4"><TranslatedText>Build Wealth While You Sleep.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Debt reduction was just the beginning. Now we use your home's equity as "Live Capital" to build a multi-property empire in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Concept: The Monopoly Secret</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>In Monopoly, winners realize that once you own a Green House, you can use its value to borrow enough to buy a "Red Hotel." You aren't "spending" your house; you are "recycling" the energy trapped inside its walls.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>This is "Equity Harvesting."</TranslatedText>
                  </p>
                  <p>
                    <TranslatedText>{`The Cascade strategy means using Property One's HELOC room to fund Property Two's deposit. Property Two then generates rental income that cycles back into the original HELOC, creating a "Double-Engine" paydown.`}</TranslatedText>
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
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Three-Bank Resiliency Rule</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                <TranslatedText>When all your HELOCs are at one institution, the bank has total visibility. If market conditions tighten, they can freeze all your lines at once. The "Three-Bank Strategy" ensures your portfolio is resilient.</TranslatedText>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Bank A (Primary)", role: "Main Relationship", desc: "Holds HELOC 1 on your primary home. Best rates, longest history." },
                  { title: "Bank B (Rental)", role: "Growth Partner", desc: "Holds HELOC 2 on your first investment. Credit Union or local lender." },
                  { title: "Bank C (Reserve)", role: "Survival Buffer", desc: "A third line of credit kept mostly empty for emergencies or market dips." }
                ].map((b, i) => (
                  <div key={i} className="p-8 bg-white border-2 border-slate-100 rounded-[32px] space-y-4 shadow-sm group hover:border-blue-500 transition-colors">
                    <h4 className="font-black text-lg text-slate-900">{b.title}</h4>
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{b.role}</p>
                    <p className="text-sm text-slate-500 font-medium">{b.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Global Tax & Profit Logic</TranslatedText></h2>
              </div>
              <div className="bg-slate-900 rounded-[48px] p-10 text-white space-y-10 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><Coins className="h-64 w-64" /></div>
                 <div className="text-center space-y-2 relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-widest text-blue-400">Investor Treatment Comparison</h3>
                    <p className="text-slate-400 font-bold">2024 Regulatory Frameworks</p>
                 </div>
                 <div className="overflow-auto relative z-10">
                    <table className="w-full text-left text-sm font-medium border-collapse">
                       <thead>
                          <tr className="border-b border-white/10">
                             <th className="py-4 text-blue-400 uppercase tracking-widest">Mechanism</th>
                             <th className="py-4">USA</th>
                             <th className="py-4">Canada</th>
                             <th className="py-4">UK</th>
                             <th className="py-4">Australia</th>
                          </tr>
                       </thead>
                       <tbody className="text-slate-300">
                          <tr className="border-b border-white/5">
                             <td className="py-4 font-black">Rental Loss</td>
                             <td className="py-4">Deductible*</td>
                             <td className="py-4">Limits apply</td>
                             <td className="py-4">Section 24 limit</td>
                             <td className="py-4">Neg. Gearing ✅</td>
                          </tr>
                          <tr className="border-b border-white/5">
                             <td className="py-4 font-black">Cap. Gains</td>
                             <td className="py-4">1031 Exchange</td>
                             <td className="py-4">50% Inclusion</td>
                             <td className="py-4">18-24% Tax</td>
                             <td className="py-4">50% Discount</td>
                          </tr>
                          <tr>
                             <td className="py-4 font-black">HELOC Cap</td>
                             <td className="py-4">85-90% CLTV</td>
                             <td className="py-4">65% Revolving</td>
                             <td className="py-4">75-80% LTV</td>
                             <td className="py-4">80-90% LVR</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action: Model Your Cascade</TranslatedText></h2>
              </div>
              <WealthSimulator />
              <div className="space-y-8 pt-12">
                <h3 className="text-3xl font-fraunces font-black text-center text-slate-900"><TranslatedText>The Property Ladder Blueprint</TranslatedText></h3>
                <LadderVisual />
              </div>
            </section>
          </div>
        )}

        {/* LESSON 13: THE PHYSICS OF FREEDOM */}
        {id === 13 && (
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
                    <TranslatedText>Math is financial gravity. If you move your income from a low-yield savings account (where it does nothing) into an open-credit principal line (where it chokes daily interest), the debt MUST die.</TranslatedText>
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

            <section className="bg-gradient-to-br from-blue-700 to-indigo-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16 text-center overflow-hidden relative">
              <div className="pt-16 border-t border-white/10 text-center space-y-10 relative z-10">
                <button 
                  onClick={() => router.push('/members/chunker')}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                >
                  <TranslatedText>Launch My Chunker Simulator</TranslatedText>
                  <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                </button>
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
