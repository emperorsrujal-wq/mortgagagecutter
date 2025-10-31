
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
  
  // Existing cash
  savings: { savings: number; chequing: number; shortTerm: number };

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
  strategyType: 'Standard Chunker' | 'HELOC Arbitrage';
  optimalChunkSize?: number;
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
  monthlySurplus,
  isArbitrage,
  fixedChunkAmount,
}: {
  mortgageBal: number;
  helocBal: number;
  helocLimit: number;
  monthlySurplus: number;
  isArbitrage: boolean;
  fixedChunkAmount?: number;
}): number {
  if (mortgageBal < 1000 || monthlySurplus <= 0) return 0;
  
  const helocAvail = helocLimit - helocBal;
  if (helocAvail < 1000) return 0;

  let targetChunk: number;
  if (isArbitrage) {
    // Arbitrage mode: be aggressive, use most of available HELOC.
    targetChunk = helocAvail * 0.9; // Use 90% of available.
  } else if (fixedChunkAmount) {
    // Fixed mode: use the user's defined amount.
    targetChunk = fixedChunkAmount;
  } else {
    // Auto mode (standard): optimal chunk is often 3-6x the monthly surplus.
    // This pays it down reasonably quickly without letting interest get out of hand.
    targetChunk = monthlySurplus * 4;
  }

  // Ensure chunk is not more than available HELOC or remaining mortgage.
  const finalChunk = Math.min(mortgageBal, helocAvail, targetChunk);

  // Return chunk if it's a meaningful amount, otherwise 0.
  return finalChunk >= 1000 ? finalChunk : 0;
}


function baselineOnly(
  mortgageBalance: number,
  mortgageAPR: number,
  termMonths: number,
  monthlyMI: number,
  homeValue?: number
) {
  if (mortgageBalance <= 0) return { months: 0, totalInterest: 0, totalMI: 0, fixedPmt: 0 };
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

  // Determine which strategy to use
  const isArbitrageMode = inputs.helocAPR < inputs.mortgageAPR;
  const strategyType = isArbitrageMode ? 'HELOC Arbitrage' : 'Standard Chunker';

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
  const fixedPmt = inputs.monthlyMortgagePayment ?? base.fixedPmt;

  // --- NEW LOGIC: Utilize existing cash ---
  const existingCash = (inputs.savings?.savings ?? 0) + (inputs.savings?.chequing ?? 0) + (inputs.savings?.shortTerm ?? 0);
  
  let helocBal = inputs.helocOpeningBalance ?? 0;
  
  // Immediately use cash to pay down the mortgage if it's the higher interest debt,
  // or pay down the HELOC if it's higher (or the only debt).
  let initialCashChunk = 0;
  if (existingCash > 0) {
      if (inputs.mortgageAPR > inputs.helocAPR && mortgageBal > 0) {
          const cashToMortgage = Math.min(existingCash, mortgageBal);
          mortgageBal -= cashToMortgage;
          initialCashChunk = cashToMortgage;
      } else if (helocBal > 0) {
          const cashToHeloc = Math.min(existingCash, helocBal);
          helocBal -= cashToHeloc;
      }
  }

  const helocLimit = Math.max(0, inputs.helocLimit);

  let totalInterestMortgage = 0;
  let totalInterestHeloc = 0;
  let totalMI = 0;

  // Effective surplus timing factor
  const timingFactor = inputs.billTiming === "OPTIMIZED" ? 0.9 : 0.6;
  const timeline: Outputs["timeline"] = [];

  let months = 0;
  let firstChunkSize = 0;
  
  if (initialCashChunk > 0) {
      timeline.push({
          month: 0,
          mortgageBal: mortgageBal,
          helocBal: helocBal,
          mortInterest: 0,
          helocInterest: 0,
          mi: 0,
          chunkApplied: initialCashChunk,
          surplusUsed: 0,
      });
  }


  while ((mortgageBal > 0.01 || helocBal > 0.01) && months < maxMonths) {
    months++;

    // 1) Mortgage step
    const { interest: mortInterest, newBalance } = splitMortgagePayment(
      mortgageBal,
      inputs.mortgageAPR,
      mortgageBal > 0 ? fixedPmt : 0 // once paid off, 0
    );
    totalInterestMortgage += mortInterest;
    mortgageBal = newBalance;

    // 2) MI only while LTV > 80%
    let thisMI = 0;
    if (inputs.homeValue && inputs.monthlyMI) {
      const ltv = (mortgageBal + helocBal) / inputs.homeValue;
      if (ltv > 0.80) thisMI = inputs.monthlyMI;
    }
    totalMI += thisMI;

    // 3) Surplus: netIncome - livingExpenses - (mortgage payment + MI)
    const mortgageOutflow = mortgageBal > 0 ? fixedPmt : 0; 
    const rawSurplus = inputs.netIncome - inputs.livingExpenses - mortgageOutflow - thisMI;

    // 4) HELOC interest, then principal paydown from surplus
    const helocInterest = helocBal * ((inputs.helocAPR / 100) / 12);
    totalInterestHeloc += helocInterest;
    
    const surplusAfterHelocInterest = rawSurplus - helocInterest;
    let principalToHeloc = surplusAfterHelocInterest * timingFactor;
    
    if (principalToHeloc > helocBal) {
      principalToHeloc = helocBal;
    }
    helocBal -= principalToHeloc;

    // 5) Chunking logic
    let chunkApplied = 0;
    if (helocBal < 1000 && mortgageBal > 0 && rawSurplus > 0) {
      const surplusForChunking = Math.max(0, rawSurplus - helocInterest);
      chunkApplied = safeChunkAmount({
        mortgageBal,
        helocBal,
        helocLimit,
        monthlySurplus: surplusForChunking,
        isArbitrage: isArbitrageMode,
        fixedChunkAmount: inputs.chunkMode === 'FIXED' ? inputs.fixedChunkAmount : undefined,
      });

      if (chunkApplied > 0) {
        if (months === 1) firstChunkSize = chunkApplied;
        mortgageBal -= chunkApplied;
        helocBal += chunkApplied;
      }
    }
    
    // For readvanceable mortgages, check if equity increased
    if (inputs.readvanceable && mortgageBal > 0) {
        const principalPaidThisMonth = (mortgageBal > 0 ? fixedPmt : 0) - mortInterest;
        if (principalPaidThisMonth > 0) {
            // This is a simplification; real banks might have different rules.
            // helocLimit += principalPaidThisMonth;
        }
    }

    timeline.push({
      month: months,
      mortgageBal: Math.max(0, mortgageBal),
      helocBal: Math.max(0, helocBal),
      mortInterest,
      helocInterest,
      mi: thisMI,
      chunkApplied,
      surplusUsed: rawSurplus > 0 ? rawSurplus : 0,
    });
  }

  const stratMonths = months;
  const stratInterest = totalInterestMortgage + totalInterestHeloc;

  const result: Outputs = {
    months: stratMonths,
    strategyType,
    optimalChunkSize: firstChunkSize,
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

    