import { Save, Send, ChevronLeft } from 'lucide-react';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { cn } from '@/lib/utils';

interface StudioTopBarProps {
  toolName: string;
  onSave?: () => void;
  onSubmit?: () => void;
  middle?: React.ReactNode;
  variant?: 'default' | 'compact' | 'mobile';
}

export function StudioTopBar({ toolName, onSave, onSubmit, middle, variant = 'default' }: StudioTopBarProps) {
  const isMobile = variant === 'mobile';
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'h-14 bg-nahkya-surface border-b border-nahkya-border flex items-center justify-between flex-shrink-0',
        isMobile ? 'px-3' : 'px-6'
      )}
    >
      {/* Left: Brand + Tool name */}
      <div className="flex items-center gap-2 min-w-0">
        {(isMobile || isCompact) && (
          <button
            className="w-9 h-9 flex items-center justify-center rounded-nahkya text-nahkya-text-secondary hover:text-nahkya-accent hover:bg-nahkya-highlight-subtle transition-colors flex-shrink-0"
            aria-label="Back"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <div
            className={cn(
              'font-display text-nahkya-accent font-medium leading-tight truncate',
              isMobile ? 'text-body-sm' : 'text-body-md'
            )}
          >
            HAUS OF NAHKYA
          </div>
          <div
            className={cn(
              'font-mono text-nahkya-highlight uppercase tracking-widest-alt leading-none truncate',
              isMobile ? 'text-body-3xs' : 'text-mono-sm'
            )}
          >
            {toolName}
          </div>
        </div>
      </div>

      {/* Center: optional middle slot */}
      {middle && (
        <div className={cn('hidden md:block', isMobile && 'hidden')}>{middle}</div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {onSave && (
          <LuxuryButton
            variant="ghost"
            size="sm"
            onClick={onSave}
            className={cn(isMobile && 'w-9 h-9 p-0')}
          >
            {isMobile ? <Save className="w-4 h-4" /> : 'Save'}
          </LuxuryButton>
        )}
        {onSubmit && (
          <LuxuryButton
            variant="primary"
            size="sm"
            onClick={onSubmit}
            className={cn(isMobile && 'w-9 h-9 p-0')}
          >
            {isMobile ? <Send className="w-4 h-4" /> : isCompact ? 'Submit' : 'Submit for Production'}
          </LuxuryButton>
        )}
      </div>
    </div>
  );
}
