'use client';
import React, { useState, useMemo } from 'react';
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
import { Info, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

const explainers = {
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
  const [form, setForm] = useState<Inputs>(initial);
  const [res, setRes] = useState<Outputs | null>(null);
  const [termMode, setTermMode] = useState<'YEARS' | 'MONTHS'>('YEARS');
  const [termYears, setTermYears] = useState<number>(initial.termMonthsRemaining / 12);
  const [termMonths, setTermMonths] = useState<number>(initial.termMonthsRemaining);

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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">HELOC-Assist Estimator</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
          Turn HELOC access into months off your mortgage. No switching lenders. Just use credit you already have to nuke principal.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* --- INPUTS --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>1. Mortgage Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="mortgageBalance" label="Mortgage Balance" explainer={explainers.mortgageBalance}>
                  <Input id="mortgageBalance" type="number" value={form.mortgageBalance} onChange={e => onChange("mortgageBalance", Number(e.target.value))}/>
              </InputField>
              <InputField name="mortgageAPR" label="Mortgage APR (%)" explainer={explainers.mortgageAPR}>
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
                        <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>{explainers.termRemaining}</p></TooltipContent>
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
              <InputField name="monthlyMortgagePayment" label="Monthly Payment (Optional)" explainer={explainers.monthlyMortgagePayment}>
                  <Input id="monthlyMortgagePayment" type="number" value={form.monthlyMortgagePayment ?? ""} onChange={e => onChange("monthlyMortgagePayment", e.target.value === "" ? undefined : Number(e.target.value))}/>
              </InputField>
              <InputField name="homeValue" label="Home Value (Optional)" explainer={explainers.homeValue}>
                  <Input id="homeValue" type="number" value={form.homeValue ?? ""} onChange={e => onChange("homeValue", e.target.value === "" ? undefined : Number(e.target.value))}/>
              </InputField>
              <InputField name="monthlyMI" label="Monthly MI/CMHC (Optional)" explainer={explainers.monthlyMI}>
                  <Input id="monthlyMI" type="number" value={form.monthlyMI ?? 0} onChange={e => onChange("monthlyMI", Number(e.target.value))}/>
              </InputField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>2. Cash Flow & HELOC</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="netIncome" label="Net Monthly Income" explainer={explainers.netIncome}>
                <Input id="netIncome" type="number" value={form.netIncome} onChange={e => onChange("netIncome", Number(e.target.value))}/>
              </InputField>
              <InputField name="livingExpenses" label="Monthly Living Expenses (excl. mortgage)" explainer={explainers.livingExpenses}>
                <Input id="livingExpenses" type="number" value={form.livingExpenses} onChange={e => onChange("livingExpenses", Number(e.target.value))}/>
              </InputField>
              {isSurplusNegative && <Alert variant="destructive" className="text-xs"><AlertDescription>Your monthly surplus is zero or negative. Results will be limited.</AlertDescription></Alert>}
              <InputField name="helocAPR" label="HELOC APR (%)" explainer={explainers.helocAPR}>
                <Input id="helocAPR" type="number" step="0.01" value={form.helocAPR} onChange={e => onChange("helocAPR", Number(e.target.value))}/>
              </InputField>
              <InputField name="helocLimit" label="HELOC Limit (Available Now)" explainer={explainers.helocLimit}>
                <Input id="helocLimit" type="number" value={form.helocLimit} onChange={e => onChange("helocLimit", Number(e.target.value))}/>
              </InputField>
              <InputField name="helocOpeningBalance" label="HELOC Opening Balance" explainer={explainers.helocOpeningBalance}>
                <Input id="helocOpeningBalance" type="number" value={form.helocOpeningBalance ?? 0} onChange={e => onChange("helocOpeningBalance", Number(e.target.value))}/>
              </InputField>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>3. Strategy</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <InputField name="chunkMode" label="Chunk Mode" explainer={explainers.chunkMode}>
                  <RadioGroup value={form.chunkMode} onValueChange={(v: "AUTO" | "FIXED") => onChange("chunkMode", v)} className="flex gap-4">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="AUTO" id="auto"/><Label htmlFor="auto">Auto</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="FIXED" id="fixed"/><Label htmlFor="fixed">Fixed</Label></div>
                  </RadioGroup>
              </InputField>

              {form.chunkMode === 'FIXED' && (
                <InputField name="fixedChunkAmount" label="Fixed Chunk Amount" explainer={explainers.fixedChunkAmount}>
                  <Input type="number" value={form.fixedChunkAmount ?? 10000} onChange={e => onChange("fixedChunkAmount", Number(e.target.value))} />
                   {isChunkTooLarge && <p className="text-xs text-destructive mt-1">Your fixed chunk exceeds HELOC availability. Reduce amount or use Auto mode.</p>}
                </InputField>
              )}

              <InputField name="billTiming" label="Bill Timing" explainer={explainers.billTiming}>
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
                        <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>{explainers.readvanceable}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                </div>
                <Switch id="readvanceable" checked={form.readvanceable} onCheckedChange={v => onChange("readvanceable", v)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={run} className="w-full">Calculate</Button>
            </CardFooter>
          </Card>
          <div className="text-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="text-sm text-muted-foreground"><HelpCircle className="h-4 w-4 mr-1" />How do chunks work?</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>How the "Chunk" Strategy Works</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">We draw a small HELOC chunk to knock down mortgage principal, then your monthly surplus repays the HELOC. Once the HELOC balance is near zero, we repeat. Lower principal sooner = less interest over time.</p>
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
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Interest Saved</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{currencyFormatter(res.totals.interestSaved)}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Months Saved</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{res.totals.monthsSaved}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">MI/CMHC Saved</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{currencyFormatter(res.totals.miSaved)}</p></CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Baseline (Do Nothing)</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p>Months: <span className="font-semibold">{res.baseline.months}</span></p>
                            <p>Total Interest: <span className="font-semibold">{currencyFormatter(res.baseline.totalInterest)}</span></p>
                            <p>Total MI/CMHC: <span className="font-semibold">{currencyFormatter(res.baseline.totalMI)}</span></p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>With Chunker Strategy</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-2">
                             <p>Months: <span className="font-semibold">{res.strategy.months}</span></p>
                             <p>Total Interest: <span className="font-semibold">{currencyFormatter(res.strategy.totalInterest)}</span></p>
                             <p>Total MI/CMHC: <span className="font-semibold">{currencyFormatter(res.strategy.totalMI)}</span></p>
                        </CardContent>
                    </Card>
                </div>
                 <Card>
                  <CardHeader>
                      <CardTitle>Balance Over Time</CardTitle>
                      <CardDescription>Mortgage vs. Total Debt with Chunker Strategy</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ChartContainer config={{}} className="h-[250px] w-full">
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
                    <summary className="cursor-pointer text-sm font-medium">View Month-by-Month Timeline</summary>
                    <div className="overflow-auto mt-2 border rounded-lg max-h-96">
                      <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-secondary">
                          <tr className="text-left">
                            <th className="p-2">Month</th>
                            <th className="p-2">Mortgage Bal</th>
                            <th className="p-2">HELOC Bal</th>
                            <th className="p-2">Chunk</th>
                            <th className="p-2">HELOC Int</th>
                            <th className="p-2">MI</th>
                            <th className="p-2">Surplus Used</th>
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
                        (Showing first 240 months to keep the table light.)
                    </div>
                </details>
                <Alert variant="default" className="text-xs">
                    <AlertDescription>Educational estimate only. No bank fees, promos, or taxes included. Results improve with positive monthly surplus, readvanceable lines, and batched bill pay.</AlertDescription>
                </Alert>
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg h-full">
                 <p className="text-lg font-semibold">Your results will appear here.</p>
                 <p className="text-muted-foreground mt-2">Fill out the form and click "Calculate" to see your potential savings.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

    