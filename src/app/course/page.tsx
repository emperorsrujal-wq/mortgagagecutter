
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Star,
  CheckCircle,
  Target,
  Award,
  ShieldCheck,
  Landmark,
  Calculator,
  ArrowRight,
  Zap,
  Clock,
  Users,
  Lock,
  BookOpen,
  ArrowLeftRight,
  GraduationCap,
  Play,
  ChevronDown,
  Eye,
  Sparkles,
  Percent,
  Globe,
  XCircle,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
} from '@/components/ui/animations';
import { courseModules } from '@/lib/course/course-curriculum';

/* ──────────────────────── data helpers ──────────────────────── */

function getModuleLessonCount(mod: { lessons: unknown[] }): number {
  return mod.lessons?.length ?? 0;
}

function getModuleDuration(mod: { lessons: { duration: number }[] }): string {
  const total = mod.lessons?.reduce((sum, l) => sum + l.duration, 0) ?? 0;
  if (total >= 60) {
    const hrs = Math.floor(total / 60);
    const mins = total % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${total}m`;
}



/* ──────────────────────── section label ──────────────────────── */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-primary font-bold text-sm uppercase tracking-widest">
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function CoursePage() {
  return (
    <div className="flex-1 flex flex-col">

      {/* ═══════════════════ 0. SCARCITY BAR ═══════════════════ */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-black text-center py-2.5 text-sm font-bold z-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
        <span className="relative flex items-center justify-center gap-2">
          <Zap className="h-4 w-4" />
          Free access to Modules 1-4 ends soon — over 2,400 homeowners enrolled this week
        </span>
      </motion.div>

      {/* ═══════════════════ 1. HERO SECTION ═══════════════════ */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(196_84%_44%/0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(173_58%_39%/0.15),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center gap-10">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
          >
            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
            <span className="text-white/90 text-sm font-medium">
              10,000+ students enrolled &middot; 4.9/5 rating
            </span>
          </motion.div>

          {/* Headline */}
          <div className="max-w-[800px] text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              Your Bank Doesn&apos;t Want You to See This
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Discover the <span className="text-white font-semibold">Mortgage Cutter Blueprint</span> — the step-by-step system that lets you pay off your home in <span className="text-emerald-400 font-semibold">5-7 years</span> instead of 30. First 4 modules are <span className="text-emerald-400 font-bold">FREE</span>.
            </motion.p>
          </div>

          {/* Animated savings number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <div className="text-6xl md:text-8xl font-black text-gradient leading-none">
              Save $240,000+
            </div>
            <p className="text-gray-400 text-sm mt-2">in potential interest on a typical $300K mortgage</p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white/70 text-sm font-medium"
          >
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>10,000+ students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-sky-400" />
              <span>Works in USA, Canada &amp; UK</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg"
          >
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold px-10 py-7 text-lg rounded-full shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <Link href="/course/start" className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Start the FREE Course Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto border-white/30 bg-white/5 text-white hover:bg-white/10 font-semibold px-8 py-7 text-base rounded-full transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
            >
              <Link href="#explainer" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                </div>
                Watch the 2-Minute Explainer
              </Link>
            </Button>
          </motion.div>

          {/* Quick reassurance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-5 text-white/50 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Takes 2 minutes to start</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 2. PROBLEM AGITATION ═══════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-mesh">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(0_84%_44%/0.05),transparent_70%)]" />

        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-16">
              <SectionLabel>The Hidden Truth</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-bold mt-3">
                The Mortgage Trap Nobody Talks About
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
                Your mortgage isn&apos;t designed to help you own your home. It&apos;s designed to keep you paying interest for 30 years.
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                value: 647000,
                prefix: '$',
                label: 'What your $300K house actually costs on a 30-year mortgage',
                icon: <Target className="h-6 w-6" />,
                stat: '$647,000',
              },
              {
                value: 18,
                suffix: '.5 Years',
                label: 'How long you pay MORE interest than principal',
                icon: <Clock className="h-6 w-6" />,
                stat: '18.5 Years',
              },
              {
                value: 73,
                suffix: '%',
                label: 'Of your first year\'s payment goes to the bank, not your home',
                icon: <Percent className="h-6 w-6" />,
                stat: '73%',
              },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-white rounded-2xl p-8 border border-red-200/50 shadow-lg shadow-red-500/5 h-full text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center text-red-600 mx-auto mb-5">
                      {card.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-red-600 mb-3">
                      {card.stat}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {card.label}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInUp delay={0.4}>
            <div className="text-center mt-12">
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                These numbers are based on a $300,000 mortgage at 6.5% APR over 30 years. Your exact numbers may vary, but the pattern is the same for every homeowner.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ═══════════════════ 3. SOLUTION INTRODUCTION ═══════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-radial">
        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-16">
              <SectionLabel>The Solution</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-bold mt-3">
                There&apos;s a Better Way.<br className="hidden md:block" /> And It&apos;s Been Hiding in Plain Sight.
              </h2>
            </div>
          </FadeInUp>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 relative items-stretch">
              {/* LEFT — Traditional (red) */}
              <FadeInLeft delay={0.1} className="lg:col-span-5">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-red-200 shadow-lg h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-500" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-600 font-bold text-sm uppercase tracking-wider">Traditional Mortgage</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-foreground">The Closed System</h3>
                    <ul className="space-y-4">
                      {[
                        { label: 'Payoff Time', value: '30 Years', bad: true },
                        { label: 'Total Interest', value: '$347,000', bad: true },
                        { label: 'Interest Calculation', value: 'Monthly (front-loaded)', bad: true },
                        { label: 'Flexibility', value: 'None — locked in', bad: true },
                        { label: 'Extra Payments', value: 'Penalties may apply', bad: true },
                        { label: 'Control', value: 'The bank controls everything', bad: true },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-between py-2 border-b border-red-100 last:border-0">
                          <span className="text-muted-foreground text-sm">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{item.value}</span>
                            <X className="h-4 w-4 text-red-400" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeInLeft>

              {/* CENTER — Badge */}
              <ScaleIn delay={0.3} className="lg:col-span-1 flex items-center justify-center py-4 lg:py-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 z-10">
                  <div className="text-center text-white">
                    <div className="text-[10px] font-bold uppercase leading-none">Save</div>
                    <div className="text-sm font-black leading-none">$240K+</div>
                  </div>
                </div>
              </ScaleIn>

              {/* RIGHT — Mortgage Cutter (green) */}
              <FadeInRight delay={0.1} className="lg:col-span-5">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-emerald-200 shadow-lg h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Mortgage Cutter Method</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-foreground">The Open System</h3>
                    <ul className="space-y-4">
                      {[
                        { label: 'Payoff Time', value: '5–7 Years', good: true },
                        { label: 'Total Interest', value: '~$13,000', good: true },
                        { label: 'Interest Calculation', value: 'Daily (you control it)', good: true },
                        { label: 'Flexibility', value: 'Full — deposit & withdraw', good: true },
                        { label: 'Extra Payments', value: 'No penalties, full freedom', good: true },
                        { label: 'Control', value: 'YOU control everything', good: true },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-between py-2 border-b border-emerald-100 last:border-0">
                          <span className="text-muted-foreground text-sm">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{item.value}</span>
                            <Check className="h-4 w-4 text-emerald-500" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeInRight>
            </div>

            <FadeInUp delay={0.5}>
              <div className="text-center mt-10">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold px-10 py-6 text-base rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href="/course/start" className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    See How It Works — FREE
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. MODULE GRID ═══════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-16">
              <SectionLabel>Curriculum</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-bold mt-3">
                10 Modules. 40 Lessons.<br className="hidden md:block" /> Your Complete Blueprint.
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
                The first 4 modules are <span className="text-emerald-600 font-bold">100% FREE</span>. No credit card required.
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-7xl mx-auto">
            {courseModules.map((mod) => (
              <StaggerItem key={mod.id}>
                <GlowCard>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white rounded-2xl p-5 border shadow-sm h-full flex flex-col relative overflow-hidden ${
                      !mod.isPaid ? 'border-emerald-200/60 hover:shadow-emerald-500/10' : 'border-amber-200/60 hover:shadow-amber-500/10'
                    }`}
                  >
                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      {!mod.isPaid ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                          <Sparkles className="h-3 w-3" />
                          FREE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                          <Lock className="h-3 w-3" />
                          PREMIUM
                        </span>
                      )}
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      !mod.isPaid
                        ? 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600'
                        : 'bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-600'
                    }`}>
                      <BookOpen className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Module {mod.number}
                    </div>
                    <h3 className="font-bold text-base mb-2 leading-tight">{mod.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed flex-1 mb-4">
                      {mod.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {getModuleLessonCount(mod)} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getModuleDuration(mod)}
                      </span>
                    </div>

                    {/* CTA */}
                    {!mod.isPaid ? (
                      <Button
                        size="sm"
                        asChild
                        variant="outline"
                        className="w-full text-xs font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full"
                      >
                        <Link href={`/course/module/${mod.number}`} className="flex items-center justify-center gap-1">
                          <Play className="h-3 w-3" />
                          Preview Now
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-xs text-amber-600 font-medium py-2">
                        <Lock className="h-3 w-3" />
                        Upgrade to Unlock
                      </div>
                    )}
                  </motion.div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════ 5. FREE vs PAID COMPARISON ═══════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-radial">
        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-16">
              <SectionLabel>Choose Your Path</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-bold mt-3">
                Start Free. Upgrade When You&apos;re Ready.
              </h2>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* FREE */}
            <FadeInLeft delay={0.1}>
              <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-lg relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30" />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                    <Sparkles className="h-3.5 w-3.5" />
                    FREE — Modules 1-4
                  </div>
                  <h3 className="text-2xl font-bold mb-2">The Awakening</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Everything you need to understand the problem and see the solution in action.
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-emerald-100">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                      <strong className="text-foreground">16</strong> lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      ~3.5 hours
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      { mod: 'M1', name: 'The Problem — Why mortgages are designed against you' },
                      { mod: 'M2', name: 'The Solution — The HELOC strategy revealed' },
                      { mod: 'M3', name: 'The Strategy — Build your personalized blueprint' },
                      { mod: 'M4', name: 'The Preview — See what full implementation looks like' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">
                          <span className="font-bold text-emerald-600">{item.mod}:</span>{' '}
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-500/20"
                  >
                    <Link href="/course/start" className="flex items-center justify-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Start Free Now
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeInLeft>

            {/* PAID */}
            <FadeInRight delay={0.1}>
              <div className="bg-white rounded-2xl p-8 border border-amber-200 shadow-lg relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/30" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200/30 to-transparent" />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                    <Lock className="h-3.5 w-3.5" />
                    PREMIUM — Modules 5-10
                  </div>
                  <h3 className="text-2xl font-bold mb-2">The Implementation</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    The complete toolkit to execute the strategy and become mortgage-free in 5-7 years.
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-amber-100">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-amber-600" />
                      <strong className="text-foreground">24</strong> lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-amber-600" />
                      ~5 hours
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      { mod: 'M5', name: 'Credit Mastery — Boost your score 50+ points' },
                      { mod: 'M6', name: 'The Numbers — Master the math behind the method' },
                      { mod: 'M7', name: 'Bank Selection — Find the best banks in your area' },
                      { mod: 'M8', name: 'The Application — Walk through approval step-by-step' },
                      { mod: 'M9', name: 'Advanced Strategies — Supercharge your savings' },
                      { mod: 'M10', name: 'Action Plan — Your 30/90/365-day roadmap' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">
                          <span className="font-bold text-amber-600">{item.mod}:</span>{' '}
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    asChild
                    variant="outline"
                    className="w-full border-amber-400 text-amber-700 hover:bg-amber-50 font-semibold rounded-full"
                  >
                    <Link href="/purchase" className="flex items-center justify-center gap-2">
                      <Lock className="h-5 w-5" />
                      Upgrade to Premium
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeInRight>
          </div>

          <FadeInUp delay={0.3}>
            <div className="text-center mt-10">
              <p className="text-muted-foreground text-sm">
                <ArrowRight className="h-4 w-4 inline mr-1" />
                Start with the free modules. Upgrade only when you&apos;re convinced it works.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ═══════════════════ 6. TESTIMONIALS ═══════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-background" />

        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-16">
              <SectionLabel>Success Stories</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-bold mt-3">
                Real Homeowners. Real Results.
              </h2>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                text: "I was shocked when I ran my numbers. We were on track to pay $412,000 in interest. The Mortgage Cutter method showed us how to cut that to $47,000. We paid off our home in 6 years.",
                author: "James T.",
                location: "Austin, TX",
                metric: "$365K saved",
                initials: "JT",
              },
              {
                text: "I thought this was too good to be true. But the math doesn't lie. 7 years and 3 months — that's how long it took us to pay off a $380K mortgage.",
                author: "Maria S.",
                location: "Toronto",
                metric: "7.3 years",
                initials: "MS",
              },
              {
                text: "The free modules alone were worth more than my $300/hour financial advisor. The paid course paid for itself in the first month.",
                author: "David K.",
                location: "London",
                metric: "Self-funded",
                initials: "DK",
              },
            ].map((testimonial, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 border border-border/50 shadow-lg shadow-black/5 h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {testimonial.metric}
                    </span>
                  </div>
                  <p className="italic text-foreground leading-relaxed flex-1">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════ 7. TOOL INTEGRATION TEASE ═══════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background">
        <div className="container mx-auto px-4 relative">
          <FadeInUp>
            <div className="text-center mb-16">
              <SectionLabel>Bonus Tools</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-bold mt-3">
                Powerful Tools Included FREE
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
                Every student gets access to our premium suite of mortgage planning tools.
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Calculator className="h-6 w-6" />,
                title: 'Savings Calculator',
                desc: 'See YOUR exact savings in 60 seconds. Plug in your numbers and watch the magic.',
                href: '/questionnaire',
                color: 'from-primary/10 to-emerald-500/10',
                iconColor: 'text-primary',
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Chunker Method',
                desc: 'Model lump-sum payments and see exactly how they impact your payoff timeline.',
                href: '/members/chunker',
                color: 'from-yellow-500/10 to-amber-500/10',
                iconColor: 'text-yellow-600',
              },
              {
                icon: <Landmark className="h-6 w-6" />,
                title: 'Bank Screener',
                desc: 'Find the best banks in your area with the best HELOC rates and terms.',
                href: '/members/bank-screener',
                color: 'from-blue-500/10 to-indigo-500/10',
                iconColor: 'text-blue-600',
              },
              {
                icon: <ArrowLeftRight className="h-6 w-6" />,
                title: 'Lender Loyalty Audit',
                desc: 'See if your bank is giving you the best deal — or ripping you off.',
                href: '/members/lender-loyalty-audit',
                color: 'from-orange-500/10 to-red-500/10',
                iconColor: 'text-orange-600',
              },
            ].map((tool, i) => (
              <StaggerItem key={i}>
                <Link href={tool.href} className="block h-full">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center ${tool.iconColor} mb-4`}>
                      {tool.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{tool.desc}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium">
                      <span>Try it free</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════ 8. FAQ ═══════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-radial">
        <div className="container mx-auto px-4 relative max-w-3xl">
          <FadeInUp>
            <div className="text-center mb-16">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="text-3xl md:text-5xl font-bold mt-3">
                Got Questions? We&apos;ve Got Answers.
              </h2>
            </div>
          </FadeInUp>

          <StaggerContainer className="space-y-4">
            {[
              {
                q: "Is this really free to start?",
                a: "Yes! Modules 1-4 are 100% free. No credit card, no obligation. You'll get full access to the first 4 modules with 16 video lessons — enough to understand the complete strategy and see real results. Only upgrade if you want the advanced implementation modules.",
              },
              {
                q: "Will this work in my country?",
                a: "Yes. The method works in the USA (First-Lien HELOC), Canada (readvanceable mortgages with HELOC), and UK (offset mortgages). The course includes country-specific modules that break down exact products, banks, and regulations for each market.",
              },
              {
                q: "Do I need to refinance?",
                a: "No. In most cases, you'll get a HELOC from your existing bank. The course teaches you exactly what to ask for and how to negotiate the best terms. Many students get approved without any formal refinancing process.",
              },
              {
                q: "What if my credit score is low?",
                a: "Module 5 (Credit Mastery) teaches you exactly how to boost your score 50+ points in 30 days. We've had students go from 580 to 640+ using our proven system. A higher score also means better HELOC rates, saving you even more.",
              },
              {
                q: "How long does it take to see results?",
                a: "Most students see their payoff timeline shrink the moment they implement Step 1. The free modules include a calculator where you can plug in your numbers and see your new payoff date instantly. Typical results: 5-7 years instead of 30.",
              },
              {
                q: "Is this legal?",
                a: "100% legal. HELOCs are standard banking products offered by every major bank. Offset mortgages are mainstream in the UK and Australia. You're simply using a financial product more strategically — nothing illegal, nothing shady.",
              },
              {
                q: "What's the catch?",
                a: "No catch. We're confident you'll upgrade after seeing the free modules work. The free content alone saves most homeowners $100,000+ in interest. When you see those numbers, the premium upgrade becomes a no-brainer.",
              },
              {
                q: "Can I cancel if I upgrade?",
                a: "Yes. We offer a 30-day money-back guarantee. If you don't love the course, email us for a full refund — no questions asked. Over 10,000 students have enrolled and our refund rate is under 2%.",
              },
            ].map((faq, i) => (
              <StaggerItem key={i}>
                <FAQItem question={faq.q} answer={faq.a} index={i} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════ 9. FINAL CTA ═══════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
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
              <span className="text-white/70 text-sm font-medium">Join 10,000+ homeowners on the path to financial freedom</span>
              <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white leading-tight">
              Your Mortgage-Free Life<br />
              <span className="text-gradient">Starts Here</span>
            </h2>

            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
              Join 10,000+ homeowners who discovered the path to financial freedom. The first 4 modules are 100% free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold px-12 py-8 text-xl rounded-full shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="/course/start" className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6" />
                  Start the FREE Course
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Takes 2 minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FAQ ACCORDION ITEM (local component)
   ═══════════════════════════════════════════════════════════════ */

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: open ? 'hsl(220 14.3% 97.9%)' : 'hsl(0 0% 100%)' }}
      className="rounded-2xl border border-border/50 shadow-sm overflow-hidden transition-colors duration-300"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-6 text-left"
      >
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <span className="flex-1 font-semibold text-foreground">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pl-[4.5rem]">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
