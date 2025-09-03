import { SOSClient } from '@/components/sos-client';

export default function SOSPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Emergency SOS</h1>
      </div>
      <SOSClient />
    </>
  );
}
