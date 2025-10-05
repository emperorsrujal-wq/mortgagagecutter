'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t mt-auto bg-card">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        &copy; {currentYear} Mortgage Cutter. All rights reserved.
      </div>
    </footer>
  );
}
