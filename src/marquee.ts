export type MarqueeBehavior = 'scroll' | 'slide' | 'alternate';
export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';

export interface MarqueePlanInput {
  behavior: MarqueeBehavior;
  direction: MarqueeDirection;
  scrollAmount: number;
  scrollDelay: number;
  trueSpeed: boolean;
  loop: number;
  containerSize: number;
  contentSize: number;
}

export interface MarqueePlan {
  axis: 'X' | 'Y';
  from: number;
  to: number;
  distance: number;
  step: number;
  tickMs: number;
  iterations: number;
  mode: MarqueeBehavior;
  pixelsPerSecond: number;
}

export const MARQUEE_DEFAULTS = {
  behavior: 'scroll',
  direction: 'left',
  scrollAmount: 6,
  scrollDelay: 85,
  trueSpeed: false,
  loop: -1,
} as const;

// scrollamount pixels every scrolldelay ms; scrolldelay clamps to 60ms unless
// truespeed is set.
export function marqueePlan(input: MarqueePlanInput): MarqueePlan {
  const { behavior, direction, scrollAmount, scrollDelay, trueSpeed, loop, containerSize, contentSize } = input;
  const tickMs = trueSpeed ? Math.max(scrollDelay, 1) : Math.max(scrollDelay, 60);
  const step = Math.max(scrollAmount, 1);
  const pixelsPerSecond = (step * 1000) / tickMs;
  const forward = direction === 'left' || direction === 'up';
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';

  let from: number;
  let to: number;
  if (behavior === 'scroll') {
    from = forward ? containerSize : -contentSize;
    to = forward ? -contentSize : containerSize;
  } else if (behavior === 'slide') {
    from = forward ? containerSize : -contentSize;
    to = forward ? 0 : containerSize - contentSize;
  } else {
    const a = 0;
    const b = containerSize - contentSize;
    from = forward ? Math.max(a, b) : Math.min(a, b);
    to = forward ? Math.min(a, b) : Math.max(a, b);
  }

  return {
    axis,
    from,
    to,
    distance: Math.abs(to - from),
    step,
    tickMs,
    iterations: loop <= 0 ? Infinity : loop,
    mode: behavior,
    pixelsPerSecond,
  };
}
