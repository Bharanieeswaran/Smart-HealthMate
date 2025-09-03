'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, HeartPulse, LogOut, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardNav } from '@/components/dashboard-nav';
import { useAuth, withAuth } from '@/hooks/use-auth';

function AppLayoutComponent({ children }: { children: React.ReactNode }) {
  const { user, handleSignOut } = useAuth();
  const router = useRouter();

  const onSignOut = () => {
    handleSignOut(router);
  };

  return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                <HeartPulse className="h-6 w-6 text-primary" />
                <span className="">Smart Health Mate</span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
            <div className="flex-1">
              <DashboardNav />
            </div>
            <div className="mt-auto p-4 border-t">
              <Button variant="outline" className="w-full" onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                    <HeartPulse className="h-6 w-6 text-primary" />
                    <span className="">Smart Health Mate</span>
                  </Link>
                </div>
                <div className="flex-1 py-2">
                  <DashboardNav isMobile={true} />
                </div>
                 <div className="mt-auto p-4 border-t">
                   <Button variant="outline" className="w-full" onClick={onSignOut}>
                     <LogOut className="mr-2 h-4 w-4" />
                     Log Out
                   </Button>
                 </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1" />
             <div className="flex items-center gap-2">
               <span className="text-sm font-medium">{user?.displayName || user?.email}</span>
             </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
  );
}

const AuthenticatedAppLayout = withAuth(AppLayoutComponent);

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
      <AuthenticatedAppLayout>
        {children}
      </AuthenticatedAppLayout>
  )
}
