// Basic amort helpers (no fees, no bank specifics)

export function pmt(aprPct: number, nMonths: number, principal: number): number {
  const r = (aprPct / 100) / 12;
  if (r === 0) return principal / nMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -nMonths));
}

export function splitMortgagePayment(
  balance: number,
  aprPct: number,
  fixedPmt: number
): { interest: number; principal: number; newBalance: number } {
  const r = (aprPct / 100) / 12;
  const interest = balance * r;
  let principal = Math.max(0, fixedPmt - interest);
  if (principal > balance) principal = balance;
  const newBalance = balance - principal;
  return { interest, principal, newBalance };
}
