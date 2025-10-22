
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

function NewPricingSection({
  results = { interestSaved: 0, yearsSooner: 0, monthlySaving: 0 },
  userId = "anon",
  initialReferralsCount = 0,
  referralLink = "https://mortgagecutter.com/?ref=YOURCODE",
  initialDeadlineTs = null,
}) {
  const [referralsCount, setReferralsCount] = useState(initialReferralsCount);
  const [deadlineTs, setDeadlineTs] = useState(initialDeadlineTs);
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const goal = 5;

  useEffect(() => {
    if (!deadlineTs) {
      const ts = Date.now() + 72 * 60 * 60 * 1000; // 72 hours
      setDeadlineTs(ts);
    }
  }, [deadlineTs]);

  useEffect(() => {
    if (!deadlineTs) return;
    const tick = () =>
      setSecondsLeft(Math.max(0, Math.floor((deadlineTs - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineTs]);

  const countdown = useMemo(() => {
    const s = secondsLeft;
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${d}d ${h}h ${m}m ${ss}s`;
  }, [secondsLeft]);

  const pct = Math.min(100, Math.round((referralsCount / goal) * 100));
  const eliteUrl = `/purchase?plan=elite_997`;
  const proUrl = `/purchase?plan=pro_197`;
  const basicUrlUnlocked = `/purchase?plan=basic_29&trialMonths=3&ref=${encodeURIComponent(
    userId
  )}`;

  const [confetti, setConfetti] = useState(false);
  useEffect(() => {
    if (referralsCount >= goal) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3500);
    }
  }, [referralsCount]);

  const shareText = `I found a way to cut mortgage interest without changing lifestyle. Try the calculator with your numbers: ${referralLink} — you also get $20 off if you like it.`;
  const enc = encodeURIComponent(shareText);

  const shareTargets = [
    { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${enc}` },
    { label: "SMS", href: `sms:?&body=${enc}` },
    {
      label: "Messenger",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink
      )}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=Cut%20your%20mortgage%20interest&body=${enc}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const simulateReferral = () =>
    setReferralsCount((c) => Math.min(goal, c + 1));

  const fmtMoney = (n) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <section className="mca-pricing">
      <style>{`
        .mca-pricing { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #0f172a; }
        .mca-container { max-width: 1100px; margin: 24px auto; padding: 0 16px; }
        .mca-banner { background: #eef2ff; border:1px solid #c7d2fe; border-radius: 12px; padding: 16px 18px; display:flex; align-items:center; gap:16px; }
        .mca-badge { background:#6366f1; color:#fff; font-weight:600; padding:6px 10px; border-radius:999px; font-size:12px; }
        .mca-banner h3 { margin:0; font-size:20px; font-weight:700; }
        .mca-banner p { margin:0; color:#334155; font-size:14px; }
        .mca-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-top:18px; }
        @media (max-width: 900px){ .mca-grid { grid-template-columns: 1fr; } }
        .mca-card { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px; box-shadow: 0 6px 20px rgba(2,6,23,.06); position:relative; }
        .mca-ribbon { position:absolute; top:12px; right:-6px; background:#fde68a; color:#7c2d12; font-weight:700; padding:6px 10px; border-radius:6px; font-size:12px; transform: rotate(2deg); }
        .mca-price { font-size:36px; font-weight:800; margin:6px 0; }
        .mca-sub { color:#64748b; font-size:12px; margin-left:6px; }
        .mca-bullets { margin:14px 0 16px; padding-left:18px; }
        .mca-bullets li { margin:6px 0; }
        .mca-cta { display:block; width:100%; background:#2563eb; color:#fff; text-align:center; padding:12px; border-radius:10px; font-weight:700; border:none; cursor:pointer; text-decoration: none; }
        .mca-cta.secondary { background:#fbbf24; color:#111827; }
        .mca-cta:disabled { opacity:.6; cursor:not-allowed; }
        .mca-trust { display:flex; gap:12px; align-items:center; color:#64748b; font-size:12px; margin-top:8px; }
        .mca-refer-wrap { background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:12px; margin-top:12px; }
        .mca-progress { background:#e5e7eb; height:8px; border-radius:8px; overflow:hidden; }
        .mca-progress > span { display:block; height:100%; background:#22c55e; width:0%; transition:width .4s ease; }
        .mca-deadline { display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:12px; color:#475569; }
        .mca-share { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
        .mca-share a, .mca-copy { background:#e2e8f0; padding:8px 10px; border-radius:8px; font-weight:600; font-size:13px; text-decoration:none; color:#0f172a; }
        .mca-copy { border:none; cursor:pointer; }
        .mca-note { font-size:12px; color:#64748b; margin-top:6px; }
        .mca-confetti { position:fixed; inset:0; pointer-events:none; display:grid; place-items:center; }
        .mca-dot { width:10px; height:10px; background:#22d3ee; border-radius:999px; position:absolute; animation:pop 1s ease forwards; }
        @keyframes pop {
          0% { transform: translate(0,0) scale(0); opacity:1; }
          80% { transform: translate(var(--x), var(--y)) scale(1); opacity:.9; }
          100% { opacity:0; }
        }
        .mca-faq { margin-top:24px; display:grid; gap:10px; }
        .mca-faq-item { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; }
        .mca-quote { margin-top:16px; font-style:italic; color:#334155; font-size:14px; }
      `}</style>
      {confetti && <Confetti />}
      <div className="mca-container">
        <div className="mca-banner">
          <span className="mca-badge">With your numbers</span>
          <div>
            <h3>
              Save up to {fmtMoney(results.interestSaved)} & finish ~
              {results.yearsSooner?.toFixed?.(1) ?? 0} years sooner
            </h3>
            <p>
              Typical payback on Pro: ~
              {Math.max(
                1,
                Math.round(197 / Math.max(1, results.monthlySaving || 100))
              ).toFixed(0)}
              –
              {Math.max(
                2,
                Math.round(197 / Math.max(1, results.monthlySaving || 150))
              ).toFixed(0)}{" "}
              weeks at your current rate.
            </p>
          </div>
        </div>
        <div className="mca-card" style={{ marginTop: 16 }}>
          <strong>Why it works</strong>
          <ul className="mca-bullets">
            <li>
              Front-loads principal reduction to choke future interest.
            </li>
            <li>
              Automates cash-flow timing so your money sits fewer days in
              interest-bearing buckets.
            </li>
            <li>
              Bank-agnostic: use your current mortgage/HELOC (U.S. & Canada).
            </li>
          </ul>
        </div>
        <div className="mca-grid">
          <div className="mca-card">
            <div className="mca-ribbon">Most Comprehensive</div>
            <h3>Elite</h3>
            <div className="mca-price">
              $997 <span className="mca-sub">one-time</span>
            </div>
            <ul className="mca-bullets">
              <li>Full course + tools (lifetime)</li>
              <li>Private onboarding call</li>
              <li>Priority email support</li>
              <li>Advanced readvanceable/HELOC tactics</li>
            </ul>
            <Link href={eliteUrl} className="mca-cta">
              Get Elite — Start Saving Faster
            </Link>
            <div className="mca-trust">
              <span>🔒 Secure Checkout</span>
              <span>🧮 Bank-agnostic</span>
              <span>🇺🇸🇨🇦 US/Canada</span>
            </div>
          </div>
          <div className="mca-card">
            <div
              className="mca-ribbon"
              style={{ background: "#86efac", color: "#134e4a" }}
            >
              Best Value
            </div>
            <h3>Pro</h3>
            <div className="mca-price">
              $197 <span className="mca-sub">one-time</span>
            </div>
            <ul className="mca-bullets">
              <li>Core course + calculator toolkit</li>
              <li>Bank-agnostic guidance (U.S. & Canada)</li>
              <li>Monthly strategy email + annual updates</li>
              <li>Referral dashboard to track progress</li>
            </ul>
            <Link href={proUrl} className="mca-cta secondary">
              Get Pro — Unlock My Plan
            </Link>
            <div className="mca-note">
              Pays for itself in weeks based on your projection.
            </div>
          </div>
          <div className="mca-card">
            <h3>Basic</h3>
            <div className="mca-price">
              $29 <span className="mca-sub">/month</span>
            </div>
            <ul className="mca-bullets">
              <li>Calculator + monthly action plan</li>
              <li>Community Q&A</li>
              <li>Cancel anytime</li>
            </ul>
            <div className="mca-refer-wrap">
              <strong>Founder Perk:</strong> Invite <b>5 friends</b> → get{" "}
              <b>3 months FREE</b>.
              <div className="mca-progress" aria-label="Referral progress">
                <span style={{ width: `${pct}%` }} />
              </div>
              <div className="mca-deadline">
                <div>🎯 {referralsCount}/{goal} referrals completed</div>
                <div>
                  ⏳ Ends in <b>{countdown}</b>
                </div>
              </div>
              {!showSharePanel && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    className="mca-cta"
                    onClick={() => setShowSharePanel(true)}
                  >
                    Invite Friends — Unlock 3 Months Free
                  </button>
                </div>
              )}
              {showSharePanel && (
                <>
                  <div className="mca-share">
                    {shareTargets.map((t) => (
                      <a
                        key={t.label}
                        href={t.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.label}
                      </a>
                    ))}
                    <button className="mca-copy" onClick={copyLink}>
                      {copied ? "Link Copied ✅" : "Copy Link"}
                    </button>
                  </div>
                  <div className="mca-note">Your link: {referralLink}</div>
                  <button className="mca-copy" onClick={simulateReferral}>
                    Simulate +1 referral
                  </button>
                </>
              )}
            </div>
            {referralsCount >= goal ? (
              <Link
                href={basicUrlUnlocked}
                className="mca-cta"
                style={{ marginTop: 12 }}
              >
                Checkout — 3 Months FREE Applied
              </Link>
            ) : (
              <button className="mca-cta" style={{ marginTop: 12 }} disabled>
                Unlock with 5 Referrals
              </button>
            )}
            <div className="mca-note">
              Referrals must verify email to count.
            </div>
          </div>
        </div>
        <div className="mca-grid" style={{ marginTop: 16 }}>
          <div className="mca-card">
            <div className="mca-quote">
              “Numbers looked too good—until they matched my bank’s
              amortization. Saved 6+ years.”
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              — Priya S., Calgary • ~$540k @ 5.1%
            </div>
          </div>
          <div className="mca-card">
            <div className="mca-quote">
              “Kept my bank. Re-routed cash flow. Plan paid for itself in month
              one.”
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              — David R., Austin • ~$420k @ 6.0%
            </div>
          </div>
          <div className="mca-card">
            <div className="mca-quote">
              “The monthly action plan made it simple. We just followed the
              dates.”
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              — Nisha & Arjun, Brampton • ~$610k @ 5.4%
            </div>
          </div>
        </div>
        <div className="mca-card" style={{ marginTop: 16 }}>
          <strong>30-Day Show-Your-Math Guarantee</strong>
          <p style={{ marginTop: 6, color: "#334155" }}>
            If our math doesn’t align with your lender’s amortization, we fix it
            or refund.
          </p>
          <div className="mca-faq">
            <div className="mca-faq-item">
              <b>Do I need to switch banks?</b>
              <br />
              No. Many members use readvanceable setups (e.g., STEP, Home Power
              Plan) with the same bank.
            </div>
            <div className="mca-faq-item">
              <b>Will this hurt my credit?</b>
              <br />
              No if you pay on time and keep utilization sensible. We cover best
              practices.
            </div>
            <div className="mca-faq-item">
              <b>Is this debt consolidation?</b>
              <br />
              No. It’s timing + principal-first strategy that reduces interest
              days.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Confetti() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (Math.random() * 2 - 1) * 300 + "px",
    y: (Math.random() * 2 - 1) * 220 + "px",
    color: ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f472b6"][
      Math.floor(Math.random() * 5)
    ],
  }));
  return (
    <div className="mca-confetti">
      {dots.map((d) => (
        <span
          key={d.id}
          className="mca-dot"
          style={{ "--x": d.x, "--y": d.y, background: d.color }}
        />
      ))}
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
  
  const yearsSaved = data ? (data.debtFreeMonthsBaseline - data.debtFreeMonthsHeloc) / 12 : 0;
  const yearsSavedTxt = data ? `${Math.floor(yearsSaved)} yrs, ${Math.round((yearsSaved % 1) * 12)} mo` : 'several years';
  
  const monthlySavings = useMemo(() => {
    if (!data || !data.debtFreeMonthsHeloc || data.debtFreeMonthsHeloc === 0) return 150; // Default
    return Math.max(0, (data.interestBaseline - data.interestHeloc) / data.debtFreeMonthsHeloc);
  }, [data]);


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
        
        <NewPricingSection
          results={{
            interestSaved: data.interestSaved,
            yearsSooner: yearsSaved,
            monthlySaving: monthlySavings,
          }}
          userId={user?.uid}
          referralLink={`https://mortgagecutter.com/?ref=${user?.uid || 'CODE'}`}
        />


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

    