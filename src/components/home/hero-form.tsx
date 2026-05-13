'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthButtons } from '../auth/auth-buttons';
import { ForgotPasswordDialog } from '../auth/forgot-password-dialog';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Shield, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export function HeroForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  useEffect(() => {
    if (user) {
      // OAuth providers usually have verified emails
      const isOAuth = user.providerData.some(
        (p) => p.providerId === 'google.com' || p.providerId === 'apple.com'
      );
      if (isOAuth || user.emailVerified) {
        router.push('/questionnaire');
      } else {
        router.push('/verify-email');
      }
    }
  }, [user, router]);

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSignup(values: z.infer<typeof signupSchema>) {
    if (!auth || !firestore) {
      toast({ variant: 'destructive', title: 'Auth service not available.', description: 'Please try again in a moment.' });
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: values.name });

      // Create the lead document in Firestore (Non-blocking)
      setDocumentNonBlocking(doc(firestore, 'leads', newUser.uid), {
        id: newUser.uid,
        name: values.name,
        email: values.email,
        status: 'registered',
        submissionDate: serverTimestamp(),
      }, { merge: true });

      // Send email verification
      await sendEmailVerification(newUser, {
        url: `${window.location.origin}/auth/action`,
        handleCodeInApp: false,
      });

      toast({ title: 'Account Created!', description: 'Please check your email to verify your account.' });
      router.push('/verify-email');
    } catch (error: any) {
      console.error('Error during sign-up:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.code === 'auth/email-already-in-use'
          ? 'This email is already in use. Please sign in instead.'
          : error.message || 'There was an issue creating your account.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onLogin(values: z.infer<typeof loginSchema>) {
    if (!auth) {
      toast({ variant: 'destructive', title: 'Auth service not available.', description: 'Please try again in a moment.' });
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const loggedInUser = userCredential.user;

      if (!loggedInUser.emailVerified) {
        // Auto-resend verification email on login if still unverified
        await sendEmailVerification(loggedInUser, {
          url: `${window.location.origin}/auth/action`,
          handleCodeInApp: false,
        });
        toast({ title: 'Email Not Verified', description: 'A new verification link has been sent to your email.' });
        router.push('/verify-email');
        return;
      }

      toast({ title: 'Welcome Back!', description: 'Redirecting you to the questionnaire.' });
      router.push('/questionnaire');
    } catch (error: any) {
      console.error('Error during sign-in:', error);
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
          ? 'Invalid email or password. Please try again.'
          : error.message || 'There was an issue signing in.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-xl border border-white/30 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-400 to-primary" />

          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Free Instant Access</span>
            </div>
            <CardTitle className="text-2xl">Get Your Free Blueprint</CardTitle>
            <CardDescription>Instantly see your potential savings. No credit card required.</CardDescription>

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
            <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'signup' | 'login')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Log In</TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
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
                      control={signupForm.control}
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
                      control={signupForm.control}
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
              </TabsContent>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
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
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordOpen(true);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Log In
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            <AuthButtons />

            <p className="text-center text-xs text-muted-foreground mt-4">
              By signing up, you agree to our Terms of Service.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        defaultEmail={loginForm.getValues('email')}
      />
    </>
  );
}
