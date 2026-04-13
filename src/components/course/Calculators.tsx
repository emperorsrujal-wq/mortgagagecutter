'use client';
import React, { useState, useEffect } from 'react';
import { useCourse } from './CourseProvider';
import { CourseCard, StatBox } from './UIComponents';
import { Play, Pause, RotateCcw, TrendingUp, DollarSign, Clock, Zap, AlertCircle, Calendar, Timer } from 'lucide-react';
import { TranslatedText } from './TranslatedText';
import { cn } from '@/lib/utils';

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

  // Time-based cost simulators
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

        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            <span>The Home ({Math.round((loan / totalPaid) * 100)}%)</span>
            <span>The Heist ({Math.round((totalInterest / totalPaid) * 100)}%)</span>
          </div>
          <div className="w-full h-8 bg-slate-100 rounded-2xl overflow-hidden flex shadow-inner border-2 border-white">
            <div className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" style={{ width: `${(loan / totalPaid) * 100}%` }}></div>
            <div className="h-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]" style={{ width: `${(totalInterest / totalPaid) * 100}%` }}></div>
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
