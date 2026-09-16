import { render } from '@testing-library/react';
import { Basefont, Font, fontSizeToCss, resolveFontSize } from '../src';

describe('resolveFontSize', () => {
  it('passes absolute sizes through and clamps to 1–7', () => {
    expect(resolveFontSize(4)).toBe(4);
    expect(resolveFontSize('6')).toBe(6);
    expect(resolveFontSize(0)).toBe(1);
    expect(resolveFontSize(99)).toBe(7);
  });

  it('resolves relative sizes against the base (default 3)', () => {
    expect(resolveFontSize('+2')).toBe(5);
    expect(resolveFontSize('-1')).toBe(2);
    expect(resolveFontSize('+2', 6)).toBe(7);
    expect(resolveFontSize('-5', 2)).toBe(1);
  });

  it('ignores garbage', () => {
    expect(resolveFontSize(undefined)).toBeUndefined();
    expect(resolveFontSize('')).toBeUndefined();
    expect(resolveFontSize('huge')).toBeUndefined();
  });
});

describe('fontSizeToCss', () => {
  it('maps 1–7 onto the CSS keyword scale', () => {
    expect(fontSizeToCss(1)).toBe('x-small');
    expect(fontSizeToCss(3)).toBe('medium');
    expect(fontSizeToCss(7)).toBe('xxx-large');
  });
});

describe('<Font>', () => {
  it('renders a real <font> element with lowercase attributes', () => {
    const { container } = render(
      <Font size="+1" color="#ff0000" face="Comic Sans MS, cursive">
        hi
      </Font>,
    );
    const font = container.querySelector('font')!;
    expect(font).not.toBeNull();
    expect(font.getAttribute('size')).toBe('4');
    expect(font.getAttribute('color')).toBe('#ff0000');
    expect(font.getAttribute('face')).toBe('Comic Sans MS, cursive');
    expect(font.textContent).toBe('hi');
  });

  it('resolves relative sizes against an enclosing <Basefont>', () => {
    const { container } = render(
      <Basefont size={5} color="navy">
        <Font size="+1">a</Font>
        <Font size="-2">b</Font>
        <Font size={2} color="red">
          c
        </Font>
        <Basefont size="-1">
          <Font size="+0">d</Font>
        </Basefont>
      </Basefont>,
    );
    const fonts = Array.from(container.querySelectorAll('font'));
    expect(fonts.map((f) => f.getAttribute('size'))).toEqual(['6', '3', '2', '4']);
    expect(fonts.map((f) => f.getAttribute('color'))).toEqual(['navy', 'navy', 'red', 'navy']);
    expect(container.querySelectorAll('basefont')).toHaveLength(2);
  });
});
