
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
  Award,
  Users,
  Target,
  BarChart,
  MessageCircle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Inputs, Outputs, Debt } from '@/lib/mortgage-types';
import { getSavingsReport } from '@/app/actions';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';

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
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className={cn('h-5 w-5', color || 'text-primary')} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
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
    <ChartContainer config={{}}>
      <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData} margin={{ left: 0, right: 10, top: 10, bottom: 20 }}>
              <defs>
                  <linearGradient id="colorHeloc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                  dataKey="month"
                  tickFormatter={(tick) => `Yr ${Math.floor(tick / 12)}`}
                  tickLine={false}
                  axisLine={{stroke: "hsl(var(--border))"}}
                  interval="preserveStartEnd"
                  minTickGap={50}
                  className="text-xs"
                  />
              <YAxis
                  tickFormatter={formatYAxis}
                  tickLine={false}
                  axisLine={{stroke: "hsl(var(--border))"}}
                  width={50}
                  className="text-xs"
              />
              <ChartTooltip
                  cursor={true}
                  content={
                      <ChartTooltipContent
                          className="bg-card/80 backdrop-blur-sm"
                          labelFormatter={(label) => `Month: ${label}`}
                          formatter={(value, name) => [
                              formatTooltip(value as number),
                              name === 'balanceHeloc' ? 'Accelerated Path' : 'Old Path',
                          ]}
                      />
                  }
                  />
              <Legend verticalAlign="top" height={40} iconType="circle" />
              <Area
                  type="monotone"
                  dataKey="balanceBaseline"
                  stroke="hsl(var(--muted-foreground))"
                  fill="url(#colorBaseline)"
                  name="Old Path"
                  stackId="1"
              />
              <Area
                  type="monotone"
                  dataKey="balanceHeloc"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorHeloc)"
                  name="Accelerated Path"
                  stackId="2"
              />
          </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function InnerComparison() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<Outputs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareBasic, setShowShareBasic] = useState(false);
  const [showSharePro, setShowSharePro] = useState(false);
  const [proReferralCount, setProReferralCount] = useState(0);

  const yearsSaved = data ? (data.debtFreeMonthsBaseline - data.debtFreeMonthsHeloc) / 12 : 0;
  const yearsSavedTxt = data ? `${Math.floor(yearsSaved)} yrs, ${Math.round((yearsSaved % 1) * 12)} mo` : 'several years';
  
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/questionnaire?ref=123` : '';
  const shareMessage = `Unlock mortgage savings now! I found out how to pay off my home faster using Mortgage Cutter. Check out your free savings estimate: ${referralLink}`;

  const proPlanUnlocked = useMemo(() => proReferralCount >= 5, [proReferralCount]);

  const handleProShare = () => {
    setProReferralCount(prev => Math.min(5, prev + 1));
  }

  const testimonials = [
      {
          quote: "I saved over $44,000 and paid off my home 7 years earlier. My only regret is not finding this sooner.",
          author: "Priya S., Calgary AB",
          img: "https://i.pravatar.cc/150?img=1"
      },
      {
          quote: "The math seemed too good to be true, but it matched my bank's amortization schedule perfectly. This is the real deal.",
          author: "David R., Austin TX",
          img: "https://i.pravatar.cc/150?img=3"
      },
      {
          quote: "My partner and I were skeptical, but following the simple monthly action plan has already made a huge difference. Highly recommend!",
          author: "Nisha & Arjun, Brampton ON",
          img: "https://i.pravatar.cc/150?img=5"
      },
  ];

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

  const ShareButtons = ({ onShare }: { onShare?: () => void }) => (
    <div className="flex flex-col gap-2 mt-2">
      <Button asChild variant="outline" onClick={onShare}>
        <a href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
        </a>
      </Button>
      <Button asChild variant="outline" onClick={onShare}>
        <a href={`https://www.facebook.com/messenger/new`} target="_blank" rel="noopener noreferrer">
         <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.02 2 10.98c0 2.77 1.35 5.27 3.56 6.92v4.1l3.26-1.79c.99.27 2.05.42 3.18.42 5.52 0 10-4.02 10-8.98S17.52 2 12 2zm1.02 10.97l-2.58-2.77-5.14 2.77 5.6-6.02 2.6 2.77 5.1-2.77-5.58 5.99z"/></svg> Facebook Messenger
        </a>
      </Button>
       <Button asChild variant="outline" onClick={onShare}>
        <a href={`sms:?&body=${encodeURIComponent(shareMessage)}`}>
           <MessageCircle className="h-4 w-4 mr-2" /> Text Message
        </a>
      </Button>
    </div>
  );

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto py-12 px-4 space-y-12">
        
        {/* --- HERO / HEADLINE --- */}
        <header className="text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-primary">
            Your Personalized Mortgage Savings Blueprint
          </h1>
          <p className="text-xl text-muted-foreground mt-3 max-w-3xl mx-auto">
            This is the moment your financial future changes. Here’s how the Mortgage Cutter Method accelerates your journey to becoming debt-free.
          </p>
        </header>

        {/* --- KEY RESULTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* --- COMPARISON CHART --- */}
        <Card className="shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle>Your Payoff Timeline: Old Path vs. Accelerated Path</CardTitle>
            <CardDescription>This chart shows your total debt balance vanishing years sooner with our method.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.series.length > 0 ? <ComparisonChart data={data.series} /> : <p>Could not generate chart data.</p>}
          </CardContent>
        </Card>

        {/* --- STACK SLIDE --- */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-xl p-8 lg:p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Here’s Everything You Get...</h2>
            <div className="max-w-2xl mx-auto text-left space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                    <div><span className="font-semibold">The Full Mortgage Cutter Toolkit:</span> Interactive calculators and planners tailored to your numbers.</div>
                </div>
                 <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                    <div><span className="font-semibold">Step-by-Step Action Plan:</span> A monthly guide telling you exactly what amounts to move and when.</div>
                </div>
                 <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                    <div><span className="font-semibold">Bank-Agnostic Guidance:</span> Works with your existing Canadian or U.S. mortgage and HELOC products.</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                    <div><span className="font-semibold">Members-Only Email Support:</span> Get your specific questions answered by our team. (Tier-dependent)</div>
                </div>
                 <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                    <div><span className="font-semibold">The Referral Engine:</span> Unlock discounts by sharing your success with friends.</div>
                </div>
            </div>
            <p className="mt-6 text-2xl font-bold text-yellow-300">Total Value: <span className="line-through opacity-70">$1,997</span></p>
            <p className="text-lg">Get started today for a fraction of that...</p>
        </div>


        {/* --- PRICING / OFFER STACK --- */}
        <div className="space-y-4">
             <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">Choose Your Blueprint</h2>
                <p className="text-muted-foreground mt-2">All plans are a one-time investment for lifetime access.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Basic */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl">Basic</CardTitle>
                        <CardDescription>The essential toolkit to get started.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="text-4xl font-bold">$39<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Calculator + Monthly Plan</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Community Q&A</li>
                            <li className="flex items-center gap-2"><X className="h-4 w-4 text-red-500" /> Email Support</li>
                        </ul>
                        {showShareBasic && <ShareButtons />}
                    </CardContent>
                    <CardFooter>
                         <Button variant="secondary" className="w-full" onClick={() => setShowShareBasic(!showShareBasic)}>
                           {showShareBasic ? 'Hide Share Options' : 'Share to Unlock'}
                         </Button>
                    </CardFooter>
                </Card>

                {/* Pro (Most Popular) */}
                <Card className="border-2 border-primary shadow-2xl relative flex flex-col">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-full">MOST POPULAR</div>
                    <CardHeader>
                        <CardTitle className="text-2xl pt-4">Pro</CardTitle>
                        <CardDescription>Everything you need to succeed.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="text-5xl font-bold">{proPlanUnlocked ? '$197' : '$297'}</div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Full Toolkit Access</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Bank-Agnostic Guides</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Priority Email Support</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Referral Dashboard</li>
                        </ul>
                         {showSharePro && (
                          <div className="pt-4">
                            <p className="text-sm font-semibold">Referral Progress: {proReferralCount}/5</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                              <div className="bg-primary h-2.5 rounded-full" style={{width: `${(proReferralCount / 5) * 100}%`}}></div>
                            </div>
                            <ShareButtons onShare={handleProShare} />
                          </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button asChild size="lg" className="w-full">
                           <Link href={`/purchase?plan=${proPlanUnlocked ? 'pro_197' : 'pro_297'}`}>Buy Pro for {proPlanUnlocked ? '$197' : '$297'}</Link>
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setShowSharePro(!showSharePro)}>
                          {showSharePro ? 'Hide Share Options' : 'Want an unbeatable price? Help 5 friends save and get $100 off instantly!'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Elite */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl">Elite</CardTitle>
                        <CardDescription>For complex situations &amp; investors.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                         <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">Only 10 spots left!</div>
                        <div className="text-4xl font-bold">$997</div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Everything in Pro, plus...</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Advanced Investor Strategies</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> 1-on-1 Onboarding Call</li>
                            <li className="flex items-center gap-2"><Award className="h-4 w-4 text-yellow-500" /> Direct Founder Access</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                           <Link href="/purchase?plan=elite_997">Claim Elite Spot</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
             <div className="flex justify-center pt-4">
                <div className="flex items-center gap-2 border border-dashed p-2 rounded-lg text-sm text-muted-foreground">
                    <Award className="h-5 w-5 text-yellow-500"/>
                    <span><strong>30-Day "Math Match" Guarantee:</strong> If our math doesn't match your bank's, we'll refund you 100%.</span>
                </div>
            </div>
        </div>

        {/* --- TESTIMONIALS --- */}
        <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Join Thousands of Homeowners Taking Control</h2>
            <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                    {testimonials.map((t, i) => (
                    <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                        <Card className="flex flex-col h-full">
                            <CardContent className="flex-grow p-6 flex flex-col items-center text-center">
                                <Image src={t.img} alt={t.author} width={64} height={64} className="rounded-full mb-4" />
                                <p className="text-muted-foreground flex-grow">"{t.quote}"</p>
                                <p className="font-semibold mt-4">{t.author}</p>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
        
        {/* --- REFERRAL SECTION --- */}
        <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle>Unlock Discounts by Sharing</CardTitle>
                <CardDescription>Help 5 friends save on interest, and you'll unlock our best price on the Pro plan.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                    <p className="font-semibold mb-2">Your Progress: <span className="text-primary">0 / 5 Referrals</span></p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-primary h-2.5 rounded-full" style={{width: "5%"}}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Referrals are counted when a friend signs up for any paid plan.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><MessageCircle className="h-4 w-4 mr-2" /> Share via Text</Button>
                    <Button variant="outline"><Share2 className="h-4 w-4" /></Button>
                </div>
            </CardContent>
        </Card>

        {/* --- FOUNDER'S NOTE --- */}
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-3 items-center">
                <div className="md:col-span-1">
                    <Image src="https://i.pravatar.cc/150?img=12" alt="Founder of Mortgage Cutter" width={400} height={400} className="object-cover h-full w-full" />
                </div>
                <div className="md:col-span-2 p-8">
                     <h3 className="text-2xl font-bold">A Note From Our Founder</h3>
                     <p className="text-muted-foreground mt-2 text-sm">"I was tired of seeing families stuck in 30-year debt cycles, paying hundreds of thousands in interest. I knew there had to be a smarter way that didn't require a finance degree. After helping my own family save over $150,000, I created Mortgage Cutter to give every homeowner the same simple, powerful blueprint. This isn't just about math; it's about giving you back your time and your life. I know this will work for you."</p>
                     <p className="font-semibold mt-4">— John F., Founder</p>
                </div>
            </div>
        </Card>

        {/* --- DISCLAIMER --- */}
        <Alert className="mt-8 border-primary/50 text-center">
          <Info className="h-4 w-4" />
          <AlertTitle className="font-bold">Educational Estimates Only</AlertTitle>
          <AlertDescription className="text-xs mt-2">
            The calculations on this page are for illustrative purposes and are not a guarantee of savings or loan approval. All debts are assumed to be consolidated into the HELOC. The calculation does not include bank fees, closing costs, or property taxes/insurance. Your actual results will depend on your discipline, spending habits, and the final terms provided by your lender.
          </Aler tDescription>
        </Alert>
      </div>
      
      {/* --- STICKY CTA ON MOBILE --- */}
      <div className="md:hidden sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t w-full">
         <Button asChild size="lg" className="w-full">
            <Link href="/purchase?plan=pro_297">Start Your Journey to Freedom</Link>
         </Button>
      </div>

    </div>
  );
}

export function ComparisonDisplay() {
  return (
    <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary self-center mt-24" />}>
      <InnerComparison />
    </Suspense>
  )
}
