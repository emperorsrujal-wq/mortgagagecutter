
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { EstimatorInput, EstimatorOutput, RunResult } from '@/lib/mortgage-types';
import { getSavingsReport } from '@/app/actions';
import { cn } from '@/lib/utils';


const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-secondary p-4">
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className={cn('h-6 w-6', color || 'text-primary')} />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

export function ComparisonDisplay() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<EstimatorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<'optimistic' | 'base' | 'pessimistic'>('base');

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const input: EstimatorInput = {
      country: params.country as "US" | "CA",
      homeValue: parseFloat(params.homeValue),
      currentLoanBalance: parseFloat(params.currentLoanBalance),
      currentRateAPR: parseFloat(params.currentRateAPR) / 100,
      currentTermMonthsRemaining: parseInt(params.currentTermMonthsRemaining),
      grossMonthlyIncome: parseFloat(params.grossMonthlyIncome),
      monthlySpendLow: parseFloat(params.monthlySpendLow),
      monthlySpendMid: parseFloat(params.monthlySpendMid),
      monthlySpendHigh: parseFloat(params.monthlySpendHigh),
      helocRateAPR: parseFloat(params.helocRateAPR) / 100,
      drawYears: 10, 
      repaymentYears: 20,
      requestedCombinedLTV: 0.8,
      requestedRevolvingLTV: 0.65,
      closingCostsEstimate: 0,
      maxMonths: 480,
    };

    const runCalculation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getSavingsReport(input);
        if (result.success) {
          setData(result.report);
        } else {
          setError(result.error);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    runCalculation();
  }, [searchParams]);

  const activeHelocResult = useMemo(() => {
    if (!data) return null;
    return data.heloc[activeScenario];
  }, [data, activeScenario]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
          Building your savings blueprint...
        </p>
      </div>
    );
  }

  if (error) {
    return (
       <Alert variant="destructive" className="container max-w-2xl my-12">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Calculation Error</AlertTitle>
          <AlertDescription>
            <p>We couldn't generate your savings report. Here's the error message:</p>
            <pre className="mt-2 text-xs bg-muted/50 p-2 rounded">{error}</pre>
            <Button asChild variant="secondary" size="sm" className="mt-4">
              <Link href="/questionnaire">Go Back and Try Again</Link>
            </Button>
          </AlertDescription>
        </Alert>
    );
  }

  if (!data || !activeHelocResult) {
    return null;
  }
  
  const yearsSaved = Math.floor((data.mortgage.monthsToZero - activeHelocResult.monthsToZero) / 12);
  const monthsSaved = (data.mortgage.monthsToZero - activeHelocResult.monthsToZero) % 12;
  const interestSaved = data.mortgage.totalInterest - activeHelocResult.totalInterest;

  const scenarioConfig = {
    optimistic: { label: 'Optimistic', color: 'text-green-500', icon: TrendingUp },
    base: { label: 'Base', color: 'text-primary', icon: TrendingUp },
    pessimistic: { label: 'Pessimistic', color: 'text-amber-500', icon: TrendingDown },
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
          Your Personalized Savings Blueprint
        </h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
          Here’s how the Mortgage Cutter Method can accelerate your journey to financial freedom based on your spending habits.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatCard 
          icon={Calendar} 
          label="Paid Off Faster" 
          value={`${yearsSaved} Years, ${monthsSaved} Months`}
          color={scenarioConfig[activeScenario].color}
        />
        <StatCard 
          icon={Sparkles} 
          label="Total Interest Saved" 
          value={currencyFormatter.format(interestSaved)}
          color={scenarioConfig[activeScenario].color}
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Status Quo: Traditional Mortgage</CardTitle>
            <CardDescription>Your current path without any changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Months to Payoff</TableCell>
                  <TableCell className="text-right font-mono">{data.mortgage.monthsToZero}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Interest Paid</TableCell>
                  <TableCell className="text-right font-mono">{currencyFormatter.format(data.mortgage.totalInterest)}</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell className="font-medium">Monthly P&amp;I Payment</TableCell>
                  <TableCell className="text-right font-mono">{currencyFormatter.format(data.assumptions.sameMonthlyOutlayAsMortgage)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary">HELOC / Mortgage Cutter Method</CardTitle>
            </div>
            <CardDescription>Your accelerated path to being debt-free.</CardDescription>
            <div className="flex gap-2 pt-2">
              {(['optimistic', 'base', 'pessimistic'] as const).map(scenario => (
                <Button key={scenario} variant={activeScenario === scenario ? "default" : "outline"} size="sm" onClick={() => setActiveScenario(scenario)}>
                  {scenarioConfig[scenario].label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
             <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Months to Payoff</TableCell>
                  <TableCell className="text-right font-mono">{activeHelocResult.monthsToZero}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Interest Paid</TableCell>
                  <TableCell className="text-right font-mono">{currencyFormatter.format(activeHelocResult.totalInterest)}</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell className="font-medium">Avg. Monthly Payment</TableCell>
                  <TableCell className="text-right font-mono">{currencyFormatter.format(activeHelocResult.avgMonthlyPayment)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <Alert className="mt-8 border-primary/50">
           <Info className="h-4 w-4" />
           <AlertTitle className="font-bold">Assumptions & Notes</AlertTitle>
           <AlertDescription>
             <ul className="list-disc list-inside space-y-1 mt-2 text-xs">
                {data.assumptions.notes.map((note, i) => <li key={i}>{note}</li>)}
                <li>Estimates are for educational purposes and are not a guarantee of savings or loan approval.</li>
             </ul>
           </AlertDescription>
       </Alert>

      <Card className="mt-8 text-center bg-gradient-to-r from-primary to-accent text-primary-foreground p-8 shadow-2xl">
        <CardHeader>
           <CardTitle className="text-3xl font-bold">Ready to Take Control?</CardTitle>
           <CardDescription className="text-lg text-primary-foreground/90">
             Get the exact step-by-step system and tools to make these savings a reality.
           </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" asChild className="bg-card text-card-foreground hover:bg-card/90 transform hover:scale-105 transition-transform duration-200">
            <Link href="/purchase">Get Instant Access for {currencyFormatter.format(79)}</Link>
          </Button>
          <p className="text-xs mt-4 opacity-80">One-time payment. Lifetime access. No hidden fees.</p>
        </CardContent>
      </Card>
    </div>
  );
}
