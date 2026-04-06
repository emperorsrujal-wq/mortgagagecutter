
export interface CountryConfig {
  flag: string;
  name: string;
  currency: string;
  symbol: string;
  productName: string;
  productShort: string;
  avgHome: number;
  avgRate: number;
  avgIncome: number;
  amortYears: number;
  maxLTV: string;
  regulatedBy: string;
  howItWorks: string;
  products: { name: string; desc: string }[];
  banks: string[];
  taxRule: string;
  stressTest: string;
  uniqueInfo: string;
  analogy: string;
}

export const countries: Record<string, CountryConfig> = {
  CA: {
    flag: "🇨🇦",
    name: "Canada",
    currency: "CAD",
    symbol: "$",
    productName: "HELOC (Home Equity Line of Credit)",
    productShort: "HELOC",
    avgHome: 680000,
    avgRate: 5.95,
    avgIncome: 7200,
    amortYears: 25,
    maxLTV: "65% standalone HELOC, up to 80% combined with readvanceable mortgage",
    regulatedBy: "OSFI and provincial regulators",
    howItWorks: "In Canada, a HELOC lets you borrow against your home equity through a revolving credit line. You can deposit your paycheque directly into it, pay bills from it, and withdraw anytime — like a chequing account secured by your home. Interest is calculated daily on whatever balance you carry. Many Canadian banks offer 'readvanceable mortgages' that combine a mortgage with a HELOC. As you pay down the mortgage portion, the HELOC limit automatically increases, giving you access to more equity without reapplying.",
    products: [
      { name: "Scotiabank STEP", desc: "Scotia Total Equity Plan — readvanceable mortgage + HELOC combined. As mortgage portion shrinks, your HELOC credit limit grows automatically." },
      { name: "TD FlexLine", desc: "TD's readvanceable mortgage. Combines fixed-rate and variable-rate mortgage segments with a revolving HELOC segment." },
      { name: "BMO ReadiLine", desc: "BMO's readvanceable product combining mortgage with a revolving line of credit under one registration." },
      { name: "Manulife One", desc: "An all-in-one banking product. Your mortgage, chequing, and savings all exist in a single account." },
      { name: "National Bank All-In-One", desc: "Combines your home loan with your day-to-day banking so every dollar works to reduce interest automatically." }
    ],
    banks: ["TD Canada Trust", "RBC Royal Bank", "BMO", "Scotiabank", "CIBC", "National Bank", "Desjardins", "Manulife", "Tangerine", "HSBC Canada"],
    taxRule: "HELOC interest on your primary residence is NOT tax-deductible in Canada. However, borrowing to invest (Smith Manoeuvre) may make interest deductible.",
    stressTest: "Requires qualifying at the higher of: contract rate plus 2%, or 5.25%. Applies to both mortgages and HELOCs.",
    uniqueInfo: "Canadian mortgages renew every 1-5 years, but amortize over 25-30. HELOCs avoid this recurring renegotiation trap.",
    analogy: "Think of a mortgage like a phone contract you must renew every 5 years. A HELOC is like a pay-as-you-go plan where YOU control everything."
  },
  US: {
    flag: "🇺🇸",
    name: "United States",
    currency: "USD",
    symbol: "$",
    productName: "First-Lien HELOC",
    productShort: "HELOC",
    avgHome: 420000,
    avgRate: 6.5,
    avgIncome: 6800,
    amortYears: 30,
    maxLTV: "80-90% typically, some credit unions offer up to 100%",
    regulatedBy: "CFPB, Federal Reserve, OCC",
    howItWorks: "In the US, you need a FIRST-LIEN HELOC to replace your mortgage entirely. It is NOT a second loan on top of your existing mortgage. You deposit your paycheck, pay bills, and every dollar reduces the interest-bearing balance daily. WARNING: Most banks will try to sell you a second-lien HELOC; you must specify you want to REFINANCE into a first-position line.",
    products: [
      { name: "First-Lien HELOC", desc: "Replaces your mortgage entirely. Becomes your ONLY home loan, recorded in first position on the title." },
      { name: "All-in-One Account", desc: "Combines mortgage, checking, and savings into one account. Rare but growing in the US market." }
    ],
    banks: ["Navy Federal Credit Union", "Pentagon Federal Credit Union", "Chase", "US Bank", "TD Bank (US)", "Citizens Bank", "PNC Bank", "Regions Bank", "Fifth Third Bank", "Local Credit Unions"],
    taxRule: "HELOC interest is deductible ONLY if used to 'buy, build, or substantially improve' the home securing the loan.",
    stressTest: "The US uses Debt-to-Income (DTI) ratio. Most lenders require a DTI under 43% for Qualified Mortgages.",
    uniqueInfo: "The US 30-year fixed mortgage locks you into front-loaded interest for decades. HELOCs break this trap by recalculating daily.",
    analogy: "A 30-year mortgage is like a gym membership charging the same monthly fee for 30 years, where 80% goes to the owner's profit for the first 19 years."
  },
  UK: {
    flag: "🇬🇧",
    name: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    productName: "Offset Mortgage",
    productShort: "Offset",
    avgHome: 290000,
    avgRate: 4.8,
    avgIncome: 4200,
    amortYears: 25,
    maxLTV: "75-80% typically for offset products",
    regulatedBy: "FCA (Financial Conduct Authority) under MCOB rules",
    howItWorks: "In the UK, an Offset Mortgage links a separate savings account to your mortgage. The savings balance is SUBTRACTED from your mortgage balance before interest is calculated. You still make normal repayments, but more goes to principal because interest is lower. It's especially powerful for high-rate taxpayers who avoid paying tax on savings interest.",
    products: [
      { name: "Barclays Offset", desc: "Link up to 4 savings and current accounts. Available on fixed and tracker deals." },
      { name: "First Direct Offset", desc: "Popular digital-first offset. known for strong customer service and competitive rates." },
      { name: "Coventry Building Society Offset", desc: "Straightforward terms with the option to overpay up to 10% per year." },
      { name: "Handelsbanken Offset", desc: "Premium product for high-net-worth clients, offering full interest elimination if savings are high enough." },
      { name: "Virgin Money Offset", desc: "Allows linking multiple accounts, some allowing salary deposits for daily benefit." }
    ],
    banks: ["Barclays", "First Direct", "Coventry Building Society", "Handelsbanken", "Virgin Money", "NatWest", "Nationwide", "Santander UK"],
    taxRule: "Offsetting provides a tax-free 'return' equal to your mortgage rate by avoiding income tax on savings interest.",
    stressTest: "Lenders test at their Standard Variable Rate (SVR) plus a buffer, usually 6-8%.",
    uniqueInfo: "UK homeowners remortgage every 2-5 years. An offset mortgage makes the actual rate matter less as savings grow.",
    analogy: "An offset mortgage is like a loyalty card where points (savings) give you a direct discount on your meal (mortgage interest)."
  },
  AU: {
    flag: "🇦🇺",
    name: "Australia",
    currency: "AUD",
    symbol: "$",
    productName: "Offset Account",
    productShort: "Offset",
    avgHome: 950000,
    avgRate: 6.2,
    avgIncome: 8500,
    amortYears: 30,
    maxLTV: "80% without LMI, up to 95% with insurance",
    regulatedBy: "ASIC and APRA",
    howItWorks: "Australia is the global leader in this strategy. An Offset Account is a fully functional everyday transaction account linked to your home loan. The balance sitting in it is subtracted from your loan balance DAILY for interest calculations. Every dollar sitting in the account, even for one day, saves you interest.",
    products: [
      { name: "CBA Wealth Package Offset", desc: "Commonwealth Bank's package allowing up to 10 separate offset accounts linked to one loan." },
      { name: "Westpac Rocket Repay", desc: "100% offset on eligible variable loans, functioning as a complete transaction account." },
      { name: "ANZ Offset Account", desc: "Fully functional transaction account available on owner-occupier and investment loans." },
      { name: "NAB Offset Account", desc: "Full offset on variable loans, allowing multiple accounts to be linked." },
      { name: "Macquarie Bank Offset", desc: "Highly competitive rates with 100% offset and strong digital features." }
    ],
    banks: ["CBA", "Westpac", "ANZ", "NAB", "Macquarie Bank", "ING Australia", "Bankwest", "Suncorp", "Bendigo Bank"],
    taxRule: "Investment loan interest is deductible ('negative gearing'). Offsets are preferred over redraws for investors to protect deductibility.",
    stressTest: "APRA requires testing at the current rate PLUS a 3 percentage point buffer (e.g., 9.2% test rate).",
    uniqueInfo: "Over $327 billion sits in Australian offset accounts. It's completely mainstream, used by one in four mortgage holders.",
    analogy: "Your offset account is a water tank dripping onto your home loan fire. The more water, the smaller the flames (interest) burn each day."
  }
};
