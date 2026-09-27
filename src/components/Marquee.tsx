import { createElement, useLayoutEffect, useRef, type ReactNode } from 'react';
import { TRANSPARENT_GIF } from '../gif';
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

type NativeMarquee = HTMLElement & { start?: () => void; stop?: () => void };

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
  const outer = useRef<NativeMarquee>(null);
  const track = useRef<HTMLElement>(null);
  const before = useRef<HTMLImageElement>(null);
  const after = useRef<HTMLImageElement>(null);
  const vertical = direction === 'up' || direction === 'down';

  // React treats `loop` as a media flag, so set it by hand. Only a finite count
  // is written; an unset loop is the native default (infinite).
  useLayoutEffect(() => {
    if (loop > 0) outer.current?.setAttribute('loop', String(loop));
    else outer.current?.removeAttribute('loop');
  }, [loop]);

  // The <marquee> clips its content on its own, with no CSS. Stop the browser's
  // animation, pad the content with transparent GIFs a box-length long on each
  // side, and step the box's scroll offset by hand on a timer.
  useLayoutEffect(() => {
    const box = outer.current;
    const content = track.current;
    const pads = [before.current, after.current];
    if (!box || !content) return;

    box.stop?.();

    const scrollProp = vertical ? 'scrollTop' : 'scrollLeft';
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer) clearInterval(timer);
      const containerSize = vertical ? box.clientHeight : box.clientWidth;
      for (const pad of pads) {
        if (!pad) continue;
        pad.width = vertical ? 1 : containerSize;
        pad.height = vertical ? containerSize : 1;
      }

      // Where the content sits with the box scrolled to 0. Scrolling by n moves
      // it n pixels back from there.
      box[scrollProp] = 0;
      const boxRect = box.getBoundingClientRect();
      const rect = content.getBoundingClientRect();
      const base = vertical ? rect.top - boxRect.top : rect.left - boxRect.left;

      // A browser that won't scroll the box gets its own marquee back.
      box[scrollProp] = 1;
      if (box[scrollProp] !== 1) {
        for (const pad of pads) if (pad) pad.width = pad.height = 0;
        box.start?.();
        return;
      }

      const plan = marqueePlan({
        behavior,
        direction,
        scrollAmount,
        scrollDelay,
        trueSpeed,
        loop,
        containerSize,
        contentSize: vertical ? rect.height : rect.width,
      });

      let a = plan.from;
      let b = plan.to;
      let pos = a;
      let dir = Math.sign(b - a) || 1;
      let cycles = 0;
      const paint = () => {
        box[scrollProp] = Math.round(base - pos);
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
    observer?.observe(box);
    return () => {
      observer?.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [behavior, direction, scrollAmount, scrollDelay, trueSpeed, loop, vertical]);

  const pad = (ref: typeof before) => createElement('img', { ref, src: TRANSPARENT_GIF, alt: '', border: 0 });
  const content = createElement('font', { ref: track }, children);

  return createElement(
    'marquee',
    {
      ref: outer,
      behavior,
      direction,
      scrollamount: scrollAmount,
      scrolldelay: scrollDelay,
      truespeed: trueSpeed ? '' : undefined,
      bgcolor: bgColor,
      width: width ?? '100%',
      height: height ?? (vertical ? 200 : undefined),
      hspace: hSpace,
      vspace: vSpace,
    },
    ...(vertical
      ? [pad(before), createElement('br'), content, createElement('br'), pad(after)]
      : [pad(before), content, pad(after)]),
  );
}
