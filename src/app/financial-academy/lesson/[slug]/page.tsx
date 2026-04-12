
'use client';

import React, { use, useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { academyUnits } from '@/lib/academy/curriculum';
import { countryContentMap } from '@/lib/academy/content-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight,
  Home,
  Loader2,
  CheckCircle,
  Info,
  TrendingUp,
  Landmark,
  ShieldAlert,
  Coins,
  Scale,
  Baby,
  Building2,
  PieChart,
  ShieldCheck,
  Zap,
  Target,
  Globe,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AcademyLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Find current lesson and unit context
  const currentUnit = academyUnits.find(u => u.lessons.some(l => l.slug === slug));
  const currentLesson = currentUnit?.lessons.find(l => l.slug === slug);
  
  const flatLessons = academyUnits.flatMap(u => u.lessons);
  const currentIndex = flatLessons.findIndex(l => l.slug === slug);
  const nextLesson = flatLessons[currentIndex + 1];
  const prevLesson = flatLessons[currentIndex - 1];

  useEffect(() => {
    async function loadUser() {
      if (!user || !firestore) return;
      const docRef = doc(firestore, 'userFinancialProgress', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSelectedCountry(snap.data().selectedCountry || 'Canada');
        setCompletedLessons(snap.data().completedLessons || []);
      } else {
        setSelectedCountry('Canada');
      }
      setIsLoading(false);
    }
    if (!isUserLoading) loadUser();
  }, [user, firestore, isUserLoading]);

  const handleCountryChange = async (val: string) => {
    setSelectedCountry(val);
    if (user && firestore) {
      await setDoc(doc(firestore, 'userFinancialProgress', user.uid), {
        selectedCountry: val,
        lastAccessedAt: serverTimestamp(),
      }, { merge: true });
    }
  };

  const toggleComplete = async () => {
    if (!user || !firestore || !currentLesson) return;
    setIsMarking(true);
    const docRef = doc(firestore, 'userFinancialProgress', user.uid);
    
    const isCompleted = completedLessons.includes(currentLesson.id);
    const newCompleted = isCompleted 
      ? completedLessons.filter(id => id !== currentLesson.id)
      : [...completedLessons, currentLesson.id];

    await setDoc(docRef, {
      completedLessons: newCompleted,
      lastAccessedAt: serverTimestamp(),
      currentLesson: currentLesson.number,
      currentUnit: currentUnit?.number,
    }, { merge: true });

    setCompletedLessons(newCompleted);
    setIsMarking(false);
  };

  if (isUserLoading || isLoading || !selectedCountry) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Assembling Regional Lesson...</p>
      </div>
    );
  }

  if (!currentLesson) return <div className="p-20 text-center">Lesson not found.</div>;

  const isCompleted = completedLessons.includes(currentLesson.id);
  const country = countryContentMap[selectedCountry] || countryContentMap['Canada'];

  // Dynamic Category Rendering Logic
  const renderCategoryContent = () => {
    switch (currentLesson.category) {
      case 'Banking':
        return (
          <>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-500" /> The {selectedCountry} Banking Reality
              </h2>
              <p>
                Imagine walking into {country.majorBanks[0]} or {country.majorBanks[1]} in {country.cities[0]}. You deposit {country.currencySymbol}5,000 into your {country.retirementAccounts[0]} or a standard savings account. In your mind, that money is sitting safely in a vault.
              </p>
              <p>
                The reality in {selectedCountry} is that under {country.regulator}, the system operates on fractional reserves. Your deposit is the raw material for {country.majorBanks[0]} to lend out ten times that amount at {country.rates.mortgage} APR.
              </p>
            </section>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <Landmark className="h-6 w-6 text-blue-500" /> The Fractional Engine
              </h2>
              <p>
                In {selectedCountry}, {country.centralBank} sets the base rate (currently {country.rates.prime} for prime lending). This "Cost of Money" dictates everything from your mortgage at {country.majorBanks[2]} to the interest you earn.
              </p>
              <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-white uppercase tracking-widest text-xs text-blue-400"><Info className="h-4 w-4" /> Regional Insight: {selectedCountry}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  When you take a loan in {country.cities[1]} or {country.cities[2]}, the bank doesn't just "lend" you other people's money. They create a new liability on their balance sheet, expanding the money supply.
                </p>
              </div>
            </section>
          </>
        );
      case 'Insurance':
        return (
          <>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-emerald-500" /> The {selectedCountry} Risk Market
              </h2>
              <p>
                Whether you are dealing with {country.majorInsurers[0]} or {country.majorInsurers[1]}, insurance in {selectedCountry} is about the transfer of risk. You pay a premium so that the insurer carries the burden of a potential {country.currencySymbol}1 Million catastrophe.
              </p>
              <p>
                Under the oversight of the {country.insuranceRegulator}, these companies pool the premiums of millions of citizens in {country.cities[0]} and {country.cities[1]} to ensure solvency when claims arise.
              </p>
            </section>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <PieChart className="h-6 w-6 text-emerald-500" /> The Actuarial Logic
              </h2>
              <p>
                In {selectedCountry}, insurers use historical data to predict the future. They know exactly how many people in {country.cities[2]} will require a payout this year. The "Deductible" is your skin in the game, designed by companies like {country.majorInsurers[2]} to prevent moral hazard.
              </p>
              <div className="bg-emerald-950/20 p-8 rounded-3xl border border-emerald-500/10 space-y-4">
                <h4 className="flex items-center gap-2 font-bold text-emerald-400 uppercase tracking-widest text-xs"><Info className="h-4 w-4" /> Policy Strategy: {selectedCountry}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The {country.insuranceRegulator} ensures that for every {country.currencySymbol}1 of risk taken, companies like {country.majorInsurers[3]} hold enough capital to remain bulletproof during economic downturns.
                </p>
              </div>
            </section>
          </>
        );
      case 'Economics':
        return (
          <>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <Scale className="h-6 w-6 text-amber-500" /> The {selectedCountry} Macro Picture
              </h2>
              <p>
                Economics in {selectedCountry} is the study of how {country.centralBank} balances the scales of growth and inflation. With a national debt of {country.nationalDebt}, the government's decisions in {country.cities[0]} ripple through every household budget.
              </p>
              <p>
                The {country.currencyCode} isn't just paper; it's a reflection of the productivity of every worker from {country.cities[1]} to {country.cities[3]}.
              </p>
            </section>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <Landmark className="h-6 w-6 text-amber-500" /> Inflation & Rates
              </h2>
              <p>
                When inflation rises in {selectedCountry}, {country.centralBank} increases the base rate (prime is currently {country.rates.prime}). This makes borrowing more expensive at {country.majorBanks[0]}, slowing down the economy to protect the purchasing power of your {country.currencySymbol}1.
              </p>
            </section>
          </>
        );
      case 'Investing':
        return (
          <>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <Coins className="h-6 w-6 text-purple-500" /> Wealth Creation in {selectedCountry}
              </h2>
              <p>
                To build wealth in {selectedCountry}, you must move from being a consumer to an owner. By utilizing the {country.stockExchanges[0]}, you can own a piece of the most productive companies in {country.cities[0]} and beyond.
              </p>
              <p>
                The secret is the tax-advantaged accounts provided by {country.taxAgency}, such as {country.retirementAccounts.join(' or ')}.
              </p>
            </section>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-purple-500" /> The Power of Compounding
              </h2>
              <p>
                Investing {country.currencySymbol}1,000 today in a diversified portfolio on the {country.stockExchanges[0]} is the first step. Over decades, your returns are shielded from {country.taxAgency} within your {country.retirementAccounts[1]}, allowing for exponential growth.
              </p>
            </section>
          </>
        );
      case 'Government':
        return (
          <>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-400" /> The {selectedCountry} Fiscal Machine
              </h2>
              <p>
                The {country.taxAgency} is the engine that powers {selectedCountry}. Your tax dollars fund everything from infrastructure in {country.cities[0]} to social programs like {country.programs[0]}.
              </p>
              <p>
                Understanding how to navigate the {country.taxAgency}'s rules is the difference between keeping your wealth and losing it to the "Hidden Tax" of poor planning.
              </p>
            </section>
          </>
        );
      case 'Debt':
      case 'Mortgage':
        return (
          <>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <Target className="h-6 w-6 text-red-500" /> The {selectedCountry} Interest Trap
              </h2>
              <p>
                Consumer debt in {selectedCountry} is designed to be sticky. Whether it's a high-interest card from {country.majorBanks[0]} or a personal loan, the goal of the lender is to keep you paying interest for as long as possible.
              </p>
              <p>
                By learning the {selectedCountry} credit scoring system, you can leverage your position to secure lower rates and accelerate your payoff.
              </p>
            </section>
          </>
        );
      case 'Family':
        return (
          <>
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
                <Baby className="h-6 w-6 text-sky-500" /> Financial Legacy in {selectedCountry}
              </h2>
              <p>
                Teaching children in {selectedCountry} about money starts with understanding how to use accounts like the {country.retirementAccounts[3] || 'savings plan'}. It's about showing them that {country.currencySymbol}1 today is the seed for a forest tomorrow.
              </p>
            </section>
          </>
        );
      default:
        return (
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-blue-500" /> Regional Lesson: {selectedCountry}
            </h2>
            <p>Mastering the financial mechanics of {selectedCountry} is the foundation of your family's future wealth.</p>
            <p>In {country.cities[0]} and across the nation, institutions like {country.majorBanks[0]} and {country.taxAgency} set the rules. This lesson shows you how to play the game to win.</p>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* STICKY NAV */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto max-w-4xl px-4 flex justify-between items-center">
          <Link href="/financial-academy" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm">
            <Home className="h-4 w-4" /> Academy Hub
          </Link>
          
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Unit {currentUnit?.number}: {currentUnit?.title}</p>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${(currentLesson.number / (currentUnit?.lessons.length || 1)) * 100}%` }} />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-900 border-white/10 text-[10px] font-bold text-blue-400 uppercase tracking-widest h-8 px-3">
                <Globe className="mr-2 h-3 w-3" /> {selectedCountry} Edition
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white">
              <DropdownMenuLabel className="text-slate-400 text-[10px] uppercase">Select Region</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              {['Canada', 'USA', 'UK', 'Australia'].map(c => (
                <DropdownMenuItem 
                  key={c} 
                  onClick={() => handleCountryChange(c)}
                  className="cursor-pointer hover:bg-white/5"
                >
                  <span className={cn("text-xs font-bold", selectedCountry === c ? "text-blue-400" : "text-slate-300")}>{c}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <article className="container mx-auto max-w-3xl px-4 py-16 space-y-16">
        {/* HEADER */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-4 text-xs font-black uppercase text-slate-500 tracking-widest">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {currentLesson.readingTime}m Deep Dive</span>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {currentLesson.wordCount} Words</span>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-none">{currentLesson.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {currentLesson.title} <br /><span className="text-blue-500 italic">in {selectedCountry}</span>
          </h1>
          <p className="text-slate-400 text-lg italic max-w-2xl mx-auto">
            "Mastering {currentLesson.category.toLowerCase()} in {country.cities[0]} is the foundation of your financial sovereignty."
          </p>
        </header>

        {/* CONTENT SECTIONS */}
        <div className="prose prose-invert prose-blue max-w-none space-y-16 leading-relaxed text-slate-300 text-lg">
          
          {/* DYNAMIC CONTENT BASED ON CATEGORY & COUNTRY */}
          {renderCategoryContent()}

          {/* SHARED TAKEAWAYS */}
          <section className="p-8 bg-emerald-500/5 border border-emerald-500/30 rounded-3xl space-y-8">
            <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" /> Localized Takeaways: {selectedCountry}
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-1">Knowledge is Leverage</strong>
                  <span>Whether it's {country.majorBanks[0]} or {country.majorInsurers[0]}, these institutions rely on your lack of knowledge. By learning these {selectedCountry} mechanics, you flip the script.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-1">{country.taxAgency} Shielding</strong>
                  <span>Always utilize {country.retirementAccounts.slice(0, 2).join(' and ')} to shield your assets from {country.taxAgency} impact in cities like {country.cities[0]}.</span>
                </div>
              </li>
            </ul>
          </section>
        </div>

        {/* ACTIONS */}
        <div className="pt-12 border-t border-white/5 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={toggleComplete} 
              disabled={isMarking}
              className={cn(
                "w-full sm:w-auto px-12 py-8 text-xl font-black rounded-2xl transition-all shadow-xl",
                isCompleted 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {isMarking ? <Loader2 className="animate-spin" /> : isCompleted ? <><CheckCircle2 className="mr-2" /> Completed</> : "Mark as Complete"}
            </Button>
            
            {isCompleted && nextLesson && (
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-12 py-8 text-xl font-black border-slate-700 hover:bg-slate-800 rounded-2xl">
                <Link href={`/financial-academy/lesson/${nextLesson.slug}`}>Next Lesson <ArrowRight className="ml-2 h-6 w-6" /></Link>
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center px-4 py-8 bg-slate-900/50 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              {prevLesson && (
                <Link href={`/financial-academy/lesson/${prevLesson.slug}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Link>
              )}
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Academy Progress</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{completedLessons.length} / 36</span>
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(completedLessons.length / 36) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {nextLesson && (
                <Link href={`/financial-academy/lesson/${nextLesson.slug}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <section className="bg-slate-900 rounded-[48px] p-12 border border-blue-500/20 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent -z-10" />
          <h3 className="text-3xl font-black">Ready to Beat the Bank in {selectedCountry}?</h3>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">See how understanding these {selectedCountry} {currentLesson.category.toLowerCase()} mechanics can save you thousands in interest.</p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 font-black px-12 py-7 text-lg rounded-2xl shadow-2xl">
            <Link href="/questionnaire">Launch {selectedCountry} Savings Estimator</Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
