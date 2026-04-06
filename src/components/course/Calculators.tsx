
'use client';
import React, { useState, useEffect } from 'react';
import { useCourse } from './CourseProvider';
import { CourseCard, StatBox } from './UIComponents';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TranslatedText } from './TranslatedText';

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

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <CourseCard title="🔥 The Reality Check Calculator">
      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Loan Amount: {fmt(loan)}</label>
          <input type="range" min="100000" max="1500000" step="10000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Interest Rate: {rate}%</label>
          <input type="range" min="2" max="10" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatBox label="You Borrowed" value={fmt(loan)} />
          <StatBox label="Extra Interest" value={fmt(totalInterest)} colorClass="text-[#DC2626]" />
          <StatBox label="TOTAL You Pay" value={fmt(totalPaid)} colorClass="text-[#D97706]" />
        </div>

        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-[#059669]" style={{ width: `${(loan / totalPaid) * 100}%` }}></div>
          <div className="h-full bg-[#DC2626]" style={{ width: `${(totalInterest / totalPaid) * 100}%` }}></div>
        </div>

        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm font-bold text-center">
          😱 <TranslatedText>{`You're paying an extra ${interestPercent}% — that's ${fmt(totalInterest)} going straight to the lender.`}</TranslatedText>
        </div>
      </div>
    </CourseCard>
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
  const pmt = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

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

  const currentInterest = (loan * Math.pow(1 + monthlyRate, month - 1) - pmt * (Math.pow(1 + monthlyRate, month - 1) - 1) / monthlyRate) * monthlyRate;
  const currentPrincipal = pmt - currentInterest;
  const interestPct = (currentInterest / pmt) * 100;
  
  let totalInterest = 0;
  let remainingBal = loan;
  for(let i = 1; i <= month; i++) {
    const int = remainingBal * monthlyRate;
    totalInterest += int;
    remainingBal -= (pmt - int);
  }

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <CourseCard title="📊 Watch the interest trap in real-time">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn("p-3 rounded-full text-white shadow-lg transition-transform active:scale-95", isPlaying ? "bg-[#DC2626]" : "bg-[#2563EB]")}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <button onClick={() => { setMonth(1); setIsPlaying(false); }} className="p-2 text-slate-400 hover:text-slate-600"><RotateCcw className="h-5 w-5"/></button>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-600">Month {month} of {totalMonths} <span className="text-slate-400 font-normal">(Year {Math.floor(month/12)})</span></p>
            <input type="range" min="1" max={totalMonths} value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
            <span>Interest ({Math.round(interestPct)}%)</span>
            <span>Principal ({Math.round(100 - interestPct)}%)</span>
          </div>
          <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
            <div className="h-full bg-[#DC2626] transition-all duration-300" style={{ width: `${interestPct}%` }}></div>
            <div className="h-full bg-[#059669] transition-all duration-300" style={{ width: `${100 - interestPct}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatBox label="Paid So Far" value={fmt(pmt * month)} />
          <StatBox label="→ Lender" value={fmt(totalInterest)} colorClass="text-red-600" />
          <StatBox label="→ Your Equity" value={fmt((pmt * month) - totalInterest)} colorClass="text-green-600" />
          <StatBox label="Still Owe" value={fmt(remainingBal)} />
        </div>

        {month >= 60 && month < 61 && <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-xs font-bold animate-bounce text-center"><TranslatedText>{`📢 After 5 years of payments, only ${Math.round(((pmt*60-totalInterest)/loan)*100)}% went to your equity!`}</TranslatedText></div>}
        {month >= totalMonths && <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-bold text-center"><TranslatedText>{`🏁 Done! You paid ${fmt(pmt * totalMonths)} for a ${fmt(loan)} home.`}</TranslatedText></div>}
      </div>
    </CourseCard>
  );
}

export function PayoffRace() {
  const { country } = useCourse();
  const [loan, setLoan] = useState(country.avgHome);
  const [income, setIncome] = useState(country.avgIncome);
  const [expenses, setExpenses] = useState(Math.round(country.avgIncome * 0.55));

  // Sim
  const monthlyRate = country.avgRate / 100 / 12;
  const totalMonthsBase = country.amortYears * 12;
  const pmtBase = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonthsBase)) / (Math.pow(1 + monthlyRate, totalMonthsBase) - 1);
  const totalIntBase = pmtBase * totalMonthsBase - loan;

  let balance = loan;
  let monthsOpen = 0;
  let totalIntOpen = 0;
  const netCashflow = income - expenses;

  while (balance > 0 && monthsOpen < 600) {
    const monthInt = balance * (country.avgRate/100) / 12 * 0.72;
    totalIntOpen += monthInt;
    balance -= (netCashflow - monthInt);
    monthsOpen++;
  }

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: country.currency, maximumFractionDigits: 0 }).format(val);

  return (
    <CourseCard title="🏁 The Payoff Race — Your Numbers">
      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Loan: {fmt(loan)}</label>
          <input type="range" min="100000" max="1500000" step="10000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Net Monthly Income: {fmt(income)}</label>
          <input type="range" min="3000" max="25000" step="100" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Monthly Expenses: {fmt(expenses)}</label>
          <input type="range" min="1500" max="15000" step="100" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
            <p className="text-xs font-bold uppercase text-red-400">Traditional Loan</p>
            <p className="text-2xl font-black text-red-700">{country.amortYears} Years</p>
            <p className="text-sm text-red-600">Interest: {fmt(totalIntBase)}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
            <p className="text-xs font-bold uppercase text-emerald-400">{country.productShort}</p>
            <p className="text-2xl font-black text-emerald-700">{Math.round(monthsOpen/12 * 10)/10} Years</p>
            <p className="text-sm text-emerald-600">Interest: {fmt(totalIntOpen)}</p>
          </div>
        </div>

        <div className="bg-emerald-600 p-6 rounded-2xl text-white text-center shadow-xl shadow-emerald-200">
          <p className="text-xs font-bold uppercase opacity-80">Your Savings</p>
          <p className="text-4xl font-black">{fmt(totalIntBase - totalIntOpen)}</p>
          <p className="text-lg font-medium mt-1">+{Math.round((country.amortYears - monthsOpen/12) * 10)/10} Years of your life back</p>
        </div>
      </div>
    </CourseCard>
  );
}
