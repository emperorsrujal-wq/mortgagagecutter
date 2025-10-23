
'use client';

import { Suspense, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { createStripeCheckoutSession } from '@/app/actions';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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

const productPlans: Record<string, { name: string; description: string; priceInCents: number }> = {
  'pro_197': {
    name: 'Mortgage Cutter Pro (Discounted)',
    description: 'Lifetime access to the complete Mortgage Cutter toolkit and guides.',
    priceInCents: 19700,
  },
  'pro_297': {
    name: 'Mortgage Cutter Pro',
    description: 'Lifetime access to the complete Mortgage Cutter toolkit and guides.',
    priceInCents: 29700,
  },
  'elite_997': {
    name: 'Mortgage Cutter Elite',
    description: 'All of Pro, plus a private onboarding call and priority support.',
    priceInCents: 99700,
  },
  'default': {
    name: 'Mortgage Cutter Method',
    description: 'Lifetime access to the complete Mortgage Cutter toolkit and guides.',
    priceInCents: 7900,
  },
};

function PurchaseError() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    if (!error) {
        return null;
    }

    return (
        <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>
                Something went wrong. Please try again.
            </AlertDescription>
        </Alert>
    );
}

function PurchaseForm() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'default';
    const product = useMemo(() => {
        return productPlans[plan] || productPlans['default'];
    }, [plan]);

    const priceFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(product.priceInCents / 100);

    return (
        <Card className="max-w-lg mx-auto shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">
                    Secure Your Financial Future
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    {product.description}
                </CardDescription>
            </CardHeader>
            <form action={() => createStripeCheckoutSession(product)}>
                <CardContent>
                    <Suspense fallback={null}>
                        <PurchaseError />
                    </Suspense>
                    <p className="text-sm text-center text-muted-foreground">
                        You will be redirected to our secure payment partner, Stripe, to complete your purchase.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" size="lg" className="w-full">
                        <Lock className="mr-2 h-4 w-4" />
                        Get Instant Access for {priceFormatted}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        100% Secure Payment. Instant Access.
                    </p>
                </CardFooter>
            </form>
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
