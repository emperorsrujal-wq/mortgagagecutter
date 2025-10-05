'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t mt-auto bg-card">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        &copy; {year || new Date().getFullYear()} Mortgage Cutter. All rights reserved.
      </div>
    </footer>
  );
}
