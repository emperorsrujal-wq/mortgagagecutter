
import type { EstimatorInput, EstimatorOutput, RunResult } from './mortgage-types';

/**
 * Runs the mortgage baseline calculation.
 * @param balance - The current loan balance.
 * @param apr - The annual percentage rate as a decimal.
 * @param termMonths - The remaining term in months.
 * @param maxMonths - A safe limit to prevent infinite loops.
 * @returns An object with months to zero, total interest, and the calculated payment.
 */
function runMortgageBaseline(balance: number, apr: number, termMonths: number, maxMonths: number): { monthsToZero: number; totalInterest: number; payment: number; } {
  if (balance <= 0) return { monthsToZero: 0, totalInterest: 0, payment: 0 };

  const r = apr / 12;
  const payment = r === 0 ? balance / termMonths : (balance * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);

  if (isNaN(payment) || payment <= 0) {
    return { monthsToZero: maxMonths, totalInterest: 0, payment: 0 };
  }

  let b = balance;
  let totalInterest = 0;
  let m = 0;
  while (b > 0 && m < maxMonths) {
    const i = b * r;
    if (payment <= i) { // Not paying down principal
      return { monthsToZero: maxMonths, totalInterest: totalInterest, payment };
    }
    const princ = Math.min(payment - i, b);
    b -= princ;
    totalInterest += i;
    m++;
  }
  return { monthsToZero: m, totalInterest, payment };
}

/**
 * Runs a single HELOC scenario based on a specific monthly spend.
 * @param params - The shared estimator input.
 * @param netSpendMonthly - The monthly spending for this scenario.
 * @returns A RunResult object for this scenario.
 */
function runHelocScenario(params: EstimatorInput & { mortgagePayment: number; }, netSpendMonthly: number): RunResult {
  const { mortgagePayment: budget, helocRateAPR, introRateAPR, introMonths = 0, maxMonths } = params;

  const split = splitStructureIfCanada(params);
  if (split.error) {
    throw new Error(split.error);
  }

  let b = split.helocStart;
  let termBal = split.termPortion;
  let months = 0;
  let totalInterest = 0;
  let peak = b + termBal;
  let introSavings = 0;

  const aprFor = (k: number) => (introRateAPR && k < introMonths) ? introRateAPR : helocRateAPR;

  while ((b + termBal) > 1 && months < maxMonths) {
    const currentAPR = aprFor(months);
    const naturalNet = Math.max(0, params.grossMonthlyIncome - netSpendMonthly);
    const cashOut = Math.min(budget, naturalNet);

    const avgDaily = Math.max(0, b - 0.5 * cashOut);
    const helocInterest = avgDaily * (currentAPR / 12);
    
    totalInterest += helocInterest;
    
    if (introRateAPR && months < introMonths) {
      const regularInterest = avgDaily * (helocRateAPR / 12);
      introSavings += (regularInterest - helocInterest);
    }
    
    let remainingCash = cashOut;

    // Pay interest due
    const interestPaid = Math.min(remainingCash, helocInterest);
    remainingCash -= interestPaid;

    // Add unpaid interest to balance if cashflow is insufficient
    if (helocInterest > interestPaid) {
      b += (helocInterest - interestPaid);
    }

    // Pay down principal, prioritizing term portion
    let termPrincipalPay = 0;
    if (termBal > 0) {
      termPrincipalPay = Math.min(remainingCash, termBal);
      termBal -= termPrincipalPay;
      remainingCash -= termPrincipalPay;
    }
    
    let helocPrincipalPay = Math.min(remainingCash, b);
    b -= helocPrincipalPay;

    peak = Math.max(peak, b + termBal);
    months++;
  }

  return {
    monthsToZero: months >= maxMonths ? maxMonths : months,
    totalInterest,
    peakBalance: peak,
    avgMonthlyPayment: budget, // By design, we use the same outlay
    introSavings: introSavings > 0 ? introSavings : undefined,
    finalBalance: b + termBal,
  };
}


/**
 * Splits the loan structure based on Canadian readvanceable mortgage rules.
 * @param p - The EstimatorInput.
 * @returns The split structure or an error.
 */
function splitStructureIfCanada(p: EstimatorInput): { helocStart: number; termPortion: number; error?: string } {
  if (p.country !== "CA") {
    return { helocStart: p.currentLoanBalance, termPortion: 0 };
  }
  const combinedCap = Math.min(p.requestedCombinedLTV, 0.80) * p.homeValue;
  const revolvingCap = Math.min(p.requestedRevolvingLTV, 0.65) * p.homeValue;

  if (p.currentLoanBalance > combinedCap) {
    return { helocStart: 0, termPortion: 0, error: `Loan balance of ${p.currentLoanBalance} exceeds the maximum ${combinedCap} (80% LTV) for a readvanceable product. More equity is needed.` };
  }

  const eligibleBalance = Math.min(p.currentLoanBalance, combinedCap);
  const helocStart = Math.min(eligibleBalance, revolvingCap);
  const termPortion = Math.max(0, eligibleBalance - helocStart);
  return { helocStart, termPortion };
}

function pct(n: number): string {
    return `${(n * 100).toFixed(2)}%`
}

/**
 * Main function to calculate and compare savings.
 * @param input - The EstimatorInput from the user.
 * @returns An EstimatorOutput with the full comparison.
 */
export function calculateSavings(input: EstimatorInput): EstimatorOutput {
  if (input.grossMonthlyIncome <= input.monthlySpendMid) {
    throw new Error("Income must be greater than average spending to see acceleration benefits.");
  }
  
  const mortgage = runMortgageBaseline(
    input.currentLoanBalance,
    input.currentRateAPR,
    input.currentTermMonthsRemaining,
    input.maxMonths
  );

  if(mortgage.payment <= 0) {
      throw new Error("Could not calculate a valid monthly mortgage payment from the provided loan details. Please check the balance, rate, and remaining term.")
  }

  const sharedParams = { ...input, mortgagePayment: mortgage.payment };

  const helocBase = runHelocScenario(sharedParams, input.monthlySpendMid);
  const helocOpt = runHelocScenario(sharedParams, input.monthlySpendLow);
  const helocPes = runHelocScenario(sharedParams, input.monthlySpendHigh);

  const notes: string[] = [];
  if (input.country === "CA") {
    notes.push("Canadian readvanceable limits enforced: revolving portion is capped at 65% LTV, and the total combined loan is capped at 80% LTV.");
  } else {
    notes.push("US lender LTV/DTI requirements vary; this is an educational estimate, not a loan approval.");
  }
  if (input.introRateAPR && input.introMonths) {
    notes.push(`An intro APR of ${pct(input.introRateAPR)} for ${input.introMonths} months is assumed, followed by a go-to rate of ${pct(input.helocRateAPR)}.`);
  }

  return {
    assumptions: {
      dailyInterestBasis: 365,
      sameMonthlyOutlayAsMortgage: mortgage.payment,
      notes
    },
    mortgage: {
      monthsToZero: mortgage.monthsToZero >= input.maxMonths ? input.maxMonths : mortgage.monthsToZero,
      totalInterest: mortgage.totalInterest
    },
    heloc: {
      optimistic: helocOpt,
      base: helocBase,
      pessimistic: helocPes
    }
  };
}

    