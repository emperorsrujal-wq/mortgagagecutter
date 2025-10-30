
export type Debt = {
  id: string;
  kind: 'cc' | 'car' | 'loc' | 'other';
  balance: number;
  rateAPR: number;
  paymentMonthly: number;
};

export type Inputs = {
  homeValue: number;
  ltvLimit?: number;                 // default 0.80
  mortgageBalance: number;
  mortgageRateAPR: number;
  amortYearsRemaining: number;
  paymentMonthly?: number;
  paymentFrequency?: 'monthly'|'biweekly'|'weekly';

  debts: Debt[];
  netMonthlyIncome: number;
  monthlyExpenses: number;

  savings: { savings: number; chequing: number; shortTerm: number };
  helocRateAPR: number;
  cardOffset?: boolean;              // default false
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
