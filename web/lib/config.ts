import { z } from 'zod';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

// Zod schemas for validation
const FieldLimitSchema = z.object({
  field: z.string(),
  max_chars: z.number(),
  max_words: z.number(),
  emojis_allowed: z.boolean(),
  count: z.number().optional(),
  notes: z.string().nullable().optional(),
});

const AdLimitSchema = z.object({
  channel: z.string(),
  subtype: z.string().nullable(),
  fields: z.array(FieldLimitSchema),
});

const AssetSpecSchema = z.object({
  channel: z.string(),
  placement_or_format: z.string(),
  aspect_ratio: z.string().nullable(),
  recommended_px: z.string().nullable(),
  duration_seconds_max: z.number(),
  file_types: z.array(z.string()),
  max_file_size_mb: z.number(),
  caption_limit_chars: z.number(),
  notes: z.string().nullable().optional(),
});

const TaxonomiesSchema = z.object({
  social_channels: z.array(z.string()),
  non_emoji_channels: z.array(z.string()),
  all_channels: z.array(z.string()),
  tones: z.array(z.string()),
  audiences: z.array(z.string()),
  subtypes: z.array(z.string()),
});

export type FieldLimit = z.infer<typeof FieldLimitSchema>;
export type AdLimit = z.infer<typeof AdLimitSchema>;
export type AssetSpec = z.infer<typeof AssetSpecSchema>;
export type Taxonomies = z.infer<typeof TaxonomiesSchema>;

// In-memory cache with expiry
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearConfigCache(): void {
  cache.clear();
}

// Config loaders
function loadYaml<T>(filePath: string, schema: z.ZodType<T>): T {
  const cacheKey = `yaml:${filePath}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  // Data directory is at repository root, not web directory
  const fullPath = path.join(process.cwd(), '..', filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const parsed = yaml.load(fileContents);
  const validated = schema.parse(parsed);

  setCache(cacheKey, validated);
  return validated;
}

export function loadAdLimits(): AdLimit[] {
  return loadYaml('data/ad_limits.yaml', z.array(AdLimitSchema));
}

export function loadAssetSpecs(): AssetSpec[] {
  return loadYaml('data/asset_specs.yaml', z.array(AssetSpecSchema));
}

export function loadTaxonomies(): Taxonomies {
  return loadYaml('data/taxonomies.yaml', TaxonomiesSchema);
}

// Helper functions
export function getAdLimitsForChannel(channel: string, subtype?: string | null): AdLimit | null {
  const limits = loadAdLimits();
  return (
    limits.find((l) => l.channel === channel && l.subtype === subtype) ||
    limits.find((l) => l.channel === channel && !l.subtype) ||
    null
  );
}

export function getAssetSpecsForChannel(channel: string): AssetSpec[] {
  const specs = loadAssetSpecs();
  return specs.filter((s) => s.channel === channel);
}

export function isEmojiAllowedForChannel(channel: string): boolean {
  const taxonomies = loadTaxonomies();
  return taxonomies.social_channels.includes(channel);
}
