import { cn } from '@/lib/utils';

function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <span className="font-display text-display-sm text-nahkya-gold animate-pulse select-none">
        NAHKYA
      </span>
    </div>
  );
}

export { Spinner };
