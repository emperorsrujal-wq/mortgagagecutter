
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
import { Input } from '@/components/ui/input';

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
        <div id={label.toLowerCase().replace(/\s/g, '-')} className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold" data-monthly-savings={label === 'Monthly Cash Benefit' ? value : undefined}>{value}</div>
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
  const [formInputs, setFormInputs] = useState<Inputs | null>(null);
  
  const yearsSaved = data ? (data.debtFreeMonthsBaseline - data.debtFreeMonthsHeloc) / 12 : 0;
  const yearsSavedTxt = data ? `${Math.floor(yearsSaved)} yrs, ${Math.round((yearsSaved % 1) * 12)} mo` : 'several years';
  const monthlySavings = useMemo(() => {
    if (!data || !formInputs) return 150; // Default
    return Math.max(0, (data.interestBaseline - data.interestHeloc) / data.debtFreeMonthsHeloc);
  }, [data, formInputs]);


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

    useEffect(() => {
        if (isLoading || !data) return;

        // 2) Compute payback
        const proPaybackDays = Math.max(1, Math.ceil(297 / (monthlySavings / 30)));
        const elitePaybackWks = Math.max(1, Math.ceil(997 / (monthlySavings * 4.33)));

        // 3) Inject
        const setText = (id: string, val: string) => {
            const n = document.getElementById(id);
            if (n) n.textContent = val;
        };
        setText('monthlySavingsText', `$${monthlySavings.toFixed(0)}/mo`);
        setText('ms', `$${monthlySavings.toFixed(0)}/mo`);
        setText('yearsSavedText', yearsSavedTxt);
        setText('proDays', `${proPaybackDays} days`);
        setText('eliteWeeks', `${elitePaybackWks} weeks`);

        // 4) Wire buttons
        const go = (id: string, path: string) => {
            const b = document.getElementById(id);
            if (b) b.addEventListener('click', () => {
                window.location.href = path;
            });
        };
        go('btn-elite', '/purchase?plan=elite_999');
        go('btn-pro', '/purchase?plan=pro297');
        
        const modal = document.getElementById('referral-modal');
        const openModal = (mode: string) => {
            if (!modal) return;
            modal.style.display = 'flex';
            const url = new URL(window.location.href);
            const ref = `${url.origin}/?r=${user?.uid || 'guest'}`;
            const inp = document.getElementById('ref-link') as HTMLInputElement | null;
            if (inp) inp.value = ref + '&mode=' + mode;
        };

        const wireRef = (id: string, mode: string) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', () => openModal(mode));
        };
        wireRef('btn-pro-ref', 'pro197');
        wireRef('btn-basic', 'basic29');

        document.getElementById('copy-ref')?.addEventListener('click', () => {
            const inp = document.getElementById('ref-link') as HTMLInputElement | null;
            if (inp) {
                inp.select();
                document.execCommand('copy');
                toast({ title: "Copied!"})
            }
        });

        document.getElementById('close-ref')?.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });

        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const net = (btn as HTMLElement).dataset.net;
                const refLink = (document.getElementById('ref-link') as HTMLInputElement)?.value || '';
                const text = `I used MortgageCutter to slash years off my mortgage without increasing my monthly spend. Try it with $20 off: ${refLink}`;
                let url = '';
                if (net === 'whatsapp') url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                if (net === 'sms') url = `sms:?&body=${encodeURIComponent(text)}`;
                if (net === 'email') url = `mailto:?subject=Cut%20years%20off%20your%20mortgage&body=${encodeURIComponent(text)}`;

                if(url) window.open(url, '_blank');
            });
        });

    }, [isLoading, data, monthlySavings, yearsSavedTxt, user]);

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

  return (
    <>
      <style jsx>{`
        .offer-wrapper {max-width:1100px;margin:24px auto;padding:0 16px}
        .offer-hero h2 {font-size:28px;margin-bottom:4px}
        .payback {background:#f4f7ff;border:1px solid #dfe6ff;padding:10px 12px;border-radius:10px;margin-top:8px}
        .why-works { margin: 18px 0; }
        .why-works ul { list-style-type: '✓ '; padding-left: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media (max-width: 768px) { .why-works ul { grid-template-columns: 1fr; } }
        .cards {display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;margin-top:18px}
        @media (max-width: 1024px) { .cards { grid-template-columns: 1fr; } }
        .card {border:1px solid #e9e9ee;border-radius:14px;padding:18px;background:#fff;box-shadow:0 6px 20px rgba(0,0,0,0.04); display: flex; flex-direction: column; }
        .card ul { flex-grow: 1; margin: 12px 0; padding-left: 18px; list-style-type: '✓ '; }
        .popular {border:2px solid #2563eb; position: relative;}
        .badge {position: absolute; top: -12px; right: 12px; display:inline-block;background:#2563eb;color:#fff;padding:4px 8px;border-radius:999px;font-size:12px;margin-bottom:8px}
        .price {font-size:34px;font-weight:700}
        .sub {font-size:14px;color:#6b7280;margin-left:4px}
        .cta {width:100%;padding:12px 16px;border-radius:10px;margin-top:10px;border:0;cursor:pointer; font-weight: 600;}
        .primary {background:#2563eb;color:#fff}
        .cta:hover { opacity: 0.9; }
        .ghost {background:#fff;border:1px solid #2563eb;color:#2563eb}
        .micro {font-size:12px;color:#6b7280;margin-top:6px}
        .guarantee { background: #f0fdf4; border: 1px solid #bbf7d0; text-align: center; padding: 12px; border-radius: 12px; margin: 18px 0; }
        .social { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
        @media (max-width: 768px) { .social { grid-template-columns: 1fr; } }
        .social blockquote { font-style: italic; background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 3px solid #e0e7ff; }
        #referral-modal{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;z-index:50}
        #referral-modal.open { display: flex; }
        #referral-modal .modal-card{background:#fff;border-radius:14px;padding:20px;max-width:520px;width:92%; position: relative;}
        #close-ref { position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 24px; cursor: pointer; }
        .copyrow{display:flex;gap:8px; margin-top: 4px; }
        .copyrow input{flex:1;padding:10px;border:1px solid #d1d5db;border-radius:8px}
        .copyrow button { padding: 10px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;}
        .share { margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap; }
        .share-btn { padding: 8px 12px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; }
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
            value={data.debtFreeMonthsBaseline === Infinity ? 'Massively' : yearsSavedTxt}
            description="Time until all consolidated debt is paid off."
          />
          <StatCard
            icon={Sparkles}
            label="Total Interest Saved"
            value={data.interestSaved === Infinity ? 'Potentially Unlimited' : currencyFormatter.format(data.interestSaved)}
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

        <div id="offer-copy" className="offer-wrapper">
          <div className="offer-hero text-center">
            <h2>Lock in your projected savings in days—not months.</h2>
            <p id="personal-subhead">Based on your numbers, you can cut <strong id="yearsSavedText">{yearsSavedTxt}</strong> and save about <strong id="monthlySavingsText">${monthlySavings.toFixed(0)}/mo</strong> in interest. Choose a plan to lock it in.</p>
            <div className="payback" id="paybackStrip">
              At your projected savings of <strong id="ms">${monthlySavings.toFixed(0)}/mo</strong>, <strong>Pro</strong> pays for itself in ~<strong id="proDays">__ days</strong>. <strong>Elite</strong> pays for itself in ~<strong id="eliteWeeks">__ weeks</strong>.
            </div>
          </div>

          <div className="why-works">
            <ul>
              <li><strong>Front-loads principal</strong> to choke future interest</li>
              <li><strong>Automates cash flow</strong> so interest days stay low</li>
              <li><strong>No product switch required</strong>—use what you already have</li>
              <li><strong>Math, not hype</strong>—you can verify every step</li>
            </ul>
          </div>

          <div className="cards">
            <div className="card">
              <h3>Elite</h3>
              <div className="price">$997 <span className="sub">one-time</span></div>
              <ul>
                <li>Full course + tools (lifetime)</li>
                <li>Priority email support</li>
                <li>Advanced HELOC strategies + templates</li>
                <li><strong>30-day “Math Match” guarantee</strong></li>
              </ul>
              <button id="btn-elite" className="cta primary">Get Elite (Lifetime)</button>
            </div>

            <div className="card popular">
              <div className="badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">$297 <span className="sub">one-time</span></div>
              <ul>
                <li>Full toolkit access</li>
                <li>Bank-agnostic guidance (U.S. & Canada)</li>
                <li>Referral dashboard to track progress</li>
                <li><strong>Auto-drop to $197</strong> with 5 verified referrals in 14 days</li>
              </ul>
              <button id="btn-pro" className="cta primary">Buy Pro – $297</button>
              <button id="btn-pro-ref" className="cta ghost">Get Pro for $197 (with 5 referrals)</button>
              <div className="micro">Pay now at $297 and we’ll auto-refund $100 when your 5 are verified, or use the referral route first.</div>
            </div>

            <div className="card">
              <h3>Basic</h3>
              <div className="price">$29 <span className="sub">/month</span></div>
              <ul>
                <li>Calculator + monthly action plan</li>
                <li>Community Q&A</li>
                <li>Cancel anytime</li>
                <li><strong>Referral required</strong> to activate checkout (5 signups)</li>
              </ul>
              <button id="btn-basic" className="cta primary">Unlock with 5 Referrals</button>
              <div className="micro">Share your link. When 5 join any paid plan in 14 days, your Basic plan activates.</div>
            </div>
          </div>

          <div className="guarantee">
            <strong>30-Day “Math Match” Guarantee.</strong> If our plan doesn’t reconcile with your bank’s amortization math (±2%), email support within 30 days for a full refund.
          </div>

          <div className="social">
            <blockquote>“Numbers looked too good—until they matched my bank’s amortization. Saved 6+ years.” — Priya S., Calgary</blockquote>
            <blockquote>“Kept my bank. Re-routed cash flow. Plan paid for itself in month one.” — David R., Austin</blockquote>
            <blockquote>“The monthly action plan made it simple. We just followed the dates.” — Nisha & Arjun, Brampton</blockquote>
          </div>

          <div id="referral-modal" style={{display:'none'}}>
            <div className="modal-card">
              <button id="close-ref">×</button>
              <h3>Unlock your discount by helping friends cut theirs</h3>
              <p>You’ll get a unique link. Friends get <strong>$20 off</strong>. When <strong>5</strong> join any paid plan in <strong>14 days</strong>, your price drops automatically.</p>
              <label>Your link</label>
              <div className="copyrow">
                <input id="ref-link" type="text" readOnly />
                <button id="copy-ref">Copy</button>
              </div>
              <div className="share">
                <button className="share-btn" data-net="whatsapp">Share via WhatsApp</button>
                <button className="share-btn" data-net="sms">Share via SMS</button>
                <button className="share-btn" data-net="email">Share via Email</button>
              </div>
            </div>
          </div>
        </div>

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

    