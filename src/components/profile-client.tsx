'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

const profileFormSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters.'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export function ProfileClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { user, updateUser } = useAuth();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  });

  useEffect(() => {
    if (user) {
        const savedContact = localStorage.getItem(`emergencyContact_${user.uid}`);
        if (savedContact) {
          const { name, phone } = JSON.parse(savedContact);
          form.reset({ 
            displayName: user.displayName || '',
            emergencyContactName: name, 
            emergencyContactPhone: phone 
          });
        } else {
            form.reset({
                displayName: user.displayName || '',
                emergencyContactName: '',
                emergencyContactPhone: '',
            });
        }
    }
    setIsPageLoading(false);
  }, [form, user]);


  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update your profile.' });
        return;
    }
    setIsLoading(true);
    try {
      // Update user's display name
      if (values.displayName) {
        updateUser({ displayName: values.displayName });
      }

      // Save emergency contact to local storage
      const emergencyContact = {
        name: values.emergencyContactName,
        phone: values.emergencyContactPhone,
      };
      localStorage.setItem(`emergencyContact_${user.uid}`, JSON.stringify(emergencyContact));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Profile Updated',
        description: 'Your information has been saved successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not save profile.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isPageLoading || !user) {
      return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your profile and emergency contact details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3 className="text-lg font-semibold pt-4 border-t mt-4">Emergency Contact</h3>
            <CardDescription>This contact will be notified if you use the SOS feature.</CardDescription>
             <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
