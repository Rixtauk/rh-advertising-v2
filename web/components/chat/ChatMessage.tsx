'use client';

import { cn } from '@/lib/utils';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'flex gap-2 md:gap-3 p-3 md:p-4 rounded-lg',
        isUser ? 'bg-primary/10 ml-4 md:ml-8' : 'bg-muted mr-4 md:mr-8'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
        )}
      >
        {isUser ? <User className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Bot className="w-3.5 h-3.5 md:w-4 md:h-4" />}
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs md:text-sm font-medium truncate">
            {isUser ? 'You' : 'Education Insight Assistant'}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <div className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed break-words">{content}</div>
        {!isUser && (
          <div className="flex justify-end pt-1 md:pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 md:h-7 text-xs text-muted-foreground hover:text-foreground touch-manipulation"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
