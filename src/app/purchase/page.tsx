
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://mortgagecutter.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Purchase',
    },
  ],
};

type ProductPlan = {
  name: string;
  description: string;
  priceFormatted: string;
  paymentLink: string;
};

const productPlans: Record<string, ProductPlan> = {
    'pro_297': {
        name: 'Mortgage Cutter Pro',
        description: 'Lifetime access to the complete Mortgage Cutter toolkit and guides.',
        priceFormatted: '$297',
        paymentLink: 'https://buy.stripe.com/YOUR_PRO_297_LINK', // Replace with your actual link
    },
    'pro_197': {
        name: 'Mortgage Cutter Pro (Discounted)',
        description: 'Lifetime access to the complete Mortgage Cutter toolkit and guides.',
        priceFormatted: '$197',
        paymentLink: 'https://buy.stripe.com/YOUR_PRO_197_LINK', // Replace with your actual link
    },
    'elite_997': {
        name: 'Mortgage Cutter Elite',
        description: 'Complete toolkit plus 1-on-1 onboarding and advanced strategies.',
        priceFormatted: '$997',
        paymentLink: 'https://buy.stripe.com/YOUR_ELITE_997_LINK', // Replace with your actual link
    },
     'basic_39_monthly': {
        name: 'Mortgage Cutter Basic',
        description: 'The essential toolkit to get started on a monthly plan.',
        priceFormatted: '$39/month',
        paymentLink: 'https://buy.stripe.com/YOUR_BASIC_39_LINK', // Replace with your actual link
    },
};


function PurchaseForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro_297';
  const product = productPlans[plan] || productPlans['pro_297'];

   if (!product.paymentLink.includes('stripe.com/')) {
     return (
        <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
                The payment link for this plan is not configured. Please contact support.
            </AlertDescription>
        </Alert>
     )
   }

  return (
    <Card className="max-w-lg mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">
          {product.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-center text-muted-foreground">
          You will be redirected to our secure payment partner, Stripe, to complete your purchase.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild size="lg" className="w-full">
          <Link href={product.paymentLink}>
            <Lock className="mr-2 h-4 w-4" />
            Get Instant Access for {product.priceFormatted}
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          100% Secure Payment. Instant Access.
        </p>
      </CardFooter>
    </Card>
  );
}

export default function PurchasePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto py-12 px-4">
        <Suspense fallback={<div>Loading...</div>}>
            <PurchaseForm />
        </Suspense>
      </div>
    </>
  );
}
