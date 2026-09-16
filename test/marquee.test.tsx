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

  it('polyfills with an overflow-hidden container and a nowrap track', () => {
    const { container } = render(<Marquee>x</Marquee>);
    const el = container.querySelector('marquee') as HTMLElement;
    expect(el.style.overflow).toBe('hidden');
    expect(el.style.width).toBe('100%');
    const track = el.firstElementChild as HTMLElement;
    expect(track.tagName).toBe('SPAN');
    expect(track.style.whiteSpace).toBe('nowrap');
  });

  it('defaults vertical marquees to 200px tall, like browsers did', () => {
    const { container } = render(<Marquee direction="up">x</Marquee>);
    expect((container.querySelector('marquee') as HTMLElement).style.height).toBe('200px');
  });

  it('snaps the track scrollamount pixels on each tick instead of gliding', () => {
    // jsdom does no layout, so feed the effect real sizes to measure against.
    const sizes: Record<string, number> = { clientWidth: 200, offsetWidth: 50 };
    const saved = Object.keys(sizes).map(
      (p) => [p, Object.getOwnPropertyDescriptor(HTMLElement.prototype, p)] as const,
    );
    for (const p of Object.keys(sizes)) {
      Object.defineProperty(HTMLElement.prototype, p, { configurable: true, get: () => sizes[p] });
    }
    vi.useFakeTimers();
    try {
      const { container, unmount } = render(<Marquee scrollAmount={10} scrollDelay={100}>WELCOME</Marquee>);
      const track = container.querySelector('span') as HTMLElement;
      // scroll/left: starts off the right edge (container width), snaps left 10px a tick.
      expect(track.style.transform).toBe('translateX(200px)');
      vi.advanceTimersByTime(100);
      expect(track.style.transform).toBe('translateX(190px)');
      vi.advanceTimersByTime(100);
      expect(track.style.transform).toBe('translateX(180px)');
      unmount();
    } finally {
      vi.useRealTimers();
      for (const [p, d] of saved) {
        if (d) Object.defineProperty(HTMLElement.prototype, p, d);
        else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[p];
      }
    }
  });
});
