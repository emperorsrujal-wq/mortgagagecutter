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
  prompt: `You are a financial advisor specializing in mortgage optimization. A user will provide their current mortgage details, and your task is to generate a personalized savings report highlighting the potential benefits of the Mortgage Cutter Method. Focus on quantifying the potential interest savings and reduction in payoff time compared to their current mortgage plan.

Mortgage Details:
Current Mortgage Balance: {{{currentMortgageBalance}}}
Current Interest Rate: {{{currentInterestRate}}}
Original Loan Amount: {{{originalLoanAmount}}}
Loan Term: {{{loanTerm}}} years
Monthly Mortgage Payment: {{{monthlyMortgagePayment}}}
Years in Home: {{{yearsInHome}}}
Estimated Home Value: {{{estimatedHomeValue}}}

Generate a report (SavingsReportOutput) that details potential savings in interest and time using the Mortgage Cutter Method. Clearly state assumptions and disclaimers. Focus on the positive impact and financial empowerment the method offers without revealing the proprietary details of the method itself.
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
