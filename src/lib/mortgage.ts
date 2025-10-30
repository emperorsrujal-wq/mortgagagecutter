
import type { Inputs, Outputs } from './mortgage-types';
import { pmt, splitMortgagePayment } from './amort';

function runBaselineSimulation(inputs: Inputs, mortPaymentMonthly: number) {
  let month = 0;
  let totalInterest = 0;
  const maxMonths = 480;

  // Clone debts to avoid modifying the original input
  let debts = [
    { id: 'mortgage', balance: inputs.mortgageBalance, rate: inputs.mortgageRateAPR, payment: mortPaymentMonthly },
    ...inputs.debts.map(d => ({ id: d.id, balance: d.balance, rate: d.rateAPR, payment: d.paymentMonthly }))
  ].filter(d => d.balance > 0);

  const series: number[] = [];
  let totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  series.push(totalBalance);

  while (totalBalance > 0 && month < maxMonths) {
    month++;
    let interestForMonth = 0;
    let totalPaymentsForMonth = 0;

    // Sort debts by highest rate for the snowball strategy
    debts.sort((a, b) => b.rate - a.rate);

    let snowballAmount = 0;
    const nextDebts = [];

    for (const debt of debts) {
      const monthlyInterest = debt.balance * (debt.rate / 12 / 100);
      interestForMonth += monthlyInterest;
      totalPaymentsForMonth += debt.payment;

      const principalPaid = debt.payment - monthlyInterest;
      debt.balance -= principalPaid;

      if (debt.balance <= 0) {
        snowballAmount += debt.payment + debt.balance; // Add full payment + overpayment to snowball
      } else {
        nextDebts.push(debt);
      }
    }

    // Apply snowball to the highest-rate remaining debt
    if (snowballAmount > 0 && nextDebts.length > 0) {
      nextDebts.sort((a, b) => b.rate - a.rate);
      nextDebts[0].balance -= snowballAmount;

      // Handle case where snowball pays off the debt
      if (nextDebts[0].balance <= 0) {
          const remainingSnowball = Math.abs(nextDebts[0].balance);
          const paidOffDebt = nextDebts.shift();
          if (paidOffDebt) {
            snowballAmount = remainingSnowball + paidOffDebt.payment;
            // Recursively apply remaining snowball if there are still debts
            let i = 0;
            while(snowballAmount > 0 && i < nextDebts.length) {
                const nextDebt = nextDebts[i];
                const amountToApply = Math.min(snowballAmount, nextDebt.balance);
                nextDebt.balance -= amountToApply;
                snowballAmount -= amountToApply;
                if (nextDebt.balance <= 0) {
                    const paidOff = nextDebts.splice(i, 1)[0];
                    snowballAmount += paidOff.payment;
                } else {
                    i++;
                }
            }
          }
      }
    }
    
    debts = nextDebts;
    totalInterest += interestForMonth;
    totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
    series.push(Math.max(0, totalBalance));
  }

  return {
    months: month >= maxMonths ? Infinity : month,
    interest: totalInterest,
    series,
  };
}


export function estimate(inputs: Inputs): Outputs {
  const ltv = inputs.ltvLimit ?? 0.8;
  const offsetFactor = inputs.cardOffset ? 0.95 : 0.65;

  // --- 1. Baseline Simulation (Corrected Debt Snowball) ---
  const mortPaymentMonthly = pmt(inputs.mortgageRateAPR, inputs.amortYearsRemaining * 12, inputs.mortgageBalance);
  const baseline = runBaselineSimulation(inputs, mortPaymentMonthly);
  const baseMonths = baseline.months;
  const baseInterest = baseline.interest;

  // --- 2. HELOC Simulation ---
  const movedSavings = inputs.savings.savings + inputs.savings.chequing + inputs.savings.shortTerm;
  const totalDebtConsolidated = inputs.mortgageBalance + inputs.debts.reduce((s, d) => s + d.balance, 0);

  let helocBalance = Math.max(0, totalDebtConsolidated - movedSavings);
  const helocI = inputs.helocRateAPR / 12 / 100;
  const surplus = Math.max(0, inputs.netMonthlyIncome - inputs.monthlyExpenses);

  let hMonths = 0;
  let hInterest = 0;
  const helocSeriesData: number[] = [helocBalance];

  if (helocBalance > 0) {
    while (helocBalance > 0 && hMonths < 480) {
      hMonths++;
      const interestM = helocBalance * helocI;
      
      if (surplus <= interestM && helocI > 0) {
        hMonths = Infinity;
        hInterest = Infinity;
        break;
      }
      
      hInterest += interestM;
      // The effective paydown is the surplus *after* servicing the HELOC interest
      const principalPaydown = surplus - interestM; 
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
  const borrowingRoomAfterSetup = Math.max(0, creditLimit - totalDebtConsolidated);
  
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
