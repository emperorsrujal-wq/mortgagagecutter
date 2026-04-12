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
  TrendingUp,
  Landmark,
  ShieldAlert,
  Zap,
  Target,
  Globe,
  Award,
  BookOpen,
  Scale,
  ShieldCheck,
  Building2,
  Coins
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

  const renderBankingDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Illusion of the Vault",
        icon: <Landmark className="h-6 w-6 text-blue-500" />,
        content: `When you walk into a branch of ${country.majorBanks[0]} in ${country.cities[0]}, the atmosphere is designed to scream 'Security.' The polished marble and heavy doors suggest your ${country.currencyCode} is sitting in a physical vault, safely locked away. This is the first great illusion of modern finance. In reality, thanks to the rules set by the ${country.regulator}, your bank is a 'pass-through' entity. Your deposit is not a box of cash with your name on it; it is a legally binding unsecured loan you have granted to the bank at an interest rate that barely covers the cost of the paper it's printed on.`
      },
      {
        title: "02. The Fractional Reserve Machine",
        icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
        content: `Under the oversight of the ${country.centralBank}, the system in ${selectedCountry} operates on 'Fractional Reserve' mechanics. For every ${country.currencySymbol}1,000 you deposit, the bank is only required to keep a tiny fraction in reserve. They lend out the remaining 90% or more to other consumers for mortgages and car loans. But here is the secret: those loans become new deposits at ${country.majorBanks[1]} or ${country.majorBanks[2]}, which are then lent out again. Through this cycle, banks literally 'create' money out of thin air, all while charging compound interest on every cent of it.`
      },
      {
        title: "03. The Spread: Your Effort, Their Profit",
        icon: <Zap className="h-6 w-6 text-amber-500" />,
        content: `The primary profit engine for banks in ${selectedCountry} is the 'Spread.' They pay you ${country.rates.savings} on your savings while charging you ${country.rates.mortgage} on your debt. This difference—the spread—is what funds the massive skyscrapers owned by ${country.majorBanks[0]}. They are effectively arbitrageurs of your life's work. They take your 'idle' capital, pay you almost nothing for the privilege of holding it, and then sell it back to your community at a massive premium. To win the financial game, you must learn how to minimize this spread in your own household.`
      },
      {
        title: "04. Strategic Pitfalls & Inflation Erosion",
        icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
        content: `The biggest risk in the ${selectedCountry} banking system isn't a bank run—it's the slow, silent erosion of your purchasing power. While your balance at ${country.majorBanks[1]} might look stable, the ${country.centralBank} is constantly balancing the national debt of ${country.nationalDebt} by managing inflation. If the inflation rate is higher than your savings rate, you are effectively paying the bank to lose money every single day. In hubs like ${country.cities[1]} and ${country.cities[2]}, keeping large sums in a 'safe' savings account is a guaranteed way to lose wealth relative to the cost of living.`
      },
      {
        title: "05. The Strategic Action Plan",
        icon: <Target className="h-6 w-6 text-purple-500" />,
        content: `To break free from being a 'consumer' of banking and become a 'strategist,' you must audit your relationship with ${country.majorBanks[0]}. Start by questioning why your money is siloed in accounts that benefit the bank's balance sheet more than yours. In ${selectedCountry}, using tax-advantaged tools like ${country.retirementAccounts[0]} and ${country.retirementAccounts[1]} is non-negotiable. You must shift your mindset from 'saving' to 'velocity'—ensuring your money hits your debt immediately to neutralize the interest calculations regulated by the ${country.regulator}.`
      },
      {
        title: "06. Advanced Regional Mastery",
        icon: <Award className="h-6 w-6 text-yellow-500" />,
        content: `True mastery of the ${selectedCountry} financial pillar foundation requires understanding the specific protections like ${country.protection}. By teaching your family how ${country.currencyCode} actually functions within the ${country.regulator} framework, you build a generational shield against institutional greed. This Academy unit is your 'Owner's Manual' to a system designed to be opaque. Once you see the machine for what it is, you can never go back to being an average depositor at ${country.majorBanks[0]}.`
      }
    ];

    return (
      <div className="space-y-20">
        {sections.map((s, i) => (
          <section key={i} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <div className="p-3 bg-slate-900 rounded-2xl border border-white/10 shadow-inner">
                {s.icon}
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {s.title}
              </h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-slate-300 text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-blue-500 first-letter:mr-3 first-letter:float-left">
                {s.content}
              </p>
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-blue-500/30 pl-6">
                As a student of the Academy in ${selectedCountry}, you must recognize that your interactions with ${country.majorBanks[0]} and the ${country.taxAgency} are part of a larger economic game. The rules are often buried in fine print, but they are predictable. In Unit ${currentUnit?.number}, we provide the data points needed to negotiate better terms and optimize your cash flow velocity within the ${country.currencyCode} environment.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderDefaultDeepDive = (country: CountrySpecificInfo) => {
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

  const renderDeepDive = () => {
    const isBanking = currentLesson.category.toLowerCase() === 'banking';
    if (isBanking) return renderBankingDeepDive(country);
    return renderDefaultDeepDive(country);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
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
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-none px-3 py-1">{currentLesson.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight">
            {currentLesson.title} <br /><span className="text-blue-500 italic">in {selectedCountry}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-xl mx-auto font-medium italic">
            "The system is designed to reward those who understand its mechanics and penalize those who don't."
          </p>
        </header>

        <div className="prose prose-invert prose-blue max-w-none leading-relaxed">
          {renderDeepDive()}
          
          <section className="p-10 mt-20 bg-slate-900/50 border border-emerald-500/20 rounded-[40px] space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <CheckCircle className="h-32 w-32 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-3">
              <CheckCircle className="h-6 w-6" /> Localized Strategy: {selectedCountry}
            </h3>
            <ul className="space-y-8 relative z-10">
              <li className="flex gap-6 items-start">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-2 text-xl">Institutional Awareness</strong>
                  <span className="text-slate-300 text-lg leading-relaxed">In {selectedCountry}, the ${country.regulator} provides the framework, but entities like ${country.majorBanks[0]} and ${country.majorBanks[1]} are primarily accountable to their shareholders. Every transaction you make is part of their profit model. Audit your current relationship and ensure your capital velocity is optimized for your benefit, not theirs.</span>
                </div>
              </li>
              <li className="flex gap-6 items-start">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-2 text-xl">Tax-Advantaged Growth</strong>
                  <span className="text-slate-300 text-lg leading-relaxed">Your highest ROI often comes from minimizing what you lose to the ${country.taxAgency}. Maximize your utilization of ${country.retirementAccounts.join(' and ')} within the ${country.currencyCode} environment. These are not just savings accounts; they are strategic bunkers for your generational wealth.</span>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <div className="pt-16 border-t border-white/5 space-y-12">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              onClick={toggleComplete} 
              disabled={isMarking}
              className={cn(
                "w-full sm:w-auto px-12 py-10 text-2xl font-black rounded-[24px] transition-all shadow-2xl active:scale-95",
                isCompleted ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isMarking ? <Loader2 className="animate-spin h-8 w-8" /> : isCompleted ? <><CheckCircle2 className="mr-3 h-8 w-8" /> Completed</> : "Mark as Complete"}
            </Button>
            {isCompleted && nextLesson && (
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-12 py-10 text-2xl font-black border-white/10 hover:bg-white/5 rounded-[24px] shadow-2xl transition-all">
                <Link href={`/financial-academy/lesson/${nextLesson.slug}`}>Next Lesson <ArrowRight className="ml-3 h-8 w-8" /></Link>
              </Button>
            )}
          </div>
          
          <div className="text-center">
             <Button asChild variant="link" className="text-blue-400 font-black text-lg hover:text-blue-300">
                <Link href="/questionnaire">Ready to Optimize Your Mortgage? <ArrowRight className="ml-2 h-5 w-5" /></Link>
             </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
