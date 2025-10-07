
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Info } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  country: z.enum(['US', 'CA']).default('US'),
  homeValue: z.coerce.number().positive('Must be a positive number.'),
  currentLoanBalance: z.coerce.number().positive('Must be a positive number.'),
  currentRateAPR: z.coerce
    .number()
    .min(0.1, 'Must be > 0')
    .max(25, 'Must be < 25'),
  currentTermMonthsRemaining: z.coerce.number().int().positive('Must be positive.'),
  grossMonthlyIncome: z.coerce.number().positive('Must be a positive number.'),
  monthlySpendLow: z.coerce.number().nonnegative('Must be a positive number.'),
  monthlySpendMid: z.coerce.number().nonnegative('Must be a positive number.'),
  monthlySpendHigh: z.coerce.number().nonnegative('Must be a positive number.'),
  helocRateAPR: z.coerce
    .number()
    .min(0.1, 'Must be > 0')
    .max(25, 'Must be < 25'),
});

type FormData = z.infer<typeof formSchema>;

export function QuestionnaireForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: 'US',
    },
  });

  async function onSubmit(values: FormData) {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, String(v ?? '')])
      )
    );
    router.push(`/comparison?${query.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
      >
        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="space-y-3 md:col-span-2">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="US" id="us" />
                    </FormControl>
                    <Label htmlFor="us">United States</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CA" id="ca" />
                    </FormControl>
                    <Label htmlFor="ca">Canada</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Loan Info */}
        <div className="md:col-span-2 font-semibold text-lg border-b pb-2 mb-2 mt-4">Your Home & Loan</div>
        
        <FormField
          control={form.control}
          name="homeValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Home Value ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="600000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentLoanBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Mortgage Balance ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="450000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentRateAPR"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Mortgage Rate (APR %)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="5.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentTermMonthsRemaining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remaining Term (Months)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Financial Info */}
        <div className="md:col-span-2 font-semibold text-lg border-b pb-2 mb-2 mt-4">Your Finances</div>

        <FormField
          control={form.control}
          name="grossMonthlyIncome"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Gross Monthly Income ($)</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="8000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 space-y-2">
          <Label>Monthly Spend (excluding mortgage payments)</Label>
           <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
             <Info className="h-4 w-4 text-blue-600" />
             <AlertDescription className="text-xs">
                Provide a pessimistic (high), base (average), and optimistic (low) estimate for your monthly spending. This helps us model different scenarios.
             </AlertDescription>
           </Alert>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="monthlySpendHigh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Pessimistic (High)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlySpendMid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Base (Average)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="4000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlySpendLow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Optimistic (Low)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="3500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* HELOC Info */}
        <div className="md:col-span-2 font-semibold text-lg border-b pb-2 mb-2 mt-4">Future HELOC Assumptions</div>
        <FormField
          control={form.control}
          name="helocRateAPR"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Expected HELOC Rate (APR %)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="7.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 text-center mt-4">
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Build My Savings Blueprint
          </Button>
        </div>
      </form>
    </Form>
  );
}

    