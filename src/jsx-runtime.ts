// Custom automatic-runtime entry. Point a project at it with
// `jsxImportSource: 'react-html-3.2'` (tsconfig or your bundler's React plugin) and
// lowercase <blink>, <marquee>, <font>, <basefont>, <spacer>, <bgsound> and
// <isindex> render through the real components instead of inert DOM nodes.
// Every other tag passes straight through to React's own runtime.
import './jsx';
import { Fragment, jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime';
import { mapIntrinsic } from './runtime-map';

export { Fragment };
// Re-export React's JSX namespace so `jsxImportSource: 'react-html-3.2'` resolves JSX
// types here — carrying the IntrinsicElements/HTMLAttributes augmentation from
// ./jsx, which is what makes lowercase <blink>, <font>, bgcolor, etc. typecheck.
export type { JSX } from 'react/jsx-runtime';

export function jsx(type: unknown, props: Record<string, unknown>, key?: unknown): unknown {
  const m = mapIntrinsic(type, props);
  return (reactJsx as (t: unknown, p: unknown, k?: unknown) => unknown)(m.type, m.props, key);
}

export function jsxs(type: unknown, props: Record<string, unknown>, key?: unknown): unknown {
  const m = mapIntrinsic(type, props);
  return (reactJsxs as (t: unknown, p: unknown, k?: unknown) => unknown)(m.type, m.props, key);
}
