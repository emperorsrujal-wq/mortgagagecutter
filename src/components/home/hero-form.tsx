
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthButtons } from '../auth/auth-buttons';
import { Separator } from '../ui/separator';

export function HeroForm() {

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle>Get Your Free Blueprint</CardTitle>
        <CardDescription>Instantly see your potential savings. No credit card required.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        
        <AuthButtons />

        <p className="text-center text-xs text-gray-700 dark:text-gray-300 mt-4">
            Sign in to create your personalized savings estimate.
        </p>
        <div className="text-center text-gray-700 dark:text-gray-300 text-sm mt-4">
            <p className="font-semibold">Trusted by over 2,000 families | As featured in: Forbes, Globe and Mail</p>
        </div>
      </CardContent>
    </Card>
  );
}
