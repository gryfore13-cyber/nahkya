interface StudioSectionLabelProps {
  children: React.ReactNode;
}

export function StudioSectionLabel({ children }: StudioSectionLabelProps) {
  return (
    <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-4">
      {children}
    </p>
  );
}
