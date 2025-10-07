'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://mortgagecutter.com'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Purchase'
    }
  ]
};


export default function PurchasePage() {
  const router = useRouter();

  const handlePurchase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/method-access');
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
        <form onSubmit={handlePurchase}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="**** **** **** ****"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
            </div>
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
