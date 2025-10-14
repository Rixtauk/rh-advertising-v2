'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Sparkles, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CopyFormProps {
  channels: string[];
  subtypes: string[];
  tones: string[];
  audiences: string[];
  socialChannels: string[];
  onSubmit: (data: FormData) => Promise<void>;
}

interface FormState {
  channel: string;
  subtype: string;
  university: string;
  tone: string;
  audience: string;
  usps: string;
  landingUrl: string;
  includeEmojis: boolean;
}

export function CopyForm({ channels, subtypes, tones, audiences, socialChannels, onSubmit }: CopyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedUSPs, setExtractedUSPs] = useState<string[]>([]);
  const [selectedUSPs, setSelectedUSPs] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const [formState, setFormState] = useState<FormState>({
    channel: '',
    subtype: '',
    university: '',
    tone: '',
    audience: '',
    usps: '',
    landingUrl: '',
    includeEmojis: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rh-copy-form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormState((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('rh-copy-form', JSON.stringify(formState));
  }, [formState]);

  const isSocialChannel = socialChannels.includes(formState.channel);
  const isLightHearted = formState.tone === 'Light-hearted & modern';
  const showEmojiToggle = isSocialChannel && isLightHearted;

  const handleAnalyzeUSPs = async () => {
    if (!formState.landingUrl) {
      toast({
        title: 'Landing Page URL Required',
        description: 'Please enter a landing page URL to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/v1/analyze-usps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formState.landingUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze landing page');
      }

      const data = await response.json();
      setExtractedUSPs(data.usps);
      setSelectedUSPs(new Set(data.usps.map((_: any, index: number) => index))); // Select all by default

      toast({
        title: 'USPs Extracted!',
        description: `Found ${data.usps.length} key selling points. Click to select/deselect.`,
      });
    } catch (error) {
      console.error('Error analyzing USPs:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze landing page',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleUSP = (index: number) => {
    const newSelected = new Set(selectedUSPs);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedUSPs(newSelected);
  };

  const handleApplyUSPs = () => {
    const selectedUSPTexts = Array.from(selectedUSPs)
      .sort((a, b) => a - b)
      .map((index) => extractedUSPs[index]);

    const uspText = selectedUSPTexts.join('\n');
    setFormState((prev) => ({ ...prev, usps: uspText }));

    toast({
      title: 'USPs Applied',
      description: `Added ${selectedUSPTexts.length} USPs to the field.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="channel">Channel *</Label>
        <Select
          value={formState.channel}
          onValueChange={(val) => setFormState((prev) => ({ ...prev, channel: val }))}
        >
          <SelectTrigger id="channel">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent>
            {channels.map((ch) => (
              <SelectItem key={ch} value={ch}>
                {ch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtype">Type of Communication *</Label>
        <Select
          value={formState.subtype}
          onValueChange={(val) => setFormState((prev) => ({ ...prev, subtype: val }))}
        >
          <SelectTrigger id="subtype">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {subtypes.map((st) => (
              <SelectItem key={st} value={st}>
                {st}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">University Name *</Label>
        <input
          id="university"
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="e.g., University of Nowhere"
          value={formState.university}
          onChange={(e) => setFormState((prev) => ({ ...prev, university: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Tone of Voice *</Label>
        <Select
          value={formState.tone}
          onValueChange={(val) => setFormState((prev) => ({ ...prev, tone: val }))}
        >
          <SelectTrigger id="tone">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            {tones.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showEmojiToggle && (
        <div className="flex items-center space-x-2">
          <Switch
            id="includeEmojis"
            checked={formState.includeEmojis}
            onCheckedChange={(checked) =>
              setFormState((prev) => ({ ...prev, includeEmojis: checked }))
            }
          />
          <Label htmlFor="includeEmojis">Include emojis</Label>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="audience">Audience *</Label>
        <Select
          value={formState.audience}
          onValueChange={(val) => setFormState((prev) => ({ ...prev, audience: val }))}
        >
          <SelectTrigger id="audience">
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            {audiences.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="landingUrl">Landing Page URL (optional)</Label>
        <div className="flex gap-2">
          <input
            id="landingUrl"
            type="url"
            className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="https://www.huish.ac.uk/"
            value={formState.landingUrl}
            onChange={(e) => setFormState((prev) => ({ ...prev, landingUrl: e.target.value }))}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAnalyzeUSPs}
            disabled={isAnalyzing || !formState.landingUrl}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Now
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter a URL and click "Analyze Now" to extract key USPs automatically.
        </p>
      </div>

      {extractedUSPs.length > 0 && (
        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Extracted USPs (Click to select/deselect)</Label>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={handleApplyUSPs}
              disabled={selectedUSPs.size === 0}
            >
              Apply Selected ({selectedUSPs.size})
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {extractedUSPs.map((usp, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleToggleUSP(index)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedUSPs.has(index)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                } border`}
              >
                {usp}
                {selectedUSPs.has(index) && <X className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="usps">USPs / Key Points *</Label>
        <Textarea
          id="usps"
          placeholder="Enter key points, dates, or unique selling points (or use Analyze Now above)..."
          rows={5}
          value={formState.usps}
          onChange={(e) => setFormState((prev) => ({ ...prev, usps: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Copy'
        )}
      </Button>
    </form>
  );
}
