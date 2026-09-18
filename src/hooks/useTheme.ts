import { useEffect, useState, useCallback } from 'react';
import type { ThemeName } from '../lib/types';

const STORAGE_KEY = 'kwitansi_theme';

const themes: { name: ThemeName; label: string; swatchClass: string }[] = [
  { name: 'onyx', label: 'Onyx', swatchClass: 'swatch-onyx' },
  { name: 'graphite', label: 'Graphite (gelap)', swatchClass: 'swatch-graphite' },
  { name: 'stone', label: 'Stone', swatchClass: 'swatch-stone' },
  { name: 'slate', label: 'Slate', swatchClass: 'swatch-slate' },
];

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as ThemeName) || 'onyx';
    } catch {
      return 'onyx';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const changeTheme = useCallback((t: ThemeName) => setTheme(t), []);

  return { theme, changeTheme, themes };
}
