
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
  const apiEndpoint = 'https://app.cleverlybox.com/lists/68f97758d594c/embedded-form-subscribe';

  // Extract first name and last name from the displayName
  const nameParts = userData.name?.split(' ') || [];
  const firstName = nameParts.shift() || '';
  const lastName = nameParts.join(' ');

  // Create the URL-encoded form data
  const formData = new URLSearchParams();
  formData.append('EMAIL', userData.email);
  formData.append('FIRST_NAME', firstName);
  formData.append('LAST_NAME', lastName);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      // CleverlyBox might return a non-200 status for various reasons, log it for debugging
      const errorBody = await response.text();
      console.error(`Failed to add user to CleverlyBox list for ${userData.email}. Status: ${response.status}. Body: ${errorBody}`);
      // Even if it fails, we return success to avoid blocking the user flow.
      return { success: false };
    }
    
    console.log(`Successfully submitted ${userData.email} to CleverlyBox list form.`);
    return { success: true };

  } catch (error) {
    console.error('Error submitting user to CleverlyBox list form:', error);
    // Do not block the user flow on email failure.
    return { success: false };
  }
}
