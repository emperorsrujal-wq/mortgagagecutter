

/**
 * Calculates the monthly payment for a loan.
 * @param rateAPR Annual interest rate (%).
 * @param termMonths Total number of payments.
 * @param principal The loan amount.
 * @returns The monthly payment amount.
 */
export function pmt(rateAPR: number, termMonths: number, principal: number): number {
  if (principal <= 0) return 0;
  if (rateAPR <= 0) return principal / termMonths;
  
  const i = rateAPR / 12 / 100;
  const n = termMonths;
  const B = principal;

  if (i === 0) return B / n;

  return B * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

/**
 * Splits a mortgage payment into its interest and principal components.
 * @param balance The current loan balance.
 * @param rateAPR The annual interest rate (%).
 * @param payment The total monthly payment amount.
 * @returns An object with interest, principal paid, and the new balance.
 */
export function splitMortgagePayment(balance: number, rateAPR: number, payment: number) {
  if (balance <= 0) {
    return { interest: 0, principal: 0, newBalance: 0 };
  }

  const interest = balance * (rateAPR / 12 / 100);
  const principalPaid = Math.min(balance, payment - interest);
  const newBalance = balance - principalPaid;

  return { interest, principal: principalPaid, newBalance: Math.max(0, newBalance) };
}

    