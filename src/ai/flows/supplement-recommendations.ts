'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  SupplementRecommendationsInputSchema,
  SupplementRecommendationsOutputSchema,
  type SupplementRecommendationsInput,
  type SupplementRecommendationsOutput,
} from '@/ai/schemas';

const prompt = ai.definePrompt({
  name: 'supplementRecommendationsPrompt',
  input: {schema: SupplementRecommendationsInputSchema},
  output: {schema: SupplementRecommendationsOutputSchema},
  prompt: `You are an expert AI nutritionist. Your role is to provide safe, evidence-based supplement recommendations to users based on their health goals.

User's Health Goals: "{{{healthGoals}}}"

Based on these goals, provide a list of 3-5 relevant vitamins or supplements. For each one, explain its primary benefit and a typical, safe dosage.
You must include a disclaimer that the user should consult with a healthcare professional before starting any new supplement regimen.
Do not recommend anything that is not a standard, well-researched vitamin, mineral, or supplement. Avoid niche or unproven products.`,
});


const supplementRecommendationsFlow = ai.defineFlow(
  {
    name: 'supplementRecommendationsFlow',
    inputSchema: SupplementRecommendationsInputSchema,
    outputSchema: SupplementRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function supplementRecommendations(
  input: SupplementRecommendationsInput
): Promise<SupplementRecommendationsOutput> {
  return supplementRecommendationsFlow(input);
}
