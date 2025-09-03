import { SymptomCheckerClient } from '@/components/symptom-checker-client';

export default function SymptomCheckerPage() {
  return (
    <>
      <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">AI Symptom Checker</h1>
      </div>
      <SymptomCheckerClient />
    </>
  );
}
