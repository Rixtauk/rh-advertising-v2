'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SpecsList } from '@/components/assets/SpecsList';
import { getAssetSpecs } from './actions';
import { useToast } from '@/components/ui/use-toast';

const CHANNELS = [
  'SEARCH',
  'DISPLAY',
  'PERFORMANCE MAX',
  'DEMAND GEN',
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
  const { toast } = useToast();

  const handleChannelChange = async (channel: string) => {
    setSelectedChannel(channel);

    if (!channel) {
      setSpecs([]);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedSpecs = await getAssetSpecs(channel);
      setSpecs(fetchedSpecs);
    } catch (error) {
      console.error('Failed to load specs:', error);
      setSpecs([]);
      toast({
        title: 'Error loading specifications',
        description: error instanceof Error ? error.message : 'Failed to fetch asset specs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Creative Asset Spec Query Tool</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Find the technical requirements for images and videos across all advertising channels.
        </p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="channel" className="text-sm md:text-base">Select Channel</Label>
            <Select value={selectedChannel} onValueChange={handleChannelChange}>
              <SelectTrigger id="channel" className="h-10 md:h-11">
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
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8 md:p-12 text-center">
            <p className="text-sm md:text-base text-muted-foreground">Loading specifications...</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && selectedChannel && <SpecsList specs={specs} channel={selectedChannel} />}

      {!isLoading && !selectedChannel && (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8 md:p-12 text-center">
            <p className="text-sm md:text-base text-muted-foreground">Select a channel to view asset specifications.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
