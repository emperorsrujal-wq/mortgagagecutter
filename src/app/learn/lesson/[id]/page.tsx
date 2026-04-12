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
          <div className="space-y-12 animate-in fade-in duration-1000">
            <header className="space-y-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                <ShieldAlert className="h-3 w-3" />
                <TranslatedText>Security Warning: High Stakes Math</TranslatedText>
              </div>
              <h1 className="text-4xl md:text-6xl font-fraunces font-black text-[#1A1D26] leading-tight tracking-tighter">
                <TranslatedText>The $250,000 Heist Your Bank is Praying You Never Discover</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
                <TranslatedText>The shocking "Front-Loading" secret they bury on Page 3 of your contract—and the simple system that destroys it.</TranslatedText>
              </p>
            </header>

            <section className="space-y-12">
              <CourseCard className="border-l-8 border-l-red-600 shadow-2xl">
                <div className="space-y-6">
                  <h2 className="text-3xl font-fraunces font-black text-red-700">
                    <TranslatedText>The Tale of the Invisible House</TranslatedText>
                  </h2>
                  <p className="text-lg leading-relaxed">
                    <TranslatedText>{`Look, let's be blunt. When you sign for a ${formatCurrency(country.avgHome)} mortgage in ${country.name}, you think you're buying a home. You aren't. You're actually buying TWO houses. This is the structural reality of modern banking—a system where you provide the labor, and the institution provides the "permission" to live in your own home, for a price that often exceeds the cost of the bricks themselves.`}</TranslatedText>
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100 space-y-3 relative overflow-hidden group">
                      <div className="absolute top-[-10px] right-[-10px] opacity-10 group-hover:scale-110 transition-transform">
                        <HomeIcon className="h-24 w-24 text-green-600" />
                      </div>
                      <h4 className="font-black text-green-800 uppercase text-xs tracking-widest"><TranslatedText>House #1: Yours</TranslatedText></h4>
                      <p className="text-sm text-green-700 font-medium leading-relaxed">
                        <TranslatedText>{`This is the one you live in. You paint the walls, you mow the lawn, and you struggle to pay for it every single month. It is your sanctuary, but under the current system, it is also your largest liability.`}</TranslatedText>
                      </p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-3 relative overflow-hidden group">
                      <div className="absolute top-[-10px] right-[-10px] opacity-10 group-hover:scale-110 transition-transform">
                        <Ghost className="h-24 w-24 text-red-600" />
                      </div>
                      <h4 className="font-black text-red-800 uppercase text-xs tracking-widest"><TranslatedText>House #2: The Bank's</TranslatedText></h4>
                      <p className="text-sm text-red-700 font-medium leading-relaxed">
                        <TranslatedText>{`This house is invisible. It's built entirely of your sweat, your overtime hours, and your interest payments. It's the PURE PROFIT your bank takes while you pay off House #1. They have no risk, no maintenance, and no mortgage of their own.`}</TranslatedText>
                      </p>
                    </div>
                  </div>

                  <p className="text-lg leading-relaxed text-[#5A6175]">
                    <TranslatedText>{`In ${country.name}, by the time you've finally paid off House #1, you have given the bank enough money to buy House #2 in CASH. They didn't build it. They didn't mow the lawn. But they own your future for the next 30 years. Most homeowners accept this as a "fact of life," but it is actually a precise mathematical choice made by the lender to front-load their profit and back-load your equity.`}</TranslatedText>
                  </p>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="font-black text-slate-900 flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-600" />
                      <TranslatedText>The Amortization Illusion</TranslatedText>
                    </h3>
                    <p className="text-sm leading-relaxed">
                      <TranslatedText>{`The "monthly payment" is a single number designed to hide two very different transactions. In the first 15 years of a traditional 30-year loan, nearly 70-80% of your payment is flushed directly into the bank's interest ledger. You are essentially renting your own house from the bank while the principal balance—the number that actually matters—barely moves. This is the structural heist that keeps families on the labor treadmill for decades.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <div className="text-center space-y-4">
                <h3 className="text-2xl font-fraunces font-black text-[#1A1D26] uppercase tracking-widest">
                  <TranslatedText>Want to see the damage?</TranslatedText>
                </h3>
                <p className="text-slate-500 italic"><TranslatedText>Move the sliders to see exactly how much House #2 is costing you right now.</TranslatedText></p>
              </div>

              <InterestCalc />

              <div className="p-8 bg-slate-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Timer className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-6">
                  <h2 className="text-3xl font-fraunces font-black text-blue-400">
                    <TranslatedText>The 19-Year "Siphon" Trap</TranslatedText>
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    <TranslatedText>{`The bank is smarter than you think. They don't take their profit evenly over the life of the loan. They SIPHON it from you at the very beginning when you are most vulnerable and your balance is highest. This is why "paying extra" at the end of a mortgage feels good but does almost nothing—the bank has already taken their cut.`}</TranslatedText>
                  </p>
                  <p className="text-white font-bold text-xl">
                    <TranslatedText>{`On a 30-year loan, it takes nearly 19 YEARS before your monthly payment actually starts paying off more principal than interest. For 63% of your mortgage's lifespan, you are an interest-generating machine for the institution.`}</TranslatedText>
                  </p>
                  <p className="text-slate-400">
                    <TranslatedText>Press PLAY below. Watch how for nearly two decades, your life's work is being funneled into the Bank's "Invisible House" before a single brick of your own is truly paid for. This is the "Front-Loading" secret that keeps the middle class in debt.</TranslatedText>
                  </p>
                </div>
              </div>

              <AmortViz />

              <section className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 md:p-12 rounded-[48px] border border-blue-100 shadow-xl space-y-10">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-fraunces font-black text-[#1A1D26]">
                    <TranslatedText>What if you could Nuke the trap?</TranslatedText>
                  </h2>
                  <p className="text-[#5A6175] text-lg max-w-2xl mx-auto leading-relaxed">
                    <TranslatedText>Most people see these numbers and accept them as a "fact of life." They shouldn't. There is a specific, bank-agnostic strategy used by the top 1% of homeowners to collapse this timeline by using the bank's own daily interest calculations against them.</TranslatedText>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <h4 className="font-black text-sm text-slate-900"><TranslatedText>The "Bathtub" Flow</TranslatedText></h4>
                    <p className="text-xs text-slate-500 leading-relaxed"><TranslatedText>How to use your income to "choke" the daily interest calculation without spending an extra dime. Revealed in Lesson 2.</TranslatedText></p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                    <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                      <Rocket className="h-5 w-5" />
                    </div>
                    <h4 className="font-black text-sm text-slate-900"><TranslatedText>The 30-Day Float</TranslatedText></h4>
                    <p className="text-xs text-slate-500 leading-relaxed"><TranslatedText>How to force the bank to pay for your groceries while your money fights your principal. Revealed in Lesson 3.</TranslatedText></p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h4 className="font-black text-sm text-slate-900"><TranslatedText>The Banker Script</TranslatedText></h4>
                    <p className="text-xs text-slate-500 leading-relaxed"><TranslatedText>The 3 "Magic Phrases" that force loan officers to give you premium interest-cutting products. Revealed in Lesson 4.</TranslatedText></p>
                  </div>
                </div>

                <div className="pt-8 border-t border-blue-200 text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 text-indigo-600 font-black uppercase text-sm tracking-widest">
                    <Zap className="h-4 w-4" />
                    <TranslatedText>Escape the Trap Today</TranslatedText>
                  </div>
                  <h3 className="text-2xl font-fraunces font-black text-[#1A1D26]">
                    <TranslatedText>Ready to see the "Open System" Exit Strategy?</TranslatedText>
                  </h3>
                  <button 
                    onClick={nextLesson}
                    className="bg-[#2563EB] text-white hover:bg-blue-700 font-black px-10 py-5 rounded-2xl text-xl group flex items-center gap-3 mx-auto transition-all shadow-xl shadow-blue-200 hover:scale-105 active:scale-95"
                  >
                    <TranslatedText>Unlock the Exit Strategy</TranslatedText>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-slate-400 text-sm font-medium">
                    <TranslatedText>Join 39,000+ homeowners who have already broken the 30-year trap.</TranslatedText>
                  </p>
                </div>
              </section>
            </section>
          </div>
        )}

        {id === 2 && (
          <div className="space-y-12 animate-in slide-in-from-right duration-700">
            <header className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#2563EB] px-3 py-1 bg-blue-50 rounded-full">
                  🔓 <TranslatedText>Strategy Unlocked</TranslatedText>
                </span>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs font-bold border rounded-lg p-1 bg-white outline-none"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
              <h1 className="text-4xl md:text-5xl font-fraunces font-black text-[#1A1D26] leading-tight">
                <TranslatedText>{meta.title}</TranslatedText>
              </h1>
              <p className="text-[#5A6175] text-xl leading-relaxed">
                <TranslatedText>How to break the trap using the 'Open System' logic—the same mathematical leverage that the top 1% have used for decades to keep their money working 24/7.</TranslatedText>
              </p>
            </header>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <Droplets className="text-blue-500 h-8 w-8" />
                <h2><TranslatedText>The "Closed" vs. "Open" Concept</TranslatedText></h2>
              </div>
              <p className="text-lg leading-relaxed text-[#5A6175]">
                <TranslatedText>{`To understand how to pay off your home faster, you first have to understand that your current mortgage is a "Closed System". In a closed system, your financial energy is siloed. Your paycheck goes into one account, your bills go out of another, and your mortgage sits in a third, high-walled vault that only accepts a tiny tribute once a month.`}</TranslatedText>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CourseCard className="border-red-100 bg-red-50/30">
                  <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                    <ShieldAlert className="h-5 w-5" />
                    <TranslatedText>The Closed System (Traditional)</TranslatedText>
                  </div>
                  <p className="text-sm mb-4 leading-relaxed"><TranslatedText>{`Think of this like a Sealed Water Tank. You can only pour a tiny cup of water into the tank once a month. For the other 29 days, your money sits in a separate bucket (your checking account) earning 0% interest while the tank's water level (your debt) stays high, accumulating interest on every single gallon every single night. The bank profits from your "idle time".`}</TranslatedText></p>
                  <ul className="text-xs space-y-2 text-red-800/70 font-medium">
                    <li className="flex gap-2">❌ <TranslatedText>Savings sit idle while debt costs you money every night</TranslatedText></li>
                    <li className="flex gap-2">❌ <TranslatedText>Interest is calculated on the full balance for 30 days straight</TranslatedText></li>
                    <li className="flex gap-2">❌ <TranslatedText>The lender controls the speed of your payoff</TranslatedText></li>
                  </ul>
                </CourseCard>

                <CourseCard className="border-emerald-100 bg-emerald-50/30">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <Zap className="h-5 w-5" />
                    <TranslatedText>The Open System (Offset/HELOC)</TranslatedText>
                  </div>
                  <p className="text-sm mb-4 leading-relaxed"><TranslatedText>{`This is the "Bathtub" model. Your mortgage and your checking account are merged into a single, fluid vessel. Every dollar you earn flows into the tub immediately, dropping the water level (the debt) instantly. Because interest is calculated DAILY, every dollar you keep in the tub tonight saves you interest tomorrow. You only pay for what's left in the tub each night.`}</TranslatedText></p>
                  <ul className="text-xs space-y-2 text-emerald-800/70 font-medium">
                    <li className="flex gap-2">✅ <TranslatedText>Every dollar works 24/7 to lower interest calculations</TranslatedText></li>
                    <li className="flex gap-2">✅ <TranslatedText>Interest is recalculated DAILY on the lowest possible balance</TranslatedText></li>
                    <li className="flex gap-2">✅ <TranslatedText>YOU control the velocity and the finish date</TranslatedText></li>
                  </ul>
                </CourseCard>
              </div>

              <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100 space-y-6">
                <h3 className="text-xl font-black text-blue-900 flex items-center gap-2">
                  <BarChart className="h-6 w-6" />
                  <TranslatedText>The "Average Daily Balance" Secret</TranslatedText>
                </h3>
                <p className="text-[#5A6175] leading-relaxed">
                  <TranslatedText>{`Most people think interest is a monthly fee. It's not. It's a daily calculation. When you leave ${formatCurrency(5000)} sitting in a checking account for 20 days while waiting to pay bills, you are effectively giving the bank a free gift. In an "Open System," that same ${formatCurrency(5000)} sits inside your mortgage for those 20 days, "choking" the interest engine. You aren't earning interest; you are NEUTRALIZING interest. This is the most efficient way to use your capital because the interest you save is tax-free and guaranteed.`}</TranslatedText>
                </p>
              </div>
            </section>

            <section className="bg-slate-900 text-white p-8 rounded-[32px] space-y-6">
              <h3 className="text-2xl font-fraunces font-bold flex items-center gap-3">
                <UserCircle2 className="text-blue-400 h-7 w-7" />
                <TranslatedText>A Day in the Life of the Open System</TranslatedText>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                <TranslatedText>{`Let's look at how Dave and Sarah's month changes when they switch to a ${country.productShort} in ${country.name}. They haven't earned an extra cent, they haven't changed their lifestyle, but watch what happens to their interest velocity.`}</TranslatedText>
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start border-l-2 border-blue-500/30 pl-6 pb-6">
                  <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                  <div className="space-y-1">
                    <p className="font-bold text-blue-400 uppercase text-xs tracking-widest"><TranslatedText>Payday: The Injection</TranslatedText></p>
                    <p className="text-sm text-slate-200 leading-relaxed"><TranslatedText>{`Dave deposits his ${formatCurrency(country.avgIncome / 2)} paycheck. In a traditional loan, this would sit idle in a checking account for 15 days. Here, it goes straight against the ${country.productShort} balance. For the next two weeks, the bank is legally forced to charge Dave interest on ${formatCurrency(country.avgIncome / 2)} LESS than before. The debt is being "choked" from the moment the money hits the account.`}</TranslatedText></p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-l-2 border-blue-500/30 pl-6 pb-6">
                  <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                  <div className="space-y-1">
                    <p className="font-bold text-blue-400 uppercase text-xs tracking-widest"><TranslatedText>Expense Day: The Controlled Flow</TranslatedText></p>
                    <p className="text-sm text-slate-200 leading-relaxed"><TranslatedText>{`Sarah needs ${country.symbol}200 for groceries. She withdraws it from the ${country.productShort} (or linked account). The balance goes up slightly, but only for the remaining days of the month. She only paid interest on that ${country.symbol}200 for the days it was actually spent, not the whole month. Her money worked for her for 20 days before it was released.`}</TranslatedText></p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-l-2 border-blue-500/30 pl-6">
                  <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                  <div className="space-y-1">
                    <p className="font-bold text-blue-400 uppercase text-xs tracking-widest"><TranslatedText>Month End: The Snowball</TranslatedText></p>
                    <p className="text-sm text-slate-200 leading-relaxed"><TranslatedText>{`Because Dave and Sarah kept their "Idle Cash" inside the home loan account for an average of 15-20 days longer each month, the total interest charged is hundreds of dollars lower. This "saved interest" never leaves their pocket. It stays inside the account, effectively becoming an automatic principal payment. This creates a compounding snowball that collapses their 30-year term into 10-12 years.`}</TranslatedText></p>
                  </div>
                </div>
              </div>
            </section>

            <PayoffRace />

            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[32px] text-white text-center space-y-6 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <CheckCircle2 className="h-3 w-3" />
                <TranslatedText>End of Lesson 2</TranslatedText>
              </div>
              <h3 className="text-3xl font-fraunces font-black"><TranslatedText>Ready to Turbocharge?</TranslatedText></h3>
              <p className="opacity-90 max-w-md mx-auto text-lg"><TranslatedText>You've seen the engine. Now it's time to add the high-octane fuel. In Lesson 3, we reveal the "Credit Card Trick" and advanced "Float" strategies to force the bank to pay for your life while your money kills your debt.</TranslatedText></p>
              <button className="bg-white text-blue-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-2xl text-lg group flex items-center gap-2 mx-auto transition-all" onClick={nextLesson}>
                <TranslatedText>Unlock Turbo Strategies</TranslatedText>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </div>
        )}

        {(id >= 3 && !isPrivileged) && (
            <div className="space-y-12">
                <section className="bg-white p-12 rounded-[40px] border-2 border-dashed border-slate-200 text-center space-y-8 shadow-inner">
                    <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="h-10 w-10 text-amber-600" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-fraunces font-black text-slate-900 leading-tight">
                            <TranslatedText>Premium Strategy: Locked</TranslatedText>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-md mx-auto">
                            <TranslatedText>{`Lessons 3, 4, and 5 contain the high-velocity execution blueprints reserved for our Premium Members. Join the thousands of ${country.name} homeowners who have already taken the next step.`}</TranslatedText>
                        </p>
                    </div>
                    
                    <div className="p-6 bg-slate-50 rounded-3xl text-left space-y-4 max-w-md mx-auto border border-slate-100">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400"><TranslatedText>What you're missing:</TranslatedText></h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm font-bold text-slate-700">
                                <Gem className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The 30-Day Float: How to make the bank pay your bills.</TranslatedText></span>
                            </li>
                            <li className="flex items-start gap-3 text-sm font-bold text-slate-700">
                                <Gem className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The Lender Audit: Which banks to call & what to ask.</TranslatedText></span>
                            </li>
                            <li className="flex items-start gap-3 text-sm font-bold text-slate-700">
                                <Gem className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                <span><TranslatedText>The 8-Week Roadmap: Day-by-day implementation plan.</TranslatedText></span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-4 space-y-4">
                        <Button size="lg" className="w-full sm:w-auto px-12 py-8 text-xl font-black rounded-2xl shadow-xl shadow-blue-200" asChild>
                            <Link href="/purchase?plan=pro_197">
                                <TranslatedText>Unlock Full Course & Tools</TranslatedText>
                                <ArrowRight className="ml-2 h-6 w-6" />
                            </Link>
                        </Button>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest"><TranslatedText>30-Day Money-Back Guarantee</TranslatedText></p>
                    </div>
                </section>
            </div>
        )}

        {(id >= 3 && isPrivileged) && (
          <div className="space-y-12 animate-in fade-in duration-700">
             <header className="p-8 bg-emerald-600 text-white rounded-3xl shadow-xl">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">
                  <Award className="h-4 w-4" /> VIP Access Granted
                </div>
                <h1 className="text-3xl md:text-4xl font-fraunces font-black leading-tight">
                  <TranslatedText>{meta.title}</TranslatedText>
                </h1>
                <p className="mt-4 text-lg opacity-90 leading-relaxed">
                  <TranslatedText>{`Welcome back, Administrator. You have full access to the ${meta.title} modules. Here is your executive summary of the high-velocity strategies.`}</TranslatedText>
                </p>
             </header>

             <section className="space-y-8">
                <CourseCard title="🚀 Strategy Deep Dive: The 30-Day Float">
                   <p className="text-lg leading-relaxed">
                      <TranslatedText>{`The 'Float' is the most advanced cash-flow tactic in our arsenal. By utilizing a high-rewards credit card for every single daily expense and paying it off in full from your ${country.productShort} on the final day of the grace period, you force the bank to effectively provide you with an interest-free loan for 30 days. During those 30 days, your cash remains inside the ${country.productShort} principal, neutralizing interest at your mortgage rate. You aren't just saving interest; you're harvesting rewards while the bank's own money pays your bills.`}</TranslatedText>
                   </p>
                </CourseCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4">
                      <h4 className="font-black text-blue-400 uppercase text-xs tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> The Lender Audit
                      </h4>
                      <p className="text-sm opacity-80 leading-relaxed">
                        <TranslatedText>{`We've identified the top 3 lenders in ${country.name} that offer the 'Strategic Valve' features required for this method. Use the Bank Screener tool in your dashboard to track your calls to these specific institutions.`}</TranslatedText>
                      </p>
                   </div>
                   <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl space-y-4">
                      <h4 className="font-black text-blue-600 uppercase text-xs tracking-widest flex items-center gap-2">
                        <Target className="h-4 w-4" /> 8-Week Roadmap
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <TranslatedText>{`Your implementation window starts with the debt consolidation phase. By moving high-interest balances into the ${country.productShort} first, you instantly increase your monthly net surplus by hundreds of dollars, feeding the principal-killing engine.`}</TranslatedText>
                      </p>
                   </div>
                </div>
             </section>

             <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] text-center">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900"><TranslatedText>Full Access Unlocked</TranslatedText></h3>
                <p className="text-slate-500 mt-2"><TranslatedText>Administrator, you have completed the curriculum structure. Continue to Lesson 5 for the final Action Plan.</TranslatedText></p>
             </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-12 border-t border-[#E8ECF2]">
          <button 
            onClick={prevLesson}
            className="flex items-center gap-2 text-[#5A6175] hover:text-[#1A1D26] font-bold transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            <TranslatedText>Previous</TranslatedText>
          </button>
          
          {(id < 5 && (!isLocked || isPrivileged)) && (
            <button 
                onClick={nextLesson}
                className="group flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
            >
                <TranslatedText>{id === 2 ? "See Advanced Plans" : "Next Lesson"}</TranslatedText>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
