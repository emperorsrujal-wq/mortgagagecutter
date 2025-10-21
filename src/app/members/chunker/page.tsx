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
import { Loader2, AlertCircle, Download, Mail } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';

import type { ChunkInput, BaselineInput, BaselineResult, ChunkResult } from '@/lib/chunker';
import { simulateBaseline, simulateChunker } from '@/lib/chunker';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

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
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const form = useForm<ChunkerFormData>({
    resolver: zodResolver(chunkerFormSchema),
    defaultValues: {
      mortgageBalance: 250000,
      mortgageAPR: 5.5,
      remainingTerm: 25,
      termUnit: 'years',
      monthlyMortgagePayment: undefined,
      homeValue: undefined,
      monthlyMI: undefined,
      helocAPR: 7.5,
      availableHelocNow: 50000,
      netIncome: 8000,
      livingExpenses: 4000,
      onetimeCashToMortgage: undefined,
      chunkMode: 'AUTO',
      fixedChunkAmount: undefined,
      billTiming: 'OPTIMIZED',
      readvanceable: true,
    }
  });

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Mortgage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="mortgageBalance" render={({ field }) => (<FormItem><Label>Current Mortgage Balance</Label><FormControl><Input type="number" placeholder="350000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="mortgageAPR" render={({ field }) => (<FormItem><Label>Mortgage APR (%)</Label><FormControl><Input type="number" step="0.01" placeholder="5.49" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="flex gap-2 items-end">
                    <FormField control={form.control} name="remainingTerm" render={({ field }) => (<FormItem className="flex-grow"><Label>Remaining Term</Label><FormControl><Input type="number" placeholder="25" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="termUnit" render={({ field }) => (<FormItem className="pb-1"><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2 items-center h-10"><FormControl><div className="flex items-center space-x-2"><RadioGroupItem value="years" id="years"/><Label htmlFor="years">Yrs</Label></div></FormControl><FormControl><div className="flex items-center space-x-2"><RadioGroupItem value="months" id="months"/><Label htmlFor="months">Mos</Label></div></FormControl></RadioGroup><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={form.control} name="monthlyMortgagePayment" render={({ field }) => (<FormItem><Label>Current Monthly Payment (Optional)</Label><FormControl><Input type="number" placeholder="1850" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="homeValue" render={({ field }) => (<FormItem><Label>Home Value (Optional, for MI)</Label><FormControl><Input type="number" placeholder="500000" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="monthlyMI" render={({ field }) => (<FormItem><Label>Monthly Mortgage Insurance (Optional)</Label><FormControl><Input type="number" placeholder="150" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Step 2: HELOC & Cash-Flow</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="availableHelocNow" render={({ field }) => (<FormItem><Label>Available HELOC Credit Today</Label><FormControl><Input type="number" placeholder="50000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="helocAPR" render={({ field }) => (<FormItem><Label>HELOC APR (%)</Label><FormControl><Input type="number" step="0.01" placeholder="7.50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="netIncome" render={({ field }) => (<FormItem><Label>Monthly Net Income</Label><FormControl><Input type="number" placeholder="8000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="livingExpenses" render={({ field }) => (<FormItem><Label>Monthly Living Expenses (ex-mortgage)</Label><FormControl><Input type="number" placeholder="4000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="onetimeCashToMortgage" render={({ field }) => (<FormItem><Label>One-Time Cash to Apply (Optional)</Label><FormControl><Input type="number" placeholder="10000" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle>Step 3: Strategy</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="chunkMode" render={({ field }) => (
                    <FormItem>
                      <Label>Chunk Size Mode</Label>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="AUTO" id="auto"/></FormControl> <Label htmlFor="auto" className="font-normal">Auto (25% of remaining mortgage)</Label></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="FIXED" id="fixed"/></FormControl> <Label htmlFor="fixed" className="font-normal">Fixed Amount</Label></FormItem>
                        </RadioGroup>
                      </FormControl>
                      {form.watch('chunkMode') === 'FIXED' && <FormField name="fixedChunkAmount" control={form.control} render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="50000" className="mt-2" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />}
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="billTiming" render={({ field }) => (
                    <FormItem>
                      <Label>Bill Timing</Label>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="OPTIMIZED" id="optimized"/></FormControl> <Label htmlFor="optimized" className="font-normal">Optimized (Batch bills once/month)</Label></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="TYPICAL" id="typical"/></FormControl> <Label htmlFor="typical" className="font-normal">Typical (Bills spread out)</Label></FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="readvanceable" render={({ field }) => (<FormItem className="flex items-center space-x-2 pt-2"><FormControl><Checkbox id="readvanceable" checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label htmlFor="readvanceable" className="font-normal">Re-drawable HELOC (e.g. Canadian readvanceable)</Label></FormItem>)} />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={isCalculating}>
                {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Calculate
              </Button>
            </form>
          </Form>
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
                <Button onClick={handleSaveScenario} className="w-full" disabled={!user}><Download className="mr-2 h-4 w-4" /> Save Scenario</Button>
                <Button variant="secondary" className="w-full" disabled><Mail className="mr-2 h-4 w-4" /> Email Me</Button>
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
