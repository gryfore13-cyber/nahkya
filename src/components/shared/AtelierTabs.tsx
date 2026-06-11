import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

function AtelierTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="atelier-tabs"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  );
}

function AtelierTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="atelier-tabs-list"
      className={cn(
        'inline-flex items-center gap-1 border-b border-nahkya-border',
        className
      )}
      {...props}
    />
  );
}

function AtelierTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="atelier-tabs-trigger"
      className={cn(
        'relative inline-flex items-center justify-center gap-1.5 px-3 py-2.5',
        'text-sm font-medium text-nahkya-text-secondary whitespace-nowrap',
        'transition-colors duration-150',
        'hover:text-nahkya-text',
        'disabled:pointer-events-none disabled:opacity-40',
        'data-[state=active]:text-nahkya-accent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nahkya-highlight/50 rounded-t-[var(--radius-sm)]',
        className
      )}
      {...props}
    />
  );
}

function AtelierTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="atelier-tabs-content"
      className={cn(
        'flex-1 outline-none',
        'data-[state=inactive]:hidden',
        className
      )}
      {...props}
    />
  );
}

/* ── Animated underline indicator (optional wrapper) ── */

function AtelierTabsListAnimated({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative inline-flex items-center gap-1 border-b border-nahkya-border', className)}>
      {children}
      {/* The active underline is handled by each trigger via a pseudo-element */}
    </div>
  );
}

function AtelierTabsTriggerAnimated({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="atelier-tabs-trigger-animated"
      className={cn(
        'relative inline-flex items-center justify-center gap-1.5 px-3 py-2.5',
        'text-sm font-medium text-nahkya-text-secondary whitespace-nowrap',
        'transition-colors duration-150',
        'hover:text-nahkya-text',
        'disabled:pointer-events-none disabled:opacity-40',
        'data-[state=active]:text-nahkya-accent',
        'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-nahkya-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-200',
        'data-[state=active]:after:scale-x-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nahkya-highlight/50 rounded-t-[var(--radius-sm)]',
        className
      )}
      {...props}
    />
  );
}

export {
  AtelierTabs,
  AtelierTabsList,
  AtelierTabsTrigger,
  AtelierTabsContent,
  AtelierTabsListAnimated,
  AtelierTabsTriggerAnimated,
};
