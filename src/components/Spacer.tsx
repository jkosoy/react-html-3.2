import { createElement } from 'react';
import { TRANSPARENT_GIF } from '../gif';

export interface SpacerProps {
  type?: 'horizontal' | 'vertical' | 'block';
  size?: number;
  width?: number;
  height?: number;
  align?: 'top' | 'middle' | 'bottom' | 'left' | 'right';
}

// No browser draws <spacer> any more. Horizontal and block spacers hold a
// transparent GIF sized with width and height; a vertical spacer is an empty
// layout table, which starts a new line and is exactly `size` pixels tall.
export function Spacer({ type = 'horizontal', size = 0, width, height, align }: SpacerProps) {
  let content;
  if (type === 'vertical') {
    content = createElement(
      'table',
      { cellPadding: 0, cellSpacing: 0, border: 0 },
      createElement('tbody', null, createElement('tr', null, createElement('td', { width: 1, height: size }))),
    );
  } else if (type === 'block') {
    content = createElement('img', { src: TRANSPARENT_GIF, alt: '', border: 0, width: width ?? 0, height: height ?? 0, align });
  } else {
    content = createElement('img', { src: TRANSPARENT_GIF, alt: '', border: 0, width: size, height: 1 });
  }
  return createElement('spacer', { type, size, width, height, align }, content);
}
