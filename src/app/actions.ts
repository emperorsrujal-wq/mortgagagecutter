
'use server';

import { estimate } from '@/lib/mortgage';
import type { Inputs, Outputs } from '@/lib/mortgage-types';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { firebaseConfig } from '@/firebase/config';

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
    // Initialize Firebase Admin SDK to interact with Firestore from the server.
    const { firestore } = initializeFirebase();
    const mailCollection = collection(firestore, 'mail');
    
    // Define the email document structure as required by the Trigger Email Extension.
    const mailDocument = {
      to: [userData.email],
      message: {
        subject: `Welcome to Mortgage Cutter, ${userData.name}!`,
        text: `Hi ${userData.name},\n\nThank you for registering with Mortgage Cutter. We're excited to help you on your journey to financial freedom.\n\nYou can get started by filling out our questionnaire here: https://${firebaseConfig.authDomain}/questionnaire\n\nSincerely,\nThe Mortgage Cutter Team`,
        html: `
          <p>Hi ${userData.name},</p>
          <p>Thank you for registering with Mortgage Cutter. We're excited to help you on your journey to financial freedom.</p>
          <p>You can get started by filling out our questionnaire to see your personalized savings blueprint:</p>
          <p><a href="https://${firebaseConfig.authDomain}/questionnaire"><strong>Complete Your Questionnaire Now</strong></a></p>
          <p>Sincerely,<br/>The Mortgage Cutter Team</p>
        `,
      },
    };

    // Create the new document in the 'mail' collection.
    await addDoc(mailCollection, mailDocument);
    
    console.log(`Successfully created welcome email document for: ${userData.email}`);
    return { success: true };
  } catch (error: any) {
    console.error(`FATAL: Server action could not create email document for ${userData.email}. Error: ${error.message}`, {
      structuredData: true,
      error: error
    });
    return { success: false, error: error.message };
  }
}
