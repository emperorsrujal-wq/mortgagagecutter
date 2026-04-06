
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useMemo, Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Sparkles,
  Info,
  Loader2,
  AlertCircle,
  Wallet,
  CheckCircle,
  Award,
  MessageCircle,
  Bot,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Inputs, Outputs } from '@/lib/mortgage-types';
import { getSavingsReport, getAISavingsAnalysis } from '@/app/actions';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import Image from 'next/image';
import { productPlans } from '@/lib/plans';

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
  description,
  isPrimary = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
  description?: string;
  isPrimary?: boolean;
}) {
  return (
    <Card 
      className={cn(
        'shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1', 
        isPrimary ? 'bg-primary/90 text-primary-foreground border-primary shadow-primary/20' : 'bg-card'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn("text-sm font-medium", isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{label}</CardTitle>
        <Icon className={cn('h-5 w-5', isPrimary ? 'text-primary-foreground/90' : color || 'text-primary')} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-4xl font-bold", isPrimary ? 'text-white' : '')}>{value}</div>
        {description && <p className={cn("text-xs mt-1", isPrimary ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{description}</p>}
      </CardContent>
    </Card>
  );
}

function ComparisonChart({ data }: { data: Outputs['series'] }) {
    const chartData = useMemo(() => {
     if (data.length === 0) return [];
     const step = Math.max(1, Math.floor(data.length / 120));
     return data.filter((_, i) => i % step === 0);
   }, [data]);
 
   const formatYAxis = (tick: number) => {
     if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}M`;
     if (tick >= 1000) return `${(tick / 1000).toFixed(0)}K`;
     return tick.toString();
   };

  const formatTooltip = (value: number) => currencyFormatter.format(value);

  return (
    <ChartContainer config={{
        balanceBaseline: { label: "Old Path", color: "hsl(var(--muted-foreground) / 0.6)" },
        balanceHeloc: { label: "Accelerated Path", color: "hsl(var(--primary))" },
    }} className="h-[400px] w-full">
      <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 20 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis dataKey="month" tickFormatter={(tick) => `Yr ${Math.floor(tick / 12)}`} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={50} className="text-xs" />
        <YAxis tickFormatter={formatYAxis} tickLine={false} axisLine={false} width={60} className="text-xs" />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' labelFormatter={(value) => `Month: ${value}`} formatter={(value, name) => [formatTooltip(value as number), name === 'balanceHeloc' ? 'Accelerated Path' : 'Old Path']} />} />
        <Legend verticalAlign="top" height={40} iconType="circle" />
        <Area dataKey="balanceBaseline" type="natural" fill="var(--color-balanceBaseline)" fillOpacity={0.2} stroke="var(--color-balanceBaseline)" strokeWidth={2} stackId="a" />
        <Area dataKey="balanceHeloc" type="natural" fill="var(--color-balanceHeloc)" fillOpacity={0.4} stroke="var(--color-balanceHeloc)" strokeWidth={3} stackId="b" />
      </AreaChart>
    </ChartContainer>
  );
}

function InnerComparison() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Outputs | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yearsSaved = data ? (data.debtFreeMonthsBaseline - data.debtFreeMonthsHeloc) / 12 : 0;
  const yearsSavedTxt = data ? `${Math.floor(yearsSaved)} yrs, ${Math.round((yearsSaved % 1) * 12)} mo` : 'several years';
  
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/?ref=blueprint` : '';
  const shareMessage = `Unlock mortgage savings now! I found out how to pay off my home faster using Mortgage Cutter. Check out your free savings estimate: ${referralLink}`;

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const input: Omit<Inputs, 'helocRateAPR'> = {
      homeValue: parseFloat(params.homeValue),
      mortgageBalance: parseFloat(params.mortgageBalance),
      mortgageRateAPR: parseFloat(params.mortgageRateAPR),
      amortYearsRemaining: parseInt(params.amortYearsRemaining),
      paymentMonthly: params.paymentMonthly ? parseFloat(params.paymentMonthly) : undefined,
      netMonthlyIncome: parseFloat(params.netMonthlyIncome),
      monthlyExpenses: parseFloat(params.monthlyExpenses),
      debts: params.debts ? JSON.parse(params.debts) : [],
      savings: params.savings ? JSON.parse(params.savings) : { savings: 0, chequing: 0, shortTerm: 0 },
      cardOffset: params.cardOffset === 'true',
    };
    
    async function runCalculation() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getSavingsReport(input);
        if (result.success) {
          setData(result.report);
          
          // Trigger AI Analysis
          setIsAiLoading(true);
          const aiResult = await getAISavingsAnalysis({
            currentMortgageBalance: input.mortgageBalance,
            currentInterestRate: input.mortgageRateAPR / 100,
            originalLoanAmount: input.mortgageBalance, // Fallback
            loanTerm: input.amortYearsRemaining,
            monthlyMortgagePayment: input.paymentMonthly || (input.mortgageBalance * 0.006), // Estimation fallback
            yearsInHome: 0,
            monthlyIncome: input.netMonthlyIncome,
            monthlyExpenses: input.monthlyExpenses,
          });
          if (aiResult.success) setAiAnalysis(aiResult.analysis);
          setIsAiLoading(false);

        } else {
          setError(result.error);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    if (searchParams.has('mortgageBalance')) {
      runCalculation();
    } else {
      setIsLoading(false);
      setError("No calculation data found. Please go back and fill out the questionnaire.");
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Building your savings blueprint...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="container max-w-2xl my-12 shadow-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Calculation Error</AlertTitle>
        <AlertDescription>
          <pre className="mt-2 text-xs bg-muted/50 p-2 rounded whitespace-pre-wrap">{error}</pre>
          <Button asChild variant="secondary" size="sm" className="mt-4">
            <Link href="/questionnaire">Go Back</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-background">
      <div className="container mx-auto py-12 px-4 space-y-12">
        
        <header className="text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-primary">
            Your Personalized Mortgage Savings Blueprint
          </h1>
          <p className="text-xl text-muted-foreground mt-3 max-w-3xl mx-auto">
            This is the moment your financial future changes. Here’s how you accelerate your journey to becoming debt-free.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Calendar} label="Debt-Free Sooner" value={yearsSavedTxt} description="Time until all consolidated debt is paid off." />
          <StatCard icon={Sparkles} label="Total Interest Saved" value={currencyFormatter.format(data.interestSaved)} isPrimary={true} description="The extra money that stays in your pocket." />
          <StatCard icon={Wallet} label="Borrowing Room" value={currencyFormatter.format(data.borrowingRoomAfterSetup)} description="Available credit in your HELOC after setup." color="text-green-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-xl border-none">
            <CardHeader>
              <CardTitle>Your Payoff Timeline: Old Path vs. Accelerated Path</CardTitle>
              <CardDescription>Watch your total debt balance vanishing years sooner.</CardDescription>
            </CardHeader>
            <CardContent>
              {data.series.length > 0 ? <ComparisonChart data={data.series} /> : <p>Could not generate chart data.</p>}
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" /> AI Strategy Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-sm">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>AI is analyzing your numbers...</p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis || "AI analysis is unavailable for this calculation."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 lg:p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Unlock the Full Mortgage Cutter Method</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Get the interactive tools, bank-calling scripts, and the step-by-step roadmap to implement this blueprint starting tomorrow.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="bg-white/5 border-white/10 text-left text-white">
                    <CardHeader>
                        <CardTitle className="text-xl">{productPlans['basic_39_monthly'].name}</CardTitle>
                        <CardDescription className="text-gray-400">{productPlans['basic_39_monthly'].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold">{productPlans['basic_39_monthly'].priceFormatted}</div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Interactive Calculator</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Monthly Action Plan</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button asChild variant="secondary" className="w-full"><Link href="/purchase?plan=basic_39_monthly">Start Basic</Link></Button>
                    </CardFooter>
                </Card>

                <Card className="bg-white text-gray-900 scale-105 shadow-2xl relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 text-xs font-bold rounded-full">MOST POPULAR</div>
                    <CardHeader>
                        <CardTitle className="text-2xl pt-2">{productPlans['pro_297'].name}</CardTitle>
                        <CardDescription>{productPlans['pro_297'].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-5xl font-bold">{productPlans['pro_297'].priceFormatted}</div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /> Full Toolkit & All Books</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /> Bank-Agnostic Guides</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /> Lifetime Access</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-white"><Link href="/purchase?plan=pro_297">Unlock Everything</Link></Button>
                    </CardFooter>
                </Card>

                <Card className="bg-white/5 border-white/10 text-left text-white">
                    <CardHeader>
                        <CardTitle className="text-xl">{productPlans['elite_997'].name}</CardTitle>
                        <CardDescription className="text-gray-400">Personalized expert support.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold">{productPlans['elite_997'].priceFormatted}</div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> 1-on-1 Onboarding Call</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Advanced Investor Tools</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="secondary" className="w-full"><Link href="/purchase?plan=elite_997">Go Elite</Link></Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
            <h3 className="text-2xl font-bold">Share Your Success</h3>
            <p className="text-muted-foreground">Found this blueprint helpful? Invite friends to run their numbers.</p>
            <div className="flex flex-wrap justify-center gap-2">
                <Button asChild variant="outline" className="rounded-full">
                    <a href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</a>
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => navigator.clipboard.writeText(referralLink)}>
                    <Sparkles className="mr-2 h-4 w-4" /> Copy Referral Link
                </Button>
            </div>
        </div>

        <Alert className="mt-8 border-primary/50 text-center bg-card shadow-md">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-bold">Educational Estimates Only</AlertTitle>
          <AlertDescription className="text-xs mt-2">
            These calculations are for illustrative purposes and are not a guarantee of savings. Your actual results depend on your discipline, spending habits, and lender terms.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export function ComparisonDisplay() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-24"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <InnerComparison />
    </Suspense>
  )
}
