
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useMemo, Suspense, useCallback } from 'react';
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
  X,
  Copy,
  Share2,
  ChevronRight,
  CheckCircle,
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


function SocialProofBar() {
  const quotes = [
    { quote: "“Numbers looked too good—until they matched my bank’s amortization. Saved 6+ years.”", author: "Priya S., Calgary" },
    { quote: "“Kept my bank. Re-routed cash flow. Plan paid for itself in month one.”", author: "David R., Austin" },
    { quote: "“The monthly action plan made it simple. We just followed the dates.”", author: "Nisha & Arjun, Brampton" },
  ];
  return (
    <div className="mc-proof-bar">
      {quotes.map((q, i) => (
        <div key={i}>
          <p className="italic">“{q.quote}”</p>
          <p className="font-semibold text-xs mt-1">— {q.author}</p>
        </div>
      ))}
    </div>
  );
}

function ReferralPanel({ isOpen, onClose, user, unlockTarget }: { isOpen: boolean, onClose: () => void, user: any, unlockTarget: 'pro' | 'basic' }) {
  const { toast } = useToast();
  // Mock data, this would come from Firestore
  const [referralState, setReferralState] = useState({
    linkCode: user?.uid ? `ref-${user.uid.substring(0,6)}` : 'YOURCODE',
    verifiedCount: 0,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    discountEligible: false,
  });

  const referralLink = `https://mortgagecutter.com/?ref=${referralState.linkCode}`;
  
  const daysLeft = useMemo(() => {
    const diff = referralState.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [referralState.expiresAt]);

  const progress = Math.min(100, (referralState.verifiedCount / 5) * 100);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Referral link copied!' });
  };
  
  const shareMessage = `I used MortgageCutter to slash years off my mortgage without spending more each month. Try it with $20 off my link: ${referralLink}`;

  const shareTargets = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareMessage)}` },
    { label: "SMS", href: `sms:?&body=${encodeURIComponent(shareMessage)}` },
    { label: "Messenger", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent('Cut years off your mortgage')}&body=${encodeURIComponent(shareMessage)}` },
  ];

  return (
    <div id="referral-panel" className={cn("fixed inset-0 z-50", isOpen ? "flex" : "hidden")}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose}></div>
      {/* Panel */}
      <div className="mc-slide-over fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-lg p-6 overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted"><X /></button>
        
        <h3 className="text-xl font-bold mb-2">Unlock your $197 price <span className="text-muted-foreground">(5 verified referrals)</span></h3>
        
        <div className="space-y-4 my-6">
          <label className="text-sm font-medium">Your personal link</label>
          <div className="flex gap-2">
            <Input id="ref-link" readOnly value={referralLink} />
            <Button id="ref-copy" variant="outline" size="icon" onClick={copyLink}><Copy /></Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {shareTargets.map(t => (
            <Button asChild key={t.label} variant="outline" size="sm">
              <a href={t.href} target="_blank" rel="noopener noreferrer">{t.label}</a>
            </Button>
          ))}
        </div>

        <div className="my-6">
            <div className="flex justify-between text-sm mb-1">
                <span id="ref-progress">Verified: {referralState.verifiedCount}/5</span>
                <span id="ref-days-left">Days left: {daysLeft}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        
        <div className="text-sm space-y-3">
          <h4 className="font-semibold">How it works:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Your friend clicks your link.</li>
              <li>They verify their email & run the free estimator.</li>
              <li>They aren’t a duplicate user (new device/IP).</li>
          </ul>
        </div>
        
        <div className="mt-6">
            <Button id="buy-pro-297" className="w-full" onClick={() => window.location.href="/purchase?plan=pro_297"}>
                Buy at $297 now <ChevronRight />
            </Button>
        </div>
        
        <div className="mt-6 text-xs text-muted-foreground border-t pt-4">
             <p>Discount applies when 5 new users verify their email and complete the free estimator via your link within 14 days. Self-referrals or duplicates don’t count. Verification may take up to 48 hours. You may purchase at $297 anytime; once 5 are verified your checkout auto-drops to $197.</p>
        </div>
      </div>
    </div>
  );
}


function InnerComparison() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Outputs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const [formInputs, setFormInputs] = useState<Inputs | null>(null);
  const [isReferralPanelOpen, setIsReferralPanelOpen] = useState(false);
  const [referralUnlockTarget, setReferralUnlockTarget] = useState<'pro' | 'basic'>('pro');


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
    setFormInputs(input);

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

  const openReferralPanel = (target: 'pro' | 'basic') => {
    setReferralUnlockTarget(target);
    setIsReferralPanelOpen(true);
  };
  
  const closeReferralPanel = () => setIsReferralPanelOpen(false);

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

  if (!data || !formInputs) return null;

  const yearsSaved = (data.debtFreeMonthsBaseline - data.debtFreeMonthsHeloc) / 12;
  const monthlyCashBenefit = formInputs.netMonthlyIncome - formInputs.monthlyExpenses - ((data.interestHeloc/data.debtFreeMonthsHeloc) || 0)
  
  return (
    <>
      <style>{`
          .mc-proof-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0; padding: 1rem; border-radius: 0.75rem; background-color: hsl(var(--secondary)); border: 1px solid hsl(var(--border)); }
          @media (max-width: 900px) { .mc-proof-bar { grid-template-columns: 1fr; } }
          .mc-proof-bar p { margin: 0; font-size: 0.875rem; line-height: 1.25rem; color: hsl(var(--secondary-foreground)); }
          .mc-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
          @media (max-width: 1024px) { .mc-pricing-grid { grid-template-columns: 1fr; } }
          .mc-pricing-card { border: 1px solid hsl(var(--border)); border-radius: 1rem; padding: 1.5rem; display: flex; flex-direction: column; }
          .mc-pricing-card h4 { font-size: 1.25rem; font-weight: 600; }
          .mc-pricing-card.pro { border-width: 2px; border-color: hsl(var(--primary)); }
          .mc-pricing-card ul { list-style-position: inside; list-style-type: disc; margin: 1rem 0; font-size: 0.875rem; color: hsl(var(--muted-foreground)); space-y: 0.5rem; flex-grow: 1; }
          .mc-slide-over { animation: slide-in-right 0.3s ease-out; }
          @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
      <ReferralPanel isOpen={isReferralPanelOpen} onClose={closeReferralPanel} user={user} unlockTarget={referralUnlockTarget} />

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
          value={data.debtFreeMonthsBaseline === Infinity ? "Massively" : `${Math.floor(yearsSaved)} yrs, ${Math.round((yearsSaved % 1) * 12)} mo`}
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

      <section id="offer-section" className="mt-12">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Pick your path to mortgage freedom</h2>
            <p className="mt-2 text-muted-foreground">Buy today or unlock a discount by sharing your link.</p>
        </div>
        <SocialProofBar />

        <div className="mc-pricing-grid">
            <div id="pricing-elite" className="mc-pricing-card">
                <h4 className="font-semibold">Elite</h4>
                <p className="text-4xl font-bold my-2">$997 <span className="text-sm font-normal text-muted-foreground">one-time</span></p>
                <ul>
                    <li>Lifetime course + tools</li>
                    <li>Priority email support</li>
                    <li>Advanced HELOC strategies</li>
                </ul>
                <Button id="cta-elite-997" variant="outline" className="w-full mt-4" onClick={() => window.location.href="/purchase?plan=elite_997"}>
                    Get Elite
                </Button>
            </div>
            
            <div id="pricing-pro" className="mc-pricing-card pro">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Pro</h4>
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">Most Popular</div>
                </div>
                 <p className="text-4xl font-bold my-2">$297 <span className="text-sm font-normal text-muted-foreground">one-time</span></p>
                 <ul>
                    <li>Full toolkit</li>
                    <li>Bank-agnostic guidance (U.S. & Canada)</li>
                    <li>Referral dashboard</li>
                </ul>
                <div className="mt-4 space-y-2">
                   <Button id="buy-pro-297" className="w-full" onClick={() => window.location.href="/purchase?plan=pro_297"}>Buy Pro – $297</Button>
                   <Button id="unlock-pro-197" variant="secondary" className="w-full" onClick={() => openReferralPanel('pro')}>Get Pro for $197 <span className="ml-1 text-xs">(with 5 referrals)</span></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">You can buy at $297 anytime. Your price drops to $197 automatically when 5 are verified within 14 days.</p>
            </div>
            
            <div id="pricing-basic" className="mc-pricing-card">
                 <h4 className="font-semibold">Basic</h4>
                <p className="text-4xl font-bold my-2">$29 <span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <ul>
                    <li>Calculator + monthly plan</li>
                    <li>Community Q&A</li>
                    <li>Cancel anytime</li>
                </ul>
                 <Button id="unlock-basic-29" className="w-full mt-4" onClick={() => openReferralPanel('basic')}>Unlock with 5 Referrals</Button>
                 <p className="text-xs text-muted-foreground mt-2 text-center">Referral required to activate checkout.</p>
            </div>
        </div>
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
