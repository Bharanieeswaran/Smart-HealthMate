import { type SupplementRecommendationsInput, type SupplementRecommendationsOutput } from '@/ai/schemas';

export async function supplementRecommendations(input: SupplementRecommendationsInput): Promise<SupplementRecommendationsOutput> {
  // Mock implementation - no API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  return {
    recommendations: [
      {
        supplement: 'Vitamin D',
        benefit: 'Supports bone health, immune function, and mood regulation. Especially important if you have limited sun exposure.',
        dosage: '1000-2000 IU daily',
      },
      {
        supplement: 'Omega-3 Fish Oil',
        benefit: 'Reduces inflammation, supports brain health, and may improve heart health by lowering triglycerides.',
        dosage: '1000mg of EPA/DHA daily',
      },
      {
        supplement: 'Magnesium',
        benefit: 'Involved in over 300 bodily functions, including muscle relaxation, sleep quality, and stress management.',
        dosage: '200-400mg daily, preferably Magnesium Glycinate or Citrate',
      }
    ],
    disclaimer: "This is for informational purposes only. Consult a healthcare professional before starting any new supplement regimen."
  };
}
