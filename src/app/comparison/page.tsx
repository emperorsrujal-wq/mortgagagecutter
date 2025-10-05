'use client';
import { Suspense } from 'react';
import { ComparisonDisplay } from '@/components/comparison/comparison-display';
import { Loader2 } from 'lucide-react';

function ComparisonFallback() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">
        Calculating your savings...
      </p>
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense fallback={<ComparisonFallback />}>
      <ComparisonDisplay />
    </Suspense>
  );
}
