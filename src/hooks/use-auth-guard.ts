'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin';

/**
 * Redirects unauthenticated users to the home page.
 * Redirects email/password users who haven't verified their email to /verify-email.
 * OAuth users (Google, Apple) are allowed through since their emails are pre-verified.
 * Admin users bypass all checks.
 */
export function useAuthGuard() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.push('/');
      return;
    }

    // Admin bypass: full access regardless of verification or auth method
    if (isAdmin(user)) {
      return;
    }

    const isOAuth = user.providerData.some(
      (p) => p.providerId === 'google.com' || p.providerId === 'apple.com'
    );

    if (!isOAuth && !user.emailVerified) {
      router.push('/verify-email');
      return;
    }
  }, [user, isUserLoading, router]);

  return { user, isUserLoading };
}
