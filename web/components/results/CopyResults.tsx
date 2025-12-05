'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  isDropdown?: boolean;
  dropdownOptions?: string[];
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

function FieldDisplay({
  field,
  selectedValue,
  onValueChange
}: {
  field: GeneratedField;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}) {
  // If this is a dropdown field, show a selector
  if (field.isDropdown && field.dropdownOptions && field.dropdownOptions.length > 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{formatFieldName(field.field)}</span>
        </div>
        <Select value={selectedValue} onValueChange={onValueChange}>
          <SelectTrigger className="w-full h-11 text-base">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {field.dropdownOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Otherwise, show generated text as before
  const displayValue = field.value;
  const isArray = Array.isArray(displayValue);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{formatFieldName(field.field)}</span>
        <Badge variant={field.isOverLimit ? 'destructive' : 'outline'} className="text-xs">
          {field.charCount}/{field.maxChars}
        </Badge>
      </div>
      {isArray ? (
        <ul className="space-y-2">
          {displayValue.map((v, i) => (
            <li key={i} className="text-sm bg-muted p-3 rounded-lg">
              {i + 1}. {v}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap break-words">{displayValue}</p>
      )}
      {field.isOverLimit && (
        <div className="flex items-start gap-2 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>Over limit by {field.charCount - field.maxChars} characters.</span>
        </div>
      )}
    </div>
  );
}

export function CopyResults({ results, channel, onRegenerate, onSelectOption }: CopyResultsProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  // Track dropdown selections for each option and field
  // Structure: { optionNumber: { fieldName: selectedValue } }
  const [dropdownSelections, setDropdownSelections] = useState<Record<number, Record<string, string>>>(() => {
    // Initialize with first option from each dropdown
    const initial: Record<number, Record<string, string>> = {};
    results.forEach((option) => {
      initial[option.option] = {};
      option.fields.forEach((field) => {
        if (field.isDropdown && field.dropdownOptions && field.dropdownOptions.length > 0) {
          initial[option.option][field.field] = field.dropdownOptions[0];
        }
      });
    });
    return initial;
  });

  const handleDropdownChange = (optionNumber: number, fieldName: string, value: string) => {
    setDropdownSelections((prev) => ({
      ...prev,
      [optionNumber]: {
        ...(prev[optionNumber] || {}),
        [fieldName]: value,
      },
    }));
  };

  const handleCopy = async (option: GeneratedOption) => {
    const text = option.fields
      .map((f) => {
        // For dropdown fields, use the selected value
        if (f.isDropdown) {
          const selectedValue = dropdownSelections[option.option]?.[f.field] || f.dropdownOptions?.[0] || '';
          return `${formatFieldName(f.field)}:\n${selectedValue}`;
        }

        // For regular fields, use the generated value
        const val = f.value; // Always copy full text
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Generated Copy</h2>
        <Button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto touch-manipulation"
        >
          {isRegenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {results.map((option) => (
          <Card key={option.option} className="rounded-xl shadow-sm border hover:shadow-lg transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg">{channel}</CardTitle>
                  <CardDescription className="text-sm">Generated ad copy</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopy(option)}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial touch-manipulation"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {option.fields.map((field, idx) => (
                <FieldDisplay
                  key={`${option.option}-${idx}`}
                  field={field}
                  selectedValue={dropdownSelections[option.option]?.[field.field]}
                  onValueChange={(value) => handleDropdownChange(option.option, field.field, value)}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted p-4 sm:p-5 rounded-lg text-sm">
        <p className="font-medium mb-2">Compliance Note:</p>
        <p className="text-sm text-muted-foreground">
          This tool provides initial draft copy. All claims must be verified before submitting to
          RH for build. Copy character limits may also need checking to ensure individual
          requirements.
        </p>
      </div>
    </div>
  );
}
