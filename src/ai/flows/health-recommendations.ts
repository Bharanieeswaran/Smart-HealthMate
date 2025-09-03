'use server';

import {ai} from '@/ai/genkit';
import {
  HealthRecommendationsInputSchema,
  HealthRecommendationsOutputSchema,
  type HealthRecommendationsInput,
  type HealthRecommendationsOutput,
} from '@/ai/schemas';

const prompt = ai.definePrompt({
  name: 'healthRecommendationsPrompt',
  input: {schema: HealthRecommendationsInputSchema},
  output: {schema: HealthRecommendationsOutputSchema},
  prompt: `You are an AI health and wellness coach. Based on the user's profile and goals, generate a personalized diet plan, exercise plan, and mental wellness tips.

User's Profile:
- Age: {{{age}}}
- Gender: {{{gender}}}
- BMI: {{{bmi}}}
- Existing Conditions: {{{conditions}}}
- Health Goals: {{{healthGoals}}}

Generate a set of recommendations based on this information.`,
});

export const healthRecommendationsFlow = ai.defineFlow(
  {
    name: 'healthRecommendationsFlow',
    inputSchema: HealthRecommendationsInputSchema,
    outputSchema: HealthRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function healthRecommendations(
  input: HealthRecommendationsInput
): Promise<HealthRecommendationsOutput> {
  return healthRecommendationsFlow(input);
}
