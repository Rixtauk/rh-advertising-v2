import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint for Make.com to POST results back
 *
 * Expected payload:
 * {
 *   "jobId": "optional-job-id",
 *   "options": [
 *     {
 *       "option": 1,
 *       "fields": [
 *         {
 *           "field": "primary_text",
 *           "value": "...",
 *           "charCount": 120,
 *           "maxChars": 125,
 *           "isOverLimit": false
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * For now, this is a placeholder. In production, you'd:
 * 1. Store the result keyed by jobId
 * 2. Notify the client (WebSocket, SSE, or polling)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate payload
    if (!body.options || !Array.isArray(body.options)) {
      return NextResponse.json(
        { error: 'Invalid payload: missing options array' },
        { status: 400 }
      );
    }

    // In a real implementation, store the result and notify the client
    console.log('Received Make.com webhook:', body);

    // For now, just acknowledge receipt
    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing Make.com webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
