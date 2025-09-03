'use server';
/**
 * @fileOverview An AI agent for reading and interpreting medical prescriptions.
 * 
 * - readPrescription - A function that handles the prescription analysis process.
 * - PrescriptionInputSchema - The input type for the readPrescription function.
 * - PrescriptionOutputSchema - The return type for the readPrescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  PrescriptionInputSchema,
  PrescriptionOutputSchema,
  type PrescriptionInput,
  type PrescriptionOutput,
} from '@/ai/schemas';

const prompt = ai.definePrompt({
  name: 'prescriptionReaderPrompt',
  input: {schema: PrescriptionInputSchema},
  output: {schema: PrescriptionOutputSchema},
  prompt: `You are an expert AI assistant specializing in interpreting medical prescriptions from images.

Your task is to analyze the provided image of a medical prescription and extract the following information accurately:
- Patient's Name
- Doctor's Name and contact information
- Date of Prescription
- Medication details (Name, Dosage, Form like 'Tablet' or 'Capsule')
- Instructions for use (Frequency, Route of administration)
- Quantity prescribed
- Number of refills authorized

If any information is not clearly visible or is absent from the prescription, leave the corresponding field blank. Do not guess or infer information that is not present.
Pay close attention to details, especially medication names and dosages, to ensure accuracy.

Analyze this prescription image:
{{media url=imageDataUri}}`,
});

export const readPrescriptionFlow = ai.defineFlow(
  {
    name: 'readPrescriptionFlow',
    inputSchema: PrescriptionInputSchema,
    outputSchema: PrescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function readPrescription(
  input: PrescriptionInput
): Promise<PrescriptionOutput> {
  return readPrescriptionFlow(input);
}
