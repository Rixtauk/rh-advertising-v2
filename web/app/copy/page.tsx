'use client';

import { useState } from 'react';
import { CopyForm } from '@/components/forms/CopyForm';
import { CopyResults } from '@/components/results/CopyResults';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateAdCopy } from './actions';
import { useToast } from '@/components/ui/use-toast';

// Taxonomies - these would normally be loaded server-side and passed as props
// For simplicity, hardcoding here; in production, fetch from API
const TAXONOMIES = {
  all_channels: [
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
  ],
  social_channels: [
    'META SINGLE IMAGE',
    'META VIDEO',
    'META CAROUSEL',
    'META COLLECTION',
    'LINKEDIN LEAD GEN',
    'LINKEDIN SINGLE IMAGE',
    'LINKEDIN SINGLE VIDEO',
    'TIKTOK',
    'SNAPCHAT',
    'REDDIT',
  ],
  subtypes: [
    'Brand level recruitment',
    'Subject/course specific ad',
    'Open Day',
    'Clearing',
  ],
  tones: [
    'Confident',
    'Supportive & inclusive',
    'Curious & forward-thinking',
    'Warm & welcoming',
    'Professional & ambitious',
    'Light-hearted & modern',
  ],
  audiences: ['Undergraduates', 'Postgraduates', 'Parents & Influencers'],
};

interface GeneratedField {
  field: string;
  value: string | string[];
  charCount: number;
  maxChars: number;
  isOverLimit: boolean;
  shortened?: string | string[];
}

interface GeneratedOption {
  option: number;
  fields: GeneratedField[];
}

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

export default function CopyPage() {
  const [results, setResults] = useState<GeneratedOption[] | null>(null);
  const [lastFormData, setLastFormData] = useState<FormData | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [showAssetSpecs, setShowAssetSpecs] = useState(false);
  const [assetSpecs, setAssetSpecs] = useState<AssetSpec[]>([]);
  const { toast } = useToast();

  const handleGenerate = async (formData: FormData) => {
    try {
      const channel = formData.get('channel') as string;
      setLastFormData(formData);
      setSelectedChannel(channel);
      setShowAssetSpecs(false);

      const generatedResults = await generateAdCopy(formData);
      setResults(generatedResults);

      // Automatically fetch and display asset specs for the channel
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
        const response = await fetch(`${API_BASE_URL}/v1/asset-specs?channel=${encodeURIComponent(channel)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch asset specs: ${response.status}`);
        }

        const specs = await response.json();
        if (Array.isArray(specs)) {
          setAssetSpecs(specs);
          setShowAssetSpecs(true);
        } else {
          console.error('Asset specs response is not an array:', specs);
        }
      } catch (error) {
        console.error('Failed to load asset specs:', error);
        setAssetSpecs([]);
        setShowAssetSpecs(false);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleRegenerate = async () => {
    if (!lastFormData) return;
    await handleGenerate(lastFormData);
  };

  const handleSelectOption = async (option: GeneratedOption) => {
    toast({
      title: 'Option selected',
      description: `Option ${option.option} has been selected. Would you like to see asset specs?`,
    });

    if (selectedChannel) {
      // Fetch asset specs for the channel
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
        const response = await fetch(`${API_BASE_URL}/v1/asset-specs?channel=${encodeURIComponent(selectedChannel)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch asset specs: ${response.status}`);
        }

        const specs = await response.json();
        if (Array.isArray(specs)) {
          setAssetSpecs(specs);
          setShowAssetSpecs(true);
        } else {
          console.error('Asset specs response is not an array:', specs);
        }
      } catch (error) {
        console.error('Failed to load asset specs:', error);
        setAssetSpecs([]);
        setShowAssetSpecs(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ad Copy Generator</h1>
        <p className="text-muted-foreground">
          Generate compliant, on-brand ad copy for your chosen channel and audience.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <CopyForm
                channels={TAXONOMIES.all_channels}
                subtypes={TAXONOMIES.subtypes}
                tones={TAXONOMIES.tones}
                audiences={TAXONOMIES.audiences}
                socialChannels={TAXONOMIES.social_channels}
                onSubmit={handleGenerate}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {results && selectedChannel ? (
            <CopyResults
              results={results}
              channel={selectedChannel}
              onRegenerate={handleRegenerate}
              onSelectOption={handleSelectOption}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Fill in the form and click Generate to create your ad copy.
                </p>
              </CardContent>
            </Card>
          )}

          {showAssetSpecs && assetSpecs.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Image/Video Specs for {selectedChannel}
                </h3>
                <div className="space-y-4">
                  {assetSpecs.map((spec, idx) => (
                    <div key={idx} className="p-4 bg-muted rounded-md text-sm">
                      <p className="font-medium mb-2">{spec.placement_or_format}</p>
                      <div className="space-y-1 text-xs">
                        {spec.aspect_ratio && <p>Aspect Ratio: {spec.aspect_ratio}</p>}
                        {spec.recommended_px && <p>Size: {spec.recommended_px}</p>}
                        {spec.file_types.length > 0 && (
                          <p>Formats: {spec.file_types.join(', ')}</p>
                        )}
                        {spec.max_file_size_mb > 0 && <p>Max Size: {spec.max_file_size_mb}MB</p>}
                        {spec.notes && <p className="mt-2 italic">{spec.notes}</p>}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const text = assetSpecs
                        .map(
                          (s) =>
                            `${s.placement_or_format}: ${s.aspect_ratio || 'N/A'} ${s.recommended_px || ''}`
                        )
                        .join('\n');
                      navigator.clipboard.writeText(text);
                      toast({ title: 'Copied!', description: 'Asset specs copied to clipboard.' });
                    }}
                  >
                    Copy All Specs
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
