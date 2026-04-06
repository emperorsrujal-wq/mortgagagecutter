
'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Info, Loader2, Save, Printer, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const InputField = ({ name, label, children, explainer }: { name: string, label: string, children: React.ReactNode, explainer?: string }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label htmlFor={name}>{label}</Label>
      {explainer && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={`Help for ${label}`} onClick={(e) => e.preventDefault()}>
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-wrap">
              <p>{explainer}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    {children}
  </div>
);

const YesNoRadioGroup = ({ field }: { field: any }) => (
  <RadioGroup
    onValueChange={field.onChange}
    value={field.value}
    className="flex gap-4"
  >
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <RadioGroupItem value="yes" id={`${field.name}-yes`} />
      </FormControl>
      <FormLabel htmlFor={`${field.name}-yes`} className="font-normal cursor-pointer">Yes</FormLabel>
    </FormItem>
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <RadioGroupItem value="no" id={`${field.name}-no`} />
      </FormControl>
      <FormLabel htmlFor={`${field.name}-no`} className="font-normal cursor-pointer">No</FormLabel>
    </FormItem>
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <RadioGroupItem value="na" id={`${field.name}-na`} />
      </FormControl>
      <FormLabel htmlFor={`${field.name}-na`} className="font-normal cursor-pointer">N/A</FormLabel>
    </FormItem>
  </RadioGroup>
);

export default function BankScreenerPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      bankName: '',
      bankWebsite: '',
      bankPhone: '',
      loanOfficerName: '',
      loanOfficerPhone: '',
      loanOfficerEmail: '',
      offersFirstLien: 'na',
      ltvMaxLoanAmount: '',
      ltvMinLoanAmount: '',
      ltvLow: '',
      ltvAvg: '',
      ltvHigh: '',
      ltvCanRenew: 'na',
      ltvLimitations: '',
      helocForPurchaseRefi: 'na',
      cashReserveRequirements: 'na',
      helocForInvestment: 'na',
      investmentLtv: '',
      helocForSecondHome: 'na',
      secondHomeLtv: '',
      seasoningPeriod: '',
      canFixRate: 'na',
      paymentType: '',
      canRedrawPrincipal: 'na',
      drawPeriodLength: '',
      minDrawAmount: '',
      afterDrawPeriod: '',
      canRenew: 'na',
      stressTest: '',
      dtiRequirements: '',
      directDeposit: 'na',
      onlineBillPay: 'na',
      sweepAccount: '',
      canSetupSweep: 'na',
      overdraftProtection: 'na',
      overdraftFee: '',
      rateIndex: '',
      introductoryRates: 'na',
      promoRateStacking: 'na',
      minApr: '',
      maxApr: '',
      interestCalculation: '',
      closingCosts: '',
      annualFee: '',
      transactionFees: '',
      prepaymentPenalty: '',
      otherFees: '',
      discounts: 'na',
      mobileDepositLimit: '',
      statesOffered: '',
      requiredDocs: '',
      remoteClosing: 'na',
      avgCompletionTime: '',
      bankruptcyGuidelines: '',
      foreclosureGuidelines: '',
      shortSaleGuidelines: '',
      valuationType: '',
      notes: '',
    }
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
      return;
    }

    async function loadData() {
      if (!user || !firestore) return;
      const q = query(collection(firestore, 'leads', user.uid, 'bankScreeners'), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data().formData;
        form.reset(data);
      }
    }
    loadData();
  }, [user, isUserLoading, router, firestore]);

  const onSubmit = async (values: any) => {
    if (!user || !firestore) return;
    setIsSaving(true);
    try {
      const screenerRef = doc(firestore, 'leads', user.uid, 'bankScreeners', 'current');
      await setDoc(screenerRef, {
        userId: user.uid,
        bankName: values.bankName,
        formData: values,
        updatedAt: serverTimestamp(),
      });
      toast({
        title: "Successfully Saved",
        description: "Your bank screener data has been updated in your profile.",
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save your data. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">HELOC Bank Screener</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
          Evaluate potential lenders systematically to find the best first-lien HELOC for the Mortgage Cutter method.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Lender Information</CardTitle>
              <CardDescription>Record the basic details of the bank or lender you are evaluating.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="bankName" label="Bank Name">
                  <Input {...form.register("bankName")} placeholder="e.g., Acme National Bank" />
                </InputField>
                <InputField name="bankWebsite" label="Website Address">
                  <Input {...form.register("bankWebsite")} placeholder="e.g., www.acmebank.com" />
                </InputField>
                <InputField name="bankPhone" label="Main Phone Number">
                  <Input {...form.register("bankPhone")} placeholder="e.g., 800-555-1234" />
                </InputField>
              </div>
              <Separator />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="loanOfficerName" label="Loan Officer">
                  <Input {...form.register("loanOfficerName")} placeholder="e.g., Jane Doe" />
                </InputField>
                <InputField name="loanOfficerPhone" label="Direct Line">
                  <Input {...form.register("loanOfficerPhone")} placeholder="800-555-5678" />
                </InputField>
                <InputField name="loanOfficerEmail" label="Email Address">
                  <Input {...form.register("loanOfficerEmail")} placeholder="jane.doe@acmebank.com" />
                </InputField>
              </div>
            </CardContent>
          </Card>

          <Accordion type="multiple" className="w-full space-y-4 mt-6">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold text-lg p-4 bg-secondary/50 rounded-lg hover:no-underline">1. First Lien Position</AccordionTrigger>
              <AccordionContent className="p-4 space-y-4 border rounded-b-lg">
                <FormField
                  control={form.control}
                  name="offersFirstLien"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel className="text-base">Do you offer a first lien position HELOC?</FormLabel>
                         <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help"><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>A 'first lien' means the HELOC is the primary loan on the property. Most banks only offer HELOCs as second mortgages. This is non-negotiable for our method.</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="font-bold text-lg p-4 bg-secondary/50 rounded-lg hover:no-underline">2. Loan To Value (LTV) Limits</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6 border rounded-b-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField name="ltvMaxLoanAmount" label="Max Loan Amount ($)">
                        <Input type="number" {...form.register("ltvMaxLoanAmount")} placeholder="e.g., 1000000" />
                    </InputField>
                    <InputField name="ltvMinLoanAmount" label="Min Loan Amount ($)">
                        <Input type="number" {...form.register("ltvMinLoanAmount")} placeholder="e.g., 10000" />
                    </InputField>
                </div>
                <div>
                    <Label className="text-base mb-3 block">Minimum Credit Score Requirements</Label>
                    <div className="grid grid-cols-3 gap-4">
                       <InputField name="ltvLow" label="70% LTV">
                         <Input {...form.register("ltvLow")} placeholder="680" />
                       </InputField>
                       <InputField name="ltvAvg" label="80% LTV">
                         <Input {...form.register("ltvAvg")} placeholder="720" />
                       </InputField>
                       <InputField name="ltvHigh" label="90% LTV">
                         <Input {...form.register("ltvHigh")} placeholder="780" />
                       </InputField>
                    </div>
                </div>
                <FormField
                  control={form.control}
                  name="ltvCanRenew"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2"><FormLabel>Can I renew/re-appraise LTV later?</FormLabel></div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9">
              <AccordionTrigger className="font-bold text-lg p-4 bg-secondary/50 rounded-lg hover:no-underline">9. Account Functionality</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6 border rounded-b-lg">
                <FormField
                  control={form.control}
                  name="directDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Can I deposit income directly into the HELOC account?</FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button"><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent><p>This is essential. You want your paycheck to immediately reduce the principal balance every day it sits there.</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="onlineBillPay"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2"><FormLabel>Can I pay bills directly from the HELOC?</FormLabel></div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-13">
              <AccordionTrigger className="font-bold text-lg p-4 bg-secondary/50 rounded-lg hover:no-underline">13. Final Notes</AccordionTrigger>
              <AccordionContent className="p-4 border rounded-b-lg">
                   <InputField name="notes" label="Lender Notes & Red Flags">
                      <Textarea {...form.register("notes")} rows={5} placeholder="Record specific quotes, red flags, or special terms here..." />
                  </InputField>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
              <Button type="button" variant="outline" size="lg" onClick={() => window.print()} className="w-full sm:w-auto">
                <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
              </Button>
              <Button type="submit" size="lg" disabled={isSaving} className="w-full sm:w-auto">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save My Screener
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
