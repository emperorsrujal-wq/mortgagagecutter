
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { getSavingsReport } from '@/app/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  currentMortgageBalance: z.coerce.number().positive('Must be a positive number.'),
  currentInterestRate: z.coerce
    .number()
    .min(0.1, 'Must be > 0')
    .max(20, 'Must be < 20'),
  originalLoanAmount: z.coerce.number().positive('Must be a positive number.'),
  loanTerm: z.coerce.number().int().positive().default(30),
  monthlyMortgagePayment: z.coerce
    .number()
    .positive('Must be a positive number.'),
  yearsInHome: z.coerce.number().int().min(0),
  estimatedHomeValue: z.coerce
    .number()
    .positive('Must be a positive number.')
    .optional(),
  monthlyIncome: z.coerce.number().positive('Must be a positive number.'),
  monthlyExpenses: z.coerce.number().positive('Must be a positive number.'),
});

type FormData = z.infer<typeof formSchema>;

export function QuestionnaireForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanTerm: 30,
      yearsInHome: 0,
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    
    // For the AI prompt, combine the user-entered expenses with the mortgage payment.
    const apiValues = {
      ...values,
      currentInterestRate: values.currentInterestRate / 100, // Convert percentage to decimal for AI
      monthlyExpenses: values.monthlyExpenses + values.monthlyMortgagePayment,
    };
    
    const result = await getSavingsReport(apiValues);
    setIsSubmitting(false);

    if (result.success && result.report) {
      // Pass the original form values (not apiValues) to the comparison page.
      // The comparison page will do its own calculation based on these raw values.
      const query = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(values).map(([k, v]) => [k, String(v ?? '')])
        ),
        report: result.report,
      });
      router.push(`/comparison?${query.toString()}`);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Could not generate report.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <FormField
          control={form.control}
          name="currentMortgageBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Mortgage Balance ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="250000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentInterestRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Interest Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="5.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="originalLoanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Loan Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="300000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="loanTerm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Term</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a loan term" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30">30 years</SelectItem>
                  <SelectItem value="25">25 years</SelectItem>
                  <SelectItem value="20">20 years</SelectItem>
                  <SelectItem value="15">15 years</SelectItem>
                  <SelectItem value="10">10 years</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyMortgagePayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Mortgage Payment (P&I) ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="1610" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearsInHome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years You've Been in Your Home</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Monthly Take-Home Income ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="6000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyExpenses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Monthly Expenses (excluding mortgage) ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="2500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estimatedHomeValue"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Estimated Home Value ($) (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="450000"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 text-center mt-4">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate My Savings!
          </Button>
        </div>
      </form>
    </Form>
  );
}
