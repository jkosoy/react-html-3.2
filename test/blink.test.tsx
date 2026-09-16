import { render } from '@testing-library/react';
import { Blink, Isindex } from '../src';

describe('<Blink>', () => {
  it('renders a <blink> element and installs the keyframes once', () => {
    const { container } = render(
      <>
        <Blink>NEW!</Blink>
        <Blink>ALSO NEW!</Blink>
      </>,
    );
    const blinks = container.querySelectorAll('blink');
    expect(blinks).toHaveLength(2);
    expect(blinks[0].textContent).toBe('NEW!');

    const sheets = document.querySelectorAll('style[data-html32="blink"]');
    expect(sheets).toHaveLength(1);
    expect(sheets[0].textContent).toContain('@keyframes html32-blink');
    expect(sheets[0].textContent).toContain('prefers-reduced-motion');
  });
});

describe('<Isindex>', () => {
  it('renders the form the HTML5 parser would have built', () => {
    const { container } = render(<Isindex action="/search" prompt="Find: " />);
    const form = container.querySelector('form')!;
    expect(form.getAttribute('action')).toBe('/search');
    expect(form.querySelectorAll('hr')).toHaveLength(2);
    const label = form.querySelector('label')!;
    expect(label.textContent).toBe('Find: ');
    expect(label.querySelector('input')!.getAttribute('name')).toBe('isindex');
  });

  it('uses the historical default prompt', () => {
    const { container } = render(<Isindex />);
    expect(container.querySelector('label')!.textContent).toMatch(/searchable index/);
  });
});
