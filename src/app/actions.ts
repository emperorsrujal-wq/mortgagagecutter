
'use server';

import { estimate } from '@/lib/mortgage';
import type { Inputs, Outputs } from '@/lib/mortgage-types';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

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

export async function sendWelcomeEmail(userData: { name: string; email: string }): Promise<{ success: boolean; error?: string }> {
  console.log('Server Action: sendWelcomeEmail triggered for', userData.email);
  try {
    // We must get a new instance of firestore for server-side actions.
    const { firestore } = initializeFirebase();
    
    const mailData = {
      to: [userData.email],
      template: {
        name: 'welcome',
        data: {
          name: userData.name || 'Homeowner',
          questionnaire_url: 'https://mortgagecutter.com/questionnaire',
        },
      },
    };

    const mailCollection = collection(firestore, 'mail');
    const writeResult = await addDoc(mailCollection, mailData);
    
    console.log(`Successfully created email document ${writeResult.id} for: ${userData.email}`);
    return { success: true };
  } catch (error: any) {
    console.error(`FATAL: Server action could not create email document for ${userData.email}. Error: ${error.message}`, {
      structuredData: true,
      error: error
    });
    return { success: false, error: error.message };
  }
}
