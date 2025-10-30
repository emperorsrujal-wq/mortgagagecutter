
export type Debt = {
  id: string;
  balance: number;
  rateAPR: number;
  paymentMonthly: number;
  kind: 'cc' | 'car' | 'loc' | 'other';
};

export type Inputs = {
  homeValue: number;
  ltvLimit?: number;
  mortgageBalance: number;
  mortgageRateAPR: number;
  amortYearsRemaining: number;
  helocRateAPR: number; // This was missing and is critical

  debts: Debt[];
  netMonthlyIncome: number;
  monthlyExpenses: number;

  savings: { savings: number; chequing: number; shortTerm: number };
  cardOffset?: boolean;
};

export type Outputs = {
  debtFreeMonthsBaseline: number;
  interestBaseline: number;
  debtFreeMonthsHeloc: number;
  interestHeloc: number;
  interestSaved: number;
  borrowingRoomAfterSetup: number;
  series: { month: number; balanceBaseline: number; balanceHeloc: number }[];
};
