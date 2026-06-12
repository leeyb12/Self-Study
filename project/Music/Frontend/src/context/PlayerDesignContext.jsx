import { useEffect, useState } from 'react';

const STORAGE_KEY = 'playerDesign';

export function usePlayerDesign() {
  const [playerDesign, setPlayerDesignState] = useState(() => {
    if (typeof window === 'undefined') return 'wall';
    return window.localStorage.getItem(STORAGE_KEY) || 'wall';
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setPlayerDesignState(e.newValue || 'wall');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const onCustom = (e) => {
      const v = e.detail;
      if (v != null && v !== playerDesign) setPlayerDesignState(v);
    };
    window.addEventListener('playerDesignChange', onCustom);
    return () => window.removeEventListener('playerDesignChange', onCustom);
  }, [playerDesign]);

  const setPlayerDesign = (val) => {
    setPlayerDesignState(val);
    try {
      window.localStorage.setItem(STORAGE_KEY, val);
    } catch {}
    window.dispatchEvent(new CustomEvent('playerDesignChange', { detail: val }));
  };

  return [playerDesign, setPlayerDesign];
}

export default usePlayerDesign;
