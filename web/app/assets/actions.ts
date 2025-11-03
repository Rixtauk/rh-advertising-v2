'use server';

// Server action to fetch asset specs from Railway API
// Uses server-side environment variable for Railway URL
const API_BASE_URL = process.env.API_URL || 'https://rh-advertising-v2-production.up.railway.app';

interface AssetSpec {
  channel: string;
  placement_or_format: string;
  aspect_ratio: string | null;
  recommended_px: string | null;
  duration_seconds_max: number;
  file_types: string[];
  max_file_size_mb: number;
  caption_limit_chars: number;
  notes?: string | null;
}

interface AssetSpecsResponse {
  channel: string;
  specs: AssetSpec[];
}

export async function getAssetSpecs(channel: string): Promise<AssetSpec[]> {
  if (!channel) {
    throw new Error('Channel parameter is required');
  }

  try {
    const url = `${API_BASE_URL}/v1/asset-specs?channel=${encodeURIComponent(channel)}`;
    console.log(`Fetching asset specs from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching to always get fresh data
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Asset specs API error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch asset specs: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Asset specs response:', data);

    // Handle nested response format: {channel: "...", specs: [...]}
    if (data.specs && Array.isArray(data.specs)) {
      return data.specs;
    }

    // Handle direct array response
    if (Array.isArray(data)) {
      return data;
    }

    console.error('Unexpected asset specs response format:', data);
    throw new Error('Unexpected response format from asset specs API');
  } catch (error) {
    console.error('Error fetching asset specs:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch asset specifications'
    );
  }
}
