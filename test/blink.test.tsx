import { act, render } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { Blink, Isindex } from '../src';

describe('<Blink>', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders a <blink> element and never touches CSS', () => {
    const { container } = render(
      <>
        <Blink>NEW!</Blink>
        <Blink>ALSO NEW!</Blink>
      </>,
    );
    const blinks = container.querySelectorAll('blink');
    expect(blinks).toHaveLength(2);
    expect(blinks[0].textContent).toBe('NEW!');
    act(() => vi.advanceTimersByTime(750));
    expect(document.querySelectorAll('style')).toHaveLength(0);
    expect(container.querySelectorAll('[style]')).toHaveLength(0);
  });

  it('is shown for 750ms and hidden for 250ms, all in unison', () => {
    const { container } = render(
      <>
        <Blink>NEW!</Blink>
        <Blink>HOT!</Blink>
      </>,
    );
    const text = () => Array.from(container.querySelectorAll('blink'), (b) => b.textContent);
    act(() => vi.advanceTimersByTime(500));
    expect(text()).toEqual(['NEW!', 'HOT!']);
    act(() => vi.advanceTimersByTime(250));
    expect(text()).toEqual(['', '']);
    act(() => vi.advanceTimersByTime(250));
    expect(text()).toEqual(['NEW!', 'HOT!']);
    act(() => vi.advanceTimersByTime(750));
    expect(text()).toEqual(['', '']);
  });

  it('holds its place with a transparent GIF per line while hidden', () => {
    const saved = Object.getOwnPropertyDescriptor(Element.prototype, 'getClientRects')!;
    Element.prototype.getClientRects = () =>
      [{ width: 120.4, height: 18 }, { width: 40, height: 18 }] as unknown as DOMRectList;
    try {
      const { container } = render(<Blink>BLINKING ACROSS TWO LINES</Blink>);
      act(() => vi.advanceTimersByTime(750));
      const imgs = Array.from(container.querySelectorAll('blink img'));
      expect(imgs.map((i) => [i.getAttribute('width'), i.getAttribute('height')])).toEqual([
        ['120', '18'],
        ['40', '18'],
      ]);
      expect(imgs[0].getAttribute('src')).toMatch(/^data:image\/gif;base64,/);
      act(() => vi.advanceTimersByTime(250));
      expect(container.querySelector('blink img')).toBeNull();
      expect(container.querySelector('blink')!.textContent).toBe('BLINKING ACROSS TWO LINES');
    } finally {
      Object.defineProperty(Element.prototype, 'getClientRects', saved);
    }
  });

  it('keeps its children mounted, and updating, through the blink', () => {
    let bump = () => {};
    let mounts = 0;
    function Hits() {
      const [n, setN] = useState(0);
      bump = () => setN((x) => x + 1);
      useEffect(() => {
        mounts += 1;
      }, []);
      return <b>{n}</b>;
    }
    const { container } = render(<Blink><Hits /></Blink>);
    const b = container.querySelector('b')!;
    act(() => vi.advanceTimersByTime(750));
    act(() => bump());
    act(() => vi.advanceTimersByTime(250));
    expect(container.querySelector('b')).toBe(b);
    expect(b.textContent).toBe('1');
    expect(mounts).toBe(1);
  });

  it('holds still for prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce') }));
    try {
      const { container } = render(<Blink>calm</Blink>);
      act(() => vi.advanceTimersByTime(750));
      expect(container.querySelector('blink')!.textContent).toBe('calm');
    } finally {
      vi.unstubAllGlobals();
    }
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
