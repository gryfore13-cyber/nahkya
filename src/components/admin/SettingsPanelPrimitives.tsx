import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export function SettingsSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-body text-body-sm text-nahkya-text-secondary">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 px-3 pr-8 bg-nahkya-bg border border-nahkya-border rounded-nahkya font-body text-body-sm text-nahkya-text focus:outline-none focus:ring-2 focus:ring-nahkya-highlight/50 appearance-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-nahkya-text-secondary pointer-events-none" />
      </div>
    </div>
  );
}

export function SettingsToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-body-sm text-nahkya-text-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'w-10 h-5 rounded-full transition-colors relative',
          checked ? 'bg-nahkya-highlight' : 'bg-nahkya-border'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
            checked ? 'left-5' : 'left-0.5'
          )}
        />
      </button>
    </div>
  );
}

export function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-mono-sm text-nahkya-text-secondary uppercase tracking-wider">{title}</h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
