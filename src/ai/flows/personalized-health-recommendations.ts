'use server';

import {ai} from '@/ai/genkit';
import {
  PersonalizedHealthRecommendationsInputSchema,
  PersonalizedHealthRecommendationsOutputSchema,
  type PersonalizedHealthRecommendationsInput,
  type PersonalizedHealthRecommendationsOutput,
} from '@/ai/schemas';

const prompt = ai.definePrompt({
  name: 'personalizedHealthRecommendationsPrompt',
  input: {schema: PersonalizedHealthRecommendationsInputSchema},
  output: {schema: PersonalizedHealthRecommendationsOutputSchema},
  prompt: `Based on the user's age, BMI, and health conditions, provide personalized diet and exercise recommendations.

- Age: {{{age}}}
- BMI: {{{bmi}}}
- Health Conditions: {{{healthConditions}}}

Provide your recommendations below.`,
});

export const personalizedHealthRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedHealthRecommendationsFlow',
    inputSchema: PersonalizedHealthRecommendationsInputSchema,
    outputSchema: PersonalizedHealthRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function personalizedHealthRecommendations(
  input: PersonalizedHealthRecommendationsInput
): Promise<PersonalizedHealthRecommendationsOutput> {
  return personalizedHealthRecommendationsFlow(input);
}
