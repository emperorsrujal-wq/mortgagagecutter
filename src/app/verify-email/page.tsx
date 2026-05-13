'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resentSuccess, setResentSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  // Poll for email verification status
  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.push('/');
      return;
    }

    if (user.emailVerified) {
      router.push('/questionnaire');
      return;
    }

    // Poll every 3 seconds to check if user verified in another tab
    const interval = setInterval(async () => {
      await user.reload();
      if (user.emailVerified) {
        router.push('/questionnaire');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, isUserLoading, router]);

  async function handleResend() {
    if (!user) return;
    setIsResending(true);
    setResendError('');
    setResentSuccess(false);

    try {
      await sendEmailVerification(user, {
        url: `${typeof window !== 'undefined' ? window.location.origin : 'https://mortgagecutter.com'}/auth/action`,
        handleCodeInApp: false,
      });
      setResentSuccess(true);
    } catch (err: any) {
      console.error('Resend error:', err);
      setResendError(err.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-primary" />
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
              <p className="text-muted-foreground mb-2">
                We sent a verification link to:
              </p>
              <p className="font-medium text-foreground mb-6">{user.email}</p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 w-full">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-left text-sm text-amber-800">
                    <p className="font-medium mb-1">Almost there!</p>
                    <p>Click the link in the email to verify your account. Once verified, you&apos;ll be redirected automatically.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 w-full">
                <Button
                  onClick={handleResend}
                  variant="outline"
                  className="w-full"
                  disabled={isResending || resentSuccess}
                >
                  {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {resentSuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                      Email Resent
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>

                {resendError && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{resendError}</p>
                )}

                <Button
                  onClick={() => router.push('/')}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
