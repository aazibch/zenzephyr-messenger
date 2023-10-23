import { useEffect, useRef } from 'react';

export default function useWhenClickedOutside(handler: () => void) {
  const domNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callback = (event: MouseEvent) => {
      if (event.target) {
        if (!domNodeRef.current?.contains(event.target as Node)) {
          handler();
        }
      }
    };

    document.addEventListener('mousedown', callback);

    return () => {
      document.removeEventListener('mousedown', callback);
    };
  }, []);

  return domNodeRef;
}
