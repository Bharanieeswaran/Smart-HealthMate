'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Apple, Dumbbell, Loader2, BrainCircuit } from 'lucide-react';

import { healthRecommendations } from '@/ai/flows/health-recommendations';
import { HealthRecommendationsOutputSchema, type HealthRecommendationsOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  age: z.coerce.number().min(1, 'Age must be a positive number.').max(120, 'Age seems too high.'),
  gender: z.string().min(1, 'Please select a gender.'),
  bmi: z.coerce.number().min(10, 'BMI seems too low.').max(60, 'BMI seems too high.'),
  conditions: z.string().optional(),
  healthGoals: z.string().min(10, {
    message: 'Please describe your health goals in at least 10 characters.',
  }),
});

export function RecommendationsClient() {
  const [result, setResult] = useState<HealthRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      gender: 'female',
      bmi: 22.5,
      conditions: '',
      healthGoals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await healthRecommendations(values);
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Health Profile</CardTitle>
          <CardDescription>Provide your details to receive personalized diet and exercise recommendations from our AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMI (Body Mass Index)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 24.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <FormDescription>You can use an online calculator to find your BMI.</FormDescription>
              <FormField
                control={form.control}
                name="conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Health Conditions</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Type 2 Diabetes, High Blood Pressure (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="healthGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Lose 10 pounds, build muscle, have more energy." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get My Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <p className="text-destructive">{error}</p>
      )}

      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-4 font-headline">Your Personalized Plan</h2>
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-primary" />
                  Diet Plan
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base prose prose-sm max-w-none">
                <div className="grid gap-2">
                    <p><span className="font-semibold">Breakfast: </span>{result.dietPlan.breakfast}</p>
                    <p><span className="font-semibold">Lunch: </span>{result.dietPlan.lunch}</p>
                    <p><span className="font-semibold">Dinner: </span>{result.dietPlan.dinner}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  Exercise Plan
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base whitespace-pre-line prose prose-sm max-w-none">
                {result.exercisePlan}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  Mental Wellness Tips
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base whitespace-pre-line prose prose-sm max-w-none">
                {result.mentalWellnessTips}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
