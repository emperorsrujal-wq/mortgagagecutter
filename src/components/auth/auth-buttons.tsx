
'use client';

import {
  AuthError,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.8 0-5.18-1.88-6.04-4.42H2.34v2.84C4.13 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.96 14.25c-.21-.66-.32-1.35-.32-2.05s.11-1.39.32-2.05V7.31H2.34c-.77 1.52-1.24 3.24-1.24 5.09s.47 3.57 1.24 5.09l3.62-2.8z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.13 3.47 2.34 7.31l3.62 2.84c.86-2.54 3.24-4.42 6.04-4.42z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M12.01,16.05c-1.21,0-2.33-0.56-3.37-1.42c-1.12-0.93-1.8-2.22-1.8-3.58c0-2.4,1.55-3.89,3.69-3.89 c0.9,0,1.96,0.4,2.89,1.13c-0.01-0.01,0.42-0.37,1.12-1.05c-1.1-1.1-2.52-1.74-4.14-1.74c-3.13,0-5.5,2.11-5.5,5.55 c0,3.56,2.68,5.4,5.32,5.4c1.1,0,2.23-0.38,3.2-1.07c0.8-0.57,1.4-1.37,1.55-2.29H14.07C13.88,15.63,12.98,16.05,12.01,16.05z M15.1,5.13c0.89-1.13,1.52-2.48,1.61-3.92c-1.43,0.09-2.91,0.9-3.82,2.03c-0.81,1.02-1.5,2.4-1.5,3.81c1.52,0,2.91-0.84,3.71-1.92V5.13z"
      fill="currentColor"
    />
  </svg>
);

export function AuthButtons() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/questionnaire');
    }
  }, [user, router]);

  const handleSignIn = async (provider: 'google' | 'apple') => {
    if (!auth || !firestore) return;
    const authProvider =
      provider === 'google'
        ? new GoogleAuthProvider()
        : new OAuthProvider('apple.com');
    try {
      const result = await signInWithPopup(auth, authProvider);
      const additionalInfo = getAdditionalUserInfo(result);

      if (additionalInfo?.isNewUser && result.user.phoneNumber) {
        try {
          await addDoc(collection(firestore, "messages"), {
             to: [result.user.phoneNumber],
             template: 'welcome_sms',
             flowId: 'MSG91_FLOW_ID', // IMPORTANT: Replace with your actual Flow ID from MSG91
          });
        } catch (smsError) {
            console.error("Error writing welcome sms document:", smsError);
            // Non-fatal error, user is still logged in. We can just log it.
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error(`Error signing in with ${provider}:`, authError.code, authError.message);
      
      if (authError.code === 'auth/operation-not-allowed') {
        toast({
          variant: 'destructive',
          title: 'Sign-in method not enabled',
          description: `Please enable ${provider} sign-in from the Firebase console.`,
        });
      } else if (authError.code === 'auth/unauthorized-domain') {
         toast({
          variant: 'destructive',
          title: 'Domain Not Authorized',
          description: `The domain you are using is not authorized for sign-in. Please add it to the list of authorized domains in your Firebase project's Authentication settings.`,
        });
      }
      else {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: authError.message,
        });
      }
    }
  };
  
  if (user) {
    return null; // Don't render buttons if user is logged in, useEffect will handle redirect
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSignIn('google')}
      >
        <GoogleIcon />
        <span className="ml-2">Sign in with Google</span>
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSignIn('apple')}
      >
        <AppleIcon />
        <span className="ml-2">Sign in with Apple</span>
      </Button>
    </div>
  );
}
