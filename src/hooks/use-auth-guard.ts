'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin';

/**
 * Redirects unauthenticated users to the home page.
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

    // Admin bypass: full access regardless of auth method
    if (isAdmin(user)) {
      return;
    }
  }, [user, isUserLoading, router]);

  return { user, isUserLoading };
}
