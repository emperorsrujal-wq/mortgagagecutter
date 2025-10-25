/**
 * HELOC + chunk strategy simulator (readvanceable lines supported).
 * Bank-agnostic. No fees. Education-only.
 */

import { pmt, splitMortgagePayment } from "./amort";

export type BillTiming = "OPTIMIZED" | "TYPICAL";
export type ChunkMode = "AUTO" | "FIXED";

export interface Inputs {
  // Mortgage
  mortgageBalance: number;           // current principal
  mortgageAPR: number;               // %
  termMonthsRemaining: number;       // e.g., 300
  monthlyMortgagePayment?: number;   // optional; will compute if missing

  // Property & MI
  homeValue?: number;                // for MI cutoff (LTV)
  monthlyMI?: number;                // 0 if none

  // Income & expenses
  netIncome: number;                 // after-tax monthly income
  livingExpenses: number;            // exclude mortgage (we subtract it)

  // HELOC
  helocAPR: number;                  // %
  helocLimit: number;                // readvanceable credit LIMIT
  helocOpeningBalance?: number;      // start balance (usually 0)
  readvanceable: boolean;

  // Strategy
  chunkMode: ChunkMode;              // "AUTO" or "FIXED"
  fixedChunkAmount?: number;         // used if chunkMode="FIXED"
  billTiming: BillTiming;            // affects effective surplus time
  maxMonths?: number;                // safety cap (default 480)
}

export interface Outputs {
  months: number;
  baseline: { months: number; totalInterest: number; totalMI: number };
  strategy: { months: number; totalInterest: number; totalMI: number };
  totals: {
    interestSaved: number;
    miSaved: number;
    monthsSaved: number;
  };
  timeline: Array<{
    month: number;
    mortgageBal: number;
    helocBal: number;
    mortInterest: number;
    helocInterest: number;
    mi: number;
    chunkApplied: number;
    surplusUsed: number;
  }>;
}

function safeChunkAmount({
  mortgageBal,
  helocBal,
  helocLimit,
  helocAPR,
  monthlySurplus,
  maxChunkUser,
}: {
  mortgageBal: number;
  helocBal: number;
  helocLimit: number;
  helocAPR: number;
  monthlySurplus: number;
  maxChunkUser?: number | null;
}): number {
  const helocAvail = Math.max(0, helocLimit - helocBal);
  if (mortgageBal < 1000 || helocAvail < 1000) return 0;

  // AUTO = 10% of remaining mortgage (conservative). FIXED uses user amount.
  const target = Math.min(
    mortgageBal,
    helocAvail,
    maxChunkUser && maxChunkUser > 0 ? maxChunkUser : Math.max(1000, mortgageBal * 0.10)
  );

  // Safety: next month's HELOC interest must be comfortably covered by surplus
  const rH = (helocAPR / 100) / 12;
  let test = target;
  for (let i = 0; i < 10; i++) {
    const nextHelocBal = helocBal + test;
    const nextInterest = nextHelocBal * rH;
    if (monthlySurplus >= 1.25 * nextInterest) return test; // 25% cushion
    test = test * 0.7;
    if (test < 1000) return 0; // too small to be meaningful
  }
  return 0;
}

function baselineOnly(
  mortgageBalance: number,
  mortgageAPR: number,
  termMonths: number,
  monthlyMI: number,
  homeValue?: number
) {
  const fixed = pmt(mortgageAPR, termMonths, mortgageBalance);
  let bal = mortgageBalance;
  let interest = 0;
  let mi = 0;
  let m = 0;

  while (bal > 0.01 && m < termMonths) {
    const { interest: i, newBalance } = splitMortgagePayment(bal, mortgageAPR, fixed);
    interest += i;

    const ltv = homeValue ? newBalance / homeValue : 1;
    const thisMI = homeValue && monthlyMI && ltv > 0.80 ? monthlyMI : 0;
    mi += thisMI;

    bal = newBalance;
    m++;
  }
  return { months: m, totalInterest: interest, totalMI: mi, fixedPmt: fixed };
}

export function simulate(inputs: Inputs): Outputs {
  const maxMonths = inputs.maxMonths ?? 480;

  // Baseline (mortgage only)
  const miBaseline = inputs.monthlyMI ?? 0;
  const base = baselineOnly(
    inputs.mortgageBalance,
    inputs.mortgageAPR,
    inputs.termMonthsRemaining,
    miBaseline,
    inputs.homeValue
  );

  // Strategy init
  let mortgageBal = inputs.mortgageBalance;
  const fixedPmt = inputs.monthlyMortgagePayment ?? pmt(
    inputs.mortgageAPR,
    inputs.termMonthsRemaining,
    inputs.mortgageBalance
  );

  let helocBal = inputs.helocOpeningBalance ?? 0;
  const helocLimit = Math.max(0, inputs.helocLimit);

  let totalInterestMortgage = 0;
  let totalInterestHeloc = 0;
  let totalMI = 0;

  const timing = inputs.billTiming === "OPTIMIZED" ? 0.9 : 0.6;
  const timeline: Outputs["timeline"] = [];

  let months = 0;

  while ((mortgageBal > 0.01 || helocBal > 0.01) && months < maxMonths) {
    months++;

    // 1) Mortgage step
    const { interest: mi, newBalance } = splitMortgagePayment(
      mortgageBal,
      inputs.mortgageAPR,
      mortgageBal > 0 ? fixedPmt : 0 // once paid off, 0
    );
    totalInterestMortgage += mi;
    mortgageBal = newBalance;

    // 2) MI only while LTV > 80% (conservative: vs original homeValue)
    let thisMI = 0;
    if (inputs.homeValue && inputs.monthlyMI) {
      const ltv = mortgageBal / inputs.homeValue;
      if (ltv > 0.80) thisMI = inputs.monthlyMI;
    }
    totalMI += thisMI;

    // 3) Surplus: netIncome - livingExpenses - (mortgage payment + MI)
    // (If mortgage is zero, don't subtract fixedPmt)
    const mortgageOutflow = mortgageBal > 0 ? fixedPmt : 0;
    const rawSurplus = inputs.netIncome - inputs.livingExpenses - mortgageOutflow - thisMI;
    const effectiveSurplus = Math.max(0, rawSurplus) * timing;

    // 4) HELOC interest, then principal
    const helocInterest = helocBal * ((inputs.helocAPR / 100) / 12);
    totalInterestHeloc += helocInterest;
    let principalToHeloc = Math.max(0, effectiveSurplus - helocInterest);
    if (principalToHeloc > helocBal) principalToHeloc = helocBal;
    helocBal -= principalToHeloc;

    let chunkApplied = 0;

    // 5) Consider a new chunk only when HELOC is light AND readvanceable
    if (inputs.readvanceable && mortgageBal > 0.01 && (helocLimit - helocBal) > 1000 && helocBal < 100) {
      const chunk = safeChunkAmount({
        mortgageBal,
        helocBal,
        helocLimit,
        helocAPR: inputs.helocAPR,
        monthlySurplus: effectiveSurplus,
        maxChunkUser: inputs.chunkMode === "FIXED" ? (inputs.fixedChunkAmount ?? 0) : undefined,
      });
      if (chunk > 0) {
        helocBal += chunk;           // draw from HELOC
        mortgageBal = Math.max(0, mortgageBal - chunk); // slam mortgage principal
        chunkApplied = chunk;
      }
    }

    timeline.push({
      month: months,
      mortgageBal: Math.max(0, mortgageBal),
      helocBal: Math.max(0, helocBal),
      mortInterest: mi,
      helocInterest,
      mi: thisMI,
      chunkApplied,
      surplusUsed: effectiveSurplus,
    });
  }

  const stratMonths = months;
  const stratInterest = totalInterestMortgage + totalInterestHeloc;

  const result: Outputs = {
    months: stratMonths,
    baseline: { months: base.months, totalInterest: base.totalInterest, totalMI: base.totalMI },
    strategy: { months: stratMonths, totalInterest: stratInterest, totalMI },
    totals: {
      interestSaved: Math.max(0, (base.totalInterest) - stratInterest),
      miSaved: Math.max(0, (base.totalMI) - totalMI),
      monthsSaved: Math.max(0, base.months - stratMonths),
    },
    timeline,
  };

  return result;
}
