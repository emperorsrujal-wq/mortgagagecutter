
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
  Waves,
  UserCircle2,
  Lock
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
        email: user.email || '',
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
      email: user.email || '',
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
    const termDeposit = selectedCountry === 'Canada' ? 'GIC' : selectedCountry === 'USA' ? 'CD' : 'Term Deposit';
    const sections = [
      {
        title: "01. What is a Bank? (The Spread Merchant)",
        icon: <Landmark className="h-6 w-6 text-blue-500" />,
        content: `In the ${selectedCountry} context, a bank is not a storage facility for your cash; it is a financial intermediary—a spread merchant that survives on the gap between what it pays you and what it charges others. When you walk into a branch of ${country.majorBanks[0]}, you are technically granting the bank an unsecured loan of your ${country.currencyCode}. Under the oversight of the ${country.regulator}, the bank is allowed to use your deposit as the raw material for its lending operations. It is a legally licensed entity designed to capture your capital at the lowest possible cost so it can sell that same capital back to the community at a high interest rate.`
      },
      {
        title: "02. The Checking Account (The Transaction Hub)",
        icon: <Zap className="h-6 w-6 text-emerald-500" />,
        content: `The checking account is your primary Transaction Hub, designed for high-frequency movement and maximum liquidity. Because life in cities like ${country.cities[0]} requires constant spending, the bank offers this "convenience" typically for free or a nominal fee while paying you zero interest. They do this because checking accounts provide them with a constant, high-velocity stream of free capital. By keeping your money in a checking account at ${country.majorBanks[1]}, you are providing the bank with an interest-free loan that they can use to meet their reserve requirements while you handle the daily friction of bills and expenses.`
      },
      {
        title: "03. The Savings Account (The Liquidity Bucket)",
        icon: <Coins className="h-6 w-6 text-amber-500" />,
        content: `The savings account is marketed as your "Safety Bucket," offering a symbolic interest rate of ${country.rates.savings}. In reality, this rate is intentionally set just high enough to discourage you from moving your capital to a competitor, but rarely high enough to beat inflation. It is a "holding pen" for your idle cash. While your balance at ${country.majorBanks[0]} looks stable on a screen, the purchasing power of that money is silently eroding as the ${country.centralBank} manages the national debt. Keeping large sums in a "safe" savings account is a guaranteed way to lose wealth relative to the cost of living in ${selectedCountry} over any meaningful time horizon.`
      },
      {
        title: "04. Term Deposits: ${termDeposit}s (The Time Lock)",
        icon: <Clock className="h-6 w-6 text-purple-500" />,
        content: `For those seeking "Guaranteed Safety," banks offer ${termDeposit}s—the ultimate Time Lock. In a ${termDeposit}, you legally agree to freeze your ${country.currencyCode} for a fixed period, typically 1 to 5 years. In exchange for surrendering your liquidity, ${country.majorBanks[1]} pays a slightly higher interest rate than a savings account. This is a massive win for the bank's balance sheet: they secure long-term, predictable capital that they can leverage into 30-year mortgages, knowing you cannot withdraw it without a heavy penalty. You traded your most valuable asset—your flexibility—for a nominal return that often barely keeps pace with ${selectedCountry}'s cost of living.`
      },
      {
        title: "05. Strategic Pitfalls & Inflation Erosion",
        icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
        content: `The greatest risk in the ${selectedCountry} banking system isn't a bank run—it's the silent erosion of your purchasing power. While your balance at ${country.majorBanks[1]} might look stable on a screen, the ${country.centralBank} manages the national debt of ${country.nationalDebt} by allowing inflation to exist. If the inflation rate is higher than your savings rate, you are effectively paying the bank to lose money every day. Keeping large sums in a 'safe' savings account in hubs like ${country.cities[1]} is a guaranteed way to lose wealth relative to the cost of living over any meaningful time horizon.`
      },
      {
        title: "06. The Strategic Action Plan",
        icon: <Target className="h-6 w-6 text-purple-500" />,
        content: `To move from 'consumer' to 'strategist,' you must audit your relationship with ${country.majorBanks[0]}. Start by questioning why your money is siloed in accounts that benefit the bank's balance sheet more than yours. Shift your focus from 'saving' to 'velocity'—ensuring your money hits your debt immediately to neutralize the interest calculations regulated by the ${country.regulator}. Your goal is to move from being the 'Fuel' of the bank's machine to being the 'Owner' of your own capital flow, using their products only when they serve your speed of payoff.`
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
              <div className="leading-relaxed text-slate-300 text-xl font-medium whitespace-pre-wrap">
                {s.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderInsuranceDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. What is Insurance? (The Transfer of Risk)",
        icon: <Umbrella className="h-6 w-6 text-blue-400" />,
        content: `In the ${selectedCountry} market, insurance is not a savings plan or a safety net—it is a legal contract for the 'Transfer of Risk.' When you pay a premium to ${country.majorInsurers[0]}, you are legally transferring the financial consequence of a catastrophic event from your personal balance sheet to a massive institutional one. This mechanism is the cornerstone of generational wealth. Without a robust risk-transfer strategy, one medical emergency, property disaster, or liability lawsuit in cities like ${country.cities[0]} can wipe out decades of disciplined labor and savings. Insurance is the "Architecture of Certainty" that ensures your family's future is not left to chance.`
      },
      {
        title: "02. The Actuarial Machine (How it Works)",
        icon: <Activity className="h-6 w-6 text-emerald-400" />,
        content: `Under the oversight of the ${country.insuranceRegulator}, players like ${country.majorInsurers[1]} operate the 'Actuarial Machine.' This is a mathematical engine that uses the 'Law of Large Numbers' to predict the future with terrifying accuracy. They know exactly how many houses will burn and how many people will fall ill in ${selectedCountry} this year. They don't bet on individuals; they bet on the collective. By pooling the premiums of millions of citizens, they create a reservoir of capital that generates "Investment Float." By the time they pay out a claim, they have already made a profit on your money in the ${country.stockExchanges[0]}. Understanding that your premium is a calculated bet where the house always has the edge allows you to choose policies that cover true catastrophes only, rather than "maintenance" events.`
      },
      {
        title: "03. Term Life Insurance (Pure Protection)",
        icon: <ShieldCheck className="h-6 w-6 text-amber-400" />,
        content: `Term Life insurance is "Pure Protection." It is designed to cover you for a specific period—typically 10, 20, or 30 years—for the lowest possible ${country.currencyCode} cost. In ${selectedCountry}, this is the most efficient use of capital for risk transfer. It provides a massive death benefit during your "vulnerability years"—when your mortgage is high and your children are young. Because it has no cash value and expires at the end of the term, ${country.majorInsurers[2]} can offer high coverage for very low premiums. For the strategist, Term Life is the "shield" that protects the family engine while your "Wealth Machine" (investments and equity) is still being built.`
      },
      {
        title: "04. Permanent Insurance (The Complexity Trap)",
        icon: <Lock className="h-6 w-6 text-red-400" />,
        content: `Whole, Universal, and Variable Life insurance are what we call "Complexity Traps." These products bundle pure insurance with an investment component, marketed as "permanent protection" that builds cash value. However, in the ${selectedCountry} landscape, these products are often optimized for the insurer's balance sheet and the agent's commission rather than your family's net worth. The high fees and "management costs" inside a policy from ${country.majorInsurers[0]} often consume the growth, making them significantly less efficient than buying Term Life and investing the difference in your own ${country.retirementAccounts[0]}. For most, permanent insurance is a low-velocity capture of capital that creates a multi-decade drag on your financial speed.`
      },
      {
        title: "05. Living Benefits (Protecting the Income Engine)",
        icon: <HeartPulse className="h-6 w-6 text-pink-400" />,
        content: `In ${selectedCountry}, your most valuable asset is not your home in ${country.cities[1]}—it is your ability to earn an income. "Living Benefits," including Disability and Critical Illness insurance, are designed to protect this "Income Engine." If you are injured or diagnosed with a major illness, these policies provide a monthly stream of ${country.currencyCode} or a lump-sum payment to ensure your mortgage and lifestyle remain stable while you recover. Under the gaze of the ${country.insuranceRegulator}, these products are the "Maintenance Insurance" for the human machine. Failing to protect your earning power is the single biggest "Point of Failure" in most family financial plans.`
      },
      {
        title: "06. Property, Auto & The Deductible Lever",
        icon: <Scale className="h-6 w-6 text-amber-400" />,
        content: `Property and Auto insurance are "Legal Requirements" that also serve as "Wealth Protectors." In hubs like ${country.cities[2]}, many homeowners fall into the trap of "Premium Leakage"—paying extra for low deductibles. You can fight back by using the "Deductible Lever." By raising your deductibles to the maximum you can comfortably handle (e.g., ${country.currencySymbol}2,500 or higher), you instantly lower your annual premium. You then redirect that saved premium into your debt-reduction strategy or your ${country.retirementAccounts[1]}. This shift moves you from being a "passive consumer" of ${country.majorInsurers[1]}'s products to being a strategist who manages their own risk-retention level.`
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
              <div className="leading-relaxed text-slate-300 text-xl font-medium whitespace-pre-wrap">
                {s.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderEconomicsDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Macro Machine & GDP (National Output)",
        icon: <LineChart className="h-6 w-6 text-blue-400" />,
        content: `In the ${selectedCountry} economy, the 'Macro Machine' is the total environment in which your wealth lives. The most important terminology to understand is GDP (Gross Domestic Product). This represents the total value of all goods and services produced within hubs like ${country.cities[0]} and beyond. Think of GDP as the 'National Energy Output.' When GDP grows, businesses expand and jobs are plentiful; when it shrinks, the machine enters a recession. Understanding GDP is critical because it dictates the 'Consumer Sentiment' that either drives prices up or forces the ${country.centralBank} to intervene in your personal finances.`
      },
      {
        title: "02. Interest Rates (The Hand on the Lever)",
        icon: <Landmark className="h-6 w-6 text-emerald-400" />,
        content: `Interest rates are the single most powerful force affecting your mortgage and your speed of payoff. Controlled by the ${country.centralBank} (currently impacting the prime rate of ${country.rates.prime}), interest rates are the 'Price of Money.' When the ${country.centralBank} lowers the lever, they are encouraging citizens in ${selectedCountry} to borrow and spend, heating up the engine. When they pull the lever up, they are intentionally making borrowing more expensive to cool down inflation. For the strategist, interest rates are not just a monthly expense; they are the 'Gravity' that determines how much work is required to clear your debt at ${country.majorBanks[0]}.`
      },
      {
        title: "03. Inflation (The Purchasing Power Siphon)",
        icon: <Waves className="h-6 w-6 text-amber-400" />,
        content: `Inflation is the term people hear most but understand least. It is the steady devaluation of the ${country.currencyCode} in your pocket. As the government manages a national debt of ${country.nationalDebt}, inflation acts as a 'Silent Tax' that siphons value from cash-savers and transfers it to asset-owners. If inflation is 4% and your savings account at ${country.majorBanks[1]} pays only ${country.rates.savings}, you are losing wealth every single day. This is why our method focuses on 'Debt Velocity'—the only way to stay ahead of the inflationary siphon is to move capital from depreciating cash into productive equity faster than the currency shrinks.`
      },
      {
        title: "04. The Product Mix: Supply, Demand & Credit",
        icon: <Zap className="h-6 w-6 text-purple-400" />,
        content: `The economy functions through the law of 'Supply and Demand,' but in ${selectedCountry}, it is greased by 'Credit.' 
        
        'Supply' is the availability of goods in markets like ${country.cities[1]}, while 'Demand' is the desire of citizens to buy them. 
        
        'Credit' is the magic multiplier that allows people to buy today with money they haven't earned yet. This creates the 'Economic Cycle.' When credit is easy to get from ${country.majorBanks[0]}, demand spikes and prices rise. When credit tightens due to ${country.regulator} policy, demand falls. Understanding this relationship allows you to predict when the machine is about to shift from growth to contraction.`
      },
      {
        title: "05. Recession & the Credit Cleanse",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `A 'Recession' is officially defined as two consecutive quarters of negative GDP growth. In ${selectedCountry}, a recession is the machine's way of clearing out 'Inefficient Debt.' During these periods, liquidity dries up and fear becomes the dominant emotion in ${country.cities[2]}. However, for the educated student, a recession is a 'Transfer Event.' It is the moment when assets move from the over-leveraged to the liquid. By using our payoff methods to maintain a 'Debt-Free Fortress,' you position yourself to be the buyer when others are forced to sell during the cycle's cleanse.`
      },
      {
        title: "06. Economic Sovereignty (The Strategy)",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `True sovereignty in ${selectedCountry} comes from realizing that the ${country.centralBank} prioritizes institutional stability over your personal net worth. By mastering the terminology of GDP, Inflation, and Interest Rates, you stop reacting to the headlines and start positioning your family for the next shift in the ${country.regulator} landscape. Your goal is to move capital out of the 'Inflated Siphon' and into 'Strategic Bunkers' like ${country.retirementAccounts[0]} and home equity. This Unit is your declaration of independence from an economic system designed to keep you as its fuel.`
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
              <div className="leading-relaxed text-slate-300 text-xl font-medium whitespace-pre-wrap">
                {s.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderGovernmentDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Social Contract (The Rules of the Game)",
        icon: <Landmark className="h-6 w-6 text-blue-400" />,
        content: `In the ${selectedCountry} context, the government is the primary architect of the environment in which your money lives. From policy halls to the streets of ${country.cities[0]}, the government operates on a 'Social Contract.' You contribute a portion of your energy (taxes) in exchange for infrastructure, national security, and the rule of law. Most see the ${country.taxAgency} as an adversary, but the strategist understands it as a mandatory business partner—one that has established the rules of the game you are forced to play. Understanding the contract is the first step to legally optimizing your position within it.`
      },
      {
        title: "02. The National Ledger (Where the Money Goes)",
        icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
        content: `Every year, your government releases a Budget—a massive declaration of national priorities. In ${selectedCountry}, this ledger balances the competing needs of healthcare, defense, and social safety nets like ${country.programs[0]}. When you see the national debt of ${country.nationalDebt}, you are looking at the 'Overdraft' of the nation. This debt is serviced by the future production of its citizens—your future work. By understanding this ledger, you can predict where the ${country.regulator} might increase taxes and where they might place incentives to encourage the behavior they need from the populace.`
      },
      {
        title: "03. The Revenue Engine: Taxation Mechanics",
        icon: <Zap className="h-6 w-6 text-amber-400" />,
        content: `The ${country.taxAgency} is the primary fuel for the state machine. In ${selectedCountry}, taxation is not a single bill, but a multi-layered capture system. 
        
        'Income Tax' is a progressive levy on your production—the more value you provide, the higher the percentage the state captures. 
        
        'Consumption Tax' (like GST or Sales Tax) captures revenue every time money moves through the economy in cities like ${country.cities[1]}. 
        
        'Property Tax' is a recurring storage fee on your home equity. 
        
        The engine is relentless, designed to capture energy at every point of the economic cycle. However, the ${country.taxAgency} also provides 'Safety Valves'—legal ways to keep more of your money through strategic deductions and credits.`
      },
      {
        title: "04. The Deficit Dilemma & The Debt Trap",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `When ${selectedCountry} spends more than it collects in tax revenue, it creates a 'Deficit.' To bridge this gap, they issue government bonds—legally promising to pay back lenders with future citizen energy. With a national debt of ${country.nationalDebt}, the nation is in a permanent state of debt service. This creates a hidden 'Debt Trap' for the ${country.centralBank}, which must keep interest rates in a range that prevents the government from defaulting. As a citizen, your personal savings are effectively part of the collateral for this national overdraft, and inflation is the tool the state uses to shrink the 'real' value of that debt over time.`
      },
      {
        title: "05. Benefits, Entitlements & The Net Relationship",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `While the government captures revenue, it also redistributes it through programs like ${country.programs.join(' and ')}. In hubs like ${country.cities[2]}, these benefits form the baseline of social stability. To win, you must calculate your 'Net Relationship' with the state. Are you a net contributor or a net beneficiary? Most citizens are passive participants, but the strategist utilizes every grant, rebate, and social shield provided by the ${country.taxAgency} code. This isn't about avoiding your duty; it's about utilizing the rules exactly as they were written to build your own family's fortress.`
      },
      {
        title: "06. Strategic Citizenship: The Tax Shield",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `True financial mastery requires 'Strategic Citizenship.' This means understanding the ${country.regulator} rules and the ${country.taxAgency} codes as the manual to a high-performance machine. By utilizing 'Bunkers' like ${country.retirementAccounts[0]} and ${country.retirementAccounts[1]}, you are legally opting out of immediate taxation, allowing your wealth to compound inside a protected environment. Once you see how ${country.currencyCode} flows through the halls of power, you stop being a victim of policy and start being a strategist who positions themselves for the next legislative shift in ${selectedCountry}.`
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
              <div className="leading-relaxed text-slate-300 text-xl font-medium whitespace-pre-wrap">
                {s.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderDebtDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Debt Paradigm (Future Labor)",
        icon: <Flame className="h-6 w-6 text-red-500" />,
        content: `In the ${selectedCountry} economy, debt is often marketed as 'Opportunity'—the key to unlocking a lifestyle you haven't yet earned. In reality, debt is more accurately described as 'Future Work Already Spent.' Every time you sign a credit agreement with ${country.majorBanks[0]}, you are legally granting them a lien on your future energy. From the high-rises of ${country.cities[0]} to the suburbs, consumer debt is the 'Financial Gravity' that relentlessly pulls wealth away from hard-working families and towards institutional balance sheets. To win this game, you must stop seeing debt as a tool for comfort and start seeing it as a precise mathematical calculation where every dollar of interest is a minute of your life you'll never get back.`
      },
      {
        title: "02. The Compound Interest Trap (The Siphon)",
        icon: <Activity className="h-6 w-6 text-orange-500" />,
        content: `Under the oversight of the ${country.regulator}, lenders in ${selectedCountry} utilize the most powerful force in finance—the 'Power of Compounding'—against you. While compounding creates millionaires in the stock market, it creates indentured servants in the debt market. Interest is not just charged on the principal; it is often charged on the interest from the previous month, creating a 'Death Spiral' where your balance can grow faster than your ability to repay it. In ${selectedCountry}, the average household carries debt that costs them far more in interest than they earn in savings—a silent, multi-generational siphon designed to keep you as the fuel for the lender's machine.`
      },
      {
        title: "03. The Toolset: Cards, Cars & Bridges",
        icon: <ShieldCheck className="h-6 w-6 text-amber-500" />,
        content: `Debt products in ${selectedCountry} are engineered for specific captures. 
        
        'Credit Cards' are the High-Velocity Traps—they offer unmatched convenience but charge rates upwards of 20% if not cleared instantly, keeping you in a cycle of 'minimum payment' survival in hubs like ${country.cities[1]}. 
        
        'Car Loans' are the Depreciating Asset Debt—you borrow ${country.currencyCode} to buy an asset that loses value the second you drive it off the lot, ensuring you are often 'underwater' for years. 
        
        'Personal Loans' and 'Lines of Credit' are the Structural Bridges; while often marketed for 'consolidation,' they frequently reset the interest trap for another decade if the root cause of spending isn't addressed.`
      },
      {
        title: "04. Good Debt vs. Bad Debt: The Spread",
        icon: <Scale className="h-6 w-6 text-amber-500" />,
        content: `Not all debt is created equal in the ${selectedCountry} landscape. 'Bad Debt' is used to acquire depreciating items at high interest rates, while 'Good Debt' is structured to be 'Low-Velocity' or 'Tax-Efficient.' The strategy-first student looks for 'The Spread'—the gap between what they pay in interest and what they could earn in growth. If you borrow at 6% to own an asset growing at 8% in the ${country.stockExchanges[0]}, you are a strategist. If you borrow at 22% to buy a television in ${country.cities[2]}, you are a consumer being consumed. Mastery involves moving your liabilities from high-interest traps into low-interest, strategic vehicles regulated by the ${country.regulator}.`
      },
      {
        title: "05. Pitfalls & Credit Scores (The Report Card)",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `The greatest risk in the ${selectedCountry} debt landscape is the 'Minimum Payment Illusion.' Lenders calculate a payment that barely covers the interest, ensuring you stay in debt for 25 to 30 years while they extract maximum profit from your labor. Furthermore, your 'Credit Score' is often misunderstood. It is not a measure of your wealth; it is a measure of how good you are at being a profitable, reliable customer for ${country.majorBanks[1]}. In ${selectedCountry}, you must move beyond the 'Score' and focus on the 'Balance.' Complexity is the tool institutions use to hide the true, compounding cost of your lifestyle.`
      },
      {
        title: "06. The Debt Liquidation Audit",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `To build a true fortress in ${selectedCountry}, you must perform a 'Debt Audit.' This involves listing every single liability—from your primary mortgage to your smallest retail credit line—and identifying the 'Interest Velocity' of each. Your highest ROI comes from 'Choking' high-interest debt first through aggressive cashflow redirection. This isn't just about 'Paying Off' loans; it's about 'Neutralizing' interest calculations. By shifting your focus from monthly payments to 'Debt Velocity,' you can redirect thousands of ${country.currencyCode} from the bank's ledger back to your family's ${country.retirementAccounts[0]}.`
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
              <div className="leading-relaxed text-slate-300 text-xl font-medium whitespace-pre-wrap">
                {s.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderInvestingDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Ownership Mindset (Owner vs. Laborer)",
        icon: <TrendingUp className="h-6 w-6 text-blue-400" />,
        content: `In the ${selectedCountry} wealth ladder, there is a fundamental divide: those who work for money, and those who own the machines that produce it. Investing is the act of transition from laborer to owner. Whether you are buying shares on the ${country.stockExchanges[0]} or acquiring property in ${country.cities[0]}, you are moving your ${country.currencyCode} from a 'spending' bucket into an 'ownership' bucket. Most people in ${selectedCountry} fear the market because they see it as gambling; in reality, it is the only legal way to participate in national and global growth. To be an owner is to have other people's labor work for your family's future.`
      },
      {
        title: "02. The Market Machine (National Ingenuity)",
        icon: <BarChart3 className="h-6 w-6 text-emerald-400" />,
        content: `The ${country.stockExchanges[0]} is not just a screen with flickering numbers; it is a marketplace for human ingenuity and national energy. In ${selectedCountry}, thousands of companies compete daily to provide value to citizens. When you invest, you are betting on the collective productivity of your nation. Under the oversight of the ${country.regulator}, this machine operates on cycles of fear and greed. To win, you must learn to ignore the 24-hour news cycles in hubs like ${country.cities[1]} and focus on the signals of long-term value creation. The market is a tool for transferring wealth from the impatient to the patient.`
      },
      {
        title: "03. The Toolset: Units, Debt & Shells",
        icon: <Coins className="h-6 w-6 text-amber-400" />,
        content: `The investing inventory in ${selectedCountry} consists of three primary vehicles. 
        
        'Stocks' are Ownership Units—you own a literal piece of a company's future profits. 
        
        'Bonds' are Debt Units—you lend your ${country.currencyCode} to governments or corporations in exchange for a fixed interest rate. 
        
        'ETFs' and 'Mutual Funds' are Diversification Shells—they bundle hundreds of stocks or bonds together to reduce the risk of any single company failing. Each product has a different 'Velocity' and 'Risk Profile' within the ${country.regulator} framework. Understanding these tools allows you to move from being a consumer of products to an architect of assets.`
      },
      {
        title: "04. The Tax-Advantaged Shield (Bunkers)",
        icon: <ShieldCheck className="h-6 w-6 text-amber-400" />,
        content: `The single greatest multiplier of long-term returns in ${selectedCountry} is the tax shield. The ${country.taxAgency} has created specific 'Strategic Bunkers' to encourage citizens to build their own safety nets. Utilizing tools like ${country.retirementAccounts[0]} and ${country.retirementAccounts[1]} allows your wealth to compound without the heavy, recurring drag of annual taxation. This creates an exponential effect where money that would have gone to the state instead stays on your family's balance sheet. In ${selectedCountry}, failing to maximize these shields is a silent, permanent penalty on your future speed of wealth.`
      },
      {
        title: "05. Risk, Diversification & The Fee Spread",
        icon: <Activity className="h-6 w-6 text-red-400" />,
        content: `The greatest risk in the ${selectedCountry} market isn't a crash—it's a lack of diversification and the erosion of fees. In hubs like ${country.cities[2]}, many investors over-allocate to a single sector, creating a massive point of failure. Furthermore, you must audit the 'Fee Spread' you pay to ${country.majorBanks[1]}. In ${selectedCountry}, even a 1% management fee can cost you hundreds of thousands of ${country.currencyCode} over a lifetime. Shift your focus to 'Low-Cost, High-Velocity' index strategies that keep the majority of national growth where it belongs—with the owner, not the intermediary.`
      },
      {
        title: "06. The Strategic Portfolio Audit (Legacy)",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `To optimize your financial fortress in ${selectedCountry}, you must perform a regular 'Assets Audit.' Start by questioning high-fee, 'active' products sold by the marketing arms of ${country.majorBanks[0]}. Move toward passive index strategies that capture the entire heartbeat of the ${country.stockExchanges[0]}. Remember: the institutional financial machine is designed to capture your capital through complexity and fees; your goal is to minimize that leakage and maximize compounding. This Unit is your blueprint for moving from the treadmill of 'Labor' to the sovereignty of 'Legacy'.`
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
              <div className="leading-relaxed text-slate-300 text-xl font-medium whitespace-pre-wrap">
                {s.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderFamilyDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Energy of Value (Stored Labor)",
        icon: <HeartPulse className="h-6 w-6 text-pink-400" />,
        content: `Teaching the next generation about ${country.currencyCode} starts by explaining that money is simply 'Stored Energy.' Every dollar earned by a parent represents a piece of their finite time and effort. By helping children in ${selectedCountry} understand that spending is 'Releasing Energy' and saving is 'Storing Energy' for future use, you build a foundation of respect for the labor required to build a family legacy. This shift in language moves them from seeing money as a magical resource to seeing it as a fuel that must be managed with precision.`
      },
      {
        title: "02. The Spend, Save, Give Machine (Pillars)",
        icon: <Waves className="h-6 w-6 text-blue-400" />,
        content: `A family financial fortress in ${selectedCountry} is built on three unbreakable pillars: Spend, Save, and Give. By implementing a 'Three-Bucket' system at home, you teach children that every ${country.currencySymbol} they receive must be allocated strategically. This simple mechanic, practiced early in hubs like ${country.cities[1]}, builds the vital muscle of 'Delayed Gratification'—the single most important psychological predictor of future success in the ${country.regulator} economy. It turns them into young managers of capital rather than just consumers of toys.`
      },
      {
        title: "03. The Toolset: Allowances & First Accounts",
        icon: <Zap className="h-6 w-6 text-amber-400" />,
        content: `To build mastery, children need practical experience with real-world tools. 
        
        The 'Allowance' should be viewed as a 'Management Training Tool'—not a gift. It should be tied to household responsibilities and allocated across their three buckets. 
        
        'Kids' Accounts' at ${country.majorBanks[0]} are the 'Storing Energy Bunkers,' where they can watch their first few ${country.currencyCode} earn interest. 
        
        Modern savings apps in ${country.cities[2]} serve as 'Digital Dashboards,' helping them visualize their progress toward goals. Each tool should be introduced as a way to manage family energy more efficiently under ${country.regulator} standards.`
      },
      {
        title: "04. The Power of Time: Compound Magic",
        icon: <Activity className="h-6 w-6 text-emerald-400" />,
        content: `The greatest asset a child in ${selectedCountry} has is their 'Multi-Decade Time Horizon.' Explaining compounding interest as a 'Money Snowball' that starts as a tiny flake in a ${country.majorBanks[0]} account but grows into an unstoppable mountain over fifty years is a critical lesson. By showing them how a single ${country.currencySymbol} today can become ten or twenty in the future inside a protected shield like ${country.retirementAccounts[0]}, you turn them into young strategists who value the future as much as the present. You are teaching them to let time do the heavy lifting.`
      },
      {
        title: "05. The Advertising & Consumption Trap",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `Modern children in ${selectedCountry} are targeted by billions in advertising designed to foster 'Instant Gratification.' The institutional machine wants them to be lifelong consumers, not owners. Your job as a parent is to expose the 'Illusions' of marketing and teach them to ask the vital question: 'Does this purchase help me build my machine, or does it just Release my Energy for someone else's profit?' This awareness is the ultimate shield against the high-interest consumer debt traps that plague ${selectedCountry}.`
      },
      {
        title: "06. Advanced Generational Sovereignty",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        content: `Mastering the ${selectedCountry} family legacy requires an understanding that financial literacy is actually a 'Linguistic Skill.' By teaching your family the vocabulary of ${country.currencyCode}, ${country.stockExchanges[0]}, and the ${country.taxAgency} code, you ensure that wealth is not just transferred, but successfully 'Managed.' Once your children see the national economy as a predictable machine with clear rules, they stop being victims of economic uncertainty and start being the architects of their own generational wealth fortress.`
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
              <div className="leading-relaxed text-slate-300 text-xl font-medium whitespace-pre-wrap">
                {s.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderMortgageDeepDive = (country: CountrySpecificInfo) => {
    const sections = [
      {
        title: "01. The Amortization Illusion (Labor Contract)",
        icon: <Home className="h-6 w-6 text-blue-400" />,
        content: `When you sign for a home in cities like ${country.cities[0]}, you aren't just buying a property; you are signing a 25 to 30-year labor contract with ${country.majorBanks[0]}. The 'Amortization Table' is likely the most expensive document you will ever sign. It is a mathematical front-loading machine designed to capture the vast majority of your interest payments in the first 10-15 years. In ${selectedCountry}, by the time you've finally paid off your home using traditional methods, you have often paid for it twice—once to the builder, and once to the bank in pure interest profit.`
      },
      {
        title: "02. The Daily Interest Machine (The Math)",
        icon: <Activity className="h-6 w-6 text-emerald-400" />,
        content: `Under the rules of the ${country.regulator}, mortgage interest in ${selectedCountry} is calculated based on your remaining balance. Most homeowners see their mortgage as a monthly bill to be paid; the strategist sees it as a 'Daily Interest Calculation.' Every dollar you keep in a low-interest savings account earning ${country.rates.savings} while your mortgage costs you ${country.rates.mortgage} is a direct, daily loss of wealth. To win, you must minimize the 'Average Daily Balance' of your debt by making every ${country.currencyCode} of your income work 24/7 to neutralize the bank's math.`
      },
      {
        title: "03. The Toolset: Fixed, Variable & Valves",
        icon: <Zap className="h-6 w-6 text-amber-400" />,
        content: `Home loans in ${selectedCountry} come in three primary structures. 
        
        'Fixed Rate' mortgages offer the 'Certainty Premium'—you pay a higher price for the peace of mind of a static payment. 
        
        'Variable' or 'Adjustable' rates are the 'Market Mirror'—they reflect ${country.centralBank} policy changes instantly, often making them more volatile but potentially cheaper over the long run. 
        
        'Strategic' tools like HELOCs or Offset accounts are the 'Strategic Valves'—they allow you to deposit income directly against principal, dropping the interest charges instantly. Choosing the right tool is the difference between 30 years of labor and 10.`
      },
      {
        title: "04. The Equity Trap vs. Liquidity (Dead Assets)",
        icon: <Waves className="h-6 w-6 text-amber-400" />,
        content: `In ${selectedCountry}, 'Home Equity' is often a 'Dead Asset.' It is money trapped inside your walls that you cannot spend without permission and another fee from ${country.majorBanks[1]}. By utilizing a ${country.productName || 'HELOC'}, you can keep your capital 'Liquid' and accessible while still using it to reduce your mortgage interest. The goal is 'Capital Efficiency'—ensuring your money works to reduce your total liability without losing access to it for emergencies in ${country.cities[1]} or opportunities in the ${country.stockExchanges[0]}.`
      },
      {
        title: "05. Strategic Refinancing & Renewals (The Stress)",
        icon: <ShieldAlert className="h-6 w-6 text-red-400" />,
        content: `The greatest risk in the ${selectedCountry} mortgage market is the 'Renewal or Reset Trap.' In markets like Canada or the UK, mortgages renew every few years, exposing you to the current prime rate of ${country.rates.prime}. You must move beyond being a passive borrower and become a 'Lender Analyst.' Perform a 'Stress Test' on your family's finances to see how a significant rate hike would impact your cash flow in ${country.cities[2]} before your next renewal cycle occurs. Being prepared is the only way to maintain sovereignty over your home.`
      },
      {
        title: "06. The Mortgage Optimization Blueprint",
        icon: <Target className="h-6 w-6 text-purple-400" />,
        content: `To optimize your mortgage in ${selectedCountry}, you must audit your entire relationship with ${country.majorBanks[0]}. Start by questioning why your money is siloed in accounts that benefit the bank's balance sheet more than yours. Utilize 'Accelerated' strategies that hit the principal early and often, collapsing the amortization timeline. Shift your mindset from 'Monthly Payments' to 'Principal Velocity.' Mastering the internal architecture of your home loan is your final step to true financial sovereignty and a debt-free life.`
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
              <div className="leading-relaxed text-slate-300 text-xl font-medium whitespace-pre-wrap">
                {s.content}
              </div>
            </div>
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
      default: return renderBankingDeepDive(country);
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
            "Financial mastery is a linguistic skill. Once you learn the true vocabulary of the machine, you can never go back to being its fuel."
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
