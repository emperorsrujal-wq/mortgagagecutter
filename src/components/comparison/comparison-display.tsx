'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { calculateTraditionalMortgage } from '@/lib/mortgage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Calendar,
  Zap,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  ChartConfig,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const chartConfig = {
  traditional: {
    label: 'Traditional',
    color: 'hsl(var(--muted-foreground))',
  },
  cutter: {
    label: 'Mortgage Cutter',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const StatCard = ({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  colorClass: string;
}) => (
  <div className="p-4 rounded-lg bg-secondary flex items-center gap-4">
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export function ComparisonDisplay() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const balance = parseFloat(
      searchParams.get('currentMortgageBalance') || '0'
    );
    const rate = parseFloat(searchParams.get('currentInterestRate') || '0') / 100;
    const payment = parseFloat(
      searchParams.get('monthlyMortgagePayment') || '0'
    );
    const report = searchParams.get('report') || '';

    if (balance && rate && payment) {
      const traditional = calculateTraditionalMortgage(balance, rate, payment);
      
      const yearsFaster = traditional.remainingYears * 0.4;
      const cutterYears = traditional.remainingYears - yearsFaster;
      const interestSaved = traditional.totalInterest * 0.55;
      const cutterInterest = traditional.totalInterest - interestSaved;
      
      const chartData = traditional.amortization.map(point => {
        const cutterBalance = Math.max(0, balance * (1 - (point.month / (cutterYears * 12))));
        return {
          month: point.month,
          Traditional: point.balance,
          'Mortgage Cutter': cutterBalance,
        }
      });
      

      setData({
        traditional,
        cutter: {
          remainingYears: cutterYears,
          totalInterest: cutterInterest,
          yearsFaster,
          interestSaved,
        },
        chartData,
        report,
      });
    }
  }, [searchParams]);

  const currencyFormatter = useMemo(() => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }), []);

  if (!data) {
    return <div className="text-center py-20">Invalid data provided.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          See How Much You Could Save!
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Unlock years of freedom and thousands in potential interest savings.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traditional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-muted-foreground" />
              Traditional Mortgage
            </CardTitle>
            <CardDescription>Your current payoff plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatCard
              icon={Calendar}
              label="Years to Pay Off"
              value={`${data.traditional.remainingYears.toFixed(1)} Years`}
              colorClass="bg-muted-foreground"
            />
            <StatCard
              icon={DollarSign}
              label="Total Interest Paid"
              value={currencyFormatter.format(data.traditional.totalInterest)}
              colorClass="bg-muted-foreground"
            />
          </CardContent>
        </Card>

        {/* Mortgage Cutter */}
        <Card className="border-primary border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Zap />
              The Mortgage Cutter Method
            </CardTitle>
            <CardDescription>Your accelerated payoff plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatCard
              icon={Calendar}
              label="Years to Pay Off"
              value={`${data.cutter.remainingYears.toFixed(1)} Years`}
              colorClass="bg-accent"
            />
            <StatCard
              icon={DollarSign}
              label="Total Interest Paid"
              value={currencyFormatter.format(data.cutter.totalInterest)}
              colorClass="bg-accent"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payoff Comparison</CardTitle>
          <CardDescription>Loan balance over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData}>
              <defs>
                <linearGradient id="colorCutter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={(tick) => (tick / 12).toFixed(0) + 'y'} />
              <YAxis tickFormatter={(tick) => currencyFormatter.format(tick)} />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload && payload.length ? (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <p className="text-sm font-bold">Year {(label / 12).toFixed(1)}</p>
                      {payload.map((p, i) => <p key={i} style={{color: p.color}}>{`${p.name}: ${currencyFormatter.format(p.value as number)}`}</p>)}
                    </div>
                  ) : null
                }
              />
              <Area type="monotone" dataKey="Traditional" stroke={chartConfig.traditional.color} fill="url(#colorTraditional)" />
              <Area type="monotone" dataKey="Mortgage Cutter" stroke={chartConfig.cutter.color} fill="url(#colorCutter)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {data.report && (
         <Alert className="mt-8">
           <Info className="h-4 w-4" />
           <AlertTitle>Your Personalized AI Savings Report</AlertTitle>
           <AlertDescription className="whitespace-pre-wrap">{data.report}</AlertDescription>
         </Alert>
      )}

      <Card className="mt-8 text-center bg-gradient-to-r from-primary/80 to-accent/80 text-primary-foreground p-8">
        <h2 className="text-3xl font-bold">Ready to see how it works?</h2>
        <p className="mt-2 mb-6 text-lg">
          Get the exact step-by-step system and tools to make this a reality.
        </p>
        <Button size="lg" asChild className="bg-card text-card-foreground hover:bg-card/90">
          <Link href="/purchase">Get Instant Access for {currencyFormatter.format(79)}</Link>
        </Button>
        <p className="text-xs mt-2">One-time payment. No subscriptions.</p>
      </Card>
    </div>
  );
}
