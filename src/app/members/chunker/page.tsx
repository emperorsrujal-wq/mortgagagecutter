
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { simulate, Inputs, Outputs } from '@/lib/chunker';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Info, HelpCircle, PiggyBank, Receipt, Rocket, Repeat } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const i18n = {
  en: {
    title: "HELOC-Assist Estimator",
    subtitle: "Turn HELOC access into months off your mortgage. No switching lenders. Just use credit you already have to nuke principal.",
    howTitle: "How This Strategy Works",
    steps: [
      {icon: PiggyBank, title:"Deposit pay into HELOC", body:"Your cash lowers HELOC’s daily balance, cutting interest."},
      {icon: Receipt, title:"Pay bills from HELOC", body:"Batch bills so cash sits longer against balance."},
      {icon: Rocket, title:"Chunk to mortgage", body:"Send a lump-sum prepayment to principal (payment stays same; term shrinks)."},
      {icon: Repeat, title:"Use surplus to reset", body:"Your monthly surplus pays HELOC back; repeat."}
    ],
    faqTitle: "Common Questions",
    faq: [
      {q:"Will my mortgage payment change?", a:"No—unless you ask your lender to recast. We typically don’t recast. Payment stays the same; the term shrinks."},
      {q:"Do I need a special account?", a:"Any HELOC or readvanceable LOC works. Keep it simple and bank-agnostic."},
      {q:"What if my surplus is small?", a:"Small still works. The calculator sizes safe chunk amounts for you."}
    ],
    form: {
      mortgageTitle: "1. Mortgage Details",
      cashflowTitle: "2. Cash Flow & HELOC",
      strategyTitle: "3. Strategy",
      calculate: "Calculate",
      howChunksWork: "How do chunks work?",
    },
    results: {
      title: "Results",
      interestSaved: "Interest Saved",
      monthsSaved: "Months Saved",
      miSaved: "MI/CMHC Saved",
      baselineTitle: "Baseline (Do Nothing)",
      strategyTitle: "With Chunker Strategy",
      months: "Months",
      totalInterest: "Total Interest",
      totalMI: "Total MI/CMHC",
      balanceOverTime: "Balance Over Time",
      balanceDescription: "Mortgage vs. Total Debt with Chunker Strategy",
      timelineTitle: "View Month-by-Month Timeline",
      timelineDescription: "(Showing first 240 months to keep the table light.)",
      table: {
        month: "Month",
        mortgageBal: "Mortgage Bal",
        helocBal: "HELOC Bal",
        chunk: "Chunk",
        helocInt: "HELOC Int",
        mi: "MI",
        surplusUsed: "Surplus Used"
      },
      placeholderTitle: "Your results will appear here.",
      placeholderDescription: "Fill out the form and click 'Calculate' to see your potential savings.",
    },
    disclaimer: "Educational estimate only. No bank fees, promos, or taxes included. Results improve with positive monthly surplus, readvanceable lines, and batched bill pay.",
    explainers: {
      mortgageBalance: "Your current unpaid principal on the mortgage (not the original loan).\nExample: If your statement shows $612,350 remaining, enter 612350.",
      mortgageAPR: "Your annual interest rate for the mortgage. If you have a fixed rate, use that. If variable, use today’s stated APR.\nExample: 5.49",
      termRemaining: "How much time is left on your current mortgage. You can enter in years or months.\nExample: 25 years (or 300 months).",
      monthlyMortgagePayment: "Leave blank to auto-calculate. If your payment includes property tax/insurance, enter only the loan payment portion.\nExample: Leave blank, or enter 3,456.",
      homeValue: "Estimated current market value. Used only to estimate when mortgage insurance (MI/CMHC) falls off at 80% LTV.\nExample: 750000.",
      monthlyMI: "Monthly mortgage insurance (U.S.) or CMHC premium (Canada), if you pay one. Enter 0 if none.\nExample: 120.",
      netIncome: "Take-home pay each month after taxes/deductions (household total).\nExample: Your pay stubs total $8,900 after tax → enter 8900.",
      livingExpenses: "All monthly spending except the mortgage payment: utilities, groceries, etc.\nExample: 4300.",
      helocAPR: "Your HELOC’s variable or fixed annual rate.\nExample: 7.25.",
      helocLimit: "The maximum you can draw today (credit limit minus any current HELOC balance).\nExample: Credit limit 50,000 and current balance 8,500 → enter 41500.",
      helocOpeningBalance: "Your current HELOC balance before starting the strategy. Use 0 if you haven’t drawn yet.\nExample: 0 or 8500.",
      readvanceable: "Yes if your line re-advances as you pay your mortgage (e.g., STEP/HPP). No for a basic non-readvanceable HELOC.",
      chunkMode: "Auto = we size safe chunks based on your surplus. Fixed = you choose the chunk size. Auto is recommended.",
      fixedChunkAmount: "How much to draw from the HELOC each time we ‘chunk’ down your mortgage principal.\nExample: 10000.",
      billTiming: "Optimized = you batch most bills at once, keeping cash parked against the HELOC longer. Typical = bills are scattered.",
      chunkModalTitle: "How the 'Chunk' Strategy Works",
      chunkModalBody: "We draw a small HELOC chunk to knock down mortgage principal, then your monthly surplus repays the HELOC. Once the HELOC balance is near zero, we repeat. Lower principal sooner = less interest over time."
    }
  },
  "fr-CA": {
    title: "Simulateur d'aide MCH",
    subtitle: "Transformez l'accès à votre MCH en mois de moins sur votre hypothèque. Pas de changement de prêteur. Utilisez le crédit que vous avez déjà pour réduire le capital.",
    howTitle: "Comment fonctionne cette stratégie",
    steps: [
      {icon: PiggyBank, title:"Déposez votre paie dans la MCH", body:"Votre argent réduit le solde quotidien et les intérêts."},
      {icon: Receipt, title:"Payez vos dépenses depuis la MCH", body:"Groupez les paiements pour laisser l’argent plus longtemps."},
      {icon: Rocket, title:"Versement forfaitaire à l’hypothèque", body:"Un paiement en capital réduit la durée (la mensualité reste la même)."},
      {icon: Repeat, title:"Remboursez avec votre surplus", body:"Votre surplus mensuel rembourse la MCH; répétez."}
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      {q:"Ma mensualité va-t-elle changer ?", a:"Non—sauf si vous demandez un recalcul à la banque. En général, on ne le fait pas."},
      {q:"Compte spécial nécessaire ?", a:"Toute marge de crédit hypothécaire (MCH) ou réutilisable convient."},
      {q:"Et si mon surplus est faible ?", a:"Même un petit surplus fonctionne. Le simulateur dimensionne des montants sécuritaires."}
    ],
    form: {
      mortgageTitle: "1. Détails de l'hypothèque",
      cashflowTitle: "2. Flux de trésorerie et MCH",
      strategyTitle: "3. Stratégie",
      calculate: "Calculer",
      howChunksWork: "Comment fonctionnent les versements ?",
    },
    results: {
      title: "Résultats",
      interestSaved: "Intérêts économisés",
      monthsSaved: "Mois économisés",
      miSaved: "Assurance écon.",
      baselineTitle: "Scénario de base",
      strategyTitle: "Avec stratégie Chunker",
      months: "Mois",
      totalInterest: "Intérêts totaux",
      totalMI: "Assurance tot.",
      balanceOverTime: "Solde au fil du temps",
      balanceDescription: "Hypothèque vs Dette totale avec la stratégie Chunker",
      timelineTitle: "Voir l'échéancier mois par mois",
      timelineDescription: "(Affichage des 240 premiers mois pour alléger le tableau.)",
      table: {
        month: "Mois",
        mortgageBal: "Solde Hypo.",
        helocBal: "Solde MCH",
        chunk: "Versement",
        helocInt: "Int. MCH",
        mi: "Assurance",
        surplusUsed: "Surplus utilisé"
      },
      placeholderTitle: "Vos résultats apparaîtront ici.",
      placeholderDescription: "Remplissez le formulaire et cliquez sur 'Calculer' pour voir vos économies potentielles.",
    },
    disclaimer: "Estimation à titre éducatif uniquement. N'inclut pas les frais bancaires, promotions ou taxes. Les résultats s'améliorent avec un surplus mensuel positif, des marges réutilisables et des paiements de factures groupés.",
    explainers: {
        mortgageBalance: "Votre capital impayé actuel sur l'hypothèque (pas le prêt initial).\nExemple: Si votre relevé indique 612 350 $ restants, entrez 612350.",
        mortgageAPR: "Votre taux d'intérêt annuel pour l'hypothèque. Si vous avez un taux fixe, utilisez-le. Si variable, utilisez le TAEG actuel.\nExemple: 5.49",
        termRemaining: "Le temps qu'il reste sur votre hypothèque actuelle. Vous pouvez entrer en années ou en mois.\nExemple: 25 ans (ou 300 mois).",
        monthlyMortgagePayment: "Laissez vide pour un calcul automatique. Si votre paiement inclut les taxes foncières/assurance, n'entrez que la partie du prêt.\nExemple: Laissez vide, ou entrez 3456.",
        homeValue: "Valeur marchande actuelle estimée. Utilisé uniquement pour estimer quand l'assurance hypothécaire (MI/SCHL) tombe à 80% du RPV.\nExemple: 750000.",
        monthlyMI: "Assurance hypothécaire mensuelle (US) ou prime SCHL (Canada), si vous en payez une. Entrez 0 sinon.\nExemple: 120.",
        netIncome: "Salaire net mensuel après impôts/déductions (total du ménage).\nExemple: Vos fiches de paie totalisent 8900 $ après impôts → entrez 8900.",
        livingExpenses: "Toutes les dépenses mensuelles sauf le paiement hypothécaire: services publics, épicerie, etc.\nExemple: 4300.",
        helocAPR: "Le taux annuel variable ou fixe de votre MCH.\nExemple: 7.25.",
        helocLimit: "Le montant maximum que vous pouvez retirer aujourd'hui (limite de crédit moins le solde actuel de la MCH).\nExemple: Limite de crédit 50 000 et solde actuel 8 500 → entrez 41500.",
        helocOpeningBalance: "Votre solde MCH actuel avant de commencer la stratégie. Utilisez 0 si vous n'avez pas encore retiré.\nExemple: 0 ou 8500.",
        readvanceable: "Oui si votre marge se réavance au fur et à mesure que vous payez votre hypothèque (ex: STEP/HPP). Non pour une MCH de base non réutilisable.",
        chunkMode: "Auto = nous dimensionnons des versements sûrs en fonction de votre surplus. Fixe = vous choisissez le montant. Auto est recommandé.",
        fixedChunkAmount: "Montant à retirer de la MCH chaque fois que nous réduisons le capital de votre hypothèque.\nExemple: 10000.",
        billTiming: "Optimisé = vous regroupez la plupart des factures en une fois, gardant l'argent plus longtemps sur la MCH. Typique = factures étalées.",
        chunkModalTitle: "Comment fonctionne la stratégie de 'versement'",
        chunkModalBody: "Nous retirons un petit versement de la MCH pour réduire le capital de l'hypothèque, puis votre surplus mensuel rembourse la MCH. Une fois le solde de la MCH proche de zéro, nous répétons. Un capital plus bas plus tôt = moins d'intérêts sur la durée."
    }
  }
};

const initial: Inputs = {
  mortgageBalance: 600000,
  mortgageAPR: 5.5,
  termMonthsRemaining: 300,
  monthlyMortgagePayment: undefined,
  homeValue: 750000,
  monthlyMI: 0,
  netIncome: 9000,
  livingExpenses: 4500,
  helocAPR: 7.5,
  helocLimit: 40000,
  helocOpeningBalance: 0,
  readvanceable: true,
  chunkMode: 'AUTO',
  fixedChunkAmount: 10000,
  billTiming: 'OPTIMIZED',
};

const InputField = ({ name, label, children, explainer }: { name: string, label: string, children: React.ReactNode, explainer: string }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label htmlFor={name}>{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" aria-label={`Help for ${label}`}>
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs whitespace-pre-wrap">
            <p>{explainer}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    {children}
  </div>
);


export default function ChunkerCalculatorPage() {
  const [lang, setLang] = useState<'en' | 'fr-CA'>('en');
  const [form, setForm] = useState<Inputs>(initial);
  const [res, setRes] = useState<Outputs | null>(null);
  const [termMode, setTermMode] = useState<'YEARS' | 'MONTHS'>('YEARS');
  const [termYears, setTermYears] = useState<number>(initial.termMonthsRemaining / 12);
  const [termMonths, setTermMonths] = useState<number>(initial.termMonthsRemaining);

  const t = i18n[lang];

  useEffect(() => {
    const storedLang = localStorage.getItem('mc_lang');
    if (storedLang === 'fr-CA') {
      setLang('fr-CA');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mc_lang', lang);
  }, [lang]);


  const onChange = <K extends keyof Inputs>(k: K, v: Inputs[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };
  
  const handleTermYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const years = Number(e.target.value);
    setTermYears(years);
    setForm(f => ({ ...f, termMonthsRemaining: Math.round(years * 12) }));
  };

  const handleTermMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const months = Number(e.target.value);
    setTermMonths(months);
    setForm(f => ({ ...f, termMonthsRemaining: months }));
  };
  
  const handleTermModeChange = (mode: 'YEARS' | 'MONTHS') => {
    if (mode === termMode) return;
    if (mode === 'MONTHS') {
        const m = Math.max(1, Math.round(termYears * 12));
        setTermMonths(m);
        setForm(f => ({ ...f, termMonthsRemaining: m }));
    } else { // switching to YEARS
        const y = Math.max(1, Math.ceil(termMonths / 12));
        setTermYears(y);
        setForm(f => ({...f, termMonthsRemaining: y * 12}))
    }
    setTermMode(mode);
  };

  const run = () => {
    const out = simulate(form);
    setRes(out);
  };
  
  const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const isSurplusNegative = useMemo(() => {
    const pmt = form.monthlyMortgagePayment || 0; // Simplified for UI check
    return form.netIncome > 0 && (form.livingExpenses + pmt + (form.monthlyMI || 0)) >= form.netIncome;
  }, [form]);

  const isChunkTooLarge = useMemo(() => {
      return form.chunkMode === 'FIXED' && (form.fixedChunkAmount || 0) > form.helocLimit;
  }, [form]);


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.title}</h1>
            <div className="flex items-center border rounded-md p-1">
                <Button variant={lang === 'en' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLang('en')}>EN</Button>
                <Button variant={lang === 'fr-CA' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLang('fr-CA')}>FR</Button>
            </div>
        </div>
        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </header>

      <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto mb-8">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t.howTitle}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
              {t.steps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 rounded-full p-3 mb-2">
                        <Icon className="h-6 w-6 text-primary"/>
                      </div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.body}</p>
                    </div>
                  )
              })}
            </div>
            <h4 className="font-semibold mt-6 mb-2">{t.faqTitle}</h4>
            <Accordion type="single" collapsible className="w-full">
              {t.faq.map((faq, index) => (
                <AccordionItem value={`faq-${index}`} key={index}>
                  <AccordionTrigger className="text-sm">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* --- INPUTS --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>{t.form.mortgageTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="mortgageBalance" label="Mortgage Balance" explainer={t.explainers.mortgageBalance}>
                  <Input id="mortgageBalance" type="number" value={form.mortgageBalance} onChange={e => onChange("mortgageBalance", Number(e.target.value))}/>
              </InputField>
              <InputField name="mortgageAPR" label="Mortgage APR (%)" explainer={t.explainers.mortgageAPR}>
                  <Input id="mortgageAPR" type="number" step="0.01" value={form.mortgageAPR} onChange={e => onChange("mortgageAPR", Number(e.target.value))}/>
              </InputField>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Label>Term Remaining</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>{t.explainers.termRemaining}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-1 ml-auto border rounded-md p-0.5">
                        <Button type="button" size="sm" variant={termMode === 'YEARS' ? 'secondary' : 'ghost'} className="h-7 px-2" onClick={() => handleTermModeChange('YEARS')}>Years</Button>
                        <Button type="button" size="sm" variant={termMode === 'MONTHS' ? 'secondary' : 'ghost'} className="h-7 px-2" onClick={() => handleTermModeChange('MONTHS')}>Months</Button>
                    </div>
                </div>
                {termMode === 'YEARS' ? (
                     <Input type="number" value={termYears} onChange={handleTermYearsChange} />
                ) : (
                     <Input type="number" value={termMonths} onChange={handleTermMonthsChange} />
                )}
              </div>
              <InputField name="monthlyMortgagePayment" label="Monthly Payment (Optional)" explainer={t.explainers.monthlyMortgagePayment}>
                  <Input id="monthlyMortgagePayment" type="number" value={form.monthlyMortgagePayment ?? ""} onChange={e => onChange("monthlyMortgagePayment", e.target.value === "" ? undefined : Number(e.target.value))}/>
              </InputField>
              <InputField name="homeValue" label="Home Value (Optional)" explainer={t.explainers.homeValue}>
                  <Input id="homeValue" type="number" value={form.homeValue ?? 0} onChange={e => onChange("homeValue", e.target.value === "" ? 0 : Number(e.target.value))}/>
              </InputField>
              <InputField name="monthlyMI" label="Monthly MI/CMHC (Optional)" explainer={t.explainers.monthlyMI}>
                  <Input id="monthlyMI" type="number" value={form.monthlyMI ?? 0} onChange={e => onChange("monthlyMI", Number(e.target.value))}/>
              </InputField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t.form.cashflowTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="netIncome" label="Net Monthly Income" explainer={t.explainers.netIncome}>
                <Input id="netIncome" type="number" value={form.netIncome} onChange={e => onChange("netIncome", Number(e.target.value))}/>
              </InputField>
              <InputField name="livingExpenses" label="Monthly Living Expenses (excl. mortgage)" explainer={t.explainers.livingExpenses}>
                <Input id="livingExpenses" type="number" value={form.livingExpenses} onChange={e => onChange("livingExpenses", Number(e.target.value))}/>
              </InputField>
              {isSurplusNegative && <Alert variant="destructive" className="text-xs"><AlertDescription>Your monthly surplus is zero or negative. Results will be limited.</AlertDescription></Alert>}
              <InputField name="helocAPR" label="HELOC APR (%)" explainer={t.explainers.helocAPR}>
                <Input id="helocAPR" type="number" step="0.01" value={form.helocAPR} onChange={e => onChange("helocAPR", Number(e.target.value))}/>
              </InputField>
              <InputField name="helocLimit" label="HELOC Limit (Available Now)" explainer={t.explainers.helocLimit}>
                <Input id="helocLimit" type="number" value={form.helocLimit} onChange={e => onChange("helocLimit", Number(e.target.value))}/>
              </InputField>
              <InputField name="helocOpeningBalance" label="HELOC Opening Balance" explainer={t.explainers.helocOpeningBalance}>
                <Input id="helocOpeningBalance" type="number" value={form.helocOpeningBalance ?? 0} onChange={e => onChange("helocOpeningBalance", Number(e.target.value))}/>
              </InputField>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>{t.form.strategyTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="chunkMode" label="Chunk Mode" explainer={t.explainers.chunkMode}>
                  <RadioGroup value={form.chunkMode} onValueChange={(v: "AUTO" | "FIXED") => onChange("chunkMode", v)} className="flex gap-4">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="AUTO" id="auto"/><Label htmlFor="auto">Auto</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="FIXED" id="fixed"/><Label htmlFor="fixed">Fixed</Label></div>
                  </RadioGroup>
              </InputField>

              {form.chunkMode === 'FIXED' && (
                <InputField name="fixedChunkAmount" label="Fixed Chunk Amount" explainer={t.explainers.fixedChunkAmount}>
                  <Input type="number" value={form.fixedChunkAmount ?? 10000} onChange={e => onChange("fixedChunkAmount", Number(e.target.value))} />
                   {isChunkTooLarge && <p className="text-xs text-destructive mt-1">Your fixed chunk exceeds HELOC availability. Reduce amount or use Auto mode.</p>}
                </InputField>
              )}

              <InputField name="billTiming" label="Bill Timing" explainer={t.explainers.billTiming}>
                  <RadioGroup value={form.billTiming} onValueChange={(v: "OPTIMIZED" | "TYPICAL") => onChange("billTiming", v)} className="flex gap-4">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="OPTIMIZED" id="optimized"/><Label htmlFor="optimized">Optimized</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="TYPICAL" id="typical"/><Label htmlFor="typical">Typical</Label></div>
                  </RadioGroup>
              </InputField>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="readvanceable">Readvanceable?</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                        <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>{t.explainers.readvanceable}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                </div>
                <Switch id="readvanceable" checked={form.readvanceable} onCheckedChange={v => onChange("readvanceable", v)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={run} className="w-full">{t.form.calculate}</Button>
            </CardFooter>
          </Card>
          <div className="text-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="text-sm text-muted-foreground"><HelpCircle className="h-4 w-4 mr-1" />{t.form.howChunksWork}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.explainers.chunkModalTitle}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">{t.explainers.chunkModalBody}</p>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* --- RESULTS --- */}
        <div className="lg:col-span-3">
          {res ? (
             <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-primary/10 border-primary">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t.results.interestSaved}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{currencyFormatter(res.totals.interestSaved)}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t.results.monthsSaved}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{res.totals.monthsSaved}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t.results.miSaved}</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{currencyFormatter(res.totals.miSaved)}</p></CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>{t.results.baselineTitle}</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p>{t.results.months}: <span className="font-semibold">{res.baseline.months}</span></p>
                            <p>{t.results.totalInterest}: <span className="font-semibold">{currencyFormatter(res.baseline.totalInterest)}</span></p>
                            <p>{t.results.totalMI}: <span className="font-semibold">{currencyFormatter(res.baseline.totalMI)}</span></p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>{t.results.strategyTitle}</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-2">
                             <p>{t.results.months}: <span className="font-semibold">{res.strategy.months}</span></p>
                             <p>{t.results.totalInterest}: <span className="font-semibold">{currencyFormatter(res.strategy.totalInterest)}</span></p>
                             <p>{t.results.totalMI}: <span className="font-semibold">{currencyFormatter(res.strategy.totalMI)}</span></p>
                        </CardContent>
                    </Card>
                </div>
                 <Card>
                  <CardHeader>
                      <CardTitle>{t.results.balanceOverTime}</CardTitle>
                      <CardDescription>{t.results.balanceDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ChartContainer config={{}}>
                          <ResponsiveContainer>
                              <LineChart data={res.timeline.slice(0, 240)} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tickFormatter={(v) => `Yr ${Math.floor(v/12)}`} minTickGap={30}/>
                                <YAxis tickFormatter={(v) => `${(v/1000)}k`}/>
                                <RechartsTooltip content={<ChartTooltipContent formatter={(value) => currencyFormatter(value as number)} />} />
                                <Legend />
                                <Line type="monotone" dataKey="mortgageBal" name="Baseline Mortgage" stroke="#8884d8" dot={false}/>
                                <Line type="monotone" dataKey="helocBal" name="Strategy Total Debt" stroke="#82ca9d" dot={false} />
                              </LineChart>
                          </ResponsiveContainer>
                      </ChartContainer>
                  </CardContent>
                </Card>
                <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium">{t.results.timelineTitle}</summary>
                    <div className="overflow-auto mt-2 border rounded-lg max-h-96">
                      <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-secondary">
                          <tr className="text-left">
                            <th className="p-2">{t.results.table.month}</th>
                            <th className="p-2">{t.results.table.mortgageBal}</th>
                            <th className="p-2">{t.results.table.helocBal}</th>
                            <th className="p-2">{t.results.table.chunk}</th>
                            <th className="p-2">{t.results.table.helocInt}</th>
                            <th className="p-2">{t.results.table.mi}</th>
                            <th className="p-2">{t.results.table.surplusUsed}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {res.timeline.slice(0, 240).map(row => (
                            <tr key={row.month} className="border-b">
                              <td className="p-2">{row.month}</td>
                              <td className="p-2">{currencyFormatter(row.mortgageBal)}</td>
                              <td className="p-2">{currencyFormatter(row.helocBal)}</td>
                              <td className="p-2">{currencyFormatter(row.chunkApplied)}</td>
                              <td className="p-2">{currencyFormatter(row.helocInterest)}</td>
                              <td className="p-2">{currencyFormatter(row.mi)}</td>
                              <td className="p-2">{currencyFormatter(row.surplusUsed)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                       {t.results.timelineDescription}
                    </div>
                </details>
                <Alert variant="default" className="text-xs">
                    <AlertDescription>{t.disclaimer}</AlertDescription>
                </Alert>
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg h-full">
                 <p className="text-lg font-semibold">{t.results.placeholderTitle}</p>
                 <p className="text-muted-foreground mt-2">{t.results.placeholderDescription}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

    