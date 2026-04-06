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
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Loader2, Save, Info, HelpCircle, Zap, TrendingDown } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp, collection, query, limit, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

export default function ChunkerCalculatorPage() {
  const [form, setForm] = useState<Inputs>(initial);
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');
  const [termValue, setTermValue] = useState<number>(25);
  const [res, setRes] = useState<Outputs | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
      return;
    }

    async function loadData() {
      if (!user || !firestore) return;
      const q = query(collection(firestore, 'leads', user.uid, 'chunkerStates'), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const savedInputs = snap.docs[0].data().inputs as Inputs;
        setForm(savedInputs);
        // Sync term display
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
  }, [user, isUserLoading, router, firestore]);

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
      toast({ title: "Inputs Saved", description: "Your data will be pre-filled next time." });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your inputs.' });
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">HELOC-Assist Chunker Estimator</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Turn credit access into principal destruction. Use the chunk method to nuke interest without switching lenders.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Mortgage Details */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                Mortgage Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mortgage Balance</Label>
                  <Input type="number" value={form.mortgageBalance} onChange={e => onChange("mortgageBalance", Number(e.target.value))}/>
                </div>
                <div className="space-y-2">
                  <Label>Mortgage APR (%)</Label>
                  <Input type="number" step="0.01" value={form.mortgageAPR} onChange={e => onChange("mortgageAPR", Number(e.target.value))}/>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Term Remaining</Label>
                  <Tabs value={termUnit} onValueChange={(v: any) => setTermUnit(v)} className="h-8">
                    <TabsList className="grid w-full grid-cols-2 h-8">
                      <TabsTrigger value="years" className="text-[10px] h-7">Years</TabsTrigger>
                      <TabsTrigger value="months" className="text-[10px] h-7">Months</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Input type="number" value={termValue} onChange={e => setTermValue(Number(e.target.value))}/>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Monthly Payment (Optional)</Label>
                <Input type="number" placeholder="Calculated if empty" value={form.monthlyMortgagePayment || ''} onChange={e => onChange("monthlyMortgagePayment", parseFloat(e.target.value) || undefined)}/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Home Value (Optional)</Label>
                  <Input type="number" value={form.homeValue || ''} onChange={e => onChange("homeValue", parseFloat(e.target.value) || undefined)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Monthly MI/CMHC (Optional)</Label>
                  <Input type="number" value={form.monthlyMI || ''} onChange={e => onChange("monthlyMI", parseFloat(e.target.value) || 0)}/>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Cash Flow & HELOC */}
          <Card className="shadow-sm border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                Cash Flow & HELOC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Net Monthly Income</Label>
                  <Input type="number" value={form.netIncome} onChange={e => onChange("netIncome", Number(e.target.value))}/>
                </div>
                <div className="space-y-2">
                  <Label>Living Expenses (excl. mtg)</Label>
                  <Input type="number" value={form.livingExpenses} onChange={e => onChange("livingExpenses", Number(e.target.value))}/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>HELOC APR (%)</Label>
                  <Input type="number" step="0.01" value={form.helocAPR} onChange={e => onChange("helocAPR", Number(e.target.value))}/>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>HELOC Limit (Available Now)</Label>
                  <Input type="number" value={form.helocLimit} onChange={e => onChange("helocLimit", Number(e.target.value))}/>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">HELOC Opening Balance</Label>
                <Input type="number" value={form.helocOpeningBalance} onChange={e => onChange("helocOpeningBalance", Number(e.target.value))}/>
              </div>
            </CardContent>
          </Card>

          {/* 4. Cash & Assets (Optional) */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span className="bg-slate-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                Cash & Assets (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px]">Savings</Label>
                  <Input type="number" value={form.savings.savings} onChange={e => onSavingsChange("savings", e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px]">Chequing</Label>
                  <Input type="number" value={form.savings.chequing} onChange={e => onSavingsChange("chequing", e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px]">Short-Term</Label>
                  <Input type="number" value={form.savings.shortTerm} onChange={e => onSavingsChange("shortTerm", e.target.value)}/>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Strategy */}
          <Card className="shadow-sm bg-slate-100/50 border-dashed">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span className="bg-slate-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-black text-slate-500">Chunk Mode</Label>
                <RadioGroup value={form.chunkMode} onValueChange={(v: any) => onChange("chunkMode", v)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AUTO" id="auto" />
                    <Label htmlFor="auto" className="cursor-pointer">Auto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FIXED" id="fixed" />
                    <Label htmlFor="fixed" className="cursor-pointer">Fixed</Label>
                  </div>
                </RadioGroup>
                {form.chunkMode === 'FIXED' && (
                  <div className="pt-2">
                    <Label className="text-[10px]">Chunk Amount ($)</Label>
                    <Input type="number" value={form.fixedChunkAmount} onChange={e => onChange("fixedChunkAmount", Number(e.target.value))} className="bg-white" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest font-black text-slate-500">Bill Timing</Label>
                <RadioGroup value={form.billTiming} onValueChange={(v: any) => onChange("billTiming", v)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OPTIMIZED" id="optimized" />
                    <Label htmlFor="optimized" className="cursor-pointer">Optimized</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TYPICAL" id="typical" />
                    <Label htmlFor="typical" className="cursor-pointer">Typical</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Readvanceable?</Label>
                  <p className="text-[10px] text-muted-foreground">Does your HELOC limit increase as mortgage drops?</p>
                </div>
                <Switch checked={form.readvanceable} onCheckedChange={(v) => onChange("readvanceable", v)} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-0">
              <Button onClick={run} className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20">
                <Zap className="mr-2 h-5 w-5 fill-current" /> Calculate My Savings
              </Button>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={handleSave} disabled={isSaving} className="flex-1">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Inputs
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><HelpCircle className="h-5 w-5"/></Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>How do chunks work?</DialogTitle></DialogHeader>
                    <div className="space-y-4 text-sm leading-relaxed">
                      <p>The "Chunk Method" involves using your HELOC to make large principal payments against your mortgage.</p>
                      <p>By using your monthly cashflow surplus to pay down the HELOC balance daily, you dramatically reduce the interest charged compared to standard monthly mortgage payments.</p>
                      <p><strong>Auto Mode:</strong> Automatically calculates the mathematically optimal chunk size based on your surplus.</p>
                      <p><strong>Fixed Mode:</strong> Uses a specific dollar amount you specify for each chunk.</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-7">
          {res ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* TOP STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-emerald-600 text-white shadow-xl border-none">
                  <CardHeader className="pb-2">
                    <p className="text-xs uppercase tracking-widest font-black opacity-80">Interest Saved</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-black">${res.totals.interestSaved.toLocaleString()}</p>
                    <p className="text-[10px] mt-1 opacity-70">Over the life of the loan</p>
                  </CardContent>
                </Card>
                <Card className="shadow-md border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <p className="text-xs uppercase tracking-widest font-black text-slate-400">Time Saved</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-black text-slate-900">{Math.floor(res.totals.monthsSaved / 12)}y {res.totals.monthsSaved % 12}m</p>
                    <p className="text-[10px] mt-1 text-muted-foreground">Off your original term</p>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <p className="text-xs uppercase tracking-widest font-black text-slate-400">Payoff Date</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-black text-slate-900">
                      {new Date(Date.now() + res.strategy.months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] mt-1 text-emerald-600 font-bold">vs. {new Date(Date.now() + res.baseline.months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </CardContent>
                </Card>
              </div>

              {/* CHART */}
              <Card className="p-6 shadow-lg border-none overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <CardTitle className="text-lg">Debt Depletion Schedule</CardTitle>
                    <CardDescription>Comparison of balance reduction over time.</CardDescription>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Old Path</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Accelerated</div>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ChartContainer config={{
                    mortgageBal: { label: "Standard Path", color: "#cbd5e1" },
                    helocBal: { label: "Accelerated", color: "#10b981" }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={res.timeline.filter((_, i) => i % 3 === 0)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(v) => `Y${Math.floor(v/12)}`} 
                          axisLine={false}
                          tickLine={false}
                          className="text-[10px] font-medium"
                        />
                        <YAxis 
                          tickFormatter={(v) => `$${v/1000}k`} 
                          axisLine={false}
                          tickLine={false}
                          className="text-[10px] font-medium"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="mortgageBal" 
                          stroke="#cbd5e1" 
                          strokeWidth={2}
                          dot={false} 
                          name="Old Path" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="helocBal" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={false} 
                          name="Accelerated" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </Card>

              {/* STRATEGY BREAKDOWN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader><CardTitle className="text-sm">Strategy Insights</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Optimal Chunk Size:</span>
                      <span className="font-bold">${res.optimalChunkSize?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Strategy Type:</span>
                      <span className="font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{res.strategyType}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Interest Paid:</span>
                      <span className="font-bold">${Math.round(res.strategy.totalInterest).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white shadow-xl">
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="h-4 w-4 text-emerald-400" /> Velocity Boost</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs leading-relaxed opacity-80">
                      Your current cashflow velocity allows you to pay off your home in 
                      <span className="text-emerald-400 font-bold ml-1">{Math.floor(res.strategy.months / 12)} years</span>.
                    </p>
                    <p className="text-[10px] italic opacity-60">
                      * This assumes your income and expenses remain constant and you reinvest all savings into the HELOC principal.
                    </p>
                  </CardContent>
                </Card>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-4 border-dashed rounded-[32px] p-12 text-center bg-white/50 space-y-4">
              <div className="bg-slate-100 p-6 rounded-full">
                <TrendingDown className="h-12 w-12 text-slate-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-400">Results Pending</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Fill out the mortgage and cashflow details on the left to see your acceleration blueprint.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
