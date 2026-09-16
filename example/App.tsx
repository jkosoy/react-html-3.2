// The only imports are React hooks for the counter — the lowercase <blink>,
// <marquee>, <font>, <basefont>, <spacer>, <bgsound> and <isindex> tags below
// need none: `jsxImportSource: 'react-html-3.2'` (see vite.config.ts) renders them
// through the package's components. The linter holds this whole file to HTML
// 3.2 — try adding a <div className>.
import { useEffect, useRef, useState } from 'react';

// The hit counter, the 1997 way: one GIF per digit, stitched into an odometer.
// HTML 3.2 has no onClick, and the linter forbids it, so the click is wired up
// imperatively instead. Clicking the counter adds a hit (resets on refresh).
function Counter() {
  const [hits, setHits] = useState(1337);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bump = (event: MouseEvent) => {
      event.preventDefault();
      setHits((n) => n + 1);
    };
    el.addEventListener('click', bump);
    return () => el.removeEventListener('click', bump);
  }, []);

  const digits = String(hits).padStart(8, '0');
  return (
    <a href="#" ref={ref} title="Click to add a hit">
      {digits.split('').map((digit, i) => (
        <img key={i} src={`${digit}.gif`} width={16} height={28} alt={digit} border={0} />
      ))}
    </a>
  );
}

export function App() {
  return (
    <body bgcolor="#000080" text="#ffffff" link="yellow" vlink="silver" background="stars.gif">
      <bgsound src="canyon.mid" loop="infinite" />
      <center>
        <marquee behavior="scroll" scrollamount={10} scrolldelay={110} bgcolor="purple" width="80%">
          <font size={5} face="Comic Sans MS, Chicago" color="lime">
            ~*~ Welcome to my Home Page ~*~
          </font>
        </marquee>

        <h1 align="center">
          <blink>
            <font color="red">UNDER CONSTRUCTION</font>
          </blink>
        </h1>

        <img src="navbar.gif" alt="Home | Links | Guestbook | Webring" width={400} height={40} border={0} useMap="#nav" />
        <map name="nav">
          <area shape="rect" coords="0,0,100,40" href="index.html" alt="Home" />
          <area shape="rect" coords="100,0,200,40" href="links.html" alt="Links" />
          <area shape="rect" coords="200,0,300,40" href="guestbook.html" alt="Guestbook" />
          <area shape="circle" coords="350,20,20" href="webring.html" alt="Webring" />
        </map>

        <spacer type="vertical" size={12} />

        <basefont size={4} face="Verdana, Geneva">
          <table border={2} cellPadding={6} cellSpacing={0} bgcolor="silver" width={480}>
            <tr bgcolor="black">
              <th colSpan={2}>
                <font color="white">About Me</font>
              </th>
            </tr>
            <tr>
              <td valign="top" nowrap="">
                <b>Name:</b>
              </td>
              <td>
                <font color="black">Webmaster</font>
              </td>
            </tr>
            <tr>
              <td valign="top">
                <b>Likes:</b>
              </td>
              <td>
                <font color="black" size="-1">
                  Frames, <tt>&lt;table&gt;</tt> layouts, <img src="spacer.gif" width={1} height={1} alt="" /> spacer GIFs
                </font>
              </td>
            </tr>
            <tr>
              <td valign="top">
                <b>Dislikes:</b>
              </td>
              <td>
                <font color="black" size="-1">
                  <strike>Style sheets</strike>
                </font>
              </td>
            </tr>
          </table>
        </basefont>

        <spacer type="vertical" size={12} />

        <table border={2} cellPadding={6} cellSpacing={0} bgcolor="silver" width={480}>
          <tr bgcolor="black">
            <th colSpan={2}>
              <font color="white">The Marquee Zoo</font>
            </th>
          </tr>
          <tr>
            <td valign="middle" nowrap="">
              <font color="black" size="-1"><b>scroll</b></font>
            </td>
            <td bgcolor="black" width={300}>
              <marquee behavior="scroll" scrollamount={8} scrolldelay={90} width={300}>
                <font color="lime" size={2}>&raquo;&raquo; off one edge and back on the other &raquo;&raquo;</font>
              </marquee>
            </td>
          </tr>
          <tr>
            <td valign="middle" nowrap="">
              <font color="black" size="-1"><b>scroll right</b></font>
            </td>
            <td bgcolor="black" width={300}>
              <marquee behavior="scroll" direction="right" scrollamount={8} scrolldelay={90} width={300}>
                <font color="yellow" size={2}>&laquo;&laquo; the very same, going the other way</font>
              </marquee>
            </td>
          </tr>
          <tr>
            <td valign="middle" nowrap="">
              <font color="black" size="-1"><b>slide</b></font>
            </td>
            <td bgcolor="black" width={300}>
              <marquee behavior="slide" scrollamount={8} scrolldelay={90} width={300}>
                <font color="aqua" size={2}>in from the edge, then it STOPS</font>
              </marquee>
            </td>
          </tr>
          <tr>
            <td valign="middle" nowrap="">
              <font color="black" size="-1"><b>alternate</b></font>
            </td>
            <td bgcolor="black" width={300}>
              <marquee behavior="alternate" scrollamount={8} scrolldelay={90} width={300}>
                <font color="fuchsia" size={2}>&bull; bounce &bull; bounce &bull; bounce &bull;</font>
              </marquee>
            </td>
          </tr>
          <tr>
            <td valign="middle" nowrap="">
              <font color="black" size="-1"><b>direction up</b></font>
            </td>
            <td bgcolor="black" width={300}>
              <marquee behavior="scroll" direction="up" scrollamount={3} scrolldelay={90} height={72} width={300}>
                <font color="lime" size={2}>
                  going up<br />and up<br />and up<br />and up
                </font>
              </marquee>
            </td>
          </tr>
          <tr>
            <td valign="middle" nowrap="">
              <font color="black" size="-1"><b>truespeed</b></font>
            </td>
            <td bgcolor="black" width={300}>
              <marquee behavior="scroll" scrollamount={2} scrolldelay={20} truespeed="" width={300}>
                <font color="silver" size={2}>fast &mdash; scrolldelay under 60ms, honoured</font>
              </marquee>
            </td>
          </tr>
        </table>

        <form action="/cgi-bin/guestbook.pl" method="post">
          <table border={0} cellPadding={2}>
            <tr>
              <td align="right">Your name:</td>
              <td>
                <input type="text" name="name" size={30} />
              </td>
            </tr>
            <tr>
              <td align="right" valign="top">Message:</td>
              <td>
                <textarea name="message" rows={4} cols={40} />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <input type="submit" value="Sign Guestbook" /> <input type="reset" />
              </td>
            </tr>
          </table>
        </form>

        <isindex prompt="Search my links: " />

        <hr size={3} noshade="" width="60%" />

        <font size={1}>
          Best viewed at 800x600 in Netscape Navigator 3.0.
          <br clear="all" />
          &copy; 1997. <u>You are visitor number</u>{' '}
          <Counter />
          <br clear="all" />
          <a href="index.html">&laquo; back to react-html-3.2</a>
        </font>
      </center>
    </body>
  );
}
