'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { sendInsightQuery, ChatMessage as ChatMessageType } from '@/app/insights/actions';
import { Send, Loader2, Trash2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EXAMPLE_PROMPTS = [
  'What were the key findings from the Pre-Clearing survey for 2025?',
  'What are the top 10 most popular subjects nationally for Clearing 2025?',
  'How did January 2025 UCAS applications compare to previous years?',
  'How many students want to change their minds about their course or university choice?',
  'What is the preferred contact method for students ahead of Results Day?',
];

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function InsightChat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize session ID from localStorage or create new one
  useEffect(() => {
    const stored = localStorage.getItem('rh-insight-session');
    if (stored) {
      const { sessionId: storedSessionId, messages: storedMessages } = JSON.parse(stored);
      setSessionId(storedSessionId);
      // Restore messages with proper Date objects
      setMessages(
        storedMessages.map((m: ChatMessageType) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
      );
    } else {
      setSessionId(generateSessionId());
    }
  }, []);

  // Save to localStorage when messages change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(
        'rh-insight-session',
        JSON.stringify({ sessionId, messages })
      );
    }
  }, [sessionId, messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendInsightQuery(userMessage.content, sessionId);

      if (response.success && response.message) {
        const assistantMessage: ChatMessageType = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to get response',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([]);
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    localStorage.removeItem('rh-insight-session');
    toast({
      title: 'Chat cleared',
      description: 'Starting a fresh conversation',
    });
  };

  return (
    <Card className="flex flex-col h-[500px] md:h-[600px] rounded-xl shadow-sm">
      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 md:space-y-6 px-4">
              <div className="space-y-2">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 mx-auto text-primary/60" />
                <h3 className="text-base md:text-lg font-medium">Start a conversation</h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-md">
                  Ask questions about higher education marketing and get answers
                  grounded in our knowledge base with cited sources.
                </p>
              </div>
              <div className="grid gap-2 w-full max-w-md">
                <p className="text-xs text-muted-foreground font-medium">
                  Try asking:
                </p>
                {EXAMPLE_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(prompt)}
                    className="text-left text-xs md:text-sm p-2.5 md:p-3 rounded-lg border border-border hover:bg-muted transition-colors touch-manipulation"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, idx) => (
                <ChatMessage
                  key={idx}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-2 md:gap-3 p-3 md:p-4 rounded-lg bg-muted mr-4 md:mr-8">
                  <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs md:text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-3 md:p-4 bg-background">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about higher education marketing..."
                disabled={isLoading}
                className="h-10 md:h-11 text-sm md:text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            {messages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearChat}
                title="Clear chat"
                size="icon"
                className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
