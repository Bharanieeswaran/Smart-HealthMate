'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Stethoscope, Sparkles, User, Bell, FileClock, MessageSquare, ShieldAlert, Pill, FileScan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SheetClose } from '@/components/ui/sheet';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { href: '/dashboard/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/dashboard/chatbot', label: 'AI Chatbot', icon: MessageSquare },
  { href: '/dashboard/prescription-reader', label: 'Prescription Reader', icon: FileScan },
  { href: '/dashboard/medication', label: 'Medication', icon: Pill },
  { href: '/dashboard/reminders', label: 'Reminders', icon: Bell },
  { href: '/dashboard/history', label: 'History & Reports', icon: FileClock },
  { href: '/dashboard/sos', label: 'SOS', icon: ShieldAlert },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export function DashboardNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const navLinkClass = "flex items-center gap-4 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10";
  const activeLinkClass = "bg-primary/10 text-primary font-semibold";

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const isActive = pathname === href;
    const LinkComponent = (
        <Link href={href} className={cn(navLinkClass, isActive && activeLinkClass)}>
            {children}
        </Link>
    );

    if (isMobile) {
      return <SheetClose asChild>{LinkComponent}</SheetClose>;
    }
    return LinkComponent;
  };

  return (
    <nav className="grid items-start px-2 text-base font-medium lg:px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.href} href={item.href}>
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
