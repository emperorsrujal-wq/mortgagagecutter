
export type Country = "US" | "CA";

export interface EstimatorInput {
  country: Country;
  homeValue: number;
  currentLoanBalance: number;
  currentRateAPR: number; // decimal
  currentTermMonthsRemaining: number;

  grossMonthlyIncome: number;
  monthlySpendLow: number;  // excluding P&I
  monthlySpendMid: number;
  monthlySpendHigh: number;

  helocRateAPR: number; // decimal
  introRateAPR?: number; // decimal
  introMonths?: number;
  
  drawYears: number;
  repaymentYears: number;

  requestedCombinedLTV: number; // 0..1
  requestedRevolvingLTV: number; // 0..1
  closingCostsEstimate: number;
  monthlyEscrows?: number;

  maxMonths: number;
}

export interface EstimatorOutput {
  assumptions: {
    dailyInterestBasis: 365;
    sameMonthlyOutlayAsMortgage: number;
    notes: string[];
  };
  mortgage: {
    monthsToZero: number;
    totalInterest: number;
  };
  heloc: {
    optimistic: RunResult;
    base: RunResult;
    pessimistic: RunResult;
  };
}

export interface RunResult {
  monthsToZero: number;
  totalInterest: number;
  peakBalance: number;
  avgMonthlyPayment: number;
  introSavings?: number;
  finalBalance: number;
}

    