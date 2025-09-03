'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  CheckSymptomsInputSchema,
  CheckSymptomsOutputSchema,
  type CheckSymptomsInput,
  type CheckSymptomsOutput,
} from '@/ai/schemas';

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: z.object({symptoms: CheckSymptomsInputSchema})},
  output: {schema: CheckSymptomsOutputSchema},
  prompt: `You are an advanced AI-powered symptom checker. Your task is to provide a detailed and careful analysis of the user's symptoms.

User's Symptoms:
"{{{symptoms}}}"

Based on these symptoms, provide your detailed analysis. For each possible condition, provide a rationale explaining why it might be a match and give clear, actionable next steps. Your general advice should be practical and easy to follow.`,
});

export const checkSymptomsFlow = ai.defineFlow(
  {
    name: 'checkSymptomsFlow',
    inputSchema: CheckSymptomsInputSchema,
    outputSchema: CheckSymptomsOutputSchema,
  },
  async symptoms => {
    const {output} = await symptomCheckerPrompt({symptoms});
    return output!;
  }
);


export async function checkSymptoms(
  symptoms: CheckSymptomsInput
): Promise<CheckSymptomsOutput> {
  return checkSymptomsFlow(symptoms);
}
