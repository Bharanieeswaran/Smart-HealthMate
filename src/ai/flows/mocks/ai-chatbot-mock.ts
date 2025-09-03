import { type ChatbotInput, type ChatbotOutput } from '@/ai/schemas';

export async function healthChatbot(question: ChatbotInput): Promise<ChatbotOutput> {
  // Mock implementation - no API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  // A more detailed mock response based on a common question.
  const detailedAnswer = `A balanced diet, regular exercise, and adequate sleep are fundamental pillars of good health. Here’s a more detailed breakdown:

**Diet:**
*   **Variety is Key:** Eat a wide variety of fruits, vegetables, lean proteins, and whole grains. This ensures you get a broad spectrum of nutrients.
*   **Healthy Fats:** Incorporate sources of healthy fats like avocados, nuts, seeds, and olive oil.
*   **Limit Processed Foods:** Reduce your intake of sugary drinks, processed snacks, and foods high in saturated and trans fats.

**Exercise:**
*   **Aerobic Activity:** Aim for at least 150 minutes of moderate-intensity aerobic exercise (like brisk walking or cycling) or 75 minutes of vigorous-intensity exercise (like running) per week.
*   **Strength Training:** Include muscle-strengthening activities for all major muscle groups at least two days a week.

**Sleep:**
*   **Aim for 7-9 Hours:** Most adults need 7-9 hours of quality sleep per night.
*   **Consistent Schedule:** Try to go to bed and wake up around the same time every day, even on weekends.

These are general guidelines. For personalized advice, it's always best to consult with a healthcare professional.`;

  return {
    answer: detailedAnswer,
    disclaimer: "This is for informational purposes only and is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any health concerns."
  };
}
