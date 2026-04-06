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
import { Loader2, Save, Info, HelpCircle, Zap, TrendingDown, CheckCircle2, ChevronDown, ChevronUp, Table as TableIcon } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen space-y-10">
      
      {/* EXPLAINER TOP SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-600 text-sm font-black uppercase flex items-center gap-2">
              <TrendingDown className="h-4 w-4" /> s from HELOC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Batch bills so cash sits longer against balance.</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-600 text-sm font-black uppercase flex items-center gap-2">
              <Zap className="h-4 w-4" /> Chunk to mortgage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Send a lump-sum prepayment to principal (payment stays same; term shrinks).</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-600 text-sm font-black uppercase flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Use surplus to reset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Your monthly surplus pays HELOC back; repeat.</p>
          </CardContent>
        </Card>
      </section>

      <section className="bg-slate-100 rounded-xl p-6 border">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">Common Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-1">
            <p className="font-bold text-slate-900">Will my mortgage payment change?</p>
            <p className="text-slate-600">No. Your required payment stays exactly the same, but more goes to principal.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900">Do I need a special account?</p>
            <p className="text-slate-600">Yes, you typically need a first-lien HELOC or an offset account to maximize benefit.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900">What if my surplus is small?</p>
            <p className="text-slate-600">Even small surpluses save thousands. The key is the frequency of daily recalculation.</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
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
                  <Label className="text-[10px]">Savings Account</Label>
                  <Input type="number" value={form.savings.savings} onChange={e => onSavingsChange("savings", e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px]">Chequing Account</Label>
                  <Input type="number" value={form.savings.chequing} onChange={e => onSavingsChange("chequing", e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px]">Short-Term Inv.</Label>
                  <Input type="number" value={form.savings.shortTerm} onChange={e => onSavingsChange("shortTerm", e.target.value)}/>
                </div>
              </div>
            </CardContent>
          </Card>

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
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* RESULTS COLUMN */}
        <div className="lg:col-span-7">
          {res ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* PRIMARY STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-emerald-600 text-white shadow-xl border-none">
                  <CardHeader className="pb-2">
                    <p className="text-xs uppercase tracking-widest font-black opacity-80">Interest Saved</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-black">{currencyFormatter.format(res.totals.interestSaved)}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-md border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <p className="text-xs uppercase tracking-widest font-black text-slate-400">Months Saved</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-black text-slate-900">{res.totals.monthsSaved}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <p className="text-xs uppercase tracking-widest font-black text-slate-400">MI/CMHC Saved</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-black text-slate-900">{currencyFormatter.format(res.totals.miSaved)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* COMPARISON CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-red-50">
                  <CardHeader className="bg-red-50/50 pb-4">
                    <CardTitle className="text-sm font-black text-red-700 uppercase">Baseline (Do Nothing)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex justify-between"><span>Months:</span> <span className="font-bold">{res.baseline.months}</span></div>
                    <div className="flex justify-between"><span>Total Interest:</span> <span className="font-bold">{currencyFormatter.format(res.baseline.totalInterest)}</span></div>
                    <div className="flex justify-between"><span>Total MI/CMHC:</span> <span className="font-bold">{currencyFormatter.format(res.baseline.totalMI)}</span></div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-emerald-50 shadow-lg scale-[1.02]">
                  <CardHeader className="bg-emerald-50 pb-4">
                    <CardTitle className="text-sm font-black text-emerald-700 uppercase">With Chunker Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex justify-between"><span>Months:</span> <span className="font-bold">{res.strategy.months}</span></div>
                    <div className="flex justify-between"><span>Total Interest:</span> <span className="font-bold">{currencyFormatter.format(res.strategy.totalInterest)}</span></div>
                    <div className="flex justify-between"><span>Total MI/CMHC:</span> <span className="font-bold">{currencyFormatter.format(res.strategy.totalMI)}</span></div>
                  </CardContent>
                </Card>
              </div>

              {/* STRATEGY INFO */}
              <Card className="bg-slate-900 text-white p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Strategy Used</p>
                    <p className="font-bold">{res.strategyType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Optimal First Chunk</p>
                    <p className="font-bold">{currencyFormatter.format(res.optimalChunkSize || 0)}</p>
                  </div>
                </div>
              </Card>

              {/* CHART */}
              <Card className="p-6 shadow-lg border-none overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <CardTitle className="text-lg">Balance Over Time</CardTitle>
                    <CardDescription>Mortgage vs. Total Debt with Chunker Strategy</CardDescription>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Baseline Mortgage</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Strategy Total Debt</div>
                  </div>
                </div>
                <div className="h-[350px] w-full">
                  <ChartContainer config={{
                    baselineBal: { label: "Baseline Mortgage", color: "#cbd5e1" },
                    strategyBal: { label: "Strategy Total Debt", color: "#10b981" }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={res.timeline.filter((_, i) => i % Math.max(1, Math.floor(res.timeline.length / 60)) === 0)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(v) => `Yr ${Math.floor(v/12)}`} 
                          axisLine={false}
                          tickLine={false}
                          className="text-[10px] font-medium"
                        />
                        <YAxis 
                          tickFormatter={(v) => `${Math.floor(v/1000)}k`} 
                          axisLine={false}
                          tickLine={false}
                          className="text-[10px] font-medium"
                        />
                        <RechartsTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="baselineBal" 
                          stroke="#cbd5e1" 
                          strokeWidth={2}
                          dot={false} 
                          name="Baseline Mortgage" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="strategyBal" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={false} 
                          name="Strategy Total Debt" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </Card>

              {/* TIMELINE TABLE */}
              <Collapsible open={showTimeline} onOpenChange={setShowTimeline} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full font-bold">
                    <TableIcon className="mr-2 h-4 w-4" /> 
                    {showTimeline ? "Hide Timeline" : "View Month-by-Month Timeline"}
                    {showTimeline ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 pt-4 border-t">
                  <div className="max-h-[600px] overflow-auto border rounded-lg">
                    <Table>
                      <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <TableRow>
                          <TableHead className="w-16">Month</TableHead>
                          <TableHead>Mortgage Bal</TableHead>
                          <TableHead>Mortgage Int.</TableHead>
                          <TableHead>Mortgage Prin.</TableHead>
                          <TableHead>HELOC Bal</TableHead>
                          <TableHead>Chunk</TableHead>
                          <TableHead>HELOC Int</TableHead>
                          <TableHead>MI</TableHead>
                          <TableHead>Surplus Used</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {res.timeline.slice(0, 240).map((row) => (
                          <TableRow key={row.month} className={cn(row.month === 0 ? "bg-slate-50 font-bold" : "")}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell>{currencyFormatter.format(row.mortgageBal)}</TableCell>
                            <TableCell className="text-red-600">{currencyFormatter.format(row.mortgageInterestPaid)}</TableCell>
                            <TableCell className="text-green-600">{currencyFormatter.format(row.mortgagePrincipalPaid)}</TableCell>
                            <TableCell className="font-bold">{currencyFormatter.format(row.helocBal)}</TableCell>
                            <TableCell className="text-blue-600">{currencyFormatter.format(row.chunkApplied)}</TableCell>
                            <TableCell className="text-red-400">{currencyFormatter.format(row.helocInterest)}</TableCell>
                            <TableCell>{currencyFormatter.format(row.mi)}</TableCell>
                            <TableCell>{currencyFormatter.format(row.surplusUsed)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 italic">(Showing first 240 months to keep the table light.)</p>
                </CollapsibleContent>
              </Collapsible>

              <div className="text-center p-6 border rounded-2xl bg-white shadow-inner">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Educational estimate only. No bank fees, promos, or taxes included. Results improve with positive monthly surplus, readvanceable lines, and batched bill pay.
                </p>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-4 border-dashed rounded-[32px] p-12 text-center bg-white/50 space-y-4">
              <div className="bg-slate-100 p-6 rounded-full">
                <TrendingDown className="h-12 w-12 text-slate-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-400">Your results will appear here.</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Fill out the mortgage and cashflow details on the left to see your acceleration blueprint.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
