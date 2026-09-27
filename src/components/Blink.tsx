import { createElement, useEffect, useRef, type ReactNode } from 'react';
import { TRANSPARENT_GIF } from '../gif';

export interface BlinkProps {
  children?: ReactNode;
}

// Mozilla's blink timer: a 250ms tick, text shown for three ticks and hidden
// for one. Every <blink> on the page shares it, so they all blink in unison.
export const BLINK_TICK_MS = 250;
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

// While hidden, the content is swapped for transparent GIFs the size of each
// line it filled, so nothing around it moves. The content itself stays mounted
// (detached, not unmounted), so state inside a <blink> survives the blink.
export function Blink({ children, ...rest }: BlinkProps) {
  const outer = useRef<HTMLElement>(null);
  const inner = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = outer.current;
    const content = inner.current;
    if (!el || !content || prefersReducedMotion()) return;

    const show = () => {
      if (content.parentNode !== el) el.replaceChildren(content);
    };
    const hide = () => {
      const lines = Array.from(content.getClientRects()).filter((r) => r.width > 0);
      const gifs = lines.flatMap((r, i) => {
        const img = document.createElement('img');
        img.src = TRANSPARENT_GIF;
        img.alt = '';
        img.width = Math.round(r.width);
        img.height = Math.round(r.height);
        img.border = '0';
        img.align = 'texttop';
        // Break where the text wrapped, so the GIFs can't wrap somewhere else.
        return i === 0 ? [img] : [document.createElement('br'), img];
      });
      el.replaceChildren(...gifs);
    };

    const unsubscribe = subscribe((visible) => (visible ? show() : hide()));
    return () => {
      unsubscribe();
      show();
    };
  }, []);

  return createElement('blink', { ...rest, ref: outer }, createElement('font', { ref: inner }, children));
}
