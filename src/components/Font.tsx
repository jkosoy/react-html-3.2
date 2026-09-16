import { createContext, createElement, useContext, type ReactNode } from 'react';
import { BASE_FONT_SIZE, resolveFontSize, type FontSize } from '../font';

export interface FontProps {
  size?: FontSize;
  color?: string;
  face?: string;
  children?: ReactNode;
}

export interface BasefontProps {
  size?: FontSize;
  color?: string;
  face?: string;
  children?: ReactNode;
}

interface Basefont {
  size: number;
  color?: string;
  face?: string;
}

const BasefontContext = createContext<Basefont>({ size: BASE_FONT_SIZE });

export function Font({ size, color, face, children }: FontProps) {
  const base = useContext(BasefontContext);
  return createElement(
    'font',
    { size: resolveFontSize(size, base.size), color: color ?? base.color, face: face ?? base.face },
    children,
  );
}

// <basefont> is void in 3.2 and applies to everything after it; here it wraps
// children and passes the base size/color/face down through context.
export function Basefont({ size, color, face, children }: BasefontProps) {
  const parent = useContext(BasefontContext);
  const value: Basefont = {
    size: resolveFontSize(size, parent.size) ?? parent.size,
    color: color ?? parent.color,
    face: face ?? parent.face,
  };
  return createElement(
    BasefontContext.Provider,
    { value },
    createElement('basefont', { size: value.size, color: value.color, face: value.face }),
    children,
  );
}
