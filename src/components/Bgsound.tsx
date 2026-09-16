import { createElement } from 'react';

export interface BgsoundProps {
  src: string;
  loop?: number | 'infinite';
}

// IE's <bgsound>. Browsers won't autoplay audio without a user gesture any
// more, so the MIDI starts the first time the visitor clicks something.
export function Bgsound({ src, loop = 1 }: BgsoundProps) {
  const forever = loop === 'infinite' || loop < 0;
  return createElement(
    'bgsound',
    { src, loop },
    createElement('audio', { src, loop: forever, autoPlay: true, hidden: true, preload: 'auto' }),
  );
}
