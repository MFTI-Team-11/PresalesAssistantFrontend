import { Bot, Moon, Sun } from 'lucide-react';
import type { Theme } from '../types';

type TopbarProps = {
  theme: Theme;
  onToggleTheme: () => void;
  onStart: () => void;
};

export function Topbar({ theme, onToggleTheme, onStart }: TopbarProps) {
  const isDark = theme === 'dark';

  return (
    <nav className="topbar" aria-label="Основная навигация">
      <div className="brand">
        <div className="brand-mark">
          <Bot size={24} />
        </div>
        <div>
          <span>Кейс 6</span>
          <strong>AI ассистент для пресейла</strong>
        </div>
      </div>
      <div className="topbar-actions">
        <button className="start-button" type="button" onClick={onStart}>
          Начать
        </button>
        <button
          className="theme-toggle"
          type="button"
          aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
          aria-pressed={isDark}
          onClick={onToggleTheme}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb">{isDark ? <Moon size={16} /> : <Sun size={16} />}</span>
          </span>
          <span>{isDark ? 'Тёмная' : 'Светлая'}</span>
        </button>
      </div>
    </nav>
  );
}
