import { MedicationClient } from '@/components/medication-client';

export default function MedicationPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Medication</h1>
      </div>
      <MedicationClient />
    </>
  );
}
