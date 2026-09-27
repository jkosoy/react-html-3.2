import { render } from '@testing-library/react';
import { Spacer } from '../src';

const gifs = (el: Element) =>
  Array.from(el.querySelectorAll('img'), (i) => [i.getAttribute('width'), i.getAttribute('height'), i.getAttribute('align')]);

describe('<Spacer>', () => {
  it('holds horizontal space with a transparent GIF', () => {
    const { container } = render(<Spacer size={20} />);
    const spacer = container.querySelector('spacer')!;
    expect(gifs(spacer)).toEqual([['20', '1', null]]);
    expect(spacer.querySelector('img')!.getAttribute('src')).toMatch(/^data:image\/gif;base64,/);
  });

  it('starts a new line with an empty table size pixels tall for type=vertical', () => {
    const { container } = render(<Spacer type="vertical" size={12} />);
    const td = container.querySelector('spacer > table td')!;
    expect(td.getAttribute('height')).toBe('12');
    expect(td.childNodes).toHaveLength(0);
  });

  it('sizes and aligns a type=block GIF', () => {
    const { container } = render(<Spacer type="block" width={30} height={40} align="left" />);
    expect(gifs(container.querySelector('spacer')!)).toEqual([['30', '40', 'left']]);
  });

  it('uses no styles', () => {
    const { container } = render(<Spacer type="block" width={30} height={40} align="right" />);
    expect(container.querySelectorAll('[style]')).toHaveLength(0);
  });
});
