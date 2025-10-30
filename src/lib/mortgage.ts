
import type { Inputs, Outputs, Debt } from './mortgage-types';
import { pmt } from './amort';

function amortize(balance: number, rateAPR: number, payMonthly: number, maxMonths: number = 480) {
  const series: { month: number; balance: number }[] = [];
  const i = rateAPR / 12 / 100;
  let months = 0;
  let interest = 0;
  let currentBalance = balance;

  while (currentBalance > 0 && months < maxMonths) {
    const interestM = currentBalance * i;
    if (payMonthly <= interestM && i > 0) {
      return { months: Infinity, interest: Infinity, series: [] };
    }
    const principal = Math.max(0, payMonthly - interestM);
    interest += interestM;
    currentBalance = Math.max(0, currentBalance - principal);
    months++;
    series.push({ month: months, balance: currentBalance });
  }
  return { months, interest, series };
}


export function estimate(inputs: Inputs): Outputs {
  const ltv = inputs.ltvLimit ?? 0.8;
  const offsetFactor = inputs.cardOffset ? 0.95 : 0.65; // Time cash spends against HELOC.

  // 1) Baseline amortization (mortgage + other debts)
  const debtSchedules: {interest: number, months: number, series: {month: number, balance: number}[]}[] = [];
  
  const mortPaymentMonthly = pmt(inputs.mortgageRateAPR, inputs.amortYearsRemaining * 12, inputs.mortgageBalance);

  if (inputs.mortgageBalance > 0) {
    debtSchedules.push(amortize(inputs.mortgageBalance, inputs.mortgageRateAPR, mortPaymentMonthly));
  }

  for (const d of inputs.debts) {
    if (d.balance > 0) {
      const iOnly = (d.rateAPR / 12 / 100) * d.balance;
      const pay = d.paymentMonthly > iOnly + 1 ? d.paymentMonthly : (iOnly + (d.balance * 0.01)); // Ensure some principal is paid
      debtSchedules.push(amortize(d.balance, d.rateAPR, pay));
    }
  }
  
  const baseMonths = Math.max(0, ...debtSchedules.map(s => s.months));
  const baseInterest = debtSchedules.reduce((sum, s) => sum + (isFinite(s.interest) ? s.interest : 0), 0);

  const baselineSeries: number[] = Array(baseMonths).fill(0);
  for(let m = 1; m <= baseMonths; m++) {
      let totalBalance = 0;
      for(const schedule of debtSchedules) {
          const point = schedule.series[m-1];
          if (point) totalBalance += point.balance;
      }
      baselineSeries[m-1] = totalBalance;
  }

  // 2) HELOC simulation
  const movedSavings = inputs.savings.savings + inputs.savings.chequing + inputs.savings.shortTerm;
  const totalDebtConsolidated = inputs.mortgageBalance + inputs.debts.reduce((s, d) => s + d.balance, 0);

  let helocBalance = Math.max(0, totalDebtConsolidated - movedSavings);
  const helocI = inputs.helocRateAPR / 12 / 100;
  const surplus = Math.max(0, inputs.netMonthlyIncome - inputs.monthlyExpenses);

  let hMonths = 0;
  let hInterest = 0;
  const helocSeries: number[] = [];

  while (helocBalance > 0 && hMonths < 480) {
    const effectiveSurplus = surplus * offsetFactor;
    const interestM = helocBalance * helocI;
     if (surplus <= interestM && helocI > 0) { // Check against raw surplus
        hMonths = Infinity;
        hInterest = Infinity;
        break;
    }
    const principalPaydown = Math.max(0, effectiveSurplus - interestM);
    hInterest += interestM;
    helocBalance = Math.max(0, helocBalance - principalPaydown);
    hMonths++;
    helocSeries.push(helocBalance);
  }

  // 3) Final series for charting
  const finalMonths = Math.max(baselineSeries.length, helocSeries.length);
  const series: Outputs['series'] = [];
  for (let i = 0; i < finalMonths; i++) {
    if (i > 480) break; // Limit chart data
    series.push({
        month: i + 1,
        balanceBaseline: baselineSeries[i] ?? 0,
        balanceHeloc: helocSeries[i] ?? 0,
    })
  }

  // 4) Borrowing room
  const creditLimit = ltv * inputs.homeValue;
  const borrowingRoomAfterSetup = Math.max(0, creditLimit - totalDebtConsolidated);
  
  const finalBaseInterest = isFinite(baseInterest) ? Math.round(baseInterest) : Infinity;

  return {
    debtFreeMonthsBaseline: isFinite(baseMonths) ? baseMonths : Infinity,
    interestBaseline: finalBaseInterest,
    debtFreeMonthsHeloc: hMonths,
    interestHeloc: isFinite(hInterest) ? Math.round(hInterest) : Infinity,
    interestSaved:
      finalBaseInterest === Infinity || hInterest === Infinity
        ? Infinity
        : Math.max(0, Math.round(finalBaseInterest - hInterest)),
    borrowingRoomAfterSetup: Math.round(borrowingRoomAfterSetup),
    series: series,
  };
}
