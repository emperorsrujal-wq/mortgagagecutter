
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

      const script = document.createElement('script');
      script.innerHTML = `
        (function(){
          const PURCHASE_URL = '/purchase';

          function go(plan, extraParams={}) {
            const params = new URLSearchParams({ plan, ...extraParams });
            window.location.href = \`\${PURCHASE_URL}?\${params.toString()}\`;
          }
          function $(id){ return document.getElementById(id); }

          let uid = '${user?.uid || null}';
          let email = '${user?.email || null}';
          let db = null;

          if (window.firebase?.auth && window.firebase?.firestore) {
            db = window.firebase.firestore();
             window.firebase.auth().onAuthStateChanged((user)=>{
              if (user){ 
                uid = user.uid; 
                email = user.email; 
                initReferralLink(); 
              } else { 
                uid = null;
                email = null;
                initReferralLink(); 
              }
            });
          } else {
            initReferralLink();
          }

          function initReferralLink(){
            const key = uid || ('guest-' + Math.random().toString(36).slice(2,10));
            const link = \`\${window.location.origin}/?ref=\${encodeURIComponent(key)}\`;
            const input = $('mc-ref-link');
            if (input) input.value = link;
          }
          
          function attach(id, fn){
            const el = $(id);
            if (!el) return;
            el.addEventListener('click', function(e){ e.preventDefault(); fn(); }, false);
          }

          attach('cta-elite-999', () => go('elite_999'));
          attach('cta-pro-197', () => openReferral());
          attach('cta-basic-29', () => go('basic_29'));


          function openReferral(){
            const modal = $('mc-referral-modal');
            if (!modal) return;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden','false');
          }
          $('mc-ref-close')?.addEventListener('click', ()=> {
            const m = $('mc-referral-modal'); if(!m) return;
            m.classList.remove('open'); m.setAttribute('aria-hidden','true');
          });

          $('mc-copy')?.addEventListener('click', ()=> {
            const input = $('mc-ref-link'); if (!input) return;
            input.select(); input.setSelectionRange(0, 99999);
            document.execCommand('copy');
            $('mc-copy').textContent = 'Copied!';
            setTimeout(()=>{$('mc-copy').textContent='Copy';}, 1000);
          });

          $('mc-share')?.addEventListener('click', ()=> {
            const url = $('mc-ref-link')?.value || window.location.href;
            if (navigator.share) {
              navigator.share({ title:'MortgageCutter', text:'Check this mortgage payoff tool', url });
            } else {
              window.open(\`mailto:?subject=MortgageCutter&body=Try this tool: \${encodeURIComponent(url)}\`);
            }
          });

           const refForm = $('mc-ref-form');
           const continueBtn = $('mc-continue');
           const confirmCheckbox = $('mc-confirm');

           function validateForm() {
              if (!refForm || !continueBtn || !confirmCheckbox) return;
              const emails = Array.from(refForm.querySelectorAll('input[type=email]'))
                                  .map(i => i.value.trim())
                                  .filter(Boolean);
              const isConfirmed = confirmCheckbox.checked;
              continueBtn.disabled = !(emails.length >= 5 && isConfirmed);
           }
            
           refForm?.addEventListener('input', validateForm);
           confirmCheckbox?.addEventListener('change', validateForm);

          refForm?.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const form = e.target;
            const emails = [form.e1.value, form.e2.value, form.e3.value, form.e4.value, form.e5.value]
              .map(v => (v||'').trim()).filter(Boolean);
            const confirmed = $('mc-confirm')?.checked;

            if (emails.length < 5 || !confirmed) {
              alert('Please enter at least 5 emails and confirm you have shared your link.');
              return;
            }

            try {
              if (db && uid) {
                await db.collection('referralsSubmissions').add({
                  uid, userEmail: email || null,
                  referrals: emails,
                  link: $('mc-ref-link')?.value || null,
                  createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
                });
              }
            } catch(err){
              console.warn('Referral save failed (continuing anyway):', err);
            }
            
            go('pro_197', { ref: uid || 'guest' });
          });
        })();
      `;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    
  }, [isLoading, error, data, user, toast]);

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
      /* === MortgageCutter Sales Section (scoped) === */
      .mc-offer { margin-top: 28px; }
      .mc-hero { text-align:center; margin-bottom: 18px; }
      .mc-hero h2 { font-size: 28px; margin: 0 0 8px; }
      .mc-hero p { color:#475467; margin:0 auto 8px; max-width:720px; }
      .mc-badges { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
      .mc-badges span { background:#eef4ff; color:#344054; border:1px solid #d6e4ff; padding:6px 10px; border-radius:999px; font-size:12px; }

      .mc-value-grid { display:grid; gap:18px; grid-template-columns: 1fr 1fr; margin: 18px 0; }
      @media (max-width: 900px){ .mc-value-grid { grid-template-columns: 1fr; } }
      .mc-value { background:#fff; border:1px solid #e4e7ec; border-radius:14px; padding:14px 16px; }
      .mc-value h3 { margin:0 0 8px; }
      .mc-value ul { margin:0; padding-left:18px; }

      .mc-pricing { display:grid; gap:16px; grid-template-columns: repeat(3, 1fr); margin: 12px 0 8px; }
      @media (max-width: 1100px){ .mc-pricing { grid-template-columns:1fr; } }
      .mc-card { background:#fff; border:1px solid #e4e7ec; border-radius:16px; padding:18px; display:flex; flex-direction:column; }
      .mc-card h4 { margin:0 0 6px; font-size:18px; }
      .mc-price { font-size:28px; font-weight:700; margin:4px 0 10px; }
      .mc-price span { font-size:12px; font-weight:500; color:#667085; }
      .mc-includes { padding-left:18px; margin:0 0 12px; }
      .mc-cta { display:inline-block; padding:12px 16px; border-radius:12px; border:1px solid transparent; cursor:pointer; width: 100%; text-align: center; }
      .mc-cta.primary { background:#0f62fe; color:#fff; }
      .mc-cta.accent { background:#ffd500; color:#1f2937; }
      .mc-cta.outline { background:#fff; color:#0f62fe; border-color:#0f62fe; }
      .mc-cta.small { padding:8px 12px; font-size:14px; }
      .mc-small { font-size:12px; color:#667085; margin-top:6px; }

      .mc-proof { display:grid; gap:14px; grid-template-columns:1fr 1fr; margin: 18px 0; }
      @media (max-width: 900px){ .mc-proof { grid-template-columns:1fr; } }
      .mc-quote { background:#f9fafb; border:1px solid #eef2f7; border-radius:14px; padding:14px; font-style:italic; }
      .mc-person { margin-top:6px; color:#475467; font-style:normal; }

      .mc-guarantee { background:#ecfdf3; border:1px solid #a7f3d0; padding:12px 14px; border-radius:12px; margin:12px 0; font-size:14px; }

      .mc-faq details { border:1px solid #e4e7ec; border-radius:10px; padding:10px 12px; margin:8px 0; }
      .mc-faq summary { cursor:pointer; font-weight:600; }

      .mc-modal { position:fixed; inset:0; background:rgba(0,0,0,.45); display:none; align-items:center; justify-content:center; z-index:9999; }
      .mc-modal.open { display:flex; }
      .mc-modal__content { width:min(720px, 92vw); background:#fff; border-radius:16px; padding:18px; border:1px solid #e4e7ec; position: relative; }
      .mc-close { border:none; background:transparent; font-size:20px; float:right; cursor:pointer; position: absolute; top: 10px; right: 10px;}
      .mc-ref-block { margin:10px 0 12px; }
      .mc-ref-row { display:flex; gap:8px; }
      #mc-ref-link { flex:1; padding:10px; border:1px solid #e4e7ec; border-radius:10px; }
      .mc-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
      @media (max-width:700px){ .mc-grid2{ grid-template-columns:1fr; } }
      .mc-check { display:flex; align-items:center; gap:8px; margin:10px 0; font-size: 14px;}
      .mc-ref-actions { margin-top:8px; }
      .mc-legal { font-size:12px; color:#667085; margin-top:8px; }
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

       <section id="mc-offer" className="mc-offer">
        <header className="mc-hero">
          <h2>Slash Years Off Your Mortgage—Starting Today</h2>
          <p>Use your existing mortgage + HELOC the smart way. No lifestyle change. No bank switch. Just smarter cash flow.</p>
          <div className="mc-badges">
            <span>Bank-agnostic</span><span>US & Canada</span><span>Private & Secure</span>
          </div>
        </header>

        <div className="mc-value-grid">
          <div className="mc-value">
            <h3>What you get</h3>
            <ul>
              <li>Interactive payoff roadmap tailored to your numbers</li>
              <li>Monthly action plan (lump-sum timing + amounts)</li>
              <li>Side-by-side “Do Nothing vs. Smart Flow” comparison</li>
              <li>Lifetime access to updates (plan tier dependent)</li>
              <li>Members-only tools & email support (tier dependent)</li>
            </ul>
          </div>
          <div className="mc-value">
            <h3>Why it works</h3>
            <ul>
              <li>Front-loads principal reduction to choke future interest</li>
              <li>Automates your cash flow to keep interest days low</li>
              <li>Uses the products you already have (mortgage/HELOC)</li>
              <li>No promises—just math you can verify any time</li>
            </ul>
          </div>
        </div>

        <div className="mc-pricing">
          <article className="mc-card">
            <h4>Elite</h4>
            <div className="mc-price">$997 <span>one-time</span></div>
            <ul className="mc-includes">
              <li>Full course + tools (lifetime)</li>
              <li>Priority email support</li>
              <li>Advanced HELOC strategies</li>
            </ul>
            <button id="cta-elite-999" className="mc-cta primary">Get Elite</button>
          </article>

          <article className="mc-card">
            <h4>Pro (Referral Unlock)</h4>
            <div className="mc-price">$197 <span>one-time</span></div>
            <p className="text-xs text-gray-600 mb-2">Unlock lifetime with 5 referrals in 30 days</p>
            <ul className="mc-includes">
                <li>Full toolkit access</li>
                <li>Bank-agnostic guidance (U.S. & Canada)</li>
                <li>Referral dashboard to track progress</li>
                <li>Friends get $20 off via your link</li>
                <li>If you don’t hit 5 in 30 days, it continues at $29/mo until you do—then billing stops forever</li>
              </ul>
            <button id="cta-pro-197" className="mc-cta accent">Get Lifetime for $197</button>
          </article>

          <article className="mc-card">
            <h4>Basic</h4>
            <div className="mc-price">$29 <span>/month</span></div>
            <ul className="mc-includes">
              <li>Calculator + monthly plan</li>
              <li>Community Q&A</li>
              <li>Cancel anytime</li>
            </ul>
            <button id="cta-basic-29" className="mc-cta primary">Start for $29/month</button>
          </article>
        </div>

        <section className="mc-proof">
          <div className="mc-quote">
            “I thought this was too good to be true—until the numbers matched my bank statements. Saved 6+ years.”
            <div className="mc-person">— Priya S., Calgary</div>
          </div>
          <div className="mc-quote">
            “I kept my bank and just re-routed my cash flow. The plan paid for itself in month one.”
            <div className="mc-person">— David R., Austin</div>
          </div>
        </section>

        <div className="mc-guarantee">
          <strong>30-Day “Show-Your-Math” Guarantee:</strong> If the numbers in our tool don’t align with your lender’s amortization math, we’ll fix it or refund you.
        </div>

        <section className="mc-faq">
          <details>
            <summary>Do I need to switch banks?</summary>
            <p>No. Our approach is bank-agnostic. Many members use HELOCs or readvanceable products they already have.</p>
          </details>
          <details>
            <summary>Is this debt consolidation?</summary>
            <p>No. We focus on interest-timing and principal velocity, not simply rolling balances together.</p>
          </details>
          <details>
            <summary>Will this affect my credit?</summary>
            <p>Normal use of your existing accounts doesn’t harm credit. Stay on-time with payments and keep utilization healthy.</p>
          </details>
        </section>
      </section>

      <div id="mc-referral-modal" className="mc-modal" aria-hidden="true">
        <div className="mc-modal__content">
          <button className="mc-close" id="mc-ref-close" aria-label="Close">×</button>
          <h3>Share & Unlock Pro ($197)</h3>
          <p>To activate the Pro plan, enter at least <strong>5</strong> friends’ emails and share your unique link.</p>

          <div className="mc-ref-block">
            <label>Your unique link</label>
            <div className="mc-ref-row">
              <input id="mc-ref-link" type="text" readOnly className="flex-1 p-2 border rounded-md" />
              <button id="mc-copy" className="mc-cta small">Copy</button>
            </div>
            <button id="mc-share" className="mc-cta outline small mt-2">Share via device</button>
          </div>

          <form id="mc-ref-form">
            <div className="mc-grid2">
              <input type="email" required placeholder="friend1@email.com" name="e1" className="p-2 border rounded-md" />
              <input type="email" required placeholder="friend2@email.com" name="e2" className="p-2 border rounded-md" />
              <input type="email" required placeholder="friend3@email.com" name="e3" className="p-2 border rounded-md" />
              <input type="email" required placeholder="friend4@email.com" name="e4" className="p-2 border rounded-md" />
              <input type="email" required placeholder="friend5@email.com" name="e5" className="p-2 border rounded-md" />
            </div>
            <label className="mc-check">
              <input type="checkbox" id="mc-confirm" /> I confirm I’ve shared this link with these contacts.
            </label>
            <div className="mc-ref-actions">
              <button type="submit" id="mc-continue" className="mc-cta primary w-full" disabled>Continue to Checkout</button>
            </div>
            <p className="mc-legal">We store referral emails solely to verify eligibility. We never spam.</p>
          </form>
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
