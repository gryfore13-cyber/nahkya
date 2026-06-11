import { cn } from '@/lib/utils';

interface AdminTopBarProps {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  middle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminTopBar({ icon, label, hint, middle, actions, className }: AdminTopBarProps) {
  return (
    <div
      className={cn(
        'h-toolbar bg-nahkya-surface/95 backdrop-blur border-b border-nahkya-border sticky top-0 z-nav',
        'flex items-center justify-between px-7 flex-shrink-0 gap-4',
        className
      )}
    >
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-full bg-nahkya-accent text-nahkya-inverse grid place-items-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-mono-sm text-nahkya-text-secondary uppercase truncate">{label}</div>
          {hint && <div className="text-sm text-nahkya-text font-body truncate">{hint}</div>}
        </div>
      </div>

      {/* Middle: custom controls */}
      {middle && <div className="flex items-center gap-2">{middle}</div>}

      {/* Right: actions */}
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
