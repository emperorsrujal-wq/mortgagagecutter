
'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Info, Loader2, Save, Printer } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';

const ADMIN_EMAIL = 'emperorsrujal@gmail.com';

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
    defaultValue={field.value}
    className="flex gap-4"
  >
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <RadioGroupItem value="yes" id={`${field.name}-yes`} />
      </FormControl>
      <FormLabel htmlFor={`${field.name}-yes`} className="font-normal">Yes</FormLabel>
    </FormItem>
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <RadioGroupItem value="no" id={`${field.name}-no`} />
      </FormControl>
      <FormLabel htmlFor={`${field.name}-no`} className="font-normal">No</FormLabel>
    </FormItem>
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <RadioGroupItem value="na" id={`${field.name}-na`} />
      </FormControl>
      <FormLabel htmlFor={`${field.name}-na`} className="font-normal">N/A</FormLabel>
    </FormItem>
  </RadioGroup>
);

export default function BankScreenerPage() {
  const form = useForm();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      return;
    }
    
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const onSubmit = (data: any) => {
    console.log(data);
    alert('Bank screening data saved (see console).');
  };

  if (isUserLoading || (!user && user?.email !== ADMIN_EMAIL)) {
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
          Use this detailed questionnaire to evaluate potential lenders and find the best HELOC for your needs.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Lender Information</CardTitle>
              <CardDescription>Start by recording the basic details of the bank or lender you are evaluating.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="bankName" label="Bank Name" explainer="The full legal name of the financial institution.">
                  <Input {...form.register("bankName")} placeholder="e.g., Acme National Bank" />
                </InputField>
                <InputField name="bankWebsite" label="Website Address" explainer="The lender's main website.">
                  <Input {...form.register("bankWebsite")} placeholder="e.g., www.acmebank.com" />
                </InputField>
                <InputField name="bankPhone" label="Main Phone Number" explainer="The general customer service or loan department phone number.">
                  <Input {...form.register("bankPhone")} placeholder="e.g., 800-555-1234" />
                </InputField>
              </div>
              <Separator />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="loanOfficerName" label="Loan Officer's Name" explainer="The name of your specific contact person, if you have one.">
                  <Input {...form.register("loanOfficerName")} placeholder="e.g., Jane Doe" />
                </InputField>
                <InputField name="loanOfficerPhone" label="Direct Phone Number" explainer="The direct line for your contact person.">
                  <Input {...form.register("loanOfficerPhone")} placeholder="e.g., 800-555-5678" />
                </InputField>
                <InputField name="loanOfficerEmail" label="Direct Email Address" explainer="The direct email for your contact person.">
                  <Input {...form.register("loanOfficerEmail")} placeholder="e.g., jane.doe@acmebank.com" />
                </InputField>
              </div>
            </CardContent>
          </Card>

          <Accordion type="multiple" className="w-full space-y-4 mt-6">
            
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">1. First Lien Position</AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="offersFirstLien"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Do you offer a first lien position HELOC?</FormLabel>
                         <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help for offersFirstLien" onClick={(e) => e.preventDefault()}><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>A 'first lien' means the HELOC is the primary loan on the property, not a secondary one. This is key for the Mortgage Cutter method.</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">2. Loan To Value (LTV) Limits</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                <InputField name="ltvMaxLoanAmount" label="What is your maximum loan amount on a first lien HELOC?" explainer="Is there a dollar cap, e.g., $1,000,000?">
                    <Input type="number" {...form.register("ltvMaxLoanAmount")} placeholder="e.g., 1000000" />
                </InputField>
                 <InputField name="ltvMinLoanAmount" label="Any minimum loan amount?" explainer="Some banks require a minimum loan, e.g., $10,000.">
                    <Input type="number" {...form.register("ltvMinLoanAmount")} placeholder="e.g., 10000" />
                </InputField>
                <div>
                    <Label>What are the minimum credit score requirements for those LTVs?</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                       <InputField name="ltvLow" label="Low (e.g. 70%)" explainer="Minimum credit score for a 70% LTV.">
                         <Input {...form.register("ltvLow")} placeholder="e.g., 680" />
                       </InputField>
                       <InputField name="ltvAvg" label="Average (e.g. 80%)" explainer="Minimum credit score for an 80% LTV.">
                         <Input {...form.register("ltvAvg")} placeholder="e.g., 720" />
                       </InputField>
                       <InputField name="ltvHigh" label="High (e.g. 90%)" explainer="Minimum credit score for a 90% LTV.">
                         <Input {...form.register("ltvHigh")} placeholder="e.g., 780" />
                       </InputField>
                    </div>
                </div>
                <FormField
                  control={form.control}
                  name="ltvCanRenew"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Can I renew my HELOC's LTV to a lower or higher rate down the line?</FormLabel>
                         <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help for ltvCanRenew" onClick={(e) => e.preventDefault()}><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>Can you refinance or modify the LTV percentage during the loan's life?</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <InputField name="ltvLimitations" label="Are there any specific limitations as to who can apply for a HELOC?" explainer="e.g., residency requirements, property type restrictions.">
                    <Textarea {...form.register("ltvLimitations")} />
                </InputField>
              </AccordionContent>
            </AccordionItem>
            
             <AccordionItem value="item-3">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">3. Purchase &amp; Refinancing</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                <FormField
                  control={form.control}
                  name="helocForPurchaseRefi"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Do you offer HELOCs for both purchases &amp; refinancing?</FormLabel>
                         <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help for helocForPurchaseRefi" onClick={(e) => e.preventDefault()}><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>Can the HELOC be used to buy a new home, or only to refinance an existing mortgage?</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cashReserveRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Are there any cash reserve requirements to qualify?</FormLabel>
                         <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help for cashReserveRequirements" onClick={(e) => e.preventDefault()}><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>Do you need to have a certain amount of cash saved after closing?</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            
             <AccordionItem value="item-4">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">4. Investment Properties</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                <FormField
                  control={form.control}
                  name="helocForInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Do you offer HELOCs for investment / rental properties?</FormLabel>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <InputField name="investmentLtv" label="If yes, what is the maximum LTV for that? Any limits?" explainer="LTV for investment properties is often lower than for primary residences.">
                    <Input {...form.register("investmentLtv")} placeholder="e.g., 75%" />
                  </InputField>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-5">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">5. Second Homes</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                <FormField
                  control={form.control}
                  name="helocForSecondHome"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Do you offer HELOCs for second homes / vacation properties?</FormLabel>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <InputField name="secondHomeLtv" label="If yes, what is the maximum LTV for that? Any limits?" explainer="LTV for second homes may also be lower.">
                    <Input {...form.register("secondHomeLtv")} placeholder="e.g., 80%" />
                  </InputField>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">6. Seasoning &amp; Rates</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                <InputField name="seasoningPeriod" label="What's your seasoning period before I can refinance into a HELOC?" explainer="How long must you own a property before they'll refinance it with a HELOC? (e.g., 6 months)">
                    <Input {...form.register("seasoningPeriod")} placeholder="e.g., 6 months" />
                </InputField>
                <FormField
                  control={form.control}
                  name="canFixRate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Can I get a fixed rate on a portion of the HELOC or even all of it?</FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help for canFixRate" onClick={(e) => e.preventDefault()}><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>Some HELOCs allow you to 'lock in' a fixed rate on a part of your balance.</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">7. Payments &amp; Draw Period</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                 <InputField name="paymentType" label="Are the monthly payments interest-only, interest + principal, or a percentage of the balance?" explainer="This is crucial. Interest-only payments during the draw period are common.">
                    <Input {...form.register("paymentType")} placeholder="Interest-only" />
                 </InputField>
                  <FormField
                  control={form.control}
                  name="canRedrawPrincipal"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>If a percent, can I withdraw the portion of the principal that I paid down?</FormLabel>
                         <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help for canRedrawPrincipal" onClick={(e) => e.preventDefault()}><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>This is the 're-advanceable' feature. As you pay down principal, does your available credit go back up?</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <InputField name="drawPeriodLength" label="How long is the draw period?" explainer="The time you can borrow funds (e.g., 10 years).">
                    <Input {...form.register("drawPeriodLength")} placeholder="e.g., 10 years" />
                  </InputField>
                  <InputField name="minDrawAmount" label="Is there a minimum draw amount?" explainer="e.g., some banks in Texas require a $4,000 minimum draw.">
                    <Input {...form.register("minDrawAmount")} placeholder="e.g., None, or $4000" />
                  </InputField>
                  <InputField name="afterDrawPeriod" label="What happens after the draw period expires?" explainer="Often, the remaining balance converts to a loan that must be paid off over a set term (e.g., 20 years).">
                    <Textarea {...form.register("afterDrawPeriod")} placeholder="e.g., balance converts to a 20-year amortized repayment plan." />
                  </InputField>
                  <FormField
                  control={form.control}
                  name="canRenew"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Do you offer a renewal if there is a balance at the end of the draw period and is there any cost?</FormLabel>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-8">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">8. Qualification Criteria</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                  <InputField name="stressTest" label="Is your stress test based on 15, 20 or 30 year projections OR a percentage of the credit line?" >
                     <Input {...form.register("stressTest")} />
                  </InputField>
                  <InputField name="dtiRequirements" label="What are your DTI (Debt To Income) requirements?" explainer="What is the maximum allowed ratio of your monthly debt payments to your monthly gross income? (e.g., 43%)">
                    <Input {...form.register("dtiRequirements")} placeholder="e.g., 43%" />
                  </InputField>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-9">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">9. Account Functionality</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                <FormField
                  control={form.control}
                  name="directDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Can I deposit my income directly into the HELOC operating account?</FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help for directDeposit" onClick={(e) => e.preventDefault()}><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>This is essential for making the strategy work efficiently.</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="onlineBillPay"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Can I set up online bill pay so it is linked to the HELOC?</FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild><button type="button" aria-label="Help for onlineBillPay" onClick={(e) => e.preventDefault()}><Info className="h-4 w-4 text-muted-foreground" /></button></TooltipTrigger>
                              <TooltipContent className="max-w-xs whitespace-pre-wrap"><p>You need to be able to pay all your monthly expenses from this account.</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <InputField name="sweepAccount" label="Do you offer a sweep account to transfer my balance to my HELOC?" explainer="A sweep automatically moves funds from a checking account to the HELOC to pay down the balance. (e.g., sweep, one-way sweep, manual)">
                    <Input {...form.register("sweepAccount")} placeholder="e.g., Manual transfer only"/>
                  </InputField>
                <FormField
                  control={form.control}
                  name="canSetupSweep"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Is there something we can do to set up a sweep account to push my checking / savings funds into the HELOC's operating account?</FormLabel>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="overdraftProtection"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Do you have overdraft protection for checking accounts?</FormLabel>
                      </div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                   <InputField name="overdraftFee" label="If yes, is it unlimited or is there a fee after so many uses in a month?">
                    <Input {...form.register("overdraftFee")} />
                  </InputField>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">10. Interest Rate Details</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                 <InputField name="rateIndex" label="What index is the HELOC tied to?" explainer="The benchmark rate used to set your variable rate (e.g., Prime, SOFR).">
                    <Input {...form.register("rateIndex")} placeholder="e.g., Wall Street Journal Prime Rate" />
                 </InputField>
                 <FormField
                  control={form.control}
                  name="introductoryRates"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2"><FormLabel>Do you offer any introductory rates?</FormLabel></div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="promoRateStacking"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2"><FormLabel>Do you offer promo rate stacking?</FormLabel></div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <InputField name="minApr" label="Minimum APR?" explainer="What is the lowest the rate can ever go (the 'floor')?">
                    <Input type="number" step="0.01" {...form.register("minApr")} />
                  </InputField>
                   <InputField name="maxApr" label="Maximum APR?" explainer="What is the highest the rate can ever go (the 'ceiling')?">
                    <Input type="number" step="0.01" {...form.register("maxApr")} />
                  </InputField>
                  <InputField name="interestCalculation" label="Is the HELOC interest calculated on the actual daily principal balance or the average monthly balance?" explainer="CRITICAL: Must be 'actual daily balance' for the strategy to be most effective.">
                    <Input {...form.register("interestCalculation")} placeholder="Actual daily balance"/>
                  </InputField>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">11. Fees &amp; Costs</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                  <InputField name="closingCosts" label="What are the closing costs or do you cover them?">
                      <Input {...form.register("closingCosts")} />
                  </InputField>
                  <InputField name="annualFee" label="Is there an annual fee for the HELOC?">
                      <Input {...form.register("annualFee")} />
                  </InputField>
                  <InputField name="transactionFees" label="Are there any transaction fees?">
                      <Input {...form.register("transactionFees")} />
                  </InputField>
                  <InputField name="prepaymentPenalty" label="Is there a pre-payment penalty? If yes, what are the terms there?">
                      <Textarea {...form.register("prepaymentPenalty")} />
                  </InputField>
                  <InputField name="otherFees" label="Are there any other fees involved - application, origination, appraisal?">
                      <Textarea {...form.register("otherFees")} />
                  </InputField>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">12. Application &amp; Closing</AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                 <FormField
                  control={form.control}
                  name="discounts"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2"><FormLabel>Do you offer any discounts, like for setting up automated payments?</FormLabel></div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <InputField name="mobileDepositLimit" label="Do you have a maximum mobile deposit limit?">
                    <Input {...form.register("mobileDepositLimit")} />
                  </InputField>
                   <InputField name="statesOffered" label="What states do you provide HELOCs for?">
                    <Input {...form.register("statesOffered")} />
                  </InputField>
                   <InputField name="requiredDocs" label="What documentation do you require to apply?">
                    <Textarea {...form.register("requiredDocs")} />
                  </InputField>
                   <FormField
                  control={form.control}
                  name="remoteClosing"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2"><FormLabel>Do you require we close at a bank branch or can we close remotely?</FormLabel></div>
                      <FormControl><YesNoRadioGroup field={field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                   <InputField name="avgCompletionTime" label="What's the average completion time for this type of transaction?">
                    <Input {...form.register("avgCompletionTime")} />
                  </InputField>
                   <InputField name="bankruptcyGuidelines" label="What are your guidelines for bankruptcy (Chapter 7 or 13)?">
                    <Textarea {...form.register("bankruptcyGuidelines")} />
                  </InputField>
                  <InputField name="foreclosureGuidelines" label="What are your guidelines for foreclosures?">
                    <Textarea {...form.register("foreclosureGuidelines")} />
                  </InputField>
                  <InputField name="shortSaleGuidelines" label="What are your guidelines for short sales?">
                    <Textarea {...form.register("shortSaleGuidelines")} />
                  </InputField>
                  <InputField name="valuationType" label="Do you perform an AVM / Desktop valuation or a standard appraisal?">
                    <Input {...form.register("valuationType")} placeholder="e.g., Standard Appraisal" />
                  </InputField>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-13">
              <AccordionTrigger className="font-bold text-lg p-4 bg-gray-50 rounded-lg">13. Notes</AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                   <InputField name="notes" label="Additional Notes" explainer="Use this space for any other questions, comments, or details about this lender.">
                      <Textarea {...form.register("notes")} rows={5} />
                  </InputField>
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
          
          <div className="mt-8 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print / Save as PDF</Button>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Screener</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
