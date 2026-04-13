
'use client';
import React, { use, useState, useEffect } from 'react';
import { CourseProvider, useCourse } from '@/components/course/CourseProvider';
import { lessonMeta } from '@/lib/course/lesson-meta';
import { languages } from '@/lib/course/translations';
import { InterestCalc, AmortViz, PayoffRace, TruthCalculator, QualificationCalc, ScriptGenerator, BankRateChart } from '@/components/course/Calculators';
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
  Award,
  Trophy,
  Download,
  History,
  Scale,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Hammer,
  ShieldHalf,
  Construction,
  Calculator,
  ListChecks
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
        <Link href="/learn" className="flex items-center gap-2 text-[#5A6175] font-black text-sm">
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
  // Lock modules 4 and 5
  const isLocked = id >= 4 && !isPrivileged;

  const nextLesson = () => {
    completeLesson(id);
    if (id < 5) router.push(`/learn/lesson/${id + 1}`);
    else router.push('/questionnaire');
  };

  const prevLesson = () => {
    if (id > 1) router.push(`/learn/lesson/${id - 1}`);
    else router.push('/learn');
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-body pb-32">
      <ProgressBar current={id} />
      
      <div className="max-w-[800px] mx-auto px-4 py-16 space-y-24">
        
        {id === 1 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            {/* HERO SECTION */}
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-200">
                <Landmark className="h-4 w-4" />
                <TranslatedText>{`Exclusive for ${country.name} Homeowners`}</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>{`Why ${country.banks[0]} & ${country.banks[1]} Hide This:`}</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>Payoff in 5-7 Years, Same Income.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Master the "Open Credit" secret that bypasses the ${country.amortYears}-year amortization trap used by the top 1%.`}</TranslatedText>
              </p>
              <div className="pt-6">
                <Button size="lg" variant="outline" className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 font-bold h-14 px-8">
                  <Download className="mr-2 h-5 w-5" /> Download "Half Your Mortgage" PDF Blueprint
                </Button>
              </div>
            </header>

            <section className="space-y-16">
              <CourseCard className="border-l-[12px] border-l-blue-600 shadow-2xl p-12 md:p-16 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <UserCircle2 className="h-96 w-96" />
                </div>
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                      <Star className="h-8 w-8 fill-blue-600" />
                    </div>
                    <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] leading-tight">
                      <TranslatedText>The Banker Dinner Reveal</TranslatedText>
                    </h2>
                  </div>
                  
                  <div className="space-y-8 leading-relaxed text-xl text-[#334155] font-medium">
                    <p className="italic border-l-4 border-slate-200 pl-8 py-2">
                      <TranslatedText>{`Years ago, I sat across from a senior executive at ${country.banks[0]}. After a few drinks, he admitted something that changed my life: "We don't want you to pay off your home. We want you to maintain it for us while we harvest your labor through the amortization curve."`}</TranslatedText>
                    </p>
                    <p>
                      <TranslatedText>{`Most ${country.name} homeowners believe their mortgage is a straightforward loan. It's actually a "One-Way Street." Your bank has designed a system where money flows IN, but never OUT without a high-fee renegotiation. They call this "Truth In Lending" (TIL), but the real truth is buried in the math of front-loaded interest.`}</TranslatedText>
                    </p>
                  </div>
                </div>
              </CourseCard>

              <InterestCalc />

              <Quiz 
                question="Why is a First-Lien HELOC/Offset cheaper than a mortgage even if the rate is slightly higher?"
                options={[
                  "Because it uses a special government subsidy for homeowners",
                  "It recalculates interest daily on your net balance (Income - Expenses)",
                  "Banks give a 50% discount to people who sign the 'Truth' waiver",
                  "It allows you to skip your property tax payments"
                ]}
                correctAnswer={1}
                explanation="Mortgages are 'One-Way' systems where interest is front-loaded on the full balance. An Open System (HELOC/Offset) calculates interest DAILY only on the money you actually owe after your paycheck hits. This is the structural arbitrage that saves thousands."
              />

              {/* FINAL CTA */}
              <section className="bg-gradient-to-br from-blue-700 to-indigo-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16">
                <div className="text-center space-y-8">
                  <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                    <Rocket className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                    <TranslatedText>{`Unlock the ${country.name} Strategy`}</TranslatedText>
                  </h2>
                  <p className="text-blue-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>{`In Lesson 2, we dive into the specific account types at ${country.banks.slice(0, 3).join(', ')} and the step-by-step setup for your region.`}</TranslatedText>
                  </p>
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
                    <TranslatedText>{`Lesson 2: ${country.productShort} Setup`}</TranslatedText>
                    <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              </section>
            </section>
          </div>
        )}

        {id === 2 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            {/* HERO SECTION */}
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                <TranslatedText>Step 2: The Qualification Blueprint</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>{`Pass the ${country.name} Tests:`}</TranslatedText>
                <span className="block text-emerald-600 italic mt-4">
                  <TranslatedText>{`DTI < ${country.dtiLimit}%, Credit 680+, LTV ${Math.round(country.ltvValue * 100)}%`}</TranslatedText>
                </span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Before calling ${country.banks[0]}, you must audit your numbers like a lender. Most rejections are predictable — and fixable.`}</TranslatedText>
              </p>
              <div className="pt-6">
                <Button size="lg" className="bg-slate-900 hover:bg-black rounded-full font-black h-14 px-8 text-lg">
                  <Lock className="mr-2 h-5 w-5 text-yellow-400" /> Unlock {country.name} Bank List
                </Button>
              </div>
            </header>

            {/* DTI QUIZ SECTION */}
            <section className="space-y-16">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <h2 className="text-4xl font-fraunces font-black text-[#1A1D26]"><TranslatedText>The DTI Health Check</TranslatedText></h2>
                  </div>
                  <p className="text-xl text-slate-600 leading-relaxed font-medium">
                    <TranslatedText>{`Lenders in ${country.name} care about one formula above all others: your Debt-to-Income (DTI) ratio. If this number is too high, your strategy is dead on arrival. Use the tool below to verify your standing.`}</TranslatedText>
                  </p>
                </div>
                <div className="w-full md:w-80 bg-white p-8 rounded-[40px] border-4 border-slate-900 shadow-2xl space-y-6">
                  <h4 className="text-center font-black uppercase text-[10px] tracking-widest text-slate-400"><TranslatedText>Regional Benchmarks</TranslatedText></h4>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-bold text-slate-600">USA PITIA</span>
                      <span className="font-black text-blue-600">&lt; 43%</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-bold text-slate-600">CAN TDS</span>
                      <span className="font-black text-blue-600">&lt; 44%</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-bold text-slate-600">UK Mult.</span>
                      <span className="font-black text-blue-600">4.5x Inc</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-600">AUS LVR</span>
                      <span className="font-black text-blue-600">&lt; 90%</span>
                    </div>
                  </div>
                </div>
              </div>

              <QualificationCalc />

              {/* HACKS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <Hammer className="h-10 w-10" />
                    <h3 className="text-3xl font-fraunces font-black text-slate-900 uppercase tracking-tight"><TranslatedText>The 50-Point Credit Boost</TranslatedText></h3>
                  </div>
                  <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                    <p>
                      <TranslatedText>{`Lenders use your middle FICO score to set your HELOC rate. A score of 740+ often triggers 'Tier 1' pricing, which can save you 0.50% to 1.00% compared to a 680.`}</TranslatedText>
                    </p>
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-emerald-900 font-bold text-base">
                      <TranslatedText>{`Hack: Dispute even accurate late payments as 'unverified' 30 days before applying. The temporary removal during the investigation can spike your score for the lender pull.`}</TranslatedText>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-blue-600">
                    <ShieldHalf className="h-10 w-10" />
                    <h3 className="text-3xl font-fraunces font-black text-slate-900 uppercase tracking-tight"><TranslatedText>The BLOC DTI Drop</TranslatedText></h3>
                  </div>
                  <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                    <p>
                      <TranslatedText>{`If your personal DTI is over 45%, most banks will reject you. The fastest way to drop DTI is to move high-payment consumer debt off your personal report.`}</TranslatedText>
                    </p>
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-blue-900 font-bold text-base">
                      <TranslatedText>{`Strategy: Open a Business Line of Credit (BLOC) under an LLC/Corporation. Move car loans or credit cards to the BLOC. Since BLOCs usually don't report to personal bureaus, your DTI vanishes overnight.`}</TranslatedText>
                    </div>
                  </div>
                </div>
              </div>

              <Quiz 
                question={`In ${country.name}, what is the 'Non-Negotiable' LTV limit for a standalone HELOC?`}
                options={[
                  "95% - The bank wants to lend as much as possible",
                  "80% - Federal regulations require a 20% equity cushion",
                  "100% - Equity doesn't matter if you have high income",
                  "50% - Banks are currently in a high-risk contraction"
                ]}
                correctAnswer={1}
                explanation={`In ${country.name}, 80% LTV is the 'Golden Rule'. While some credit unions might go higher, 80% ensures you avoid Private Mortgage Insurance (PMI) or LMI and qualifies you for the lowest rates.`}
              />

              {/* FINAL CTA FOR LESSON 2 */}
              <section className="bg-gradient-to-br from-emerald-700 to-slate-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16">
                <div className="text-center space-y-8">
                  <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                    <Star className="h-12 w-12 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                    <TranslatedText>{`Ready to Call the Bank?`}</TranslatedText>
                  </h2>
                  <p className="text-emerald-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>{`You've audited your DTI and Credit. In Lesson 3, we reveal the specific regional banks and the exact 'Private Wealth' script to get your first-lien line approved in 7 days.`}</TranslatedText>
                  </p>
                </div>

                <div className="pt-16 border-t border-white/10 text-center space-y-10">
                  <div className="flex items-center justify-center gap-4 text-yellow-400 font-black uppercase text-sm tracking-[0.4em]">
                    <Zap className="h-6 w-6" />
                    <TranslatedText>End of Masterclass Module 2</TranslatedText>
                  </div>
                  <button 
                    onClick={nextLesson}
                    className="bg-white text-emerald-900 hover:bg-emerald-50 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <TranslatedText>{`Lesson 3: ${country.banks[0]} Scripts`}</TranslatedText>
                    <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              </section>
            </section>
          </div>
        )}

        {id === 3 && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            {/* HERO SECTION */}
            <header className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 border border-blue-200">
                <Search className="h-4 w-4" />
                <TranslatedText>{`Step 3: The ${country.name} Lender Hunt`}</TranslatedText>
              </div>
              <h1 className="text-5xl md:text-8xl font-fraunces font-black text-[#1A1D26] leading-[0.95] tracking-tighter">
                <TranslatedText>{`The ${country.productShort} Shortlist:`}</TranslatedText>
                <span className="block text-blue-600 italic mt-4"><TranslatedText>10yr Draw, Interest-Only, Promo Stack.</TranslatedText></span>
              </h1>
              <p className="text-[#5A6175] text-2xl md:text-3xl leading-relaxed max-w-2xl mx-auto font-medium">
                <TranslatedText>{`Finding the right vendor is 90% of the battle. In ${country.name}, we're looking for 'Open Systems' that treat your income as a direct principal weapon.`}</TranslatedText>
              </p>
            </header>

            <section className="space-y-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h2 className="text-4xl font-fraunces font-black text-slate-900 tracking-tight"><TranslatedText>The Must-Haves Checklist</TranslatedText></h2>
                  <div className="space-y-4">
                    {[
                      { title: "10-Year Draw Period", desc: "Allows you to move money in and out for a decade without reapplying." },
                      { title: "Automated Sweep/MMA", desc: country.name === 'Canada' ? "Scotiabank STEP or Manulife One style integration." : "Checking integration that kills daily interest automatically." },
                      { title: "No-Fee Principal Injections", desc: "Ensure there are zero penalties for paying off the line in weeks, not years." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900">{item.title}</h4>
                          <p className="text-slate-500 font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-[56px] p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><BarChart className="h-48 w-48" /></div>
                  <h3 className="text-white font-black text-xl mb-2 relative z-10"><TranslatedText>Rate Volatility vs. Logic</TranslatedText></h3>
                  <p className="text-slate-400 text-sm mb-6 relative z-10"><TranslatedText>{`Even at ${country.avgRate + 1}%, an Open system beats a 5% Closed mortgage due to ADB (Average Daily Balance) math.`}</TranslatedText></p>
                  <BankRateChart />
                </div>
              </div>

              {/* BANK GUIDE TEASER */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Star className="h-6 w-6 fill-amber-600" />
                  </div>
                  <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] tracking-tight"><TranslatedText>{`Top Lenders in ${country.name}`}</TranslatedText></h2>
                </div>
                <div className="overflow-hidden border-2 border-slate-100 rounded-[40px] bg-white shadow-xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b-2 border-slate-100">
                      <tr>
                        <th className="p-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Institution</th>
                        <th className="p-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Max LTV</th>
                        <th className="p-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Typical Rate</th>
                        <th className="p-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {country.banks.slice(0, 3).map((bank, i) => (
                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-6 font-bold text-slate-900">{bank}</td>
                          <td className="p-6 font-mono text-blue-600 font-black">80%</td>
                          <td className="p-6 font-mono text-slate-600">Prime + 0.5%</td>
                          <td className="p-6"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">Verified</span></td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/50 italic">
                        <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                          <Lock className="h-4 w-4 inline mr-2 mb-1" /> Unlock the full list of 50+ Regional Banks and Credit Unions in the Pro Masterclass.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SCRIPT GENERATOR */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h2 className="text-4xl font-fraunces font-black text-[#1A1D26] tracking-tight"><TranslatedText>The 'Private Wealth' Script</TranslatedText></h2>
                </div>
                <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl">
                  <TranslatedText>{`Don't let a junior loan officer reject you. Use this specific framing to get transferred to the Portfolio Lending department at institutions like ${country.banks[0]}.`}</TranslatedText>
                </p>
                <ScriptGenerator />
              </div>

              <Quiz 
                question={`What is the 'Magic Phrase' to use when a banker tries to sell you a traditional amortized mortgage?`}
                options={[
                  "I'm actually looking for a higher interest rate, please",
                  "I'm specifically seeking a 'Velocity-Compatible' Open Credit system with daily recalculation",
                  "I want the one with the lowest monthly payment possible",
                  "Can I speak to your manager about a credit card?"
                ]}
                correctAnswer={1}
                explanation={`Using professional terminology like 'Daily Recalculation' and 'Open Credit System' signals to the bank that you are a high-net-worth strategist, not a retail consumer. This often triggers a transfer to the private wealth or portfolio lending desk.`}
              />

              {/* FINAL CTA */}
              <section className="bg-gradient-to-br from-blue-700 to-indigo-950 p-16 md:p-20 rounded-[80px] border border-white/10 shadow-2xl space-y-16">
                <div className="text-center space-y-8">
                  <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl mb-6 shadow-2xl">
                    <History className="h-12 w-12 text-yellow-400" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-fraunces font-black text-white leading-tight">
                    <TranslatedText>Verify the Disclosures</TranslatedText>
                  </h2>
                  <p className="text-blue-100 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <TranslatedText>{`You have the banks and the scripts. In Lesson 4, we perform a 'Contract Autopsy' to find the hidden fees and clauses banks use to reset your clock.`}</TranslatedText>
                  </p>
                </div>

                <div className="pt-16 border-t border-white/10 text-center space-y-10">
                  <div className="flex items-center justify-center gap-4 text-yellow-400 font-black uppercase text-sm tracking-[0.4em]">
                    <Lock className="h-6 w-6" />
                    <TranslatedText>End of Masterclass Module 3</TranslatedText>
                  </div>
                  <button 
                    onClick={nextLesson}
                    className="bg-white text-blue-900 hover:bg-blue-50 font-black px-16 py-8 rounded-[32px] text-3xl group flex items-center gap-6 mx-auto transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <TranslatedText>Lesson 4: Contract Audit</TranslatedText>
                    <ArrowRight className="h-10 w-10 group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              </section>
            </section>
          </div>
        )}

        {id >= 4 && (
          <div className="space-y-20 animate-in fade-in duration-700">
            {isLocked ? (
              <section className="bg-white p-20 rounded-[80px] border-4 border-dashed border-slate-200 text-center space-y-12 shadow-inner">
                  <div className="bg-amber-100 w-40 h-40 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20 border-4 border-white">
                      <Lock className="h-20 w-14 text-amber-600" />
                  </div>
                  <div className="space-y-8">
                      <h2 className="text-5xl md:text-7xl font-fraunces font-black text-slate-900 leading-tight tracking-tight">
                          <TranslatedText>Premium Strategy: Locked</TranslatedText>
                      </h2>
                      <p className="text-slate-500 text-2xl max-w-xl mx-auto font-medium leading-relaxed italic">
                          <TranslatedText>{`Lessons 4 and 5 contain the high-velocity execution blueprints and contract audit checklists reserved for our Pro Members. Join 39,000+ homeowners reclaiming their freedom.`}</TranslatedText>
                      </p>
                  </div>
                  <div className="p-12 bg-slate-50 rounded-[48px] text-left space-y-8 max-w-xl mx-auto border-2 border-white shadow-xl">
                      <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 pb-4"><TranslatedText>The Pro Curriculum:</TranslatedText></h4>
                      <ul className="space-y-6">
                          <li className="flex items-start gap-5 text-xl font-bold text-slate-700">
                              <Gem className="h-8 w-8 text-yellow-500 shrink-0 mt-0.5" />
                              <span><TranslatedText>The Contract Autopsy: Spotting 'Reset' traps in bank paperwork.</TranslatedText></span>
                          </li>
                          <li className="flex items-start gap-5 text-xl font-bold text-slate-700">
                              <Gem className="h-8 w-8 text-yellow-500 shrink-0 mt-0.5" />
                              <span><TranslatedText>The 30-Day Float: Force the bank to pay your bills.</TranslatedText></span>
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
                              <TranslatedText>Unlock Pro Masterclass</TranslatedText>
                              <ArrowRight className="ml-4 h-10 w-10" />
                          </Link>
                      </Button>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]"><TranslatedText>30-Day Money-Back Guarantee</TranslatedText></p>
                  </div>
              </section>
            ) : (
              <div className="space-y-20">
                {/* Advanced content for Lesson 4/5 */}
                <header className="p-16 bg-slate-900 text-white rounded-[64px] shadow-2xl relative overflow-hidden border-4 border-slate-800">
                  <div className="absolute top-0 right-0 p-12 opacity-20">
                    <FileText className="h-48 w-48" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] opacity-80 mb-4 text-blue-400">
                      <Award className="h-6 w-6" /> <TranslatedText>Pro Module: Contract Audit</TranslatedText>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-fraunces font-black leading-none tracking-tight text-white">
                      <TranslatedText>The Contract Autopsy</TranslatedText>
                    </h1>
                    <p className="mt-8 text-2xl opacity-90 leading-relaxed font-bold max-w-2xl italic text-slate-300">
                      <TranslatedText>{`How to spot the 'Small Print' traps that allow banks to freeze your credit line or reset your amortization schedule without warning.`}</TranslatedText>
                    </p>
                  </div>
                </header>
                {/* Placeholder for Lesson 4/5 detailed implementation */}
                <div className="text-center p-20 border-4 border-dashed border-slate-200 rounded-[64px]">
                   <Construction className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest">Finalizing Pro Content...</p>
                </div>
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
                <TranslatedText>{id === 3 ? "Unlock Pro Plan" : "Next Lesson"}</TranslatedText>
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
