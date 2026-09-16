import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { Blink } from '../src/components/Blink';
import { Font } from '../src/components/Font';
import { Marquee } from '../src/components/Marquee';
import { jsx } from '../src/jsx-runtime';
import { mapIntrinsic } from '../src/runtime-map';

describe('jsx runtime', () => {
  it('maps lowercase <blink> and <font> to their components', () => {
    expect((jsx('blink', { children: 'hi' }) as ReactElement).type).toBe(Blink);
    expect((jsx('font', { color: 'red', children: 'hi' }) as ReactElement).type).toBe(Font);
  });

  it('translates <marquee> HTML 3.2 attributes to the component props', () => {
    const { type, props } = mapIntrinsic('marquee', { scrollamount: 4, bgcolor: 'purple', truespeed: '' });
    expect(type).toBe(Marquee);
    expect(props).toMatchObject({ scrollAmount: 4, bgColor: 'purple', trueSpeed: true });
    expect('truespeed' in props).toBe(false);
    expect('scrollamount' in props).toBe(false);
  });

  it('leaves a bare <marquee> without a truespeed flag', () => {
    expect(mapIntrinsic('marquee', { scrollamount: 2 }).props.trueSpeed).toBeUndefined();
  });

  it('installs the blink keyframes when a lowercase <blink> renders', () => {
    render(jsx('blink', { children: 'hi' }) as ReactElement);
    expect(document.querySelector('style[data-html32="blink"]')).not.toBeNull();
  });

  it('passes ordinary tags straight through to the host element', () => {
    expect(mapIntrinsic('div', { id: 'x' })).toEqual({ type: 'div', props: { id: 'x' } });
  });
});
