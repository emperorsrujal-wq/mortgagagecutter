
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { simulate, Inputs, Outputs } from '@/lib/chunker';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Info, HelpCircle, PiggyBank, Receipt, Rocket, Repeat, Loader2, Zap, Save } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { pmt } from '@/lib/amort';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp, collection, query, limit, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const i18n: Record<string, any> = {
  en: {
    title: "HELOC-Assist Estimator",
    subtitle: "Turn HELOC access into months off your mortgage. No switching lenders. Just use credit you already have to nuke principal.",
    labels: {
      mortgageBalance: "Mortgage Balance",
      mortgageAPR: "Mortgage APR (%)",
      termRemaining: "Term Remaining",
      netIncome: "Net Monthly Income",
      livingExpenses: "Monthly Living Expenses",
      helocAPR: "HELOC APR (%)",
      helocLimit: "HELOC Limit",
      calculate: "Calculate",
      save: "Save Inputs"
    }
  }
};

const initial: Inputs = {
  mortgageBalance: 600000,
  mortgageAPR: 5.5,
  termMonthsRemaining: 300,
  netIncome: 9000,
  livingExpenses: 4500,
  savings: { savings: 0, chequing: 0, shortTerm: 0 },
  helocAPR: 7.5,
  helocLimit: 40000,
  helocOpeningBalance: 0,
  readvanceable: true,
  chunkMode: 'AUTO',
  fixedChunkAmount: 10000,
  billTiming: 'OPTIMIZED',
};

export default function ChunkerCalculatorPage() {
  const [lang, setLang] = useState('en');
  const [form, setForm] = useState<Inputs>(initial);
  const [res, setRes] = useState<Outputs | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const t = i18n[lang] || i18n.en;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
      return;
    }

    async function loadData() {
      if (!user || !firestore) return;
      const q = query(collection(firestore, 'leads', user.uid, 'chunkerStates'), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setForm(snap.docs[0].data().inputs);
      }
    }
    loadData();
  }, [user, isUserLoading, router, firestore]);

  const onChange = <K extends keyof Inputs>(k: K, v: Inputs[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSave = async () => {
    if (!user || !firestore) return;
    setIsSaving(true);
    try {
      await setDoc(doc(firestore, 'leads', user.uid, 'chunkerStates', 'current'), {
        userId: user.uid,
        inputs: form,
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Inputs Saved", description: "Your data will be pre-filled next time." });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const run = () => {
    const out = simulate(form);
    setRes(out);
  };

  if (isUserLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </header>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Mortgage & Cashflow</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.labels.mortgageBalance}</Label>
                <Input type="number" value={form.mortgageBalance} onChange={e => onChange("mortgageBalance", Number(e.target.value))}/>
              </div>
              <div>
                <Label>{t.labels.mortgageAPR}</Label>
                <Input type="number" step="0.01" value={form.mortgageAPR} onChange={e => onChange("mortgageAPR", Number(e.target.value))}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t.labels.netIncome}</Label>
                  <Input type="number" value={form.netIncome} onChange={e => onChange("netIncome", Number(e.target.value))}/>
                </div>
                <div>
                  <Label>{t.labels.livingExpenses}</Label>
                  <Input type="number" value={form.livingExpenses} onChange={e => onChange("livingExpenses", Number(e.target.value))}/>
                </div>
              </div>
              <div>
                <Label>{t.labels.helocLimit}</Label>
                <Input type="number" value={form.helocLimit} onChange={e => onChange("helocLimit", Number(e.target.value))}/>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={run} className="flex-1">Calculate</Button>
              <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {res ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-emerald-600 text-white p-4">
                  <p className="text-xs opacity-80">Interest Saved</p>
                  <p className="text-2xl font-bold">${res.totals.interestSaved.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-xs text-muted-foreground">Months Saved</p>
                  <p className="text-2xl font-bold">{res.totals.monthsSaved}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-xs text-muted-foreground">Strategy Type</p>
                  <p className="text-sm font-bold">{res.strategyType}</p>
                </Card>
              </div>

              <Card className="p-6 h-[400px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={res.timeline.slice(0, 240)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={(v) => `Y${Math.floor(v/12)}`} />
                      <YAxis tickFormatter={(v) => `${v/1000}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="mortgageBal" stroke="#8884d8" dot={false} name="Old Path" />
                      <Line type="monotone" dataKey="helocBal" stroke="#10b981" dot={false} name="Accelerated" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Card>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed rounded-xl p-12 text-center bg-white/50">
              <p className="text-muted-foreground">Fill out the details and calculate to see your results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
