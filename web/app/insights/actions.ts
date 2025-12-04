'use server';

const N8N_WEBHOOK_URL = 'https://rickyvalentine.app.n8n.cloud/webhook/f61815ce-f800-4913-a5d3-69303910022f/chat';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendInsightQuery(
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  if (!message.trim()) {
    return { success: false, error: 'Message cannot be empty' };
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: sessionId,
        chatInput: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook error:', errorText);
      return {
        success: false,
        error: `Failed to get response: ${response.status}`,
      };
    }

    const data = await response.json();

    // The n8n chat trigger returns the response in the 'output' field
    const assistantMessage = data.output || data.response || data.text || data.message;

    if (!assistantMessage) {
      console.error('Unexpected response format:', data);
      return {
        success: false,
        error: 'Received an empty response',
      };
    }

    return {
      success: true,
      message: assistantMessage,
    };
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
