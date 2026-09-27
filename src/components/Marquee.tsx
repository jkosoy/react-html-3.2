import { createElement, useLayoutEffect, useRef, type ReactNode } from 'react';
import { MARQUEE_DEFAULTS, type MarqueeBehavior, type MarqueeDirection } from '../marquee';

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

// Every browser still scrolls a native <marquee> from its attributes alone, so
// this renders one and leaves the motion to the browser.
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

  // React treats `loop` as a media flag, so set it by hand. Only a finite count
  // is written; an unset loop is the native default (infinite).
  useLayoutEffect(() => {
    if (loop > 0) outer.current?.setAttribute('loop', String(loop));
    else outer.current?.removeAttribute('loop');
  }, [loop]);

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
      width,
      height,
      hspace: hSpace,
      vspace: vSpace,
    },
    children,
  );
}
