'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { copyToClipboard } from '@/lib/clipboard';

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

interface CopyResultsProps {
  results: GeneratedOption[];
  channel: string;
  onRegenerate: () => Promise<void>;
  onSelectOption: (option: GeneratedOption) => void;
}

function formatFieldName(field: string): string {
  return field
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function FieldDisplay({ field }: { field: GeneratedField }) {
  const displayValue = field.isOverLimit && field.shortened ? field.shortened : field.value;
  const isArray = Array.isArray(displayValue);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{formatFieldName(field.field)}</span>
        <Badge variant={field.isOverLimit ? 'destructive' : 'outline'}>
          {field.charCount}/{field.maxChars}
        </Badge>
      </div>
      {isArray ? (
        <ul className="space-y-1">
          {displayValue.map((v, i) => (
            <li key={i} className="text-sm bg-muted p-2 rounded">
              {i + 1}. {v}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">{displayValue}</p>
      )}
      {field.isOverLimit && (
        <div className="flex items-start gap-2 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>Over limit. Shortened alternative shown above.</span>
        </div>
      )}
    </div>
  );
}

export function CopyResults({ results, channel, onRegenerate, onSelectOption }: CopyResultsProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (option: GeneratedOption) => {
    const text = option.fields
      .map((f) => {
        const val = f.isOverLimit && f.shortened ? f.shortened : f.value;
        const formatted = Array.isArray(val) ? val.map((v, i) => `${i + 1}. ${v}`).join('\n') : val;
        return `${formatFieldName(f.field)}:\n${formatted}`;
      })
      .join('\n\n');

    try {
      await copyToClipboard(text);
      toast({
        title: 'Copied!',
        description: 'Ad copy has been copied to your clipboard.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please try selecting and copying manually.',
        variant: 'destructive',
      });
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Generated Options</h2>
        <Button onClick={handleRegenerate} disabled={isRegenerating} variant="outline" size="sm">
          {isRegenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate 3 More
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {results.map((option) => (
          <Card key={option.option} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Option {option.option}</CardTitle>
              <CardDescription>{channel}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {option.fields.map((field, idx) => (
                <FieldDisplay key={`${option.option}-${idx}`} field={field} />
              ))}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleCopy(option)} variant="outline" size="sm" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={() => onSelectOption(option)} variant="default" size="sm" className="flex-1">
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-md text-sm">
        <p className="font-medium mb-1">Compliance Note:</p>
        <p>
          This tool provides initial draft copy. All claims must be verified before submitting to
          RH for build. Copy character limits may also need checking to ensure individual
          requirements.
        </p>
      </div>
    </div>
  );
}
