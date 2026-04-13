
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useCourse } from './CourseProvider';
import { CourseCard, StatBox } from './UIComponents';
import { 
  Play, Pause, RotateCcw, TrendingUp, DollarSign, Clock, Zap, AlertCircle, 
  Calendar, Timer, History, ShieldAlert, BarChart, Scale, ShieldCheck, 
  Target, Award, CheckCircle, Calculator, HeartPulse, Sparkles,
  MessageSquare, UserCircle2, ChevronRight, Download, FileSearch,
  Gavel, ScrollText, SearchCode, ListChecks, ArrowUpRight, Activity,
  Layers, MousePointer2, RefreshCcw
} from 'lucide-react';
import { TranslatedText } from './TranslatedText';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Simple Confetti burst logic
function ConfettiBurst() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (Math.random() * 2 - 1) * 300 + "px",
    y: (Math.random() * 2 - 1) * 220 + "px",
    color: ["#22d3ee","#a78bfa","#34d399","#fbbf24","#f472b6"][Math.floor(Math.random()*5)]
  }));
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {dots.map(d => (
        <span 
          key={d.id} 
          className="w-2 h-2 rounded-full absolute animate-out fade-out zoom-out duration-1000 fill-mode-forwards" 
          style={{ 
            backgroundColor: d.color,
            transform: `translate(${d.x}, ${d.y})`
          }} 
        />
      ))}
    </div>
  );
}

export function AutomationSimulator() {
  const { country } = useCourse();
  const [income, setIncome] = useState(6000);
  const [bills, setBills] = useState(4000);
  const [hyperdrive, setHyperdrive] = useState(false);
  const [balance, setBalance] = useState(250000);

  const hyperAmount = hyperdrive ? 500 : 0;
  const rate = country.avgRate / 100;
  const dailyRate = rate / 365;

  const data = useMemo(() => {
    let currentBal = balance;
    const series = [];
    const days = 30;
    
    // Day 1: Paycheck hits
    currentBal -= (income + hyperAmount);
    
    for (let d = 1; d <= days; d++) {
      // Mid-month bills
      if (d === 15) currentBal += bills;
      
      const dayInterest = currentBal * dailyRate;
      series.push({
        day: d,
        balance: Math.max(0, currentBal),
        interest: dayInterest
      });
    }
    return series;
  }, [income, bills, hyperdrive, balance, dailyRate, hyperAmount]);

  const totalInt = data.reduce((sum, d) => sum + d.interest, 0);
  const traditionalInt = (balance * (rate / 12));
  const savings = traditionalInt - totalInt;

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <CourseCard title="⚙️ Velocity Parameters" className="bg-white border-2 border-slate-100 shadow-xl rounded-[40px] p-10">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                  <span>Net Monthly Income</span>
                  <span className="text-emerald-600">{fmt(income)}</span>
                </div>
                <input type="range" min="2000" max="15000" step="100" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-emerald-600" />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                  <span>Monthly Expenses (All)</span>
                  <span className="text-red-600">{fmt(bills)}</span>
                </div>
                <input type="range" min="1000" max="10000" step="100" value={bills} onChange={e => setBills(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-red-600" />
              </div>

              <div 
                onClick={() => setHyperdrive(!hyperdrive)}
                className={cn(
                  "p-8 rounded-[32px] border-4 transition-all cursor-pointer group flex items-center justify-between",
                  hyperdrive ? "bg-blue-600 border-blue-400 shadow-2xl shadow-blue-500/40" : "bg-slate-50 border-slate-100 border-dashed hover:border-blue-200"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn("h-16 w-16 rounded-full flex items-center justify-center transition-all", hyperdrive ? "bg-white text-blue-600 scale-110" : "bg-white text-slate-300")}>
                    <Zap className={cn("h-8 w-8", hyperdrive && "fill-blue-600")} />
                  </div>
                  <div>
                    <h4 className={cn("text-xl font-black uppercase tracking-tight", hyperdrive ? "text-white" : "text-slate-900")}>Hyperdrive Mode</h4>
                    <p className={cn("text-sm font-medium", hyperdrive ? "text-blue-100" : "text-slate-500")}>Apply additional {fmt(500)} principal monthly.</p>
                  </div>
                </div>
                <div className={cn("w-14 h-8 rounded-full relative transition-all", hyperdrive ? "bg-blue-400" : "bg-slate-200")}>
                  <div className={cn("absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all shadow-md", hyperdrive ? "translate-x-6" : "translate-x-0")} />
                </div>
              </div>
            </div>
          </CourseCard>

          <div className="bg-slate-900 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-white font-black text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" /> The 30-Day Velocity Cycle
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Watch the principal bounce</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500" /> Balance</div>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="day" hide />
                  <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    labelFormatter={(val) => `Day ${val}`}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBal)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-2 border-slate-100 rounded-[48px] p-10 shadow-2xl text-center space-y-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em]">Monthly Interest Cost</p>
              <h3 className="text-7xl font-black text-slate-900 tracking-tighter">{fmt(totalInt)}</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Calculated Daily</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Old Cost</p>
                <p className="text-xl font-black text-red-600">{fmt(traditionalInt)}</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
                <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Monthly Saved</p>
                <p className="text-xl font-black text-emerald-700">+{fmt(savings)}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-lg font-bold text-slate-900 leading-tight">
                <TranslatedText>{`By dropping the balance on Day 1, you effectively "choke" ${((savings/traditionalInt)*100).toFixed(0)}% of the interest before it even occurs.`}</TranslatedText>
              </p>
            </div>
          </div>

          <div className="p-8 bg-blue-50 border-2 border-blue-100 rounded-[32px] space-y-4">
            <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-blue-700">
              <RefreshCcw className="h-4 w-4" /> The Automation Edge
            </h4>
            <p className="text-sm text-blue-900/70 leading-relaxed font-medium">
              <TranslatedText>{`In ${country.name}, ${country.productShort}s recalculate nightly. This simulator proves that your income isn't just "spent"—it's an employee working 24/7 to cancel the bank's math.`}</TranslatedText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContractSimulator() {
  const { country } = useCourse();
  const [rate, setRate] = useState(country.avgRate + 0.5);
  const [limit, setLimit] = useState(250000);
  const [closingCosts, setClosingCosts] = useState(1500);
  const [annualFee, setAnnualFee] = useState(50);
  const [drawYears, setDrawYears] = useState(10);

  const trueApr = useMemo(() => {
    const totalFees = closingCosts + (annualFee * drawYears);
    const avgBal = limit * 0.5; // Assumes half-utilized on average
    const feeImpact = (totalFees / drawYears) / avgBal * 100;
    return rate + feeImpact;
  }, [rate, limit, closingCosts, annualFee, drawYears]);

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <CourseCard title="📄 Contract Parameter Audit" className="bg-white border-2 border-slate-100 shadow-xl rounded-[40px] p-10">
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Stated APR</span>
                    <span className="text-slate-900">{rate}%</span>
                  </div>
                  <input type="range" min="2" max="15" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Credit Limit</span>
                    <span className="text-slate-900">{fmt(limit)}</span>
                  </div>
                  <input type="range" min="10000" max="1000000" step="5000" value={limit} onChange={e => setLimit(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Closing Costs</span>
                    <span className="text-red-600">{fmt(closingCosts)}</span>
                  </div>
                  <input type="range" min="0" max="5000" step="100" value={closingCosts} onChange={e => setClosingCosts(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-red-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Annual Fee</span>
                    <span className="text-red-600">{fmt(annualFee)}</span>
                  </div>
                  <input type="range" min="0" max="500" step="5" value={annualFee} onChange={e => setAnnualFee(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-red-600" />
                </div>
              </div>
            </div>
          </CourseCard>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
            <div className="absolute top-0 right-0 p-8 opacity-5"><SearchCode className="h-48 w-48" /></div>
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">Real Effective APR</p>
              <h3 className="text-8xl font-black tracking-tighter">{trueApr.toFixed(2)}%</h3>
              <p className={cn(
                "text-sm font-bold uppercase tracking-widest px-4 py-1 rounded-full",
                trueApr <= rate + 0.5 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              )}>
                {trueApr <= rate + 0.5 ? "Efficient Product" : "Fee-Heavy / Audit Fees"}
              </p>
            </div>
            <div className="w-full pt-6 border-t border-white/10 relative z-10">
              <p className="text-xs text-slate-400 font-medium italic">
                <TranslatedText>{`In ${country.name}, ${country.regulatedBy} requires this 'True Cost' disclosure. Most banks hide it in the TIL or Disclosure Statement.`}</TranslatedText>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScriptGenerator() {
  const { country } = useCourse();
  const [ltv, setLtv] = useState('80');
  const [sweep, setSweep] = useState('yes');
  const [promo, setPromo] = useState('no');
  const [copied, setCopied] = useState(false);

  const script = useMemo(() => {
    const intro = `Hi, I'm looking to speak with a Senior Loan Officer regarding a first-lien ${country.productShort} refinance for my primary residence.`;
    const specs = `I'm specifically seeking a product with a ${ltv}% LTV limit and full transactionality. ${sweep === 'yes' ? "Does this account support an automated sweep from a linked checking account?" : "I need to ensure the account supports direct deposit and online bill pay directly against the principal."}`;
    const closing = `${promo === 'yes' ? "Are there any introductory teaser rates or 'promo stacking' options available for Tier 1 credit?" : "What is your current margin over the Prime rate for this position?"} I have audited my DTI and it is currently well within ${country.name} guidelines.`;
    
    return `${intro}\n\n${specs}\n\n${closing}`;
  }, [country, ltv, sweep, promo]);

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target LTV</label>
          <select value={ltv} onChange={e => setLtv(e.target.value)} className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none appearance-none">
            <option value="80">80% (Standard)</option>
            <option value="90">90% (Aggressive)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sweep Feature</label>
          <select value={sweep} onChange={e => setSweep(e.target.value)} className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none appearance-none">
            <option value="yes">Yes (Preferred)</option>
            <option value="no">No (Manual)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ask for Promo?</label>
          <select value={promo} onChange={e => setPromo(e.target.value)} className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none appearance-none">
            <option value="no">No</option>
            <option value="yes">Yes (Stacking)</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
          <MessageSquare className="h-32 w-32" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-black text-xs">MC</div>
              <span className="font-black text-xs uppercase tracking-[0.3em] text-blue-400">Generated Script</span>
            </div>
            <button onClick={copyScript} className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors">
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
          <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-slate-300 whitespace-pre-wrap">
            {script}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BankRateChart() {
  const { country } = useCourse();
  
  const data = useMemo(() => [
    { name: 'Month 1', mortgage: country.avgRate, line: country.avgRate + 1 },
    { name: 'Month 6', mortgage: country.avgRate, line: country.avgRate + 0.8 },
    { name: 'Month 12', mortgage: country.avgRate, line: country.avgRate + 1.2 },
    { name: 'Month 18', mortgage: country.avgRate, line: country.avgRate + 0.5 },
    { name: 'Month 24', mortgage: country.avgRate, line: country.avgRate + 0.2 },
  ], [country]);

  return (
    <div className="h-[300px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMort" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" hide />
          <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="mortgage" stroke="#ef4444" fillOpacity={1} fill="url(#colorMort)" strokeWidth={3} name="Fixed Mortgage" />
          <Area type="monotone" dataKey="line" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLine)" strokeWidth={3} name={`${country.productShort} Rate`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function QualificationCalc() {
  const { country } = useCourse();
  const [balance, setBalance] = useState(country.avgHome * 0.8);
  const [value, setValue] = useState(country.avgHome);
  const [income, setIncome] = useState(country.avgIncome);
  const [debts, setDebts] = useState(500);
  const [taxIns, setTaxIns] = useState(400);
  const [credit, setCredit] = useState(720);
  const [showConfetti, setShowConfetti] = useState(false);

  // Constants for math
  const rate = country.avgRate / 100 / 12;
  const stressRate = (country.avgRate + 2) / 100 / 12;
  const n = 30 * 12;

  // Monthly PITI estimation
  const pmt = balance * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  const stressPmt = balance * (stressRate * Math.pow(1 + stressRate, n)) / (Math.pow(1 + stressRate, n) - 1);
  
  const totalMonthly = pmt + debts + taxIns;
  const dti = (totalMonthly / income) * 100;
  const ltv = (balance / value) * 100;

  // Approval Odds Scoring (Logic based on PDF guidelines)
  const score = useMemo(() => {
    let s = 0;
    if (dti <= country.dtiLimit) s += 40;
    else if (dti <= 50) s += 20;

    if (ltv <= 80) s += 30;
    else if (ltv <= 90) s += 15;

    if (credit >= 740) s += 30;
    else if (credit >= 680) s += 20;
    else if (credit >= 620) s += 10;

    return s;
  }, [dti, ltv, credit, country.dtiLimit]);

  useEffect(() => {
    if (score >= 80) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [score]);

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS */}
        <div className="lg:col-span-7 space-y-8">
          <CourseCard title="🎚️ Strategy Inputs" className="bg-white border-2 border-slate-100 shadow-xl rounded-[40px] p-10">
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Loan Balance</span>
                    <span className="text-slate-900">{fmt(balance)}</span>
                  </div>
                  <input type="range" min="50000" max="2000000" step="10000" value={balance} onChange={e => setBalance(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Home Value</span>
                    <span className="text-slate-900">{fmt(value)}</span>
                  </div>
                  <input type="range" min="50000" max="2500000" step="10000" value={value} onChange={e => setValue(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Gross Monthly Income</span>
                    <span className="text-emerald-600">{fmt(income)}</span>
                  </div>
                  <input type="range" min="2000" max="50000" step="100" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-emerald-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Other Monthly Debts</span>
                    <span className="text-red-600">{fmt(debts)}</span>
                  </div>
                  <input type="range" min="0" max="5000" step="50" value={debts} onChange={e => setDebts(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Tax & Insurance (Monthly)</span>
                    <span className="text-slate-900">{fmt(taxIns)}</span>
                  </div>
                  <input type="range" min="0" max="2000" step="10" value={taxIns} onChange={e => setTaxIns(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-slate-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-slate-400">
                    <span>Credit Score</span>
                    <span className={cn("font-black", credit >= 700 ? "text-emerald-600" : "text-amber-600")}>{credit}</span>
                  </div>
                  <input type="range" min="300" max="850" step="1" value={credit} onChange={e => setCredit(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-600" />
                </div>
              </div>
            </div>
          </CourseCard>
        </div>

        {/* OUTPUTS / SCORECARD */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
            {showConfetti && <ConfettiBurst />}
            <div className="absolute top-0 right-0 p-8 opacity-5"><Target className="h-48 w-48" /></div>
            
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em]">Lender Probability</p>
              <h3 className="text-8xl font-black tracking-tighter">{score}%</h3>
              <p className={cn(
                "text-sm font-bold uppercase tracking-widest px-4 py-1 rounded-full",
                score >= 80 ? "bg-emerald-500/20 text-emerald-400" : score >= 50 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
              )}>
                {score >= 80 ? "Highly Likely" : score >= 50 ? "Marginal / Needs Hacks" : "Low Probability"}
              </p>
            </div>

            <div className="w-full space-y-4 pt-6 border-t border-white/10 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DTI Ratio</span>
                <span className={cn("text-lg font-black", dti <= country.dtiLimit ? "text-emerald-400" : "text-red-400")}>{dti.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">LTV (Loan-to-Value)</span>
                <span className={cn("text-lg font-black", ltv <= 80 ? "text-emerald-400" : "text-amber-400")}>{ltv.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stress PITI</span>
                <span className="text-lg font-black text-blue-400">{fmt(stressPmt)}</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-50 border-2 border-blue-100 rounded-[32px] space-y-4">
            <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-blue-700">
              <ShieldCheck className="h-4 w-4" /> Regional Rules: {country.name}
            </h4>
            <p className="text-sm text-blue-900/70 leading-relaxed font-medium">
              <TranslatedText>{`In ${country.name}, lenders typically cap your debt at ${country.dtiLimit}% of gross income. With your current numbers, your PITI (Principal, Interest, Taxes, Insurance) accounts for ${((pmt + taxIns) / income * 100).toFixed(1)}% of your earnings.`}</TranslatedText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InterestCalc() {
  const { country } = useCourse();
  const [loan, setLoan] = useState(country.avgHome);
  const [rate, setRate] = useState(country.avgRate);

  const monthlyRate = rate / 100 / 12;
  const totalMonths = country.amortYears * 12;
  const monthlyPayment = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPaid = monthlyPayment * totalMonths;
  const totalInterest = totalPaid - loan;
  const interestPercent = Math.round((totalInterest / loan) * 100);

  const hourlyCost = totalInterest / (country.amortYears * 365 * 24);
  const dailyCost = hourlyCost * 24;
  const weeklyCost = dailyCost * 7;

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <CourseCard title="🕵️ The 'House #2' Evidence Locker" className="border-l-8 border-l-red-600 shadow-2xl">
      <div className="space-y-10">
        <div className="space-y-8 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Total Loan Principal
              </label>
              <span className="text-2xl font-black text-slate-900">{fmt(loan)}</span>
            </div>
            <input type="range" min="100000" max="1500000" step="10000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <TrendingUp className="h-3 w-3" /> Interest Rate (APR)
              </label>
              <span className="text-2xl font-black text-red-600">{rate}%</span>
            </div>
            <input type="range" min="2" max="12" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-red-600 text-white p-10 rounded-[40px] text-center space-y-2 shadow-xl shadow-red-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><AlertCircle className="h-32 w-32" /></div>
            <p className="text-xs font-black uppercase tracking-[0.4em] opacity-80">Total Interest Siphon</p>
            <p className="text-6xl md:text-7xl font-black tracking-tighter">{fmt(totalInterest)}</p>
            <p className="text-lg font-bold opacity-90">That is {interestPercent}% of your home's price paid in pure profit to the bank.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-3xl text-center space-y-1 border border-white/5 group hover:bg-slate-800 transition-colors">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Hourly Drain</p>
              <p className="text-3xl font-black text-white">{fmt(hourlyCost).replace('.00', '')}<span className="text-sm opacity-40 ml-1">/hr</span></p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">While you sleep</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl text-center space-y-1 border border-white/5 group hover:bg-slate-800 transition-colors">
              <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Daily Drain</p>
              <p className="text-3xl font-black text-white">{fmt(dailyCost).replace('.00', '')}<span className="text-sm opacity-40 ml-1">/day</span></p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Every single day</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl text-center space-y-1 border border-white/5 group hover:bg-slate-800 transition-colors">
              <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Weekly Drain</p>
              <p className="text-3xl font-black text-white">{fmt(weeklyCost).replace('.00', '')}<span className="text-sm opacity-40 ml-1">/wk</span></p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Reliable Loss</p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-amber-50 border-4 border-dashed border-amber-200 rounded-[40px] text-center space-y-4">
          <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <Zap className="h-6 w-6 text-amber-600 fill-amber-600" />
          </div>
          <p className="text-xl text-amber-900 font-bold leading-relaxed">
            <TranslatedText>{`🚨 NOTICE: Your weekly interest drain is currently ${fmt(weeklyCost)}. The entire Mortgage Freedom Accelerator course costs less than one week of this loss. Every day you wait is another ${fmt(dailyCost)} handed to the bank for free.`}</TranslatedText>
          </p>
        </div>
      </div>
    </CourseCard>
  );
}

export function TruthCalculator() {
  const { country } = useCourse();
  const [balance, setBalance] = useState(country.avgHome);
  const [income, setIncome] = useState(country.avgIncome);
  const [expenses, setExpenses] = useState(Math.round(country.avgIncome * 0.6));

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white border-4 border-blue-600 rounded-[64px] p-10 md:p-16 shadow-2xl space-y-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
        <Scale className="h-64 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <div className="space-y-10">
          <div className="space-y-2">
            <h4 className="text-blue-600 font-black uppercase text-xs tracking-[0.4em] mb-4"><TranslatedText>Input Parameters</TranslatedText></h4>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between font-bold text-slate-900"><span>Current Balance</span> <span>{fmt(balance)}</span></div>
                <input type="range" min="100000" max="2000000" step="10000" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between font-bold text-slate-900"><span>Net Monthly Income</span> <span>{fmt(income)}</span></div>
                <input type="range" min="3000" max="30000" step="100" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between font-bold text-slate-900"><span>Non-Debt Expenses</span> <span>{fmt(expenses)}</span></div>
                <input type="range" min="1000" max="20000" step="100" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
            <h5 className="font-black text-xs uppercase text-slate-400 tracking-widest"><TranslatedText>{`Regional Constraints: ${country.name}`}</TranslatedText></h5>
            <ul className="space-y-3 text-sm font-bold text-slate-600">
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <TranslatedText>{`Stress Test: ${country.stressTest.split('.')[0]}`}</TranslatedText>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <TranslatedText>{`Regulated By: ${country.regulatedBy}`}</TranslatedText>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <TranslatedText>{`Max LTV: ${country.maxLTV}`}</TranslatedText>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-10">
          <div className="bg-slate-900 text-white p-12 rounded-[56px] shadow-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <Timer className="h-32 w-32 text-blue-400" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em] mb-4">Estimated Payoff Time</p>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-7xl font-black text-white tracking-tighter">
                  {Math.max(4, Math.round((balance / (income - expenses) / 12) * 10) / 10)}
                </span>
                <span className="text-2xl font-black text-blue-400 uppercase">Years</span>
              </div>
              <p className="text-lg font-bold text-slate-400 leading-tight">
                <TranslatedText>{`Instead of ${country.amortYears} years at ${country.banks[0]}.`}</TranslatedText>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-emerald-600 text-white p-8 rounded-[40px] text-center shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Net Surplus</p>
              <p className="text-3xl font-black">{fmt(income - expenses)}</p>
            </div>
            <div className="bg-blue-600 text-white p-8 rounded-[40px] text-center shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Velocity Score</p>
              <p className="text-3xl font-black">{Math.round(((income - expenses) / income) * 100)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AmortViz() {
  const { country } = useCourse();
  const [month, setMonth] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const loan = country.avgHome;
  const rate = country.avgRate;
  const totalMonths = country.amortYears * 12;
  const monthlyRate = rate / 100 / 12;
  const pmtValue = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

  useEffect(() => {
    let interval: any;
    if (isPlaying && month < totalMonths) {
      interval = setInterval(() => {
        setMonth(m => Math.min(m + 1, totalMonths));
      }, 30);
    } else if (month >= totalMonths) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, month, totalMonths]);

  const currentInterest = (loan * Math.pow(1 + monthlyRate, month - 1) - pmtValue * (Math.pow(1 + monthlyRate, month - 1) - 1) / monthlyRate) * monthlyRate;
  const interestPct = (currentInterest / pmtValue) * 100;
  
  let totalInterest = 0;
  let remainingBal = loan;
  for(let i = 1; i <= month; i++) {
    const int = remainingBal * monthlyRate;
    totalInterest += int;
    remainingBal -= (pmtValue - int);
  }

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <CourseCard title="⏱️ The Front-Loading Time Machine">
      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn("h-16 w-16 rounded-full text-white shadow-2xl transition-all active:scale-90 flex items-center justify-center", isPlaying ? "bg-red-600" : "bg-blue-600")}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </button>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center font-black uppercase text-xs tracking-widest text-slate-400">
              <span>Year {Math.floor(month/12)}</span>
              <span>Month {month} of {totalMonths}</span>
            </div>
            <input type="range" min="1" max={totalMonths} value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
          <button onClick={() => { setMonth(1); setIsPlaying(false); }} className="p-3 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><RotateCcw className="h-5 w-5"/></button>
        </div>

        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Monthly Check Distribution</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{fmt(pmtValue)}</span>
                <span className="text-sm font-bold text-slate-400 uppercase">Per Month</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1">Interest Bite</p>
              <p className="text-2xl font-black text-red-600">{Math.round(interestPct)}%</p>
            </div>
          </div>

          <div className="w-full h-10 bg-slate-200 rounded-2xl overflow-hidden flex shadow-inner">
            <div className="h-full bg-red-600 transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white px-2 overflow-hidden" style={{ width: `${interestPct}%` }}>
              {interestPct > 20 && "INTEREST"}
            </div>
            <div className="h-full bg-emerald-500 transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white px-2 overflow-hidden" style={{ width: `${100 - interestPct}%` }}>
              {100 - interestPct > 20 && "EQUITY"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatBox label="Total Paid" value={fmt(pmtValue * month)} />
          <StatBox label="To Bank" value={fmt(totalInterest)} colorClass="text-red-600" />
          <StatBox label="To Your Wall" value={fmt((pmtValue * month) - totalInterest)} colorClass="text-emerald-600" />
          <StatBox label="Still Owe" value={fmt(remainingBal)} />
        </div>

        {month >= 120 && month < 121 && (
          <div className="p-6 bg-amber-50 border-2 border-amber-100 rounded-3xl text-amber-900 space-y-2 animate-in slide-in-from-top-4">
            <p className="text-lg font-black flex items-center gap-2 uppercase tracking-tight"><Clock className="h-5 w-5" /> 10-Year Reality Check</p>
            <p className="font-medium text-sm leading-relaxed">You've been paying for a DECADE. Yet you've only paid off {Math.round(((pmtValue*120-totalInterest)/loan)*100)}% of the original loan principal. The rest was pure profit for the bank.</p>
          </div>
        )}
      </div>
    </CourseCard>
  );
}

export function PayoffRace() {
  const { country } = useCourse();
  const [loan, setLoan] = useState(country.avgHome);
  const [income, setIncome] = useState(country.avgIncome);
  const [expenses, setExpenses] = useState(Math.round(country.avgIncome * 0.55));

  const monthlyRate = country.avgRate / 100 / 12;
  const totalMonthsBase = country.amortYears * 12;
  const pmtBase = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonthsBase)) / (Math.pow(1 + monthlyRate, totalMonthsBase) - 1);
  const totalIntBase = pmtBase * totalMonthsBase - loan;

  let balance = loan;
  let monthsOpen = 0;
  let totalIntOpen = 0;
  const netCashflow = income - expenses;

  while (balance > 0 && monthsOpen < 600) {
    const monthInt = balance * (country.avgRate/100) / 12 * 0.75; // ADB factor
    totalIntOpen += monthInt;
    balance -= (netCashflow - monthInt);
    monthsOpen++;
  }

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <CourseCard title="🏎️ The High-Velocity Payoff Race">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Loan Principal</span><span>{fmt(loan)}</span></div>
              <input type="range" min="100000" max="1500000" step="10000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Net Income</span><span>{fmt(income)}</span></div>
              <input type="range" min="3000" max="25000" step="100" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Living Expenses</span><span>{fmt(expenses)}</span></div>
              <input type="range" min="1500" max="15000" step="100" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 p-6 rounded-[32px] text-white flex flex-col justify-center items-center h-full space-y-4 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="h-16 w-16 text-yellow-400" /></div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Accelerated Finish</p>
                <p className="text-5xl font-black">{(monthsOpen/12).toFixed(1)} <span className="text-lg opacity-50">Yrs</span></p>
              </div>
              <div className="flex gap-4 w-full pt-4 border-t border-white/10">
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Old Int.</p>
                  <p className="text-sm font-black text-red-400">{fmt(totalIntBase).replace('.00', '')}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">New Int.</p>
                  <p className="text-sm font-black text-emerald-400">{fmt(totalIntOpen).replace('.00', '')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-emerald-600 text-white rounded-[40px] text-center shadow-2xl shadow-emerald-500/30 group hover:scale-[1.02] transition-transform">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-2">Total Wealth Reclaimed</p>
          <p className="text-5xl md:text-6xl font-black mb-2">{fmt(totalIntBase - totalIntOpen)}</p>
          <p className="text-xl font-bold opacity-90 leading-tight">
            +{Math.round((country.amortYears - monthsOpen/12) * 10)/10} Years of your life back from the bank.
          </p>
        </div>
      </div>
    </CourseCard>
  );
}
