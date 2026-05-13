'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import {
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AuthActionContent() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState<'loading' | 'verifyEmailSuccess' | 'verifyEmailError' | 'resetPasswordForm' | 'resetPasswordSuccess' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your request...');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!auth || !oobCode) {
      setStatus('error');
      setMessage('Invalid or missing verification link.');
      return;
    }

    async function handleAction() {
      if (!oobCode) return;
      try {
        if (mode === 'verifyEmail') {
          await applyActionCode(auth, oobCode);
          setStatus('verifyEmailSuccess');
          setMessage('Your email has been verified successfully!');
          // Redirect to questionnaire after a short delay
          setTimeout(() => router.push('/questionnaire'), 3000);
        } else if (mode === 'resetPassword') {
          const userEmail = await verifyPasswordResetCode(auth, oobCode);
          setEmail(userEmail);
          setStatus('resetPasswordForm');
        } else {
          setStatus('error');
          setMessage('Unsupported action mode.');
        }
      } catch (error: any) {
        console.error('Auth action error:', error);
        setStatus('error');
        if (mode === 'verifyEmail') {
          setStatus('verifyEmailError');
          setMessage('This verification link has expired or is invalid. Please try signing in to request a new one.');
        } else {
          setMessage(error.message || 'An error occurred while processing your request.');
        }
      }
    }

    handleAction();
  }, [auth, mode, oobCode, router]);

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (!auth || !oobCode) return;

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('resetPasswordSuccess');
      setMessage('Your password has been reset successfully!');
      setTimeout(() => router.push('/'), 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setPasswordError(error.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{message}</p>
          </div>
        );

      case 'verifyEmailSuccess':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">{message}</p>
            <Button onClick={() => router.push('/questionnaire')}>
              Continue to Questionnaire
            </Button>
          </motion.div>
        );

      case 'verifyEmailError':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">{message}</p>
            <Button onClick={() => router.push('/')} variant="outline">
              Go Home
            </Button>
          </motion.div>
        );

      case 'resetPasswordForm':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Reset Your Password</h2>
              <p className="text-sm text-muted-foreground">For account: {email}</p>
            </div>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{passwordError}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </form>
          </motion.div>
        );

      case 'resetPasswordSuccess':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Password Reset!</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">{message}</p>
            <Button onClick={() => router.push('/')}>
              Go to Login
            </Button>
          </motion.div>
        );

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Something Went Wrong</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">{message}</p>
            <Button onClick={() => router.push('/')} variant="outline">
              Go Home
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-primary" />
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div key={status}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <AuthActionContent />
    </Suspense>
  );
}
