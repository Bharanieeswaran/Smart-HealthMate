import { PrescriptionReaderClient } from '@/components/prescription-reader-client';

export default function PrescriptionReaderPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">AI Prescription Reader</h1>
      </div>
      <PrescriptionReaderClient />
    </>
  );
}
