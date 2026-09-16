import { HTML32_ELEMENTS, VENDOR_ELEMENTS, attributesFor, isHtml32Element, isValidValue } from '../src/spec';
import { SYSTEM_FONTS, isSystemFont, splitFaces } from '../src/fonts';

describe('HTML 3.2 element table', () => {
  it('has the elements from the Wilbur DTD', () => {
    expect(Object.keys(HTML32_ELEMENTS)).toHaveLength(70);
  });

  it('has no id, class, style, or event attributes anywhere', () => {
    for (const [, attrs] of Object.entries(HTML32_ELEMENTS)) {
      for (const a of Object.keys(attrs)) {
        expect(['id', 'class', 'style']).not.toContain(a);
        expect(a).not.toMatch(/^on/);
      }
    }
  });

  it('knows what 4.0 added', () => {
    for (const el of ['span', 'abbr', 'q', 'iframe', 'object', 'label', 'button', 'fieldset', 'section']) {
      expect(isHtml32Element(el)).toBe(false);
    }
  });

  it('treats blink and marquee as vendor extensions', () => {
    expect(isHtml32Element('marquee')).toBe(true);
    expect(isHtml32Element('marquee', { strict: true })).toBe(false);
    expect('blink' in VENDOR_ELEMENTS).toBe(true);
  });

  it('gives <font> size and color, and face only when not strict', () => {
    expect(Object.keys(attributesFor('font')!)).toEqual(['size', 'color', 'face']);
    expect(Object.keys(attributesFor('font', { strict: true })!)).toEqual(['size', 'color']);
  });

  it('gives <td> its cell attributes and vendor bgcolor', () => {
    const td = attributesFor('td')!;
    for (const a of ['nowrap', 'rowspan', 'colspan', 'align', 'valign', 'width', 'height', 'bgcolor']) {
      expect(td).toHaveProperty(a);
    }
    expect(attributesFor('td', { strict: true })).not.toHaveProperty('bgcolor');
  });
});

describe('isValidValue', () => {
  it('checks enumerations case-insensitively unless the list is mixed case', () => {
    expect(isValidValue(['left', 'center', 'right'], 'CENTER')).toBe(true);
    expect(isValidValue(['left', 'center', 'right'], 'justify')).toBe(false);
    expect(isValidValue(['1', 'a', 'A', 'i', 'I'], 'A')).toBe(true);
    expect(isValidValue(['1', 'a', 'A', 'i', 'I'], 'b')).toBe(false);
  });

  it('accepts #rrggbb and the sixteen VGA names for colours', () => {
    expect(isValidValue('color', '#FF00ff')).toBe(true);
    expect(isValidValue('color', 'Fuchsia')).toBe(true);
    expect(isValidValue('color', '#fff')).toBe(false);
    expect(isValidValue('color', 'orange')).toBe(false);
    expect(isValidValue('color', 'rgb(0,0,0)')).toBe(false);
  });

  it('knows pixels from lengths from font sizes', () => {
    expect(isValidValue('pixels', '12')).toBe(true);
    expect(isValidValue('pixels', '50%')).toBe(false);
    expect(isValidValue('length', '50%')).toBe(true);
    expect(isValidValue('length', '12px')).toBe(false);
    expect(isValidValue('fontsize', '+2')).toBe(true);
    expect(isValidValue('fontsize', '8')).toBe(false);
  });
});

describe('system fonts', () => {
  it('has the core fonts for the web', () => {
    for (const f of ['Verdana', 'Georgia', 'Trebuchet MS', 'Comic Sans MS', 'Impact']) {
      expect(SYSTEM_FONTS).toContain(f);
    }
  });

  it('matches case-insensitively and strips quotes', () => {
    expect(isSystemFont('arial')).toBe(true);
    expect(isSystemFont('"Times New Roman"')).toBe(true);
    expect(isSystemFont('Inter')).toBe(false);
    expect(isSystemFont('Inter', ['Inter'])).toBe(true);
  });

  it('splits face lists', () => {
    expect(splitFaces('Arial, Helvetica , sans-serif')).toEqual(['Arial', 'Helvetica', 'sans-serif']);
  });
});
