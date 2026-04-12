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
  Coins,
  Umbrella,
  Activity,
  HeartPulse,
  Flame,
  LineChart,
  BarChart3,
  Waves
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
                As a student of the Academy in {selectedCountry}, you must recognize that your interactions with {country.majorBanks[0]} and the {country.taxAgency} are part of a larger economic game. The rules are often buried in fine print, but they are predictable. In Unit {currentUnit?.number}, we provide the data points needed to negotiate better terms and optimize your cash flow velocity within the {country.currencyCode} environment.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderInsuranceDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Architecture of Certainty",
        icon: <Umbrella className="h-6 w-6 text-blue-400" />,
        content: `In the ${selectedCountry} market, insurance is often sold as a safety net, but it is more accurately described as the 'Architecture of Certainty.' When you pay a premium to an entity like ${country.majorInsurers[0]}, you are not just buying a piece of paper; you are legally transferring the financial consequence of a catastrophic event to a larger balance sheet. This 'Transfer of Risk' is the cornerstone of generational wealth. Without it, one medical emergency or property disaster in ${country.cities[0]} can wipe out decades of disciplined savings.`
      },
      {
        title: "02. The Actuarial Machine",
        icon: <Activity className="h-6 w-6 text-emerald-400" />,
        content: `Under the gaze of the ${country.insuranceRegulator}, major players like ${country.majorInsurers[1]} and ${country.majorInsurers[2]} operate the 'Actuarial Machine.' This is a massive mathematical engine that uses the 'Law of Large Numbers' to predict the future. They know, with terrifying accuracy, how many houses will burn and how many people will fall ill this year in ${selectedCountry}. They don't bet on individuals; they bet on the collective. By understanding that your premium is a calculated bet where the house (the insurer) always has the edge, you can begin to choose policies that cover true catastrophes rather than minor inconveniences.`
      },
      {
        title: "03. Premiums vs. Protection: The True Spread",
        icon: <Scale className="h-6 w-6 text-amber-400" />,
        content: `Just as banks profit from interest spreads, ${country.majorInsurers[0]} profits from the gap between the premiums collected and the claims paid. In ${selectedCountry}, this 'Underwriting Profit' is supplemented by 'Investment Float.' Between the time you pay ${country.majorInsurers[1]} and the time they pay out a claim, they are investing your ${country.currencyCode} in the ${country.stockExchanges[0]}. They are effectively using your fear to fund their investment growth. To win, you must learn to self-insure for small risks and only use institutional insurance for 'Legacy-Ending' events.`
      },
      {
        title: "04. Strategic Pitfalls & Complexity as a Feature",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `The greatest risk in the ${selectedCountry} insurance landscape is the 'Policy Illusion.' Many homeowners in ${country.cities[1]} believe they are fully covered, only to discover 'exclusions' buried deep in the fine print during a crisis. In ${selectedCountry}, complexity is a feature of the product, not a bug. It allows ${country.majorInsurers[2]} to deny claims based on technicalities. You must move beyond the 'set it and forget it' mindset and perform a 'Stress Test' on your policies to ensure they actually function when the pressure is applied.`
      },
      {
        title: "05. The Strategic Insurance Audit",
        icon: <ShieldCheck className="h-6 w-6 text-purple-400" />,
        content: `To optimize your financial fortress in ${selectedCountry}, you must audit your relationship with ${country.majorInsurers[0]}. Start by questioning why you are paying for low-deductible policies that encourage 'premium leakage.' In ${selectedCountry}, your highest ROI comes from increasing your deductibles to the maximum you can safely handle and redirecting that saved premium into your ${country.retirementAccounts[0]} or debt reduction. This shifts the Actuarial Machine's math in your favor, keeping more ${country.currencyCode} on your balance sheet and less on theirs.`
      },
      {
        title: "06. Advanced Regional Sovereignty",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `Mastering the ${selectedCountry} risk landscape requires an understanding of the ${country.insuranceRegulator} framework. These rules are designed to ensure ${country.majorInsurers[1]} remains solvent, not to ensure you get the best deal. By teaching your family that insurance is a strategic tool rather than a monthly bill, you build a culture of financial sovereignty. Once you master the architecture of risk in ${selectedCountry}, you stop being a victim of uncertainty and start being the architect of your own financial legacy.`
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
              <p className="leading-relaxed text-slate-300 text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-emerald-400 first-letter:mr-3 first-letter:float-left">
                {s.content}
              </p>
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-emerald-500/30 pl-6">
                As a student of the Academy in {selectedCountry}, you must recognize that your contracts with {country.majorInsurers[0]} are among the most important legal documents you own. In Unit {currentUnit?.number}, we provide the strategy needed to negotiate better coverage and minimize premium drain within the {country.currencyCode} environment.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderEconomicsDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Pulse of the Machine",
        icon: <LineChart className="h-6 w-6 text-blue-400" />,
        content: `In the ${selectedCountry} economy, 'The Pulse' is the silent rhythm of capital flow. Whether you are in ${country.cities[0]} or ${country.cities[1]}, you are living inside a giant mathematical machine governed by the laws of Supply, Demand, and Credit. Most people see the economy as a series of random events—inflation spikes, stock market dips, or price increases at the grocery store. In reality, it is a highly predictable cycle driven by human psychology and the policy levers pulled by the ${country.centralBank}.`
      },
      {
        title: "02. The Hand on the Lever",
        icon: <Landmark className="h-6 w-6 text-emerald-400" />,
        content: `The single most powerful force in ${selectedCountry} is the ${country.centralBank}. By adjusting the base interest rate (currently ${country.rates.prime} for prime lending), they control the cost of money itself. When they lower the lever, credit flows easily, businesses in ${country.cities[2]} expand, and your mortgage at ${country.majorBanks[0]} becomes cheaper. When they pull the lever back, they are intentionally cooling the engine to fight inflation. Understanding this lever is the difference between being a victim of the cycle and being a strategist who predicts it.`
      },
      {
        title: "03. The Inflationary Siphon",
        icon: <Waves className="h-6 w-6 text-amber-400" />,
        content: `Inflation is not just 'rising prices'; it is the slow, invisible devaluation of your life's work. As the ${country.centralBank} manages the national debt of ${country.nationalDebt}, the ${country.currencyCode} in your pocket loses purchasing power every day it sits idle. In the ${selectedCountry} market, if your wealth is not growing faster than the rate of inflation, you are effectively paying a 'silent tax' to the system. To survive, you must move your capital from 'depreciating buckets' (like cash) into 'productive assets' that the machine cannot easily siphon.`
      },
      {
        title: "04. Recession & the Credit Cycle",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `Recessions in ${selectedCountry} are the machine's way of clearing out 'inefficient' debt. During these periods, liquidity dries up at ${country.majorBanks[1]} and fear becomes the dominant emotion in hubs like ${country.cities[0]}. But for the educated student of the Academy, a recession is not a disaster—it is a 'transfer event.' It is when assets move from the hands of the over-leveraged into the hands of the liquid. By maintaining a 'Debt-Free' fortress using our methods, you position yourself to be the buyer when everyone else is forced to be a seller.`
      },
      {
        title: "05. The Actionable Economic Blueprint",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `To master the ${selectedCountry} economy, you must audit your relationship with the machine. Start by recognizing that your paycheck is a form of energy that the ${country.taxAgency} and ${country.majorBanks[0]} are constantly trying to capture. You must utilize regional shields like ${country.retirementAccounts[0]} and ${country.retirementAccounts[1]} to protect your growth. Shift your focus from 'saving' to 'velocity'—the speed at which your money works to reduce your liabilities and acquire ownership in the ${country.stockExchanges[0]}.`
      },
      {
        title: "06. Advanced Economic Sovereignty",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `True sovereignty in ${selectedCountry} comes from understanding that the ${country.centralBank} and the ${country.regulator} prioritize institutional stability over your personal wealth. By teaching your family the mechanics of ${country.currencyCode} and the true nature of the ${country.nationalDebt}, you build a generational shield. Once you see the machine's pulse, you stop reacting to the news and start positioning your family for the inevitable shifts in the cycle. This Unit ${currentUnit?.number} is your declaration of independence from a system designed to be misunderstood.`
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
              <p className="leading-relaxed text-slate-300 text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-blue-400 first-letter:mr-3 first-letter:float-left">
                {s.content}
              </p>
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-blue-500/30 pl-6">
                As a student of the Academy in {selectedCountry}, you must recognize that the {country.centralBank} and the {country.taxAgency} are part of a larger economic game. The rules are predictable for those who watch the data. In Unit {currentUnit?.number}, we provide the blueprint needed to optimize your position within the {country.currencyCode} environment.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderGovernmentDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Social Contract",
        icon: <Landmark className="h-6 w-6 text-blue-400" />,
        content: `In the ${selectedCountry} context, the government is not just a regulatory body; it is the architect of the environment in which your money lives. From the streets of ${country.cities[0]} to the policy halls of the capital, the government operates on a 'Social Contract.' You contribute a portion of your energy (tax) in exchange for infrastructure, security, and a framework of law. Most people see the ${country.taxAgency} as a burden, but the strategist sees it as a business partner—one that has established the rules of the game you are forced to play.`
      },
      {
        title: "02. The National Ledger",
        icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
        content: `Every year, your government releases a Budget—a massive declaration of priorities. In ${selectedCountry}, this ledger balances the competing needs of healthcare, defense, and social programs like ${country.programs[0]}. When you see the national debt of ${country.nationalDebt}, you are seeing the 'Overdraft' of the nation. This debt is serviced by the future production of its citizens. By understanding the ledger of ${selectedCountry}, you can predict where taxes might rise and where incentives might be placed to encourage specific economic behaviors.`
      },
      {
        title: "03. The Revenue Engine: Taxation",
        icon: <Zap className="h-6 w-6 text-amber-400" />,
        content: `The primary fuel for the government machine is the ${country.taxAgency}. In ${selectedCountry}, taxation is not a flat fee; it is a progressive system designed to capture more 'energy' as you become more successful. From income tax to consumption taxes, the engine is relentless. However, the ${country.taxAgency} also provides 'Safety Valves'—legal ways to keep more of your money. Utilizing ${country.retirementAccounts[0]} and ${country.retirementAccounts[1]} is your way of legally opting out of a portion of this capture, allowing your wealth to compound inside a government-approved shield.`
      },
      {
        title: "04. The Deficit Dilemma",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `When the government of ${selectedCountry} spends more than it collects, it creates a deficit. To bridge this gap, they issue bonds—legally promising to pay back lenders with future tax revenue. With a national debt of ${country.nationalDebt}, ${selectedCountry} is in a constant state of debt service. This creates a hidden pressure on the ${country.centralBank} to keep interest rates in a specific range to ensure the nation doesn't default. As a citizen, you must realize that your personal savings are the collateral for this national debt.`
      },
      {
        title: "05. Benefits, Burdens & The Net Result",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `While the government captures revenue, it also redistributes it through programs like ${country.programs.join(' and ')}. In hubs like ${country.cities[1]} and ${country.cities[2]}, these benefits form the baseline of social stability. To win, you must calculate your 'Net Relationship' with the state. Are you a net contributor or a net beneficiary? The goal of this Unit ${currentUnit?.number} is to help you move from being a passive taxpayer to a proactive citizen who utilizes every available grant, credit, and shield provided by the ${country.taxAgency} framework.`
      },
      {
        title: "06. Strategic Citizenship",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `True mastery of the ${selectedCountry} financial landscape requires 'Strategic Citizenship.' This means understanding the ${country.regulator} rules and the ${country.taxAgency} codes as if they were the manual to a high-performance machine. By teaching your family that the government is an entity with its own balance sheet and motivations, you build a generational shield. Once you see how ${country.currencyCode} flows through the halls of power, you stop being a victim of policy and start being a strategist who positions themselves for the next legislative shift.`
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
              <p className="leading-relaxed text-slate-300 text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-purple-400 first-letter:mr-3 first-letter:float-left">
                {s.content}
              </p>
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-purple-500/30 pl-6">
                In {selectedCountry}, your interaction with the {country.taxAgency} is the most consistent financial relationship you will ever have. It lasts from your first job to your final inheritance. By mastering the rules of Unit {currentUnit?.number}, you ensure that this partnership is as efficient as possible, keeping more {country.currencyCode} on your family's balance sheet.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderDebtDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Debt Paradigm",
        icon: <Flame className="h-6 w-6 text-red-500" />,
        content: `In the ${selectedCountry} economy, debt is often sold as 'Opportunity,' but it is more accurately described as 'Future Work Already Spent.' When you sign a credit agreement with an entity like ${country.majorBanks[0]}, you are legally granting them a lien on your future energy. From the high-rises of ${country.cities[0]} to the suburbs of ${country.cities[1]}, consumer debt is the 'Gravity' that pulls wealth away from families and towards institutional balance sheets. To win, you must stop seeing debt as a tool for lifestyle and start seeing it as a calculation of interest-velocity.`
      },
      {
        title: "02. The Compound Interest Trap",
        icon: <Activity className="h-6 w-6 text-orange-500" />,
        content: `Under the gaze of the ${country.regulator}, lenders in ${selectedCountry} utilize the 'Power of Compounding' against you. On a credit card or high-interest loan from ${country.majorBanks[1]}, interest is not just charged on the principal; it is charged on the interest from the previous month. This creates a 'Death Spiral' where the balance grows faster than your ability to repay it. In ${selectedCountry}, the average household carries debt that costs them ${country.rates.mortgage} or more in interest—a silent siphon that destroys the ability to save for retirement.`
      },
      {
        title: "03. Good Debt vs. Bad Debt: The Spread",
        icon: <Scale className="h-6 w-6 text-amber-500" />,
        content: `Not all debt is created equal in ${selectedCountry}. 'Bad Debt' is used to buy depreciating assets (like cars or gadgets) at high interest rates. 'Good Debt'—which we focus on in Unit ${currentUnit?.number}—is debt that is structured to be 'Low-Velocity' or 'Tax-Efficient.' By understanding the 'Spread' between what you pay in interest and what you earn in growth, you can begin to use institutional money to your advantage. The goal is to move your capital from high-interest captures into low-interest, strategic vehicles regulated by the ${country.regulator}.`
      },
      {
        title: "04. Strategic Pitfalls & Credit Scores",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `The greatest risk in the ${selectedCountry} debt landscape is the 'Minimum Payment Illusion.' Lenders like ${country.majorBanks[2]} calculate a minimum payment that barely covers the interest, ensuring you stay in debt for decades. Additionally, your 'Credit Score' is simply a measure of how good you are at being a profitable customer for the bank. In ${selectedCountry}, you must move beyond the 'Score' and focus on the 'Balance.' Complexity is used to hide the true cost of borrowing; your job is to strip away the jargon and look at the raw numbers.`
      },
      {
        title: "05. The Debt Liquidation Audit",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `To build a fortress in ${selectedCountry}, you must perform a 'Debt Audit.' List every liability you have, from your mortgage at ${country.majorBanks[0]} to your smallest credit line. In ${selectedCountry}, your highest ROI comes from 'Choking' high-interest debt first. This isn't just about 'Paying Off'; it's about 'Neutralizing.' Shift your focus to 'Debt Velocity'—the speed at which you can reduce your total liability and redirect that saved interest into your ${country.retirementAccounts[0]} or other productive assets.`
      },
      {
        title: "06. Advanced Debt Sovereignty",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `Mastering the ${selectedCountry} debt landscape requires an understanding of the 'Lien Hierarchy.' By teaching your family that debt is a strategic tool rather than a way of life, you build a culture of financial sovereignty. Once you master the mechanics of debt in ${selectedCountry}, you stop being a servant to interest and start being the architect of your own balance sheet. Once the gravity of debt is removed, your wealth can finally take flight in the ${country.stockExchanges[0]} and beyond.`
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
              <p className="leading-relaxed text-slate-300 text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-red-500 first-letter:mr-3 first-letter:float-left">
                {s.content}
              </p>
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-red-500/30 pl-6">
                In {selectedCountry}, debt is the most common financial trap. It is designed to be invisible and easy to acquire. By mastering the strategies of Unit {currentUnit?.number}, you stop being the 'Fuel' for the bank's profit machine and start being the owner of your own time.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderInvestingDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Ownership Mindset",
        icon: <TrendingUp className="h-6 w-6 text-blue-400" />,
        content: `In the ${selectedCountry} wealth ladder, there is a fundamental divide: there are those who work for money, and those who own the machines that produce it. Investing is the act of transition from laborer to owner. Whether you are buying shares on the ${country.stockExchanges[0]} or acquiring property in ${country.cities[0]}, you are moving your ${country.currencyCode} from a 'spending' bucket into an 'ownership' bucket. Most people fear the market because they see it as gambling; in reality, it is the only way to participate in the growth of the global economy.`
      },
      {
        title: "02. The Market Machine",
        icon: <BarChart3 className="h-6 w-6 text-emerald-400" />,
        content: `The ${country.stockExchanges[0]} is not just a screen with flickering numbers; it is a marketplace for human ingenuity. In ${selectedCountry}, thousands of companies compete daily to provide value to consumers. When you invest, you are betting on the collective productivity of your nation. Under the oversight of the ${country.regulator}, this machine operates on cycles of fear and greed. To win, you must learn to ignore the 'noise' of ${country.cities[1]} news cycles and focus on the 'signal' of long-term value creation and compounding interest.`
      },
      {
        title: "03. The Tax-Advantaged Shield",
        icon: <ShieldCheck className="h-6 w-6 text-amber-400" />,
        content: `The single greatest multiplier of investment returns in ${selectedCountry} is the tax shield. The ${country.taxAgency} has created specific 'Bunkers' to encourage long-term growth. Utilizing tools like ${country.retirementAccounts[0]} and ${country.retirementAccounts[1]} allows your ${country.currencyCode} to grow without the 'drag' of annual taxation. This creates an exponential effect where money that would have gone to the government instead works for you. In ${selectedCountry}, failing to maximize these shields is the equivalent of a silent 20-30% penalty on your future wealth.`
      },
      {
        title: "04. Risk, Diversification & The Spread",
        icon: <Activity className="h-6 w-6 text-red-400" />,
        content: `The greatest risk in the ${selectedCountry} market isn't a crash—it's a lack of diversification. In hubs like ${country.cities[2]}, many investors over-allocate to a single sector or company. You must understand that risk is the price you pay for returns. By utilizing 'Index' strategies that capture the entire ${country.stockExchanges[0]}, you minimize 'Unsystematic Risk' and ensure you capture the average growth of the machine. Remember: the ${country.majorBanks[0]} wants to sell you high-fee products that eat your returns; your goal is to minimize their spread and maximize your own.`
      },
      {
        title: "05. The Strategic Portfolio Audit",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `To optimize your fortress in ${selectedCountry}, you must audit your relationship with your 'Assets.' Are they productive or are they just sitting idle? Start by questioning the fees you pay to ${country.majorBanks[1]} or ${country.majorBanks[2]}. In ${selectedCountry}, even a 1% management fee can cost you hundreds of thousands over a lifetime. Shift your focus to 'Low-Cost, High-Velocity' vehicles that align with the ${country.regulator} standards while keeping the majority of the growth on your balance sheet.`
      },
      {
        title: "06. Advanced Generative Wealth",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `True sovereignty in ${selectedCountry} comes from building a 'Generative Machine' that pays for your life without requiring your presence. By teaching your family the mechanics of the ${country.stockExchanges[0]} and the protections of the ${country.taxAgency}, you create a legacy of financial literacy. Once you master the architecture of ownership in ${selectedCountry}, you stop being a consumer of the economy and start being its architect. This Unit ${currentUnit?.number} is your blueprint for moving from 'Saving' to 'Owning'.`
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
              <p className="leading-relaxed text-slate-300 text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-emerald-400 first-letter:mr-3 first-letter:float-left">
                {s.content}
              </p>
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-emerald-500/30 pl-6">
                As a student of the Academy in {selectedCountry}, you must recognize that your investment portfolio is your most powerful tool for independence. In Unit {currentUnit?.number}, we provide the data points needed to negotiate lower fees and optimize your tax strategy within the {country.currencyCode} environment.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderFamilyDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Energy of Value",
        icon: <HeartPulse className="h-6 w-6 text-pink-400" />,
        content: `Teaching the next generation about ${country.currencyCode} starts by explaining that money is not just paper or numbers on a screen—it is 'Stored Energy.' Whether you are in ${country.cities[0]} or a small town, every dollar earned represents a piece of your time and effort. By helping your children understand that spending is 'Releasing Energy' and saving is 'Storing Energy,' you build a foundation of respect for the work required to build a legacy in ${selectedCountry}.`
      },
      {
        title: "02. The Spend, Save, Give Machine",
        icon: <Waves className="h-6 w-6 text-blue-400" />,
        content: `A family financial fortress in ${selectedCountry} is built on the three pillars of cash flow: Spend, Save, and Give. By implementing a physical or digital 'Three-Bucket' system, you teach children that every ${country.currencySymbol} they receive must be allocated strategically. This simple mechanic, practiced early in hubs like ${country.cities[1]}, builds the muscle of 'Delayed Gratification'— the single most important predictor of future success in the ${country.regulator} economy.`
      },
      {
        title: "03. The Power of Time: Compound Magic",
        icon: <Zap className="h-6 w-6 text-amber-400" />,
        content: `The greatest asset a child in ${selectedCountry} has is not their inheritance, but their 'Time Horizon.' Explaining compounding interest as a 'Money Snowball' that starts small in a ${country.majorBanks[0]} account but grows into a mountain over decades is critical. By showing them how a dollar today can become ten dollars in the future inside a shield like ${country.retirementAccounts[0]}, you turn them into young strategists who value the future as much as the present.`
      },
      {
        title: "04. The Advertising & Consumption Trap",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `Modern children in ${selectedCountry} are targeted by billions of dollars in advertising designed to foster 'Instant Gratification.' Whether it's through social media or gaming in ${country.cities[2]}, the machine wants them to be consumers, not owners. Your job as a parent is to expose the 'Illusions' of marketing and teach them to ask: 'Does this purchase help me build my machine, or does it just Release my Energy?' This awareness is the ultimate shield against the consumer debt traps of ${selectedCountry}.`
      },
      {
        title: "05. The Strategic Allowance Audit",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `To build financial mastery, children need to practice with real ${country.currencyCode}. Use an allowance not as a gift, but as a 'Management Training Tool.' In ${selectedCountry}, encourage them to audit their own spending and celebrate when they hit 'Storing Energy' targets. Teaching them to research the cost of living in ${country.cities[0]} vs. ${country.cities[1]} helps them understand the regional economics they will one day navigate as adults under the ${country.regulator} framework.`
      },
      {
        title: "06. Advanced Generational Sovereignty",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `Mastering the ${selectedCountry} family legacy requires an understanding that financial literacy is a 'Linguistic Skill.' By teaching your family the vocabulary of ${country.currencyCode}, ${country.stockExchanges[0]}, and the ${country.taxAgency}, you ensure that wealth is not just transferred, but 'Managed.' Once your children see the economy as a predictable machine, they stop being victims of uncertainty and start being the architects of their own generational wealth. This Unit ${currentUnit?.number} is your family's declaration of independence.`
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
              <p className="leading-relaxed text-slate-300 text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-pink-400 first-letter:mr-3 first-letter:float-left">
                {s.content}
              </p>
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-pink-500/30 pl-6">
                In {selectedCountry}, the greatest gift you can give your family is the ability to navigate the {country.currencyCode} machine. It is a language that is rarely taught in schools but is required for survival. By mastering Unit {currentUnit?.number} together, you build a generational shield that no institutional shift can dismantle.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderMortgageDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Amortization Illusion",
        icon: <Home className="h-6 w-6 text-blue-400" />,
        content: `When you sign for a home in ${country.cities[0]} or ${country.cities[1]}, you aren't just buying a house; you are signing a 30-year labor contract with a lender like ${country.majorBanks[0]}. The 'Amortization Table' is the most expensive document you will ever sign. It is a mathematical front-loading machine designed to capture the majority of your interest in the first 10-15 years. In ${selectedCountry}, by the time you've paid off your home, you have often paid for it twice—once to the builder, and once to the bank.`
      },
      {
        title: "02. The Daily Interest Machine",
        icon: <Activity className="h-6 w-6 text-emerald-400" />,
        content: `Under the rules of the ${country.regulator}, mortgage interest in ${selectedCountry} is calculated based on your remaining balance. Most homeowners see their mortgage as a monthly bill; the strategist sees it as a 'Daily Interest Calculation.' Every dollar you keep sitting in a low-interest savings account earning ${country.rates.savings} while your mortgage costs you ${country.rates.mortgage} is a loss of wealth. To win, you must minimize the 'Average Daily Balance' of your debt, forcing the bank to calculate interest on a smaller number every single morning.`
      },
      {
        title: "03. The Equity Trap vs. Liquidity",
        icon: <Waves className="h-6 w-6 text-amber-400" />,
        content: `In ${selectedCountry}, 'Home Equity' is often a 'Dead Asset.' It is money trapped in the walls of your house that you cannot spend without permission from ${country.majorBanks[1]}. By utilizing tools like ${country.productName || 'a HELOC'} or ${country.retirementAccounts[0]} offsets, you can keep your capital 'Liquid' while still reducing your mortgage interest. The goal is 'Efficiency'—ensuring your money works 24/7 to reduce your liability without losing access to it for emergencies or opportunities in the ${country.stockExchanges[0]}.`
      },
      {
        title: "04. Strategic Refinancing & Renewals",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `The greatest risk in the ${selectedCountry} mortgage market is the 'Renewal Trap.' In markets like Canada or the UK, mortgages renew every few years, exposing you to the current prime rate of ${country.rates.prime}. In the USA, the 30-year fixed rate can lock you into an inefficient structure for decades. You must move beyond being a passive 'Borrower' and become a 'Lender Analyst.' Perform a 'Stress Test' on your mortgage to see how a 2% rate hike would impact your cash flow in ${country.cities[2]}.`
      },
      {
        title: "05. The Mortgage Optimization Blueprint",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `To optimize your mortgage in ${selectedCountry}, you must audit your relationship with ${country.majorBanks[0]}. Start by questioning why your money is siloed in accounts that benefit the bank's balance sheet more than yours. Utilize 'Accelerated' strategies that hit the principal early and often. In ${selectedCountry}, your highest ROI comes from 'Neutralizing' the interest calculations regulated by the ${country.regulator}. Shift your mindset from 'Monthly Payments' to 'Principal Velocity.'`
      },
      {
        title: "06. Advanced Home Sovereignty",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `Mastering the ${selectedCountry} mortgage landscape requires an understanding of the ${country.regulator} framework and the protection offered by ${country.protection}. By teaching your family that your house is a 'Liability' until it is paid off, you build a generational culture of ownership. Once you master the architecture of home loans in ${selectedCountry}, you stop being a tenant of the bank and start being the architect of your own financial legacy. This Unit ${currentUnit?.number} is your final step to true freedom.`
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
              <p className="leading-relaxed text-slate-300 text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-blue-400 first-letter:mr-3 first-letter:float-left">
                {s.content}
              </p>
              <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-blue-500/30 pl-6">
                In {selectedCountry}, your mortgage is likely your largest financial commitment. It can either be a 30-year weight or a 10-year springboard. By mastering the rules of Unit {currentUnit?.number}, you ensure that your home becomes a true asset for your family, not just a profit center for {country.majorBanks[0]}.
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
              As a student of the Academy, you must recognize that {country.majorBanks[0]} and {country.taxAgency} 
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
    const category = currentLesson.category.toLowerCase();
    switch (category) {
      case 'banking': return renderBankingDeepDive(country);
      case 'insurance': return renderInsuranceDeepDive(country);
      case 'economics': return renderEconomicsDeepDive(country);
      case 'government': return renderGovernmentDeepDive(country);
      case 'debt': return renderDebtDeepDive(country);
      case 'investing': return renderInvestingDeepDive(country);
      case 'family': return renderFamilyDeepDive(country);
      case 'mortgage': return renderMortgageDeepDive(country);
      default: return renderDefaultDeepDive(country);
    }
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
            "The economy is a machine. You can either understand how to operate it, or you can be its fuel."
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
                  <strong className="text-white block mb-2 text-xl">Cycle Awareness</strong>
                  <span className="text-slate-300 text-lg leading-relaxed">In {selectedCountry}, the {country.centralBank} will inevitably shift policies. Your goal is to remain liquid and debt-free so that a recession becomes an opportunity to acquire assets in the {country.stockExchanges[0]} rather than a struggle for survival.</span>
                </div>
              </li>
              <li className="flex gap-6 items-start">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  <strong className="text-white block mb-2 text-xl">Inflation Protection</strong>
                  <span className="text-slate-300 text-lg leading-relaxed">Maximize your utilization of {country.retirementAccounts.join(' and ')} within the {country.currencyCode} environment. These are your strategic bunkers that protect your capital from the inflationary siphon managed by the {country.centralBank}.</span>
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
