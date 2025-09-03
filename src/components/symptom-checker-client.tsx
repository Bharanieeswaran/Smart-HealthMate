
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Lightbulb, Loader2, Hand, ShieldAlert, Activity } from 'lucide-react';

import { checkSymptoms } from '@/ai/flows/ai-symptom-checker';
import { type CheckSymptomsOutput } from '@/ai/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe your symptoms in at least 10 characters.',
  }),
});

const triageLevelInfo = {
    'self-care': {
        icon: Hand,
        variant: 'default',
        title: 'Self-Care Recommended',
        description: 'Based on your symptoms, self-care at home should be sufficient. Monitor your symptoms and rest.'
    },
    'see GP': {
        icon: Activity,
        variant: 'secondary',
        title: 'Consult a Doctor',
        description: 'Your symptoms suggest it would be best to consult a General Practitioner for advice.'
    },
    'emergency': {
        icon: ShieldAlert,
        variant: 'destructive',
        title: 'Seek Emergency Care',
        description: 'Your symptoms may indicate a serious condition. Please seek immediate medical attention.'
    }
}

export function SymptomCheckerClient() {
  const { user } = useAuth();
  const [result, setResult] = useState<CheckSymptomsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const saveToHistory = (symptoms: string, result: CheckSymptomsOutput) => {
    if (user) {
        const newItem = { symptoms, result, date: new Date().toISOString() };
        const history = JSON.parse(localStorage.getItem(`symptomHistory_${user.uid}`) || '[]');
        history.unshift(newItem); // Add to the beginning of the array
        localStorage.setItem(`symptomHistory_${user.uid}`, JSON.stringify(history));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await checkSymptoms(values.symptoms);
      setResult(response);
      saveToHistory(values.symptoms, response);
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
          <CardTitle>Describe Your Symptoms</CardTitle>
          <CardDescription>Enter your symptoms in the text box below. Be as descriptive as possible for the best results.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I have a sore throat, a runny nose, and I've been coughing for 3 days."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Symptoms
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div>
            <h2 className="text-xl font-semibold mb-4 font-headline">Analysis Results</h2>
            <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>
                This AI symptom checker is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </AlertDescription>
            </Alert>
            
            {result.triage_level && (() => {
                const TriageIcon = triageLevelInfo[result.triage_level].icon;
                return (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <TriageIcon className={cn("h-6 w-6", result.triage_level === 'emergency' ? 'text-destructive' : 'text-primary')} />
                                {triageLevelInfo[result.triage_level].title}
                            </CardTitle>
                             <CardDescription>
                                {triageLevelInfo[result.triage_level].description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )
            })()}


            <div className="grid gap-6 md:grid-cols-2">
            {result.conditions.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {item.condition}
                    <Badge variant={item.confidence > 0.7 ? 'default' : 'secondary'}>{Math.round(item.confidence * 100)}% Conf.</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={item.confidence * 100} className="mb-4 h-2" />
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Next Steps</h4>
                      <p className="text-sm text-muted-foreground">{item.nextSteps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>General Advice</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        {result.advice.map((adv, i) => <li key={i}>{adv}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
