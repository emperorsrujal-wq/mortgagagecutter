'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import Link from 'next/link';
import {
  Play,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Target,
  Lock,
  Unlock,
  Calculator,
  Landmark,
  TrendingUp,
  Shield,
  Users,
  Star,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Home,
  Zap,
  Flag,
  Sparkles,
  Clock,
  ArrowLeftRight,
} from 'lucide-react';

/* ──────────────────────── data ──────────────────────── */

const testimonials = [
  {
    text: 'I was shocked when I ran my numbers. We were on track to pay $412,000 in interest. The Mortgage Cutter method showed us how to cut that to $47,000. We paid off our home in 6 years.',
    author: 'James T.',
    location: 'Austin, TX',
    metric: '$365K saved',
    initials: 'JT',
  },
  {
    text: 'I thought this was too good to be true. But the math doesn\'t lie. 7 years and 3 months — that\'s how long it took us to pay off a $380K mortgage.',
    author: 'Maria S.',
    location: 'Toronto',
    metric: '7.3 years',
    initials: 'MS',
  },
  {
    text: 'The free modules alone were worth more than my $300/hour financial advisor. The paid course paid for itself in the first month.',
    author: 'David K.',
    location: 'London',
    metric: 'Self-funded',
    initials: 'DK',
  },
];

const freeTools = [
  {
    icon: <Calculator className="h-6 w-6" />,
    title: 'Savings Calculator',
    desc: 'See YOUR exact savings in 60 seconds',
    href: '/questionnaire',
    color: 'from-primary/10 to-emerald-500/10',
    iconColor: 'text-primary',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Chunker Method',
    desc: 'Model lump-sum payments and see the impact',
    href: '/members/chunker',
    color: 'from-yellow-500/10 to-amber-500/10',
    iconColor: 'text-yellow-600',
  },
  {
    icon: <Landmark className="h-6 w-6" />,
    title: 'Bank Screener',
    desc: 'Find the best banks in your area',
    href: '/members/bank-screener',
    color: 'from-blue-500/10 to-indigo-500/10',
    iconColor: 'text-blue-600',
  },
  {
    icon: <ArrowLeftRight className="h-6 w-6" />,
    title: 'Lender Loyalty',
    desc: 'Audit your lender for hidden fees',
    href: '/members/lender-loyalty-audit',
    color: 'from-orange-500/10 to-red-500/10',
    iconColor: 'text-orange-600',
  },
];

const freeModules = [
  { num: 1, title: 'The Foundation', lessons: '3 lessons' },
  { num: 2, title: 'The Scams & Myths', lessons: '3 lessons' },
  { num: 3, title: 'The Strategy Arsenal', lessons: '3 lessons' },
  { num: 4, title: 'The Deep Math', lessons: '5 lessons' },
];

const paidModules = [
  { num: 5, title: 'Credit Mastery', lessons: '3 lessons' },
  { num: 6, title: 'The Numbers Game', lessons: '3 lessons' },
  { num: 7, title: 'Bank Selection', lessons: '4 lessons' },
  { num: 8, title: 'Application & Closing', lessons: '3 lessons' },
  { num: 9, title: 'Advanced Acceleration', lessons: '4 lessons' },
  { num: 10, title: 'Your Action Plan', lessons: '4 lessons' },
];

/* ──────────────────────── section label ──────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-primary font-bold text-sm uppercase tracking-widest">
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COURSE START / WELCOME PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function CourseStartPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ═══════════════════ 1. WELCOME HERO ═══════════════════ */}
      <section className="relative w-full pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(196_84%_44%/0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(173_58%_39%/0.15),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center gap-8">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-white/90 text-sm font-medium">
              You&apos;re in! Welcome to the course.
            </span>
          </motion.div>

          {/* Headline */}
          <div className="max-w-[800px] text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              Welcome to the{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
                Mortgage Cutter Blueprint
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              In the next 4 free modules, you&apos;ll discover why your mortgage is
              costing you{' '}
              <span className="text-white font-semibold">2-3x more</span> than it
              should — and exactly what to do about it.
            </motion.p>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Course Progress</span>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-400 border-none text-xs font-bold"
                >
                  0% Complete
                </Badge>
              </div>
              <Progress value={0} className="h-2.5 bg-slate-800" />
              <p className="text-center text-xs text-gray-400 mt-3">
                Let&apos;s begin your journey to mortgage freedom
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold px-10 py-7 text-lg rounded-full shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <Link href="/course/lesson/the-2x-cost-trap" className="flex items-center gap-2">
                <Play className="h-5 w-5" fill="currentColor" />
                Start Lesson 1.1: The 2x Cost Trap
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <p className="text-gray-400 text-sm flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              4 free modules &bull; 16 lessons &bull; ~2.5 hours
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 2. WHAT YOU'LL DISCOVER (3 Pillars) ═══════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(220_20%_10%/1),transparent_70%)]" />

        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-14">
              <SectionLabel>What You&apos;ll Discover</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white">
                Three Pillars of Mortgage Freedom
              </h2>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Pillar 1: The Problem */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 h-full overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center text-red-400 mb-5">
                    <AlertTriangle className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    The Problem
                  </h3>
                  <p className="text-2xl md:text-3xl font-black text-red-400 mb-3">
                    $647K
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    That&apos;s what your $300K house actually costs on a 30-year
                    mortgage. Discover how banks designed this system to extract
                    maximum interest from you.
                  </p>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Pillar 2: The Solution */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 h-full overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center text-amber-400 mb-5">
                    <Lightbulb className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    The Solution
                  </h3>
                  <p className="text-2xl md:text-3xl font-black text-amber-400 mb-3">
                    5-7 Years
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Instead of 30. Learn the velocity banking method that uses
                    HELOCs and offset accounts to reduce your average daily balance
                    and obliterate your mortgage.
                  </p>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Pillar 3: The Blueprint */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20 h-full overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 mb-5">
                    <Target className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    The Blueprint
                  </h3>
                  <p className="text-2xl md:text-3xl font-black text-emerald-400 mb-3">
                    Step-by-Step
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Your complete implementation plan. From calculating your exact
                    savings to choosing the right bank to automating your payoff —
                    every step is mapped out.
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════ 3. COURSE ROADMAP ═══════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-14">
              <SectionLabel>Your Journey</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white">
                The 10-Module Roadmap
              </h2>
              <p className="text-gray-400 mt-3 max-w-lg mx-auto">
                Start with 4 free modules. Upgrade anytime to unlock the full blueprint.
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="max-w-2xl mx-auto">
              {/* YOU ARE HERE marker */}
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider">
                    You Are Here
                  </span>
                </div>
              </div>

              {/* Connecting line */}
              <div className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-amber-500/50 to-emerald-500/50" />

                {/* FREE MODULES — 1-4 */}
                <div className="relative mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5">
                      <Unlock className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        Modules 1-4 Free
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {freeModules.map((mod) => (
                      <motion.div
                        key={mod.num}
                        whileHover={{ scale: 1.05, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className={`relative ${mod.num === 1 ? 'ring-2 ring-emerald-400/50 rounded-2xl' : ''}`}
                      >
                        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-4 text-center">
                          {mod.num === 1 && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              Start
                            </div>
                          )}
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg mx-auto mb-2">
                            {mod.num}
                          </div>
                          <p className="text-white text-sm font-semibold mb-1">{mod.title}</p>
                          <p className="text-gray-500 text-xs">{mod.lessons}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Arrow connector */}
                <div className="flex justify-center mb-8">
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ChevronRight className="h-6 w-6 text-amber-400 rotate-90" />
                  </motion.div>
                </div>

                {/* PAID MODULES — 5-10 */}
                <div className="relative mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
                      <Lock className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                        Modules 5-10 Premium
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {paidModules.map((mod) => (
                      <motion.div
                        key={mod.num}
                        whileHover={{ scale: 1.05, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-3 text-center">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-sm mx-auto mb-2">
                            <Lock className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-white text-xs font-semibold mb-1 leading-tight">{mod.title}</p>
                          <p className="text-gray-500 text-[10px]">{mod.lessons}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Arrow connector */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  >
                    <ChevronRight className="h-6 w-6 text-emerald-400 rotate-90" />
                  </motion.div>
                </div>

                {/* END: Mortgage Free */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl px-8 py-5 text-center"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Home className="h-7 w-7 text-emerald-400" />
                      <div>
                        <p className="text-emerald-400 text-lg font-black uppercase tracking-wider">
                          Mortgage Free
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Your ultimate destination
                        </p>
                      </div>
                      <Flag className="h-6 w-6 text-emerald-400" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ═══════════════════ 4. YOUR FREE TOOLKIT ═══════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(220_20%_10%/1),transparent_70%)]" />

        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-14">
              <SectionLabel>Your Free Toolkit</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white">
                Powerful Tools Included Free
              </h2>
              <p className="text-gray-400 mt-3 max-w-lg mx-auto">
                Every student gets access to our premium mortgage planning tools.
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {freeTools.map((tool, i) => (
              <StaggerItem key={i}>
                <Link href={tool.href} className="block h-full">
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center ${tool.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {tool.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{tool.desc}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium">
                      <span>Try it free</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════ 5. COMMUNITY / SOCIAL PROOF ═══════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest">
                  Community
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join 10,000+ Homeowners
              </h2>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Who took the first step toward financial freedom
              </p>
              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <span className="text-white font-bold">4.9</span>
                <span className="text-gray-500 text-sm">/ 5 rating</span>
              </div>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                      {t.metric}
                    </span>
                  </div>
                  <p className="italic text-gray-300 leading-relaxed flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{t.author}</p>
                      <p className="text-xs text-gray-500">{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════ 6. FINAL CTA ═══════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(196_84%_44%/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(173_58%_39%/0.1),transparent_50%)]" />

        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />

        <div className="container mx-auto px-4 relative text-center">
          <FadeInUp>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
              <span className="text-white/70 text-sm font-medium">
                Join 10,000+ homeowners on the path to financial freedom
              </span>
              <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight">
              Start Lesson 1.1 Now
            </h2>

            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
              Your mortgage-free life starts with a single lesson. Dive in and
              discover the truth about your mortgage.
            </p>

            <div className="flex flex-col items-center gap-4 mb-8">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold px-12 py-8 text-xl rounded-full shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="/course/lesson/the-2x-cost-trap" className="flex items-center gap-3">
                  <Play className="h-6 w-6" fill="currentColor" />
                  Start Lesson 1.1 Now
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span>Start instantly</span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
