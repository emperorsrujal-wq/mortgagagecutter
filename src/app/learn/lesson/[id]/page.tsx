'use client';
import React, { use } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { InterestCalc, AmortViz, PayoffRace } from '@/components/course/Calculators';
import { CourseCard, InfoBox, ExpandSection, StatBox, ChatBubble, TaskItem } from '@/components/course/UIComponents';
import { TranslatedText } from '@/components/course/TranslatedText';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, CheckCircle2, Rocket, Landmark, ShieldAlert, GraduationCap, ArrowRight, UserCircle2, HomeIcon, Ghost, Timer, Droplets, Waves, Zap, ShieldCheck } from 'lucide-react';
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
        <div className="w-20" /> {/* Spacer */}
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
    else router.push('/learn');
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
              {id === 1 ? `Why the world's most popular financial product is actually a brilliantly disguised trap for your wealth.` : 
               id === 2 ? `How to break the trap using the "Open System" logic that the wealthy have used for decades.` :
               id === 3 ? `The credit card offset trick, debt rolling, and cashflow boosters.` :
               id === 4 ? `The exact words to say, banks to call, and red flags to avoid.` :
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
          <div className="space-y-8">
            <CourseCard title="🚀 Strategy 1: The Credit Card Offset (~20% Faster)">
              <p><TranslatedText>{`This is the ultimate "double job" for your money. You route all your spending through a 0% interest credit card. You keep your entire income inside your ${country.productShort} for an extra 25-30 days.`}</TranslatedText></p>
              <p><TranslatedText>{`Then, on the last possible day, you pay off the credit card from the ${country.productShort}. This keeps your loan balance lower for longer every month, nuking interest 24/7.`}</TranslatedText></p>
              <InfoBox title="Analogy" color="blue">Your money gets to work TWO jobs simultaneously. Job 1: Lowering your mortgage interest. Job 2: Paying for your groceries.</InfoBox>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm italic">
                ⚠️ <TranslatedText>Warning: Only use this if you pay your card in FULL every month. Use 0% interest grace periods only. Keep utilization under 30%.</TranslatedText>
              </div>
            </CourseCard>

            <CourseCard title="🔄 Strategy 2: Debt Rolling">
              <p><TranslatedText>{`Got a car loan at 8%? Or credit cards at 20%? Roll them into your ${country.productShort}. Why? Because your ${country.productShort} rate is almost certainly lower, and the daily interest mechanic means you pay it off exponentially faster than an installment loan.`}</TranslatedText></p>
              <InfoBox title={`Tax Tip for ${country.name}`} color="purple">{country.taxRule}</InfoBox>
            </CourseCard>

            <CourseCard title="💰 9 Cashflow Boosters">
              <ExpandSection title="🍳 Cook at Home (~$3,500/yr per person)">The average restaurant markup is 300%. Cutting one meal out a week saves thousands in principal interest over 5 years.</ExpandSection>
              <ExpandSection title="🚗 Buy 2+ Year Old Cars (~$9,600 every 8 years)">Avoid the 20% "off-the-lot" depreciation. That money stays in your account lowering interest every day.</ExpandSection>
              <ExpandSection title="💳 0% Cashback Cards (~$1,500/yr)">Use the rewards to hit your principal. It's free money the bank is giving you back.</ExpandSection>
              <ExpandSection title="🌡️ Smart Thermostat (~$300/yr)">Automate your savings. Small monthly wins add up to months off your mortgage.</ExpandSection>
              <ExpandSection title="🏛️ Tax Optimization ($5,000-15,000+/yr)">Ensure you are claiming every deduction. In many regions, this alone can pay off your home 2 years sooner.</ExpandSection>
            </CourseCard>
          </div>
        )}

        {id === 4 && (
          <div className="space-y-8">
            <CourseCard title="📞 The Phone Script">
              <div className="flex flex-col">
                <ChatBubble role="you">{`Hi, I'm interested in refinancing my current mortgage into a ${country.productName}.`}</ChatBubble>
                <ChatBubble role="bank">{`We usually offer HELOCs as a second mortgage. Would you like to keep your current fixed rate?`}</ChatBubble>
                <ChatBubble role="pro">{`Pro Tip: Don't let them upsell a second lien. You want this in FIRST position so it replaces your mortgage entirely.`}</ChatBubble>
                <ChatBubble role="you">{`Actually, I need this to be a first-lien product where my income deposits directly into the account to reduce daily interest.`}</ChatBubble>
              </div>
            </CourseCard>

            <CourseCard title={`🏦 Recommended ${country.name} Banks`}>
              <div className="grid grid-cols-2 gap-3">
                {country.banks.map(bank => (
                  <div key={bank} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-sm text-slate-700">
                    <Landmark className="h-4 w-4 text-blue-500" />
                    {bank}
                  </div>
                ))}
              </div>
            </CourseCard>

            <CourseCard title="❓ Key Questions to Ask">
              <ol className="space-y-4 list-decimal list-inside text-sm font-medium">
                <li><TranslatedText>{`Is this a 100% ${country.productShort} where my savings/income reduce the balance daily?`}</TranslatedText></li>
                <li><TranslatedText>{`Can I get this in first-lien position to replace my current mortgage?`}</TranslatedText></li>
                <li><TranslatedText>{`What is the draw period vs the repayment period?`}</TranslatedText></li>
                <li><TranslatedText>{`Are there any transaction fees for paying bills directly from the account?`}</TranslatedText></li>
              </ol>
            </CourseCard>

            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4">
              <h4 className="font-fraunces font-black text-red-800 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" /> <TranslatedText>Red Flags to Avoid</TranslatedText>
              </h4>
              <ul className="text-sm space-y-3 text-red-700">
                <li className="flex gap-2">🚩 <TranslatedText>Lender insists on keeping your current mortgage (Second Lien trap).</TranslatedText></li>
                <li className="flex gap-2">🚩 <TranslatedText>High annual maintenance fees (> $100).</TranslatedText></li>
                <li className="flex gap-2">🚩 <TranslatedText>No direct deposit or bill-pay capability.</TranslatedText></li>
              </ul>
            </div>
          </div>
        )}

        {id === 5 && (
          <div className="space-y-8">
            <CourseCard title="🗓️ 8-Week Roadmap">
              <ExpandSection title="Weeks 1-2: Gather Intel">
                <div className="space-y-1">
                  <TaskItem id="w1-1" label="Find current mortgage statement and rate" />
                  <TaskItem id="w1-2" label="Calculate average monthly net income" />
                  <TaskItem id="w1-3" label="Track non-debt expenses for 14 days" />
                </div>
              </ExpandSection>
              <ExpandSection title={`Weeks 2-4: Call ${country.name} Banks`}>
                <div className="space-y-1">
                  <TaskItem id="w2-1" label="Call at least 3 banks from the recommended list" />
                  <TaskItem id="w2-2" label="Use the phone script to ask for first-lien products" />
                  <TaskItem id="w2-3" label="Compare LTV limits and interest calculation methods" />
                </div>
              </ExpandSection>
              <ExpandSection title="Weeks 4-6: Apply & Close">
                <div className="space-y-1">
                  <TaskItem id="w4-1" label="Submit required documentation (T4s/W2s, Appraisals)" />
                  <TaskItem id="w4-2" label="Review closing disclosure for hidden fees" />
                  <TaskItem id="w4-3" label="Set up your direct deposit into the new account" />
                </div>
              </ExpandSection>
              <ExpandSection title="Weeks 7-8: Optimize">
                <div className="space-y-1">
                  <TaskItem id="w7-1" label="Connect your 0% credit card for the offset trick" />
                  <TaskItem id="w7-2" label="Automate all bill payments from the credit card" />
                  <TaskItem id="w7-3" label="Perform your first monthly balance review" />
                </div>
              </ExpandSection>
            </CourseCard>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400">Year 3 Milestone</p>
                <p className="font-bold text-slate-800"><TranslatedText>Balance down ~40%</TranslatedText></p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm text-center space-y-2">
                <p className="text-[10px] font-black uppercase text-emerald-400">Year 5-7 Milestone</p>
                <p className="font-bold text-emerald-800 uppercase tracking-tighter"><TranslatedText>Home Paid Off</TranslatedText></p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-10 rounded-[32px] text-white text-center space-y-6 shadow-2xl shadow-blue-200">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
                <GraduationCap className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-fraunces font-black"><TranslatedText>Congratulations, Graduate!</TranslatedText></h2>
                <p className="opacity-90 max-w-md mx-auto"><TranslatedText>You now have the knowledge to beat the bank at their own game. Your journey to true ownership starts today.</TranslatedText></p>
              </div>
              <button className="bg-white text-[#2563EB] hover:bg-slate-50 font-bold px-8 py-4 rounded-2xl text-lg group flex items-center gap-2 mx-auto transition-all" onClick={() => router.push('/')}>
                <TranslatedText>Get My Free Savings Blueprint</TranslatedText>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
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
          {id !== 2 && (
            <button 
              onClick={nextLesson}
              className="group flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
            >
              <TranslatedText>{id === 5 ? "Finish Course" : "Next Lesson"}</TranslatedText>
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
