
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Pill, Loader2 } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const medicationFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Medication name must be at least 2 characters.',
  }),
  dosage: z.string().min(1, {
    message: 'Please enter a dosage (e.g., "500mg").',
  }),
  frequency: z.string().min(1, {
    message: 'Please select a frequency.',
  }),
});

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export function MedicationClient() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const savedMedications = localStorage.getItem(`medications_${user.uid}`);
      if (savedMedications) {
        setMedications(JSON.parse(savedMedications));
      }
    }
  }, [user]);

  const form = useForm<z.infer<typeof medicationFormSchema>>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: '',
      dosage: '',
      frequency: '',
    },
  });

  function onSubmit(values: z.infer<typeof medicationFormSchema>) {
    if (!user) return;
    setIsLoading(true);

    const newMedication: Medication = {
      id: new Date().toISOString(),
      ...values,
    };

    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    localStorage.setItem(`medications_${user.uid}`, JSON.stringify(updatedMedications));

    toast({
        title: 'Medication Added!',
        description: `${values.name} has been added to your list.`,
    });
    
    form.reset();
    setIsLoading(false);
  }

  function deleteMedication(id: string) {
    if (!user) return;
    const updatedMedications = medications.filter((r) => r.id !== id);
    setMedications(updatedMedications);
    localStorage.setItem(`medications_${user.uid}`, JSON.stringify(updatedMedications));
     toast({
        title: 'Medication Removed',
        description: 'The medication has been deleted from your list.',
        variant: 'destructive'
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle>Add a New Medication</CardTitle>
            <CardDescription>Keep track of your medications and dosages.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Medication Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Ibuprofen" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 200mg" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select how often to take" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="twice-daily">Twice Daily</SelectItem>
                            <SelectItem value="as-needed">As Needed</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add Medication
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
      </div>

       <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Your Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
                {medications.length > 0 ? (
                    <ul className="space-y-3">
                        {medications
                            .map((med) => (
                            <li key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                <div className="flex items-center gap-3">
                                    <Pill className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">{med.name}</p>
                                        <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => deleteMedication(med.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete medication</span>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">You have no medications listed.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
