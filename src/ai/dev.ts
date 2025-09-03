import { config } from 'dotenv';
config();

import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/health-recommendations.ts';
import '@/ai/flows/personalized-health-recommendations.ts';
import '@/ai/flows/ai-chatbot.ts';
import '@/ai/flows/supplement-recommendations.ts';
import '@/ai/flows/prescription-reader.ts';
import '@/ai/schemas.ts';
