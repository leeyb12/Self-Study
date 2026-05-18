import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isLight, setIsLight] = useState(() => {
    // 브라우저 로컬 스토리지에서 이전 설정 불러오기
    const saved = localStorage.getItem('theme');
    return saved === 'light';
  });

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  const toggleTheme = () => setIsLight(prev => !prev);

  return [isLight, toggleTheme];
};