'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function FormSubmittedPage() {
  const router = useRouter();

  useEffect(() => {
    // This page's sole purpose is to redirect the user to the questionnaire.
    // This happens immediately on client-side render.
    router.replace('/questionnaire');
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <p className="text-lg text-muted-foreground">Processing your request...</p>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
