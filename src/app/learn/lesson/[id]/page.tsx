
'use client';
import React, { use, useState, useEffect } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { 
  InterestCalc, 
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
  TruthCalculator
} from '@/components/course/Calculators';
import { 
  CourseCard, 
  TaskItem, 
  Quiz,
  CaseStudy,
  StatBox,
  InfoBox,
  ExpandSection
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
  CreditCard,
  Activity,
  TrendingUp,
  Flame,
  MessageSquare,
  Target,
  BarChart,
  Lock,
  Star,
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
  Play,
  ZapOff,
  BookOpen,
  DollarSign,
  Clock,
  ArrowUpRight,
  Gavel,
  ScrollText,
  ListChecks,
  ArrowRight,
  Timer,
  AlertCircle,
  UserCircle2,
  FileText,
  AlertTriangle,
  Landmark,
  Calculator,
  ShieldAlert,
  Ghost
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function ProgressBar({ current }: { current: number }) {
  const total = 11;
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
  // Lock lessons after index 5 if not privileged
  const isLocked = id >= 6 && !isPrivileged;

  const nextLesson = () => {
    completeLesson(id);
    if (id < 11) router.push(`/learn/lesson/${id + 1}`);
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
                  savings="$190,000 Saved"
                  timeline="Mortgage-Free at 51"
                  quote="We were on track to finish at 63. Using the Chunker logic, we reclaim 12 years of our life and keep $190k in interest."
                />
                <CaseStudy 
                  name="The Tremblays (Montreal Condo)"
                  savings="$220,000 Saved"
                  timeline="Mortgage-Free at 52"
                  quote="Our condo will cost us $1M under standard terms. By age 52, we will own it outright and be ready for full-scale investing."
                />
                <CaseStudy 
                  name="The Garcias (LA Property)"
                  savings="$500,000+ Saved"
                  timeline="Cut 14 Years Off"
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
              <Quiz 
                question="Why is the 'Sticker Price' of your home a distraction?"
                options={[
                  "Because property taxes are even more expensive",
                  "Because the bank collects nearly double that amount in interest profit",
                  "Because houses lose value every single year",
                  "Because you never actually own the land"
                ]}
                correctAnswer={1}
                explanation="Lenders market 'affordable monthly payments' because they don't want you to see the Total Amount Paid, which often exceeds 200% of the home's value."
              />
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
              <Quiz 
                question="Why did banks invent the 30-year amortizing mortgage?"
                options={[
                  "To help families retire earlier",
                  "To make payments look 'affordable' while maximizing front-loaded interest",
                  "To ensure every citizen owns land",
                  "To lower the total amount paid for a home"
                ]}
                correctAnswer={1}
                explanation="The 30-year structure is a psychological trick. It lowers the monthly barrier to entry while ensuring the bank captures the vast majority of your labor in the first two decades."
              />
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
                        <div className="flex justify-center gap-12">
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
              <Quiz 
                question="Why is property appreciation a false defense against mortgage interest?"
                options={[
                  "Because it only happens in large cities",
                  "Because it inflates the price of every other home you'd want to buy, nullifying your gain",
                  "Because interest rates always fall when home prices rise",
                  "Because you have to pay a 50% tax on all appreciation"
                ]}
                correctAnswer={1}
                explanation="Appreciation is largely a paper gain. Unless you sell and exit the market entirely, a more expensive home means your next home is also more expensive. Interest, however, is real cash that leaves your net worth forever."
              />
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
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Cumulative Damage</TranslatedText></h2>
              </div>
              
              <div className="bg-slate-900 rounded-[48px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldAlert className="h-64 w-64 text-orange-400" /></div>
                <div className="text-center space-y-2 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-orange-400"><TranslatedText>The Price of the Seven Scams</TranslatedText></h3>
                  <p className="text-slate-400 font-bold"><TranslatedText>Above and beyond the core interest cost</TranslatedText></p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400"><TranslatedText>Conservative Total</TranslatedText></p>
                    <p className="text-5xl font-black text-white">$50,000</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-2"><TranslatedText>Direct Leakage</TranslatedText></p>
                  </div>
                  <div className="p-8 rounded-3xl bg-orange-600 text-center shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-200"><TranslatedText>Aggressive / Canadian Peak</TranslatedText></p>
                    <p className="text-5xl font-black text-white">$140,000</p>
                    <p className="text-[10px] font-bold text-orange-200 uppercase mt-2"><TranslatedText>Maximum Extracted</TranslatedText></p>
                  </div>
                </div>
              </div>

              <EpiphanyBox>
                <TranslatedText>{`Every one of these costs is legal. Every one is technically disclosed. None of them is your friend. This is why we move from "Debtor" to "Expert Architect" — to avoid these tolls entirely.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">3</div>
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

              <Quiz 
                question="Why is roll-in financing for closing costs dangerous?"
                options={[
                  "Because it increases your credit score too fast",
                  "Because you end up paying interest on the fees for 30 years, doubling their cost",
                  "Because it is illegal in 12 states",
                  "Because the bank doesn't get to keep the money"
                ]}
                correctAnswer={1}
                explanation="Fees rolled into a 30-year mortgage compound just like principal. A $15k fee can easily cost you $37k in total repayment by the time the loan is closed."
              />
            </section>
          </div>
        )}

        {/* NEW LESSON 4: THE SIX DEADLY MYTHS */}
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
                <TranslatedText>{`Lenders rely on six widely believed myths to keep you passive. Today, we dismantle them with cold hard math.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Myth #1: The Renting Lie</TranslatedText></h2>
              </div>
              <div className="space-y-8">
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                    <TranslatedText>{`The myth says "Renting is throwing money away." In reality, a traditional homeowner "throws away" nearly double their home's price in interest. Renting while investing the difference often creates more wealth than a traditional 30-year cage.`}</TranslatedText>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-4">
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Renter-Investor</p>
                        <p className="text-3xl font-black text-emerald-400">$1.49 Million</p>
                        <p className="text-xs text-slate-400 font-bold uppercase">Net Assets after 30 years</p>
                    </div>
                    <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl space-y-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Traditional Buyer</p>
                        <p className="text-3xl font-black text-slate-900">$900k Equity</p>
                        <p className="text-xs text-slate-400 font-bold uppercase">Minus $509k interest cost</p>
                    </div>
                </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Myth #2: The 15-Year Sprint</TranslatedText></h2>
              </div>
              <EpiphanyBox>
                <TranslatedText>{`A 15-year mortgage saves interest but destroys flexibility. It locks you into a high "Heavy Backpack" payment. The Mortgage Cutter strategy (Lesson 10) gives you the speed of a 15-year with the safety of a 30-year.`}</TranslatedText>
              </EpiphanyBox>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Myth #3: The Tax Deduction Mirage</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p><TranslatedText>The "Tax Deduction Scam" is like a coupon that says "Spend $1.00 and get $0.20 back!" You are still losing $0.80.</TranslatedText></p>
                  <p className="text-red-600 font-black italic"><TranslatedText>In the USA, 90% of families don't even qualify for this deduction anymore.</TranslatedText></p>
                  <p><TranslatedText>{`In Canada, the UK, and Australia, it doesn't even exist for your home. Don't carry debt to chase a phantom tax break.`}</TranslatedText></p>
                </div>
                <div className="bg-white border-2 border-slate-100 rounded-[48px] p-10 shadow-xl space-y-8">
                    <div className="text-center space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400">Net Cost of Interest (USA)</p>
                        <div className="flex justify-center gap-12">
                            <div className="text-center">
                                <p className="text-4xl font-black text-red-600">-$1.00</p>
                                <p className="text-[10px] font-bold uppercase text-slate-400">Interest Paid</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-black text-emerald-600">+$0.22</p>
                                <p className="text-[10px] font-bold uppercase text-slate-400">Tax Credit</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-lg text-red-900 text-center font-black">NET LOSS: -$0.78</p>
                 </div>
              </div>
            </section>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">4</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Myth #4: The 20% Obstacle</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium">
                <TranslatedText>{`Waiting for a 20% down payment in a rising market is like running toward a receding finish line. In Canada and Australia, prices often rise faster than you can save. Buying sooner with insurance (PMI/CMHC) often builds more wealth than waiting 5 years while the home price jumps $150k.`}</TranslatedText>
              </p>
              <div className="bg-slate-50 border border-slate-100 p-8 rounded-[40px] text-center">
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">The Wealth Gap</p>
                 <div className="flex justify-center gap-12">
                    <div className="space-y-1">
                        <p className="text-4xl font-black text-emerald-600">Free at 50</p>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Mortgage Cutter Path</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl font-black text-red-600">Free at 65</p>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Traditional Path</p>
                    </div>
                 </div>
                 <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-2xl font-black text-slate-900">$791,000 difference</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">In invested retirement wealth</p>
                 </div>
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

        {/* LESSON 5: THE SECRET SCORECARD (SHIFTED) */}
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
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>In the bank's world, this is the "Stress Test."</TranslatedText>
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
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Terminology Masterclass</TranslatedText></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { term: "DTI (Debt-to-Income)", desc: "Your 'Backpack Weight'. It is the percentage of your monthly income that goes toward paying back debts. Lenders want this under 43%.", icon: <Scale className="h-5 w-5 text-blue-500" /> },
                  { term: "LTV (Loan-to-Value)", desc: "How much of the house you own. Most high-performance tools require you to own at least 20% of the home (80% LTV).", icon: <HomeIcon className="h-5 w-5 text-emerald-500" /> },
                  { term: "The Stress Test", desc: `A mandatory check where ${country.name} lenders pretend your interest rate is much higher to see if you can still survive.`, icon: <Activity className="h-5 w-5 text-red-500" /> },
                  { term: "Tier 1 Credit", desc: "Your 'Trust Rating'. A score (usually above 740) that tells the bank you are an expert at managing other people's money.", icon: <ShieldCheck className="h-5 w-5 text-amber-500" /> },
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

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Run Your Scorecard</TranslatedText></h2>
              </div>
              <p className="text-xl text-slate-600 font-medium text-center max-w-2xl mx-auto mb-10">
                <TranslatedText>{`Use the "Lender Probability" simulator below. It uses ${country.name}'s specific regulatory limits to show you how a Senior Loan Officer sees your financial profile.`}</TranslatedText>
              </p>
              <QualificationCalc />
            </section>
          </div>
        )}

        {/* LESSON 6: THE STRATEGIC ARSENAL (SHIFTED) */}
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

        {/* LESSON 7: THE LEGAL LOOPHOLE (SHIFTED) */}
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

        {/* LESSON 8: THE AUTOMATED HEIST (SHIFTED) */}
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

        {/* LESSON 9: THE 1% MULTIPLIER (SHIFTED) */}
        {id === 9 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-100">
                <Trophy className="h-4 w-4" />
                <TranslatedText>Mastery Level: 08 — Portfolio Scaling</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The 1% Multiplier:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Turning Walls into Engines.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Debt reduction was just the beginning. Now we use your home's equity as "Live Capital" to build a multi-property empire in ${country.name}.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Monopoly Secret (ELI14)</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>In Monopoly, winners realize that once you own a Green House, you can use its value to borrow enough to buy a "Red Hotel." You aren't "spending" your house; you are "recycling" the energy trapped inside its walls.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>This is "Equity Harvesting."</TranslatedText>
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
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>Action Step: Model Your Scaling</TranslatedText></h2>
              </div>
              <WealthSimulator />
              <div className="space-y-8 pt-12">
                <h3 className="text-3xl font-fraunces font-black text-center text-slate-900"><TranslatedText>The Property Ladder Blueprint</TranslatedText></h3>
                <LadderVisual />
              </div>
            </section>
          </div>
        )}

        {/* LESSON 10: THE SPEEDRUN (SHIFTED) */}
        {id === 10 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-red-200">
                <Rocket className="h-4 w-4" />
                <TranslatedText>Mastery Level: 09 — Max Velocity</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>The Speedrun:</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Collapsing Time Itself.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`It's time to trigger the final 'Hyperdrive'. By combining 'Principal Chunks' with 'Offset Timing', we're going to shave decades off your term.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">1</div>
                <h2 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Concept: The Level Skip (ELI14)</TranslatedText></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-medium">
                  <p>
                    <TranslatedText>A "Speedrun" is finding a "Hidden Glitch" in the bank's math called the "Principal Chunk." This is a hidden door that lets you skip level 5 to level 15 instantly.</TranslatedText>
                  </p>
                  <p className="text-blue-600 font-black italic">
                    <TranslatedText>This is not working harder; it's taking a mathematical shortcut.</TranslatedText>
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center space-y-4 min-h-[300px]">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Rocket className="h-32 w-32 text-blue-400" /></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">The Time Collapse</p>
                    <h3 className="text-6xl font-black text-white tracking-tighter">7 YRS</h3>
                    <p className="text-lg font-bold text-slate-400">Typical Accelerated Goal</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-16">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-fraunces font-black text-slate-900"><TranslatedText>The Speedrun Blueprint</TranslatedText></h3>
              </div>
              <OffsetVisual />
              <HyperdriveSim />
              <BiWeeklyCalc />
            </section>
          </div>
        )}

        {/* LESSON 11: THE PHYSICS OF FREEDOM (SHIFTED) */}
        {id === 11 && (
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
          
          {(id < 11 && (!isLocked || isPrivileged)) && (
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
