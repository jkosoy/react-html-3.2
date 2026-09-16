import './jsx';

export { Blink, type BlinkProps } from './components/Blink';
export { Font, Basefont, type FontProps, type BasefontProps } from './components/Font';
export { Marquee, hasNativeMarquee, type MarqueeProps } from './components/Marquee';
export { Isindex, type IsindexProps } from './components/Isindex';
export { Spacer, type SpacerProps } from './components/Spacer';
export { Bgsound, type BgsoundProps } from './components/Bgsound';

export { resolveFontSize, fontSizeToCss, BASE_FONT_SIZE, type FontSize } from './font';
export { SYSTEM_FONTS, isSystemFont, splitFaces } from './fonts';
export { marqueePlan, MARQUEE_DEFAULTS, type MarqueePlan, type MarqueePlanInput } from './marquee';
export {
  HTML32_ELEMENTS,
  VENDOR_ELEMENTS,
  VENDOR_ATTRIBUTES,
  COLOR_NAMES,
  REPLACEMENTS,
  isHtml32Element,
  isVendorElement,
  attributesFor,
  isValidValue,
  type AttributeSpec,
  type ValueType,
} from './spec';
