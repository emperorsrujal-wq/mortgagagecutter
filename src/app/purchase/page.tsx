
'use client';

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
import Link from 'next/link';

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

const PAYMENT_LINK = 'https://buy.stripe.com/test_9B6bJ33Jd4FFeAfdbVfUQ00';

function PurchaseForm() {
    const product = {
        name: 'Mortgage Cutter Method',
        description: 'Lifetime access to the complete Mortgage Cutter toolkit and guides.',
        priceFormatted: '$79'
    };

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
            <CardContent>
                <p className="text-sm text-center text-muted-foreground">
                    You will be redirected to our secure payment partner, Stripe, to complete your purchase.
                </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full">
                  <Link href={PAYMENT_LINK}>
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
        <PurchaseForm />
      </div>
    </>
  );
}
