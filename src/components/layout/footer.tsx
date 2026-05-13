'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, Home, Mail, ArrowUpRight } from 'lucide-react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/ui/animations';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(196_84%_44%/0.15),transparent_50%)]" />
      
      <div className="relative">
        {/* CTA Section */}
        <div className="border-b border-white/5">
          <div className="container mx-auto px-4 py-16">
            <FadeInUp>
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to cut years off your mortgage?
                </h3>
                <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                  Join thousands of homeowners who discovered their path to financial freedom.
                </p>
                <Button 
                  size="lg" 
                  asChild
                  className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Link href="/questionnaire">
                    Get My Free Blueprint
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </FadeInUp>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <StaggerItem>
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="bg-gradient-to-br from-primary to-emerald-500 p-2 rounded-xl">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">
                    <span className="text-white">Mortgage</span>
                    <span className="text-gradient">Cutter</span>
                  </span>
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Helping homeowners pay off their mortgages faster using proven HELOC strategies. No refinancing required.
                </p>
                <div className="flex gap-3">
                  <SocialLink href="#" icon={<Mail className="h-4 w-4" />} />
                </div>
              </div>
            </StaggerItem>

            {/* Learning Column */}
            <StaggerItem>
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Learn</h4>
                <ul className="space-y-2.5">
                  <FooterLink href="/learn">Payoff Blueprint</FooterLink>
                  <FooterLink href="/financial-academy">Financial Academy</FooterLink>
                  <FooterLink href="/book-sales">The Book</FooterLink>
                  <FooterLink href="/blog">Blog</FooterLink>
                </ul>
              </div>
            </StaggerItem>

            {/* Tools Column */}
            <StaggerItem>
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Tools</h4>
                <ul className="space-y-2.5">
                  <FooterLink href="/questionnaire">Savings Estimator</FooterLink>
                  <FooterLink href="/members/chunker">Chunker Simulator</FooterLink>
                  <FooterLink href="/members/bank-screener">Bank Screener</FooterLink>
                  <FooterLink href="/members/lender-loyalty-audit">Lender Loyalty Audit™</FooterLink>
                </ul>
              </div>
            </StaggerItem>

            {/* Testimonials Column */}
            <StaggerItem>
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-sm uppercase tracking-wider">What People Say</h4>
                <div className="space-y-4">
                  <TestimonialCard 
                    text="We shaved 9 years and about $42,000 in interest — without switching banks."
                    author="Sarah L., Toronto"
                  />
                  <TestimonialCard 
                    text="Our plan showed a clear path to being debt-free. We're saving ~$500/month."
                    author="Michael R., Calgary"
                  />
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm text-center md:text-left">
                Trusted by homeowners across Canada & USA
              </p>
              <p className="text-slate-600 text-sm">
                &copy; {year} Mortgage Cutter by MINDRICH TECHNOLOGIES USA INC. All rights reserved.
              </p>
            </div>
            <p className="text-slate-600 text-xs mt-4 text-center max-w-3xl mx-auto">
              Mortgage Cutter provides educational tools to help homeowners understand potential interest savings. Results vary by mortgage size, term, and rate. Verify decisions with your lender or advisor.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-slate-400 hover:text-white text-sm transition-colors duration-300 flex items-center gap-1 group"
      >
        {children}
        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function TestimonialCard({ text, author }: { text: string; author: string }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/[0.07] transition-colors duration-300">
      <div className="flex mb-1.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 text-amber-400" fill="currentColor" />
        ))}
      </div>
      <p className="text-slate-300 text-xs italic leading-relaxed">&ldquo;{text}&rdquo;</p>
      <p className="text-slate-500 text-xs mt-1.5 font-medium">— {author}</p>
    </div>
  );
}
