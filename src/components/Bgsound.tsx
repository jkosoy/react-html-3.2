import { createElement } from 'react';

export interface BgsoundProps {
  src: string;
  loop?: number | 'infinite';
}

// Browsers require a user gesture to start audio, so this plays on first click.
export function Bgsound({ src, loop = 1 }: BgsoundProps) {
  const forever = loop === 'infinite' || loop < 0;
  return createElement(
    'bgsound',
    { src, loop },
    createElement('audio', { src, loop: forever, autoPlay: true, hidden: true, preload: 'auto' }),
  );
}
