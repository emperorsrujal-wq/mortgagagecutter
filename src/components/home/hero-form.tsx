'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthButtons } from '../auth/auth-buttons';
import { Separator } from '../ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Shield, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp, collection } from 'firebase/firestore';
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function HeroForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/questionnaire');
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Auth service not available.',
            description: 'Please try again in a moment.',
        });
        return;
    };
    
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: values.name });

      // Create the lead document in Firestore (Non-blocking)
      setDocumentNonBlocking(doc(firestore, "leads", newUser.uid), {
          id: newUser.uid,
          name: values.name,
          email: values.email,
          status: 'registered',
          submissionDate: serverTimestamp(),
      }, { merge: true });

      // Trigger Welcome Email (Non-blocking)
      addDocumentNonBlocking(collection(firestore, "mail"), {
        to: values.email,
        message: {
          subject: "Welcome to Mortgage Cutter!",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563EB;">Welcome to the Movement, ${values.name}!</h1>
              <p>You've just taken the first step toward reclaiming years of your life and thousands of dollars from the bank.</p>
              <p>The "Interest Trap" is real, but now you have the tools to fight back.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://mortgagecutter.com/questionnaire" style="background-color: #2563EB; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Get Your Savings Blueprint Now →</a>
              </div>
              <p>See you on the inside,</p>
              <p><strong>The Mortgage Cutter Team</strong></p>
            </div>
          `
        }
      });

      toast({
        title: 'Account Created!',
        description: "Welcome! We're redirecting you to the questionnaire.",
      });

    } catch (error: any) {
      console.error('Error during sign-up:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.code === 'auth/email-already-in-use'
            ? 'This email is already in use. Please sign in or use a different email.'
            : error.message || 'There was an issue creating your account.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-xl border border-white/30 overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-primary" />
        
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Free Instant Access</span>
          </div>
          <CardTitle className="text-2xl">Get Your Free Blueprint</CardTitle>
          <CardDescription>Instantly see your potential savings. No credit card required.</CardDescription>
          
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span>256-bit Secure</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>60 Seconds</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Jane Doe" 
                        {...field} 
                        className="rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        {...field} 
                        className="rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        {...field} 
                        className="rounded-xl border-border/60 focus:border-primary focus:ring-primary/20 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full rounded-xl bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account & Get Blueprint
              </Button>
            </form>
          </Form>
          
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <AuthButtons />

          <p className="text-center text-xs text-muted-foreground mt-4">
              By signing up, you agree to our Terms of Service.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
