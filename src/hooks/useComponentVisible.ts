import { useState, useEffect, useRef } from 'react';

export default function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef<HTMLDivElement | null>(null);
  const refPopup = useRef<HTMLDivElement | null>(null);
  const refReviewSent = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (evt: MouseEvent) => {
    if(ref.current && !ref.current.contains(evt?.target as Node)){
      setIsComponentVisible(false);
    }
    if(refPopup.current && !refPopup.current.contains(evt?.target as Node)){
      setIsComponentVisible(false);
    }
    if(refReviewSent.current && !refReviewSent.current.contains(evt?.target as Node)){
      setIsComponentVisible(false);
    }
  };

  const handleEscClick = (evt: KeyboardEvent) => {
    if(evt.key === 'Escape' || evt.key === 'Esc'){
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  },[]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscClick, true);
    return () => {
      document.removeEventListener('keydown', handleEscClick, true);
    };
  },[]);

  return { ref, refPopup, refReviewSent, isComponentVisible, setIsComponentVisible};
}
