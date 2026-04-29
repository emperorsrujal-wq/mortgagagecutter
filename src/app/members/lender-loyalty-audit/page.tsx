'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeftRight, 
  Info, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  History, 
  Gavel, 
  Coins, 
  Calculator 
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function LenderLoyaltyAuditPage() {
  const [form, setForm] = useState({
    currentBalance: 450000,
    currentRate: 6.25,
    remainingTermMonths: 60, // 5 year term remaining usually
    newRate: 5.25,
    newTermYears: 5,
    penalty: 4500,
    legalFees: 1200,
    appraisalFees: 400,
    dischargeFees: 300,
  });

  const results = useMemo(() => {
    const bal = form.currentBalance;
    const termMonths = form.newTermYears * 12;
    
    // Current interest over comparison term
    const monthlyRateOld = (form.currentRate / 100) / 12;
    // Simple interest estimation for short-term comparison (standard bank method)
    const oldInterest = bal * monthlyRateOld * termMonths;

    // New interest over comparison term
    const monthlyRateNew = (form.newRate / 100) / 12;
    const newInterest = bal * monthlyRateNew * termMonths;

    const switchingCosts = form.penalty + form.legalFees + form.appraisalFees + form.dischargeFees;
    const interestSavings = oldInterest - newInterest;
    const netBenefit = interestSavings - switchingCosts;
    
    const monthlySavings = (oldInterest - newInterest) / termMonths;
    const breakEvenMonths = switchingCosts / monthlySavings;

    return {
      oldInterest,
      newInterest,
      interestSavings,
      switchingCosts,
      netBenefit,
      monthlySavings,
      breakEvenMonths,
      isWorthIt: netBenefit > 0
    };
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen space-y-10">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 mb-4">
          <Scale className="h-4 w-4" />
          Member Tool: Lender Loyalty Audit™
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Switch vs. Stay Simulator</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Should you break your current mortgage for a better rate? Our forensic audit calculates the "Net Benefit" after every penalty and hidden fee.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b bg-slate-50/50 rounded-t-lg">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-700">
                <History className="h-4 w-4 text-slate-400" />
                1. Your Current Hand
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Outstanding Balance</Label>
                <Input type="number" name="currentBalance" value={form.currentBalance} onChange={handleChange} className="font-mono font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Rate (%)</Label>
                  <Input type="number" step="0.01" name="currentRate" value={form.currentRate} onChange={handleChange} className="font-mono font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Remaining Months</Label>
                  <Input type="number" name="remainingTermMonths" value={form.remainingTermMonths} onChange={handleChange} className="font-mono font-bold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-l-blue-600">
            <CardHeader className="pb-4 border-b bg-slate-50/50 rounded-t-lg">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-700">
                <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                2. The New Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Rate (%)</Label>
                  <Input type="number" step="0.01" name="newRate" value={form.newRate} onChange={handleChange} className="font-mono font-bold border-blue-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Term (Years)</Label>
                  <Input type="number" name="newTermYears" value={form.newTermYears} onChange={handleChange} className="font-mono font-bold border-blue-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b bg-red-50/50 rounded-t-lg">
              <CardTitle className="text-base font-black flex items-center gap-2 text-red-700">
                <Gavel className="h-4 w-4" />
                3. The Switching Friction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Prepayment Penalty</Label>
                    <TooltipProvider><Tooltip><TooltipTrigger><Info className="h-3 w-3 text-slate-400"/></TooltipTrigger><TooltipContent><p className="w-48 text-xs">Usually 3 months interest or IRD. Check your current bank statement.</p></TooltipContent></Tooltip></TooltipProvider>
                  </div>
                  <Input type="number" name="penalty" value={form.penalty} onChange={handleChange} className="font-mono font-bold text-red-600" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Legal/Lawyer Fees</Label>
                  <Input type="number" name="legalFees" value={form.legalFees} onChange={handleChange} className="font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Appraisal Fee</Label>
                  <Input type="number" name="appraisalFees" value={form.appraisalFees} onChange={handleChange} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Discharge/Admin Fee</Label>
                  <Input type="number" name="dischargeFees" value={form.dischargeFees} onChange={handleChange} className="font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className={cn(
            "p-8 rounded-[48px] shadow-2xl text-center space-y-6 relative overflow-hidden transition-all duration-700",
            results.isWorthIt ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
          )}>
            <div className="absolute top-0 right-0 p-12 opacity-5">
              {results.isWorthIt ? <CheckCircle2 className="h-64 w-64" /> : <AlertCircle className="h-64 w-64" />}
            </div>
            
            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-70">The Net Verdict</p>
              <h2 className="text-7xl font-black tracking-tighter">
                {results.isWorthIt ? "SWITCH" : "STAY"}
              </h2>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 inline-block px-8 py-4 rounded-3xl mt-4">
                <p className="text-[10px] font-black uppercase text-white/60 mb-1">Estimated Net Benefit</p>
                <p className="text-4xl font-black">{currencyFormatter.format(Math.abs(results.netBenefit))}</p>
                <p className="text-[10px] font-bold mt-1 opacity-70">Over the next {form.newTermYears} years</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-white/50">Break-Even Point</p>
                <p className="text-3xl font-black">{results.breakEvenMonths.toFixed(1)} <span className="text-sm opacity-50 uppercase">Months</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-white/50">Monthly Interest Saved</p>
                <p className="text-3xl font-black">{currencyFormatter.format(results.monthlySavings)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-slate-100 shadow-xl rounded-[32px] overflow-hidden">
               <CardHeader className="bg-slate-50 border-b pb-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Path Cost</p>
               </CardHeader>
               <CardContent className="pt-8 text-center space-y-2">
                  <p className="text-4xl font-black text-slate-900">{currencyFormatter.format(results.oldInterest)}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase">Interest over {form.newTermYears}y</p>
               </CardContent>
            </Card>

            <Card className="bg-white border-slate-100 shadow-xl rounded-[32px] overflow-hidden">
               <CardHeader className="bg-blue-50 border-b border-blue-100 pb-4">
                  <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">New Path Cost</p>
               </CardHeader>
               <CardContent className="pt-8 text-center space-y-2">
                  <p className="text-4xl font-black text-blue-600">{currencyFormatter.format(results.newInterest + results.switchingCosts)}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase">Interest + Friction Fees</p>
               </CardContent>
            </Card>
          </div>

          <Alert className="bg-white border-slate-200 rounded-[32px] p-8 shadow-sm">
             <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                   <Coins className="h-6 w-6 text-slate-600" />
                </div>
                <div className="space-y-2">
                   <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Switching Cost Breakdown</h4>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Your total "Friction Cost" is <strong>{currencyFormatter.format(results.switchingCosts)}</strong>. 
                      Lenders often "roll" these costs into the new loan, meaning you pay interest on your penalty for decades. 
                      The Lender Loyalty Audit™ identifies if the lower rate actually overcomes this headwind.
                   </p>
                </div>
             </div>
          </Alert>

          {!results.isWorthIt && (
            <Alert variant="destructive" className="rounded-[32px] p-8">
              <div className="flex gap-4">
                <XCircle className="h-10 w-10 shrink-0" />
                <div className="space-y-1">
                  <AlertTitle className="font-black uppercase tracking-tight">Financial Warning</AlertTitle>
                  <AlertDescription className="font-medium opacity-90">
                    Switching now would result in a net loss of {currencyFormatter.format(Math.abs(results.netBenefit))}. 
                    The prepayment penalty alone wipes out the benefit of the lower rate. 
                    Consider waiting until your current term is closer to renewal.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-[32px]">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Disclaimer: Projections are based on current data and standard bank calculations. Always request a formal "Discharge Statement" from your current lender to verify actual penalties before signing a new contract.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
