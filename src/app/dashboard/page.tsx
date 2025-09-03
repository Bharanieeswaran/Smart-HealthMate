
'use client';

import Link from 'next/link';
import { Stethoscope, Sparkles, MessageSquare, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { HealthMetricsClient } from '@/components/health-metrics-client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const HealthMetricsChart = dynamic(() => import('@/components/health-metrics-chart').then(mod => mod.HealthMetricsChart), {
    ssr: false,
    loading: () => (
        <div className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    )
});

export default function DashboardPage() {
    const { user } = useAuth();
    
    return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
          Welcome Back, {user?.displayName || 'User'}
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-3 bg-gradient-to-r from-primary to-accent border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-full">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="font-headline text-white">Good Morning!</CardTitle>
                <CardDescription className="text-white/80">
                  Here's a quick look at your health today. Log your vitals below.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Daily Health Log</CardTitle>
            <CardDescription>Enter your health metrics for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthMetricsClient />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="p-3 bg-blue-500/10 rounded-full w-fit mb-2">
              <Stethoscope className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="font-headline">AI Symptom Checker</CardTitle>
            <CardDescription className="text-balance">
              Feeling unwell? Describe your symptoms for potential insights.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/dashboard/symptom-checker">Check Symptoms</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="p-3 bg-green-500/10 rounded-full w-fit mb-2">
              <Sparkles className="h-6 w-6 text-green-400" />
            </div>
            <CardTitle className="font-headline">Health Recommendations</CardTitle>
            <CardDescription className="text-balance">
              Get personalized diet and exercise plans based on your profile.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/dashboard/recommendations">Get Recommendations</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="p-3 bg-purple-500/10 rounded-full w-fit mb-2">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
            <CardTitle className="font-headline">AI Health Chatbot</CardTitle>
            <CardDescription className="text-balance">
              Have a health question? Chat with our AI for quick, informative answers.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/dashboard/chatbot">Ask our Chatbot</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Your Health Metrics</CardTitle>
            <CardDescription>A summary of your key health data over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <HealthMetricsChart />
          </CardContent>
        </Card>
      </div>
    </>
    );
}
