
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { AuthButtons } from '../auth/auth-buttons';
import { Separator } from '../ui/separator';
import { useAuth, initializeFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, AuthError } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export function HeroForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Authentication service not available",
            description: "Please try again in a moment.",
        });
        setIsSubmitting(false);
        return;
    }
    const tempPassword = Math.random().toString(36).slice(-10);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, tempPassword);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: values.name,
      });

      // Direct Firestore initialization to guarantee instance is available
      const { firestore } = initializeFirebase();
      const mailCollection = collection(firestore, 'mail');
      
      await addDoc(mailCollection, {
        to: [values.email],
        message: {
          subject: 'Welcome to Mortgage Cutter!',
          html: `Hi ${values.name || 'there'},<br><br>Thanks for joining Mortgage Cutter. We're excited to help you on your journey to financial freedom.<br><br>You can start by using our free estimator to see your potential savings: <a href="https://mortgagecutter.com/questionnaire">Run Your Numbers Now</a>.<br><br>Best,<br>The Mortgage Cutter Team`,
        },
      });
      
      router.push('/questionnaire');

    } catch (error) {
      const authError = error as AuthError;
      console.error("Firebase Auth Error:", authError.code, authError.message);
      
      let title = "An error occurred";
      let description = "There was an issue creating your account. Please try again.";

      if (authError.code === 'auth/email-already-in-use') {
        title = "Email already in use";
        description = "This email is already registered. Please sign in or use a different email.";
      } else if (authError.code === 'auth/invalid-email') {
        title = "Invalid Email";
        description = "Please enter a valid email address.";
      } else if (authError.code === 'auth/network-request-failed') {
        title = "Network Error";
        description = "Could not connect to Firebase. Please check your internet connection.";
      }

      toast({
        variant: "destructive",
        title: title,
        description: description,
      });

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      {...field}
                      disabled={isSubmitting}
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
                  <FormLabel className="sr-only">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Get My Free Savings Blueprint'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Form>
        
        <div className="flex items-center my-4">
            <div className="flex-grow border-t border-muted-foreground/20"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-muted-foreground/20"></div>
        </div>

        <AuthButtons />

        <p className="text-center text-xs text-gray-700 dark:text-gray-300 mt-4">
            (no credit card needed, no obligation)
        </p>
        <div className="text-center text-gray-700 dark:text-gray-300 text-sm mt-4">
            <p className="font-semibold">Trusted by over 2,000 families | As featured in: Forbes, Globe and Mail</p>
        </div>
      </CardContent>
    </Card>
  );
}
