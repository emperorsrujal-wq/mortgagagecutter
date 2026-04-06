'use client';
import React, { use } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { InterestCalc, AmortViz, PayoffRace } from '@/components/course/Calculators';
import { CourseCard, InfoBox, ExpandSection, StatBox, ChatBubble, TaskItem } from '@/components/course/UIComponents';
import { TranslatedText } from '@/components/course/TranslatedText';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, CheckCircle2, Rocket, Landmark, ShieldAlert, GraduationCap, ArrowRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-dm-sans pb-24">
      <ProgressBar current={id} />
      
      <div className="max-w-[720px] mx-auto px-4 py-12 space-y-10">
        
        <header className="space-y-2">
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
          <h1 className="text-3xl md:text-4xl font-fraunces font-black text-[#1A1D26] leading-tight">
            <TranslatedText>{meta.title}</TranslatedText>
          </h1>
          <p className="text-[#5A6175] text-lg">
            <TranslatedText>
              {id === 1 ? `What your ${country.name} lender hopes you'll never calculate.` : 
               id === 2 ? `The day-by-day mechanics of ${country.productShort} in ${country.name}.` :
               id === 3 ? `The credit card offset trick, debt rolling, and cashflow boosters.` :
               id === 4 ? `The exact words to say, banks to call, and red flags to avoid.` :
               `Week-by-week roadmap to ${country.productShort} freedom in ${country.name}.`}
            </TranslatedText>
          </p>
        </header>

        {id === 1 && (
          <div className="space-y-8">
            <CourseCard title="🍽️ Imagine walking into a restaurant...">
              <p><TranslatedText>{`The menu says a steak costs ${country.symbol}50. You order it. The waiter smiles and says: "That'll be ${country.symbol}97, please." You'd walk out, right?`}</TranslatedText></p>
              <p><TranslatedText>{`But this is EXACTLY what happens with a traditional home loan. You borrow ${new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency }).format(country.avgHome)} to buy a home. By the time you finish paying, you've paid nearly DOUBLE that amount.`}</TranslatedText></p>
            </CourseCard>
            <InterestCalc />
            <CourseCard title="📊 Where does your monthly payment actually go?">
              <p><TranslatedText>{`Here's the part that shocks everyone: your monthly payment stays the same for ${country.amortYears} years. But in the early years, about 80 to 90 cents of every dollar goes to INTEREST — not to actually paying off your home. The lender gets fed first.`}</TranslatedText></p>
            </CourseCard>
            <AmortViz />
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
        )}

        {id === 2 && (
          <div className="space-y-8">
            <CourseCard title="💡 The simple version (no jargon)">
              <p><TranslatedText>{`Imagine you have a bathtub full of water. The water represents your home loan balance. With a traditional loan, you can only drain the tub by a tiny amount once a month. The rest of the time, the water level stays high and the daily interest fee stays high.`}</TranslatedText></p>
              <p><TranslatedText>{`With a ${country.productShort}, you pour ALL your income into the tub on payday, instantly dropping the level. You scoop it back out to pay bills, but for most of the month, the level is LOWER. Over years, this saves a fortune.`}</TranslatedText></p>
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-bold">
                🎯 <TranslatedText>The magic isn't in the interest rate. It's in the DAILY RECALCULATION. Every dollar sitting in the account reduces the interest charged immediately.</TranslatedText>
              </div>
            </CourseCard>
            <PayoffRace />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4">
                <h4 className="font-fraunces font-black text-red-800"><TranslatedText>{`🔒 Traditional ${country.amortYears}-Year Loan`}</TranslatedText></h4>
                <ul className="text-sm space-y-3 text-red-700">
                  <li className="flex gap-2">❌ <TranslatedText>Money goes in monthly, never out</TranslatedText></li>
                  <li className="flex gap-2">❌ <TranslatedText>Zero flexibility for emergencies</TranslatedText></li>
                  <li className="flex gap-2">❌ <TranslatedText>Interest calculated on full balance monthly</TranslatedText></li>
                </ul>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-4">
                <h4 className="font-fraunces font-black text-emerald-800"><TranslatedText>{`🔓 ${country.productName}`}</TranslatedText></h4>
                <ul className="text-sm space-y-3 text-emerald-700">
                  <li className="flex gap-2">✅ <TranslatedText>Money flows freely in AND out</TranslatedText></li>
                  <li className="flex gap-2">✅ <TranslatedText>Full liquidity for opportunities</TranslatedText></li>
                  <li className="flex gap-2">✅ <TranslatedText>Interest recalculated DAILY</TranslatedText></li>
                </ul>
              </div>
            </div>
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
              <Button asChild size="lg" className="bg-white text-[#2563EB] hover:bg-slate-50 font-bold px-8 py-7 rounded-2xl text-lg group">
                <Link href="/">
                  <TranslatedText>Get My Free Savings Blueprint</TranslatedText>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
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
