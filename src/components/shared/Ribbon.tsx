import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

interface RibbonContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const RibbonContext = createContext<RibbonContextValue | null>(null);

function useRibbonContext() {
  const ctx = useContext(RibbonContext);
  if (!ctx) {
    throw new Error('Ribbon subcomponents must be used inside <Ribbon>');
  }
  return ctx;
}

export interface RibbonProps {
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Ribbon({
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  children,
  className,
}: RibbonProps) {
  const [internal, setInternal] = useState(defaultTab ?? '');
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internal;

  const setActiveTab = (id: string) => {
    if (!isControlled) setInternal(id);
    onTabChange?.(id);
  };

  return (
    <RibbonContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('nk-ribbon', className)}>{children}</div>
    </RibbonContext.Provider>
  );
}

export interface RibbonTabsProps {
  children: React.ReactNode;
  className?: string;
}

export function RibbonTabs({ children, className }: RibbonTabsProps) {
  return (
    <div className={cn('nk-ribbon-tabs', className)} role="tablist">
      {children}
    </div>
  );
}

export interface RibbonTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  contextual?: boolean;
  className?: string;
}

export function RibbonTab({ id, label, icon, contextual, className }: RibbonTabProps) {
  const { activeTab, setActiveTab } = useRibbonContext();
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'nk-ribbon-tab',
        isActive && 'is-active',
        contextual && 'is-contextual',
        'inline-flex items-center gap-1.5',
        className
      )}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      {label}
    </button>
  );
}

export interface RibbonBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function RibbonBody({ children, className }: RibbonBodyProps) {
  return <div className={cn('nk-ribbon-body', className)}>{children}</div>;
}

export interface RibbonPanelProps {
  tabId: string;
  children: React.ReactNode;
  className?: string;
}

export function RibbonPanel({ tabId, children, className }: RibbonPanelProps) {
  const { activeTab } = useRibbonContext();
  if (activeTab !== tabId) return null;
  return (
    <div role="tabpanel" className={cn('flex h-full min-w-max', className)}>
      {children}
    </div>
  );
}

export interface RibbonGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function RibbonGroup({ title, children, className }: RibbonGroupProps) {
  return (
    <div className={cn('nk-ribbon-group', className)}>
      <div className="nk-ribbon-group-content">{children}</div>
      <div className="nk-ribbon-group-title">{title}</div>
    </div>
  );
}

export interface RibbonButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  dropdown?: boolean;
  className?: string;
  title?: string;
}

export function RibbonButton({
  label,
  icon,
  onClick,
  disabled,
  active,
  dropdown,
  className,
  title,
}: RibbonButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'nk-ribbon-btn',
        dropdown && 'is-dropdown',
        active && 'is-active',
        className
      )}
    >
      {icon && <span className="nk-ribbon-btn-icon">{icon}</span>}
      <span className="nk-ribbon-btn-label">{label}</span>
    </button>
  );
}

export interface RibbonToggleGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function RibbonToggleGroup({ children, className }: RibbonToggleGroupProps) {
  return (
    <div className={cn('nk-ribbon-toggle-group', className)} role="group">
      {children}
    </div>
  );
}

export interface RibbonToggleProps {
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function RibbonToggle({
  active,
  onClick,
  disabled,
  children,
  className,
  title,
}: RibbonToggleProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn('nk-ribbon-toggle-btn', active && 'is-active', className)}
    >
      {children}
    </button>
  );
}

export interface RibbonColorPickerProps {
  colors: string[];
  value?: string;
  onSelect?: (color: string) => void;
  className?: string;
}

export function RibbonColorPicker({ colors, value, onSelect, className }: RibbonColorPickerProps) {
  return (
    <div className={cn('nk-ribbon-color-picker', className)}>
      {colors.map((color) => {
        const isActive = value?.toLowerCase() === color.toLowerCase();
        return (
          <div
            key={color}
            className={cn('nk-ribbon-color-swatch', isActive && 'ring-2 ring-nahkya-highlight ring-offset-1')}
            style={{ backgroundColor: color }}
            onClick={() => onSelect?.(color)}
            title={color}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(color);
              }
            }}
          />
        );
      })}
    </div>
  );
}

export interface RibbonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function RibbonInput({ className, ...props }: RibbonInputProps) {
  return <input className={cn('nk-ribbon-input', className)} {...props} />;
}
