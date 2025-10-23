
'use server';

import { estimate } from '@/lib/mortgage';
import type { Inputs, Outputs } from '@/lib/mortgage-types';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // This will provide a more informative error if the environment variable is missing.
    throw new Error('The Stripe secret key is not set. Please set the STRIPE_SECRET_KEY environment variable.');
  }
  const stripe = new Stripe(secretKey);
  return stripe;
};


export async function createStripeCheckoutSession(product: { name: string; description: string; priceInCents: number }) {
  const stripe = getStripe();
  const headersList = headers();
  const origin = headersList.get('origin') || 'https://mortgagecutter.com';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/method-access`,
      cancel_url: `${origin}/purchase`,
    });

    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error('Stripe session URL not found.');
    }

  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    // In a real app, you might redirect to an error page.
    // For now, we'll redirect back to purchase with an error query.
    redirect(`/purchase?error=${encodeURIComponent(message)}`);
  }
}


export async function getSavingsReport(
  data: Inputs
): Promise<{ success: true; report: Outputs } | { success: false; error: string }> {
  try {
    const result = estimate(data);
    return { success: true, report: result };
  } catch (error) {
    console.error('Error in getSavingsReport:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate savings report: ${message}` };
  }
}

export async function sendWelcomeEmail(userData: { name: string; email: string }): Promise<{ success: boolean }> {
  const apiEndpoint = 'https://app.cleverlybox.com/lists/68f97758d594c/embedded-form-subscribe';

  const nameParts = userData.name?.split(' ') || [];
  const firstName = nameParts.shift() || '';

  const formData = new URLSearchParams();
  formData.append('EMAIL', userData.email);
  formData.append('FIRST_NAME', firstName);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (response.ok) {
      console.log(`Successfully submitted ${userData.email} to CleverlyBox list form.`);
      return { success: true };
    }

    const errorBody = await response.text();
    console.error(`Failed to add user to CleverlyBox list for ${userData.email}. Status: ${response.status}. Body: ${errorBody}`);
    return { success: false };

  } catch (error) {
    console.error('Error submitting user to CleverlyBox list form:', error);
    return { success: false };
  }
}
