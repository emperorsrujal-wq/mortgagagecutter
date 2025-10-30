// Basic amort helpers (no fees, no bank specifics)

export function pmt(aprPct: number, nMonths: number, principal: number): number {
  if (nMonths <= 0 || principal <= 0) return 0;
  const r = (aprPct / 100) / 12;
  if (r === 0) return principal / nMonths;
  const p = Math.pow(1 + r, nMonths);
  return (principal * r * p) / (p - 1);
}

export function splitMortgagePayment(
  balance: number,
  aprPct: number,
  fixedPmt: number
): { interest: number; principal: number; newBalance: number } {
  const r = (aprPct / 100) / 12;
  const interest = balance * r;
  let principal = Math.max(0, fixedPmt - interest);
  
  // Cap principal payment at the remaining balance
  if (principal > balance) {
    principal = balance;
  }
  const newBalance = balance - principal;

  return { interest, principal, newBalance };
}
