export type BaselineInput = {
  mortgageBalance: number;      // $
  mortgageAPR: number;          // %
  termMonths: number;           // months remaining
  monthlyMortgagePayment?: number; // if not provided, compute
  homeValue?: number;           // for MI/LTV
  monthlyMI?: number;           // optional PMI/CMHC
};

export type BaselineResult = {
  months: number;
  totalInterest: number;
  totalMI: number;
  payoffDateISO: string;
  series: { month: number; balance: number }[];
  monthlyPaymentUsed: number;
};

export type ChunkInput = BaselineInput & {
  helocAPR: number;             // %
  availableHelocNow: number;    // $
  netIncome: number;            // $
  livingExpenses: number;       // $ (exclude mortgage)
  onetimeCashToMortgage?: number; // $ apply day 1 to principal
  chunkMode: "AUTO" | "FIXED";
  fixedChunkAmount?: number;    // $ used if chunkMode = "FIXED"
  billTiming: "OPTIMIZED" | "TYPICAL";
  readvanceable: boolean;       // true = credit frees up after repay
};

export type ChunkResult = {
  months: number;
  totalInterestCombined: number; // mortgage + HELOC interest
  totalMI: number;               // MI paid in chunker scenario
  payoffDateISO: string;
  series: { month: number; mortgageBalance: number; helocBalance: number; totalBalance: number }[];
  monthlyPaymentUsed: number;
  warnings: string[];
};

// helpers
const monthlyRate = (aprPct: number) => (aprPct / 100) / 12;

export function mortgagePaymentFromTerms(
  principal: number,
  aprPct: number,
  n: number
): number {
  if (principal <= 0 || n <= 0) return 0;
  const r = monthlyRate(aprPct);
  if (r === 0) return principal / n;
  return principal * r / (1 - Math.pow(1 + r, -n));
}

export function simulateBaseline(input: BaselineInput): BaselineResult {
  let bal = input.mortgageBalance;
  const n = Math.max(1, Math.round(input.termMonths));
  const r = monthlyRate(input.mortgageAPR);
  const pmt = input.monthlyMortgagePayment ?? mortgagePaymentFromTerms(bal, input.mortgageAPR, n);

  if (pmt === 0 && bal > 0) {
      const payoffDateISO = new Date(Date.now() + Infinity).toISOString();
      return { months: Infinity, totalInterest: Infinity, totalMI: Infinity, payoffDateISO, series: [], monthlyPaymentUsed: 0 };
  }

  let totalInterest = 0;
  let totalMI = 0;
  const series: { month: number; balance: number }[] = [];
  let months = 0;

  // MI calc (optional)
  const hasMI = !!(input.homeValue && input.monthlyMI);
  const homeValue = input.homeValue ?? 0;
  const monthlyMI = input.monthlyMI ?? 0;

  for (let m = 1; m <= 480 && bal > 0.01; m++) {
    const interest = bal * r;
    
    if (pmt <= interest && r > 0) {
        const payoffDateISO = new Date(Date.now() + Infinity).toISOString();
        return { months: Infinity, totalInterest: Infinity, totalMI: Infinity, payoffDateISO, series, monthlyPaymentUsed: pmt };
    }

    let principal = Math.min(pmt - interest, bal);
    if (principal < 0) principal = 0;

    // MI until LTV <= 80% (conservative: use original home value)
    let mi = 0;
    if (hasMI && homeValue > 0 && (bal / homeValue) > 0.80) {
      mi = monthlyMI;
    }

    bal = Math.max(0, bal - principal);
    totalInterest += interest;
    totalMI += mi;
    months = m;

    if (m <= 240) series.push({ month: m, balance: bal });
  }

  const payoffDateISO = new Date(Date.now() + months * 30 * 24 * 3600 * 1000).toISOString();
  return { months, totalInterest, totalMI, payoffDateISO, series, monthlyPaymentUsed: pmt };
}

export function simulateChunker(input: ChunkInput): ChunkResult {
  // Start with standard mortgage payment (fixed). Term is a cap; we shorten term by slamming principal.
  let mortgageBal = input.mortgageBalance;
  const rM = monthlyRate(input.mortgageAPR);
  const pmt = input.monthlyMortgagePayment ?? mortgagePaymentFromTerms(mortgageBal, input.mortgageAPR, input.termMonths);

  // Cash-flow
  const income = Math.max(0, input.netIncome);
  const expenses = Math.max(0, input.livingExpenses);
  const surplusBeforeDebt = Math.max(0, income - expenses);

  // HELOC
  const rH = monthlyRate(input.helocAPR);
  let helocBal = 0;
  let helocCredit = Math.max(0, input.availableHelocNow);
  const originalHelocCredit = helocCredit; // Store original limit

  // One-time cash → best use = instant principal reduction
  const onetime = Math.max(0, input.onetimeCashToMortgage || 0);
  if (onetime > 0) mortgageBal = Math.max(0, mortgageBal - onetime);

  const series: { month: number; mortgageBalance: number; helocBalance: number; totalBalance: number }[] = [];
  const warnings: string[] = [];
  let months = 0;
  let totalInterestMortgage = 0;
  let totalInterestHeloc = 0;

  // MI calc (optional)
  const hasMI = !!(input.homeValue && input.monthlyMI);
  const homeValue = input.homeValue ?? 0;
  const monthlyMI = input.monthlyMI ?? 0;
  let totalMI = 0;

  // bill timing factor: how much of surplus actually sits to kill HELOC after interest
  const timingFactor = input.billTiming === "OPTIMIZED" ? 0.9 : 0.5;

  // first draw
  const drawChunk = () => {
    if (mortgageBal <= 0.01) return;
    let desired = 0;
    if (input.chunkMode === "AUTO") {
      desired = Math.max(1000, mortgageBal * 0.25); // ~25% of remaining, min $1k
    } else {
      desired = Math.max(0, input.fixedChunkAmount || 0);
    }
    const C = Math.max(0, Math.min(desired, mortgageBal, helocCredit));
    if (C > 0) {
      helocBal += C;
      mortgageBal -= C;
      helocCredit -= C;
    }
  };

  // take initial chunk
  drawChunk();

  for (let m = 1; m <= 480 && (mortgageBal > 0.01 || helocBal > 0.01); m++) {
    // 1) Mortgage month (fixed pmt)
    let pmtThisMonth = 0;
    if (mortgageBal > 0.01) {
      pmtThisMonth = pmt;
      const mortInterest = mortgageBal * rM;
      let principal = Math.min(pmt - mortInterest, mortgageBal);
      if (principal < 0) principal = 0;

      // MI until LTV <= 80% if provided
      let mi = 0;
      if (hasMI && homeValue > 0 && (mortgageBal / homeValue) > 0.80) {
        mi = monthlyMI;
      }

      mortgageBal = Math.max(0, mortgageBal - principal);
      totalInterestMortgage += mortInterest;
      totalMI += mi;
    }

    // 2) Cash-flow available AFTER mortgage payment + MI (they come out of monthly budget)
    const miThisMonth = (hasMI && homeValue > 0 && (mortgageBal / homeValue) > 0.80) ? monthlyMI : 0;
    const afterMortgageSurplus = Math.max(0, surplusBeforeDebt - (pmtThisMonth + miThisMonth));

    // 3) HELOC month: interest-only first, then surplus*timingFactor goes to principal
    if (helocBal > 0.01) {
      const helocInterest = helocBal * rH;
      totalInterestHeloc += helocInterest;

      const effectiveSurplus = afterMortgageSurplus * timingFactor;
      const principalReduction = Math.max(0, effectiveSurplus - helocInterest);
      
      const newHelocBal = helocBal - principalReduction;

      if (helocInterest >= effectiveSurplus && principalReduction <= 0) {
        warnings.push("Surplus is too small relative to HELOC interest; consider reducing chunk size or expenses.");
      }
      
      if (input.readvanceable) {
        // If we paid down balance, that amount becomes available again
        helocCredit += (helocBal - newHelocBal);
      }
      helocBal = newHelocBal;
    }
    
    // Check if we can draw a new chunk
    if (helocBal <= 0.01 && mortgageBal > 0.01) {
       // HELOC is paid off, so we can draw again if credit is available.
       if (input.readvanceable) {
         // Reset available credit to full, since it's paid off
         helocCredit = originalHelocCredit;
       }
       drawChunk();
    }


    months = m;
    if (m <= 240) {
      series.push({
        month: m,
        mortgageBalance: Math.max(0, mortgageBal),
        helocBalance: Math.max(0, helocBal),
        totalBalance: Math.max(0, mortgageBal + helocBal),
      });
    }
     if(months === 480){
       const payoffDateISO = new Date(Date.now() + Infinity).toISOString();
       return {
         months: Infinity,
         totalInterestCombined: Infinity,
         totalMI: Infinity,
         payoffDateISO,
         series,
         monthlyPaymentUsed: pmt,
         warnings
       };
    }
  }

  const payoffDateISO = new Date(Date.now() + months * 30 * 24 * 3600 * 1000).toISOString();
  return {
    months,
    totalInterestCombined: totalInterestMortgage + totalInterestHeloc,
    totalMI,
    payoffDateISO,
    series,
    monthlyPaymentUsed: pmt,
    warnings
  };
}

    