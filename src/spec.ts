// Element and attribute tables transcribed from the HTML 3.2 Reference
// Specification (W3C Recommendation, 14 January 1997, "Wilbur"):
// https://www.w3.org/TR/2018/SPSD-html32-20180315/
//
// There are no id, class, or style attributes and no event handlers in
// 3.2. Those arrived with HTML 4.0. Browser extensions of the same era
// (blink, marquee, font face, bgcolor on tables...) live in a separate
// table so that strict mode can refuse them.

const imgAlign = ['top', 'middle', 'bottom', 'left', 'right'];
const blockAlign = ['left', 'center', 'right'];
const cellVAlign = ['top', 'middle', 'bottom'];

export type ValueType = readonly string[] | 'color' | 'number' | 'pixels' | 'length' | 'fontsize' | 'flag' | 'text';

export interface AttributeSpec {
  readonly [attribute: string]: ValueType;
}

const phrase: AttributeSpec = {};
const heading: AttributeSpec = { align: blockAlign };
const cell: AttributeSpec = {
  nowrap: 'flag',
  rowspan: 'number',
  colspan: 'number',
  align: blockAlign,
  valign: cellVAlign,
  width: 'pixels',
  height: 'pixels',
};
const literal: AttributeSpec = {};

export const HTML32_ELEMENTS: Record<string, AttributeSpec> = {
  a: { name: 'text', href: 'text', rel: 'text', rev: 'text', title: 'text' },
  address: {},
  applet: {
    codebase: 'text',
    code: 'text',
    alt: 'text',
    name: 'text',
    width: 'pixels',
    height: 'pixels',
    align: imgAlign,
    hspace: 'pixels',
    vspace: 'pixels',
  },
  area: { shape: ['rect', 'circle', 'poly'], coords: 'text', href: 'text', nohref: 'flag', alt: 'text' },
  b: phrase,
  base: { href: 'text' },
  basefont: { size: 'number' },
  big: phrase,
  blockquote: {},
  body: { bgcolor: 'color', text: 'color', link: 'color', vlink: 'color', alink: 'color', background: 'text' },
  br: { clear: ['left', 'right', 'all', 'none'] },
  caption: { align: ['top', 'bottom'] },
  center: {},
  cite: phrase,
  code: phrase,
  dd: {},
  dfn: phrase,
  dir: { compact: 'flag' },
  div: { align: blockAlign },
  dl: { compact: 'flag' },
  dt: {},
  em: phrase,
  font: { size: 'fontsize', color: 'color' },
  form: { action: 'text', method: ['get', 'post'], enctype: 'text' },
  h1: heading,
  h2: heading,
  h3: heading,
  h4: heading,
  h5: heading,
  h6: heading,
  head: {},
  hr: { align: blockAlign, noshade: 'flag', size: 'pixels', width: 'length' },
  html: { version: 'text' },
  i: phrase,
  img: {
    src: 'text',
    alt: 'text',
    align: imgAlign,
    height: 'pixels',
    width: 'pixels',
    border: 'pixels',
    hspace: 'pixels',
    vspace: 'pixels',
    usemap: 'text',
    ismap: 'flag',
  },
  input: {
    type: ['text', 'password', 'checkbox', 'radio', 'submit', 'reset', 'file', 'hidden', 'image'],
    name: 'text',
    value: 'text',
    checked: 'flag',
    size: 'text',
    maxlength: 'number',
    src: 'text',
    align: imgAlign,
  },
  isindex: { prompt: 'text' },
  kbd: phrase,
  li: { type: ['disc', 'square', 'circle', '1', 'a', 'A', 'i', 'I'], value: 'number' },
  link: { href: 'text', rel: 'text', rev: 'text', title: 'text' },
  listing: literal,
  map: { name: 'text' },
  menu: { compact: 'flag' },
  meta: { 'http-equiv': 'text', name: 'text', content: 'text' },
  ol: { type: ['1', 'a', 'A', 'i', 'I'], start: 'number', compact: 'flag' },
  option: { selected: 'flag', value: 'text' },
  p: { align: blockAlign },
  param: { name: 'text', value: 'text' },
  plaintext: literal,
  pre: { width: 'number' },
  samp: phrase,
  script: {},
  select: { name: 'text', size: 'number', multiple: 'flag' },
  small: phrase,
  strike: phrase,
  strong: phrase,
  style: {},
  sub: phrase,
  sup: phrase,
  table: { align: blockAlign, width: 'length', border: 'pixels', cellspacing: 'pixels', cellpadding: 'pixels' },
  td: cell,
  textarea: { name: 'text', rows: 'number', cols: 'number' },
  th: cell,
  title: {},
  tr: { align: blockAlign, valign: cellVAlign },
  tt: phrase,
  u: phrase,
  ul: { type: ['disc', 'square', 'circle'], compact: 'flag' },
  var: phrase,
  xmp: literal,
};

// Netscape and Internet Explorer extensions that shipped alongside 3.2.
export const VENDOR_ELEMENTS: Record<string, AttributeSpec> = {
  bgsound: { src: 'text', loop: 'text' },
  blink: {},
  embed: { src: 'text', width: 'pixels', height: 'pixels', type: 'text', pluginspage: 'text', hidden: 'flag' },
  frame: {
    src: 'text',
    name: 'text',
    frameborder: ['0', '1', 'yes', 'no'],
    marginwidth: 'pixels',
    marginheight: 'pixels',
    noresize: 'flag',
    scrolling: ['yes', 'no', 'auto'],
  },
  frameset: { rows: 'text', cols: 'text', border: 'pixels', frameborder: ['0', '1', 'yes', 'no'] },
  marquee: {
    behavior: ['scroll', 'slide', 'alternate'],
    bgcolor: 'color',
    direction: ['left', 'right', 'up', 'down'],
    height: 'length',
    hspace: 'pixels',
    loop: 'number',
    scrollamount: 'pixels',
    scrolldelay: 'pixels',
    truespeed: 'flag',
    vspace: 'pixels',
    width: 'length',
  },
  noembed: {},
  noframes: {},
  spacer: { type: ['horizontal', 'vertical', 'block'], size: 'pixels', width: 'pixels', height: 'pixels', align: imgAlign },
};

// Extension attributes on elements that are themselves in 3.2.
export const VENDOR_ATTRIBUTES: Record<string, AttributeSpec> = {
  a: { target: 'text' },
  area: { target: 'text' },
  base: { target: 'text' },
  basefont: { face: 'text', color: 'color' },
  body: { bgproperties: ['fixed'], leftmargin: 'pixels', topmargin: 'pixels' },
  font: { face: 'text' },
  img: { lowsrc: 'text' },
  table: { bgcolor: 'color', bordercolor: 'color', background: 'text' },
  td: { bgcolor: 'color', background: 'text' },
  th: { bgcolor: 'color', background: 'text' },
  tr: { bgcolor: 'color' },
};

export interface ElementLookup {
  strict?: boolean;
}

export function isHtml32Element(name: string, { strict = false }: ElementLookup = {}): boolean {
  if (name in HTML32_ELEMENTS) return true;
  return !strict && name in VENDOR_ELEMENTS;
}

export function isVendorElement(name: string): boolean {
  return name in VENDOR_ELEMENTS;
}

export function attributesFor(element: string, { strict = false }: ElementLookup = {}): AttributeSpec | undefined {
  const own = HTML32_ELEMENTS[element];
  if (own) return strict ? own : { ...own, ...VENDOR_ATTRIBUTES[element] };
  return strict ? undefined : VENDOR_ELEMENTS[element];
}

export function isVendorAttribute(element: string, attribute: string): boolean {
  return attribute in (VENDOR_ATTRIBUTES[element] ?? {});
}

// The sixteen colour names 3.2 defines, from the Windows VGA palette.
export const COLOR_NAMES = [
  'black',
  'silver',
  'gray',
  'white',
  'maroon',
  'red',
  'purple',
  'fuchsia',
  'green',
  'lime',
  'olive',
  'yellow',
  'navy',
  'blue',
  'teal',
  'aqua',
] as const;

export function isValidValue(type: ValueType, raw: string): boolean {
  const value = raw.trim();
  if (Array.isArray(type)) {
    const caseSensitive = type.some((v) => v !== v.toLowerCase());
    return caseSensitive ? type.includes(value) : type.includes(value.toLowerCase());
  }
  switch (type) {
    case 'text':
      return true;
    case 'flag':
      return value === '' || value === raw;
    case 'number':
    case 'pixels':
      return /^\d+$/.test(value);
    case 'length':
      return /^\d+%?$/.test(value);
    case 'fontsize':
      return /^[+-]?[1-7]$/.test(value);
    case 'color':
      return /^#[0-9a-f]{6}$/i.test(value) || (COLOR_NAMES as readonly string[]).includes(value.toLowerCase());
  }
  return true;
}

export function describeValueType(type: ValueType): string {
  if (Array.isArray(type)) return type.join(' | ');
  switch (type) {
    case 'color':
      return '#rrggbb or one of the sixteen colour names';
    case 'number':
    case 'pixels':
      return 'an integer';
    case 'length':
      return 'an integer or a percentage';
    case 'fontsize':
      return '1 to 7, or +n / -n';
    case 'flag':
      return 'no value';
  }
  return 'text';
}

// What a page author reached for before the HTML5 element existed.
export const REPLACEMENTS: Record<string, string> = {
  section: 'table',
  article: 'table',
  nav: 'table',
  aside: 'table',
  header: 'table',
  footer: 'table',
  main: 'table',
  figure: 'table',
  figcaption: 'font',
  span: 'font',
  abbr: 'i',
  acronym: 'i',
  q: 'i',
  ins: 'u',
  del: 'strike',
  s: 'strike',
  mark: 'font',
  time: 'i',
  label: 'b',
  fieldset: 'table',
  legend: 'caption',
  button: 'input',
  iframe: 'frame',
  object: 'embed',
  video: 'embed',
  audio: 'bgsound',
  canvas: 'applet',
  picture: 'img',
  progress: 'img',
  meter: 'img',
  wbr: 'br',
  details: 'a',
  summary: 'a',
  dialog: 'table',
  template: 'noembed',
};
