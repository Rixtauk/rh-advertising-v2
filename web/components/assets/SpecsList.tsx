'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { copyToClipboard } from '@/lib/clipboard';

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

interface SpecsListProps {
  specs: AssetSpec[];
  channel: string;
}

function formatSpecsForCopy(specs: AssetSpec[]): string {
  return specs
    .map((spec) => {
      const lines = [
        `Channel: ${spec.channel}`,
        `Placement/Format: ${spec.placement_or_format}`,
      ];
      if (spec.aspect_ratio) lines.push(`Aspect Ratio: ${spec.aspect_ratio}`);
      if (spec.recommended_px) lines.push(`Recommended Size: ${spec.recommended_px}`);
      if (spec.duration_seconds_max > 0)
        lines.push(`Max Duration: ${spec.duration_seconds_max}s`);
      if (spec.file_types.length) lines.push(`File Types: ${spec.file_types.join(', ')}`);
      if (spec.max_file_size_mb > 0) lines.push(`Max File Size: ${spec.max_file_size_mb}MB`);
      if (spec.caption_limit_chars > 0)
        lines.push(`Caption Limit: ${spec.caption_limit_chars} chars`);
      if (spec.notes) lines.push(`Notes: ${spec.notes}`);
      return lines.join('\n');
    })
    .join('\n\n---\n\n');
}

export function SpecsList({ specs, channel }: SpecsListProps) {
  const { toast } = useToast();

  const handleCopyAll = async () => {
    const text = formatSpecsForCopy(specs);
    try {
      await copyToClipboard(text);
      toast({
        title: 'Copied!',
        description: 'Asset specs have been copied to your clipboard.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please try selecting and copying manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Asset Specifications for {channel}</h2>
        <Button onClick={handleCopyAll} variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Copy All
        </Button>
      </div>

      {specs.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No asset specifications found for this channel.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {specs.map((spec, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{spec.placement_or_format}</CardTitle>
              <CardDescription>{spec.channel}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {spec.aspect_ratio && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Aspect Ratio:</span>
                  <span>{spec.aspect_ratio}</span>
                </div>
              )}
              {spec.recommended_px && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Recommended Size:</span>
                  <span>{spec.recommended_px}</span>
                </div>
              )}
              {spec.duration_seconds_max > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Max Duration:</span>
                  <span>{spec.duration_seconds_max}s</span>
                </div>
              )}
              {spec.file_types.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">File Types:</span>
                  <div className="flex flex-wrap gap-1">
                    {spec.file_types.map((ft) => (
                      <Badge key={ft} variant="secondary">
                        {ft}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {spec.max_file_size_mb > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Max File Size:</span>
                  <span>{spec.max_file_size_mb}MB</span>
                </div>
              )}
              {spec.caption_limit_chars > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Caption Limit:</span>
                  <span>{spec.caption_limit_chars} chars</span>
                </div>
              )}
              {spec.notes && (
                <div className="mt-3 p-2 bg-muted rounded text-xs">
                  <p className="font-medium mb-1">Notes:</p>
                  <p>{spec.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
