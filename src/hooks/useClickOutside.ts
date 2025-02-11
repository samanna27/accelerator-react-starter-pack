import { useEffect, useRef } from 'react';

export default function useClickOutside(initialIsVisible: boolean) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const handleClickOutside = (evt: MouseEvent) => {
    if(ref.current && ref.current.contains(evt?.target as Node)){
      window.scrollTo(0,0);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  },[]);

  return { ref};
}
