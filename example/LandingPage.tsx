// The landing page for react-html-3.2, written in react-html-3.2. Every tag is
// lowercase and routed through the components by `jsxImportSource` (vite.config
// .ts), tables do the layout, <font> does the type, and the linter holds the
// whole page to HTML 3.2 — the same promise the package makes to its users.
const REPO = 'https://github.com/jkosoy/react-html-3.2';
const SPEC = 'https://www.w3.org/TR/2018/SPSD-html32-20180315/';

export function Landing() {
  return (
    <body bgcolor="#000080" text="#ffffff" link="yellow" vlink="silver" background="stars.gif">
      <center>
        <marquee behavior="scroll" scrollamount={9} scrolldelay={90} bgcolor="purple" width="90%">
          <font size={5} face="Comic Sans MS, Chicago" color="lime">
            ~*~ react-html-3.2 ~*~ React components &amp; an ESLint plugin for HTML 3.2 ~*~
          </font>
        </marquee>

        <h1 align="center">
          <font color="yellow" face="Times New Roman" size={7}>react-html-3.2</font>
        </h1>

        <table border={0} cellPadding={8} width={560}>
          <tr>
            <td align="center">
              <font size={3} color="white">
                Build web pages the way you did in 1997. Tables for layout,{' '}
                <font color="lime">&lt;font&gt;</font> for type,{' '}
                <blink>
                  <font color="red">no CSS</font>
                </blink>
                , and a linter that holds every element, attribute and value to the{' '}
                <a href={SPEC}>HTML 3.2 specification</a>.
              </font>
            </td>
          </tr>
        </table>

        <spacer type="vertical" size={8} />

        <table border={2} cellPadding={6} cellSpacing={0} bgcolor="silver" width={560}>
          <tr bgcolor="black">
            <th colSpan={2}>
              <font color="white">What's in the box</font>
            </th>
          </tr>
          <tr>
            <td valign="top" nowrap="">
              <font color="black">
                <b>Components</b>
              </font>
            </td>
            <td>
              <font color="black" size={2}>
                &lt;blink&gt;, &lt;marquee&gt;, &lt;font&gt; / &lt;basefont&gt;, &lt;spacer&gt;, &lt;bgsound&gt; and
                &lt;isindex&gt; — recreated where browsers dropped them. The marquee even stutters by hand, a few
                pixels a tick, instead of gliding.
              </font>
            </td>
          </tr>
          <tr>
            <td valign="top" nowrap="">
              <font color="black">
                <b>ESLint plugin</b>
              </font>
            </td>
            <td>
              <font color="black" size={2}>
                Six rules that flag anything past 3.2: HTML 4.0 elements, <tt>class</tt> / <tt>style</tt> / <tt>id</tt>,
                event handlers, off-palette colours, fonts nobody had in 1997, and images with no width and height.
              </font>
            </td>
          </tr>
          <tr>
            <td valign="top" nowrap="">
              <font color="black">
                <b>Lowercase JSX</b>
              </font>
            </td>
            <td>
              <font color="black" size={2}>
                A <tt>jsxImportSource</tt> runtime, so you can write &lt;marquee&gt; in lowercase and get the component.
                This whole page is written that way.
              </font>
            </td>
          </tr>
          <tr>
            <td valign="top" nowrap="">
              <font color="black">
                <b>TypeScript</b>
              </font>
            </td>
            <td>
              <font color="black" size={2}>
                Types for every 3.2 element and presentational attribute, so <tt>bgcolor</tt> and <tt>valign</tt> stop
                underlining in your editor.
              </font>
            </td>
          </tr>
        </table>

        <spacer type="vertical" size={12} />

        <table border={2} cellPadding={10} cellSpacing={0} bgcolor="black" width={560}>
          <tr>
            <td align="center">
              <font face="Courier New" color="lime" size={4}>
                npm install react-html-3.2
              </font>
            </td>
          </tr>
        </table>

        <spacer type="vertical" size={12} />

        <font size={4}>
          [ <a href={REPO}>GitHub</a> ] &nbsp;&nbsp; [ <a href="demo.html">See the live demo &raquo;</a> ]
        </font>

        <hr size={3} noshade="" width="60%" />

        <font size={1}>
          Best viewed at 800x600 in Netscape Navigator 3.0. No CSS was harmed in the making of this page.
          <br clear="all" />
          &copy; 1997.
        </font>
      </center>
    </body>
  );
}
