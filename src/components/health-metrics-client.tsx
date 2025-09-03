'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { type HealthData } from './health-metrics-chart';

const formSchema = z.object({
  bp_systolic: z.coerce.number().min(50).max(300),
  bp_diastolic: z.coerce.number().min(30).max(200),
  sugar: z.coerce.number().min(30).max(500),
  heartRate: z.coerce.number().min(30).max(220),
  steps: z.coerce.number().min(0).max(50000),
});

export function HealthMetricsClient() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bp_systolic: 120,
      bp_diastolic: 80,
      sugar: 90,
      heartRate: 70,
      steps: 0,
    },
  });

  useEffect(() => {
    if (user) {
      const savedData: HealthData[] = JSON.parse(localStorage.getItem(`healthMetrics_${user.uid}`) || '[]');
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayData = savedData.find(d => d.date === today);
      if (todayData) {
        form.reset(todayData);
        setHasLoggedToday(true);
      }
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsLoading(true);

    const today = format(new Date(), 'yyyy-MM-dd');
    const newData: HealthData = {
        date: today,
        ...values
    };
    
    let savedData: HealthData[] = JSON.parse(localStorage.getItem(`healthMetrics_${user.uid}`) || '[]');
    
    const todayIndex = savedData.findIndex(d => d.date === today);

    if (todayIndex > -1) {
        savedData[todayIndex] = newData; // Update today's entry
    } else {
        savedData.push(newData); // Add new entry
    }

    // Keep only the last 30 days of data to prevent local storage from getting too large
    savedData = savedData.slice(-30);

    localStorage.setItem(`healthMetrics_${user.uid}`, JSON.stringify(savedData));

    toast({
      title: 'Metrics Saved!',
      description: "Your health data for today has been recorded.",
    });

    setHasLoggedToday(true);
    setIsLoading(false);
    
    // This will trigger a re-render in the chart component
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <FormField
              control={form.control}
              name="bp_systolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BP Systolic</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="bp_diastolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BP Diastolic</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sugar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Sugar (mg/dL)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heart Rate (bpm)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steps</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {hasLoggedToday ? 'Update Today\'s Log' : 'Save Today\'s Log'}
        </Button>
      </form>
    </Form>
  );
}
