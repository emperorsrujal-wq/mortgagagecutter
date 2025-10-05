import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            MORTGAGE CUTTER
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#">Benefits</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#">Contact</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
