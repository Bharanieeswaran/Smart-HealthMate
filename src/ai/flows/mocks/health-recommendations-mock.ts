import { type HealthRecommendationsInput, type HealthRecommendationsOutput } from '@/ai/schemas';

export async function healthRecommendations(input: HealthRecommendationsInput): Promise<HealthRecommendationsOutput> {
  // Mock implementation - no API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return {
    dietPlan: {
      breakfast: 'Oatmeal with berries and a handful of nuts for fiber and antioxidants.',
      lunch: 'A large mixed greens salad with grilled chicken or chickpeas, a variety of vegetables, and a light vinaigrette dressing.',
      dinner: 'Baked salmon with roasted sweet potatoes and steamed broccoli.',
    },
    exercisePlan: 'Aim for 30 minutes of brisk walking or cycling daily. Incorporate strength training twice a week, focusing on major muscle groups.',
    mentalWellnessTips: 'Practice mindfulness for 10 minutes each day. Ensure you get 7-8 hours of quality sleep per night. Connect with friends or family regularly.',
  };
}
