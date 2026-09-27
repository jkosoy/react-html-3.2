import { act, fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { Blink, Isindex } from '../src';

describe('<Blink>', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const shown = (el: ParentNode) =>
    Array.from(el.querySelectorAll('blink'), (b) => (b as HTMLElement).style.visibility !== 'hidden');

  it('renders a <blink> element and never adds a stylesheet', () => {
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
    expect(document.querySelectorAll('style, link')).toHaveLength(0);
  });

  it('is shown for 750ms and hidden for 250ms, all in unison', () => {
    const { container } = render(
      <>
        <Blink>NEW!</Blink>
        <Blink>HOT!</Blink>
      </>,
    );
    act(() => vi.advanceTimersByTime(500));
    expect(shown(container)).toEqual([true, true]);
    act(() => vi.advanceTimersByTime(250));
    expect(shown(container)).toEqual([false, false]);
    act(() => vi.advanceTimersByTime(250));
    expect(shown(container)).toEqual([true, true]);
    act(() => vi.advanceTimersByTime(750));
    expect(shown(container)).toEqual([false, false]);
  });

  it('keeps its children in place, and working, through the blink', () => {
    function Hits() {
      const [n, setN] = useState(0);
      return <a href="#" onClick={() => setN((x) => x + 1)}>{n}</a>;
    }
    const { container } = render(<Blink><Hits /></Blink>);
    const link = container.querySelector('a')!;
    act(() => vi.advanceTimersByTime(750));
    fireEvent.click(link);
    act(() => vi.advanceTimersByTime(250));
    expect(container.querySelector('a')).toBe(link);
    expect(link.textContent).toBe('1');
  });

  it('clears its visibility when it unmounts mid-blink', () => {
    const { container, unmount } = render(<Blink>bye</Blink>);
    const el = container.querySelector('blink') as HTMLElement;
    act(() => vi.advanceTimersByTime(750));
    expect(el.style.visibility).toBe('hidden');
    unmount();
    expect(el.style.visibility).toBe('');
  });

  it('holds still for prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce') }));
    try {
      const { container } = render(<Blink>calm</Blink>);
      act(() => vi.advanceTimersByTime(750));
      expect(shown(container)).toEqual([true]);
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
