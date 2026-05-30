import { LuxuryButton } from '@/components/shared/LuxuryButton';

interface StudioTopBarProps {
  toolName: string;
  onSave?: () => void;
  onSubmit?: () => void;
}

export function StudioTopBar({ toolName, onSave, onSubmit }: StudioTopBarProps) {
  return (
    <div className="h-14 bg-nahkya-surface border-b border-nahkya-border flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <div className="font-display text-body-md text-nahkya-burgundy font-medium leading-tight">
          HAUS OF NAHKYA
        </div>
        <div className="font-mono text-mono-sm text-nahkya-gold uppercase tracking-widest-alt leading-none">
          {toolName}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <LuxuryButton variant="ghost" size="sm" onClick={onSave}>
          Save
        </LuxuryButton>
        <LuxuryButton variant="primary" size="sm" onClick={onSubmit}>
          Submit for Production
        </LuxuryButton>
      </div>
    </div>
  );
}
