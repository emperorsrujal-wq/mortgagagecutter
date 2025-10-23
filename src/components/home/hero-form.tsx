
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
import { ArrowRight, Lock } from 'lucide-react';
import { useState } from 'react';
import { AuthButtons } from '../auth/auth-buttons';
import { Separator } from '../ui/separator';
import { sendWelcomeEmail } from '@/app/actions';


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

async function subscribeToEmailService(values: z.infer<typeof formSchema>) {
  // This function now triggers the secure server action.
  // It does not wait for the email to be sent to keep the UI fast.
  sendWelcomeEmail(values).catch(error => {
    // The server action already logs errors, but we can log here if needed.
    console.error("Initiating welcome email failed:", error);
  });

  // We immediately return true so the UI can proceed.
  return Promise.resolve(true);
}

export function HeroForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'collectEmail' | 'auth'>('collectEmail');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await subscribeToEmailService(values);
    setIsSubmitting(false);
    setStep('auth');
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
      <CardContent className="pt-6">
        {step === 'collectEmail' ? (
          <>
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
                  {isSubmitting ? 'Generating...' : 'Get My Free Savings Blueprint'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
            <p className="text-center text-xs text-gray-700 dark:text-gray-300 mt-2">
                🔒 Secure · 💬 No spam · ⏱ Takes about 60 seconds
            </p>
            <div className="text-center text-gray-700 dark:text-gray-300 text-sm mt-4">
                <p className="font-semibold">Trusted by over 2,000 families | As featured in: Forbes, Globe and Mail</p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-center font-semibold">Almost there! Sign up to see your results.</p>
            <AuthButtons />
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our Terms of Service. Your personalized results will be available immediately after.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
