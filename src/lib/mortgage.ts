export function calculateTraditionalMortgage(
  balance: number,
  annualRate: number,
  monthlyPayment: number
) {
  if (balance <= 0)
    return { remainingYears: 0, totalInterest: 0, amortization: [] };

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

    if (currentBalance < monthlyPayment) {
      principalPaid = currentBalance + interestForMonth;
      currentBalance = 0;
    } else {
      currentBalance -= principalPaid;
    }

    months++;
    if (months % 12 === 0 || currentBalance <= 0) {
      amortization.push({ month: months, balance: Math.max(0, currentBalance) });
    }
    

    if (months > 40 * 12) break;
  }

  return { remainingYears: months / 12, totalInterest, amortization };
}
