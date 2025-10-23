'use server';

// Use relative /api path that gets proxied to Railway via Vercel rewrites
// In dev: next.config.mjs proxies to http://localhost:8000
// In prod: vercel.json proxies to Railway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Social channels that support emojis
const SOCIAL_CHANNELS = ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Snapchat', 'X', 'Reddit'];

interface GeneratedField {
  field: string;
  value: string | string[];
  char_count: number;
  max_chars: number;
  is_over_limit: boolean;
  shortened?: string | string[];
}

interface GeneratedOption {
  option: number;
  fields: GeneratedField[];
}

interface GenerateResponse {
  options: GeneratedOption[];
  warnings: Array<{
    field: string;
    original_length: number;
    max_length: number;
    message: string;
  }>;
  source: string;
  model_used: string;
  scraped_context?: string;
  timings: Record<string, number>;
}

export async function generateAdCopy(formData: FormData) {
  const channel = formData.get('channel') as string;
  const subtype = formData.get('subtype') as string;
  const university = formData.get('university') as string;
  const tone = formData.get('tone') as string;
  const audience = formData.get('audience') as string;
  const usps = formData.get('usps') as string;
  const landingUrl = formData.get('landingUrl') as string;
  const includeEmojis = formData.get('includeEmojis') === 'true';

  if (!channel || !subtype || !university || !tone || !audience || !usps) {
    throw new Error('Missing required fields');
  }

  const emojiAllowed = SOCIAL_CHANNELS.includes(channel);

  // Call FastAPI endpoint
  const requestBody = {
    channel,
    subtype,
    university,
    tone,
    audience,
    usps,
    emojis_allowed: emojiAllowed && includeEmojis,
    landing_url: landingUrl || null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/v1/generate-copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate copy');
    }

    const result: GenerateResponse = await response.json();

    // Transform API response to match frontend format
    return result.options.map((option) => ({
      option: option.option,
      fields: option.fields.map((field) => ({
        field: field.field,
        value: field.value,
        charCount: field.char_count,
        maxChars: field.max_chars,
        isOverLimit: field.is_over_limit,
        shortened: field.shortened,
      })),
    }));
  } catch (error) {
    console.error('Error generating copy:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}
