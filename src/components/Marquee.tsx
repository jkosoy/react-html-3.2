import {
  createElement,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { marqueePlan, MARQUEE_DEFAULTS, type MarqueeBehavior, type MarqueeDirection } from '../marquee';

export interface MarqueeProps {
  behavior?: MarqueeBehavior;
  direction?: MarqueeDirection;
  scrollAmount?: number;
  scrollDelay?: number;
  trueSpeed?: boolean;
  loop?: number;
  bgColor?: string;
  width?: number | string;
  height?: number | string;
  hSpace?: number;
  vSpace?: number;
  children?: ReactNode;
}


// A native marquee that actually animates implements start()/stop(); jsdom's
// does not.
export function hasNativeMarquee(): boolean {
  return typeof HTMLMarqueeElement !== 'undefined' && 'start' in HTMLMarqueeElement.prototype;
}

const trackStyle: CSSProperties = { display: 'inline-block', whiteSpace: 'nowrap' };

export function Marquee({
  behavior = MARQUEE_DEFAULTS.behavior,
  direction = MARQUEE_DEFAULTS.direction,
  scrollAmount = MARQUEE_DEFAULTS.scrollAmount,
  scrollDelay = MARQUEE_DEFAULTS.scrollDelay,
  trueSpeed = MARQUEE_DEFAULTS.trueSpeed,
  loop = MARQUEE_DEFAULTS.loop,
  bgColor,
  width,
  height,
  hSpace,
  vSpace,
  children,
}: MarqueeProps) {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const vertical = direction === 'up' || direction === 'down';

  // Set a finite loop count only; an unset loop is the native default (infinite).
  useLayoutEffect(() => {
    if (loop > 0) outer.current?.setAttribute('loop', String(loop));
    else outer.current?.removeAttribute('loop');
  }, [loop]);

  useLayoutEffect(() => {
    const container = outer.current;
    const content = track.current;
    if (!container || !content) return;

    // Stop the browser's own animation and drive the transform on a timer.
    (container as HTMLMarqueeElement & { stop?: () => void }).stop?.();

    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer) clearInterval(timer);
      const plan = marqueePlan({
        behavior,
        direction,
        scrollAmount,
        scrollDelay,
        trueSpeed,
        loop,
        containerSize: vertical ? container.clientHeight : container.clientWidth,
        contentSize: vertical ? content.offsetHeight : content.offsetWidth,
      });

      let a = plan.from;
      let b = plan.to;
      let pos = a;
      let dir = Math.sign(b - a) || 1;
      let cycles = 0;
      const paint = () => {
        content.style.transform = `translate${plan.axis}(${Math.round(pos)}px)`;
      };

      paint();
      if (plan.distance === 0) return; // nothing to scroll (empty or unmeasured)

      timer = setInterval(() => {
        pos += dir * plan.step;
        const arrived = dir > 0 ? pos >= b : pos <= b;
        if (arrived) {
          pos = b;
          if (plan.mode === 'slide') {
            paint();
            clearInterval(timer);
            return;
          }
          cycles += 1;
          if (plan.iterations !== Infinity && cycles >= plan.iterations) {
            paint();
            clearInterval(timer);
            return;
          }
          if (plan.mode === 'alternate') {
            dir = -dir;
            [a, b] = [b, a];
          } else {
            pos = a;
          }
        }
        paint();
      }, plan.tickMs);
    };

    start();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(start) : undefined;
    observer?.observe(container);
    return () => {
      observer?.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [behavior, direction, scrollAmount, scrollDelay, trueSpeed, loop, vertical]);

  const attrs = {
    behavior,
    direction,
    scrollamount: scrollAmount,
    scrolldelay: scrollDelay,
    truespeed: trueSpeed ? '' : undefined,
    bgcolor: bgColor,
    width,
    height,
    hspace: hSpace,
    vspace: vSpace,
  };

  const style: CSSProperties = {
    display: 'inline-block',
    overflow: 'hidden',
    width: width ?? '100%',
    height: height ?? (vertical ? 200 : undefined),
    backgroundColor: bgColor,
    marginLeft: hSpace,
    marginRight: hSpace,
    marginTop: vSpace,
    marginBottom: vSpace,
  };

  return createElement(
    'marquee',
    { ...attrs, ref: outer, style },
    createElement('span', { ref: track, style: trackStyle }, children),
  );
}
