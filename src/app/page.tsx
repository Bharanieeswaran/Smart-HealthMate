
import Link from 'next/link';
import { HeartPulse, Stethoscope, Activity, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PublicHeader } from '@/components/public-header';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
      <div className="flex flex-col min-h-screen">
        <PublicHeader />
        <main className="flex-1">
          <section className="w-full py-12 md:py-20 lg:py-24 bg-background">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Your Personal AI Health Companion
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Smart Health Mate provides instant symptom analysis, personalized health recommendations, and a friendly AI chatbot to answer your health questions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="btn-gradient">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Take Control of Your Health</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our suite of AI-powered tools helps you understand your body and make informed decisions about your well-being.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
                <Card className="grid gap-4 text-center p-6 bg-transparent border-0 shadow-none hover:bg-card transition-colors">
                  <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-500/20 rounded-full w-fit mx-auto mb-2">
                      <Stethoscope className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">AI Symptom Checker</h3>
                  <p className="text-sm text-muted-foreground">
                    Describe your symptoms and get instant, AI-driven insights into possible conditions and next steps.
                  </p>
                </Card>
                <Card className="grid gap-4 text-center p-6 bg-transparent border-0 shadow-none hover:bg-card transition-colors">
                  <div className="p-3 bg-gradient-to-r from-green-500/10 to-green-500/20 rounded-full w-fit mx-auto mb-2">
                      <Activity className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Personalized Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive custom diet and exercise plans based on your unique health profile and goals.
                  </p>
                </Card>
                <Card className="grid gap-4 text-center p-6 bg-transparent border-0 shadow-none hover:bg-card transition-colors">
                  <div className="p-3 bg-gradient-to-r from-purple-500/10 to-purple-500/20 rounded-full w-fit mx-auto mb-2">
                      <Bot className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">AI Health Chatbot</h3>
                  <p className="text-sm text-muted-foreground">
                    Have a health question? Our friendly AI chatbot is available 24/7 to provide informative answers.
                  </p>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-4 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">&copy; 2025 Smart Health Mate. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
  );
}
