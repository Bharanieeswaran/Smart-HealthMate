
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HeartPulse, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PublicHeader } from '@/components/public-header';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { signInUser } = useAuth();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const userDatabase = JSON.parse(localStorage.getItem('userDatabase') || '{}');

    if (userDatabase[values.email]) {
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: 'This email is already in use. Please log in instead.',
        });
        setIsLoading(false);
        return;
    }

    const newUser = {
        uid: `user-${Date.now()}`,
        email: values.email,
        displayName: values.fullName,
        password: values.password // NOTE: Storing passwords in plain text is insecure. This is for demo purposes ONLY.
    };

    userDatabase[values.email] = newUser;
    localStorage.setItem('userDatabase', JSON.stringify(userDatabase));

    const { password, ...userToSign } = newUser;
    signInUser(userToSign);
    
    toast({ title: 'Success', description: 'Your account has been created.' });
    router.push('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <HeartPulse className="mx-auto h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                    <CardDescription>Enter your information to get started</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                            <Input placeholder="John Doe" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="name@example.com" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                            <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                    Log In
                    </Link>
                </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
