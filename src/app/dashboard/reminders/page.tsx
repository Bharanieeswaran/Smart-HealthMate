
import { RemindersClient } from '@/components/reminders-client';

export default function RemindersPage() {
  return (
    <>
      <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Reminders</h1>
      </div>
      <RemindersClient />
    </>
  );
}
