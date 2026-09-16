// Development counterpart to jsx-runtime, used when the bundler compiles JSX in
// dev mode. Same tag rewriting, forwarding the extra debug arguments React's
// jsxDEV expects (key, isStaticChildren, source, self).
import './jsx';
import { Fragment, jsxDEV as reactJsxDEV } from 'react/jsx-dev-runtime';
import { mapIntrinsic } from './runtime-map';

export { Fragment };
export type { JSX } from 'react/jsx-dev-runtime';

export function jsxDEV(
  type: unknown,
  props: Record<string, unknown>,
  key?: unknown,
  isStaticChildren?: boolean,
  source?: unknown,
  self?: unknown,
): unknown {
  const m = mapIntrinsic(type, props);
  return (reactJsxDEV as (...args: unknown[]) => unknown)(m.type, m.props, key, isStaticChildren, source, self);
}
