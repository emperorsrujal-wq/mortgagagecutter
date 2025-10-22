
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Call the function to subscribe the user to the email service.
    await subscribeToEmailService(values);

    // After attempting to subscribe, redirect the user.
    // In a real app, you might want to handle subscription failures gracefully.

    setIsSubmitting(false);
    router.push('/questionnaire');
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Save Thousands in Interest Payment to Banks</CardTitle>
        <CardDescription>
          Just start saving smartly.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              {isSubmitting ? 'Submitting...' : 'Show Me My Savings'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-center text-xs text-muted-foreground pt-2">
              100% Free. No obligation.
            </p>
          </form>
        </Form>
        <div className="relative my-4">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-sm text-muted-foreground">
            OR
          </span>
        </div>
        <div className="space-y-2">
         <AuthButtons />
        </div>
      </CardContent>
    </Card>
  );
}
