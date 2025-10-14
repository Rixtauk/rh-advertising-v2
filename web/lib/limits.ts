import { AdLimit } from './config';

export function summarizeLimits(limits: AdLimit): string {
  return limits.fields
    .map((f) => {
      const countInfo = f.count && f.count > 1 ? ` (×${f.count})` : '';
      return `${f.field}: ${f.max_chars} chars${countInfo}`;
    })
    .join(', ');
}

export function formatLimitsForDisplay(limits: AdLimit): string {
  return limits.fields
    .map((f) => {
      const countInfo = f.count && f.count > 1 ? ` (up to ${f.count} variations)` : '';
      const notes = f.notes ? ` — ${f.notes}` : '';
      return `• **${f.field}**: max ${f.max_chars} characters${countInfo}${notes}`;
    })
    .join('\n');
}
