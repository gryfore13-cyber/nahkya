import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface LuxuryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark-primary' | 'dark-ghost';
  size?: 'lg' | 'md' | 'sm';
  loading?: boolean;
  children: React.ReactNode;
}

export function LuxuryButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: LuxuryButtonProps) {
  const base = 'inline-flex items-center justify-center font-body font-medium uppercase tracking-wide transition-all duration-200 ease-out select-none';

  const variants = {
    primary: 'bg-nahkya-gold text-nahkya-text hover:bg-nahkya-gold-soft active:bg-nahkya-gold-muted active:scale-95',
    secondary: 'bg-transparent text-nahkya-text border border-nahkya-gold-soft hover:border-nahkya-text-muted active:scale-95',
    ghost: 'bg-transparent text-nahkya-text-muted hover:text-nahkya-text active:scale-95',
    'dark-primary': 'bg-nahkya-gold text-nahkya-text hover:bg-nahkya-gold-soft active:bg-nahkya-gold-muted active:scale-95',
    'dark-ghost': 'bg-transparent text-nahkya-text-inverse border border-white/10 hover:border-white/30 active:scale-95',
  };

  const sizes = {
    lg: 'h-button-lg px-6 text-body-sm',
    md: 'h-button px-4 text-body-sm',
    sm: 'h-button-sm px-3 text-body-xs',
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
      ) : (
        children
      )}
    </button>
  );
}
