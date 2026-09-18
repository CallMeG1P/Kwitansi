import { useTheme } from '../hooks/useTheme';
import type { ThemeName } from '../lib/types';

export function ThemePicker() {
  const { theme, changeTheme, themes } = useTheme();

  return (
    <div className="flex gap-1.5 items-center" role="group" aria-label="Pilih tema warna">
      {themes.map((t) => (
        <button
          key={t.name}
          type="button"
          className={`swatch ${t.swatchClass}`}
          data-theme-choice={t.name}
          title={t.label}
          aria-pressed={theme === t.name}
          onClick={() => changeTheme(t.name as ThemeName)}
        />
      ))}
    </div>
  );
}
