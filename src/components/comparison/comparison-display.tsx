
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { calculateMortgage } from '@/lib/mortgage';
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
  Clock,
  Heart,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


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
  isPrimary,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  colorClass: string;
  isPrimary?: boolean;
}) => (
  <div className={`p-4 rounded-lg flex items-center gap-4 ${isPrimary ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon className={`h-6 w-6 ${isPrimary ? 'text-primary' : 'text-white'}`} />
    </div>
    <div>
      <p className={`text-sm ${isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{label}</p>
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
    const monthlyIncome = parseFloat(searchParams.get('monthlyIncome') || '0');
    // The expenses from the querystring do NOT include the mortgage payment.
    const monthlyExpenses = parseFloat(searchParams.get('monthlyExpenses') || '0');
    const report = searchParams.get('report') || '';
    
    // For the HELOC calculation, total expenses must include the mortgage payment.
    const totalMonthlyExpenses = monthlyExpenses + payment;

    if (balance && rate && payment && monthlyIncome && totalMonthlyExpenses) {
      const traditional = calculateMortgage({
        balance,
        annualRate: rate,
        monthlyPayment: payment,
        method: 'traditional',
      });
      
      const cutter = calculateMortgage({
        balance,
        annualRate: rate,
        monthlyPayment: payment,
        method: 'heloc',
        monthlyIncome,
        monthlyExpenses: totalMonthlyExpenses, // Use the corrected total expenses
      });

      const yearsFaster = traditional.remainingYears - cutter.remainingYears;
      const interestSaved = traditional.totalInterest - cutter.totalInterest;

      const maxMonths = Math.ceil(Math.max(traditional.amortization.length > 0 ? traditional.amortization[traditional.amortization.length - 1].month : 0, cutter.amortization.length > 0 ? cutter.amortization[cutter.amortization.length - 1].month: 0));
      const chartData = Array.from({ length: maxMonths + 1 }, (_, i) => {
        const month = i;
        const traditionalPoint = traditional.amortization.find(p => p.month === month);
        const cutterPoint = cutter.amortization.find(p => p.month === month);

        return {
          month: month,
          Traditional: traditionalPoint ? traditionalPoint.balance : null,
          'Mortgage Cutter': cutterPoint ? cutterPoint.balance : null,
        }
      }).filter(p => p.month % 12 === 0 || p.Traditional === 0 || p['Mortgage Cutter'] === 0 || p.month === maxMonths);
      
      const today = new Date();
      const traditionalPayoffDate = new Date(today.getFullYear() + Math.floor(traditional.remainingYears), today.getMonth() + Math.round((traditional.remainingYears % 1) * 12), today.getDate());
      const cutterPayoffDate = new Date(today.getFullYear() + Math.floor(cutter.remainingYears), today.getMonth() + Math.round((cutter.remainingYears % 1) * 12), today.getDate());

      setData({
        traditional: {
          ...traditional,
          payoffDate: traditionalPayoffDate,
        },
        cutter: {
          ...cutter,
          yearsFaster,
          interestSaved,
          payoffDate: cutterPayoffDate,
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

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }), []);

  if (!data) {
    return <div className="text-center py-20">Invalid data provided. Please ensure all fields are filled out correctly.</div>;
  }
  
  const yearsSaved = Math.floor(data.cutter.yearsFaster);
  const monthsSaved = Math.round((data.cutter.yearsFaster - yearsSaved) * 12);

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
          Your Personalized Savings Blueprint
        </h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
          Here’s a clear comparison showing how the Mortgage Cutter Method accelerates your journey to financial freedom.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         <StatCard
            icon={Clock}
            label="Years Paid Off Faster"
            value={`${yearsSaved} Years, ${monthsSaved} Months`}
            colorClass="bg-accent/20"
            isPrimary={true}
          />
          <StatCard
            icon={Heart}
            label="Total Interest Saved"
            value={currencyFormatter.format(data.cutter.interestSaved)}
            colorClass="bg-accent/20"
            isPrimary={true}
          />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Side-by-Side Comparison</CardTitle>
          <CardDescription>See the powerful difference the Mortgage Cutter Method can make.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Metric</TableHead>
                <TableHead className="text-center font-bold">Your Current Mortgage</TableHead>
                <TableHead className="text-center font-bold text-primary">Mortgage Cutter Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2"><Calendar /> Payoff Date</TableCell>
                <TableCell className="text-center">{dateFormatter.format(data.traditional.payoffDate)}</TableCell>
                <TableCell className="text-center font-semibold text-primary">{dateFormatter.format(data.cutter.payoffDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2"><Clock /> Remaining Time</TableCell>
                <TableCell className="text-center">{data.traditional.remainingYears.toFixed(1)} Years</TableCell>
                <TableCell className="text-center font-semibold text-primary">{data.cutter.remainingYears.toFixed(1)} Years</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2"><DollarSign /> Total Future Interest</TableCell>
                <TableCell className="text-center">{currencyFormatter.format(data.traditional.totalInterest)}</TableCell>
                <TableCell className="text-center font-semibold text-primary">{currencyFormatter.format(data.cutter.totalInterest)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Loan Balance Over Time</CardTitle>
          <CardDescription>This chart illustrates how quickly your mortgage balance could drop.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
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
              <XAxis dataKey="month" tickFormatter={(tick) => `Year ${(tick / 12).toFixed(0)}`} label={{ value: 'Years', position: 'insideBottom', offset: -15 }} />
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
              <Area type="monotone" dataKey="Traditional" stroke={chartConfig.traditional.color} fillOpacity={1} fill="url(#colorTraditional)" />
              <Area type="monotone" dataKey="Mortgage Cutter" stroke={chartConfig.cutter.color} fillOpacity={1} fill="url(#colorCutter)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {data.report && (
         <Alert className="mt-8 border-primary/50">
           <Info className="h-4 w-4" />
           <AlertTitle className="font-bold">Your Personalized AI Savings Report</AlertTitle>
           <AlertDescription className="whitespace-pre-wrap">{data.report}</AlertDescription>
         </Alert>
      )}

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
