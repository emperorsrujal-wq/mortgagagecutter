
'use client';

import React, { use, useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { academyUnits } from '@/lib/academy/curriculum';
import { countryContentMap, CountrySpecificInfo } from '@/lib/academy/content-data';
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
  ShieldCheck,
  TrendingUp,
  Landmark
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AcademyLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [selectedCountry, setSelectedCountry] = useState('Canada');
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
      }
      setIsLoading(false);
    }
    if (!isUserLoading) loadUser();
  }, [user, firestore, isUserLoading]);

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

  if (isUserLoading || isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Loading Localized Lesson...</div>;
  }

  if (!currentLesson) return <div className="p-20 text-center">Lesson not found.</div>;

  const isCompleted = completedLessons.includes(currentLesson.id);
  const country = countryContentMap[selectedCountry] || countryContentMap['Canada'];

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
          <Badge variant="outline" className="text-[10px] font-bold border-blue-500/30 text-blue-400 uppercase tracking-widest">{selectedCountry} Edition</Badge>
        </div>
      </nav>

      <article className="container mx-auto max-w-3xl px-4 py-16 space-y-16">
        {/* HEADER */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-4 text-xs font-black uppercase text-slate-500 tracking-widest">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {currentLesson.readingTime}m Deep Dive</span>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {currentLesson.wordCount} Words</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {currentLesson.title} <br /><span className="text-blue-500">in {selectedCountry}</span>
          </h1>
          <p className="text-slate-400 text-lg italic max-w-2xl mx-auto">
            "When you understand how {country.centralBank} influences your daily spending in {country.cities[0]}, your relationship with money changes forever."
          </p>
        </header>

        {/* CONTENT SECTIONS */}
        <div className="prose prose-invert prose-blue max-w-none space-y-16 leading-relaxed text-slate-300 text-lg">
          
          {/* 1. THE OPENING HOOK */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-blue-500" /> The {selectedCountry} Reality
            </h2>
            <p>
              Imagine walking into {country.majorBanks[0]} or {country.majorBanks[1]} in the heart of {country.cities[0]}. You deposit {country.currencySymbol}5,000 into your {country.retirementAccounts[0]} or a standard savings account. In your mind, that money is sitting safely in a vault, waiting for you. 
            </p>
            <p>
              The reality in {selectedCountry} is starkly different. Under the oversight of {country.regulator}, the banking system operates on a fractional reserve mechanism. Your {country.currencySymbol}5,000 isn't static; it's the raw material for {country.majorBanks[0]} to lend out ten times that amount in mortgages and personal loans at {country.rates.mortgage} APR.
            </p>
          </section>

          {/* 2. THE MECHANISM (Section 1-2) */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
              <Landmark className="h-6 w-6 text-blue-500" /> The Fractional Engine
            </h2>
            <p>
              In {selectedCountry}, {country.centralBank} sets the base rate (currently {country.rates.prime} for prime lending). This "Cost of Money" dictates everything from your mortgage at {country.majorBanks[2]} to the interest you earn on savings. 
            </p>
            <div className="bg-slate-900 p-8 rounded-3xl border border-white/5 space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-white uppercase tracking-widest text-xs text-blue-400"><Info className="h-4 w-4" /> Regional Insight: {selectedCountry}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                When you take a loan in {country.cities[1]} or {country.cities[2]}, the bank doesn't "lend" you other people's money. They create a new liability. This expansion of the money supply is why inflation in {selectedCountry} is so difficult to control—there is more digital "credit" than physical value.
              </p>
            </div>
          </section>

          {/* 3. THE PROFIT MODELS (Section 3-4) */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-blue-500" /> Protection & Risks
            </h2>
            <p>
              Your deposits are protected by {country.protection} up to specific limits, but this protection only covers the "nominal" value of your money. It does not protect you from the hidden tax of inflation. 
            </p>
            <p>
              If {country.majorBanks[3]} pays you {country.rates.savings} while {country.taxAgency} taxes your interest gains, your "Real Rate of Return" in {selectedCountry} is likely negative. You are effectively paying the bank to hold your capital.
            </p>
          </section>

          {/* 4. KEY TAKEAWAYS */}
          <section className="p-8 bg-emerald-500/5 border border-emerald-500/30 rounded-3xl space-y-8">
            <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" /> Localized Takeaways: {selectedCountry}
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-1">The Spread Trap</strong>
                  <span>Banks in {selectedCountry} earn the "Spread" between your {country.rates.savings} deposit and their {country.rates.mortgage} lending.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-1">{country.taxAgency} Implications</strong>
                  <span>Understand that interest earned is often fully taxable, further reducing your purchasing power in cities like {country.cities[3]}.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-1">Program Leverage</strong>
                  <span>Utilize {country.retirementAccounts.join(' and ')} to shield your assets from the traditional banking drain.</span>
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
          <p className="text-slate-400 text-lg max-w-xl mx-auto">See how understanding these {selectedCountry} mechanics can save you {country.currencySymbol}30,000+ in interest using our advanced tools.</p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 font-black px-12 py-7 text-lg rounded-2xl shadow-2xl">
            <Link href="/questionnaire">Launch {selectedCountry} Savings Estimator</Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
