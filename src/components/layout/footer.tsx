
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t bg-secondary">
      <div className="container mx-auto text-center space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="italic text-muted-foreground">"I saved $32,800! This was the simplest financial decision we've ever made."</p>
                <p className="font-semibold mt-2">- Sarah K.</p>
            </div>
             <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="italic text-muted-foreground">"Paid off our mortgage 8 years sooner. I can't recommend this enough."</p>
                <p className="font-semibold mt-2">- Mike & Jen T.</p>
            </div>
        </div>

        <div className="space-y-2">
            <h3 className="text-xl font-bold">Have Questions?</h3>
            <p className="text-muted-foreground">Our team is here to help you understand your options.</p>
            <Button asChild>
                <Link href="#">Book Free Call</Link>
            </Button>
        </div>

        <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
                Trusted by Forbes, Globe and Mail
            </p>
            <p className="text-sm text-muted-foreground mt-2">
            &copy; {year || new Date().getFullYear()} Mortgage Cutter. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
