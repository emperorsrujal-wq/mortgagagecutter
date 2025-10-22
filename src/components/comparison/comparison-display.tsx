
'use client';

import { useSearchParams } from 'next/navigation';
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
  DollarSign,
  Calendar,
  Sparkles,
  TrendingUp,
  Info,
  Loader2,
  AlertCircle,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Inputs, Outputs, Debt } from '@/lib/mortgage-types';
import { getSavingsReport } from '@/app/actions';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';


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
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-card p-4 shadow-sm border">
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className={cn('h-6 w-6', color || 'text-primary')} />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  );
}

function ComparisonChart({ data }: { data: Outputs['series'] }) {
    const chartData = useMemo(() => {
     if (data.length === 0) return [];
     // only show ~120 points for performance
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
    <ChartContainer config={{}} className="min-h-[300px] w-full">
      <AreaChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="colorHeloc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.5} />
            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickFormatter={(tick) => `Yr ${Math.floor(tick / 12)}`}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={50}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tickLine={false}
          axisLine={false}
          width={50}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `Month: ${label}`}
              formatter={(value, name) => [
                formatTooltip(value as number),
                name === 'balanceHeloc' ? 'HELOC Method' : 'Baseline',
              ]}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="balanceBaseline"
          stackId="1"
          stroke="hsl(var(--muted-foreground))"
          fill="url(#colorBaseline)"
          name="Baseline"
        />
        <Area
          type="monotone"
          dataKey="balanceHeloc"
          stackId="2"
          stroke="hsl(var(--primary))"
          fill="url(#colorHeloc)"
          name="HELOC Method"
        />
      </AreaChart>
    </ChartContainer>
  );
}


function InnerComparison() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Outputs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const input: Inputs = {
      homeValue: parseFloat(params.homeValue),
      mortgageBalance: parseFloat(params.mortgageBalance),
      mortgageRateAPR: parseFloat(params.mortgageRateAPR),
      amortYearsRemaining: parseInt(params.amortYearsRemaining),
      netMonthlyIncome: parseFloat(params.netMonthlyIncome),
      monthlyExpenses: parseFloat(params.monthlyExpenses),
      debts: params.debts ? JSON.parse(params.debts) : [],
      savings: params.savings ? JSON.parse(params.savings) : { savings: 0, chequing: 0, shortTerm: 0 },
      helocRateAPR: parseFloat(params.helocRateAPR),
      ltvLimit: params.ltvLimit ? parseFloat(params.ltvLimit) : 0.8,
      cardOffset: params.cardOffset === 'true',
    };

    async function runCalculation() {
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
    }

    runCalculation();
  }, [searchParams]);

  useEffect(() => {
    if (isLoading || error || !data) return;

    function go(plan: string) {
        const url = `/purchase?plan=${encodeURIComponent(plan)}`;
        window.location.href = url;
    }

    function attach(id: string, plan: string) {
        var btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', function(e) {
            e.preventDefault();
            go(plan);
        });
    }

    attach('cta-elite-999', 'elite_999');
    attach('cta-pro-197',   'pro_197');
    attach('cta-basic-29',  'basic_29');
    
  }, [isLoading, error, data, toast]);

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
      <Alert variant="destructive" className="container max-w-2xl my-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Calculation Error</AlertTitle>
        <AlertDescription>
          <p>We couldn't generate your savings report. Here's the error message:</p>
          <pre className="mt-2 text-xs bg-muted/50 p-2 rounded whitespace-pre-wrap">{error}</pre>
          <Button asChild variant="secondary" size="sm" className="mt-4">
            <Link href="/questionnaire">Go Back and Try Again</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const yearsSaved = Math.floor((data.debtFreeMonthsBaseline - data.debtFreeMonthsHeloc) / 12);
  const monthsSaved = (data.debtFreeMonthsBaseline - data.debtFreeMonthsHeloc) % 12;
  
  return (
    <>
    <style>{`
      .mc-pricing-choices {
        display: grid;
        gap: 12px;
        max-width: 520px;
        margin: 16px auto 8px auto; /* Centered margin */
      }
      .mc-cta {
        display: block;
        width: 100%;
        padding: 14px 18px;
        font-weight: 600;
        border-radius: 10px;
        border: 1px solid #e4e7ec;
        background: #0f62fe;
        color: #fff;
        cursor: pointer;
      }
      .mc-cta:hover { opacity: 0.92; }
      .mc-note { font-size: 0.9rem; color: #667085; text-align: center; }
    `}</style>
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
          Your Personalized Savings Blueprint
        </h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
          Here’s how the Mortgage Cutter Method can accelerate your journey to financial freedom.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard 
          icon={Calendar} 
          label="Debt-Free Sooner" 
          value={data.debtFreeMonthsBaseline === Infinity ? "Massively" : `${yearsSaved} yrs, ${monthsSaved} mo`}
          description="Time until all consolidated debt is paid off."
        />
        <StatCard 
          icon={Sparkles} 
          label="Total Interest Saved" 
          value={data.interestSaved === Infinity ? "Potentially Unlimited" : currencyFormatter.format(data.interestSaved)}
          description="The extra money that stays in your pocket."
        />
        <StatCard 
          icon={Wallet} 
          label="Borrowing Room" 
          value={currencyFormatter.format(data.borrowingRoomAfterSetup)}
          description="Initial available credit in your HELOC after setup."
          color="text-green-500"
        />
      </div>

      <Card className="mb-8">
        <CardHeader>
            <CardTitle>Debt Payoff Timeline</CardTitle>
            <CardDescription>Visualizing your journey to zero debt: Baseline vs. HELOC Method.</CardDescription>
        </CardHeader>
        <CardContent>
            {data.series.length > 0 ? <ComparisonChart data={data.series} /> : <p>Could not generate chart data.</p>}
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Status Quo: Traditional Payments</CardTitle>
            <CardDescription>Your current path without any changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Debt-Free In</TableCell>
                  <TableCell className="text-right font-mono">{data.debtFreeMonthsBaseline === Infinity ? 'Never' : `${Math.floor(data.debtFreeMonthsBaseline / 12)} yrs ${data.debtFreeMonthsBaseline % 12} mo`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Interest Paid</TableCell>
                  <TableCell className="text-right font-mono">{data.interestBaseline === Infinity ? 'Infinite' : currencyFormatter.format(data.interestBaseline)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary">The Mortgage Cutter Method</CardTitle>
            <CardDescription>Your accelerated path using a HELOC.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Debt-Free In</TableCell>
                  <TableCell className="text-right font-mono">{data.debtFreeMonthsHeloc === Infinity ? 'Never' : `${Math.floor(data.debtFreeMonthsHeloc / 12)} yrs ${data.debtFreeMonthsHeloc % 12} mo`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Interest Paid</TableCell>
                  <TableCell className="text-right font-mono">{data.interestHeloc === Infinity ? 'Infinite' : currencyFormatter.format(data.interestHeloc)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <section id="ResultsSalesSection" className="mt-8 text-center">
         <div id="pricing-choices" className="mc-pricing-choices">
            <button id="cta-elite-999" className="mc-cta">Elite – One-time $997</button>
            <button id="cta-pro-197" className="mc-cta">Pro – One-time $197</button>
            <button id="cta-basic-29" className="mc-cta">Basic – $29/month</button>
        </div>
        <p className="mc-note">You’ll complete your purchase on our secure checkout page.</p>
       </section>
      
       <Alert className="mt-8 border-primary/50">
           <Info className="h-4 w-4" />
           <AlertTitle className="font-bold">Assumptions & Disclaimers</AlertTitle>
           <AlertDescription className="text-xs mt-2">
            Estimates are for educational purposes and are not a guarantee of savings or loan approval. All debts are assumed to be consolidated into the HELOC. The calculation does not include bank fees, closing costs, or property taxes/insurance. Results depend on your actual income, spending, and final lender terms.
           </AlertDescription>
       </Alert>
    </div>
    </>
  );
}

export function ComparisonDisplay() {
  return (
    <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary self-center mt-24" />}>
      <InnerComparison />
    </Suspense>
  )
}

    