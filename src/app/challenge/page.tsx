'use client';

import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Zap, Clock, ShieldCheck, Calculator, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroForm } from '@/components/home/hero-form';

const days = [
  { day: 1, title: 'The Interest Trap', desc: "Why banks pray you never discover this", icon: <Zap className="h-5 w-5" /> },
  { day: 2, title: 'Your Numbers', desc: "Calculate exactly how much you're losing", icon: <Calculator className="h-5 w-5" /> },
  { day: 3, title: 'The Chunker Method', desc: 'The strategy banks hide from you', icon: <TrendingUp className="h-5 w-5" /> },
  { day: 4, title: 'Real Proof', desc: 'Homeowners who cut 8-12 years', icon: <Award className="h-5 w-5" /> },
  { day: 5, title: 'Full Blueprint', desc: 'The complete system opens to you', icon: <ShieldCheck className="h-5 w-5" /> },
];

export default function ChallengePage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-slate-950 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-400 mb-6">
              <Clock className="h-4 w-4" />
              5 Days &bull; 100% Free
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              Cut <span className="text-blue-500 italic">8-12 Years</span> Off Your Mortgage{' '}
              <span className="text-emerald-400 italic">Without Extra Income</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Join the 5-Day Mortgage Freedom Challenge. One lesson per day. One simple strategy
              that banks hope you never discover.
            </p>
          </motion.div>

          {/* Signup or CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            {user ? (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-300 font-semibold">You&apos;re enrolled, {user.displayName || user.email?.split('@')[0]}!</p>
                  <p className="text-slate-400 text-sm mt-1">Check your inbox for Day 1.</p>
                </div>
                <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl">
                  <Link href="/learn/lesson/1">
                    Start Day 1 Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <p className="text-slate-300 font-semibold mb-4">Enter your details to join the challenge:</p>
                  <HeroForm />
                </div>
                <p className="text-slate-500 text-sm">No spam. Unsubscribe anytime. Your data is private.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What You&apos;ll Discover</h2>
            <p className="text-slate-400 max-w-xl mx-auto">One lesson per day. Each builds on the last. By Day 5, you&apos;ll have the complete blueprint.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map((item, i) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-slate-900/50 border border-white/5 hover:border-blue-500/30 rounded-2xl p-5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 group-hover:bg-blue-500/20 transition-colors">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Day {item.day}</span>
                <h3 className="font-bold text-white mt-1 mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-10">Join 10,000+ Homeowners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "We shaved 9 years and about $42,000 in interest — without switching banks.", author: "Sarah L., Toronto", metric: "$42,000 saved" },
              { text: "Our plan showed a clear path to being debt-free. We're saving ~$500/month.", author: "Michael R., Calgary", metric: "$500/mo" },
              { text: "I finally see how to beat the interest game. This changed our timeline.", author: "Priya P., Vancouver", metric: "11 years cut" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-left"
              >
                <p className="text-slate-300 italic leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-400">{t.author}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{t.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-slate-400 mb-8">Day 1 drops in your inbox immediately. Zero cost. Zero obligation.</p>
          {user ? (
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-10 rounded-xl text-lg">
              <Link href="/learn/lesson/1">
                Start Day 1 Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <div className="max-w-md mx-auto">
              <HeroForm />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
