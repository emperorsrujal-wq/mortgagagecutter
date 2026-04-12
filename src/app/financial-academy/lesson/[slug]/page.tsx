
'use client';

import React, { use, useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { academyUnits, AcademyLessonMeta } from '@/lib/academy/curriculum';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Lightbulb,
  Info
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
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Loading Lesson...</div>;
  }

  if (!currentLesson) return <div className="p-20 text-center">Lesson not found.</div>;

  const isCompleted = completedLessons.includes(currentLesson.id);

  // MOCK CONTENT DATA (In production, this would come from Firestore /financialLessons collection)
  const currency = selectedCountry === 'UK' ? '£' : '$';
  const banks = {
    'Canada': 'RBC, TD, Scotiabank, BMO',
    'USA': 'JPMorgan Chase, Wells Fargo, BofA',
    'UK': 'HSBC, Barclays, Lloyds, NatWest',
    'Australia': 'CBA, Westpac, ANZ, NAB'
  }[selectedCountry];

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
          <Badge variant="outline" className="text-[10px] font-bold border-blue-500/30 text-blue-400">{selectedCountry} Edition</Badge>
        </div>
      </nav>

      <article className="container mx-auto max-w-3xl px-4 py-16 space-y-12">
        {/* HEADER */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-4 text-xs font-black uppercase text-slate-500 tracking-widest">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {currentLesson.readingTime}m Read</span>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {currentLesson.wordCount} Words</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {currentLesson.title} <br /><span className="text-blue-500">in {selectedCountry}</span>
          </h1>
        </header>

        {/* CONTENT SCAFFOLDING */}
        <div className="prose prose-invert prose-blue max-w-none space-y-10 leading-relaxed text-slate-300 text-lg">
          <div className="p-8 bg-blue-500/5 border-l-4 border-blue-500 rounded-r-2xl italic text-blue-100">
            <p className="font-medium">"Banks don't lend money; they create credit. When you understand this fundamental shift in {selectedCountry}, the entire financial system starts to look different."</p>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4">1. The {selectedCountry} Banking System</h2>
            <p>
              In {selectedCountry}, the banking sector is dominated by a few major players like {banks}. While these institutions present themselves as safe havens for your deposits, their primary function is to utilize your capital as a leverage point for their own profitability.
            </p>
            <p>
              When you deposit {currency}1,000 into a savings account, {selectedCountry} regulations allow the bank to maintain only a small percentage of that in reserves. The rest is lent out, often at rates significantly higher than the 1-2% interest they might pay you.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4">2. The Fractional Reserve Mechanism</h2>
            <p>
              This is the "engine" of modern finance. In {selectedCountry}, banks use fractional reserve banking to expand the money supply. This means for every dollar they hold, they can effectively generate ten dollars or more in loans.
            </p>
            <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-white"><Info className="h-4 w-4 text-blue-400" /> Did You Know?</h4>
              <p className="text-sm text-slate-400">
                In {selectedCountry}, when you take out a mortgage, the bank doesn't take existing physical cash from a vault. They create a new liability on their books, which becomes the deposit in the seller's account. They literally create the money for your home at the push of a button.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4">3. Why Your Savings is Melting</h2>
            <p>
              With inflation consistently targeting 2% or higher in {selectedCountry}, and standard savings accounts paying less than that after taxes, your purchasing power is actually shrinking every day your money sits in a traditional bank.
            </p>
            <p>
              This is why the Mortgage Cutter method focuses on using your cash flow to "choke" interest on debt rather than letting it sit idle. Reducing a 6% debt is mathematically equivalent to earning a guaranteed, tax-free 6% return on your money.
            </p>
          </section>

          <section className="p-8 bg-emerald-500/5 border border-emerald-500/30 rounded-3xl space-y-6">
            <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" /> Key Takeaways for {selectedCountry}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /></div>
                <span>Banks in {selectedCountry} use your deposits to leverage profitable lending products.</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /></div>
                <span>The real return on savings is often negative after accounting for {selectedCountry} inflation and taxes.</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /></div>
                <span>Mastering the "Bathtub Flow" allows you to beat the bank at their own interest game.</span>
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

        <section className="bg-slate-900 rounded-3xl p-8 border border-blue-500/20 text-center space-y-4">
          <h3 className="text-xl font-bold">Ready to analyze your own mortgage?</h3>
          <p className="text-slate-400 text-sm">See how these banking mechanics can save you {currency}30,000+ in interest.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 font-bold px-8">
            <Link href="/questionnaire">Go to Savings Estimator</Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
