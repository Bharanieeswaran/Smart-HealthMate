import { z } from 'zod';

// AI Symptom Checker
export const CheckSymptomsInputSchema = z.string().describe('A free-text description of the symptoms experienced by the user.');
export type CheckSymptomsInput = z.infer<typeof CheckSymptomsInputSchema>;

export const CheckSymptomsOutputSchema = z.object({
  conditions: z.array(
    z.object({
      condition: z.string().describe('The possible medical condition.'),
      confidence: z.number().describe('The confidence level (0-1) of the condition.'),
      nextSteps: z.string().describe('Recommended next steps for this specific condition.'),
    })
  ).describe('A list of possible medical conditions with confidence levels and recommended next steps.'),
  advice: z.array(z.string()).describe('A list of general advice based on the symptoms.'),
  triage_level: z.enum(['self-care', 'see GP', 'emergency']).describe('The overall triage level recommendation.')
});
export type CheckSymptomsOutput = z.infer<typeof CheckSymptomsOutputSchema>;


// Health Recommendations
export const HealthRecommendationsInputSchema = z.object({
  age: z.coerce.number().min(1, 'Age must be a positive number.').max(120, 'Age seems too high.'),
  gender: z.string().min(1, 'Please select a gender.'),
  bmi: z.coerce.number().min(10, 'BMI seems too low.').max(60, 'BMI seems too high.'),
  conditions: z.string().optional(),
  healthGoals: z.string().min(10, {
    message: 'Please describe your health goals in at least 10 characters.',
  }),
});
export type HealthRecommendationsInput = z.infer<typeof HealthRecommendationsInputSchema>;

export const HealthRecommendationsOutputSchema = z.object({
  dietPlan: z.object({
    breakfast: z.string().describe('Specific breakfast recommendation.'),
    lunch: z.string().describe('Specific lunch recommendation.'),
    dinner: z.string().describe('Specific dinner recommendation.'),
  }).describe('A detailed diet plan with 3 meals.'),
  exercisePlan: z.string().describe('Personalized daily exercise recommendations for the user.'),
  mentalWellnessTips: z.string().describe('Personalized mental wellness tips for the user.'),
});
export type HealthRecommendationsOutput = z.infer<typeof HealthRecommendationsOutputSchema>;


// Personalized Health Recommendations
export const PersonalizedHealthRecommendationsInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  bmi: z.number().describe('The BMI of the user.'),
  healthConditions: z.string().describe('Any existing health conditions of the user.'),
});
export type PersonalizedHealthRecommendationsInput = z.infer<typeof PersonalizedHealthRecommendationsInputSchema>;

export const PersonalizedHealthRecommendationsOutputSchema = z.object({
  dietRecommendations: z.string().describe('Personalized diet recommendations for the user.'),
  exerciseRecommendations: z.string().describe('Personalized exercise recommendations for the user.'),
});
export type PersonalizedHealthRecommendationsOutput = z.infer<typeof PersonalizedHealthRecommendationsOutputSchema>;


// AI Chatbot
export const ChatbotInputSchema = z.string().describe("The user's health-related question.");
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export const ChatbotOutputSchema = z.object({
  answer: z.string().describe("A helpful, informative answer to the user's question."),
  disclaimer: z.string().describe('A standard disclaimer that the AI is not a medical professional.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;


// Supplement Recommendations
export const SupplementRecommendationsInputSchema = z.object({
  healthGoals: z.string().min(5, { message: 'Please describe your health goals in at least 5 characters.' }),
});
export type SupplementRecommendationsInput = z.infer<typeof SupplementRecommendationsInputSchema>;

export const SupplementRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      supplement: z.string().describe('The name of the recommended vitamin or supplement.'),
      benefit: z.string().describe('The primary health benefit of this supplement.'),
      dosage: z.string().describe('A typical, safe dosage recommendation.'),
    })
  ).describe('A list of recommended supplements.'),
  disclaimer: z.string().describe('A disclaimer advising consultation with a healthcare professional.'),
});
export type SupplementRecommendationsOutput = z.infer<typeof SupplementRecommendationsOutputSchema>;

// Prescription Reader
export const PrescriptionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a medical prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PrescriptionInput = z.infer<typeof PrescriptionInputSchema>;

export const PrescriptionOutputSchema = z.object({
  patientName: z.string().optional().describe("The name of the patient."),
  doctorName: z.string().optional().describe("The name of the prescribing doctor."),
  prescriptionDate: z.string().optional().describe("The date the prescription was written."),
  medications: z.array(z.object({
    name: z.string().describe("The name of the medication."),
    dosage: z.string().describe("The dosage of the medication (e.g., '500mg')."),
    form: z.string().describe("The form of the medication (e.g., 'Tablet', 'Capsule')."),
    frequency: z.string().describe("How often to take the medication (e.g., 'Once daily')."),
    quantity: z.string().describe("The total quantity of medication prescribed."),
  })).describe("A list of medications found on the prescription."),
  refills: z.string().optional().describe("The number of refills authorized."),
  rawText: z.string().describe("The full raw text extracted from the prescription."),
});
export type PrescriptionOutput = z.infer<typeof PrescriptionOutputSchema>;
