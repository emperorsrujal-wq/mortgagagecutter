
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
  const apiEndpoint = 'https://api.cleverlybox.com/v1/send'; // Assuming a standard endpoint

  if (!apiKey) {
    console.error('CleverlyBox API key is not configured.');
    return { success: false };
  }

  const payload = {
    email: userData.email,
    name: userData.name,
    template_id: 'welcome-email',
  };

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Failed to send welcome email to ${userData.email}. Status: ${response.status}. Body: ${errorBody}`);
      // Implement retry logic here if needed (e.g., with a queue or another serverless function)
      return { success: false };
    }
    
    console.log(`Welcome email successfully sent to ${userData.email}`);
    return { success: true };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Implement retry logic here
    return { success: false };
  }
}
