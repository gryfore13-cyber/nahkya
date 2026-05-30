import { useState, useCallback } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw, Copy, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAppearanceStore, DEFAULT_TOKENS } from '@/stores/appearanceStore';
import { ThemePreview } from './ThemePreview';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const COLOR_TOKENS: { key: string; label: string }[] = [
  { key: 'nahkya-ivory', label: 'Ivory' },
  { key: 'nahkya-cream', label: 'Cream' },
  { key: 'nahkya-stone', label: 'Stone' },
  { key: 'nahkya-taupe', label: 'Taupe' },
  { key: 'nahkya-sand', label: 'Sand' },
  { key: 'nahkya-charcoal', label: 'Charcoal' },
  { key: 'nahkya-soft-black', label: 'Soft Black' },
  { key: 'nahkya-gold', label: 'Brand Gold' },
  { key: 'nahkya-gold-light', label: 'Gold Light' },
  { key: 'nahkya-gold-muted', label: 'Gold Muted' },
  { key: 'nahkya-text-secondary', label: 'Text Secondary' },
  { key: 'nahkya-error', label: 'Error' },
  { key: 'nahkya-error-light', label: 'Error Light' },
  { key: 'nahkya-success', label: 'Success' },
  { key: 'nahkya-success-light', label: 'Success Light' },
];

const WORKSPACE_TOKENS: { key: string; label: string }[] = [
  { key: 'workspace-bg', label: 'Workspace BG' },
  { key: 'workspace-sidebar', label: 'Workspace Sidebar' },
  { key: 'workspace-panel', label: 'Workspace Panel' },
  { key: 'workspace-border', label: 'Workspace Border' },
  { key: 'workspace-hover', label: 'Workspace Hover' },
];

const TYPOGRAPHY_TOKENS: { key: string; label: string }[] = [
  { key: 'font-display-xxl', label: 'Display XXL' },
  { key: 'font-display-xl', label: 'Display XL' },
  { key: 'font-display-lg', label: 'Display LG' },
  { key: 'font-display-md', label: 'Display MD' },
  { key: 'font-display-sm', label: 'Display SM' },
  { key: 'font-heading-lg', label: 'Heading LG' },
  { key: 'font-heading-md', label: 'Heading MD' },
  { key: 'font-mono-lg', label: 'Mono LG' },
  { key: 'font-mono-md', label: 'Mono MD' },
  { key: 'font-mono-sm', label: 'Mono SM' },
];

const SPACING_TOKENS: { key: string; label: string }[] = [
  { key: 'radius-nahkya', label: 'Border Radius' },
];

const EFFECTS_TOKENS: { key: string; label: string }[] = [
  { key: 'shadow-gold', label: 'Gold Shadow' },
];

export function AppearanceBuilder() {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [copied, setCopied] = useState(false);

  const tokens = useAppearanceStore((s) => s.tokens);
  const setToken = useAppearanceStore((s) => s.setToken);
  const resetTokens = useAppearanceStore((s) => s.resetTokens);
  const exportCSS = useAppearanceStore((s) => s.exportCSS);
  const exportJSON = useAppearanceStore((s) => s.exportJSON);

  const handleCopyCSS = useCallback(() => {
    navigator.clipboard.writeText(exportCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [exportCSS]);

  const handleExportAI = useCallback(() => {
    console.log('NAHKYA_THEME_EXPORT', exportJSON());
  }, [exportJSON]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-admin-preview min-h-screen bg-nahkya-ivory">
      {/* ── LEFT: Preview Canvas ── */}
      <div className="flex flex-col min-h-0">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-toolbar flex items-center justify-between px-6 py-3 border-b border-nahkya-gold-soft bg-nahkya-surface">
          <span className="text-mono-sm uppercase tracking-label text-nahkya-text-muted">
            Live Preview
          </span>
          <div className="flex items-center gap-1">
            {([
              { id: 'desktop' as const, icon: Monitor },
              { id: 'tablet' as const, icon: Tablet },
              { id: 'mobile' as const, icon: Smartphone },
            ]).map((v) => {
              const Icon = v.icon;
              return (
                <Button
                  key={v.id}
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewport(v.id)}
                  className={cn(
                    'w-8 h-8 rounded-nahkya',
                    viewport === v.id
                      ? 'bg-nahkya-charcoal text-nahkya-ivory'
                      : 'text-nahkya-text-muted hover:text-nahkya-text hover:bg-nahkya-surface'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* Preview frame */}
        <div className="flex-1 overflow-auto p-6 flex justify-center bg-nahkya-stone">
          <div
            className="overflow-hidden rounded-nahkya shadow-lg border border-nahkya-charcoal transition-all duration-300 max-w-full"
            style={{ width: VIEWPORT_WIDTHS[viewport] }}
          >
            <ThemePreview />
          </div>
        </div>
      </div>

      {/* ── RIGHT: Controls ── */}
      <div className="border-l border-nahkya-gold-soft bg-nahkya-surface flex flex-col min-h-0">
        <Tabs defaultValue="colors" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-4 bg-nahkya-ivory">
            <TabsTrigger value="colors" className="text-mono-sm">
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="text-mono-sm">
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing" className="text-mono-sm">
              Spacing
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-mono-sm">
              Effects
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            {/* Colors Tab */}
            <TabsContent value="colors" className="px-4 pb-4 mt-0 space-y-1">
              {COLOR_TOKENS.map(({ key, label }) => {
                const value = tokens[key] ?? '';
                return (
                  <div key={key} className="flex items-center gap-3 py-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-body-sm text-nahkya-text font-medium">
                        {label}
                      </div>
                      <div className="text-mono-sm text-nahkya-text-muted truncate">
                        {key}
                      </div>
                    </div>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setToken(key, e.target.value)}
                      className="w-8 h-8 rounded-nahkya border border-nahkya-gold-soft cursor-pointer shrink-0 bg-transparent"
                    />
                    <Input
                      value={value}
                      onChange={(e) => setToken(key, e.target.value)}
                      className="w-24 h-8 text-mono-sm bg-nahkya-ivory border-nahkya-gold-soft text-nahkya-text rounded-nahkya shrink-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setToken(key, DEFAULT_TOKENS[key] ?? '')}
                      className="w-7 h-7 rounded-full text-nahkya-text-muted hover:text-nahkya-text hover:bg-nahkya-surface shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                );
              })}

              <div className="pt-4 mt-4 border-t border-nahkya-gold-soft">
                <div className="text-mono-sm uppercase tracking-label text-nahkya-text-muted mb-2">
                  Workspace (Studio / Member)
                </div>
                {WORKSPACE_TOKENS.map(({ key, label }) => {
                  const value = tokens[key] ?? '';
                  return (
                    <div key={key} className="flex items-center gap-3 py-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-body-sm text-nahkya-text font-medium">
                          {label}
                        </div>
                        <div className="text-mono-sm text-nahkya-text-muted truncate">
                          {key}
                        </div>
                      </div>
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setToken(key, e.target.value)}
                        className="w-8 h-8 rounded-nahkya border border-nahkya-gold-soft cursor-pointer shrink-0 bg-transparent"
                      />
                      <Input
                        value={value}
                        onChange={(e) => setToken(key, e.target.value)}
                        className="w-24 h-8 text-mono-sm bg-nahkya-ivory border-nahkya-gold-soft text-nahkya-text rounded-nahkya shrink-0"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setToken(key, DEFAULT_TOKENS[key] ?? '')}
                        className="w-7 h-7 rounded-full text-nahkya-text-muted hover:text-nahkya-text hover:bg-nahkya-surface shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="px-4 pb-4 mt-0 space-y-3">
              {TYPOGRAPHY_TOKENS.map(({ key, label }) => {
                const value = tokens[key] ?? '';
                return (
                  <div key={key} className="space-y-1 py-1">
                    <Label className="text-body-sm text-nahkya-text">
                      {label}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={value}
                        onChange={(e) => setToken(key, e.target.value)}
                        className="h-8 text-mono-sm bg-nahkya-ivory border-nahkya-gold-soft text-nahkya-text rounded-nahkya"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setToken(key, DEFAULT_TOKENS[key] ?? '')}
                        className="w-7 h-7 rounded-full text-nahkya-text-muted hover:text-nahkya-text hover:bg-nahkya-surface shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            {/* Spacing Tab */}
            <TabsContent value="spacing" className="px-4 pb-4 mt-0 space-y-3">
              {SPACING_TOKENS.map(({ key, label }) => {
                const value = tokens[key] ?? '';
                return (
                  <div key={key} className="space-y-1 py-1">
                    <Label className="text-body-sm text-nahkya-text">
                      {label}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={value}
                        onChange={(e) => setToken(key, e.target.value)}
                        className="h-8 text-mono-sm bg-nahkya-ivory border-nahkya-gold-soft text-nahkya-text rounded-nahkya"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setToken(key, DEFAULT_TOKENS[key] ?? '')}
                        className="w-7 h-7 rounded-full text-nahkya-text-muted hover:text-nahkya-text hover:bg-nahkya-surface shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="px-4 pb-4 mt-0 space-y-3">
              {EFFECTS_TOKENS.map(({ key, label }) => {
                const value = tokens[key] ?? '';
                return (
                  <div key={key} className="space-y-1 py-1">
                    <Label className="text-body-sm text-nahkya-text">
                      {label}
                    </Label>
                    <Textarea
                      value={value}
                      onChange={(e) => setToken(key, e.target.value)}
                      rows={4}
                      className="rounded-nahkya border-nahkya-gold-soft bg-nahkya-ivory text-nahkya-text text-mono-sm resize-none focus-visible:ring-nahkya-gold"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setToken(key, DEFAULT_TOKENS[key] ?? '')}
                      className="rounded-nahkya text-nahkya-text-muted hover:text-nahkya-text hover:bg-nahkya-surface"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-2" />
                      Reset
                    </Button>
                  </div>
                );
              })}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Bottom bar */}
        <div className="sticky bottom-0 border-t border-nahkya-gold-soft p-4 space-y-3 bg-nahkya-ivory">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCSS}
              className="rounded-nahkya border-nahkya-gold-soft text-nahkya-text hover:bg-nahkya-surface"
            >
              <Copy className="w-3.5 h-3.5 mr-2" />
              {copied ? 'Copied!' : 'Copy CSS'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAI}
              className="rounded-nahkya border-nahkya-gold-soft text-nahkya-text hover:bg-nahkya-surface"
            >
              <Code className="w-3.5 h-3.5 mr-2" />
              Export for AI
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTokens}
              className="rounded-nahkya text-nahkya-text-muted hover:text-nahkya-text hover:bg-nahkya-surface ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" />
              Reset All
            </Button>
          </div>
          <pre className="max-h-48 overflow-auto rounded-nahkya bg-nahkya-surface border border-nahkya-gold-soft p-3 text-mono-sm text-nahkya-text-muted">
            {exportCSS()}
          </pre>
        </div>
      </div>
    </div>
  );
}
