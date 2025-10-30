
'use server';

import { simulate as runChunkerSimulation } from '@/lib/chunker';
import type { Inputs as ChunkerInputs } from '@/lib/chunker';
import type { Inputs as ComparisonInputs, Outputs as ComparisonOutputs } from '@/lib/mortgage-types';

export async function getSavingsReport(
  data: Omit<ComparisonInputs, 'helocRateAPR'>
): Promise<{ success: true; report: ComparisonOutputs } | { success: false; error: string }> {
  try {
    // Map the inputs from the questionnaire to the chunker simulation inputs
    // Provide a default HELOC rate for the initial estimate.
    const chunkerInputs: ChunkerInputs = {
      mortgageBalance: data.mortgageBalance,
      mortgageAPR: data.mortgageRateAPR,
      termMonthsRemaining: data.amortYearsRemaining ? data.amortYearsRemaining * 12 : 360,
      monthlyMortgagePayment: data.paymentMonthly,
      homeValue: data.homeValue,
      monthlyMI: 0, // Chunker doesn't model MI, can be added later
      netIncome: data.netMonthlyIncome,
      livingExpenses: data.monthlyExpenses,
      helocAPR: 8.5, // Use a reasonable default for the initial estimate
      // Assume the HELOC limit is the LTV of the home value minus the mortgage
      helocLimit: (data.homeValue * (data.ltvLimit ?? 0.8)) - data.mortgageBalance,
      helocOpeningBalance: 0,
      readvanceable: false, // Assume non-readvanceable for this simpler tool
      chunkMode: 'AUTO',
      billTiming: 'OPTIMIZED',
    };

    const result = runChunkerSimulation(chunkerInputs);

    // Map the Chunker output to the format expected by the comparison page
    const report: ComparisonOutputs = {
      debtFreeMonthsBaseline: result.baseline.months,
      interestBaseline: result.baseline.totalInterest,
      debtFreeMonthsHeloc: result.strategy.months,
      interestHeloc: result.strategy.totalInterest,
      interestSaved: result.totals.interestSaved,
      borrowingRoomAfterSetup: chunkerInputs.helocLimit, // Simplified for this view
      series: result.timeline.map(t => ({
        month: t.month,
        // The chunker timeline doesn't have a separate baseline balance, so we use the mortgage balance
        balanceBaseline: result.baseline.months > t.month ? t.mortgageBal + t.helocBal : 0, // This is a simplification
        balanceHeloc: t.mortgageBal + t.helocBal,
      })),
    };

    return { success: true, report: report };
  } catch (error) {
    console.error('Error in getSavingsReport:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate savings report: ${message}` };
  }
}
