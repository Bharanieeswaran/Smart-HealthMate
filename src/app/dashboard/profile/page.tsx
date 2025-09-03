import { ProfileClient } from '@/components/profile-client';

export default function ProfilePage() {
  return (
    <>
      <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Your Profile</h1>
      </div>
      <ProfileClient />
    </>
  );
}
