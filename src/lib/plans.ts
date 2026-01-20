
export type ProductPlan = {
  name: string;
  description: string;
  priceFormatted: string;
  paymentLink: string;
};

// This object maps plan IDs from the URL to your Stripe Payment Links.
// IMPORTANT: Replace the placeholder URLs with your actual Stripe Payment Links.
// You will need to create two new products/links in Stripe:
// 1. A one-time payment product for the $7 book.
// 2. A bundled product that includes the $7 book AND the $1 trial for the $29/month subscription.
export const productPlans: Record<string, ProductPlan> = {
    'book_7': {
        name: 'The Mortgage-Free Manifesto (eBook)',
        description: 'Instant digital access to the 220-page guide.',
        priceFormatted: '$7',
        paymentLink: 'https://buy.stripe.com/test_5kA2aZ1gT5qmb4Y6ou', // <-- REPLACE
    },
    'book_7_plus_trial': {
        name: 'eBook + Calculator Toolkit Trial',
        description: 'The eBook plus a 3-day trial of our premium calculator.',
        priceFormatted: '$8', // $7 for book + $1 for trial
        paymentLink: 'https://buy.stripe.com/test_eVa3f36BXaGSb4YfZ2', // <-- REPLACE
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
        paymentLink: 'https://buy.stripe.com/8x27sM6yodDLbUOc2000002',
    },
     'basic_39_monthly': {
        name: 'Mortgage Cutter Basic',
        description: 'The essential toolkit to get started on a monthly plan.',
        priceFormatted: '$39/month',
        paymentLink: 'https://buy.stripe.com/7sYaEY5ukarzgb45DC00005',
    },
};
