
import type { Inputs, Outputs, Debt } from './mortgage-types';

function pmt(rate: number, nper: number, pv: number): number {
  const monthlyRate = rate / 12 / 100;
  if (monthlyRate === 0) {
    return pv / nper;
  }
  return pv * (monthlyRate * Math.pow(1 + monthlyRate, nper)) / (Math.pow(1 + monthlyRate, nper) - 1);
}

// Simulates paying off debts one by one, snowballing payments.
function runBaselineSimulation(inputs: Inputs) {
  const allDebts: (Debt & { name: string, payment: number })[] = [
    {
      id: 'mortgage',
      name: 'Mortgage',
      balance: inputs.mortgageBalance,
      rateAPR: inputs.mortgageRateAPR,
      payment: inputs.paymentMonthly ?? pmt(inputs.mortgageRateAPR, inputs.amortYearsRemaining * 12, inputs.mortgageBalance),
      kind: 'other',
      paymentMonthly: inputs.paymentMonthly ?? pmt(inputs.mortgageRateAPR, inputs.amortYearsRemaining * 12, inputs.mortgageBalance)
    },
    ...(inputs.debts || []).map(d => ({ // Ensure inputs.debts is an array
      ...d,
      name: d.kind,
      payment: d.paymentMonthly,
    }))
  ].filter(d => d.balance > 0);

  let month = 0;
  let totalInterestPaid = 0;
  let freedUpPayments = 0;
  const maxMonths = 480; // 40 years cap
  
  const series: number[] = [allDebts.reduce((sum, d) => sum + d.balance, 0)];

  while (allDebts.length > 0 && month < maxMonths) {
    month++;
    
    // Sort debts by highest rate for snowball target
    allDebts.sort((a, b) => b.rateAPR - a.rateAPR);

    // Apply any freed-up payments from last month to the highest-interest debt
    if (freedUpPayments > 0 && allDebts.length > 0) {
      allDebts[0].balance -= freedUpPayments;
    }

    let interestForMonth = 0;
    const nextMonthDebts: typeof allDebts = [];
    freedUpPayments = 0;

    for (const debt of allDebts) {
      if (debt.balance <= 0) {
        freedUpPayments += debt.payment;
        continue;
      }
      
      const monthlyRate = debt.rateAPR / 12 / 100;
      const interestThisMonth = debt.balance * monthlyRate;
      totalInterestPaid += interestThisMonth;
      interestForMonth += interestThisMonth;

      const principalPaid = debt.payment - interestThisMonth;
      debt.balance -= principalPaid;
      
      if (debt.balance <= 0) {
        freedUpPayments += debt.payment; // This payment is now free
      } else {
        nextMonthDebts.push(debt);
      }
    }
    allDebts.splice(0, allDebts.length, ...nextMonthDebts);
    series.push(allDebts.reduce((sum, d) => sum + d.balance, 0));
  }

  return {
    months: month >= maxMonths ? Infinity : month,
    interest: totalInterestPaid,
    series,
  };
}


export function estimate(inputs: Inputs): Outputs {
  const ltv = inputs.ltvLimit ?? 0.8;
  const offsetFactor = inputs.cardOffset ? 0.95 : 0.65;

  // --- 1. Baseline Simulation (Corrected Debt Snowball) ---
  const baseline = runBaselineSimulation(inputs);
  const baseMonths = baseline.months;
  const baseInterest = baseline.interest;
  
  // --- 2. HELOC Simulation ---
  const movedSavings = inputs.savings.savings + inputs.savings.chequing + inputs.savings.shortTerm;
  const totalDebtConsolidated = inputs.mortgageBalance + (inputs.debts || []).reduce((s, d) => s + d.balance, 0);

  let helocBalance = Math.max(0, totalDebtConsolidated - movedSavings);
  const helocI = inputs.helocRateAPR / 12 / 100;
  const totalPayments = (inputs.paymentMonthly ?? pmt(inputs.mortgageRateAPR, inputs.amortYearsRemaining * 12, inputs.mortgageBalance)) + (inputs.debts || []).reduce((sum, d) => sum + d.paymentMonthly, 0);
  const surplus = Math.max(0, inputs.netMonthlyIncome - inputs.monthlyExpenses - totalPayments);

  let hMonths = 0;
  let hInterest = 0;
  const helocSeriesData: number[] = [helocBalance];

  if (helocBalance > 0) {
    while (helocBalance > 0 && hMonths < 480) {
      hMonths++;
      const interestM = helocBalance * helocI;
      
      // Use total cash flow (original payments + surplus) to pay down HELOC
      const paydownAmount = totalPayments + surplus;

      if (paydownAmount <= interestM && helocI > 0) {
        hMonths = Infinity;
        hInterest = Infinity;
        break;
      }
      
      hInterest += interestM;
      const principalPaydown = paydownAmount - interestM; 
      helocBalance -= principalPaydown;

      helocSeriesData.push(Math.max(0, helocBalance));
    }
  }

  // --- 3. Combine series for charting ---
  const finalMonths = Math.max(baseline.series.length, helocSeriesData.length);
  const series: Outputs['series'] = [];
  for (let i = 0; i < finalMonths; i++) {
    series.push({
      month: i,
      balanceBaseline: baseline.series[i] ?? (baseMonths === Infinity ? totalDebtConsolidated : 0),
      balanceHeloc: helocSeriesData[i] ?? (hMonths === Infinity ? totalDebtConsolidated : 0),
    });
  }

  // --- 4. Final calculations ---
  const creditLimit = ltv * inputs.homeValue;
  const borrowingRoomAfterSetup = Math.max(0, creditLimit - (totalDebtConsolidated - movedSavings));
  
  const finalBaseInterest = isFinite(baseInterest) ? Math.round(baseInterest) : Infinity;
  const finalHelocInterest = isFinite(hInterest) ? Math.round(hInterest) : Infinity;
  const interestSaved = finalBaseInterest === Infinity || finalHelocInterest === Infinity
    ? Infinity
    : Math.round(finalBaseInterest - finalHelocInterest);

  return {
    debtFreeMonthsBaseline: baseMonths,
    interestBaseline: finalBaseInterest,
    debtFreeMonthsHeloc: hMonths,
    interestHeloc: finalHelocInterest,
    interestSaved: Math.max(0, interestSaved),
    borrowingRoomAfterSetup: Math.round(borrowingRoomAfterSetup),
    series,
  };
}
