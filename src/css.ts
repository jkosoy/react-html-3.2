import { useInsertionEffect } from 'react';

export function useStyleSheet(id: string, css: string): void {
  useInsertionEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.querySelector(`style[data-html32="${id}"]`)) return;
    const style = document.createElement('style');
    style.dataset.html32 = id;
    style.textContent = css;
    document.head.appendChild(style);
  }, [id, css]);
}
