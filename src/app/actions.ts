
'use server';

import { calculateSavings } from '@/lib/mortgage';
import type { EstimatorInput, EstimatorOutput } from '@/lib/mortgage-types';

export async function getSavingsReport(
  data: EstimatorInput
): Promise<{ success: true; report: EstimatorOutput } | { success: false; error: string }> {
  try {
    const result = calculateSavings(data);
    return { success: true, report: result };
  } catch (error) {
    console.error('Error in getSavingsReport:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate savings report: ${message}` };
  }
}

    