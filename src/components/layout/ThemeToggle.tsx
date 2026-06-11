import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className={cn(
        'w-9 h-9 rounded-[var(--radius-md)] border border-nahkya-border',
        'flex items-center justify-center',
        'text-nahkya-text-secondary hover:text-nahkya-accent hover:bg-[var(--nahkya-accent-subtle)]',
        'transition-colors duration-200',
        className
      )}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Sun className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <Moon className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
