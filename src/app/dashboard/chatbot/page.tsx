import { ChatbotClient } from '@/components/chatbot-client';

export default function ChatbotPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">AI Health Chatbot</h1>
      </div>
      <ChatbotClient />
    </>
  );
}
