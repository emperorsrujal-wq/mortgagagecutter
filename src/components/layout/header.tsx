'use client';

import Link from 'next/link';
import { Home, BookOpen, GraduationCap, Calculator, ChevronDown, Landmark, Zap, Trophy, ShieldCheck, ArrowLeftRight } from 'lucide-react';
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
          <span className="text-xl font-bold tracking-tight uppercase">
            Mortgage Cutter
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  <GraduationCap className="mr-2 h-4 w-4 text-blue-500" /> Education <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Learning Paths</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/learn" className="cursor-pointer py-3">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Payoff Blueprint</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Step-by-Step Strategy</p>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/financial-academy" className="cursor-pointer py-3">
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Financial Academy</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Regional Banking Secrets</p>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1">
                    <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" /> My Tools <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Member Access</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/questionnaire" className="cursor-pointer py-2">
                      <Calculator className="mr-2 h-4 w-4 text-slate-400" /> Savings Estimator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/members/chunker" className="cursor-pointer py-2">
                      <Zap className="mr-2 h-4 w-4 text-yellow-500" /> Chunker Simulator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/members/bank-screener" className="cursor-pointer py-2">
                      <Landmark className="mr-2 h-4 w-4 text-blue-400" /> Bank Screener
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/members/lender-loyalty-audit" className="cursor-pointer py-2">
                      <ArrowLeftRight className="mr-2 h-4 w-4 text-orange-500" /> Lender Loyalty Audit™
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="ghost" asChild>
              <Link href="/book-sales"><BookOpen className="mr-2 h-4 w-4 text-orange-500" /> The Book</Link>
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
