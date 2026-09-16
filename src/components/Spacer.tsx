import { createElement, type CSSProperties } from 'react';

export interface SpacerProps {
  type?: 'horizontal' | 'vertical' | 'block';
  size?: number;
  width?: number;
  height?: number;
  align?: 'top' | 'middle' | 'bottom' | 'left' | 'right';
}

const FLOAT: Record<string, CSSProperties> = {
  left: { float: 'left' },
  right: { float: 'right' },
  top: { verticalAlign: 'top' },
  middle: { verticalAlign: 'middle' },
  bottom: { verticalAlign: 'bottom' },
};

export function Spacer({ type = 'horizontal', size = 0, width, height, align }: SpacerProps) {
  let style: CSSProperties;
  if (type === 'vertical') style = { display: 'block', height: size };
  else if (type === 'block') style = { display: 'inline-block', width: width ?? 0, height: height ?? 0, ...(align && FLOAT[align]) };
  else style = { display: 'inline-block', width: size };
  return createElement('spacer', { type, size, width, height, align, style });
}
