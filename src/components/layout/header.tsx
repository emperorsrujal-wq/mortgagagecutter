'use client';

import Link from 'next/link';
import { Home, BookOpen, GraduationCap, Calculator, ChevronDown, Landmark, Zap, Trophy, ShieldCheck, ArrowLeftRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfileButton } from '@/components/auth/user-profile-button';
import { useUser } from '@/firebase';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-3 bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-primary to-emerald-500 p-2 rounded-xl">
                <Home className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-foreground">Mortgage</span>
              <span className="text-gradient">Cutter</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="flex items-center gap-1">
            <nav className="hidden lg:flex items-center gap-0.5">
              <NavLink href="/">Home</NavLink>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1.5 font-medium hover:bg-primary/10 rounded-full px-4 transition-all duration-300">
                    <GraduationCap className="h-4 w-4 text-primary" /> Education <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border border-primary/10 shadow-xl shadow-primary/5">
                  <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">Learning Paths</DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem asChild className="rounded-xl p-0 focus:bg-primary/5 cursor-pointer">
                    <Link href="/learn" className="cursor-pointer py-3 px-3 block">
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <Zap className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Payoff Blueprint</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">Step-by-Step Strategy</p>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-0 focus:bg-primary/5 cursor-pointer mt-1">
                    <Link href="/financial-academy" className="cursor-pointer py-3 px-3 block">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Trophy className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Financial Academy</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">Regional Banking Secrets</p>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1.5 font-medium hover:bg-emerald-500/10 rounded-full px-4 transition-all duration-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> My Tools <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border border-emerald-500/10 shadow-xl shadow-emerald-500/5">
                    <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">Member Access</DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-emerald-500/5 cursor-pointer">
                      <Link href="/questionnaire" className="cursor-pointer py-2.5"><Calculator className="mr-2 h-4 w-4 text-slate-400" /> Savings Estimator</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-emerald-500/5 cursor-pointer">
                      <Link href="/members/chunker" className="cursor-pointer py-2.5"><Zap className="mr-2 h-4 w-4 text-yellow-500" /> Chunker Simulator</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-emerald-500/5 cursor-pointer">
                      <Link href="/members/bank-screener" className="cursor-pointer py-2.5"><Landmark className="mr-2 h-4 w-4 text-blue-400" /> Bank Screener</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-emerald-500/5 cursor-pointer">
                      <Link href="/members/lender-loyalty-audit" className="cursor-pointer py-2.5"><ArrowLeftRight className="mr-2 h-4 w-4 text-orange-500" /> Lender Loyalty Audit™</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <NavLink href="/book-sales">
                <BookOpen className="mr-1.5 h-4 w-4 text-amber-500" /> The Book
              </NavLink>
              <NavLink href="/blog">Blog</NavLink>
            </nav>
            
            <div className="hidden lg:block ml-2">
              <UserProfileButton />
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-primary/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              <MobileNavLink href="/" onClick={() => setMobileOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/learn" onClick={() => setMobileOpen(false)}>Payoff Blueprint</MobileNavLink>
              <MobileNavLink href="/financial-academy" onClick={() => setMobileOpen(false)}>Financial Academy</MobileNavLink>
              <MobileNavLink href="/book-sales" onClick={() => setMobileOpen(false)}>The Book</MobileNavLink>
              <MobileNavLink href="/blog" onClick={() => setMobileOpen(false)}>Blog</MobileNavLink>
              {user && (
                <>
                  <div className="h-px bg-border my-2" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">My Tools</p>
                  <MobileNavLink href="/questionnaire" onClick={() => setMobileOpen(false)}>Savings Estimator</MobileNavLink>
                  <MobileNavLink href="/members/chunker" onClick={() => setMobileOpen(false)}>Chunker Simulator</MobileNavLink>
                  <MobileNavLink href="/members/bank-screener" onClick={() => setMobileOpen(false)}>Bank Screener</MobileNavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button 
      variant="ghost" 
      asChild 
      className="font-medium hover:bg-primary/10 rounded-full px-4 transition-all duration-300 relative group"
    >
      <Link href={href}>
        {children}
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-1/2 transition-all duration-300" />
      </Link>
    </Button>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Button variant="ghost" asChild className="w-full justify-start rounded-xl font-medium hover:bg-primary/5" onClick={onClick}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
