'use client';

import { Suspense } from 'react';
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
                {/* <pre className="mt-2 text-xs bg-muted/50 p-2 rounded whitespace-pre-wrap">{decodeURIComponent(error)}</pre> */}
            </AlertDescription>
        </Alert>
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
        <Card className="max-w-lg mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Secure Your Financial Future
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Access the exclusive Mortgage Cutter Method today for just $79.
            </CardDescription>
          </CardHeader>
          <form action={createStripeCheckoutSession}>
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
                Get Instant Access for $79
              </Button>
              <p className="text-xs text-muted-foreground">
                100% Secure Payment. Instant Access.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
