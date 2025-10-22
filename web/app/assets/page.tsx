'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SpecsList } from '@/components/assets/SpecsList';

const CHANNELS = [
  'SEARCH',
  'DISPLAY',
  'PERFORMANCE MAX',
  'YOUTUBE',
  'TIKTOK',
  'SNAPCHAT',
  'LINKEDIN LEAD GEN',
  'LINKEDIN SINGLE IMAGE',
  'LINKEDIN SINGLE VIDEO',
  'META SINGLE IMAGE',
  'META VIDEO',
  'META CAROUSEL',
  'META COLLECTION',
  'REDDIT',
];

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

export default function AssetsPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [specs, setSpecs] = useState<AssetSpec[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedChannel) {
      setSpecs([]);
      return;
    }

    setIsLoading(true);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${API_BASE_URL}/v1/asset-specs?channel=${encodeURIComponent(selectedChannel)}`)
      .then((res) => res.json())
      .then((data) => {
        setSpecs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load specs:', err);
        setSpecs([]);
        setIsLoading(false);
      });
  }, [selectedChannel]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Creative Asset Specifications</h1>
        <p className="text-muted-foreground">
          Find the technical requirements for images and videos across all advertising channels.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="channel">Select Channel</Label>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger id="channel">
                <SelectValue placeholder="Choose a channel..." />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map((ch) => (
                  <SelectItem key={ch} value={ch}>
                    {ch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading specifications...</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && selectedChannel && <SpecsList specs={specs} channel={selectedChannel} />}

      {!isLoading && !selectedChannel && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Select a channel to view asset specifications.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
