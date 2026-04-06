
'use server';

import { estimate as runChunkerSimulation } from '@/lib/mortgage';
import type { Inputs as ComparisonInputs, Outputs as ComparisonOutputs } from '@/lib/mortgage-types';
import { generateSavingsReport, type SavingsReportInput } from '@/ai/flows/personalized-savings-report';

export async function getSavingsReport(
  data: Omit<ComparisonInputs, 'helocRateAPR'>
): Promise<{ success: true; report: ComparisonOutputs } | { success: false; error: string }> {
  try {
    const chunkerInputs: ComparisonInputs = {
      ...data,
      helocRateAPR: 8.5,
    };

    const result = runChunkerSimulation(chunkerInputs);

    return { success: true, report: result };
  } catch (error) {
    console.error('Error in getSavingsReport:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate savings report: ${message}` };
  }
}

export async function getAISavingsAnalysis(input: SavingsReportInput) {
  try {
    const { report } = await generateSavingsReport(input);
    return { success: true, analysis: report };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return { success: false, error: 'Could not generate AI analysis.' };
  }
}
