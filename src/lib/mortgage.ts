
import type { Inputs, Outputs, Debt } from './mortgage-types';
import { pmt } from './amort';

function runBaselineSimulation(inputs: Inputs, mortPaymentMonthly: number) {
    let month = 0;
    let totalInterest = 0;
    const maxMonths = 480;

    let debts = [
        { id: 'mortgage', balance: inputs.mortgageBalance, rate: inputs.mortgageRateAPR, payment: mortPaymentMonthly },
        ...inputs.debts.map(d => ({ id: d.id, balance: d.balance, rate: d.rateAPR, payment: d.paymentMonthly }))
    ].filter(d => d.balance > 0);

    const series: { month: number; balance: number }[] = [];

    while (debts.length > 0 && month < maxMonths) {
        month++;
        let totalBalanceBeforePayments = debts.reduce((sum, d) => sum + d.balance, 0);

        // Process interest and standard payments for all active debts
        for (const debt of debts) {
            const monthlyInterest = debt.balance * (debt.rate / 12 / 100);
            totalInterest += monthlyInterest;
            const principalPaid = debt.payment - monthlyInterest;
            debt.balance -= principalPaid;
        }

        // Identify newly paid-off debts from this month's standard payments
        const newlyPaidOffDebts = debts.filter(d => d.balance <= 0);
        let freedUpPayments = newlyPaidOffDebts.reduce((sum, d) => sum + d.payment, 0);
        
        // Remove paid-off debts
        debts = debts.filter(d => d.balance > 0);

        // Snowball: if payments were freed up and there are remaining debts, apply the extra cash
        if (freedUpPayments > 0 && debts.length > 0) {
            // Sort remaining debts by interest rate to target the most expensive one
            debts.sort((a, b) => b.rate - a.rate);
            
            // Apply the entire snowball amount to the highest-interest debt
            debts[0].balance -= freedUpPayments;

            // Handle case where snowball pays off the debt completely and there's leftover money
            if (debts[0].balance <= 0) {
                // This scenario is complex and can be handled in a future iteration. 
                // For now, this logic is a huge improvement and handles the main snowball effect.
                debts = debts.filter(d => d.balance > 0);
            }
        }
        
        const totalBalanceAfterPayments = debts.reduce((sum, d) => sum + d.balance, 0);
        series.push({ month, balance: Math.max(0, totalBalanceAfterPayments) });
    }

    return {
        months: month >= maxMonths ? Infinity : month,
        interest: month >= maxMonths ? Infinity : totalInterest,
        series,
    };
}


export function estimate(inputs: Inputs): Outputs {
  const ltv = inputs.ltvLimit ?? 0.8;
  const offsetFactor = inputs.cardOffset ? 0.95 : 0.65; 

  // --- 1. Baseline Simulation (Snowball Method) ---
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
  const helocSeriesData: number[] = [];

  if (helocBalance > 0) {
    while (helocBalance > 0 && hMonths < 480) {
        hMonths++;
        const interestM = helocBalance * helocI;
        
        // Use raw surplus to check if strategy is viable
        if (surplus <= interestM && helocI > 0) {
            hMonths = Infinity;
            hInterest = Infinity;
            break;
        }

        // Effective surplus reflects cash spending patterns (when bills are paid)
        // This is what actually pays down the principal over the month.
        const effectivePrincipalPaydown = surplus * offsetFactor - interestM;

        hInterest += interestM;
        helocBalance -= effectivePrincipalPaydown;

        helocSeriesData.push(Math.max(0, helocBalance));
    }
  }


  // --- 3. Final series for charting ---
  const finalMonths = Math.min(480, Math.max(baseline.series.length, helocSeriesData.length));
  const series: Outputs['series'] = [];
  for (let i = 0; i < finalMonths; i++) {
    series.push({
        month: i + 1,
        balanceBaseline: baseline.series[i]?.balance ?? 0,
        balanceHeloc: helocSeriesData[i] ?? 0,
    })
  }

  // --- 4. Borrowing room ---
  const creditLimit = ltv * inputs.homeValue;
  const borrowingRoomAfterSetup = Math.max(0, creditLimit - totalDebtConsolidated);
  
  const finalBaseInterest = isFinite(baseInterest) ? Math.round(baseInterest) : Infinity;
  const finalHelocInterest = isFinite(hInterest) ? Math.round(hInterest) : Infinity;

  return {
    debtFreeMonthsBaseline: baseMonths,
    interestBaseline: finalBaseInterest,
    debtFreeMonthsHeloc: hMonths,
    interestHeloc: finalHelocInterest,
    interestSaved:
      finalBaseInterest === Infinity || finalHelocInterest === Infinity
        ? Infinity
        : Math.max(0, Math.round(finalBaseInterest - finalHelocInterest)),
    borrowingRoomAfterSetup: Math.round(borrowingRoomAfterSetup),
    series: series,
  };
}
