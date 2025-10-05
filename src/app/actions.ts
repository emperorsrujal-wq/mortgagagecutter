'use server';

import {
  generateSavingsReport,
  type SavingsReportInput,
} from '@/ai/flows/personalized-savings-report';

export async function getSavingsReport(data: SavingsReportInput) {
  try {
    const result = await generateSavingsReport(data);
    return { success: true, report: result.report };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate savings report.' };
  }
}
