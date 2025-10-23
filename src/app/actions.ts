
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
  // Note: The list ID was corrected from the user's prompt.
  const apiEndpoint = `https://app.cleverlybox.com/api/v1/lists/68f97758d594c/add`;

  if (!apiKey) {
    console.error('CleverlyBox API key is not configured.');
    return { success: false };
  }

  // The user's latest request specifies the api_token in the URL, not the body.
  const fullUrl = `${apiEndpoint}?api_token=${apiKey}`;

  const payload = {
    email: userData.email,
    name: userData.name || 'New User',
  };

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Failed to add user to CleverlyBox list for ${userData.email}. Status: ${response.status}. Body: ${errorBody}`);
      return { success: false };
    }
    
    console.log(`Successfully added ${userData.email} to CleverlyBox list.`);
    return { success: true };

  } catch (error) {
    console.error('Error adding user to CleverlyBox list:', error);
    return { success: false };
  }
}
