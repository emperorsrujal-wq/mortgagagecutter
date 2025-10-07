
type MortgageParams = {
  balance: number;
  annualRate: number;
  monthlyPayment: number;
  method: 'traditional' | 'heloc';
  monthlyIncome?: number;
  monthlyExpenses?: number;
};

export function calculateMortgage({
  balance,
  annualRate,
  monthlyPayment,
  method,
  monthlyIncome = 0,
  monthlyExpenses = 0,
}: MortgageParams) {
  if (balance <= 0) {
    return { remainingYears: 0, totalInterest: 0, amortization: [] };
  }

  if (method === 'traditional') {
    return calculateTraditionalMortgage(balance, annualRate, monthlyPayment);
  } else {
    return calculateHeloc(
      balance,
      annualRate,
      monthlyIncome,
      monthlyExpenses
    );
  }
}

function calculateTraditionalMortgage(
  balance: number,
  annualRate: number,
  monthlyPayment: number
) {
  const monthlyRate = annualRate / 12;
  let currentBalance = balance;
  let totalInterest = 0;
  let months = 0;
  const amortization: { month: number; balance: number }[] = [
    { month: 0, balance: balance },
  ];

  if (monthlyPayment <= balance * monthlyRate) {
    return { remainingYears: 99, totalInterest: 9999999, amortization: [] };
  }

  while (currentBalance > 0) {
    const interestForMonth = currentBalance * monthlyRate;
    totalInterest += interestForMonth;
    let principalPaid = monthlyPayment - interestForMonth;

    currentBalance -= principalPaid;
    
    months++;
    if (months % 12 === 0 || currentBalance <= 0) {
      amortization.push({ month: months, balance: Math.max(0, currentBalance) });
    }

    if (currentBalance <= 0) {
        break;
    }

    if (months > 50 * 12) break; // Safety break
  }

  return { remainingYears: months / 12, totalInterest, amortization };
}

function calculateHeloc(
  balance: number,
  annualRate: number,
  monthlyIncome: number,
  monthlyExpenses: number
) {
  const dailyRate = annualRate / 365;
  let currentBalance = balance;
  let totalInterest = 0;
  let days = 0;
  const amortization: { month: number; balance: number }[] = [
    { month: 0, balance: balance },
  ];
  
  // Assume income is received on the 1st of the month
  // Assume expenses are paid on the last day of the month
  const netMonthlyCashFlow = monthlyIncome - monthlyExpenses;
  
  if (netMonthlyCashFlow <= 0) {
      // If no positive cash flow, it functions like an interest-only loan and will never be paid off.
      // For simplicity, return a very high number to indicate this.
      return { remainingYears: 99, totalInterest: 9999999, amortization: [] };
  }


  while (currentBalance > 0) {
    days++;
    const dayOfMonth = (days -1) % 30 + 1;
    let dailyInterest = currentBalance * dailyRate;

    if(dayOfMonth === 1){
      currentBalance -= monthlyIncome;
    }
    
    if(dayOfMonth === 30){
       currentBalance += monthlyExpenses;
    }

    currentBalance += dailyInterest;
    totalInterest += dailyInterest;
    
    // Record balance monthly for the chart
    if (days % 30 === 0) {
      amortization.push({ month: days / 30, balance: Math.max(0, currentBalance) });
    }
    
    if (currentBalance <= 0) {
        break;
    }

    if (days > 50 * 365) break; // Safety break
  }

  return { remainingYears: days / 365, totalInterest, amortization };
}
