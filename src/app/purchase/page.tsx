
'use client';

import { Suspense, useState } from 'react';
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
import { Lock, AlertCircle, ShoppingCart, Gem } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { productPlans, ProductPlan } from '@/lib/plans';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';


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
      'name': 'Purchase',
    },
  ],
};

function PurchaseForm() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'book_37_en';
  
  const [addUpsell, setAddUpsell] = useState(false);

  // Determine the correct plan and payment link based on the order bump
  const isBookPurchase = planId === 'book_37_en';
  const finalPlanId = isBookPurchase && addUpsell ? 'book_37_en_plus_trial' : planId;
  const product = productPlans[finalPlanId as keyof typeof productPlans] || productPlans['pro_297'];
  const baseProduct = productPlans[planId as keyof typeof productPlans] || productPlans['pro_297'];

   if (!product.paymentLink || !product.paymentLink.includes('stripe.com/')) {
     return (
        <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
                The payment link for this plan is not configured. Please replace the placeholder link in `src/lib/plans.ts` with a valid Stripe Payment Link.
            </AlertDescription>
        </Alert>
     )
   }

  return (
    <Card className="max-w-lg mx-auto shadow-2xl border">
      <CardHeader className="text-center pb-4">
        <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground" />
        <CardTitle className="text-2xl font-bold mt-2">
          Your Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-secondary/50 rounded-lg border">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold">{baseProduct.name}</p>
                    <p className="text-sm text-muted-foreground">{baseProduct.description}</p>
                </div>
                <p className="font-bold text-lg">{baseProduct.priceFormatted}</p>
            </div>

            {addUpsell && (
                 <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed">
                    <div>
                        <p className="font-bold text-primary">ADDED: Calculator Toolkit Trial</p>
                        <p className="text-sm text-muted-foreground">3-Day Trial, then $29/mo.</p>
                    </div>
                    <p className="font-bold text-lg text-primary">$1.00</p>
                </div>
            )}
        </div>
        
        {isBookPurchase && (
          <div 
            onClick={() => setAddUpsell(!addUpsell)}
            className={cn(
              "p-4 rounded-lg border-2 cursor-pointer transition-all",
              addUpsell ? "bg-green-50 border-green-500 shadow-lg" : "bg-card hover:bg-slate-50 border-dashed"
            )}
          >
            <div className="flex items-start gap-4">
              <Checkbox id="upsell" checked={addUpsell} onCheckedChange={(checked) => setAddUpsell(Boolean(checked))} className="mt-1 h-5 w-5"/>
              <div className="flex-1">
                <label htmlFor="upsell" className="font-bold text-base text-green-700 flex items-center gap-2 cursor-pointer">
                  <Gem className="h-5 w-5 text-yellow-500"/> ONE-TIME OFFER: Add The Toolkit!
                </label>
                <p className="text-muted-foreground text-sm mt-1">
                  <span className="font-bold">Yes!</span> Add the complete **Chunker Calculator & Toolkit** to my order for a 3-day trial for just **$1**. After the trial, it's just $29/month. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex flex-col gap-4 p-6 bg-secondary/30">
         <div className="w-full text-right font-bold text-xl">
            Total Today: {addUpsell ? '$38.00' : baseProduct.priceFormatted}
        </div>
        <Button asChild size="lg" className="w-full text-lg py-7 shadow-lg">
          <Link href={product.paymentLink}>
            <Lock className="mr-2 h-5 w-5" />
            Complete My Order
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          100% Secure Payment via Stripe. Instant Access.
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
        <Suspense fallback={<div className="text-center">Loading your plan...</div>}>
            <PurchaseForm />
        </Suspense>
      </div>
    </>
  );
}

    