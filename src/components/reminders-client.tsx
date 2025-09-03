
'use client';

import { useState, useEffect } from 'react';
import { useForm, useForm as useSupplementForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon, Plus, Trash2, Bell, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { type SupplementRecommendationsOutput } from '@/ai/schemas';
import { supplementRecommendations } from '@/ai/flows/supplement-recommendations';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const reminderFormSchema = z.object({
  text: z.string().min(3, {
    message: 'Reminder must be at least 3 characters.',
  }),
  date: z.date({
    required_error: 'A date is required.',
  }),
});

interface Reminder {
  id: string;
  text: string;
  date: string;
}

const supplementFormSchema = z.object({
  healthGoals: z.string().min(5, {
    message: 'Please describe your health goals in at least 5 characters.',
  }),
});


export function RemindersClient() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupplementLoading, setIsSupplementLoading] = useState(false);
  const [supplementResult, setSupplementResult] = useState<SupplementRecommendationsOutput | null>(null);
  const [supplementError, setSupplementError] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      const savedReminders = localStorage.getItem(`reminders_${user.uid}`);
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    }
  }, [user]);

  const reminderForm = useForm<z.infer<typeof reminderFormSchema>>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      text: '',
      date: new Date(),
    },
  });

  const supplementForm = useSupplementForm<z.infer<typeof supplementFormSchema>>({
    resolver: zodResolver(supplementFormSchema),
    defaultValues: {
      healthGoals: '',
    },
  });

  function onReminderSubmit(values: z.infer<typeof reminderFormSchema>) {
    if (!user) return;
    setIsLoading(true);

    const newReminder: Reminder = {
      id: new Date().toISOString(),
      text: values.text,
      date: values.date.toISOString(),
    };

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem(`reminders_${user.uid}`, JSON.stringify(updatedReminders));

    toast({
        title: 'Reminder Set!',
        description: `We'll remind you about "${values.text}".`,
    });
    
    reminderForm.reset();
    setIsLoading(false);
  }

  function deleteReminder(id: string) {
    if (!user) return;
    const updatedReminders = reminders.filter((r) => r.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem(`reminders_${user.uid}`, JSON.stringify(updatedReminders));
     toast({
        title: 'Reminder Removed',
        description: 'The reminder has been deleted.',
        variant: 'destructive'
    });
  }

  async function onSupplementSubmit(values: z.infer<typeof supplementFormSchema>) {
    setIsSupplementLoading(true);
    setSupplementError(null);
    setSupplementResult(null);

    try {
      const response = await supplementRecommendations(values);
      setSupplementResult(response);
    } catch (e) {
      console.error(e);
      setSupplementError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSupplementLoading(false);
    }
  }


  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle>Add a New Reminder</CardTitle>
            <CardDescription>Set reminders for medications, appointments, or wellness activities.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...reminderForm}>
                <form onSubmit={reminderForm.handleSubmit(onReminderSubmit)} className="space-y-4">
                <FormField
                    control={reminderForm.control}
                    name="text"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reminder</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Take Vitamin D supplement" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={reminderForm.control}
                    name="date"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={'outline'}
                                className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                                )}
                            >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()-1)) }
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add Reminder
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Your Active Reminders</CardTitle>
            </CardHeader>
            <CardContent>
                {reminders.length > 0 ? (
                    <ul className="space-y-3">
                        {reminders
                            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((reminder) => (
                            <li key={reminder.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">{reminder.text}</p>
                                        <p className="text-sm text-muted-foreground">Due: {format(new Date(reminder.date), 'PPP')}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete reminder</span>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">You have no active reminders.</p>
                )}
            </CardContent>
        </Card>
      </div>

       <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Supplement Recommender</CardTitle>
            <CardDescription>Describe your health goals to get AI-powered supplement recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...supplementForm}>
              <form onSubmit={supplementForm.handleSubmit(onSupplementSubmit)} className="space-y-4">
                <FormField
                  control={supplementForm.control}
                  name="healthGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Goals</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., improve energy levels, better sleep, support joint health" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSupplementLoading}>
                  {isSupplementLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Get Suggestions
                </Button>
              </form>
            </Form>

            {supplementError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{supplementError}</AlertDescription>
              </Alert>
            )}

            {supplementResult && (
              <div className="mt-6 space-y-4">
                {supplementResult.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-bold">{rec.supplement}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rec.benefit}</p>
                    <p className="text-xs font-medium mt-2">Dosage: <span className="font-normal">{rec.dosage}</span></p>
                  </div>
                ))}
                 <Alert variant="destructive" className="mt-4 text-xs">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-xs font-bold">Disclaimer</AlertTitle>
                    <AlertDescription>{supplementResult.disclaimer}</AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
