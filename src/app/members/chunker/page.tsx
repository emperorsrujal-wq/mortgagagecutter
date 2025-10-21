'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, LineChart, BarChart, Download, Mail } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, Bar, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';

import type { ChunkInput, BaselineInput, BaselineResult, ChunkResult } from '@/lib/chunker';
import { simulateBaseline, simulateChunker, mortgagePaymentFromTerms } from '@/lib/chunker';
import { useToast } from '@/hooks/use-toast';

const chunkerFormSchema = z.object({
  mortgageBalance: z.coerce.number().positive(),
  mortgageAPR: z.coerce.number().min(0),
  remainingTerm: z.coerce.number().positive(),
  termUnit: z.enum(['years', 'months']).default('years'),
  monthlyMortgagePayment: z.coerce.number().optional(),
  homeValue: z.coerce.number().optional(),
  monthlyMI: z.coerce.number().optional(),
  
  availableHelocNow: z.coerce.number().min(0),
  helocAPR: z.coerce.number().min(0),
  netIncome: z.coerce.number().positive(),
  livingExpenses: z.coerce.number().min(0),
  onetimeCashToMortgage: z.coerce.number().optional(),

  chunkMode: z.enum(['AUTO', 'FIXED']).default('AUTO'),
  fixedChunkAmount: z.coerce.number().optional(),
  billTiming: z.enum(['OPTIMIZED', 'TYPICAL']).default('OPTIMIZED'),
  readvanceable: z.boolean().default(true),
});

type ChunkerFormData = z.infer<typeof chunkerFormSchema>;

type CalculationResults = {
  baseline: BaselineResult;
  chunker: ChunkResult;
  interestSaved: number;
  monthsSaved: number;
  miSaved: number;
};

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

function ResultCard({ title, value, description }: { title: string; value: string; description: string; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{value}</CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function ChunkerCalculatorPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isCheckingClaims, setIsCheckingClaims] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const form = useForm<ChunkerFormData>({
    resolver: zodResolver(chunkerFormSchema),
    defaultValues: {
      mortgageBalance: 250000,
      mortgageAPR: 5.5,
      remainingTerm: 25,
      termUnit: 'years',
      helocAPR: 7.5,
      availableHelocNow: 50000,
      netIncome: 8000,
      livingExpenses: 4000,
      chunkMode: 'AUTO',
      billTiming: 'OPTIMIZED',
      readvanceable: true,
    }
  });

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
      } else {
        auth.currentUser?.getIdTokenResult()
          .then((idTokenResult) => {
            if (idTokenResult.claims.pro === true) {
              setIsPro(true);
            } else {
              router.push('/pricing');
            }
          })
          .catch(() => router.push('/pricing'))
          .finally(() => setIsCheckingClaims(false));
      }
    }
  }, [user, isUserLoading, router, auth]);

  async function onSubmit(data: ChunkerFormData) {
    setIsCalculating(true);
    setResults(null);

    await new Promise(resolve => setTimeout(resolve, 50)); // allow UI to update

    const termMonths = data.termUnit === 'years' ? data.remainingTerm * 12 : data.remainingTerm;

    const baselineInput: BaselineInput = {
      mortgageBalance: data.mortgageBalance,
      mortgageAPR: data.mortgageAPR,
      termMonths: termMonths,
      monthlyMortgagePayment: data.monthlyMortgagePayment,
      homeValue: data.homeValue,
      monthlyMI: data.monthlyMI,
    };

    const chunkInput: ChunkInput = {
      ...baselineInput,
      helocAPR: data.helocAPR,
      availableHelocNow: data.availableHelocNow,
      netIncome: data.netIncome,
      livingExpenses: data.livingExpenses,
      onetimeCashToMortgage: data.onetimeCashToMortgage,
      chunkMode: data.chunkMode,
      fixedChunkAmount: data.fixedChunkAmount,
      billTiming: data.billTiming,
      readvanceable: data.readvanceable,
    };

    const baseline = simulateBaseline(baselineInput);
    const chunker = simulateChunker(chunkInput);
    
    const interestSaved = baseline.totalInterest - chunker.totalInterestCombined;
    const monthsSaved = baseline.months - chunker.months;
    const miSaved = baseline.totalMI - chunker.totalMI;

    setResults({ baseline, chunker, interestSaved, monthsSaved, miSaved });
    setIsCalculating(false);
  }

  const handleSaveScenario = async () => {
    if (!results || !user || !firestore) return;
    try {
      const scenarioData = {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        type: 'CHUNKER_V1',
        inputs: form.getValues(),
        results: {
          baseline: { 
            months: results.baseline.months, 
            totalInterest: results.baseline.totalInterest, 
            payoffDateISO: results.baseline.payoffDateISO 
          },
          chunker: { 
            months: results.chunker.months, 
            totalInterestCombined: results.chunker.totalInterestCombined, 
            payoffDateISO: results.chunker.payoffDateISO 
          },
          interestSaved: results.interestSaved,
          monthsSaved: results.monthsSaved,
          miSaved: results.miSaved,
        },
      };
      await addDoc(collection(firestore, 'scenarios', user.uid, 'scenarios'), scenarioData);
      toast({ title: "Scenario Saved!", description: "Your calculation has been saved to your account." });
    } catch (error) {
      console.error("Error saving scenario:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not save the scenario." });
    }
  };


  if (isUserLoading || isCheckingClaims) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isPro) {
    return null; // Redirecting...
  }

  const balanceChartData = useMemo(() => {
    if (!results) return [];
    const { baseline, chunker } = results;
    const maxLength = Math.max(baseline.series.length, chunker.series.length);
    const data = [];
    for (let i = 0; i < maxLength; i++) {
        const baselinePoint = baseline.series[i] || { balance: 0 };
        const chunkerPoint = chunker.series[i] || { totalBalance: 0 };
        data.push({
            month: i + 1,
            'Baseline': baselinePoint.balance,
            'Chunker Method': chunkerPoint.totalBalance,
        });
    }
    return data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 240)) === 0);
  }, [results]);

  const interestChartData = useMemo(() => {
      if (!results) return [];
      return [
        { name: 'Total Interest', Baseline: results.baseline.totalInterest, 'Chunker Method': results.chunker.totalInterestCombined },
      ];
  }, [results]);

  const formatYAxis = (tick: number) => {
     if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}M`;
     if (tick >= 1000) return `${(tick / 1000).toFixed(0)}K`;
     return tick.toString();
   };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">MortgageCutter Chunk Calculator</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Turn HELOC access into months off your mortgage.
        </p>
         <p className="text-sm text-muted-foreground mt-1 max-w-3xl mx-auto">
          No switching lenders. Just use the credit you already have to nuke principal—then rebuild your HELOC with your monthly surplus.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Inputs */}
        <div className="w-full lg:w-1/3 space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Mortgage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField name="mortgageBalance" control={form.control} render={({ field }) => (<div><Label>Current Mortgage Balance</Label><Input type="number" placeholder="350000" {...field} /></div>)} />
                <FormField name="mortgageAPR" control={form.control} render={({ field }) => (<div><Label>Mortgage APR (%)</Label><Input type="number" step="0.01" placeholder="5.49" {...field} /></div>)} />
                <div className="flex gap-2">
                  <FormField name="remainingTerm" control={form.control} render={({ field }) => (<div className="flex-grow"><Label>Remaining Term</Label><Input type="number" placeholder="25" {...field} /></div>)} />
                  <FormField name="termUnit" control={form.control} render={({ field }) => (<div className="w-1/3"><Label>&nbsp;</Label><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2 items-center h-10"><RadioGroupItem value="years" id="years"/><Label htmlFor="years">Yrs</Label><RadioGroupItem value="months" id="months"/><Label htmlFor="months">Mos</Label></RadioGroup></div>)} />
                </div>
                <FormField name="monthlyMortgagePayment" control={form.control} render={({ field }) => (<div><Label>Current Monthly Payment (Optional)</Label><Input type="number" placeholder="1850" {...field} /></div>)} />
                <FormField name="homeValue" control={form.control} render={({ field }) => (<div><Label>Home Value (Optional, for MI)</Label><Input type="number" placeholder="500000" {...field} /></div>)} />
                <FormField name="monthlyMI" control={form.control} render={({ field }) => (<div><Label>Monthly Mortgage Insurance (Optional)</Label><Input type="number" placeholder="150" {...field} /></div>)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Step 2: HELOC & Cash-Flow</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField name="availableHelocNow" control={form.control} render={({ field }) => (<div><Label>Available HELOC Credit Today</Label><Input type="number" placeholder="50000" {...field} /></div>)} />
                <FormField name="helocAPR" control={form.control} render={({ field }) => (<div><Label>HELOC APR (%)</Label><Input type="number" step="0.01" placeholder="7.50" {...field} /></div>)} />
                <FormField name="netIncome" control={form.control} render={({ field }) => (<div><Label>Monthly Net Income</Label><Input type="number" placeholder="8000" {...field} /></div>)} />
                <FormField name="livingExpenses" control={form.control} render={({ field }) => (<div><Label>Monthly Living Expenses (ex-mortgage)</Label><Input type="number" placeholder="4000" {...field} /></div>)} />
                <FormField name="onetimeCashToMortgage" control={form.control} render={({ field }) => (<div><Label>One-Time Cash to Apply (Optional)</Label><Input type="number" placeholder="10000" {...field} /></div>)} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Step 3: Strategy</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField name="chunkMode" control={form.control} render={({ field }) => (
                  <div>
                    <Label>Chunk Size Mode</Label>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="AUTO" id="auto"/> <Label htmlFor="auto">Auto (25% of remaining mortgage)</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="FIXED" id="fixed"/> <Label htmlFor="fixed">Fixed Amount</Label></div>
                    </RadioGroup>
                    {form.watch('chunkMode') === 'FIXED' && <FormField name="fixedChunkAmount" control={form.control} render={({ field }) => (<Input type="number" placeholder="50000" className="mt-2" {...field} />)} />}
                  </div>
                )} />
                <FormField name="billTiming" control={form.control} render={({ field }) => (
                  <div>
                    <Label>Bill Timing</Label>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="OPTIMIZED" id="optimized"/> <Label htmlFor="optimized">Optimized (Batch bills once/month)</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="TYPICAL" id="typical"/> <Label htmlFor="typical">Typical (Bills spread out)</Label></div>
                    </RadioGroup>
                  </div>
                )} />
                <FormField name="readvanceable" control={form.control} render={({ field }) => (<div className="flex items-center space-x-2"><Checkbox id="readvanceable" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="readvanceable">Re-drawable HELOC (e.g. Canadian readvanceable)</Label></div>)} />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg" disabled={isCalculating}>
              {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Calculate
            </Button>
          </form>
        </div>
        
        {/* Right Column: Results */}
        <div className="w-full lg:w-2/3 space-y-6">
          {!results && !isCalculating && <Card className="flex items-center justify-center h-full text-center p-8"><CardContent><p className="text-muted-foreground">Your personalized results will appear here once you click "Calculate".</p></CardContent></Card>}
          {isCalculating && <Card className="flex items-center justify-center h-full"><CardContent><Loader2 className="h-12 w-12 animate-spin text-primary" /></CardContent></Card>}
          
          {results && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ResultCard title="Interest Saved" value={currencyFormatter.format(results.interestSaved)} description="Total mortgage and HELOC interest avoided." />
                <ResultCard title="Months Saved" value={`${results.monthsSaved}`} description={`You'll be debt free ${Math.floor(results.monthsSaved / 12)} years and ${results.monthsSaved % 12} months sooner.`} />
                {results.miSaved > 0 && <ResultCard title="MI Saved" value={currencyFormatter.format(results.miSaved)} description="Estimated mortgage insurance payments avoided." />}
              </div>

              {results.chunker.warnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>{[...new Set(results.chunker.warnings)][0]}</AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader><CardTitle>Balance Over Time</CardTitle></CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                       <defs>
                          <linearGradient id="colorChunker" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                          <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.5}/><stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/></linearGradient>
                       </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={(tick) => `Yr ${Math.floor(tick / 12)}`} />
                      <YAxis tickFormatter={formatYAxis} />
                      <ChartTooltip content={<ChartTooltipContent formatter={(value) => currencyFormatter.format(value as number)} />} />
                      <Legend />
                      <Area type="monotone" dataKey="Baseline" stroke="hsl(var(--muted-foreground))" fillOpacity={1} fill="url(#colorBaseline)" />
                      <Area type="monotone" dataKey="Chunker Method" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorChunker)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Total Interest Paid</CardTitle></CardHeader>
                 <CardContent className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={interestChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                       <XAxis type="number" tickFormatter={formatYAxis} />
                       <YAxis type="category" dataKey="name" hide />
                       <ChartTooltip content={<ChartTooltipContent formatter={(value) => currencyFormatter.format(value as number)} />} />
                       <Legend />
                       <Bar dataKey="Baseline" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                       <Bar dataKey="Chunker Method" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={handleSaveScenario} className="w-full"><Download className="mr-2 h-4 w-4" /> Save Scenario</Button>
                <Button variant="secondary" className="w-full"><Mail className="mr-2 h-4 w-4" /> Email Me</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="text-center mt-8">
        <p className="text-xs text-muted-foreground">Educational estimate only. No bank fees/promos included. Your discipline and cash-flow control the outcome.</p>
      </footer>
    </div>
  );
}
