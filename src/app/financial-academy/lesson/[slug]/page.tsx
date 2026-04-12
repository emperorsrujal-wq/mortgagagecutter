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
  Target,
  Globe,
  Zap,
  HandCoins,
  ShieldCheck,
  Building,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AcademyLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const [selectedCountry, setSelectedCountry] = useState<string>('Canada');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentUnit = academyUnits.find(u => u.lessons.some(l => l.slug === slug));
  const currentLesson = currentUnit?.lessons.find(l => l.slug === slug);
  const flatLessons = academyUnits.flatMap(u => u.lessons);
  const currentIndex = flatLessons.findIndex(l => l.slug === slug);
  const nextLesson = flatLessons[currentIndex + 1];
  const prevLesson = flatLessons[currentIndex - 1];

  useEffect(() => {
    const cachedCountry = localStorage.getItem('mc_academy_country');
    if (cachedCountry) setSelectedCountry(cachedCountry);

    async function loadProgress() {
      if (isUserLoading) return;
      if (user && firestore) {
        try {
          const docRef = doc(firestore, 'userFinancialProgress', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.selectedCountry) {
              setSelectedCountry(data.selectedCountry);
              localStorage.setItem('mc_academy_country', data.selectedCountry);
            }
            setCompletedLessons(data.completedLessons || []);
          }
        } catch (e) {
          console.error("Error fetching progress:", e);
        }
      }
      setIsLoading(false);
    }
    loadProgress();
  }, [user, firestore, isUserLoading]);

  const handleCountryChange = async (val: string) => {
    setSelectedCountry(val);
    localStorage.setItem('mc_academy_country', val);
    if (user && firestore) {
      await setDoc(doc(firestore, 'userFinancialProgress', user.uid), {
        id: user.uid,
        userId: user.uid,
        email: user.email,
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
      id: user.uid,
      userId: user.uid,
      email: user.email,
      completedLessons: newCompleted,
      lastAccessedAt: serverTimestamp(),
      currentLesson: currentLesson.number,
      currentUnit: currentUnit?.number,
    }, { merge: true });

    setCompletedLessons(newCompleted);
    setIsMarking(false);
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Assembling Regional Lesson...</p>
      </div>
    );
  }

  if (!currentLesson) return <div className="p-20 text-center text-white">Lesson not found.</div>;

  const isCompleted = completedLessons.includes(currentLesson.id);
  const country = countryContentMap[selectedCountry] || countryContentMap['Canada'];

  const renderDeepDive = () => {
    const sections = [
      {
        title: "01. The Local Reality",
        icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
        content: `In ${selectedCountry}, specifically within major hubs like ${country.cities[0]} and ${country.cities[1]}, the mechanics of ${currentLesson.category} are governed by the ${country.regulator}. Whether you are depositing funds at ${country.majorBanks[0]} or evaluating risk with ${country.majorInsurers[0]}, you are participating in a system designed for institutional stability first, and consumer growth second.`
      },
      {
        title: "02. Regional Mechanics",
        icon: <Landmark className="h-6 w-6 text-emerald-500" />,
        content: `Under the oversight of the ${country.centralBank}, the base rate (currently ${country.rates.prime} for prime lending) dictates the flow of capital. In the ${selectedCountry} market, this creates a ripple effect from your mortgage at ${country.majorBanks[1]} to the tax-advantaged accounts like ${country.retirementAccounts[0]} managed by ${country.taxAgency}. Understanding these levers is the first step to financial mastery.`
      },
      {
        title: "03. The Hidden Profit Engines",
        icon: <Zap className="h-6 w-6 text-amber-500" />,
        content: `Financial institutions in ${selectedCountry} thrive on information asymmetry. For every dollar you interact with—whether through ${country.stockExchanges[0]} or a simple savings account earning ${country.rates.savings}—there is a spread. The ${country.regulator} ensures compliance, but it is up to the individual to minimize the "leakage" of wealth to these institutional fees and interest traps.`
      },
      {
        title: "04. Strategic Pitfalls",
        icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
        content: `The largest risk in ${selectedCountry} isn't a market crash—it's the slow erosion of purchasing power. With a national debt of ${country.nationalDebt}, ${country.centralBank} must balance inflation against social programs like ${country.programs[0]}. If your assets are not shielded via ${country.retirementAccounts[1]} or other ${country.taxAgency} approved structures, you are effectively funding the national deficit with your retirement.`
      },
      {
        title: "05. The Actionable Blueprint",
        icon: <Target className="h-6 w-6 text-purple-500" />,
        content: `To win in the ${selectedCountry} economy, you must move from a consumer mindset to an owner mindset. This means utilizing the ${country.stockExchanges[0]} for growth and ${country.retirementAccounts.join('/')} for protection. Audit your current relationship with ${country.majorBanks[2]} and ensure your interest outflows are not subsidizing their record profits.`
      },
      {
        title: "06. Advanced Regional Tactics",
        icon: <Award className="h-6 w-6 text-yellow-500" />,
        content: `Mastering the ${selectedCountry} financial pillar foundation requires constant vigilance of the ${country.centralBank} policy shifts. By teaching your family about the localized mechanics of ${country.currencyCode} and the protections offered by ${country.protection}, you build a generational legacy that institutions cannot easily dismantle.`
      }
    ];

    return (
      <div className="space-y-16">
        {sections.map((s, i) => (
          <section key={i} className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4 flex items-center gap-3">
              {s.icon} {s.title}
            </h2>
            <p className="leading-relaxed text-slate-300 text-xl font-medium">{s.content}</p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Detailed analysis for the {selectedCountry} edition of "{currentLesson.title}" continues. 
              As a student of the Academy, you must recognize that ${country.majorBanks[0]} and ${country.taxAgency} 
              operate on rules that you can either follow blindly or master strategically. 
              The goal of this Unit {currentUnit?.number} deep dive is to give you the data points needed to 
              negotiate better terms and optimize your cash flow within the {country.currencyCode} environment.
            </p>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
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
            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white min-w-[120px]">
              {['Canada', 'USA', 'UK', 'Australia'].map(c => (
                <DropdownMenuItem key={c} onClick={() => handleCountryChange(c)} className="cursor-pointer hover:bg-white/5 py-2 px-4 focus:bg-white/10">
                  <span className={cn("text-xs font-bold", selectedCountry === c ? "text-blue-400" : "text-slate-300")}>{c}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <article className="container mx-auto max-w-3xl px-4 py-16 space-y-16">
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-4 text-xs font-black uppercase text-slate-500 tracking-widest">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {currentLesson.readingTime}m Deep Dive</span>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {currentLesson.wordCount} Words</span>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-none">{currentLesson.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {currentLesson.title} <br /><span className="text-blue-500 italic">in {selectedCountry}</span>
          </h1>
        </header>

        <div className="prose prose-invert prose-blue max-w-none leading-relaxed">
          {renderDeepDive()}
          
          <section className="p-8 mt-16 bg-emerald-500/5 border border-emerald-500/30 rounded-3xl space-y-8">
            <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" /> Localized Takeaways: {selectedCountry}
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-1">Institutional Awareness</strong>
                  <span className="text-slate-300">In {selectedCountry}, the {country.regulator} dictates the framework, but entities like {country.majorBanks[0]} optimize for their shareholders. Always audit your relationship with {country.majorBanks[1]}.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-1">Tax-Advantaged Growth</strong>
                  <span className="text-slate-300">Maximize your utilization of {country.retirementAccounts.join(' and ')} to minimize the impact of {country.taxAgency} on your net worth.</span>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <div className="pt-12 border-t border-white/5 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={toggleComplete} 
              disabled={isMarking}
              className={cn(
                "w-full sm:w-auto px-12 py-8 text-xl font-black rounded-2xl transition-all shadow-xl",
                isCompleted ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
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
          
          <div className="text-center">
             <Button asChild variant="link" className="text-blue-400 font-bold">
                <Link href="/questionnaire">Ready to Optimize Your Mortgage? →</Link>
             </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
