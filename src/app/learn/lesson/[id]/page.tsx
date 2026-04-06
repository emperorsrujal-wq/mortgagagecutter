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
  Coins
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
  const meta = lessonMeta.find(l => l.id === id);
  const router = useRouter();

  if (!meta) return <div>Lesson not found</div>;

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
    <div className="min-h-screen bg-[#FAFBFD] font-dm-sans pb-24">
      <ProgressBar current={id} />
      
      <div className="max-w-[720px] mx-auto px-4 py-12 space-y-10">
        
        <header className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
              {country.flag} {country.name}
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
            <TranslatedText>
              {id === 1 ? "Why the world's most popular financial product is actually a brilliantly disguised trap for your wealth." : 
               id === 2 ? "How to break the trap using the 'Open System' logic that the wealthy have used for decades." :
               id === 3 ? "The credit card offset trick, debt rolling, and cashflow boosters." :
               id === 4 ? "The exact words to say, banks to call, and red flags to avoid." :
               `Week-by-week roadmap to ${country.productShort} freedom in ${country.name}.`}
            </TranslatedText>
          </p>
        </header>

        {id === 1 && (
          <div className="space-y-12">
            <CourseCard title="🍽️ The Hidden Menu Problem">
              <p className="text-lg"><TranslatedText>{`Imagine Dave and Sarah walk into a restaurant. The menu says a steak costs ${country.symbol}50. They enjoy the meal, but when the bill arrives, it says: "${country.symbol}97.00".`}</TranslatedText></p>
              <p><TranslatedText>{`Confused, Dave asks the waiter why it's so high. The waiter smiles and says: "Well, we charged you interest on that steak every minute it sat on your plate. Plus, we charged you a fee for the plate, and a fee for the waiter's shoes."`}</TranslatedText></p>
              <p className="font-bold text-[#1A1D26]"><TranslatedText>{`You'd walk out, right? But this is EXACTLY what happens with your ${country.name} home loan.`}</TranslatedText></p>
              <InfoBox title="The Reality" color="red">
                <TranslatedText>{`You borrow ${formatCurrency(country.avgHome)} to buy a home. By the time you finish paying, you've paid nearly DOUBLE that amount. The bank didn't build the house, paint the walls, or mow the lawn — but they made more profit from it than the person who built it.`}</TranslatedText>
              </InfoBox>
            </CourseCard>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <HomeIcon className="text-blue-500 h-8 w-8" />
                <h2><TranslatedText>The Tale of Two Houses</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]"><TranslatedText>{`When you sign a traditional ${country.amortYears}-year mortgage, you aren't just buying one house. You're actually buying TWO.`}</TranslatedText></p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <HomeIcon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-[#1A1D26]"><TranslatedText>House #1: Yours</TranslatedText></h4>
                  <p className="text-sm text-[#5A6175]"><TranslatedText>{`This is the one you live in. You pay the principal to eventually own this brick and mortar.`}</TranslatedText></p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                    <Ghost className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-[#1A1D26]"><TranslatedText>House #2: The Bank's</TranslatedText></h4>
                  <p className="text-sm text-[#5A6175]"><TranslatedText>{`This is the "Invisible House" built entirely of your interest payments. It's the pure profit the bank gets for letting you buy House #1.`}</TranslatedText></p>
                </div>
              </div>
            </section>

            <InterestCalc />

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <ShieldAlert className="text-red-500 h-8 w-8" />
                <h2><TranslatedText>The Secret of "Front-Loading"</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]"><TranslatedText>{`Why does it feel like your balance never drops? Because banks are smart. They don't take their profit evenly over ${country.amortYears} years. They take it all AT THE START.`}</TranslatedText></p>
              
              <CourseCard className="bg-slate-900 text-white border-none">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <Timer className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg"><TranslatedText>The "19-Year Trap"</TranslatedText></h4>
                    <p className="text-slate-400 text-sm leading-relaxed"><TranslatedText>{`On a 30-year loan, it takes nearly 19 years before your monthly payment actually starts paying off more principal than interest. For almost two decades, you are mostly just feeding the bank's profit machine.`}</TranslatedText></p>
                  </div>
                </div>
              </CourseCard>
            </section>

            <AmortViz />

            <section className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-fraunces font-bold text-[#1A1D26]"><TranslatedText>{`The ${country.name} Specific Context`}</TranslatedText></h2>
                <p className="text-[#5A6175]"><TranslatedText>{`Every country has its own version of this trap. Here is how it's rigged where you live.`}</TranslatedText></p>
              </div>

              <div className="space-y-4">
                <CourseCard title={`${country.flag} How ${country.productShort} is different in ${country.name}`}>
                  <p><TranslatedText>{country.howItWorks}</TranslatedText></p>
                  <div className="space-y-4 pt-4">
                    <InfoBox title="Analogy" color="blue">{country.analogy}</InfoBox>
                    <InfoBox title={`Tax rules in ${country.name}`} color="amber">{country.taxRule}</InfoBox>
                    <InfoBox title="Qualification / Stress test" color="purple">{country.stressTest}</InfoBox>
                    <InfoBox title={`Why ${country.name} is special`} color="green">{country.uniqueInfo}</InfoBox>
                  </div>
                </CourseCard>

                <CourseCard title={`🏦 ${country.name} Products Available`}>
                  <p className="mb-4 text-sm text-muted-foreground"><TranslatedText>{`These are the actual bank products in ${country.name} that allow you to escape the standard trap.`}</TranslatedText></p>
                  {country.products.map((p, i) => (
                    <ExpandSection key={i} title={p.name}>{p.desc}</ExpandSection>
                  ))}
                  <div className="pt-4">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-3"><TranslatedText>{`Banks offering ${country.productShort} in ${country.name}:`}</TranslatedText></p>
                    <div className="flex flex-wrap gap-2">
                      {country.banks.map(b => <span key={b} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{b}</span>)}
                    </div>
                  </div>
                </CourseCard>
              </div>
            </section>

            <section className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-[32px] border border-blue-100 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 className="h-3 w-3" />
                <TranslatedText>End of Lesson 1</TranslatedText>
              </div>
              <h3 className="text-2xl font-fraunces font-bold text-[#1A1D26]"><TranslatedText>Ready to see the "Open System"?</TranslatedText></h3>
              <p className="text-[#5A6175] max-w-md mx-auto"><TranslatedText>Now that you've seen the trap, it's time to see the exit strategy. In the next lesson, we reveal the "Bathtub" method that saves thousands.</TranslatedText></p>
              <button className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-8 py-4 rounded-2xl text-lg group flex items-center gap-2 mx-auto transition-all" onClick={nextLesson}>
                <TranslatedText>See the Exit Strategy</TranslatedText>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </div>
        )}

        {id === 2 && (
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <Droplets className="text-blue-500 h-8 w-8" />
                <h2><TranslatedText>The "Closed" vs. "Open" Concept</TranslatedText></h2>
              </div>
              <p className="text-lg leading-relaxed text-[#5A6175]">
                <TranslatedText>{`To understand how to pay off your home faster, you first have to understand that your current mortgage is a "Closed System". Your money goes in once a month, and it is locked away forever.`}</TranslatedText>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CourseCard className="border-red-100 bg-red-50/30">
                  <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                    <ShieldAlert className="h-5 w-5" />
                    <TranslatedText>The Closed System (Traditional)</TranslatedText>
                  </div>
                  <p className="text-sm mb-4"><TranslatedText>{`Think of this like a Sealed Water Tank. You can only pour a tiny cup of water into the tank once a month. The rest of your money sits in a separate bucket (your checking account) doing nothing while the tank's water level (your debt) stays high.`}</TranslatedText></p>
                  <ul className="text-xs space-y-2 text-red-800/70 font-medium">
                    <li className="flex gap-2">❌ <TranslatedText>Savings sit idle while debt costs you money</TranslatedText></li>
                    <li className="flex gap-2">❌ <TranslatedText>Interest is calculated on the full balance every month</TranslatedText></li>
                    <li className="flex gap-2">❌ <TranslatedText>Lender controls the speed of payoff</TranslatedText></li>
                  </ul>
                </CourseCard>

                <CourseCard className="border-emerald-100 bg-emerald-50/30">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <Zap className="h-5 w-5" />
                    <TranslatedText>The Open System (Offset/HELOC)</TranslatedText>
                  </div>
                  <p className="text-sm mb-4"><TranslatedText>{`This is the "Bathtub" model. Your mortgage and your checking account are combined. Every dollar you earn flows into the tub immediately, dropping the water level (debt) instantly. You only pay for what's left in the tub each day.`}</TranslatedText></p>
                  <ul className="text-xs space-y-2 text-emerald-800/70 font-medium">
                    <li className="flex gap-2">✅ <TranslatedText>Every dollar works 24/7 to lower interest</TranslatedText></li>
                    <li className="flex gap-2">✅ <TranslatedText>Interest is recalculated DAILY</TranslatedText></li>
                    <li className="flex gap-2">✅ <TranslatedText>YOU control the speed of payoff</TranslatedText></li>
                  </ul>
                </CourseCard>
              </div>
            </section>

            <section className="bg-slate-900 text-white p-8 rounded-[32px] space-y-6">
              <h3 className="text-2xl font-fraunces font-bold flex items-center gap-3">
                <UserCircle2 className="text-blue-400 h-7 w-7" />
                <TranslatedText>A Day in the Life of the Open System</TranslatedText>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                <TranslatedText>{`Let's look at how Dave and Sarah's month changes when they switch to a ${country.productShort} in ${country.name}. They haven't earned an extra cent, but watch what happens to their interest.`}</TranslatedText>
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start border-l-2 border-blue-500/30 pl-6 pb-6">
                  <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                  <div className="space-y-1">
                    <p className="font-bold text-blue-400 uppercase text-xs tracking-widest"><TranslatedText>Payday</TranslatedText></p>
                    <p className="text-sm text-slate-200"><TranslatedText>{`Dave deposits his ${formatCurrency(country.avgIncome / 2)} paycheck. In a traditional loan, this would sit in checking. Here, it goes straight against the ${country.productShort} balance. For the next two weeks, the bank charges Dave interest on ${formatCurrency(country.avgIncome / 2)} LESS than before.`}</TranslatedText></p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-l-2 border-blue-500/30 pl-6 pb-6">
                  <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                  <div className="space-y-1">
                    <p className="font-bold text-blue-400 uppercase text-xs tracking-widest"><TranslatedText>Expense Day</TranslatedText></p>
                    <p className="text-sm text-slate-200"><TranslatedText>{`Sarah needs ${country.symbol}200 for groceries. She withdraws it from the ${country.productShort} (or linked account). The balance goes up slightly, but only for the remaining days of the month. She only paid interest on that ${country.symbol}200 for the days it was actually spent, not the whole month.`}</TranslatedText></p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-l-2 border-blue-500/30 pl-6">
                  <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                  <div className="space-y-1">
                    <p className="font-bold text-blue-400 uppercase text-xs tracking-widest"><TranslatedText>Month End</TranslatedText></p>
                    <p className="text-sm text-slate-200"><TranslatedText>{`Because Dave and Sarah kept their "Idle Cash" inside the home loan account for an average of 15-20 days longer each month, the total interest charged is hundreds of dollars lower. This "saved interest" effectively becomes a principal payment, snowballing the payoff.`}</TranslatedText></p>
                  </div>
                </div>
              </div>
            </section>

            <InfoBox title="🎯 The 'Magic' Mechanic" color="green">
              <p className="font-bold"><TranslatedText>Daily Recalculation vs. Monthly Amortization</TranslatedText></p>
              <p className="mt-2"><TranslatedText>{`In ${country.name}, banks typically calculate interest daily on the outstanding balance of a ${country.productShort}. This means every single dollar you have—your emergency fund, your vacation savings, your next grocery bill—is actively fighting your mortgage interest every minute it sits in your account.`}</TranslatedText></p>
            </InfoBox>

            <PayoffRace />

            <section className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-fraunces font-bold text-[#1A1D26]"><TranslatedText>{`Why the Rate Doesn't Matter (As Much)`}</TranslatedText></h2>
                <p className="text-[#5A6175]"><TranslatedText>{`One of the biggest fears people have is switching from a lower fixed rate to a slightly higher variable rate ${country.productShort}. Let's look at the math.`}</TranslatedText></p>
              </div>

              <CourseCard className="border-amber-100 bg-amber-50/20">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-xl shrink-0">
                    <Zap className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg text-amber-900"><TranslatedText>The 1% Myth</TranslatedText></h4>
                    <p className="text-sm text-amber-800 leading-relaxed"><TranslatedText>{`If a traditional loan is 5% and a ${country.productShort} is 6%, most people think the 5% is better. But remember: you pay 5% on the FULL balance for 30 days. In the ${country.productShort}, you might pay 6%, but because your paycheck dropped the balance, you are paying 6% on a MUCH SMALLER NUMBER.`}</TranslatedText></p>
                    <p className="text-sm font-bold text-amber-900"><TranslatedText>{`Example: 5% of ${country.symbol}500,000 is ${formatCurrency(2083)} in monthly interest. But 6% of ${country.symbol}450,000 (after your paycheck/savings are offset) is only ${formatCurrency(2250)}. As your savings grow, the higher rate actually costs you LESS total dollars than the lower fixed rate.`}</TranslatedText></p>
                  </div>
                </div>
              </CourseCard>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <ShieldCheck className="text-green-500 h-8 w-8" />
                <h2><TranslatedText>Safety & Liquidity</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]"><TranslatedText>{`The best part? You aren't "spending" your money to pay off the house. You are "parking" it. If you have an emergency tomorrow, you can simply withdraw that money back out. It's the only system where you can be debt-free and cash-rich at the same time.`}</TranslatedText></p>
              
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-2"><TranslatedText>The Financial Peace of Mind</TranslatedText></h4>
                <p className="text-sm text-emerald-800"><TranslatedText>{`Most people are "House Poor"—they have equity in their home but ${country.symbol}0 in the bank. If they lose their job, they can't eat their kitchen cabinets. In the Open System, your home equity IS your bank account. You have access to your money 24/7.`}</TranslatedText></p>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[32px] text-white text-center space-y-6 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <CheckCircle2 className="h-3 w-3" />
                <TranslatedText>End of Lesson 2</TranslatedText>
              </div>
              <h3 className="text-3xl font-fraunces font-black"><TranslatedText>Ready to Turbocharge?</TranslatedText></h3>
              <p className="opacity-90 max-w-md mx-auto text-lg"><TranslatedText>You've seen the engine. Now it's time to add the fuel. In Lesson 3, we reveal the "Credit Card Trick" and other advanced strategies to cut even more years off your term.</TranslatedText></p>
              <button className="bg-white text-blue-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-2xl text-lg group flex items-center gap-2 mx-auto transition-all" onClick={nextLesson}>
                <TranslatedText>Unlock Turbo Strategies</TranslatedText>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </div>
        )}

        {id === 3 && (
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <Activity className="text-pink-500 h-8 w-8" />
                <h2><TranslatedText>The Principle of "Financial Velocity"</TranslatedText></h2>
              </div>
              <p className="text-lg leading-relaxed text-[#5A6175]">
                <TranslatedText>{`In physics, velocity is speed in a specific direction. In the Mortgage Cutter method, velocity is the speed at which your income hits your principal. Now that you have the "Open System" (the engine), it's time to add the "Turbo" (strategies that increase velocity).`}</TranslatedText>
              </p>
              
              <CourseCard className="border-pink-100 bg-pink-50/20">
                <h4 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-pink-600" /> <TranslatedText>The "Double Job" for Your Money</TranslatedText>
                </h4>
                <p className="text-sm text-pink-800 leading-relaxed">
                  <TranslatedText>{`Usually, your money has one job: buy things. But in Lesson 3, we teach your money to do TWO jobs at once. Job 1: Pay for your groceries. Job 2: Lower your mortgage interest 24/7 while it's waiting to be spent.`}</TranslatedText>
                </p>
              </CourseCard>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <CreditCard className="text-blue-500 h-8 w-8" />
                <h2><TranslatedText>Strategy 1: The Credit Card Offset (The 30-Day Float)</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]">
                <TranslatedText>{`This is the ultimate "turbo" for the ${country.productShort} method. It allows you to keep your money inside your home loan for up to 30 days longer than normal, nuking interest every single hour.`}</TranslatedText>
              </p>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-[#1A1D26] uppercase text-xs tracking-widest text-blue-600"><TranslatedText>How it works step-by-step</TranslatedText></h4>
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                      <p className="text-sm text-[#5A6175]"><TranslatedText>{`Deposit your entire income into your ${country.productShort}. This instantly drops the balance and stops the bank from charging you interest on that amount.`}</TranslatedText></p>
                    </li>
                    <li className="flex gap-4">
                      <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                      <p className="text-sm text-[#5A6175]"><TranslatedText>{`Pay for EVERYTHING (groceries, gas, bills) with a 0% interest credit card. DO NOT touch the money in your ${country.productShort}.`}</TranslatedText></p>
                    </li>
                    <li className="flex gap-4">
                      <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                      <p className="text-sm text-[#5A6175]"><TranslatedText>{`Wait 25-30 days. Your income has been sitting in your ${country.productShort} the entire time, saving you interest at the "daily rate".`}</TranslatedText></p>
                    </li>
                    <li className="flex gap-4">
                      <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">4</div>
                      <p className="text-sm text-[#5A6175]"><TranslatedText>{`On the last day of the card's grace period, pay the FULL card balance from the ${country.productShort}. You used the bank's money for free for 30 days while your own money was fighting your mortgage.`}</TranslatedText></p>
                    </li>
                  </ol>
                </div>

                <InfoBox title="The Float Math" color="blue">
                  <TranslatedText>{`If you spend ${country.symbol}3,000/month, and keep that ${country.symbol}3,000 in your ${country.productShort} for an extra 30 days using this trick, you avoid paying interest on ${country.symbol}3,000 every single day. Over a year, this simple "float" can shave another 6-12 months off your term with zero extra income.`}</TranslatedText>
                </InfoBox>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm flex gap-3">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <p><strong><TranslatedText>Strict Rule:</TranslatedText></strong> <TranslatedText>Only use this if you pay your card in FULL every month. Use 0% interest grace periods only. If you carry a balance on the card, the 20% interest will wipe out all your mortgage savings.</TranslatedText></p>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <Activity className="text-indigo-500 h-8 w-8" />
                <h2><TranslatedText>Strategy 2: The "Debt Consolidation Engine"</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]">
                <TranslatedText>{`Most financial advice says: "Don't add to your mortgage." We say: "Use the Open System to swallow high-interest debt and nuke it."`}</TranslatedText>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CourseCard className="border-slate-100 shadow-none bg-slate-50/50">
                  <h4 className="font-bold text-[#1A1D26] mb-2"><TranslatedText>The Installment Trap</TranslatedText></h4>
                  <p className="text-xs text-[#5A6175] leading-relaxed"><TranslatedText>{`A car loan at 8% or a credit card at 20% is a "Closed System". Your monthly payment is high, and you can't reuse the principal you pay back. You are trapped in two separate amortization schedules.`}</TranslatedText></p>
                </CourseCard>
                <CourseCard className="border-indigo-100 shadow-none bg-indigo-50/30">
                  <h4 className="font-bold text-indigo-900 mb-2"><TranslatedText>The Open System Escape</TranslatedText></h4>
                  <p className="text-xs text-indigo-800 leading-relaxed"><TranslatedText>{`When you roll that 8% car loan into a 6.5% ${country.productShort}, you do two things: 1) Lower the rate. 2) Apply the daily interest mechanic. Because your paycheck hits the total balance every day, you pay off that "car portion" of the loan 3-4x faster than the original loan.`}</TranslatedText></p>
                </CourseCard>
              </div>

              <InfoBox title={`Tax Optimization in ${country.name}`} color="purple">
                {country.taxRule}
              </InfoBox>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <TrendingUp className="text-green-500 h-8 w-8" />
                <h2><TranslatedText>Strategy 3: 9 High-Impact Cashflow Boosters</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]">
                <TranslatedText>{`Every ${country.symbol}1 you save in expenses doesn't just save you ${country.symbol}1. Because of the daily interest multiplier, that ${country.symbol}1 might save you ${country.symbol}3.20 in future interest. Here are 9 ways to find that extra fuel.`}</TranslatedText>
              </p>

              <div className="space-y-3">
                <ExpandSection title="🍳 Cook at Home (~$3,500/yr per person)">
                  <TranslatedText>{`The average restaurant markup is 300%. By cutting out just TWO meals out per week, you find extra cash flow that hits your principal every day. Over 5 years, this one habit change can shave 4 months off your mortgage.`}</TranslatedText>
                </ExpandSection>
                <ExpandSection title="🚗 Buy 2+ Year Old Cars (~$9,600 every 8 years)">
                  <TranslatedText>{`Avoid the 20% "off-the-lot" depreciation. That money stays in your ${country.productShort} lowering interest every day. A new car is an interest-bearing liability; a used car is a wealth-building tool.`}</TranslatedText>
                </ExpandSection>
                <ExpandSection title="💳 0% Cashback Cards (~$1,500/yr)">
                  <TranslatedText>{`Use the rewards to hit your principal. It's free money the bank is giving you back. If you use the Offset trick, your card rewards effectively become a "negative interest rate" booster.`}</TranslatedText>
                </ExpandSection>
                <ExpandSection title="🌡️ Smart Thermostat (~$300/yr)">
                  <TranslatedText>{`Automate your savings. Small monthly wins add up to months off your mortgage. Every dollar not spent on heating is a dollar fighting your principal.`}</TranslatedText>
                </ExpandSection>
                <ExpandSection title="🏛️ Tax Optimization ($5,000-15,000+/yr)">
                  <TranslatedText>{`Ensure you are claiming every deduction. In many regions, redirecting your tax refund directly into the ${country.productShort} on Day 1 creates a massive "principal shock" that nukes future interest.`}</TranslatedText>
                </ExpandSection>
                <ExpandSection title="🔄 Subscription Audit (~$600/yr)">
                  <TranslatedText>{`We find the average member has 3 unused subscriptions. Cancelling them increases your monthly surplus, which is the "fuel" for your acceleration engine.`}</TranslatedText>
                </ExpandSection>
                <ExpandSection title="🛒 Bulk Buying Non-Perishables (~$1,200/yr)">
                  <TranslatedText>{`Buying items you use anyway (toilet paper, rice, etc.) at 20% discounts from bulk stores increases your monthly "surplus cashflow".`}</TranslatedText>
                </ExpandSection>
                <ExpandSection title="🛡️ Insurance Shopping (~$800/yr)">
                  <TranslatedText>{`Re-quoting your home and auto insurance once a year often finds hidden savings. That surplus goes straight to the principal.`}</TranslatedText>
                </ExpandSection>
                <ExpandSection title="💰 Negotiate Bank Fees (~$200/yr)">
                  <TranslatedText>{`Many "Open System" products have monthly fees. Ask your bank to waive them based on your total assets with them. Every saved fee is an interest-fighting dollar.`}</TranslatedText>
                </ExpandSection>
              </div>
            </section>

            <section className="bg-gradient-to-br from-pink-600 to-rose-700 p-10 rounded-[32px] text-white text-center space-y-6 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <CheckCircle2 className="h-3 w-3" />
                <TranslatedText>End of Lesson 3</TranslatedText>
              </div>
              <h3 className="text-3xl font-fraunces font-black"><TranslatedText>Ready to Talk to the Bank?</TranslatedText></h3>
              <p className="opacity-90 max-w-md mx-auto text-lg"><TranslatedText>You have the engine and the turbo. Now you need the keys. In Lesson 4, we give you the exact phone scripts and the list of banks to call to set this up.</TranslatedText></p>
              <button className="bg-white text-pink-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-2xl text-lg group flex items-center gap-2 mx-auto transition-all" onClick={nextLesson}>
                <TranslatedText>Get My Bank Scripts</TranslatedText>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </div>
        )}

        {id === 4 && (
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <Landmark className="text-purple-500 h-8 w-8" />
                <h2><TranslatedText>The Art of the Open System Setup</TranslatedText></h2>
              </div>
              <p className="text-lg leading-relaxed text-[#5A6175]">
                <TranslatedText>{`Now that you know HOW the system works, you need to know how to GET it. Banks are massive corporations built on selling traditional mortgages. Getting them to give you an "Open System" product requires knowing exactly what to ask for—and what to ignore.`}</TranslatedText>
              </p>
              
              <CourseCard className="border-purple-100 bg-purple-50/20">
                <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <UserCircle2 className="h-5 w-5 text-purple-600" /> <TranslatedText>The Banker's Psychology</TranslatedText>
                </h4>
                <p className="text-sm text-purple-800 leading-relaxed">
                  <TranslatedText>{`Most loan officers are paid on volume. They want to sell you the most "standard" product because it's the easiest to process. You need to approach them not as a borrower, but as a strategist who knows the math.`}</TranslatedText>
                </p>
              </CourseCard>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <MessageSquare className="text-blue-500 h-8 w-8" />
                <h2><TranslatedText>The "Magic Words" Phone Script</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]">
                <TranslatedText>{`Don't just walk in and ask for a loan. Use this script to signal that you are looking for a specific structural financial tool.`}</TranslatedText>
              </p>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-inner space-y-4">
                <ChatBubble role="you">{`Hi, I'm looking to refinance my primary residence into a ${country.productName} in first-lien position.`}</ChatBubble>
                <ChatBubble role="bank">{`We usually offer HELOCs as a second mortgage on top of your current one. Why do you want it in first position?`}</ChatBubble>
                <ChatBubble role="pro">{`Pro Tip: They are trying to keep you in the "Closed System" interest trap. Stand your ground.`}</ChatBubble>
                <ChatBubble role="you">{`I'm implementing a cashflow management strategy. I need my income to deposit directly into the account to offset the daily interest calculation on the full balance.`}</ChatBubble>
                <ChatBubble role="bank">{`I see. We have a product like that, but the rate is 0.5% higher than our fixed 30-year.`}</ChatBubble>
                <ChatBubble role="you">{`The rate is less important to me than the structure. I'm focusing on minimizing the Average Daily Balance, which saves me more than the 0.5% rate difference.`}</ChatBubble>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <Search className="text-indigo-500 h-8 w-8" />
                <h2><TranslatedText>The "Gold Standard" Lender Hunt</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]">
                <TranslatedText>{`Not all banks are created equal. In ${country.name}, some lenders are much more "strategy-friendly" than others.`}</TranslatedText>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {country.banks.map(bank => (
                  <div key={bank} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <Landmark className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-[#1A1D26]">{bank}</span>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500 opacity-20" />
                  </div>
                ))}
              </div>
              
              <InfoBox title="Why these banks?" color="blue">
                <TranslatedText>{`These lenders in ${country.name} are known for having "Revolving" or "Offset" capabilities that allow for the direct-deposit-to-principal mechanic we need.`}</TranslatedText>
              </InfoBox>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <ShieldAlert className="text-red-500 h-8 w-8" />
                <h2><TranslatedText>The Red Flag Audit</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]">
                <TranslatedText>{`Banks will sometimes try to sneak in terms that kill the "Open System" benefit. If you see these, keep shopping.`}</TranslatedText>
              </p>

              <div className="space-y-4">
                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex gap-4">
                  <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900"><TranslatedText>The "Second Lien" Trap</TranslatedText></h4>
                    <p className="text-sm text-red-800 leading-relaxed"><TranslatedText>{`If the bank insists you keep your current mortgage and just add a HELOC on top, the strategy won't work. You'll still be paying front-loaded interest on the big loan. It MUST be in first position.`}</TranslatedText></p>
                  </div>
                </div>
                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex gap-4">
                  <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900"><TranslatedText>Restricted Withdrawals</TranslatedText></h4>
                    <p className="text-sm text-red-800 leading-relaxed"><TranslatedText>{`Some accounts only let you withdraw in "chunks" (e.g., minimum $5,000). For our method, you need to be able to withdraw small amounts daily for bills and groceries.`}</TranslatedText></p>
                  </div>
                </div>
                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex gap-4">
                  <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <Timer className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900"><TranslatedText>Inactivity Fees</TranslatedText></h4>
                    <p className="text-sm text-red-800 leading-relaxed"><TranslatedText>{`Avoid accounts that charge you for NOT borrowing. Since our goal is to keep the balance as close to zero as possible, these fees can eat into your savings.`}</TranslatedText></p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <FileText className="text-amber-500 h-8 w-8" />
                <h2><TranslatedText>The Document War Chest</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]">
                <TranslatedText>{`To get approved for these premium products, you need to look like a "low-risk" borrower. Gather these 4 things before you make the call.`}</TranslatedText>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CourseCard className="border-slate-100 shadow-none">
                  <h4 className="font-bold text-[#1A1D26] flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> <TranslatedText>Proof of Income</TranslatedText></h4>
                  <p className="text-xs text-[#5A6175] mt-2"><TranslatedText>Last 2 years of tax returns (W2/T4) and your last 3 pay stubs. Banks love consistent, predictable cashflow.</TranslatedText></p>
                </CourseCard>
                <CourseCard className="border-slate-100 shadow-none">
                  <h4 className="font-bold text-[#1A1D26] flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> <TranslatedText>Property Valuation</TranslatedText></h4>
                  <p className="text-xs text-[#5A6175] mt-2"><TranslatedText>A recent appraisal or tax assessment. Most "Open System" products require an LTV (Loan-to-Value) under 80%.</TranslatedText></p>
                </CourseCard>
                <CourseCard className="border-slate-100 shadow-none">
                  <h4 className="font-bold text-[#1A1D26] flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> <TranslatedText>Debt List</TranslatedText></h4>
                  <p className="text-xs text-[#5A6175] mt-2"><TranslatedText>Statements for any car loans or credit cards you plan to "roll" into the account to prove the consolidation benefit.</TranslatedText></p>
                </CourseCard>
                <CourseCard className="border-slate-100 shadow-none">
                  <h4 className="font-bold text-[#1A1D26] flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> <TranslatedText>Existing Statement</TranslatedText></h4>
                  <p className="text-xs text-[#5A6175] mt-2"><TranslatedText>Your current mortgage statement showing your balance and, most importantly, your current interest rate for comparison.</TranslatedText></p>
                </CourseCard>
              </div>
            </section>

            <section className="bg-gradient-to-br from-purple-600 to-violet-700 p-10 rounded-[32px] text-white text-center space-y-6 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <CheckCircle2 className="h-3 w-3" />
                <TranslatedText>End of Lesson 4</TranslatedText>
              </div>
              <h3 className="text-3xl font-fraunces font-black"><TranslatedText>Ready for the Roadmap?</TranslatedText></h3>
              <p className="opacity-90 max-w-md mx-auto text-lg"><TranslatedText>You have the scripts, the banks, and the documents. Now it's time to put it all into a week-by-week action plan to reach freedom.</TranslatedText></p>
              <button className="bg-white text-purple-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-2xl text-lg group flex items-center gap-2 mx-auto transition-all" onClick={nextLesson}>
                <TranslatedText>Get My Action Plan</TranslatedText>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </div>
        )}

        {id === 5 && (
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <Target className="text-green-500 h-8 w-8" />
                <h2><TranslatedText>Your 8-Week Freedom Roadmap</TranslatedText></h2>
              </div>
              <p className="text-lg leading-relaxed text-[#5A6175]">
                <TranslatedText>{`Knowledge without action is just trivia. This lesson is your tactical manual. We have broken down the transition into the "Open System" into 4 distinct phases. Success isn't about working harder—it's about following the blueprint.`}</TranslatedText>
              </p>
            </section>

            <CourseCard title="🗓️ The Implementation Timeline">
              <ExpandSection title="Weeks 1-2: Gather Intel">
                <div className="space-y-1">
                  <TaskItem id="w1-1" label="Find current mortgage statement and exact principal balance" />
                  <TaskItem id="w1-2" label="Calculate average monthly NET (take-home) income" />
                  <TaskItem id="w1-3" label="Track non-debt expenses for 14 days to find your true cashflow" />
                  <TaskItem id="w1-4" label="Check your current credit score (aim for 720+ for best rates)" />
                  <TaskItem id="w1-5" label="List all other debts (car, CC, loans) and their APRs" />
                </div>
              </ExpandSection>
              <ExpandSection title={`Weeks 2-4: Call ${country.name} Banks`}>
                <div className="space-y-1">
                  <TaskItem id="w2-1" label="Call at least 3 banks from our recommended list" />
                  <TaskItem id="w2-2" label="Use the phone script to ask for first-lien products" />
                  <TaskItem id="w2-3" label="Ask specifically about 'Daily Interest Calculation' rules" />
                  <TaskItem id="w2-4" label="Compare LTV limits (aim for 80%) and setup fees" />
                  <TaskItem id="w2-5" label="Request a formal 'Letter of Interest' or pre-approval" />
                </div>
              </ExpandSection>
              <ExpandSection title="Weeks 4-6: Apply & Close">
                <div className="space-y-1">
                  <TaskItem id="w4-1" label="Submit required documentation (T4s/W2s, Appraisals)" />
                  <TaskItem id="w4-2" label="Review closing disclosure for hidden 'inactivity' fees" />
                  <TaskItem id="w4-3" label="Sign the paperwork and receive your new account details" />
                  <TaskItem id="w4-4" label="Notify your employer to switch your direct deposit" />
                  <TaskItem id="w4-5" label="Move existing liquid savings into the new account" />
                </div>
              </ExpandSection>
              <ExpandSection title="Weeks 7-8: Optimize">
                <div className="space-y-1">
                  <TaskItem id="w7-1" label="Connect your 0% credit card for the offset trick" />
                  <TaskItem id="w7-2" label="Automate all bill payments from the credit card" />
                  <TaskItem id="w7-3" label="Perform your first monthly balance review" />
                  <TaskItem id="w7-4" label="Roll any high-interest debt into the account" />
                  <TaskItem id="w7-5" label="Celebrate your first month of interest savings!" />
                </div>
              </ExpandSection>
            </CourseCard>

            <section className="space-y-8">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <BarChart className="text-blue-500 h-8 w-8" />
                <h2><TranslatedText>The Milestone Path</TranslatedText></h2>
              </div>
              <p className="text-[#5A6175]"><TranslatedText>{`What does your life look like after you start? Here is the standard progression for a ${country.name} homeowner using this method.`}</TranslatedText></p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-[#1A1D26] uppercase text-xs tracking-widest"><TranslatedText>Year 1: The Habit Phase</TranslatedText></h4>
                  <p className="text-sm text-[#5A6175]"><TranslatedText>You've mastered the 'Bathtub' flow. Interest charges are noticeably lower every month compared to your old loan. You feel in control.</TranslatedText></p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-[#1A1D26] uppercase text-xs tracking-widest"><TranslatedText>Year 3: The Velocity Phase</TranslatedText></h4>
                  <p className="text-sm text-[#5A6175]"><TranslatedText>Balance is down roughly 40%. The principal reduction is now moving faster than interest accrual. Debt-free date is visible.</TranslatedText></p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                  <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-[#1A1D26] uppercase text-xs tracking-widest"><TranslatedText>Year 5-7: The Freedom Phase</TranslatedText></h4>
                  <p className="text-sm text-emerald-800 font-medium"><TranslatedText>HOME PAID OFF. You now own 100% of your primary residence. Your entire income is now yours to keep or invest. No more House #2.</TranslatedText></p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm space-y-3">
                  <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <Coins className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-[#1A1D26] uppercase text-xs tracking-widest"><TranslatedText>Year 8+: The Multiplier Phase</TranslatedText></h4>
                  <p className="text-sm text-amber-800 font-medium"><TranslatedText>Using your paid-off equity to buy cash-flowing rentals. Generational wealth starts building here. You are the bank now.</TranslatedText></p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-fraunces font-bold text-[#1A1D26]">
                <HomeIcon className="text-blue-500 h-8 w-8" />
                <h2><TranslatedText>Dave and Sarah: 7 Years Later</TranslatedText></h2>
              </div>
              <CourseCard className="border-blue-100 bg-blue-50/20 italic">
                <p><TranslatedText>{`Dave and Sarah stuck to the plan. They didn't earn an extra penny, but they used the "Bathtub" flow religiously. Today, they received a letter from their bank in ${country.name}. The balance on their ${country.productShort} is $0.00.`}</TranslatedText></p>
                <p className="mt-4"><TranslatedText>{`While their neighbors are still in Year 7 of their 30-year "trap," Dave and Sarah are debt-free. That monthly mortgage payment? It's now a monthly "Freedom Fund" they're using to travel and invest. The "Invisible House" they were building for the bank is gone—every brick now belongs to them.`}</TranslatedText></p>
              </CourseCard>
            </section>

            <section className="bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-10 rounded-[32px] text-white text-center space-y-6 shadow-2xl shadow-blue-200">
              <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
                <GraduationCap className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-fraunces font-black"><TranslatedText>Congratulations, Graduate!</TranslatedText></h2>
                <p className="opacity-90 max-w-md mx-auto text-lg"><TranslatedText>You now have the exact knowledge required to beat the banks at their own game. True home ownership isn't 30 years away—it's within your grasp right now.</TranslatedText></p>
              </div>
              
              <div className="pt-4">
                <button 
                  className="bg-white text-[#2563EB] hover:bg-slate-50 font-bold px-10 py-5 rounded-2xl text-xl group flex items-center gap-2 mx-auto transition-all shadow-xl hover:scale-105" 
                  onClick={() => router.push('/')}
                >
                  <TranslatedText>Get My Free Savings Blueprint</TranslatedText>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="mt-4 text-white/60 text-sm italic font-medium"><TranslatedText>Enter your actual numbers into the Blueprint to see your specific payoff date.</TranslatedText></p>
              </div>
            </section>
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
          <button 
            onClick={nextLesson}
            className="group flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
          >
            <TranslatedText>{id === 5 ? "Finish Course" : "Next Lesson"}</TranslatedText>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
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
