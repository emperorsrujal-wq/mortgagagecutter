
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
    const mailCollection = collection(firestore, 'mail');
    
    const projectUrl = `https://${process.env.GCLOUD_PROJECT}.web.app`;

    // 1. Prepare the actual welcome email for the user
    const userMailData = {
      to: [userData.email],
      template: {
        name: 'welcome',
        data: {
          name: userData.name || 'Homeowner',
          questionnaire_url: `${projectUrl}/questionnaire`,
        },
      },
    };
    
    // 2. Prepare the verification email for SendGrid
    // This special address is used by the Firebase Extension to verify the domain with SendGrid.
    const verificationMailData = {
        to: ['verify@example.com'], 
        template: {
            name: 'welcome', // It can reuse the same template; the content doesn't matter for verification.
            data: {
                name: 'SendGrid Verification',
                questionnaire_url: projectUrl,
            },
        },
    };

    // 3. Send both emails by creating documents in the 'mail' collection
    // We create two separate documents. The Trigger Email extension will process both.
    const userWritePromise = addDoc(mailCollection, userMailData);
    const verificationWritePromise = addDoc(mailCollection, verificationMailData);
    
    // Wait for both database write operations to complete
    await Promise.all([userWritePromise, verificationWritePromise]);
    
    console.log(`Successfully created email documents for: ${userData.email} and SendGrid verification.`);
    return { success: true };
  } catch (error: any) {
    console.error(`FATAL: Server action could not create email document for ${userData.email}. Error: ${error.message}`, {
      structuredData: true,
      error: error
    });
    return { success: false, error: error.message };
  }
}
