
import type { Inputs, Outputs, Debt } from './mortgage-types';

export function estimate(inputs: Inputs): Outputs {
  const ltv = inputs.ltvLimit ?? 0.8;
  const offsetFactor = inputs.cardOffset ? 0.8 : 1.0;

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
    series: { month: number; balance: number }[] = []
  ) {
    const i = rateAPR / 12 / 100;
    let months = 0;
    let interest = 0;
    let currentBalance = balance;

    while (currentBalance > 0 && months < 2000) {
      const interestM = currentBalance * i;
      if (payMonthly <= interestM && i > 0) {
        // Payment doesn't cover interest, loan will never be paid off
        months = Infinity;
        interest = Infinity;
        break;
      }
      const principal = Math.max(0, payMonthly - interestM);
      interest += interestM;
      currentBalance = Math.max(0, currentBalance - principal);
      months++;
      const seriesEntry = series.find((s) => s.month === months);
      if (seriesEntry) {
        seriesEntry.balance += currentBalance;
      } else {
        series.push({ month: months, balance: currentBalance });
      }
    }
    return { months, interest, series };
  }

  let baseInterest = 0;
  let baseMonths = 0;
  let baselineSeries: { month: number; balance: number }[] = [];

  // Amortize mortgage
  if (inputs.mortgageBalance > 0 && mortPaymentMonthly > 0) {
    const mort = amortize(
      inputs.mortgageBalance,
      inputs.mortgageRateAPR,
      mortPaymentMonthly,
      baselineSeries
    );
    baseInterest += mort.interest;
    baseMonths = Math.max(baseMonths, mort.months);
  } else if (inputs.mortgageBalance > 0) {
    // If no payment, treat as interest-only for baseline purposes
    baseMonths = Infinity;
    baseInterest = Infinity;
  }

  // Amortize other debts
  for (const d of inputs.debts) {
    if (d.balance > 0) {
      const minCC = 0.02 * d.balance;
      const iOnly = (d.rateAPR / 12 / 100) * d.balance + 10;
      const pay =
        d.paymentMonthly > 0
          ? d.paymentMonthly
          : d.kind === 'cc'
          ? Math.max(minCC, iOnly)
          : Math.max(0, iOnly);

      if (pay > 0) {
        const res = amortize(d.balance, d.rateAPR, pay, baselineSeries);
        baseInterest += res.interest;
        baseMonths = Math.max(baseMonths, res.months);
      } else {
        baseMonths = Infinity;
        baseInterest = Infinity;
      }
    }
  }
  
  if (baseMonths === Infinity) {
    baseInterest = Infinity;
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
    const interestM = helocBalance * helocI * offsetFactor;
     if (surplus <= interestM && helocI > 0) {
        hMonths = Infinity;
        hInterest = Infinity;
        break;
    }
    const principal = Math.max(0, surplus - interestM);
    hInterest += interestM;
    helocBalance = Math.max(0, helocBalance - principal);
    hMonths++;
    
    // find corresponding baseline balance
    let baselineBalanceForMonth = 0;
    const basePoint = baselineSeries.find(p => p.month === hMonths);
    if(basePoint) {
      baselineBalanceForMonth = basePoint.balance;
    } else if (hMonths > baseMonths && baseMonths !== Infinity) {
      baselineBalanceForMonth = 0;
    } else if (baseMonths === Infinity) {
      // Estimate baseline balance if it's never paid off
      let estimatedBase = totalDebtConsolidated;
      for (let m = 1; m <= hMonths; m++) {
        let payment = mortPaymentMonthly;
        inputs.debts.forEach(d => {
            const minCC = 0.02 * d.balance;
            const iOnly = (d.rateAPR / 12 / 100) * d.balance + 10;
            payment += d.paymentMonthly > 0 ? d.paymentMonthly : (d.kind === 'cc' ? Math.max(minCC, iOnly) : Math.max(0, iOnly));
        });
        const interest = estimatedBase * (inputs.mortgageRateAPR / 12 / 100); // simplified
        estimatedBase -= (payment - interest);
      }
      baselineBalanceForMonth = estimatedBase;
    }


    helocSeries.push({ month: hMonths, balanceHeloc: helocBalance, balanceBaseline: baselineBalanceForMonth });
  }

  // Ensure baseline series extends to HELOC payoff month
  if (baseMonths < hMonths && baseMonths !== Infinity) {
      for (let m = baseMonths + 1; m <= hMonths; m++) {
          const point = helocSeries.find(p => p.month === m);
          if (point && point.balanceBaseline === undefined) {
              point.balanceBaseline = 0;
          }
      }
  }


  // 4) Borrowing room
  const creditLimit = ltv * inputs.homeValue;
  const borrowingRoomAfterSetup = Math.max(0, creditLimit - totalDebtConsolidated);

  return {
    debtFreeMonthsBaseline: baseMonths,
    interestBaseline: Math.round(baseInterest),
    debtFreeMonthsHeloc: hMonths,
    interestHeloc: Math.round(hInterest),
    interestSaved:
      baseInterest === Infinity || hInterest === Infinity
        ? Infinity
        : Math.max(0, Math.round(baseInterest - hInterest)),
    borrowingRoomAfterSetup: Math.round(borrowingRoomAfterSetup),
    series: helocSeries,
  };
}
