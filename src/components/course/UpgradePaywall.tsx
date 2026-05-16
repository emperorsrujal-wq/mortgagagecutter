'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  CheckCircle2,
  Shield,
  CreditCard,
  TrendingUp,
  Building2,
  FileCheck,
  Zap,
  Map,
  ArrowRight,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const valueStack = [
  {
    icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
    title: 'Module 5: Credit Mastery',
    description: 'Boost your score 50+ points in 90 days',
  },
  {
    icon: <Star className="h-5 w-5 text-amber-400" />,
    title: 'Module 6: The Numbers Game',
    description: 'Calculate your exact qualification numbers',
  },
  {
    icon: <Building2 className="h-5 w-5 text-blue-400" />,
    title: 'Module 7: Bank Selection',
    description: 'Find and negotiate with the best banks',
  },
  {
    icon: <FileCheck className="h-5 w-5 text-purple-400" />,
    title: 'Module 8: Application & Closing',
    description: 'Navigate every step with confidence',
  },
  {
    icon: <Zap className="h-5 w-5 text-orange-400" />,
    title: 'Module 9: Advanced Acceleration',
    description: 'Pay off your mortgage 43% faster',
  },
  {
    icon: <Map className="h-5 w-5 text-pink-400" />,
    title: 'Module 10: Your Action Plan',
    description: 'Personalized 90-day roadmap to freedom',
  },
];

type UpgradePaywallProps = {
  className?: string;
};

export function UpgradePaywall({ className }: UpgradePaywallProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-[32px] bg-slate-900 border border-amber-500/30',
        className
      )}
    >
      {/* Gradient border glow effect */}
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-amber-500/20 via-transparent to-amber-600/10 pointer-events-none" />
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-amber-600/10 blur-3xl" />

      <div className="relative z-10 p-8 md:p-12 space-y-8">
        {/* Header with lock */}
        <div className="text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/30"
          >
            <Lock className="h-8 w-8 text-amber-400" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              You&apos;ve Seen the Truth. Now Get the Full Blueprint.
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto">
              Upgrade to unlock all 6 implementation modules + advanced strategies
            </p>
          </div>
        </div>

        {/* Value Stack */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {valueStack.map((item) => (
            <motion.div
              key={item.title}
              variants={staggerItem}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-amber-500/20 transition-colors"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900 border border-white/10 shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-amber-500/60 shrink-0 ml-auto mt-1" />
            </motion.div>
          ))}
        </motion.div>

        {/* Urgency + Price */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <Users className="h-4 w-4" />
            <span className="text-sm font-bold">
              Join 2,400+ homeowners who upgraded this month
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl text-slate-500 line-through font-medium">
                $497
              </span>
              <span className="text-4xl md:text-5xl font-black text-white">
                $297
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              One-time payment. Lifetime access. No recurring fees.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-3">
          <Button
            asChild
            size="lg"
            className="w-full h-14 text-lg font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]"
          >
            <a
              href="https://buy.stripe.com/5kQeVe4qg2Z79MG3vu00006"
              target="_blank"
              rel="noopener noreferrer"
            >
              Upgrade Now — Get Instant Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>

          {/* Guarantee + Testimonial */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="h-4 w-4" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <CreditCard className="h-4 w-4" />
              <span>Secure Stripe Checkout</span>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="border-t border-white/5 pt-6">
          <blockquote className="text-center space-y-2">
            <p className="text-slate-300 italic text-sm md:text-base">
              &ldquo;The paid modules paid for themselves in month 1. We saved
              over $400 in interest in the first 30 days.&rdquo;
            </p>
            <footer className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              — Sarah L., California
            </footer>
          </blockquote>
        </div>
      </div>
    </motion.div>
  );
}
