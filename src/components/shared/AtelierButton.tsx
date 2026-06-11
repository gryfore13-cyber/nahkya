import { cn } from '@/lib/utils';
import { Loader2, type LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface AtelierButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'accent'
    | 'dark-primary'
    | 'dark-ghost';
  size?: 'lg' | 'md' | 'sm' | 'icon';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export function AtelierButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}: AtelierButtonProps) {
  const base =
    'inline-flex items-center justify-center font-body font-medium transition-all duration-200 ease-out select-none rounded-[var(--radius-md)]';

  const variants = {
    primary:
      'bg-nahkya-highlight text-nahkya-text hover:bg-nahkya-highlight-hover active:scale-[0.97]',
    secondary:
      'bg-nahkya-surface-raised text-nahkya-text border border-nahkya-border hover:border-nahkya-text-secondary active:scale-[0.97]',
    outline:
      'bg-transparent text-nahkya-text border border-nahkya-border hover:bg-nahkya-surface active:scale-[0.97]',
    ghost:
      'bg-transparent text-nahkya-text-secondary hover:text-nahkya-text hover:bg-nahkya-surface active:scale-[0.97]',
    destructive:
      'bg-nahkya-error text-white hover:opacity-90 active:scale-[0.97]',
    accent:
      'bg-nahkya-accent text-white hover:bg-nahkya-accent-hover active:scale-[0.97]',
    'dark-primary':
      'bg-nahkya-highlight text-nahkya-text hover:bg-nahkya-highlight-hover active:scale-[0.97]',
    'dark-ghost':
      'bg-transparent text-nahkya-inverse border border-nahkya-inverse/10 hover:border-nahkya-inverse/30 active:scale-[0.97]',
  };

  const sizes = {
    lg: 'h-button-lg px-6 text-body-sm gap-2',
    md: 'h-button px-4 text-body-sm gap-2',
    sm: 'h-button-sm px-3 text-body-xs gap-1.5',
    icon: 'w-9 h-9',
  };

  const isIconOnly = size === 'icon' || (!children && Icon);

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-40 cursor-not-allowed pointer-events-none',
        isIconOnly && 'p-0',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={cn('shrink-0', size === 'icon' ? 'w-4 h-4' : 'w-4 h-4')} strokeWidth={1.5} />
          )}
          {children && <span>{children}</span>}
          {Icon && iconPosition === 'right' && (
            <Icon className={cn('shrink-0', size === 'icon' ? 'w-4 h-4' : 'w-4 h-4')} strokeWidth={1.5} />
          )}
        </>
      )}
    </button>
  );
}
