'use client';
import { Suspense } from 'react';
import { ComparisonDisplay } from '@/components/comparison/comparison-display';
import { Loader2 } from 'lucide-react';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://mortgagecutter.com'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Savings Calculator',
      'item': 'https://mortgagecutter.com/questionnaire'
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': 'Savings Blueprint'
    }
  ]
};


function ComparisonFallback() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">
        Building your savings blueprint...
      </p>
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense fallback={<ComparisonFallback />}>
       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ComparisonDisplay />
    </Suspense>
  );
}
