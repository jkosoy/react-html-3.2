import type { ComponentType } from 'react';
import { Blink } from './components/Blink';
import { Bgsound } from './components/Bgsound';
import { Basefont, Font } from './components/Font';
import { Isindex } from './components/Isindex';
import { Marquee } from './components/Marquee';
import { Spacer } from './components/Spacer';

type Props = Record<string, unknown>;

// Maps lowercase intrinsic tag names to the components, translating the
// lowercase HTML 3.2 attribute names to the components' React-cased props.

function rename(props: Props, map: Record<string, string>): Props {
  const out: Props = {};
  for (const key in props) out[map[key] ?? key] = props[key];
  return out;
}

// <marquee scrollamount=".." bgcolor=".." truespeed> -> Marquee's camelCase props.
function marqueeProps(props: Props): Props {
  const out = rename(props, {
    scrollamount: 'scrollAmount',
    scrolldelay: 'scrollDelay',
    bgcolor: 'bgColor',
    hspace: 'hSpace',
    vspace: 'vSpace',
  });
  if ('truespeed' in out) {
    out.trueSpeed = out.truespeed !== undefined && out.truespeed !== false;
    delete out.truespeed;
  }
  return out;
}

interface Intrinsic {
  component: ComponentType<Props>;
  props?: (props: Props) => Props;
}

const INTRINSICS: Record<string, Intrinsic> = {
  blink: { component: Blink as unknown as ComponentType<Props> },
  marquee: { component: Marquee as unknown as ComponentType<Props>, props: marqueeProps },
  font: { component: Font as unknown as ComponentType<Props> },
  basefont: { component: Basefont as unknown as ComponentType<Props> },
  spacer: { component: Spacer as unknown as ComponentType<Props> },
  bgsound: { component: Bgsound as unknown as ComponentType<Props> },
  isindex: { component: Isindex as unknown as ComponentType<Props> },
};

export interface Mapped {
  type: unknown;
  props: Props;
}

// Called by the jsx/jsxs/jsxDEV wrappers for every element they create.
export function mapIntrinsic(type: unknown, props: Props): Mapped {
  if (typeof type === 'string') {
    const entry = INTRINSICS[type];
    if (entry) return { type: entry.component, props: entry.props ? entry.props(props) : props };
  }
  return { type, props };
}
