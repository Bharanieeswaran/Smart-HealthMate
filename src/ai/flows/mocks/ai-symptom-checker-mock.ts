import { type CheckSymptomsInput, type CheckSymptomsOutput } from '@/ai/schemas';

export async function checkSymptoms(symptoms: CheckSymptomsInput): Promise<CheckSymptomsOutput> {
  // Mock implementation - no API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  if (symptoms.toLowerCase().includes('chest pain')) {
     return {
        conditions: [
            {
                condition: 'Possible Acute Coronary Syndrome',
                confidence: 0.75,
                nextSteps: 'This could be a heart attack. It is critical to call emergency services immediately for evaluation. Do not drive yourself to the hospital.',
            },
            {
                condition: 'Gastroesophageal Reflux Disease (GERD)',
                confidence: 0.50,
                nextSteps: 'While this is a possibility, the potential for a cardiac event must be ruled out first. Seek immediate medical care.',
            },
        ],
        advice: [
            'Call 911 or your local emergency number immediately.',
            'Stay as calm as possible and rest in a comfortable position.',
            'If prescribed, take nitroglycerin as directed by your doctor. Do not take aspirin unless advised by a medical professional.',
        ],
        triage_level: 'emergency',
     }
  }

  return {
    conditions: [
      {
        condition: 'Common Cold',
        confidence: 0.85,
        nextSteps: 'Rest, stay hydrated with plenty of fluids, and use over-the-counter decongestants or pain relievers if necessary. Symptoms should improve within 7-10 days.',
      },
      {
        condition: 'Allergic Rhinitis (Hay Fever)',
        confidence: 0.60,
        nextSteps: 'Try to identify and avoid potential allergens like pollen or dust. Over-the-counter antihistamines (e.g., loratadine, cetirizine) can help manage symptoms effectively.',
      },
      {
        condition: 'Sinusitis',
        confidence: 0.45,
        nextSteps: 'Use a saline nasal spray to help clear nasal passages. A warm compress over the face can also help ease sinus pressure. If symptoms persist for over a week or worsen, consult a doctor.',
      }
    ],
    advice: [
      'Drink plenty of fluids like water, juice, or broth to stay hydrated.',
      'Get adequate rest to help your body recover more quickly.',
      'Use a humidifier or take a steamy shower to ease a stuffy nose and sore throat.',
      'Monitor your temperature. See a doctor if you have a persistent high fever.'
    ],
    triage_level: 'self-care',
  };
}
