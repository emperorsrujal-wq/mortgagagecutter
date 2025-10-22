
'use server';

import { estimate } from '@/lib/mortgage';
import type { Inputs, Outputs } from '@/lib/mortgage-types';

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
  const apiKey = process.env.CLEVERLYBOX_API_KEY;
  const apiEndpoint = `https://app.cleverlybox.com/api/v1/automations/68f968a48909f/execute`;

  if (!apiKey) {
    console.error('CleverlyBox API key is not configured.');
    return { success: false };
  }

  const payload = {
    api_token: apiKey,
    email: userData.email,
    name: userData.name,
  };

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Failed to send welcome email to ${userData.email}. Status: ${response.status}. Body: ${errorBody}`);
      return { success: false };
    }
    
    console.log(`Welcome email automation successfully triggered for ${userData.email}`);
    return { success: true };

  } catch (error) {
    console.error('Error triggering welcome email automation:', error);
    return { success: false };
  }
}
