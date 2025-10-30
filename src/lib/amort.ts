
/**
 * Calculates the monthly payment for a loan.
 * @param rate Annual interest rate (e.g., 5.5 for 5.5%).
 * @param nper The total number of payments for the loan.
 * @param pv The present value or principal amount of the loan.
 * @returns The monthly payment amount.
 */
export function pmt(rate: number, nper: number, pv: number): number {
  const monthlyRate = rate / 12 / 100;
  if (monthlyRate === 0) {
    return pv / nper;
  }
  const payment = (pv * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -nper));
  return payment;
}

/**
 * Splits a mortgage payment into its principal and interest components.
 * @param balance The current loan balance.
 * @param aprPct The annual percentage rate of the loan.
 * @param fixedPmt The fixed monthly payment amount.
 * @returns An object containing the interest paid, principal paid, and the new balance.
 */
export function splitMortgagePayment(balance: number, aprPct: number, fixedPmt: number): { interest: number; principal: number; newBalance: number } {
    const monthlyRate = aprPct / 12 / 100;
    const interest = balance * monthlyRate;
    
    // Ensure payment does not exceed the remaining balance + interest
    const payment = Math.min(fixedPmt, balance + interest);
    const principal = payment - interest;
    
    const newBalance = balance - principal;
  
    return { interest, principal, newBalance };
}
