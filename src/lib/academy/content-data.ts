
export type CountrySpecificInfo = {
  name: string;
  currencySymbol: string;
  currencyCode: string;
  majorBanks: string[];
  majorInsurers: string[];
  stockExchanges: string[];
  centralBank: string;
  rates: {
    prime: string;
    mortgage: string;
    savings: string;
  };
  retirementAccounts: string[];
  taxAgency: string;
  regulator: string;
  insuranceRegulator: string;
  protection: string;
  cities: string[];
  programs: string[];
  nationalDebt: string;
};

export const countryContentMap: Record<string, CountrySpecificInfo> = {
  'Canada': {
    name: 'Canada',
    currencySymbol: '$',
    currencyCode: 'CAD',
    majorBanks: ['RBC (Royal Bank)', 'TD Canada Trust', 'Scotiabank', 'BMO', 'CIBC'],
    majorInsurers: ['Manulife', 'Sun Life', 'Intact Financial', 'Desjardins Insurance', 'Great-West Life'],
    stockExchanges: ['Toronto Stock Exchange (TSX)', 'TSX Venture Exchange'],
    centralBank: 'Bank of Canada (BoC)',
    rates: { prime: '7.20%', mortgage: '5.49%', savings: '1.75%' },
    retirementAccounts: ['RRSP', 'TFSA', 'FHSA', 'RESP'],
    taxAgency: 'CRA (Canada Revenue Agency)',
    regulator: 'OSFI (Office of the Superintendent of Financial Institutions)',
    insuranceRegulator: 'Provincial Insurance Regulators (e.g., FSRA in Ontario)',
    protection: 'CDIC (Canada Deposit Insurance Corporation)',
    cities: ['Toronto', 'Vancouver', 'Calgary', 'Montreal'],
    programs: ['CPP', 'OAS', 'GST Rebates'],
    nationalDebt: '$1.2 Trillion',
  },
  'USA': {
    name: 'USA',
    currencySymbol: '$',
    currencyCode: 'USD',
    majorBanks: ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'U.S. Bank'],
    majorInsurers: ['State Farm', 'Geico', 'Progressive', 'Allstate', 'Liberty Mutual'],
    stockExchanges: ['New York Stock Exchange (NYSE)', 'NASDAQ'],
    centralBank: 'The Federal Reserve (The Fed)',
    rates: { prime: '8.50%', mortgage: '6.80%', savings: '4.25%' },
    retirementAccounts: ['401(k)', 'Roth IRA', 'Traditional IRA', 'HSA'],
    taxAgency: 'IRS (Internal Revenue Service)',
    regulator: 'SEC and Federal Reserve Board',
    insuranceRegulator: 'State Insurance Commissions',
    protection: 'FDIC (Federal Deposit Insurance Corporation)',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
    programs: ['Social Security', 'Medicare', 'Earned Income Tax Credit'],
    nationalDebt: '$34 Trillion',
  },
  'UK': {
    name: 'UK',
    currencySymbol: '£',
    currencyCode: 'GBP',
    majorBanks: ['HSBC', 'Barclays', 'Lloyds Bank', 'NatWest', 'Santander UK'],
    majorInsurers: ['Aviva', 'Legal & General', 'Prudential', 'RSA Insurance', 'Direct Line'],
    stockExchanges: ['London Stock Exchange (LSE)'],
    centralBank: 'Bank of England (BoE)',
    rates: { prime: '5.25%', mortgage: '4.95%', savings: '3.50%' },
    retirementAccounts: ['ISA (Individual Savings Account)', 'SIPP', 'Lifetime ISA'],
    taxAgency: 'HMRC (HM Revenue & Customs)',
    regulator: 'FCA (Financial Conduct Authority)',
    insuranceRegulator: 'PRA (Prudential Regulation Authority)',
    protection: 'FSCS (Financial Services Compensation Scheme)',
    cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh'],
    programs: ['State Pension', 'Universal Credit', 'Child Benefit'],
    nationalDebt: '£2.6 Trillion',
  },
  'Australia': {
    name: 'Australia',
    currencySymbol: '$',
    currencyCode: 'AUD',
    majorBanks: ['Commonwealth Bank (CBA)', 'Westpac', 'ANZ', 'NAB'],
    majorInsurers: ['QBE Insurance', 'IAG', 'Suncorp', 'Medibank', 'nib'],
    stockExchanges: ['Australian Securities Exchange (ASX)'],
    centralBank: 'Reserve Bank of Australia (RBA)',
    rates: { prime: '4.35%', mortgage: '6.15%', savings: '4.50%' },
    retirementAccounts: ['Superannuation (Super)', 'SMSF', 'First Home Super Saver'],
    taxAgency: 'ATO (Australian Taxation Office)',
    regulator: 'ASIC (Australian Securities and Investments Commission)',
    insuranceRegulator: 'APRA (Australian Prudential Regulation Authority)',
    protection: 'Financial Claims Scheme (FCS)',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    programs: ['Age Pension', 'Medicare Australia', 'Family Tax Benefit'],
    nationalDebt: '$900 Billion',
  }
};
