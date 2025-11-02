
'use server';

import { estimate as runChunkerSimulation } from '@/lib/mortgage';
import type { Inputs as ComparisonInputs, Outputs as ComparisonOutputs } from '@/lib/mortgage-types';

export async function getSavingsReport(
  data: Omit<ComparisonInputs, 'helocRateAPR'>
): Promise<{ success: true; report: ComparisonOutputs } | { success: false; error: string }> {
  try {
    // Map the inputs from the questionnaire to the chunker simulation inputs
    // Provide a default HELOC rate for the initial estimate.
    const chunkerInputs: ComparisonInputs = {
      ...data,
      helocRateAPR: 8.5, // Use a reasonable default for the initial estimate
    };

    const result = runChunkerSimulation(chunkerInputs);

    return { success: true, report: result };
  } catch (error) {
    console.error('Error in getSavingsReport:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate savings report: ${message}` };
  }
}
