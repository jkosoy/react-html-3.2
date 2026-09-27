import { createElement, useEffect, useRef, type ReactNode } from 'react';

export interface BlinkProps {
  children?: ReactNode;
}

// Mozilla's blink timer: a 250ms tick, text shown for three ticks and hidden
// for one. Every <blink> on the page shares it, so they all blink in unison.
const BLINK_TICK_MS = 250;
const TICKS_PER_CYCLE = 4;

type Listener = (visible: boolean) => void;
const listeners = new Set<Listener>();
let timer: ReturnType<typeof setInterval> | undefined;
let tick = 0;

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => {
      tick = (tick + 1) % TICKS_PER_CYCLE;
      if (tick === 0 || tick === TICKS_PER_CYCLE - 1) {
        const visible = tick === 0;
        for (const l of listeners) l(visible);
      }
    }, BLINK_TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
      tick = 0;
    }
  };
}

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// The one bit of styling a <blink> needs, set from script: hidden keeps the
// text's place in the layout, so nothing around it moves.
export function Blink({ children, ...rest }: BlinkProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const unsubscribe = subscribe((visible) => {
      el.style.visibility = visible ? '' : 'hidden';
    });
    return () => {
      unsubscribe();
      el.style.visibility = '';
    };
  }, []);

  return createElement('blink', { ...rest, ref }, children);
}
