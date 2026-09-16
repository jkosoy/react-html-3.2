import { createElement, type ReactNode } from 'react';
import { useStyleSheet } from '../css';

export interface BlinkProps {
  children?: ReactNode;
}

// Netscape blinked at roughly one second per cycle, half on, half off.
const BLINK_CSS = `@keyframes html32-blink{to{visibility:hidden}}
blink{animation:html32-blink 1s steps(2,start) infinite}
@media (prefers-reduced-motion:reduce){blink{animation:none}}`;

export function Blink(props: BlinkProps) {
  useStyleSheet('blink', BLINK_CSS);
  return createElement('blink', props);
}
