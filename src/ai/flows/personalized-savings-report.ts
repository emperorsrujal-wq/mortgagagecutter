
'use server';

/**
 * @fileOverview An AI-powered tool that provides a personalized savings report based on user's mortgage details.
 *
 * - generateSavingsReport - A function that takes mortgage details as input and generates a personalized savings report.
 * - SavingsReportInput - The input type for the generateSavingsReport function.
 * - SavingsReportOutput - The return type for the generateSavingsReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsReportInputSchema = z.object({
  currentMortgageBalance: z.number().describe('The current outstanding balance on the mortgage.'),
  currentInterestRate: z.number().describe('The current interest rate on the mortgage (e.g., 0.05 for 5%).'),
  originalLoanAmount: z.number().describe('The original amount of the mortgage loan.'),
  loanTerm: z.number().describe('The total term of the loan in years (e.g., 30).'),
  monthlyMortgagePayment: z.number().describe('The current monthly mortgage payment (principal & interest).'),
  yearsInHome: z.number().describe('The number of years the user has already been in the home.'),
  estimatedHomeValue: z.number().optional().describe('The estimated current value of the home (optional).'),
  monthlyIncome: z.number().describe("The user's total monthly take-home income."),
  monthlyExpenses: z.number().describe("The user's total monthly expenses."),
});

export type SavingsReportInput = z.infer<typeof SavingsReportInputSchema>;

const SavingsReportOutputSchema = z.object({
  report: z.string().describe('A personalized savings report detailing the potential benefits of the Mortgage Cutter Method, including estimated interest savings and reduced payoff time.'),
});

export type SavingsReportOutput = z.infer<typeof SavingsReportOutputSchema>;

export async function generateSavingsReport(input: SavingsReportInput): Promise<SavingsReportOutput> {
  return savingsReportFlow(input);
}

const savingsReportPrompt = ai.definePrompt({
  name: 'savingsReportPrompt',
  input: {schema: SavingsReportInputSchema},
  output: {schema: SavingsReportOutputSchema},
  prompt: `You are a financial advisor specializing in mortgage optimization. A user will provide their current mortgage and financial details. Your task is to generate a personalized savings report highlighting the potential benefits of the Mortgage Cutter Method (which is based on the HELOC/all-in-one mortgage strategy).

The core of the method is using their monthly cash flow (income minus expenses) to make accelerated payments on their mortgage principal.

Mortgage & Financial Details:
Current Mortgage Balance: {{{currentMortgageBalance}}}
Current Interest Rate: {{{currentInterestRate}}}
Monthly Mortgage Payment: {{{monthlyMortgagePayment}}}
Monthly Income: {{{monthlyIncome}}}
Monthly Expenses: {{{monthlyExpenses}}}

Generate a report (SavingsReportOutput) that details potential savings in interest and time. Emphasize how redirecting their positive cash flow can dramatically shorten their mortgage term. Clearly state assumptions and disclaimers. Focus on the positive impact and financial empowerment the method offers without revealing the proprietary details of the method itself. Frame it as a smart financial strategy.
`,
});

const savingsReportFlow = ai.defineFlow(
  {
    name: 'savingsReportFlow',
    inputSchema: SavingsReportInputSchema,
    outputSchema: SavingsReportOutputSchema,
  },
  async input => {
    const {output} = await savingsReportPrompt(input);
    return output!;
  }
);
