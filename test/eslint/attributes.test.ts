import rule from '../../src/eslint/rules/attributes';
import { toHtmlAttribute } from '../../src/eslint/jsx';
import { html32, tester } from './helpers';

describe('toHtmlAttribute', () => {
  it('lowercases React camelCase props and maps the renamed ones', () => {
    expect(toHtmlAttribute('cellPadding')).toBe('cellpadding');
    expect(toHtmlAttribute('useMap')).toBe('usemap');
    expect(toHtmlAttribute('htmlFor')).toBe('for');
    expect(toHtmlAttribute('httpEquiv')).toBe('http-equiv');
    expect(toHtmlAttribute('defaultValue')).toBe('value');
  });
});

tester.run('attributes', rule, {
  valid: [
    { code: '<input placeholder="x" style={{}} />;' },
    { code: html32('<table border="1" cellPadding={4} cellSpacing={0} bgcolor="silver" width={480} align="center" />;') },
    { code: html32('<td colSpan={2} nowrap="" valign="top" width={40} />;') },
    { code: html32('<img src="a.gif" alt="" width={1} height={1} useMap="#m" ismap="" />;') },
    { code: html32('<input key="k" ref={r} defaultValue="x" maxLength={3} />;') },
    { code: html32('<div {...props} />;') },
    { code: html32('<Modal placeholder="x" />;') },
    { code: html32('<marquee scrollAmount={3} trueSpeed="" bgcolor="red" />;') },
    { code: html32('<font size="+1" color="red" face="Arial" />;') },
    { code: html32('<a href="#" name="top" target="_top" />;') },
    { code: html32('<body bgcolor="navy" text="white" link="yellow" background="x.gif" />;') },
    // Event handlers are welcome — React interactivity, on any element.
    { code: html32('<a href="#" onClick={f} />;') },
    { code: html32('<div onMouseDown={f} onKeyDown={g} onChange={h} />;') },
    { code: html32('<body onLoad={f} />;') },
    // ...even in strict mode.
    { code: html32('<a href="#" onClick={f} onDoubleClick={g} />;'), options: [{ strict: true }] },
  ],
  invalid: [
    {
      code: html32('<input placeholder="x" />;'),
      errors: [{ messageId: 'unknown', data: { attribute: 'placeholder', element: 'input' } }],
    },
    {
      code: html32('<div className="x" id="y" style={{}} />;'),
      errors: [{ messageId: 'css' }, { messageId: 'css' }, { messageId: 'css' }],
    },
    {
      code: html32('<div title="t" lang="en" dir="ltr" />;'),
      errors: [{ messageId: 'unknown' }, { messageId: 'unknown' }, { messageId: 'unknown' }],
    },
    {
      code: html32('<font face="Arial" />;'),
      options: [{ strict: true }],
      errors: [{ messageId: 'vendor', data: { attribute: 'face', element: 'font' } }],
    },
    {
      code: html32('<td bgcolor="red" />;'),
      options: [{ strict: true }],
      errors: [{ messageId: 'vendor' }],
    },
    {
      code: html32('<div aria-label="x" data-x="1" />;'),
      errors: [{ messageId: 'unknown' }, { messageId: 'unknown' }],
    },
    {
      code: '<img loading="lazy" />;',
      options: [{ always: true }],
      errors: [{ messageId: 'unknown', data: { attribute: 'loading', element: 'img' } }],
    },
  ],
});
