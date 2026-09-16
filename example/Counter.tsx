import { useState } from 'react';

export function Counter() {
  const [hits, setHits] = useState(1337);
  const digits = String(hits).padStart(8, '0');
  return (
    <a href="#" onClick={(event) => { event.preventDefault(); setHits((n) => n + 1); }} title="Click to add a hit!">
      {digits.split('').map((digit, i) => (
        <img key={i} src={`${digit}.gif`} width={16} height={28} alt={digit} border={0} />
      ))}
    </a>
  );
}
