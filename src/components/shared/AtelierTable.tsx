import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/* ── Root container ── */

interface AtelierTableProps {
  children: ReactNode;
  className?: string;
}

export function AtelierTable({ children, className }: AtelierTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-[var(--radius-md)] border border-nahkya-border', className)}>
      <table className="w-full caption-bottom text-sm">{children}</table>
    </div>
  );
}

/* ── Header ── */

AtelierTable.Header = function TableHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <thead className={cn('bg-nahkya-surface border-b border-nahkya-border', className)}>
      {children}
    </thead>
  );
};

/* ── Body ── */

AtelierTable.Body = function TableBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tbody className={cn('bg-nahkya-surface-raised', className)}>
      {children}
    </tbody>
  );
};

/* ── Row ── */

AtelierTable.Row = function TableRow({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-nahkya-border transition-colors',
        'hover:bg-nahkya-bg',
        'last:border-b-0',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
};

/* ── Head cell ── */

AtelierTable.Head = function TableHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        'h-10 px-4 text-left align-middle font-mono text-mono-sm font-medium uppercase tracking-label text-nahkya-text-secondary whitespace-nowrap',
        className
      )}
    >
      {children}
    </th>
  );
};

/* ── Data cell ── */

AtelierTable.Cell = function TableCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        'px-4 py-3 align-middle text-body-sm text-nahkya-text font-body whitespace-nowrap',
        className
      )}
    >
      {children}
    </td>
  );
};
