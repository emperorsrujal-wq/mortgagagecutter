
import type { Inputs, Outputs, Debt } from './mortgage-types';

export function estimate(inputs: Inputs): Outputs {
  const ltv = inputs.ltvLimit ?? 0.8;
  const offsetFactor = inputs.cardOffset ? 1.0 : 0.8;

  // 1) Baseline mortgage payment
  const mortPaymentMonthly = (() => {
    const i = inputs.mortgageRateAPR / 12 / 100;
    const n = inputs.amortYearsRemaining * 12;
    const B = inputs.mortgageBalance;
    if (n <= 0 || B <= 0) return 0;
    return i === 0
      ? B / n
      : (B * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);
  })();

  // 2) Baseline amortization (mortgage + other debts)
  function amortize(
    balance: number,
    rateAPR: number,
    payMonthly: number,
  ) {
    const series: { month: number; balance: number }[] = [];
    const i = rateAPR / 12 / 100;
    let months = 0;
    let interest = 0;
    let currentBalance = balance;

    while (currentBalance > 0 && months < 2000) {
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
  
  const debtSchedules: {interest: number, months: number, series: {month: number, balance: number}[]}[] = [];
  
  // Amortize mortgage
  if (inputs.mortgageBalance > 0 && mortPaymentMonthly > 0) {
    const mortSchedule = amortize(inputs.mortgageBalance, inputs.mortgageRateAPR, mortPaymentMonthly);
    debtSchedules.push(mortSchedule);
  } else if (inputs.mortgageBalance > 0) {
     debtSchedules.push({ months: Infinity, interest: Infinity, series: [] });
  }

  // Amortize other debts
  for (const d of inputs.debts) {
    if (d.balance > 0) {
      const iOnly = (d.rateAPR / 12 / 100) * d.balance;
      const minPrincipal = d.balance * 0.01;
      const pay =
        d.paymentMonthly > iOnly + 1
          ? d.paymentMonthly
          : d.kind === 'cc'
          ? Math.max(25, iOnly + minPrincipal)
          : iOnly + 1;

      if (pay > 0 && pay > iOnly) {
        const debtSchedule = amortize(d.balance, d.rateAPR, pay);
        debtSchedules.push(debtSchedule);
      } else {
        debtSchedules.push({ months: Infinity, interest: Infinity, series: [] });
      }
    }
  }
  
  const baseMonths = Math.max(0, ...debtSchedules.map(s => s.months));
  const baseInterest = debtSchedules.reduce((sum, s) => sum + s.interest, 0);

  const baselineSeries: { month: number; balance: number }[] = [];
  for(let m = 1; m <= baseMonths; m++) {
      let totalBalance = 0;
      for(const schedule of debtSchedules) {
          if (m <= schedule.series.length) {
              totalBalance += schedule.series[m-1].balance;
          }
      }
      if (totalBalance > 0) {
        baselineSeries.push({month: m, balance: totalBalance});
      }
  }

  // 3) HELOC simulation
  const movedSavings =
    inputs.savings.savings +
    inputs.savings.chequing +
    inputs.savings.shortTerm;
  const totalDebtConsolidated =
    inputs.mortgageBalance + inputs.debts.reduce((s, d) => s + d.balance, 0);

  let helocBalance = Math.max(0, totalDebtConsolidated - movedSavings);
  const helocI = inputs.helocRateAPR / 12 / 100;
  const surplus = Math.max(0, inputs.netMonthlyIncome - inputs.monthlyExpenses);

  let hMonths = 0;
  let hInterest = 0;
  const helocSeries: Outputs['series'] = [];

  while (helocBalance > 0 && hMonths < 2000) {
    const effectiveSurplus = surplus * offsetFactor;
    const interestM = helocBalance * helocI;
     if (effectiveSurplus <= interestM && helocI > 0) {
        hMonths = Infinity;
        hInterest = Infinity;
        break;
    }
    const principal = Math.max(0, effectiveSurplus - interestM);
    hInterest += interestM;
    helocBalance = Math.max(0, helocBalance - principal);
    hMonths++;
    
    const baselinePoint = baselineSeries.find(p => p.month === hMonths);
    const baselineBalanceForMonth = baselinePoint ? baselinePoint.balance : 0;
    
    helocSeries.push({ month: hMonths, balanceHeloc: helocBalance, balanceBaseline: baselineBalanceForMonth });
  }

  if (baseMonths > hMonths) {
     for (let m = hMonths + 1; m <= baseMonths; m++) {
         const baselinePoint = baselineSeries.find(p => p.month === m);
         const baselineBalanceForMonth = baselinePoint ? baselinePoint.balance : 0;
         if (baselineBalanceForMonth > 0 || helocSeries[helocSeries.length - 1]?.balanceBaseline > 0)
          helocSeries.push({ month: m, balanceHeloc: 0, balanceBaseline: baselineBalanceForMonth });
     }
  }

  // 4) Borrowing room
  const creditLimit = ltv * inputs.homeValue;
  const borrowingRoomAfterSetup = Math.max(0, creditLimit - totalDebtConsolidated);

  const finalBaseInterest = isFinite(baseInterest) ? Math.round(baseInterest) : Infinity;

  return {
    debtFreeMonthsBaseline: baseMonths,
    interestBaseline: finalBaseInterest,
    debtFreeMonthsHeloc: hMonths,
    interestHeloc: Math.round(hInterest),
    interestSaved:
      finalBaseInterest === Infinity || hInterest === Infinity
        ? Infinity
        : Math.max(0, Math.round(finalBaseInterest - hInterest)),
    borrowingRoomAfterSetup: Math.round(borrowingRoomAfterSetup),
    series: helocSeries,
  };
}
