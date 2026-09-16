export const BASE_FONT_SIZE = 3;

export type FontSize = number | string;

// HTML4 font sizes run 1–7. Relative values ("+2", "-1") are resolved
// against the current <basefont>, which defaults to 3.
export function resolveFontSize(size: FontSize | undefined, base = BASE_FONT_SIZE): number | undefined {
  if (size === undefined || size === '') return undefined;
  const str = String(size).trim();
  const n = parseInt(str, 10);
  if (Number.isNaN(n)) return undefined;
  const value = /^[+-]/.test(str) ? base + n : n;
  return Math.min(7, Math.max(1, value));
}

export const FONT_SIZE_CSS = ['x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large'] as const;

export function fontSizeToCss(size: number): string {
  return FONT_SIZE_CSS[Math.min(7, Math.max(1, size)) - 1];
}
