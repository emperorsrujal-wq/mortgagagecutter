
'use client';

import { useCallback } from 'react';
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function useSendWelcomeEmail() {
  const firestore = useFirestore();

  const isNewUser = useCallback((user: User): boolean => {
    const { creationTime, lastSignInTime } = user.metadata;
    // Firebase timestamps can be strings. Compare them.
    // A new user's creation time and last sign-in time are very close, often identical.
    // We allow a small tolerance (e.g., 5 seconds) to account for slight delays.
    if (creationTime && lastSignInTime) {
      const creation = new Date(creationTime).getTime();
      const lastSignIn = new Date(lastSignInTime).getTime();
      return Math.abs(creation - lastSignIn) < 5000;
    }
    // Fallback if metadata is somehow missing
    return false;
  }, []);

  const sendWelcomeEmail = useCallback(async (user: User) => {
    if (!user.email) {
      console.error('Cannot send welcome email: user has no email address.');
      return;
    }

    try {
      const mailCollection = collection(firestore, 'mail');
      await addDoc(mailCollection, {
        to: [user.email], // Changed to an array to match extension requirements
        message: {
          subject: 'Welcome to Mortgage Cutter!',
          html: `<p>Welcome to your financial freedom journey. Get started by filling out our questionnaire.</p><p>You can access the questionnaire here: <a href="https://mortgagecutter.com/questionnaire">https://mortgagecutter.com/questionnaire</a></p>`,
        },
      });
      console.log('Welcome email document created for:', user.email);
    } catch (error) {
      console.error('Error creating welcome email document:', error);
      // Optional: Add a toast notification for failure here
    }
  }, [firestore]);

  return { isNewUser, sendWelcomeEmail };
}
