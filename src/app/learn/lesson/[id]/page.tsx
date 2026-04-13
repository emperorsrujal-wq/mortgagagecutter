'use client';
import React, { use } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { InterestCalc, AmortViz, PayoffRace } from '@/components/course/Calculators';
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
  Award
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
          style={{ width: `${(current / 5) * 100}%` }}
        />
      </div>
      <div className="max-w-[720px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/learn" className="flex items-center gap-2 text-[#5A6175] hover:text-[#1A1D26] font-black text-sm">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline uppercase tracking-widest"><TranslatedText>Course Hub</TranslatedText></span>
        </Link>
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
          <TranslatedText>Lesson</TranslatedText> {current} <TranslatedText>of</TranslatedText> 5
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
  const isLocked = id >= 3 && !isPrivileged;

  const nextLesson = () => {
    completeLesson(id);
    if (id < 5) router.push(`/learn/lesson/${id + 1}`);
    else router.push('/questionnaire');
  };

  const prevLesson = () => {
    if (id > 1) router.push(`/learn/lesson/${id - 1}`);
    else router.push('/learn');
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-32">
      <ProgressBar current={id} />
      
      <div className="max-w-[720px] mx-auto px-4 py-16 space-y-16">
        
        {id === 1 && (
          <div className="space-y-20 animate-in fade-in duration-1000">
            <header className="space-y-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-4 border border-red-200">
                <ShieldAlert className="h-4 w-4" />
                <TranslatedText>Security Warning: High Stakes Math</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-tight tracking-tighter">
                <TranslatedText>The $250,000 Heist Your Bank is Praying You Never Discover</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium italic">
                <TranslatedText>The shocking "Front-Loading" secret they bury on Page 3 of your contract—and the structural system that destroys it.</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <CourseCard className="border-l-[12px] border-l-red-600 shadow-2xl p-12 md:p-16">
                <div className="space-y-10">
                  <h2 className="text-5xl font-fraunces font-black text-red-700 leading-tight">
                    <TranslatedText>The Tale of the Invisible House</TranslatedText>
                  </h2>
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p>
                      <TranslatedText>{`Look, let's be blunt. When you sign for a ${formatCurrency(country.avgHome)} mortgage in ${country.name}, you think you're buying a home. You aren't. You're actually buying TWO houses. One for your family, and one for the bank's shareholders. This is not hyperbole—it is the structural reality of modern amortized banking.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`Most homeowners see their mortgage as a simple debt to be repaid. The lender, however, sees you as a high-yield asset. They have meticulously engineered a 30-year labor contract where you provide the maintenance, the taxes, and the sweat equity, while they collect a "protection fee" that often totals 100% or more of the home's original price.`}</TranslatedText>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                    <div className="bg-emerald-50 p-10 rounded-[40px] border-2 border-emerald-100 space-y-6 relative overflow-hidden group">
                      <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                        <HomeIcon className="h-40 w-40 text-emerald-600" />
                      </div>
                      <h4 className="font-black text-emerald-800 uppercase text-xs tracking-[0.3em]"><TranslatedText>House #1: Yours</TranslatedText></h4>
                      <p className="text-lg text-emerald-700 font-bold leading-relaxed">
                        <TranslatedText>{`This is your sanctuary. You paint the walls, mow the lawn, and fix the roof. Yet, under the traditional system, you only truly own a tiny fraction of it for the first 15 years.`}</TranslatedText>
                      </p>
                    </div>
                    <div className="bg-red-50 p-10 rounded-[40px] border-2 border-red-100 space-y-6 relative overflow-hidden group">
                      <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                        <Ghost className="h-40 w-40 text-red-600" />
                      </div>
                      <h4 className="font-black text-red-800 uppercase text-xs tracking-[0.3em]"><TranslatedText>House #2: The Bank's</TranslatedText></h4>
                      <p className="text-lg text-red-700 font-bold leading-relaxed">
                        <TranslatedText>{`This house is invisible. It’s built entirely of your overtime hours and interest payments. The bank has zero risk and zero taxes—yet they take its full value from your pocket.`}</TranslatedText>
                      </p>
                    </div>
                  </div>

                  <div className="p-10 bg-slate-900 text-white rounded-[48px] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 p-8 opacity-5"><ShieldAlert className="h-48 w-48" /></div>
                    <h3 className="text-3xl font-black text-blue-400 flex items-center gap-4">
                      <Target className="h-10 w-10 text-red-500" />
                      <TranslatedText>The Amortization Machine</TranslatedText>
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-xl font-medium">
                      <TranslatedText>{`Your "monthly payment" is a single, clean number designed to hide two very different transactions. In the early years of a 30-year loan, nearly 70-80% of your check is flushed directly into the bank's interest ledger. You are essentially paying "rent" to the bank while the principal—the number that actually builds your wealth—is starved of capital.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <InterestCalc />

              <CaseStudy 
                name="The Anderson Family"
                savings="$142,000"
                timeline="14 Years Cut"
                quote="We used to think paying an extra $100 a month was enough. Once we saw the math of the 'Invisible House', we switched strategies. We're now on track to own our home in 9 years, not 25."
              />

              <div className="p-12 bg-[#0F172A] text-white rounded-[64px] shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Timer className="h-64 w-64" />
                </div>
                <div className="relative z-10 space-y-10">
                  <h2 className="text-5xl font-fraunces font-black text-blue-400 leading-tight">
                    <TranslatedText>The 19-Year "Siphon" Trap</TranslatedText>
                  </h2>
                  <div className="space-y-8 text-slate-300 text-2xl leading-relaxed font-medium">
                    <p>
                      <TranslatedText>{`Lenders are smarter than you think. They don't take their profit evenly. They SIPHON it from you at the very beginning when your balance is at its peak.`}</TranslatedText>
                    </p>
                    <div className="text-white font-black bg-blue-600/30 p-10 rounded-[40px] border-2 border-blue-500/30 shadow-xl">
                      <TranslatedText>{`On a standard 30-year loan, it takes nearly 19 YEARS of consistent payments before your monthly check actually starts paying off more principal than interest. For 63% of your loan's life, you are an interest-generating machine.`}</TranslatedText>
                    </div>
                  </div>
                </div>
              </div>

              <AmortViz />

              <Quiz 
                question="Why do banks 'front-load' interest in the first half of a 30-year mortgage?"
                options={[
                  "To help homeowners build equity faster later on",
                  "To capture their profit before you refinance or sell",
                  "Because it is a legal requirement for all mortgages",
                  "To ensure the loan balance stays high for safety"
                ]}
                correctAnswer={1}
                explanation="Banks know that life happens. People sell houses, refinance, or move every 7-10 years on average. By front-loading the interest, they ensure they collect 70-80% of their projected profit in the first decade, even if you pay off the loan early."
              />

              <section className="bg-gradient-to-br from-blue-700 to-indigo-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16">
                <div className="text-center space-y-8">
                  <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                    <Zap className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                    <TranslatedText>Nuke the Trap Today</TranslatedText>
                  </h2>
                  <p className="text-blue-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>There is a specific, bank-agnostic strategy used by the top 1% of homeowners to collapse this timeline using the bank's own daily interest math against them.</TranslatedText>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {[
                    { icon: Droplets, title: "The Bathtub Flow", desc: "Use your income to 'choke' daily interest without spending extra. (Lesson 2)", color: "text-blue-300" },
                    { icon: Rocket, title: "The 30-Day Float", desc: "Force the bank to pay for your life while your money kills debt. (Lesson 3)", color: "text-pink-300" },
                    { icon: MessageSquare, title: "The Banker Script", desc: "The 'Magic Phrases' that force loan officers to say yes. (Lesson 4)", color: "text-purple-300" }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 shadow-inner space-y-6 group hover:bg-white/15 transition-all duration-500 hover:-translate-y-2">
                      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center bg-white/10", item.color)}>
                        <item.icon className="h-8 w-8" />
                      </div>
                      <h4 className="font-black text-xl text-white tracking-tight"><TranslatedText>{item.title}</TranslatedText></h4>
                      <p className="text-base text-blue-100/60 leading-relaxed font-medium"><TranslatedText>{item.desc}</TranslatedText></p>
                    </div>
                  ))}
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
                    <TranslatedText>Unlock Exit Strategy</TranslatedText>
                    <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              </section>
            </section>
          </div>
        )}

        {id === 2 && (
          <div className="space-y-20 animate-in slide-in-from-right duration-700">
            <header className="space-y-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#2563EB] px-6 py-3 bg-blue-50 rounded-full border-2 border-blue-100 shadow-sm">
                  🔓 <TranslatedText>Strategy Unlocked</TranslatedText>
                </span>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs font-black border-2 border-slate-100 rounded-2xl p-3 bg-white outline-none focus:border-blue-500 transition-all shadow-sm"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
              <h1 className="text-6xl md:text-9xl font-fraunces font-black text-[#1A1D26] leading-none tracking-tighter">
                <TranslatedText>{meta.title}</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-3xl leading-relaxed font-medium italic">
                <TranslatedText>How to break the trap using 'Open System' logic—the mathematical leverage used by the top 1% to keep their money working 24/7.</TranslatedText>
              </p>
            </header>

            <section className="space-y-16">
              <div className="flex items-center gap-6 text-4xl font-fraunces font-black text-[#1A1D26]">
                <div className="p-5 bg-blue-100 rounded-[32px] shadow-lg shadow-blue-500/10">
                  <Droplets className="text-blue-600 h-10 w-10" />
                </div>
                <h2><TranslatedText>The "Closed" vs. "Open" Paradigm</TranslatedText></h2>
              </div>
              
              <div className="space-y-10 text-2xl text-[#334155] leading-relaxed font-medium">
                <p>
                  <TranslatedText>{`To understand how to pay off your home faster, you must first realize that your traditional mortgage is a "Closed System". In this legacy model, your financial energy is intentionally siloed by the bank.`}</TranslatedText>
                </p>
                <p>
                  <TranslatedText>{`Your paycheck goes into one bucket, your bills go out of another, and your mortgage sits in a third, high-walled vault that only accepts a tiny tribute once a month. The bank profits from this "idle time" every single night.`}</TranslatedText>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <CourseCard className="border-red-100 bg-red-50/20 p-10 shadow-inner rounded-[48px]">
                  <div className="flex items-center gap-4 text-red-700 font-black mb-6 uppercase tracking-[0.2em] text-sm">
                    <ShieldAlert className="h-8 w-8" />
                    <TranslatedText>The Closed System</TranslatedText>
                  </div>
                  <p className="text-lg mb-8 leading-relaxed text-red-900 font-bold"><TranslatedText>{`Think of this like a Sealed Water Tank. You can only pour a tiny cup once a month. For the other 29 days, your money sits idle while your debt level stays high, accumulating interest every night.`}</TranslatedText></p>
                  <ul className="space-y-5 text-sm text-red-800 font-black uppercase tracking-widest">
                    <li className="flex gap-4">❌ <TranslatedText>Savings sit idle at 0%</TranslatedText></li>
                    <li className="flex gap-4">❌ <TranslatedText>Interest calculated on full balance</TranslatedText></li>
                    <li className="flex gap-4">❌ <TranslatedText>Lender controls the speed</TranslatedText></li>
                  </ul>
                </CourseCard>

                <CourseCard className="border-emerald-100 bg-emerald-50/20 p-10 shadow-inner rounded-[48px]">
                  <div className="flex items-center gap-4 text-emerald-700 font-black mb-6 uppercase tracking-[0.2em] text-sm">
                    <Zap className="h-8 w-8" />
                    <TranslatedText>The Open System</TranslatedText>
                  </div>
                  <p className="text-lg mb-8 leading-relaxed text-emerald-900 font-bold"><TranslatedText>{`This is the "Bathtub" model. Your mortgage and checking are merged. Every dollar earned flows in immediately, dropping the water level (debt) instantly. You save interest every single night.`}</TranslatedText></p>
                  <ul className="space-y-5 text-sm text-emerald-800 font-black uppercase tracking-widest">
                    <li className="flex gap-4">✅ <TranslatedText>Every dollar works 24/7</TranslatedText></li>
                    <li className="flex gap-4">✅ <TranslatedText>Recalculated DAILY on low balance</TranslatedText></li>
                    <li className="flex gap-4">✅ <TranslatedText>YOU control the finish date</TranslatedText></li>
                  </ul>
                </CourseCard>
              </div>

              <div className="p-12 bg-blue-600 text-white rounded-[64px] border-4 border-blue-400/30 space-y-10 shadow-2xl shadow-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10"><BarChart className="h-48 w-48" /></div>
                <h3 className="text-4xl font-black flex items-center gap-6">
                  <BarChart className="h-12 w-12 text-blue-200" />
                  <TranslatedText>Average Daily Balance (ADB)</TranslatedText>
                </h3>
                <div className="space-y-8 text-blue-50 text-2xl leading-relaxed font-bold">
                  <p>
                    <TranslatedText>{`Most people think mortgage interest is a monthly fee. It's not. It is a daily mathematical penalty. When you leave ${formatCurrency(5000)} sitting in checking for 20 days, you are giving the bank a gift.`}</TranslatedText>
                  </p>
                  <p className="bg-white/10 p-10 rounded-[40px] border border-white/20">
                    <TranslatedText>{`In an "Open System," that same ${formatCurrency(5000)} sits INSIDE your mortgage for those 20 days. You aren't earning 1% interest; you are NEUTRALIZING 6-7% interest. This is the most efficient use of capital on earth.`}</TranslatedText>
                  </p>
                </div>
              </div>

              <PayoffRace />

              <Quiz 
                question="What is 'Interest Neutralization'?"
                options={[
                  "Negotiating a 0% interest rate with the bank",
                  "Using your income to temporarily lower the balance interest is calculated on",
                  "Closing your mortgage and moving to a rental",
                  "Paying your mortgage only once every six months"
                ]}
                correctAnswer={1}
                explanation="By moving your 'Transaction Hub' into your loan account, your income hits the principal immediately. Even if you spend that money later in the month, the bank is legally barred from charging you interest for the days that money sat against the principal."
              />

              <CaseStudy 
                name="David & Sarah"
                savings="$89,400"
                timeline="11 Years Cut"
                quote="The 'Bathtub' analogy finally made it click. We stopped treating our paycheck as spending money and started treating it as a 24/7 employee that kills our debt."
              />

              <section className="bg-slate-900 text-white p-16 rounded-[64px] text-center space-y-10 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 left-0 p-12 opacity-10">
                  <CheckCircle2 className="h-48 w-48" />
                </div>
                <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-[0.4em] backdrop-blur-3xl border border-white/10">
                  <CheckCircle2 className="h-5 w-5" />
                  <TranslatedText>End of Masterclass Module 2</TranslatedText>
                </div>
                <h3 className="text-5xl md:text-7xl font-fraunces font-black leading-tight"><TranslatedText>Turbocharge Your Flow?</TranslatedText></h3>
                <p className="text-slate-400 text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium italic"><TranslatedText>In Lesson 3, we add the high-octane fuel: The 'Credit Card Trick' and advanced 'Float' strategies to force the bank to pay for your life while your money kills your debt.</TranslatedText></p>
                <button className="bg-white text-slate-900 hover:bg-slate-100 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95" onClick={nextLesson}>
                  <TranslatedText>Unlock Turbo Strategies</TranslatedText>
                  <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                </button>
              </section>
            </section>
          </div>
        )}

        {(id >= 3 && !isPrivileged) && (
            <div className="space-y-12">
                <section className="bg-white p-20 rounded-[80px] border-4 border-dashed border-slate-200 text-center space-y-12 shadow-inner">
                    <div className="bg-amber-100 w-40 h-40 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20 border-4 border-white">
                        <Lock className="h-20 w-14 text-amber-600" />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-5xl md:text-7xl font-fraunces font-black text-slate-900 leading-tight tracking-tight">
                            <TranslatedText>Premium Strategy: Locked</TranslatedText>
                        </h2>
                        <p className="text-slate-500 text-2xl max-w-xl mx-auto font-medium leading-relaxed italic">
                            <TranslatedText>{`Lessons 3, 4, and 5 contain the high-velocity execution blueprints reserved for our Premium Members. Join 39,000+ homeowners reclaiming their freedom.`}</TranslatedText>
                        </p>
                    </div>
                    
                    <div className="p-12 bg-slate-50 rounded-[48px] text-left space-y-8 max-w-xl mx-auto border-2 border-white shadow-xl">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 pb-4"><TranslatedText>The Advanced Curriculum:</TranslatedText></h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-5 text-xl font-bold text-slate-700">
                                <Gem className="h-8 w-8 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The 30-Day Float: Force the bank to pay your bills.</TranslatedText></span>
                            </li>
                            <li className="flex items-start gap-5 text-xl font-bold text-slate-700">
                                <Gem className="h-8 w-8 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The Lender Audit: The secret scripts for Loan Officers.</TranslatedText></span>
                            </li>
                            <li className="flex items-start gap-5 text-xl font-bold text-slate-700">
                                <Gem className="h-8 w-8 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The 90-Day Roadmap: Your step-by-step finish line.</TranslatedText></span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-10 space-y-8">
                        <Button size="lg" className="w-full sm:w-auto px-20 py-12 text-3xl font-black rounded-[32px] shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95" asChild>
                            <Link href="/purchase?plan=pro_197">
                                <TranslatedText>Unlock Full Course</TranslatedText>
                                <ArrowRight className="ml-4 h-10 w-10" />
                            </Link>
                        </Button>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]"><TranslatedText>30-Day Money-Back Guarantee</TranslatedText></p>
                    </div>
                </section>
            </div>
        )}

        {(id >= 3 && isPrivileged) && (
          <div className="space-y-20 animate-in fade-in duration-700">
             
             {id === 3 && (
               <div className="space-y-20">
                  <header className="p-16 bg-pink-600 text-white rounded-[64px] shadow-2xl relative overflow-hidden border-4 border-pink-400/30">
                    <div className="absolute top-0 right-0 p-12 opacity-20">
                      <Rocket className="h-48 w-48" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] opacity-80 mb-4">
                        <Award className="h-6 w-6" /> <TranslatedText>Advanced Module: High Velocity</TranslatedText>
                      </div>
                      <h1 className="text-6xl md:text-8xl font-fraunces font-black leading-none tracking-tight">
                        <TranslatedText>The 30-Day Float</TranslatedText>
                      </h1>
                      <p className="mt-8 text-2xl opacity-90 leading-relaxed font-bold max-w-2xl italic">
                        <TranslatedText>{`How to force the bank to provide you with an interest-free loan for every daily expense, while your cash kills your mortgage interest 24/7.`}</TranslatedText>
                      </p>
                    </div>
                  </header>

                  <section className="space-y-16">
                    <div className="flex items-center gap-6 text-4xl font-fraunces font-black text-[#1A1D26]">
                      <div className="p-5 bg-pink-100 rounded-[32px] shadow-lg shadow-pink-500/10">
                        <CreditCard className="text-pink-600 h-10 w-10" />
                      </div>
                      <h2><TranslatedText>The Art of the Interest-Free Loan</TranslatedText></h2>
                    </div>

                    <div className="space-y-10 leading-relaxed text-2xl text-[#334155] font-medium">
                      <p>
                        <TranslatedText>{`In Lesson 2, you learned how merging your income with your mortgage drops the interest calculation instantly. Now, we add the multiplier.`}</TranslatedText>
                      </p>
                      
                      <div className="p-12 bg-slate-900 text-white rounded-[56px] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform">
                          <Zap className="h-48 w-48 text-yellow-400" />
                        </div>
                        <h3 className="text-3xl font-black text-pink-400 flex items-center gap-4">
                          <Zap className="h-10 w-10 text-yellow-400" />
                          <TranslatedText>The Arbitrage Mechanic</TranslatedText>
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-2xl italic font-serif">
                          <TranslatedText>{`Imagine you need to buy $1,000 of groceries today. If you take that $1,000 out of your ${country.productShort} on Day 1, the bank starts charging interest tonight. However, if you put those groceries on a credit card, the $1,000 remains INSIDE your loan, neutralizing interest for the next 25-30 days.`}</TranslatedText>
                        </p>
                      </div>

                      <p>
                        <TranslatedText>{`This is 'The Float'. By utilizing a high-rewards card for every single daily transaction and paying it off ONLY on the final day of the grace period, you keep your average daily balance at its absolute minimum.`}</TranslatedText>
                      </p>
                    </div>

                    <Quiz 
                      question="What is the primary risk of 'The Float' strategy?"
                      options={[
                        "The bank might close your credit card account",
                        "Your mortgage interest rate might suddenly spike",
                        "Missing the payment by one day incurs 20%+ interest",
                        "The government might tax your credit card rewards"
                      ]}
                      correctAnswer={2}
                      explanation="The float is a game of precision. If you carry a balance past the interest-free period, the 20-25% credit card interest will immediately wipe out the 6-7% mortgage interest you saved. This strategy is only for disciplined strategists who automate their payments."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <CourseCard className="border-pink-100 bg-white p-10 shadow-2xl rounded-[48px]">
                        <div className="h-16 w-16 bg-pink-100 rounded-[24px] flex items-center justify-center text-pink-600 mb-6">
                          <Flame className="h-8 w-8" />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] mb-4"><TranslatedText>The Velocity Sweep</TranslatedText></h4>
                        <p className="text-lg text-slate-600 leading-relaxed font-bold">
                          <TranslatedText>{`The key is the 'Sweep'. You time your credit card payment to occur 24 hours before the interest-free period ends. Over 12 months, this alone can collapse your payoff date by an additional 6-12 months.`}</TranslatedText>
                        </p>
                      </CourseCard>
                      <CourseCard className="border-blue-100 bg-white p-10 shadow-2xl rounded-[48px]">
                        <div className="h-16 w-16 bg-blue-100 rounded-[24px] flex items-center justify-center text-blue-600 mb-6">
                          <Award className="h-8 w-8" />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em] mb-4"><TranslatedText>The Rewards Paradox</TranslatedText></h4>
                        <p className="text-lg text-slate-600 leading-relaxed font-bold">
                          <TranslatedText>{`By channeling all 'Flow' through a rewards vehicle, members earn enough points to pay for family vacations—all while paying off their home years sooner. Your lifestyle becomes a wealth-builder.`}</TranslatedText>
                        </p>
                      </CourseCard>
                    </div>

                    <div className="pt-16 text-center space-y-10">
                      <h3 className="text-4xl font-fraunces font-black text-[#1A1D26]">
                        <TranslatedText>Ready for the Lender Audit?</TranslatedText>
                      </h3>
                      <button 
                        onClick={nextLesson}
                        className="bg-pink-600 text-white hover:bg-pink-700 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                      >
                        <TranslatedText>Unlock The Audit</TranslatedText>
                        <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                      </button>
                    </div>
                  </section>
               </div>
             )}

             {id === 4 && (
               <div className="space-y-20">
                  <header className="p-16 bg-indigo-600 text-white rounded-[64px] shadow-2xl relative overflow-hidden border-4 border-indigo-400/30">
                    <div className="absolute top-0 right-0 p-12 opacity-20">
                      <Search className="h-48 w-48" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] opacity-80 mb-4">
                        <Award className="h-6 w-6" /> <TranslatedText>Advanced Module: The Audit</TranslatedText>
                      </div>
                      <h1 className="text-6xl md:text-8xl font-fraunces font-black leading-none tracking-tight">
                        <TranslatedText>The Lender Audit</TranslatedText>
                      </h1>
                      <p className="mt-8 text-2xl opacity-90 leading-relaxed font-bold max-w-2xl italic">
                        <TranslatedText>{`Most banks want to sell you a debt trap. Your job is to find the 'Strategic Valve'—the tool that allows you to control velocity.`}</TranslatedText>
                      </p>
                    </div>
                  </header>

                  <section className="space-y-16">
                    <div className="flex items-center gap-6 text-4xl font-fraunces font-black text-[#1A1D26]">
                      <div className="p-5 bg-indigo-100 rounded-[32px] shadow-lg shadow-indigo-500/10">
                        <Landmark className="text-indigo-600 h-10 w-10" />
                      </div>
                      <h2><TranslatedText>Banks are Vendors, Not Partners</TranslatedText></h2>
                    </div>

                    <div className="space-y-10 leading-relaxed text-2xl text-[#334155] font-medium">
                      <p>
                        <TranslatedText>{`To execute the Mortgage Cutter Method, you must bypass the standard sales desk and audit for three specific non-negotiables.`}</TranslatedText>
                      </p>
                      
                      <div className="p-12 bg-slate-50 rounded-[56px] border-4 border-indigo-100 space-y-12 shadow-inner">
                        <h3 className="text-3xl font-black text-indigo-900 flex items-center gap-4">
                          <CheckCircle className="h-10 w-10 text-indigo-600" />
                          <TranslatedText>The 3 Non-Negotiables</TranslatedText>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                              { num: "01", title: "Daily Recalculation", desc: "Interest must recalculate DAILY based on current balance. Without this, 'The Float' fails." },
                              { num: "02", title: "Auto-Readvanceable", desc: "As you pay down principal, your credit limit should grow automatically. Liquidity is king." },
                              { num: "03", title: "Full Transactionality", desc: "The account must have a debit card, bill pay, and direct deposit. It is your new checking account." }
                            ].map((item, i) => (
                              <div key={i} className="space-y-4">
                                  <p className="font-black text-xs uppercase text-indigo-500 tracking-[0.3em]">{item.num}. {item.title}</p>
                                  <p className="text-lg font-bold text-slate-600 leading-relaxed"><TranslatedText>{item.desc}</TranslatedText></p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    <Quiz 
                      question="What should you ask for instead of a 'Mortgage' when calling a bank?"
                      options={[
                        "A High-Interest Savings Account",
                        "A Second-Lien Home Equity Line",
                        "A First-Lien Revolving Credit Line",
                        "A Debt Consolidation Loan"
                      ]}
                      correctAnswer={2}
                      explanation="Most retail banks only understand HELOCs as second mortgages. To use this strategy, you need the credit line to be in the 'first-lien' position—meaning it replaces your entire mortgage. This is often found in the 'Private Wealth' or 'Custom Lending' departments."
                    />

                    <div className="space-y-10">
                        <h3 className="text-4xl font-fraunces font-black text-[#1A1D26] flex items-center gap-6">
                            <MessageSquare className="h-10 w-10 text-indigo-600" />
                            <TranslatedText>The Banker Script</TranslatedText>
                        </h3>
                        <p className="text-2xl text-[#334155] leading-relaxed font-medium">
                            <TranslatedText>{`Use these specific questions to filter out lenders in under 5 minutes. If they can't answer 'Yes' to all three, hang up.`}</TranslatedText>
                        </p>
                        
                        <div className="space-y-8">
                            <ChatBubble role="you"><TranslatedText>Do you offer a HELOC that can be placed in the first-lien position to replace my entire mortgage?</TranslatedText></ChatBubble>
                            <ChatBubble role="bank"><TranslatedText>Most HELOCs are second mortgages, but let me check if we can do a primary position line...</TranslatedText></ChatBubble>
                            <ChatBubble role="you"><TranslatedText>Does this account allow for direct deposit of my payroll and standard online bill pay features directly from the line of credit?</TranslatedText></ChatBubble>
                            <ChatBubble role="pro"><TranslatedText>Pro Tip: If they say 'You have to transfer funds to a checking account first,' they don't have the right product. You need the velocity of a direct-deposit-to-loan structure.</TranslatedText></ChatBubble>
                        </div>
                    </div>

                    <div className="pt-16 text-center space-y-10">
                      <h3 className="text-4xl font-fraunces font-black text-[#1A1D26]">
                        <TranslatedText>Ready for your Final Action Plan?</TranslatedText>
                      </h3>
                      <button 
                        onClick={nextLesson}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                      >
                        <TranslatedText>Unlock Your Roadmap</TranslatedText>
                        <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                      </button>
                    </div>
                  </section>
               </div>
             )}

             {id === 5 && (
               <div className="space-y-20">
                  <header className="p-16 bg-blue-600 text-white rounded-[64px] shadow-2xl relative overflow-hidden border-4 border-blue-400/30">
                    <div className="absolute top-0 right-0 p-12 opacity-20">
                      <Award className="h-48 w-48" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] opacity-80 mb-4">
                        <Award className="h-6 w-6" /> VIP Access Granted
                      </div>
                      <h1 className="text-6xl md:text-8xl font-fraunces font-black leading-none tracking-tight">
                        <TranslatedText>{meta.title}</TranslatedText>
                      </h1>
                      <p className="mt-8 text-2xl opacity-90 leading-relaxed font-bold max-w-2xl italic">
                        <TranslatedText>{`Welcome back, Administrator. Here is your executive summary of the 90-day implementation cycle.`}</TranslatedText>
                      </p>
                    </div>
                  </header>

                  <section className="space-y-16">
                    <div className="flex items-center gap-6 text-4xl font-fraunces font-black text-[#1A1D26]">
                      <div className="p-5 bg-blue-100 rounded-[32px] shadow-lg shadow-blue-500/10">
                        <Target className="text-blue-600 h-10 w-10" />
                      </div>
                      <h2><TranslatedText>Your First 90 Days</TranslatedText></h2>
                    </div>

                    <div className="space-y-10 leading-relaxed text-2xl text-[#334155] font-medium">
                      <p>
                        <TranslatedText>{`Success with the Mortgage Cutter Method isn't about working harder—it's about structural discipline.`}</TranslatedText>
                      </p>
                      
                      <div className="grid grid-cols-1 gap-10">
                        {[
                          { icon: ShieldCheck, phase: "1", title: "The Liquidity Injection (Day 1-30)", desc: `Empty your stagnant silos. Every dollar in a checking account at 0% is a penalty. Move your emergency fund into the ${country.productShort} immediately. This stops interest on that capital forever.`, color: "text-blue-600" },
                          { icon: TrendingUp, phase: "2", title: "Velocity Maintenance (Day 31-60)", desc: "Establish your rhythm. 100% payroll direct-deposited. Bills timed to the last day of the grace period. Keep your capital anchored in your equity for the maximum nights possible.", color: "text-emerald-600" },
                          { icon: Award, phase: "3", title: "The Optimization Audit (Day 61-90)", desc: "By month three, audit your lifestyle friction. Can you increase your surplus by $200? That isn't just $200—it's a high-velocity employee that kills thousands in future interest.", color: "text-indigo-600" }
                        ].map((item, i) => (
                          <div key={i} className="p-12 bg-white border-2 border-slate-100 rounded-[56px] shadow-xl relative overflow-hidden group hover:border-blue-200 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-6 transition-transform">
                              <item.icon className={cn("h-32 w-32", item.color)} />
                            </div>
                            <h4 className={cn("font-black uppercase text-xs tracking-[0.4em] mb-6", item.color)}><TranslatedText>Phase {item.phase}: {item.title}</TranslatedText></h4>
                            <p className="text-xl text-slate-700 font-bold leading-relaxed max-w-lg"><TranslatedText>{item.desc}</TranslatedText></p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <CourseCard title="📝 Your Execution Checklist" className="p-12 border-4 border-blue-100 bg-blue-50/20 rounded-[56px]">
                      <div className="space-y-6">
                        <TaskItem id="t1" label="Run your numbers in the Chunker Simulator." />
                        <TaskItem id="t2" label="Call 3 local lenders using the Audit Script." />
                        <TaskItem id="t3" label="Identify your 'Liquidity Injection' amount." />
                        <TaskItem id="t4" label="Set up direct deposit to your new strategic line." />
                        <TaskItem id="t5" label="Commit to the 30-Day Velocity Sweep." />
                      </div>
                    </CourseCard>

                    <div className="bg-slate-900 text-white p-20 rounded-[80px] text-center space-y-12 shadow-2xl relative overflow-hidden border border-white/5">
                      <div className="absolute top-0 left-0 p-16 opacity-10">
                        <Trophy className="h-48 w-48" />
                      </div>
                      <h3 className="text-6xl md:text-8xl font-fraunces font-black leading-tight tracking-tight"><TranslatedText>Congratulations, Strategist.</TranslatedText></h3>
                      <p className="text-slate-400 text-3xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium italic">
                        <TranslatedText>{`You have the map. You have the scripts. You have the math. The only thing left is to take the first step.`}</TranslatedText>
                      </p>
                      <button className="bg-white text-slate-900 hover:bg-slate-100 font-black px-20 py-10 rounded-[40px] text-4xl group flex items-center gap-8 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95" onClick={nextLesson}>
                        <TranslatedText>Graduate</TranslatedText>
                        <CheckCircle className="h-14 w-14 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
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
          
          {(id < 5 && (!isLocked || isPrivileged)) && (
            <button 
                onClick={nextLesson}
                className="group flex items-center gap-4 bg-[#2563EB] text-white px-12 py-6 rounded-[24px] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 text-2xl"
            >
                <TranslatedText>{id === 2 ? "See Advanced Plans" : "Next Lesson"}</TranslatedText>
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
