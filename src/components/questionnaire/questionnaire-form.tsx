
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Info, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const debtSchema = z.object({
  id: z.string(),
  kind: z.enum(['cc', 'car', 'loc', 'other']).default('cc'),
  balance: z.coerce.number().positive('Must be positive.'),
  rateAPR: z.coerce.number().min(0).max(100, 'Invalid rate.'),
  paymentMonthly: z.coerce.number().min(0, 'Must be non-negative.'),
});

const formSchema = z.object({
  homeValue: z.coerce.number().positive('Must be positive.'),
  mortgageBalance: z.coerce.number().positive('Must be positive.'),
  mortgageRateAPR: z.coerce.number().min(0.1, '> 0').max(25, '< 25'),
  amortYearsRemaining: z.coerce.number().int().min(1, '> 0').max(50, '< 50'),
  
  netMonthlyIncome: z.coerce.number().positive('Must be positive.'),
  monthlyExpenses: z.coerce.number().nonnegative('Must be non-negative.'),

  debts: z.array(debtSchema),

  savings: z.object({
    savings: z.coerce.number().nonnegative().default(0),
    chequing: z.coerce.number().nonnegative().default(0),
    shortTerm: z.coerce.number().nonnegative().default(0),
  }),
  
  cardOffset: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function QuestionnaireForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeValue: undefined,
      mortgageBalance: undefined,
      mortgageRateAPR: undefined,
      amortYearsRemaining: undefined,
      netMonthlyIncome: undefined,
      monthlyExpenses: undefined,
      debts: [],
      savings: { savings: 0, chequing: 0, shortTerm: 0 },
      cardOffset: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'debts',
  });

  function onSubmit(values: FormData) {
    setIsSubmitting(true);
    const params = new URLSearchParams();
    
    // Add form values to params
    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    });

    // Add system-defined values
    params.append('ltvLimit', '0.8');

    router.push(`/comparison?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Mortgage Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Your Home & Mortgage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="homeValue" render={({ field }) => (
              <FormItem>
                <FormLabel>Current Home Value ($)</FormLabel>
                <FormControl><Input type="number" placeholder="600000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mortgageBalance" render={({ field }) => (
              <FormItem>
                <FormLabel>Mortgage Balance ($)</FormLabel>
                <FormControl><Input type="number" placeholder="450000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mortgageRateAPR" render={({ field }) => (
              <FormItem>
                <FormLabel>Mortgage Rate (APR %)</FormLabel>
                <FormControl><Input type="number" step="0.01" placeholder="5.5" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amortYearsRemaining" render={({ field }) => (
              <FormItem>
                <FormLabel>Amortization Left (Years)</FormLabel>
                <FormControl><Input type="number" placeholder="25" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Cash Flow */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Your Monthly Cash Flow</h3>
           <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
             <Info className="h-4 w-4 text-blue-600" />
             <AlertDescription className="text-xs">
                Provide your average monthly take-home pay and your total non-debt expenses (like groceries, utilities, gas). Do not include payments for mortgage, cards, or loans here.
             </AlertDescription>
           </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="netMonthlyIncome" render={({ field }) => (
              <FormItem>
                <FormLabel>Net Monthly Income ($)</FormLabel>
                <FormControl><Input type="number" placeholder="6000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="monthlyExpenses" render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Expenses ($)</FormLabel>
                <FormControl><Input type="number" placeholder="2500" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Other Debts */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-medium">Other Debts (Optional)</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: crypto.randomUUID(), kind: 'cc', balance: 0, rateAPR: 0, paymentMonthly: 0 })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Debt
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end p-3 border rounded-lg relative">
              <FormField control={form.control} name={`debts.${index}.kind`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="cc">Credit Card</SelectItem>
                      <SelectItem value="car">Car Loan</SelectItem>
                      <SelectItem value="loc">Line of Credit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name={`debts.${index}.balance`} render={({ field }) => (
                <FormItem><FormLabel>Balance ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name={`debts.${index}.rateAPR`} render={({ field }) => (
                <FormItem><FormLabel>Rate (APR %)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name={`debts.${index}.paymentMonthly`} render={({ field }) => (
                <FormItem><FormLabel>Payment ($/mo)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Savings & HELOC Config */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Strategy & Assumptions</h3>
           
          <h4 className="text-base font-medium">Assets to Consolidate (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="savings.savings" render={({ field }) => (
                <FormItem><FormLabel>Savings Acct ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="savings.chequing" render={({ field }) => (
                <FormItem><FormLabel>Chequing Acct ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="savings.shortTerm" render={({ field }) => (
                <FormItem><FormLabel>Short-Term Inv. ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <AlertDescription className="text-xs text-muted-foreground">Enter any cash you'd move into the HELOC to immediately pay down principal.</AlertDescription>
          
          <Separator className="my-4"/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
             <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                <FormField control={form.control} name="cardOffset" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Use Card Offset Strategy?</FormLabel>
                         <AlertDescription className="text-xs text-muted-foreground">
                            Simulates paying all monthly bills with a credit card and paying it off from the HELOC at month-end to reduce interest.
                        </AlertDescription>
                    </div>
                    </FormItem>
                )} />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Build My Savings Blueprint
          </Button>
        </div>
      </form>
    </Form>
  );
}
