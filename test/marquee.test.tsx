import { render } from '@testing-library/react';
import { Marquee, hasNativeMarquee, marqueePlan, MARQUEE_DEFAULTS } from '../src';

const base = { ...MARQUEE_DEFAULTS, containerSize: 400, contentSize: 100 };

describe('marqueePlan', () => {
  it('scrolls from just off the right edge to just off the left edge', () => {
    const plan = marqueePlan(base);
    expect(plan.axis).toBe('X');
    expect(plan.from).toBe(400);
    expect(plan.to).toBe(-100);
    expect(plan.distance).toBe(500);
    expect(plan.iterations).toBe(Infinity);
    expect(plan.mode).toBe('scroll');
  });

  it('moves scrollamount pixels every scrolldelay ms', () => {
    const plan = marqueePlan({ ...base, scrollAmount: 10, scrollDelay: 100 });
    expect(plan.step).toBe(10);
    expect(plan.tickMs).toBe(100);
    expect(plan.pixelsPerSecond).toBe(100);
  });

  it('clamps scrolldelay to 60ms unless truespeed is set', () => {
    expect(marqueePlan({ ...base, scrollDelay: 10 }).tickMs).toBe(60);
    expect(marqueePlan({ ...base, scrollDelay: 10 }).pixelsPerSecond).toBe(100);
    expect(marqueePlan({ ...base, scrollDelay: 10, trueSpeed: true }).tickMs).toBe(10);
    expect(marqueePlan({ ...base, scrollDelay: 10, trueSpeed: true }).pixelsPerSecond).toBe(600);
  });

  it('reverses for direction=right', () => {
    const plan = marqueePlan({ ...base, direction: 'right' });
    expect(plan.from).toBe(-100);
    expect(plan.to).toBe(400);
  });

  it('uses the Y axis for up and down', () => {
    const up = marqueePlan({ ...base, direction: 'up', containerSize: 200, contentSize: 50 });
    expect(up.axis).toBe('Y');
    expect(up.from).toBe(200);
    expect(up.to).toBe(-50);
  });

  it('slides in and stays put', () => {
    const plan = marqueePlan({ ...base, behavior: 'slide' });
    expect(plan.from).toBe(400);
    expect(plan.to).toBe(0);
    expect(plan.mode).toBe('slide');
  });

  it('bounces between the edges for alternate', () => {
    const plan = marqueePlan({ ...base, behavior: 'alternate' });
    expect(plan.from).toBe(300);
    expect(plan.to).toBe(0);
    expect(plan.mode).toBe('alternate');

    const wide = marqueePlan({ ...base, behavior: 'alternate', contentSize: 900 });
    expect(wide.from).toBe(0);
    expect(wide.to).toBe(-500);
  });

  it('honours a finite loop count', () => {
    expect(marqueePlan({ ...base, loop: 3 }).iterations).toBe(3);
    expect(marqueePlan({ ...base, loop: 0 }).iterations).toBe(Infinity);
  });
});

describe('<Marquee>', () => {
  it('has no native marquee under jsdom', () => {
    expect(hasNativeMarquee()).toBe(false);
  });

  it('renders a real <marquee> with the original attribute names', () => {
    const { container } = render(
      <Marquee behavior="alternate" direction="right" scrollAmount={12} scrollDelay={50} trueSpeed loop={2} bgColor="yellow">
        BUY NOW
      </Marquee>,
    );
    const el = container.querySelector('marquee')!;
    expect(el.getAttribute('behavior')).toBe('alternate');
    expect(el.getAttribute('direction')).toBe('right');
    expect(el.getAttribute('scrollamount')).toBe('12');
    expect(el.getAttribute('scrolldelay')).toBe('50');
    expect(el.hasAttribute('truespeed')).toBe(true);
    expect(el.getAttribute('loop')).toBe('2');
    expect(el.getAttribute('bgcolor')).toBe('yellow');
    expect(el.textContent).toBe('BUY NOW');
  });

  it('omits truespeed when it is off', () => {
    const { container } = render(<Marquee>x</Marquee>);
    expect(container.querySelector('marquee')!.hasAttribute('truespeed')).toBe(false);
  });

  it('leaves the loop attribute off so it scrolls forever by default', () => {
    const { container } = render(<Marquee>x</Marquee>);
    expect(container.querySelector('marquee')!.hasAttribute('loop')).toBe(false);
  });

  it('uses attributes and transparent GIFs, never styles', () => {
    const { container } = render(<Marquee>x</Marquee>);
    const el = container.querySelector('marquee')!;
    expect(el.getAttribute('width')).toBe('100%');
    expect(el.querySelectorAll('img')).toHaveLength(2);
    expect(el.querySelector('img')!.getAttribute('src')).toMatch(/^data:image\/gif;base64,/);
    expect(el.hasAttribute('style')).toBe(false);
    expect(el.querySelector('[style]')).toBeNull();
    expect(document.querySelector('style')).toBeNull();
  });

  it('defaults vertical marquees to 200px tall, like browsers did', () => {
    const { container } = render(<Marquee direction="up">x</Marquee>);
    expect(container.querySelector('marquee')!.getAttribute('height')).toBe('200');
  });

  // jsdom does no layout or scrolling, so fake just enough of both.
  function withLayout(scrollable: boolean, run: () => void) {
    const scroll = new WeakMap<Element, number>();
    const fakes: Record<string, PropertyDescriptor> = {
      clientWidth: { get: () => 200 },
      scrollLeft: {
        get(this: Element) {
          return scroll.get(this) ?? 0;
        },
        set(this: Element, v: number) {
          if (scrollable) scroll.set(this, v);
        },
      },
      getBoundingClientRect: {
        value(this: Element) {
          // The content starts after the 200px leading GIF, less the scroll.
          const box = this.closest('marquee')!;
          const left = this === box ? 0 : 200 - (scroll.get(box) ?? 0);
          return { left, top: 0, width: this === box ? 200 : 50, height: 18 };
        },
      },
    };
    const saved = Object.keys(fakes).map((p) => [p, Object.getOwnPropertyDescriptor(Element.prototype, p) ?? Object.getOwnPropertyDescriptor(HTMLElement.prototype, p)] as const);
    for (const [p, d] of Object.entries(fakes)) Object.defineProperty(HTMLElement.prototype, p, { configurable: true, ...d });
    vi.useFakeTimers();
    try {
      run();
    } finally {
      vi.useRealTimers();
      for (const [p] of saved) delete (HTMLElement.prototype as unknown as Record<string, unknown>)[p];
    }
  }

  it('snaps scrollamount pixels on each tick instead of gliding', () => {
    withLayout(true, () => {
      const { container, unmount } = render(<Marquee scrollAmount={10} scrollDelay={100}>WELCOME</Marquee>);
      const box = container.querySelector('marquee')!;
      const at = () => Math.round(box.querySelector('font')!.getBoundingClientRect().left);
      // scroll/left: starts just off the right edge, snaps left 10px a tick.
      expect(box.querySelector('img')!.getAttribute('width')).toBe('200');
      expect(at()).toBe(200);
      vi.advanceTimersByTime(100);
      expect(at()).toBe(190);
      vi.advanceTimersByTime(100);
      expect(at()).toBe(180);
      vi.advanceTimersByTime(99);
      expect(at()).toBe(180);
      unmount();
    });
  });

  it('wraps around once the content is off the far edge', () => {
    withLayout(true, () => {
      const { container, unmount } = render(<Marquee scrollAmount={50} scrollDelay={100}>WELCOME</Marquee>);
      const box = container.querySelector('marquee')!;
      const at = () => Math.round(box.querySelector('font')!.getBoundingClientRect().left);
      vi.advanceTimersByTime(400);
      expect(at()).toBe(0);
      vi.advanceTimersByTime(100); // reaches -50, fully off the left, and starts over
      expect(at()).toBe(200);
      vi.advanceTimersByTime(100);
      expect(at()).toBe(150);
      unmount();
    });
  });

  it("hands back to the browser's own marquee when the box won't scroll", () => {
    const start = vi.fn();
    (HTMLElement.prototype as unknown as { start: () => void }).start = start;
    try {
      withLayout(false, () => {
        const { container, unmount } = render(<Marquee>WELCOME</Marquee>);
        expect(start).toHaveBeenCalled();
        const pads = container.querySelectorAll('marquee img');
        expect(Array.from(pads, (i) => i.getAttribute('width'))).toEqual(['0', '0']);
        unmount();
      });
    } finally {
      delete (HTMLElement.prototype as unknown as { start?: unknown }).start;
    }
  });
});
