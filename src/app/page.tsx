
'use client';

import Image from 'next/image';
import { HeroForm } from '@/components/home/hero-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, CheckCircle, TrendingUp, Target, Award, ShieldCheck, Landmark, Calculator, ArrowRight, Zap, Clock, Users, Lock, BookOpen, Trophy, FileText, ArrowLeftRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeInUp, FadeInLeft, FadeInRight, ScaleIn, StaggerContainer, StaggerItem, GlowCard, FloatingElement, GradientText } from '@/components/ui/animations';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  const founderImage = PlaceHolderImages.find((p) => p.id === 'testimonial-person');

  return (
    <>
      <div className="flex-1 flex flex-col">

        {/* Scarcity Bar */}
        <motion.div 
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          id="urgency" 
          className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-black text-center py-2.5 text-sm font-bold z-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
          <span className="relative flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            Only 25 free plans left this week — claim yours before the limit resets on Sunday.
          </span>
        </motion.div>
          
        {/* Hero Section */}
        <section id="hero" className="relative w-full flex-1 flex items-center justify-center py-24 md:py-36 lg:py-44 overflow-hidden">
          {/* Background Image */}
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Couple reviewing their plan from a mortgage payoff estimator to achieve financial freedom sooner."
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(196_84%_44%/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(173_58%_39%/0.1),transparent_50%)]" />

          {/* Floating decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center gap-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
            >
              <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
              <span className="text-white/90 text-sm font-medium">Trusted by 10,000+ homeowners</span>
            </motion.div>

            <div className="max-w-[720px] text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
              >
                Cut <span className="text-gradient">8–12 Years</span> Off Your Mortgage & Save{' '}
                <span className="text-gradient">$30,000–$60,000</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
              >
                Discover how thousands of homeowners pay off their mortgage years faster — without extra income or switching banks.
              </motion.p>
            </div>

            <div className="w-full max-w-md">
              <HeroForm />
            </div>

            {/* Quick stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm"
            >
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Takes 60 seconds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>No credit check</span>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Objection/Benefits Bullets */}
        <section id="objections" className="relative py-20 bg-gradient-mesh overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(196_84%_44%/0.05),transparent_70%)]" />
          
          <div className="container mx-auto px-4 relative">
            <FadeInUp>
              <div className="text-center mb-12">
                <span className="text-primary font-bold text-sm uppercase tracking-widest">Why Homeowners Love Us</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3">Everything you need to beat the interest trap</h2>
              </div>
            </FadeInUp>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: <Target className="h-6 w-6" />, title: 'Save $30,000–$60,000+', desc: 'In potential interest over the life of your mortgage' },
                { icon: <Clock className="h-6 w-6" />, title: 'Cut 8–12 Years', desc: 'No extra income needed — just smarter payments' },
                { icon: <Landmark className="h-6 w-6" />, title: 'Keep Your Bank', desc: 'Works with any bank — no switching required' },
                { icon: <Zap className="h-6 w-6" />, title: 'No Paperwork', desc: 'No refinancing or complex applications' },
                { icon: <ShieldCheck className="h-6 w-6" />, title: 'Fast & Private', desc: 'See your plan in ~60 seconds, fully secure' },
                { icon: <Award className="h-6 w-6" />, title: '100% Free', desc: 'No obligation, no credit check, no catch' },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <GlowCard>
                    <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm h-full">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 flex items-center justify-center text-primary mb-4">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </GlowCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Social Proof */}
        <section id="social-proof" className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-background" />
          
          <div className="container mx-auto px-4 relative">
            <FadeInUp>
              <div className="text-center mb-12">
                <span className="text-primary font-bold text-sm uppercase tracking-widest">Testimonials</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3">Real homeowners. Real results.</h2>
              </div>
            </FadeInUp>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { 
                  text: "We shaved 9 years and about $42,000 in interest — without switching banks.",
                  author: "Sarah L., Toronto",
                  metric: "$42,000 saved"
                },
                { 
                  text: "Our plan showed a clear path to being debt-free. We're saving ~$500/month.",
                  author: "Michael R., Calgary",
                  metric: "$500/mo"
                },
                { 
                  text: "I finally see how to beat the interest game. This changed our timeline.",
                  author: "Priya P., Vancouver",
                  metric: "11 years cut"
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
                    <p className="italic text-foreground leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.author.charAt(0)}
                      </div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <FadeInUp delay={0.4}>
              <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">
                Many users report $30,000–$60,000+ in projected interest avoided and 8–12 years off their term (varies by rate and balance).
              </p>
            </FadeInUp>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial" />
          
          <div className="container mx-auto px-4 relative">
            <FadeInUp>
              <div className="text-center mb-16">
                <span className="text-primary font-bold text-sm uppercase tracking-widest">How It Works</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3">Your path to mortgage freedom in 3 steps</h2>
              </div>
            </FadeInUp>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/30 via-emerald-500/30 to-primary/30" />
              
              {[
                { 
                  step: "01", 
                  icon: <Calculator className="w-8 h-8" />, 
                  title: "Enter Your Details", 
                  desc: "Tell us your mortgage amount, rate, and term — takes about 60 seconds." 
                },
                { 
                  step: "02", 
                  icon: <TrendingUp className="w-8 h-8" />, 
                  title: "See Your Savings Blueprint", 
                  desc: "We instantly estimate how much time and interest you could save." 
                },
                { 
                  step: "03", 
                  icon: <ShieldCheck className="w-8 h-8" />, 
                  title: "Start Saving Smartly", 
                  desc: "Follow your plan to cut years off your mortgage without changing banks." 
                },
              ].map((item, i) => (
                <FadeInUp key={i} delay={i * 0.2}>
                  <div className="flex flex-col items-center text-center relative">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        {item.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-primary border-2 border-primary/20 shadow-sm">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                </FadeInUp>
              ))}
            </div>
            
            <FadeInUp delay={0.6}>
              <p className="text-center text-sm text-muted-foreground mt-12">Fast. Private. No credit check.</p>
            </FadeInUp>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
          
          <div className="container mx-auto px-4 relative">
            <FadeInUp>
              <div className="text-center mb-12">
                <span className="text-primary font-bold text-sm uppercase tracking-widest">Learn</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3">Master your mortgage</h2>
                <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Free resources to help you understand, plan, and execute your path to mortgage freedom.</p>
              </div>
            </FadeInUp>
            
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: <Zap className="h-6 w-6" />, title: 'Payoff Blueprint', desc: 'Step-by-step strategy to cut years off your mortgage.', href: '/learn', color: 'from-yellow-500/10 to-amber-500/10', iconColor: 'text-yellow-600' },
                { icon: <Trophy className="h-6 w-6" />, title: 'Financial Academy', desc: 'Regional banking secrets and advanced strategies.', href: '/financial-academy', color: 'from-blue-500/10 to-indigo-500/10', iconColor: 'text-blue-600' },
                { icon: <BookOpen className="h-6 w-6" />, title: 'The Book', desc: 'The complete guide to mortgage freedom.', href: '/book-sales', color: 'from-amber-500/10 to-orange-500/10', iconColor: 'text-amber-600' },
                { icon: <FileText className="h-6 w-6" />, title: 'Blog', desc: 'Latest tips, news, and homeowner stories.', href: '/blog', color: 'from-emerald-500/10 to-teal-500/10', iconColor: 'text-emerald-600' },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <Link href={item.href} className="block h-full">
                    <motion.div 
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center ${item.iconColor} mb-4`}>
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                      <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium">
                        <span>Explore</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial" />
          
          <div className="container mx-auto px-4 relative">
            <FadeInUp>
              <div className="text-center mb-12">
                <span className="text-primary font-bold text-sm uppercase tracking-widest">Tools</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3">Powerful calculators & simulators</h2>
                <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Interactive tools to estimate savings, compare strategies, and audit your lender.</p>
              </div>
            </FadeInUp>
            
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: <Calculator className="h-6 w-6" />, title: 'Savings Estimator', desc: 'See how much interest you could save in 60 seconds.', href: '/questionnaire', color: 'from-primary/10 to-emerald-500/10', iconColor: 'text-primary' },
                { icon: <Zap className="h-6 w-6" />, title: 'Chunker Simulator', desc: 'Model chunk payments and their impact on your term.', href: '/members/chunker', color: 'from-yellow-500/10 to-amber-500/10', iconColor: 'text-yellow-600' },
                { icon: <Landmark className="h-6 w-6" />, title: 'Bank Screener', desc: 'Compare lenders and find hidden fees.', href: '/members/bank-screener', color: 'from-blue-500/10 to-indigo-500/10', iconColor: 'text-blue-600' },
                { icon: <ArrowLeftRight className="h-6 w-6" />, title: 'Lender Loyalty Audit™', desc: 'See if your bank is giving you the best deal.', href: '/members/lender-loyalty-audit', color: 'from-orange-500/10 to-red-500/10', iconColor: 'text-orange-600' },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <Link href={item.href} className="block h-full">
                    <motion.div 
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center ${item.iconColor} mb-4`}>
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                      <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium">
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

        {/* Founder's Note Section */}
        <section id="founder-story" className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/80 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(196_84%_44%/0.08),transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative">
            <FadeInUp>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Decorative quote */}
                  <div className="absolute -top-6 -left-4 text-8xl text-primary/10 font-serif leading-none select-none">&ldquo;</div>
                  
                  <div className="bg-white rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl shadow-black/5">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {founderImage && (
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-500 rounded-full blur-lg opacity-30" />
                          <Image 
                            src={founderImage.imageUrl} 
                            alt="Founder of Mortgage Cutter" 
                            width={140} 
                            height={140} 
                            className="relative rounded-full object-cover w-[140px] h-[140px] border-4 border-white shadow-lg"
                            data-ai-hint={founderImage.imageHint}
                          />
                        </div>
                      )}
                      <div>
                        <span className="text-primary font-bold text-sm uppercase tracking-widest">Founder&apos;s Story</span>
                        <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">Why I Built Mortgage Cutter</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg italic">
                          &ldquo;I started Mortgage Cutter after my own family faced an $87,000 interest trap. We weren&apos;t earning more, and we didn&apos;t want to switch banks. By changing how we directed payments, we cut years off our term. Now, this simple blueprint helps families see how much faster they could be mortgage-free.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial" />
          
          <div className="container mx-auto px-4 relative max-w-3xl">
            <FadeInUp>
              <div className="text-center mb-12">
                <span className="text-primary font-bold text-sm uppercase tracking-widest">FAQ</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3">Frequently Asked Questions</h2>
              </div>
            </FadeInUp>
            
            <StaggerContainer className="space-y-4">
              {[
                { q: "Do I need extra cash to make this work?", a: "No. The blueprint shows ways to reduce interest with your current income and loan." },
                { q: "Will this affect my bank or current mortgage?", a: "No. You keep your bank and terms; this isn't a refinance." },
                { q: "Is my information safe?", a: "Yes. We don't ask for banking logins or do credit checks to show your plan." },
                { q: "What if my rates or numbers change?", a: "Update the inputs any time to see a fresh blueprint — still free." },
                { q: "Does this work in Canada and the U.S.?", a: "Yes. Our approach adapts to both markets." },
                { q: "What happens after I get the plan?", a: "You'll see your estimated savings and next steps. You decide how to proceed." }
              ].map((faq, i) => (
                <StaggerItem key={i}>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-foreground flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground mt-3 ml-9 leading-relaxed">{faq.a}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Risk Reversal */}
        <section id="risk-reversal" className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-emerald-500/5 to-primary/5" />
          
          <div className="container mx-auto px-4 relative text-center max-w-3xl">
            <FadeInUp>
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xl text-foreground font-medium leading-relaxed">
                This is free, private, and no-obligation. No credit checks, no bank changes — just a fast way to see what your interest really costs and how to cut it.
              </p>
            </FadeInUp>
          </div>
        </section>

        {/* Final CTA */}
        <section id="final-cta" className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/50 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(196_84%_44%/0.1),transparent_60%)]" />
          
          <div className="container mx-auto px-4 relative text-center">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to See Your <span className="text-gradient">Savings?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
                Join thousands of homeowners who discovered their path to financial freedom.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold px-10 py-7 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href="#hero" className="flex items-center gap-2">
                    Get My Free Savings Blueprint
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">Takes about 60 seconds — no credit check, no obligation.</p>
            </FadeInUp>
          </div>
        </section>
      </div>
    </>
  );
}
