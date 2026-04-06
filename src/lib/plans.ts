
export type ProductPlan = {
  name: string;
  description: string;
  priceFormatted: string;
  paymentLink: string;
};

// This object maps plan IDs from the URL to your Stripe Payment Links.
// These are synced with the live site's production links.
export const productPlans: Record<string, ProductPlan> = {
    'book_37_en': {
        name: 'How to Pay Off Your House in 5 Years',
        description: 'Instant digital access to the complete ebook and toolset.',
        priceFormatted: '$37',
        paymentLink: 'https://buy.stripe.com/5kQ6oIbSI2Z74sm5DC00009',
    },
    'book_37_en_plus_trial': {
        name: 'Ebook + Calculator Toolkit Trial',
        description: 'The eBook plus a 3-day trial of our premium calculator.',
        priceFormatted: '$38', // $37 for book + $1 for trial
        paymentLink: 'https://buy.stripe.com/5kQ6oIbSI2Z74sm5DC00009', // Placeholder for upsell link
    },
    'book_37': {
        name: 'The Mortgage-Free Manifesto (eBook)',
        description: 'Instant digital access to the 220-page guide.',
        priceFormatted: '₹299',
        paymentLink: 'https://buy.stripe.com/eVq6oIcWMdDL9MG7LK00008', // Using Hindi book link
    },
    'book_399': {
        name: 'Loan Killers - India’s Hidden EMI Secret',
        description: 'Instant digital access to the premium eBook.',
        priceFormatted: '₹399',
        paymentLink: 'https://buy.stripe.com/eVq6oIcWMdDL9MG7LK00008',
    },
    'pro_297': {
        name: 'Mortgage Cutter Pro',
        description: 'Lifetime access to the complete Mortgage Cutter toolkit and guides.',
        priceFormatted: '$297',
        paymentLink: 'https://buy.stripe.com/5kQeVe4qg2Z79MG3vu00006', 
    },
    'pro_197': {
        name: 'Mortgage Cutter Pro (Discounted)',
        description: 'Lifetime access to the complete Mortgage Cutter toolkit and guides.',
        priceFormatted: '$197',
        paymentLink: 'https://buy.stripe.com/aFadRabSI43b7Ey3vu00003',
    },
    'elite_997': {
        name: 'Mortgage Cutter Elite',
        description: 'Complete toolkit plus 1-on-1 onboarding and advanced strategies.',
        priceFormatted: '$997',
        paymentLink: 'https://buy.stripe.com/8x27sM6yodLcbUOc2000002',
    },
     'basic_39_monthly': {
        name: 'Mortgage Cutter Basic',
        description: 'The essential toolkit to get started on a monthly plan.',
        priceFormatted: '$39/month',
        paymentLink: 'https://buy.stripe.com/7sYaEY5ukarzgb45DC00005',
    },
};
