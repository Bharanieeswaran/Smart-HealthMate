'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  ChatbotInputSchema,
  ChatbotOutputSchema,
  type ChatbotInput,
  type ChatbotOutput,
} from '@/ai/schemas';

const healthChatbotPrompt = ai.definePrompt({
  name: 'healthChatbotPrompt',
  input: {schema: z.object({question: ChatbotInputSchema})},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are an expert AI health assistant. Your role is to provide comprehensive, detailed, and safe health-related information to users.
Break down your answer into logical sections with clear headings.
Provide explanations that are easy to understand for a general audience.
You must not provide medical advice, diagnosis, or treatment. Always include a disclaimer.

User's Question:
"{{{question}}}"

Your Comprehensive Answer:`,
});

const healthChatbotFlow = ai.defineFlow(
  {
    name: 'healthChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async question => {
    const {output} = await healthChatbotPrompt({question});
    return output!;
  }
);

export async function healthChatbot(
  question: ChatbotInput
): Promise<ChatbotOutput> {
  const result = await healthChatbotFlow(question);
  return {
    ...result,
    disclaimer: "This is for informational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any health concerns."
  }
}
