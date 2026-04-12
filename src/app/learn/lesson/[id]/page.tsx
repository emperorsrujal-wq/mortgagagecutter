'use client';
import React, { use } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { InterestCalc, AmortViz, PayoffRace } from '@/components/course/Calculators';
import { CourseCard, InfoBox, ExpandSection, StatBox, ChatBubble, TaskItem } from '@/components/course/UIComponents';
import { TranslatedText } from '@/components/course/TranslatedText';
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
        <Link href="/learn" className="flex items-center gap-2 text-[#5A6175] hover:text-[#1A1D26] font-bold text-sm">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline"><TranslatedText>Course Hub</TranslatedText></span>
        </Link>
        <div className="text-xs font-black uppercase text-slate-400 tracking-widest">
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
    else router.push('/');
  };

  const prevLesson = () => {
    if (id > 1) router.push(`/learn/lesson/${id - 1}`);
    else router.push('/learn');
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-24">
      <ProgressBar current={id} />
      
      <div className="max-w-[720px] mx-auto px-4 py-12 space-y-10">
        
        {id === 1 && (
          <div className="space-y-16 animate-in fade-in duration-1000">
            <header className="space-y-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                <ShieldAlert className="h-3 w-3" />
                <TranslatedText>Security Warning: High Stakes Math</TranslatedText>
              </div>
              <h1 className="text-4xl md:text-7xl font-fraunces font-black text-[#1A1D26] leading-tight tracking-tighter">
                <TranslatedText>The $250,000 Heist Your Bank is Praying You Never Discover</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>The shocking "Front-Loading" secret they bury on Page 3 of your contract—and the structural system that destroys it.</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <CourseCard className="border-l-8 border-l-red-600 shadow-2xl p-10">
                <div className="space-y-8">
                  <h2 className="text-4xl font-fraunces font-black text-red-700 leading-tight">
                    <TranslatedText>The Tale of the Invisible House</TranslatedText>
                  </h2>
                  <div className="space-y-6 leading-relaxed text-lg text-[#334155]">
                    <p>
                      <TranslatedText>{`Look, let's be blunt. When you sign for a ${formatCurrency(country.avgHome)} mortgage in ${country.name}, you think you're buying a home. You aren't. You're actually buying TWO houses. One for your family, and one for the bank's shareholders. This is not hyperbole—it is the structural reality of modern amortized banking.`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`Most homeowners see their mortgage as a simple debt to be repaid. The lender, however, sees you as a high-yield asset. They have meticulously engineered a 30-year labor contract where you provide the maintenance, the taxes, and the sweat equity, while they collect a "protection fee" that often totals 100% or more of the home's original price.`}</TranslatedText>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-[-10px] right-[-10px] opacity-10 group-hover:scale-110 transition-transform">
                        <HomeIcon className="h-32 w-32 text-emerald-600" />
                      </div>
                      <h4 className="font-black text-emerald-800 uppercase text-sm tracking-widest"><TranslatedText>House #1: Yours</TranslatedText></h4>
                      <p className="text-base text-emerald-700 font-medium leading-relaxed">
                        <TranslatedText>{`This is your sanctuary. You paint the walls, mow the lawn, and fix the roof. Yet, under the traditional system, you only truly own a tiny fraction of it for the first 15 years.`}</TranslatedText>
                      </p>
                    </div>
                    <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-[-10px] right-[-10px] opacity-10 group-hover:scale-110 transition-transform">
                        <Ghost className="h-32 w-32 text-red-600" />
                      </div>
                      <h4 className="font-black text-red-800 uppercase text-sm tracking-widest"><TranslatedText>House #2: The Bank's</TranslatedText></h4>
                      <p className="text-base text-red-700 font-medium leading-relaxed">
                        <TranslatedText>{`This house is invisible. It’s built entirely of your overtime hours and interest payments. The bank has zero maintenance, zero risk, and zero taxes—yet they take its full value from your pocket.`}</TranslatedText>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 leading-relaxed text-lg text-[#334155]">
                    <p>
                      <TranslatedText>{`In ${country.name}, the math is sobering. By the time you've finally cleared House #1, you have given the lender enough capital to buy House #2 in CASH. They didn't build it. They didn't help you with the downpayment. They simply used the "permission of debt" to capture your future labor. This is the structural heist that keeps the middle class on a treadmill for decades.`}</TranslatedText>
                    </p>
                  </div>

                  <div className="p-8 bg-slate-900 text-white rounded-[40px] border border-white/10 space-y-6 shadow-xl">
                    <h3 className="text-2xl font-black text-blue-400 flex items-center gap-3">
                      <Target className="h-7 w-7 text-red-500" />
                      <TranslatedText>The Amortization Machine</TranslatedText>
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      <TranslatedText>{`Your "monthly payment" is a single, clean number designed to hide two very different transactions. In the early years of a 30-year loan, nearly 70-80% of your check is flushed directly into the bank's interest ledger. You are essentially paying "rent" to the bank while the principal—the number that actually builds your wealth—is starved of capital. This front-loading is a deliberate choice made by lenders to capture their profit before you have a chance to refinance or sell.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <div className="text-center space-y-6">
                <h3 className="text-3xl font-fraunces font-black text-[#1A1D26] uppercase tracking-widest">
                  <TranslatedText>Want to see the damage?</TranslatedText>
                </h3>
                <p className="text-slate-500 text-lg italic"><TranslatedText>Move the sliders below. See exactly how much House #2 is siphoning from your family's future right now.</TranslatedText></p>
              </div>

              <InterestCalc />

              <div className="p-10 bg-[#0F172A] text-white rounded-[48px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Timer className="h-48 w-48" />
                </div>
                <div className="relative z-10 space-y-8">
                  <h2 className="text-4xl font-fraunces font-black text-blue-400 leading-tight">
                    <TranslatedText>The 19-Year "Siphon" Trap</TranslatedText>
                  </h2>
                  <div className="space-y-6 text-slate-300 text-xl leading-relaxed">
                    <p>
                      <TranslatedText>{`Lenders are smarter than you think. They don't take their profit evenly. They SIPHON it from you at the very beginning when your balance is at its peak. This is why "paying an extra $100" at year 20 feels good but does almost nothing—the bank has already extracted the majority of their projected profit.`}</TranslatedText>
                    </p>
                    <p className="text-white font-bold bg-blue-500/20 p-6 rounded-2xl border border-blue-500/30">
                      <TranslatedText>{`On a standard 30-year loan, it takes nearly 19 YEARS of consistent payments before your monthly check actually starts paying off more principal than interest. For 63% of your loan's life, you are an interest-generating machine for the institution.`}</TranslatedText>
                    </p>
                    <p className="text-slate-400 text-lg">
                      <TranslatedText>Press PLAY below. Watch how for nearly two decades, your life's work is funneled into the bank's "Invisible House" before a single brick of your own is truly paid for. This is the secret that keeps families in debt for generations.</TranslatedText>
                    </p>
                  </div>
                </div>
              </div>

              <AmortViz />

              <section className="bg-gradient-to-br from-blue-600 to-indigo-900 p-12 md:p-16 rounded-[64px] border border-white/10 shadow-2xl space-y-12">
                <div className="text-center space-y-6">
                  <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md mb-4">
                    <Zap className="h-10 w-10 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-fraunces font-black text-white leading-tight">
                    <TranslatedText>What if you could Nuke the trap?</TranslatedText>
                  </h2>
                  <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>Most people see these numbers and accept them as a "fact of life." They shouldn't. There is a specific, bank-agnostic strategy used by the top 1% of homeowners to collapse this timeline by using the bank's own daily interest math against them.</TranslatedText>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-inner space-y-4 group hover:bg-white/20 transition-all">
                    <div className="h-12 w-12 bg-blue-400/20 rounded-full flex items-center justify-center text-blue-300">
                      <Droplets className="h-6 w-6" />
                    </div>
                    <h4 className="font-black text-lg text-white"><TranslatedText>The "Bathtub" Flow</TranslatedText></h4>
                    <p className="text-sm text-blue-100/70 leading-relaxed"><TranslatedText>How to use your income to "choke" the daily interest calculation without spending an extra dime. Revealed in Lesson 2.</TranslatedText></p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-inner space-y-4 group hover:bg-white/20 transition-all">
                    <div className="h-12 w-12 bg-pink-400/20 rounded-full flex items-center justify-center text-pink-300">
                      <Rocket className="h-6 w-6" />
                    </div>
                    <h4 className="font-black text-lg text-white"><TranslatedText>The 30-Day Float</TranslatedText></h4>
                    <p className="text-sm text-blue-100/70 leading-relaxed"><TranslatedText>How to force the bank to pay for your groceries while your money kills your principal. Revealed in Lesson 3.</TranslatedText></p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-inner space-y-4 group hover:bg-white/20 transition-all">
                    <div className="h-12 w-12 bg-purple-400/20 rounded-full flex items-center justify-center text-purple-300">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h4 className="font-black text-lg text-white"><TranslatedText>The Banker Script</TranslatedText></h4>
                    <p className="text-sm text-blue-100/70 leading-relaxed"><TranslatedText>The 3 "Magic Phrases" that force loan officers to give you premium interest-cutting products. Revealed in Lesson 4.</TranslatedText></p>
                  </div>
                </div>

                <div className="pt-12 border-t border-white/10 text-center space-y-8">
                  <div className="flex items-center justify-center gap-3 text-yellow-400 font-black uppercase text-sm tracking-[0.3em]">
                    <ShieldCheck className="h-5 w-5" />
                    <TranslatedText>Escape the Trap Today</TranslatedText>
                  </div>
                  <h3 className="text-3xl font-fraunces font-black text-white">
                    <TranslatedText>Ready to see the "Open System" Exit Strategy?</TranslatedText>
                  </h3>
                  <button 
                    onClick={nextLesson}
                    className="bg-white text-blue-900 hover:bg-blue-50 font-black px-12 py-6 rounded-2xl text-2xl group flex items-center gap-4 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <TranslatedText>Unlock the Exit Strategy</TranslatedText>
                    <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <p className="text-blue-200/60 text-sm font-bold uppercase tracking-widest">
                    <TranslatedText>Join 39,000+ homeowners who have already broken the 30-year trap.</TranslatedText>
                  </p>
                </div>
              </section>
            </section>
          </div>
        )}

        {id === 2 && (
          <div className="space-y-16 animate-in slide-in-from-right duration-700">
            <header className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#2563EB] px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                  🔓 <TranslatedText>Strategy Unlocked</TranslatedText>
                </span>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs font-black border-2 border-slate-100 rounded-xl p-2 bg-white outline-none focus:border-blue-500 transition-colors"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
              <h1 className="text-5xl md:text-7xl font-fraunces font-black text-[#1A1D26] leading-tight tracking-tighter">
                <TranslatedText>{meta.title}</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-2xl leading-relaxed font-medium">
                <TranslatedText>How to break the trap using the 'Open System' logic—the same mathematical leverage used by the top 1% to keep their money working 24/7.</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <div className="flex items-center gap-4 text-3xl font-fraunces font-black text-[#1A1D26]">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Droplets className="text-blue-600 h-8 w-8" />
                </div>
                <h2><TranslatedText>The "Closed" vs. "Open" Paradigm</TranslatedText></h2>
              </div>
              
              <div className="space-y-6 text-lg text-[#334155] leading-relaxed">
                <p>
                  <TranslatedText>{`To understand how to pay off your home faster, you must first realize that your traditional mortgage is a "Closed System". In this legacy model, your financial energy is intentionally siloed by the bank. Your paycheck goes into one bucket, your bills go out of another, and your mortgage sits in a third, high-walled vault that only accepts a tiny tribute once a month.`}</TranslatedText>
                </p>
                <p>
                  <TranslatedText>{`This friction isn't accidental. It is designed to ensure your money sits "idle" in low-interest checking accounts while your debt remains at its maximum level for 29 out of 30 days. The bank profits from this "idle time" every single night.`}</TranslatedText>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <CourseCard className="border-red-100 bg-red-50/30 p-8 shadow-inner">
                  <div className="flex items-center gap-3 text-red-700 font-black mb-4 uppercase tracking-widest text-sm">
                    <ShieldAlert className="h-6 w-6" />
                    <TranslatedText>The Closed System (Legacy)</TranslatedText>
                  </div>
                  <p className="text-base mb-6 leading-relaxed text-red-900/80 font-medium"><TranslatedText>{`Think of this like a Sealed Water Tank. You can only pour a tiny cup of water into the tank once a month. For the other 29 days, your money sits in a separate, zero-interest bucket (your checking account) while the tank's water level (your debt) stays high, accumulating interest on every single gallon every single night.`}</TranslatedText></p>
                  <ul className="space-y-3 text-sm text-red-800/70 font-bold">
                    <li className="flex gap-3">❌ <TranslatedText>Savings sit idle while debt costs you money every night</TranslatedText></li>
                    <li className="flex gap-3">❌ <TranslatedText>Interest is calculated on the full balance for 30 days straight</TranslatedText></li>
                    <li className="flex gap-3">❌ <TranslatedText>The lender controls the speed of your payoff</TranslatedText></li>
                  </ul>
                </CourseCard>

                <CourseCard className="border-emerald-100 bg-emerald-50/30 p-8 shadow-inner">
                  <div className="flex items-center gap-3 text-emerald-700 font-black mb-4 uppercase tracking-widest text-sm">
                    <Zap className="h-6 w-6" />
                    <TranslatedText>The Open System (Strategic)</TranslatedText>
                  </div>
                  <p className="text-base mb-6 leading-relaxed text-emerald-900/80 font-medium"><TranslatedText>{`This is the "Bathtub" model. Your mortgage and your checking account are merged into a single, fluid vessel. Every dollar you earn flows into the tub immediately, dropping the water level (the debt) instantly. Because interest is calculated DAILY, every dollar you keep in the tub tonight saves you interest tomorrow.`}</TranslatedText></p>
                  <ul className="space-y-3 text-sm text-emerald-800/70 font-bold">
                    <li className="flex gap-3">✅ <TranslatedText>Every dollar works 24/7 to lower interest calculations</TranslatedText></li>
                    <li className="flex gap-3">✅ <TranslatedText>Interest is recalculated DAILY on the lowest possible balance</TranslatedText></li>
                    <li className="flex gap-3">✅ <TranslatedText>YOU control the velocity and the finish date</TranslatedText></li>
                  </ul>
                </CourseCard>
              </div>

              <div className="p-10 bg-blue-50 rounded-[48px] border border-blue-100 space-y-8 shadow-xl">
                <h3 className="text-3xl font-black text-blue-900 flex items-center gap-4">
                  <BarChart className="h-8 w-8 text-blue-600" />
                  <TranslatedText>The "Average Daily Balance" Secret</TranslatedText>
                </h3>
                <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
                  <p>
                    <TranslatedText>{`Most people think mortgage interest is a monthly fee. It's not. It is a daily mathematical penalty. When you leave ${formatCurrency(5000)} sitting in a checking account for 20 days while waiting to pay bills, you are effectively giving the bank a free gift of those 20 days of interest.`}</TranslatedText>
                  </p>
                  <p className="font-bold text-blue-800">
                    <TranslatedText>{`In an "Open System," that same ${formatCurrency(5000)} sits inside your mortgage account for those 20 days, "choking" the interest engine. You aren't earning 1% interest; you are NEUTRALIZING 6% interest (or whatever your mortgage rate is). This is the most efficient use of capital on earth because the interest you save is tax-free and 100% guaranteed.`}</TranslatedText>
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 text-white p-12 rounded-[48px] space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 p-8 opacity-5">
                <UserCircle2 className="h-64 w-64" />
              </div>
              <h3 className="text-3xl font-fraunces font-black flex items-center gap-4">
                <UserCircle2 className="text-blue-400 h-10 w-10" />
                <TranslatedText>A Day in the Life of the Open System</TranslatedText>
              </h3>
              <p className="text-slate-400 text-xl leading-relaxed">
                <TranslatedText>{`Let's look at how a typical family's month changes when they switch to a ${country.productShort} in ${country.name}. They haven't earned an extra cent, and they haven't changed their lifestyle—yet watch what happens to their payoff velocity.`}</TranslatedText>
              </p>

              <div className="space-y-8 relative z-10">
                <div className="flex gap-6 items-start border-l-4 border-blue-500/30 pl-8 pb-10">
                  <div className="bg-blue-500 h-12 w-12 rounded-full flex items-center justify-center shrink-0 font-black text-lg shadow-xl shadow-blue-500/20">1</div>
                  <div className="space-y-3">
                    <p className="font-black text-blue-400 uppercase text-xs tracking-[0.2em]"><TranslatedText>Payday: The Principal Injection</TranslatedText></p>
                    <p className="text-lg text-slate-200 leading-relaxed font-medium"><TranslatedText>{`The full paycheck is deposited. In a legacy loan, this would sit idle in checking for 15 days. Here, it hits the ${country.productShort} balance immediately. For the next two weeks, the bank is legally barred from charging you interest on that amount. The debt is being neutralized from the second the money hits the account.`}</TranslatedText></p>
                  </div>
                </div>
                <div className="flex gap-6 items-start border-l-4 border-blue-500/30 pl-8 pb-10">
                  <div className="bg-blue-500 h-12 w-12 rounded-full flex items-center justify-center shrink-0 font-black text-lg shadow-xl shadow-blue-500/20">2</div>
                  <div className="space-y-3">
                    <p className="font-black text-blue-400 uppercase text-xs tracking-[0.2em]"><TranslatedText>Daily Friction: Controlled Flow</TranslatedText></p>
                    <p className="text-lg text-slate-200 leading-relaxed font-medium"><TranslatedText>{`When you need ${country.symbol}200 for groceries, you withdraw it. The balance goes up slightly, but only for the remaining days of the month. Your money worked for you for 20 days before it was released to pay for the bread and milk. In the legacy system, that money would have done nothing for you.`}</TranslatedText></p>
                  </div>
                </div>
                <div className="flex gap-6 items-start border-l-4 border-blue-500/30 pl-8">
                  <div className="bg-blue-500 h-12 w-12 rounded-full flex items-center justify-center shrink-0 font-black text-lg shadow-xl shadow-blue-500/20">3</div>
                  <div className="space-y-3">
                    <p className="font-black text-blue-400 uppercase text-xs tracking-[0.2em]"><TranslatedText>The Snowball Effect</TranslatedText></p>
                    <p className="text-lg text-slate-200 leading-relaxed font-medium"><TranslatedText>{`Because you kept your "Idle Cash" inside the home loan for an average of 15-20 days longer each month, the total interest charged is hundreds of dollars lower. This "saved interest" never leaves your pocket. It stays inside the account, effectively becoming an automatic principal payment. This creates a compounding snowball that collapses a 30-year term into 10-12 years automatically.`}</TranslatedText></p>
                  </div>
                </div>
              </div>
            </section>

            <PayoffRace />

            <section className="bg-gradient-to-br from-emerald-600 to-teal-800 p-16 rounded-[48px] text-white text-center space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 p-8 opacity-10">
                <CheckCircle2 className="h-32 w-32" />
              </div>
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] backdrop-blur-md border border-white/10">
                <CheckCircle2 className="h-4 w-4" />
                <TranslatedText>End of Lesson 2</TranslatedText>
              </div>
              <h3 className="text-4xl md:text-5xl font-fraunces font-black leading-tight"><TranslatedText>Ready to Turbocharge Your Flow?</TranslatedText></h3>
              <p className="text-emerald-50 text-xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium"><TranslatedText>You've seen the engine. Now it's time to add the high-octane fuel. In Lesson 3, we reveal the "Credit Card Trick" and advanced "Float" strategies to force the bank to pay for your life while your money kills your debt.</TranslatedText></p>
              <button className="bg-white text-emerald-700 hover:bg-emerald-50 font-black px-12 py-6 rounded-2xl text-2xl group flex items-center gap-4 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95" onClick={nextLesson}>
                <TranslatedText>Unlock Turbo Strategies</TranslatedText>
                <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
              </button>
            </section>
          </div>
        )}

        {(id >= 3 && !isPrivileged) && (
            <div className="space-y-12">
                <section className="bg-white p-16 rounded-[64px] border-4 border-dashed border-slate-200 text-center space-y-10 shadow-inner">
                    <div className="bg-amber-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
                        <Lock className="h-14 w-10 text-amber-600" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-fraunces font-black text-slate-900 leading-tight tracking-tight">
                            <TranslatedText>Premium Strategy: Locked</TranslatedText>
                        </h2>
                        <p className="text-slate-500 text-xl max-w-lg mx-auto font-medium leading-relaxed">
                            <TranslatedText>{`Lessons 3, 4, and 5 contain the high-velocity execution blueprints reserved for our Premium Members. Join the thousands of ${country.name} homeowners who have already taken the next step.`}</TranslatedText>
                        </p>
                    </div>
                    
                    <div className="p-10 bg-slate-50 rounded-[40px] text-left space-y-6 max-w-lg mx-auto border-2 border-white shadow-lg">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-2"><TranslatedText>What you're missing:</TranslatedText></h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-base font-bold text-slate-700">
                                <Gem className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The 30-Day Float: How to make the bank pay your bills.</TranslatedText></span>
                            </li>
                            <li className="flex items-start gap-4 text-base font-bold text-slate-700">
                                <Gem className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The Lender Audit: Which banks to call & what to ask.</TranslatedText></span>
                            </li>
                            <li className="flex items-start gap-4 text-base font-bold text-slate-700">
                                <Gem className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The 8-Week Roadmap: Day-by-day implementation plan.</TranslatedText></span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-6 space-y-6">
                        <Button size="lg" className="w-full sm:w-auto px-16 py-10 text-2xl font-black rounded-3xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95" asChild>
                            <Link href="/purchase?plan=pro_197">
                                <TranslatedText>Unlock Full Course & Tools</TranslatedText>
                                <ArrowRight className="ml-3 h-8 w-8" />
                            </Link>
                        </Button>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]"><TranslatedText>30-Day Money-Back Guarantee</TranslatedText></p>
                    </div>
                </section>
            </div>
        )}

        {(id >= 3 && isPrivileged) && (
          <div className="space-y-16 animate-in fade-in duration-700">
             <header className="p-12 bg-emerald-600 text-white rounded-[48px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Award className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-4">
                    <Award className="h-5 w-5" /> VIP Access Granted
                  </div>
                  <h1 className="text-4xl md:text-6xl font-fraunces font-black leading-tight tracking-tight">
                    <TranslatedText>{meta.title}</TranslatedText>
                  </h1>
                  <p className="mt-6 text-xl opacity-90 leading-relaxed font-medium max-w-2xl">
                    <TranslatedText>{`Welcome back, Administrator. You have full access to the ${meta.title} modules. Here is your executive summary of the high-velocity strategies.`}</TranslatedText>
                  </p>
                </div>
             </header>

             <section className="space-y-12">
                <CourseCard title="🚀 Strategy Deep Dive: The 30-Day Float" className="p-10 border-2 border-emerald-100">
                   <div className="space-y-6 text-lg leading-relaxed text-[#334155]">
                     <p>
                        <TranslatedText>{`The 'Float' is the most advanced cash-flow tactic in our arsenal. By utilizing a high-rewards credit card for every single daily expense and paying it off in full from your ${country.productShort} on the final day of the grace period, you force the bank to effectively provide you with an interest-free loan for 30 days.`}</TranslatedText>
                     </p>
                     <p className="font-bold text-emerald-700">
                        <TranslatedText>{`During those 30 days, your cash remains inside the ${country.productShort} principal, neutralizing interest at your mortgage rate. You aren't just saving interest; you're harvesting rewards while the bank's own money pays your bills.`}</TranslatedText>
                     </p>
                   </div>
                </CourseCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-slate-900 text-white p-10 rounded-[40px] space-y-6 shadow-xl">
                      <h4 className="font-black text-blue-400 uppercase text-sm tracking-[0.2em] flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6" /> The Lender Audit
                      </h4>
                      <p className="text-base opacity-80 leading-relaxed font-medium">
                        <TranslatedText>{`We've identified the top 3 lenders in ${country.name} that offer the 'Strategic Valve' features required for this method. Use the Bank Screener tool in your dashboard to track your calls to these specific institutions.`}</TranslatedText>
                      </p>
                   </div>
                   <div className="bg-blue-50 border-2 border-blue-100 p-10 rounded-[40px] space-y-6 shadow-xl">
                      <h4 className="font-black text-blue-600 uppercase text-sm tracking-[0.2em] flex items-center gap-3">
                        <Target className="h-6 w-6" /> 8-Week Roadmap
                      </h4>
                      <p className="text-base text-slate-600 leading-relaxed font-medium">
                        <TranslatedText>{`Your implementation window starts with the debt consolidation phase. By moving high-interest balances into the ${country.productShort} first, you instantly increase your monthly net surplus by hundreds of dollars, feeding the principal-killing engine.`}</TranslatedText>
                      </p>
                   </div>
                </div>
             </section>

             <div className="p-12 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[64px] text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight"><TranslatedText>Full Access Unlocked</TranslatedText></h3>
                <p className="text-slate-500 text-lg font-medium"><TranslatedText>Administrator, you have completed the curriculum structure. Continue to Lesson 5 for the final Action Plan.</TranslatedText></p>
             </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-16 border-t border-[#E8ECF2]">
          <button 
            onClick={prevLesson}
            className="flex items-center gap-3 text-[#5A6175] hover:text-[#1A1D26] font-black transition-all group"
          >
            <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            <TranslatedText>Previous</TranslatedText>
          </button>
          
          {(id < 5 && (!isLocked || isPrivileged)) && (
            <button 
                onClick={nextLesson}
                className="group flex items-center gap-3 bg-[#2563EB] text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 text-lg"
            >
                <TranslatedText>{id === 2 ? "See Advanced Plans" : "Next Lesson"}</TranslatedText>
                <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(use(params).id);
  return (
    <CourseProvider>
      <LessonContent id={id} />
    </CourseProvider>
  );
}
