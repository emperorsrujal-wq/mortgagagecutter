
'use client';

import Link from 'next/link';
import { Home, BookOpen, GraduationCap, Calculator, ChevronDown, Landmark, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfileButton } from '@/components/auth/user-profile-button';
import { useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { user } = useUser();

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            MORTGAGE CUTTER
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/learn"><GraduationCap className="mr-2 h-4 w-4" /> Learn</Link>
            </Button>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1">
                    <Zap className="mr-2 h-4 w-4 text-yellow-500" /> Tools <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Member Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/questionnaire" className="cursor-pointer">
                      <Calculator className="mr-2 h-4 w-4" /> Savings Estimator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/members/chunker" className="cursor-pointer">
                      <Zap className="mr-2 h-4 w-4" /> Chunker Simulator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/members/bank-screener" className="cursor-pointer">
                      <Landmark className="mr-2 h-4 w-4" /> Bank Screener
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="ghost" asChild>
              <Link href="/book-sales"><BookOpen className="mr-2 h-4 w-4" /> The Book</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/blog">Blog</Link>
            </Button>
          </nav>
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
}
