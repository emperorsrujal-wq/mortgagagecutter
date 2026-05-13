'use client';

import React, { useState, useEffect } from 'react';
import { simulate, Inputs, Outputs } from '@/lib/chunker';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Loader2, Save, Zap, TrendingDown, CheckCircle2, ChevronDown, ChevronUp, Table as TableIcon, ShieldCheck, Landmark } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { doc, setDoc, serverTimestamp, collection, query, limit, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const initial: Inputs = {
  mortgageBalance: 600000,
  mortgageAPR: 5.5,
  termMonthsRemaining: 300,
  monthlyMortgagePayment: undefined,
  homeValue: 750000,
  monthlyMI: 0,
  netIncome: 9000,
  livingExpenses: 4500,
  savings: { savings: 0, chequing: 0, shortTerm: 0 },
  helocAPR: 7.5,
  helocLimit: 40000,
  helocOpeningBalance: 0,
  readvanceable: true,
  chunkMode: 'AUTO',
  fixedChunkAmount: 10000,
  billTiming: 'OPTIMIZED',
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function ChunkerCalculatorPage() {
  const [form, setForm] = useState<Inputs>(initial);
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');
  const [termValue, setTermValue] = useState<number>(25);
  const [res, setRes] = useState<Outputs | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const { user, isUserLoading } = useAuthGuard();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      if (!user || !firestore) return;
      const q = query(collection(firestore, 'leads', user.uid, 'chunkerStates'), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const savedInputs = snap.docs[0].data().inputs as Inputs;
        setForm(savedInputs);
        if (savedInputs.termMonthsRemaining % 12 === 0) {
          setTermUnit('years');
          setTermValue(savedInputs.termMonthsRemaining / 12);
        } else {
          setTermUnit('months');
          setTermValue(savedInputs.termMonthsRemaining);
        }
      }
    }
    loadData();
  }, [user, isUserLoading, firestore]);

  const onChange = <K extends keyof Inputs>(k: K, v: Inputs[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const onSavingsChange = (k: keyof Inputs['savings'], v: string) => {
    const val = parseFloat(v) || 0;
    setForm(f => ({
      ...f,
      savings: { ...f.savings, [k]: val }
    }));
  };

  useEffect(() => {
    const months = termUnit === 'years' ? termValue * 12 : termValue;
    onChange('termMonthsRemaining', months);
  }, [termValue, termUnit]);

  const handleSave = async () => {
    if (!user || !firestore) return;
    setIsSaving(true);
    try {
      await setDoc(doc(firestore, 'leads', user.uid, 'chunkerStates', 'current'), {
        userId: user.uid,
        inputs: form,
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Configuration Stored", description: "Your strategy parameters have been updated." });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not persist your settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const run = () => {
    const out = simulate(form);
    setRes(out);
  };

  if (isUserLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen space-y-10">
      
      {/* STRATEGIC EXPLAINER */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">HELOC-Assist Chunker™ Simulator</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">Model the mathematical efficiency of strategic principal prepayment using dynamic credit lines.</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-600 text-sm font-black uppercase flex items-center gap-2">
                <Landmark className="h-4 w-4" /> 1. Optimize Cash Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">Deposit all income directly into the credit line to neutralize daily interest charges immediately.</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-green-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-600 text-sm font-black uppercase flex items-center gap-2">
                <Zap className="h-4 w-4" /> 2. Execute Principal Chunks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">Execute strategic prepayments to the mortgage principal, shortening the amortization trap instantly.</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-purple-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-600 text-sm font-black uppercase flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> 3. Systematic Recovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">Utilize monthly net surplus to recover the credit line balance and repeat the cycle until debt-free.</p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">Strategy Intelligence</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-bold text-blue-400">Payment Integrity</p>
              <p className="text-slate-400 leading-relaxed">The simulator maintains all required monthly installments while calculating the added impact of surplus velocity.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-blue-400">Structural Requirements</p>
              <p className="text-slate-400 leading-relaxed">Optimal results typically require a first-lien revolving line or a robust readvanceable mortgage structure.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-blue-400">Surplus Efficiency</p>
              <p className="text-slate-400 leading-relaxed">Even minimal monthly surpluses generate exponential savings due to the mechanics of daily interest recalculation.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b bg-slate-50/50 rounded-t-lg">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-700">
                <span className="bg-slate-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px]">01</span>
                Mortgage Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mortgage Balance</Label>
                  <Input type="number" value={form.mortgageBalance} onChange={e => onChange("mortgageBalance", Number(e.target.value))} className="font-mono font-bold"/>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mortgage APR (%)</Label>
                  <Input type="number" step="0.01" value={form.mortgageAPR} onChange={e => onChange("mortgageAPR", Number(e.target.value))} className="font-mono font-bold"/>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Remaining Term</Label>
                  <Tabs value={termUnit} onValueChange={(v: any) => setTermUnit(v)} className="h-7">
                    <TabsList className="grid w-full grid-cols-2 h-7 bg-slate-100">
                      <TabsTrigger value="years" className="text-[10px] h-6">Years</TabsTrigger>
                      <TabsTrigger value="months" className="text-[10px] h-6">Months</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Input type="number" value={termValue} onChange={e => setTermValue(Number(e.target.value))} className="font-mono font-bold"/>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Fixed Monthly Payment (Optional)</Label>
                <Input type="number" placeholder="P&I Calculated Automatically" value={form.monthlyMortgagePayment || ''} onChange={e => onChange("monthlyMortgagePayment", parseFloat(e.target.value) || undefined)} className="bg-slate-50"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Appraised Value</Label>
                  <Input type="number" value={form.homeValue || ''} onChange={e => onChange("homeValue", parseFloat(e.target.value) || undefined)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Monthly Insurance</Label>
                  <Input type="number" value={form.monthlyMI || ''} onChange={e => onChange("monthlyMI", parseFloat(e.target.value) || 0)}/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-l-blue-600">
            <CardHeader className="pb-4 border-b bg-slate-50/50 rounded-t-lg">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-700">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px]">02</span>
                Cash Flow & Credit Line
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Net Monthly Income</Label>
                  <Input type="number" value={form.netIncome} onChange={e => onChange("netIncome", Number(e.target.value))} className="font-mono font-bold border-blue-100"/>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Monthly Expenses</Label>
                  <Input type="number" value={form.livingExpenses} onChange={e => onChange("livingExpenses", Number(e.target.value))} className="font-mono font-bold border-blue-100"/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">HELOC APR</Label>
                  <Input type="number" step="0.01" value={form.helocAPR} onChange={e => onChange("helocAPR", Number(e.target.value))} className="font-mono font-bold"/>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Credit Limit</Label>
                  <Input type="number" value={form.helocLimit} onChange={e => onChange("helocLimit", Number(e.target.value))} className="font-mono font-bold"/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b bg-slate-50/50 rounded-t-lg">
              <CardTitle className="text-base font-black flex items-center gap-2 text-slate-700">
                <span className="bg-slate-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px]">03</span>
                Liquidity Injection (Initial)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500">Savings</Label>
                  <Input type="number" value={form.savings.savings} onChange={e => onSavingsChange("savings", e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500">Chequing</Label>
                  <Input type="number" value={form.savings.chequing} onChange={e => onSavingsChange("chequing", e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500">Short-Term</Label>
                  <Input type="number" value={form.savings.shortTerm} onChange={e => onSavingsChange("shortTerm", e.target.value)}/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white border-primary/20">
            <CardHeader className="pb-4 border-b bg-primary/5 rounded-t-lg">
              <CardTitle className="text-base font-black flex items-center gap-2 text-primary">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px]">04</span>
                Execution Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-black text-slate-500">Chunk Methodology</Label>
                <RadioGroup value={form.chunkMode} onValueChange={(v: any) => onChange("chunkMode", v)} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AUTO" id="auto" />
                    <Label htmlFor="auto" className="cursor-pointer font-bold">Dynamic (Auto)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FIXED" id="fixed" />
                    <Label htmlFor="fixed" className="cursor-pointer font-bold">Fixed Amount</Label>
                  </div>
                </RadioGroup>
                {form.chunkMode === 'FIXED' && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-[10px] font-bold text-slate-500">Target Chunk Size ($)</Label>
                    <Input type="number" value={form.fixedChunkAmount} onChange={e => onChange("fixedChunkAmount", Number(e.target.value))} className="bg-slate-50 font-mono" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-black text-slate-500">Cash Flow Timing</Label>
                <RadioGroup value={form.billTiming} onValueChange={(v: any) => onChange("billTiming", v)} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OPTIMIZED" id="optimized" />
                    <Label htmlFor="optimized" className="cursor-pointer font-bold">Max Velocity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TYPICAL" id="typical" />
                    <Label htmlFor="typical" className="cursor-pointer font-bold">Standard</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-0.5">
                  <Label className="text-sm font-black">Readvanceable Limit?</Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Automatic credit expansion as principal drops.</p>
                </div>
                <Switch checked={form.readvanceable} onCheckedChange={(v) => onChange("readvanceable", v)} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4 border-t">
              <Button onClick={run} className="w-full h-14 text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform">
                <Zap className="mr-2 h-6 w-6 fill-current" /> Execute Simulation
              </Button>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={handleSave} disabled={isSaving} className="flex-1 font-bold">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Profile
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-7">
          {res ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* PERFORMANCE METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-emerald-600 text-white shadow-2xl border-none overflow-hidden relative group">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-2">
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-70">Total Interest Saved</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-black">{currencyFormatter.format(res.totals.interestSaved)}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-xl border-l-4 border-l-primary bg-white">
                  <CardHeader className="pb-2">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Amortization Cut</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-black text-slate-900">{res.totals.monthsSaved} <span className="text-sm font-bold text-slate-400">Months</span></p>
                  </CardContent>
                </Card>
                <Card className="shadow-xl bg-white">
                  <CardHeader className="pb-2">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">MI/CMHC Avoided</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-black text-slate-900">{currencyFormatter.format(res.totals.miSaved)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* SIDE-BY-SIDE ANALYTICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-slate-100">
                  <CardHeader className="bg-slate-50 border-b pb-4">
                    <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest">Baseline Path (Traditional)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between text-sm font-medium text-slate-600"><span>Term:</span> <span className="font-black text-slate-900">{res.baseline.months} Months</span></div>
                    <div className="flex justify-between text-sm font-medium text-slate-600"><span>Total Interest:</span> <span className="font-black text-red-600">{currencyFormatter.format(res.baseline.totalInterest)}</span></div>
                    <div className="flex justify-between text-sm font-medium text-slate-600"><span>Total MI:</span> <span className="font-black text-slate-900">{currencyFormatter.format(res.baseline.totalMI)}</span></div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-emerald-100 shadow-xl scale-[1.02] z-10">
                  <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-4">
                    <CardTitle className="text-xs font-black text-emerald-700 uppercase tracking-widest">Accelerated Strategy (Chunker)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between text-sm font-medium text-slate-600"><span>Term:</span> <span className="font-black text-emerald-700">{res.strategy.months} Months</span></div>
                    <div className="flex justify-between text-sm font-medium text-slate-600"><span>Total Interest:</span> <span className="font-black text-emerald-700">{currencyFormatter.format(res.strategy.totalInterest)}</span></div>
                    <div className="flex justify-between text-sm font-medium text-slate-600"><span>Total MI:</span> <span className="font-black text-emerald-700">{currencyFormatter.format(res.strategy.totalMI)}</span></div>
                  </CardContent>
                </Card>
              </div>

              {/* EXECUTION DETAILS */}
              <div className="flex flex-wrap gap-4 items-center p-4 bg-slate-900 text-white rounded-2xl shadow-lg">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Selected Mode</p>
                  <p className="font-black text-blue-400">{res.strategyType}</p>
                </div>
                <div className="h-10 w-px bg-slate-800 hidden sm:block" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Optimal First Chunk</p>
                  <p className="font-black text-green-400">{currencyFormatter.format(res.optimalChunkSize || 0)}</p>
                </div>
              </div>

              {/* TRAJECTORY CHART */}
              <Card className="p-8 shadow-2xl border-none bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900">Wealth Accumulation Trajectory</CardTitle>
                    <CardDescription className="font-medium">Strategic Total Debt vs. Traditional Amortization</CardDescription>
                  </div>
                  <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2 text-slate-400"><span className="w-3 h-3 rounded-full bg-slate-200"></span> Old Path</div>
                    <div className="flex items-center gap-2 text-emerald-600"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Accelerated Path</div>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ChartContainer config={{
                    baselineBal: { label: "Baseline Mortgage", color: "hsl(var(--muted))" },
                    strategyBal: { label: "Strategy Total Debt", color: "hsl(var(--primary))" }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={res.timeline.filter((_, i) => i % Math.max(1, Math.floor(res.timeline.length / 60)) === 0)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(v) => `Yr ${Math.floor(v/12)}`} 
                          axisLine={false}
                          tickLine={false}
                          className="text-[10px] font-bold text-slate-400"
                          dy={10}
                        />
                        <YAxis 
                          tickFormatter={(v) => `${Math.floor(v/1000)}k`} 
                          axisLine={false}
                          tickLine={false}
                          className="text-[10px] font-bold text-slate-400"
                          dx={-10}
                        />
                        <RechartsTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="baselineBal" 
                          stroke="#e2e8f0" 
                          strokeWidth={3}
                          dot={false} 
                          name="Baseline Mortgage" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="strategyBal" 
                          stroke="#10b981" 
                          strokeWidth={4}
                          dot={false} 
                          name="Strategy Total Debt" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </Card>

              {/* DETAILED LEDGER */}
              <Collapsible open={showTimeline} onOpenChange={setShowTimeline} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full h-12 font-black border-slate-300 hover:bg-slate-50">
                    <TableIcon className="mr-2 h-4 w-4" /> 
                    {showTimeline ? "Collapse Monthly Ledger" : "Audit Detailed Monthly Ledger"}
                    {showTimeline ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 pt-4 border-t">
                  <div className="max-h-[600px] overflow-auto border rounded-xl shadow-inner bg-slate-50/50">
                    <Table>
                      <TableHeader className="bg-slate-900 sticky top-0 z-20">
                        <TableRow className="hover:bg-slate-900">
                          <TableHead className="w-16 text-white font-black text-[10px] uppercase">Month</TableHead>
                          <TableHead className="text-white font-black text-[10px] uppercase">Mortgage Bal</TableHead>
                          <TableHead className="text-white font-black text-[10px] uppercase">Int. Paid</TableHead>
                          <TableHead className="text-white font-black text-[10px] uppercase">Prin. Paid</TableHead>
                          <TableHead className="text-white font-black text-[10px] uppercase">HELOC Bal</TableHead>
                          <TableHead className="text-white font-black text-[10px] uppercase">Chunk App.</TableHead>
                          <TableHead className="text-white font-black text-[10px] uppercase">HELOC Int</TableHead>
                          <TableHead className="text-white font-black text-[10px] uppercase">MI</TableHead>
                          <TableHead className="text-white font-black text-[10px] uppercase">Surplus Used</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {res.timeline.slice(0, 300).map((row) => (
                          <TableRow key={row.month} className={cn("hover:bg-blue-50 transition-colors", row.month === 0 ? "bg-slate-100 font-bold" : "")}>
                            <TableCell className="font-bold text-slate-400">{row.month}</TableCell>
                            <TableCell className="font-mono">{currencyFormatter.format(row.mortgageBal)}</TableCell>
                            <TableCell className="font-mono text-red-500">{currencyFormatter.format(row.mortgageInterestPaid)}</TableCell>
                            <TableCell className="font-mono text-emerald-600">{currencyFormatter.format(row.mortgagePrincipalPaid)}</TableCell>
                            <TableCell className="font-mono font-black text-slate-900">{currencyFormatter.format(row.helocBal)}</TableCell>
                            <TableCell className={cn("font-mono font-bold", row.chunkApplied > 0 ? "text-blue-600 bg-blue-50" : "text-slate-300")}>
                              {row.chunkApplied > 0 ? currencyFormatter.format(row.chunkApplied) : '—'}
                            </TableCell>
                            <TableCell className="font-mono text-red-400">{currencyFormatter.format(row.helocInterest)}</TableCell>
                            <TableCell className="font-mono text-slate-400">{row.mi > 0 ? currencyFormatter.format(row.mi) : '—'}</TableCell>
                            <TableCell className="font-mono text-blue-500">{currencyFormatter.format(row.surplusUsed)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 italic font-medium">Audit limited to first 300 cycles for interface performance.</p>
                </CollapsibleContent>
              </Collapsible>

              <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-[32px] bg-white">
                <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto">
                  Disclaimer: This simulator provides mathematical projections based on idealized cash-flow velocity. Real-world results are subject to lender-specific fee structures, variable rate volatility, and account-specific drawdown constraints. Educational use only.
                </p>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-4 border-dashed rounded-[48px] p-16 text-center bg-white/50 space-y-6">
              <div className="bg-slate-100 p-8 rounded-full shadow-inner">
                <TrendingDown className="h-16 w-16 text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Awaiting Simulation Parameters</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">Configure your mortgage architecture and cash-flow velocity on the left to generate your custom liquidation blueprint.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
