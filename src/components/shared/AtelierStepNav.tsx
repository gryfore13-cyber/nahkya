import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface Step {
  label: string;
  description?: string;
}

interface AtelierStepNavProps {
  steps: Step[];
  current: number; // 0-based index
  className?: string;
}

export function AtelierStepNav({ steps, current, className }: AtelierStepNavProps) {
  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-start gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;
          const isUpcoming = index > current;

          return (
            <li key={step.label} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    'absolute top-4 left-0 right-1/2 h-[2px] -translate-y-1/2',
                    isCompleted ? 'bg-nahkya-accent' : 'bg-nahkya-border'
                  )}
                  style={{ right: '50%' }}
                />
              )}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 left-1/2 right-0 h-[2px] -translate-y-1/2',
                    isCompleted && !isUpcoming ? 'bg-nahkya-accent' : 'bg-nahkya-border'
                  )}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors duration-200',
                  isCompleted && [
                    'bg-nahkya-accent border-nahkya-accent text-white',
                  ],
                  isCurrent && [
                    'bg-nahkya-surface-raised border-nahkya-accent text-nahkya-accent',
                  ],
                  isUpcoming && [
                    'bg-nahkya-surface border-nahkya-border text-nahkya-muted',
                  ]
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center px-1">
                <p
                  className={cn(
                    'text-xs font-medium',
                    isCurrent ? 'text-nahkya-accent' : 'text-nahkya-text'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[10px] text-nahkya-muted mt-0.5 leading-tight">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
