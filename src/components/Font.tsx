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

// HTML 3.2 <font> takes size and color. face is a Netscape 2 extension,
// but it's the one everybody used, so it's here.
export function Font({ size, color, face, children }: FontProps) {
  const base = useContext(BasefontContext);
  return createElement(
    'font',
    { size: resolveFontSize(size, base.size), color: color ?? base.color, face: face ?? base.face },
    children,
  );
}

// <basefont> is empty in 3.2 and affects everything after it. React has no
// "everything after it", so it takes children instead.
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
