'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Info, AlertCircle } from 'lucide-react';

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
  creativity: 3 | 5 | 7;
  openDayDate: string;
  courseName: string;
}

export function CopyForm({ channels, subtypes, tones, audiences, socialChannels, onSubmit }: CopyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const [formState, setFormState] = useState<FormState>({
    channel: '',
    subtype: '',
    university: '',
    tone: '',
    audience: '',
    usps: '',
    landingUrl: '',
    includeEmojis: false,
    creativity: 5,
    openDayDate: '',
    courseName: '',
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
  const showEmojiToggle = isSocialChannel;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous validation errors
    setValidationError('');

    // Validate that either landing URL or USPs are provided
    const hasLandingUrl = formState.landingUrl.trim().length > 0;
    const hasUsps = formState.usps.trim().length > 0;

    if (!hasLandingUrl && !hasUsps) {
      setValidationError('Please provide either a landing page URL or manual USPs to generate copy.');
      return;
    }

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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="channel" className="text-sm font-medium">Channel *</Label>
        <Select
          value={formState.channel}
          onValueChange={(val) => setFormState((prev) => ({ ...prev, channel: val }))}
        >
          <SelectTrigger id="channel" className="w-full h-11 text-base">
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
        {(formState.channel === 'LINKEDIN LEAD GEN' ||
          formState.channel === 'LINKEDIN SINGLE IMAGE' ||
          formState.channel === 'LINKEDIN SINGLE VIDEO') && (
          <p className="text-xs text-muted-foreground mt-2">
            <strong>IntroText:</strong> Can be up to 600 characters, however we recommend up to 200
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtype" className="text-sm font-medium">Type of Communication *</Label>
        <Select
          value={formState.subtype}
          onValueChange={(val) => setFormState((prev) => ({ ...prev, subtype: val }))}
        >
          <SelectTrigger id="subtype" className="w-full h-11 text-base">
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

      {formState.subtype === 'Subject/course specific ad' && (
        <div className="space-y-2">
          <Label htmlFor="courseName" className="text-sm font-medium">Name of Course *</Label>
          <input
            id="courseName"
            type="text"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="e.g., Computer Science BSc"
            value={formState.courseName}
            onChange={(e) => setFormState((prev) => ({ ...prev, courseName: e.target.value }))}
            required
          />
        </div>
      )}

      {formState.subtype === 'Open Day' && (
        <div className="space-y-2">
          <Label htmlFor="openDayDate" className="text-sm font-medium">Open Day Date (Optional)</Label>
          <input
            id="openDayDate"
            type="date"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={formState.openDayDate}
            onChange={(e) => setFormState((prev) => ({ ...prev, openDayDate: e.target.value }))}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="university" className="text-sm font-medium">University Name *</Label>
        <input
          id="university"
          type="text"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="e.g., University of Nowhere"
          value={formState.university}
          onChange={(e) => setFormState((prev) => ({ ...prev, university: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone" className="text-sm font-medium">Tone of Voice *</Label>
        <Select
          value={formState.tone}
          onValueChange={(val) => setFormState((prev) => ({ ...prev, tone: val }))}
        >
          <SelectTrigger id="tone" className="w-full h-11 text-base">
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
        <div className="flex items-center space-x-3 py-2">
          <Switch
            id="includeEmojis"
            checked={formState.includeEmojis}
            onCheckedChange={(checked) =>
              setFormState((prev) => ({ ...prev, includeEmojis: checked }))
            }
          />
          <Label htmlFor="includeEmojis" className="text-sm font-medium cursor-pointer">Include emojis</Label>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="audience" className="text-sm font-medium">Audience *</Label>
        <Select
          value={formState.audience}
          onValueChange={(val) => setFormState((prev) => ({ ...prev, audience: val }))}
        >
          <SelectTrigger id="audience" className="w-full h-11 text-base">
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

      {/* Creativity Level */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Creativity Level</Label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFormState((prev) => ({ ...prev, creativity: 3 }))}
            className={`p-3 rounded-lg border-2 transition-all duration-200 min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center touch-manipulation ${
              formState.creativity === 3
                ? 'border-[#579EBE] bg-[#579EBE] text-white shadow-md'
                : 'border-border bg-white hover:border-[#579EBE]/50 hover:bg-[#579EBE]/5 active:scale-95'
            }`}
          >
            <div className="text-xs sm:text-sm font-medium text-center">Conservative</div>
            <div className={`text-xs mt-1.5 text-center ${
              formState.creativity === 3 ? 'text-white/90' : 'text-muted-foreground'
            }`}>
              Follows limits
            </div>
          </button>
          <button
            type="button"
            onClick={() => setFormState((prev) => ({ ...prev, creativity: 5 }))}
            className={`p-3 rounded-lg border-2 transition-all duration-200 min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center touch-manipulation ${
              formState.creativity === 5
                ? 'border-[#579EBE] bg-[#579EBE] text-white shadow-md'
                : 'border-border bg-white hover:border-[#579EBE]/50 hover:bg-[#579EBE]/5 active:scale-95'
            }`}
          >
            <div className="text-xs sm:text-sm font-medium text-center">Balanced</div>
            <div className={`text-xs mt-1.5 text-center ${
              formState.creativity === 5 ? 'text-white/90' : 'text-muted-foreground'
            }`}>
              Recommended
            </div>
          </button>
          <button
            type="button"
            onClick={() => setFormState((prev) => ({ ...prev, creativity: 7 }))}
            className={`p-3 rounded-lg border-2 transition-all duration-200 min-h-[90px] sm:min-h-[100px] flex flex-col items-center justify-center touch-manipulation ${
              formState.creativity === 7
                ? 'border-[#579EBE] bg-[#579EBE] text-white shadow-md'
                : 'border-border bg-white hover:border-[#579EBE]/50 hover:bg-[#579EBE]/5 active:scale-95'
            }`}
          >
            <div className="text-xs sm:text-sm font-medium text-center">Creative</div>
            <div className={`text-xs mt-1.5 text-center ${
              formState.creativity === 7 ? 'text-white/90' : 'text-muted-foreground'
            }`}>
              More variety
            </div>
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Lower values prioritise staying within character limits. Higher values allow more creative freedom.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="landingUrl" className="text-sm font-medium">Landing Page URL (optional)</Label>
        <input
          id="landingUrl"
          type="url"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="https://www.huish.ac.uk/"
          value={formState.landingUrl}
          onChange={(e) => {
            setFormState((prev) => ({ ...prev, landingUrl: e.target.value }));
            // Clear validation error when user starts typing
            if (validationError) setValidationError('');
          }}
        />
        <p className="text-xs text-muted-foreground">
          Add a landing page URL to automatically extract and incorporate USPs into your ad copy. This will add 10-20 seconds to generation time.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="usps" className="text-sm font-medium">
          Optional USPs (if not scraping a page)
        </Label>
        <Textarea
          id="usps"
          placeholder="Enter key points, dates, or unique selling points..."
          rows={5}
          className="text-base resize-none"
          value={formState.usps}
          onChange={(e) => {
            setFormState((prev) => ({ ...prev, usps: e.target.value }));
            // Clear validation error when user starts typing
            if (validationError) setValidationError('');
          }}
        />
        <p className="text-xs text-muted-foreground">
          Leave blank if using a landing page URL above, or add your own USPs here. At least one is required.
        </p>
      </div>

      {/* Timing notice when landing URL is provided */}
      {formState.landingUrl && (
        <div className="flex items-start gap-2 sm:gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4 text-sm">
          <Info className="h-4 w-4 flex-shrink-0 text-blue-600 mt-0.5" />
          <p className="text-blue-900 text-sm">
            Since you've added a landing page URL, generation will take 10-20 seconds while we extract and analyse USPs.
          </p>
        </div>
      )}

      {/* Validation error message */}
      {validationError && (
        <div className="flex items-start gap-2 sm:gap-3 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
          <p className="text-red-900 text-sm">{validationError}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 sm:h-12 text-base bg-[#579EBE] hover:bg-[#4a8aa8] text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none touch-manipulation"
      >
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
