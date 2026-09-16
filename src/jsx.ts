import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export type Html32Props<T extends HTMLElement = HTMLElement> = DetailedHTMLProps<HTMLAttributes<T>, T>;

export interface FontAttributes<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
  size?: number | string;
  color?: string;
  face?: string;
}

export interface MarqueeAttributes<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
  behavior?: 'scroll' | 'slide' | 'alternate';
  direction?: 'left' | 'right' | 'up' | 'down';
  scrollamount?: number | string;
  scrolldelay?: number | string;
  truespeed?: '';
  loop?: number | string;
  bgcolor?: string;
  hspace?: number | string;
  vspace?: number | string;
}

export interface FrameAttributes<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
  src?: string;
  name?: string;
  frameborder?: 0 | 1 | '0' | '1' | 'yes' | 'no';
  marginwidth?: number | string;
  marginheight?: number | string;
  noresize?: '';
  scrolling?: 'yes' | 'no' | 'auto';
}

export interface FramesetAttributes<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
  rows?: string;
  cols?: string;
  frameborder?: 0 | 1 | '0' | '1' | 'yes' | 'no';
}

export interface AppletAttributes<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
  code?: string;
  codebase?: string;
  alt?: string;
  name?: string;
}

export interface SpacerAttributes<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
  type?: 'horizontal' | 'vertical' | 'block';
}

export interface BgsoundAttributes<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
  src?: string;
  loop?: number | string;
}

export interface IsindexAttributes<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
  prompt?: string;
  action?: string;
}

export type AppletProps = DetailedHTMLProps<AppletAttributes, HTMLElement>;
export type BasefontElementProps = DetailedHTMLProps<FontAttributes, HTMLElement>;
export type BgsoundProps = DetailedHTMLProps<BgsoundAttributes, HTMLElement>;
export type FontElementProps = DetailedHTMLProps<FontAttributes, HTMLElement>;
export type FrameProps = DetailedHTMLProps<FrameAttributes, HTMLElement>;
export type FramesetProps = DetailedHTMLProps<FramesetAttributes, HTMLElement>;
export type IsindexElementProps = DetailedHTMLProps<IsindexAttributes, HTMLElement>;
export type MarqueeElementProps = DetailedHTMLProps<MarqueeAttributes, HTMLElement>;
export type SpacerElementProps = DetailedHTMLProps<SpacerAttributes, HTMLElement>;

declare module 'react' {
  // Presentational attributes 3.2 spread across many elements. React has
  // never heard of these, so spell them lowercase, and give the flag ones
  // an empty string (nowrap="", noshade="") so React doesn't complain.
  interface HTMLAttributes<T> {
    align?: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | string;
    alink?: string;
    background?: string;
    bgcolor?: string;
    border?: number | string;
    clear?: 'left' | 'right' | 'all' | 'none';
    compact?: '';
    height?: number | string;
    hspace?: number | string;
    ismap?: '';
    link?: string;
    noshade?: '';
    nowrap?: '';
    size?: number | string;
    text?: string;
    valign?: 'top' | 'middle' | 'bottom';
    vlink?: string;
    vspace?: number | string;
    width?: number | string;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      applet: AppletProps;
      basefont: BasefontElementProps;
      bgsound: BgsoundProps;
      blink: Html32Props;
      dir: Html32Props;
      font: FontElementProps;
      frame: FrameProps;
      frameset: FramesetProps;
      isindex: IsindexElementProps;
      listing: Html32Props;
      marquee: MarqueeElementProps;
      noembed: Html32Props;
      noframes: Html32Props;
      plaintext: Html32Props;
      spacer: SpacerElementProps;
      strike: Html32Props;
      tt: Html32Props;
      xmp: Html32Props;
    }
  }
}
