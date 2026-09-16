# react-html-3.2

React components and an ESLint plugin for HTML 3.2, the way it was written in 1997. Tables for layout. `<font>` for type. Image maps for navigation. No CSS, because there wasn't any.

Put `const html32 = true` at the top of a file and ESLint will hold it to the [HTML 3.2 Reference Specification](https://www.w3.org/TR/2018/SPSD-html32-20180315/): every element, every attribute, and every attribute *value*. `<ol type="b">` is a warning. `bgcolor="orange"` is a warning, because 3.2 knows sixteen colour names and orange isn't one of them. Event handlers (`onClick`, `onKeyDown`, any `on*`) are *not* flagged, though — 3.2 had none, but this is React, so interactivity is welcome.

## Why 3.2 and not 4

HTML 4.0 (December 1997) is the spec that added `style`, `class`, `id`, and `<link rel="stylesheet">`. It exists to push you toward CSS. Everything that makes a page look like a Geocities page — `<font>`, `<center>`, `bgcolor`, tables with `cellpadding`, spacer GIFs — is HTML 3.2, plus whatever Netscape and Internet Explorer bolted on that year. If you want "pre-CSS", 3.2 is the last spec where that was true.

## Install

```
npm install react-html-3.2
```

Peer dependencies are `react` 18+ and, for the linter, `eslint` 9+.

## Writing HTML 3.2 in JSX

Browsers still render almost all of it. React will create `<font>`, `<center>`, `<table bgcolor>`, `<strike>` and `<tt>` for you; it just doesn't have TypeScript types for them. Importing the package fixes that:

```tsx
import 'react-html-3.2';

const html32 = true;

export function Page() {
  return (
    <body bgcolor="navy" text="white" link="yellow">
      <center>
        <font size={5} color="lime">Welcome</font>
        <table border={2} cellPadding={6} bgcolor="silver" width={480}>
          <tr><td valign="top" nowrap="">Name:</td><td>Webmaster</td></tr>
        </table>
      </center>
    </body>
  );
}
```

Attributes React already knows keep their React spelling (`cellPadding`, `colSpan`, `useMap`). The rest are lowercase, as in the spec (`bgcolor`, `valign`, `noshade`). Flag attributes take an empty string, because React warns if you pass a bare `true` to something it doesn't recognise. The linter accepts either spelling.

### Components

A handful of elements need actual help, because browsers dropped them or their behaviour has to be recreated:

```tsx
import { Blink, Marquee, Font, Basefont, Spacer, Bgsound, Isindex } from 'react-html-3.2';
```

**`Blink`** installs one keyframe animation, about a second per cycle. It respects `prefers-reduced-motion`.

**`Marquee`** renders a real `<marquee>`, but doesn't let the browser animate it — modern browsers scroll a native `<marquee>` smoothly on the compositor, which looks nothing like 1997. Instead it calls `stop()` on the element and drives the motion by hand with a timer: snap the content `scrollamount` pixels, wait `scrolldelay` milliseconds, snap again (`scrolldelay` clamped to 60ms unless `truespeed` is set). The result stutters the way it actually did. `scroll` runs the content off one edge and back on the other, `slide` comes in and stops, `alternate` bounces. `behavior`, `direction`, `loop`, `bgcolor`, `width`, `height`, `hspace`, `vspace` all work. Props are React-cased; the DOM gets the original names.

**`Font` and `Basefont`.** `<font>` in 3.2 takes `size` and `color`. `face` was a Netscape 2 extension, but nobody wrote a page without it, so it's allowed unless you turn on `strict`. `size="+1"` means one bigger than the basefont; `<basefont>` was a void element that changed the base for everything after it. React has no "everything after it", so `Basefont` takes children and `Font` reads the base through context.

**`Spacer`** is Netscape 3's `<spacer type size>`. It's the transparent GIF you didn't have to download.

**`Bgsound`** is IE's. Browsers no longer autoplay audio without a click, so the MIDI starts the first time your visitor touches anything.

**`Isindex`** renders what the HTML5 parser rewrites a legacy `<isindex>` into: `<hr>`, the prompt, a text input named `isindex`, `<hr>`.

### Lowercase tags

Capitalised components are the 1997 aesthetic's one concession to React. If you'd rather write `<blink>` and `<marquee>` the way you would have then, point your JSX at the package's runtime:

```jsonc
// tsconfig.json — or `react({ jsxImportSource: 'react-html-3.2' })` in Vite
{ "compilerOptions": { "jsx": "react-jsx", "jsxImportSource": "react-html-3.2" } }
```

Now `<blink>`, `<marquee>`, `<font>`, `<basefont>`, `<spacer>`, `<bgsound>` and `<isindex>` render through the components above — no import needed. Write the attributes the way the spec did (`<marquee scrollamount={4} bgcolor="purple" truespeed="">`); the runtime hands them to the component. Every other tag goes straight to React untouched, and the capitalised components still work if you want them. The `example/` app is written entirely in lowercase this way.

`<applet>`, `<frameset>`, `<frame>`, `<embed>`, `<xmp>`, `<listing>` and `<plaintext>` are typed but have no component. Frames still work in browsers as long as the document has no `<body>`. Applets need Java. `<plaintext>` still eats the rest of the document, which is arguably correct.

## The linter

```js
// eslint.config.js
import html32 from 'react-html-3.2/eslint';

export default [html32.configs.recommended];
```

That turns on six rules at `warn`. They all do nothing until a file opts in with a top-level `const html32 = true` (`export const` works too; `let` doesn't, and neither does a `const` inside a function). The plugin marks the variable as used, so `no-unused-vars` stays quiet. Capitalised components are never checked. Spread props can't be and aren't.

Four configs ship:

| Config        | Severity | Scope                                                    |
| ------------- | -------- | -------------------------------------------------------- |
| `recommended` | warn     | files with `const html32 = true`                          |
| `strict`      | warn     | same, plus `strict: true` (no Netscape/IE extensions)     |
| `error`       | error    | files with `const html32 = true`                          |
| `all`         | error    | **every** file, no marker needed                          |

`all` is the one that actually stops a stray `<div className>` from landing: it holds every file to 3.2 and fails the build instead of warning. Scope it to the directory that's meant to be a 3.2 page so it doesn't lint your tooling:

```js
import html32 from 'react-html-3.2/eslint';

export default [
  { ...html32.configs.all, files: ['site/**/*.{jsx,tsx}'] },
];
```

Given this:

```tsx
import './modern.css';

const html32 = true;

export function Oops() {
  return (
    <section className="hero">
      <h1 align="justify">Hi</h1>
      <img src="me.jpg" />
      <font face="Inter, Arial" color="orange">hello</font>
    </section>
  );
}
```

you get this:

```
example/Oops.tsx
   1:1   warning  Importing "./modern.css" brings in CSS. HTML 3.2 has none                                               react-html-3.2/no-css
   7:6   warning  <section> is not an HTML 3.2 element. Try <table>                                                       react-html-3.2/elements
   8:11  warning  "justify" is not a valid align on <h1>. Expected left | center | right                                  react-html-3.2/attribute-values
   9:8   warning  <img> needs width and height. Your visitor is on a 28.8k modem                                          react-html-3.2/img-dimensions
  10:13  warning  "Inter" was not on anybody's computer in 1997. Try Arial, Verdana, or Comic Sans MS                     react-html-3.2/system-fonts
  10:33  warning  "orange" is not a valid color on <font>. Expected #rrggbb or one of the sixteen colour names            react-html-3.2/attribute-values
```

### The rules

**`react-html-3.2/elements`** — every lowercase JSX tag has to be in the 3.2 DTD. `<span>`, `<abbr>`, `<q>`, `<iframe>`, `<object>`, `<label>`, `<button>` are all 4.0 and all flagged. The message suggests what a 1997 author would have used instead, which is usually a table.

**`react-html-3.2/attributes`** — per element, from the spec. `align` is fine on `<p>` and not on `<font>`. `style`, `class` and `id` get their own message, because there is no CSS to hook them to. Event handlers (`onClick`, `onKeyDown`, any `on*`) are allowed on every element — 3.2 had none, but this is React and interactivity is welcome. `aria-*` and `data-*` are flagged like anything else; they didn't exist.

**`react-html-3.2/attribute-values`** — where the spec enumerates values or gives a type, literal values are checked. Enumerations (`align`, `type`, `shape`, `method`, `clear`, `valign`), colours (`#rrggbb` or the sixteen VGA names: black, silver, gray, white, maroon, red, purple, fuchsia, green, lime, olive, yellow, navy, blue, teal, aqua), pixel counts, lengths (integer or percentage), font sizes (1–7 or `+n`/`-n`), and flags (`nowrap`, `noshade`, `compact`, `ismap`, `checked`, `selected`, `multiple`) which must be bare or empty. `<ol type>` is case-sensitive because `a` and `A` mean different things. Non-literal values (`align={x}`) are skipped.

**`react-html-3.2/no-css`** — flags `<style>`, `<link rel="stylesheet">`, and imports of `.css`/`.scss`/`.less` files or CSS-in-JS packages (styled-components, Emotion, Tailwind, Linaria, vanilla-extract, clsx, and friends). Between this rule and the `attributes` rule there is no way to get a style onto the page, so layout is tables.

**`react-html-3.2/system-fonts`** — every name in a `face` list on `<font>`, `<basefont>`, `<Font>` or `<Basefont>` has to have shipped with Windows 95/98, Mac OS 7.5–9, or Microsoft's 1996 Core Fonts for the Web. That's Arial, Times New Roman, Courier New, Verdana, Georgia, Trebuchet MS, Comic Sans MS, Impact, Tahoma, Chicago, Geneva, Monaco, Helvetica, Palatino, New York, Charcoal and a few dozen others. The full list is exported as `SYSTEM_FONTS`. Generic families like `sans-serif` are a CSS concept and are flagged. Add your own with the `fonts` option.

**`react-html-3.2/img-dimensions`** — `<img>` needs `width` and `height`. The page has to lay out before the picture arrives over the modem, and it's how spacer GIFs work.

### Options

All six rules take the same options object.

| Option   | Default | Effect                                                                                                    |
| -------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `always` | `false` | Lint every file; no `const html32 = true` needed.                                                          |
| `strict` | `false` | Refuse the Netscape/IE extensions too: `<blink>`, `<marquee>`, `<frameset>`, `<embed>`, `<spacer>`, `<bgsound>`, `face` on `<font>`, `bgcolor` on tables, `target` on links. What's left is the spec and only the spec. |
| `fonts`  | `[]`    | Extra font names `system-fonts` should accept.                                                             |

```js
{
  rules: {
    'react-html-3.2/elements': ['error', { strict: true }],
    'react-html-3.2/system-fonts': ['warn', { fonts: ['Chicago'] }],
  },
}
```

`html32.configs.strict` sets `strict: true` on everything.

### Type checking vs. linting

They check different things. The type augmentation adds attributes like `align`, `bgcolor` and `width` to React's base `HTMLAttributes`, because there's no per-element interface for `<body>` or `<hr>` to hang them on. So `<b align="center">` typechecks. The linter flags it. And TypeScript will always let you write `className`, because it's React's type; the linter is what tells you no. The linter is the source of truth; the types are there so your editor stops underlining `bgcolor`.

## Example

`example/` is a one-page site — a marquee banner, the pitch, a `<table>` of what's in the box, a "marquee zoo" showing every `behavior`, and a clickable hit counter built from one GIF per digit. It's fully 3.2, written in lowercase tags, and linted with `configs.all`, so it's held to the spec on every line at error severity.

```
npm run example        # vite dev server
npm run lint:example   # zero errors
```

## Development

```
npm test          # vitest, jsdom
npm run build     # tsup for JS, tsc for declarations
npm run typecheck
```

Tests cover the spec tables, value validation, font resolution, marquee timing, the components, and each lint rule through ESLint's `RuleTester`.

## License

MIT
