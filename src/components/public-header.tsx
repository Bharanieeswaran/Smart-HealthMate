
'use client';

import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export function PublicHeader() {
    const { signInUser } = useAuth();
    const router = useRouter();

    const handleSkip = () => {
        const guestUser = {
          uid: `guest-${Date.now()}`,
          email: 'guest@example.com',
          displayName: 'Guest User',
        };
        signInUser(guestUser);
        router.push('/dashboard');
    };

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center bg-white border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="sr-only">Smart Health Mate</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
            <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
        </nav>
      </header>
    )
}
