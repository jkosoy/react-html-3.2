// Fonts that shipped with Windows 95/98, Mac OS 7.5–9, or Microsoft's "Core
// fonts for the Web" (1996).
export const SYSTEM_FONTS = [
  // Windows
  'Arial',
  'Arial Black',
  'Arial Narrow',
  'Book Antiqua',
  'Bookman Old Style',
  'Century Gothic',
  'Courier',
  'Courier New',
  'Garamond',
  'Lucida Console',
  'Lucida Sans Unicode',
  'MS Sans Serif',
  'MS Serif',
  'Symbol',
  'Tahoma',
  'Times New Roman',
  'Wingdings',
  // Mac OS
  'Apple Chancery',
  'Capitals',
  'Charcoal',
  'Chicago',
  'Gadget',
  'Geneva',
  'Helvetica',
  'Hoefler Text',
  'Monaco',
  'New York',
  'Palatino',
  'Sand',
  'Skia',
  'Techno',
  'Textile',
  'Times',
  // Core fonts for the Web
  'Andale Mono',
  'Comic Sans MS',
  'Georgia',
  'Impact',
  'Trebuchet MS',
  'Verdana',
  'Webdings',
] as const;

const lookup = new Set<string>(SYSTEM_FONTS.map((f) => f.toLowerCase()));

export function isSystemFont(face: string, extra: readonly string[] = []): boolean {
  const name = face.trim().replace(/^["']|["']$/g, '').toLowerCase();
  return lookup.has(name) || extra.some((f) => f.toLowerCase() === name);
}

export function splitFaces(face: string): string[] {
  return face
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);
}
