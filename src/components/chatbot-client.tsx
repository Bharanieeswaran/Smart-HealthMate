
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CornerDownLeft, Loader2, User, Sparkles, AlertTriangle } from 'lucide-react';

import { healthChatbot } from '@/ai/flows/ai-chatbot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  question: z.string().min(5, {
    message: 'Please ask a question with at least 5 characters.',
  }),
});

interface Message {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  disclaimer?: string;
}

export function ChatbotClient() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveToHistory = (question: string, answer: string) => {
    if (user) {
        const newItem = { question, answer, date: new Date().toISOString() };
        const history = JSON.parse(localStorage.getItem(`chatHistory_${user.uid}`) || '[]');
        history.unshift(newItem);
        localStorage.setItem(`chatHistory_${user.uid}`, JSON.stringify(history));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      content: values.question,
    };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const response = await healthChatbot(values.question);
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        content: response.answer,
        disclaimer: response.disclaimer,
      };
      setMessages((prev) => [...prev, aiMessage]);
      saveToHistory(values.question, response.answer);
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <CardHeader>
        <CardTitle>Ask HealthWise AI</CardTitle>
        <CardDescription>Ask any general health question. Our AI is here to help.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex items-start gap-4', message.sender === 'user' ? 'justify-end' : '')}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-transparent">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg p-3 text-sm',
                    message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.disclaimer && (
                    <Alert variant="destructive" className="mt-4 text-xs">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-xs font-bold">Disclaimer</AlertTitle>
                      <AlertDescription>{message.disclaimer}</AlertDescription>
                    </Alert>
                  )}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-transparent">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[85%] rounded-lg p-3 text-sm bg-muted flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="pt-4 border-t">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="e.g., What are the benefits of a mediterranean diet?"
                        className="min-h-[40px] resize-none"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (form.formState.isValid) {
                              form.handleSubmit(onSubmit)();
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isLoading || !form.formState.isValid}>
                <CornerDownLeft className="h-4 w-4" />
                <span className="sr-only">Ask question</span>
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
