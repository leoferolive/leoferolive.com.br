import { useEffect, useState } from 'react';

type Options = { speedMs?: number; disabled?: boolean };

export function useTypewriter(text: string, { speedMs = 50, disabled = false }: Options = {}) {
  const [displayed, setDisplayed] = useState(disabled ? text : '');

  useEffect(() => {
    if (disabled) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs, disabled]);

  return displayed;
}
