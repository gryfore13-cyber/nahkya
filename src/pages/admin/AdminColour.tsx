import { useState, useRef } from 'react';
import { Plus, X, Pencil, Trash2, Lock, ChevronDown, ChevronUp, Palette, Upload, Trash, Download } from 'lucide-react';
import { useColourStore } from '@/stores/colourStore';
import { AdminTopBar } from '@/components/admin/AdminTopBar';



export default function AdminColour() {
  const { categories, selectedColour, setSelectedColour, addColourToCategory, removeColour, renameCategory, removeCategory, createCategory, updateColourHex } = useColourStore();
  const [newCat, setNewCat] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [expandedSystem, setExpandedSystem] = useState<Record<string, boolean>>({});

  const toggleSystem = (id: string) => {
    setExpandedSystem(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const userCats = categories.filter(c => !c.isSystem);
  const systemCatCount = categories.filter(c => c.isSystem).length;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleHexChange = (hex: string) => {
    setSelectedColour({ ...selectedColour, hex });
    const cat = categories.find((c) => c.colours.some((col) => col.id === selectedColour.id));
    if (cat) {
      updateColourHex(cat.id, selectedColour.id, hex);
    }
  };

  const handleSystemHexChange = (catId: string, colourId: string, hex: string) => {
    updateColourHex(catId, colourId, hex);
    if (selectedColour.id === colourId) {
      setSelectedColour({ ...selectedColour, hex });
    }
  };

  // ── CSV Import ──
  const parseCSV = (text: string): Array<{ family: string; subColour: string; hex: string }> => {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];
    return lines.slice(1).map((line) => {
      const cols = line.split(',').map((c) => c.trim());
      return { family: cols[0] || '', subColour: cols[1] || '', hex: cols[2] || '#000000' };
    }).filter((r) => r.family && r.subColour && r.hex);
  };

  const buildCategoriesFromCSV = (
    rows: Array<{ family: string; subColour: string; hex: string }>
  ): import('@/types').ColourCategory[] => {
    const families = new Map<string, Array<{ subColour: string; hex: string }>>();
    rows.forEach((row) => {
      if (!families.has(row.family)) families.set(row.family, []);
      families.get(row.family)!.push({ subColour: row.subColour, hex: row.hex });
    });
    let fi = 0;
    return Array.from(families.entries()).map(([name, subs]) => {
      const colours: import('@/types').Colour[] = subs.map((sub, si) => ({
        id: `f${fi}-s${si}`,
        name: sub.subColour,
        hex: sub.hex || '#000000',
      }));
      const cat: import('@/types').ColourCategory = {
        id: `family-${fi}`,
        name,
        isSystem: true,
        columns: 4,
        colours,
      };
      fi++;
      return cat;
    });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length === 0) {
        alert('CSV is empty or malformed. Expected: Family,SubColour,Hex');
        return;
      }
      const newCats = buildCategoriesFromCSV(rows);
      useColourStore.getState().replaceSystemCategories(newCats);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = `Family,SubColour,Hex
Red & Burgundy,Scarlet,#e93e49
Red & Burgundy,Ruby,#eb3240
Pink & Rose,Blush,#fe8599`;
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nahkya-colour-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminTopBar
        icon={<Palette size={17} strokeWidth={1.5} />}
        label="Colour System"

        middle={
          <div className="flex items-center gap-3 bg-white border border-nahkya-gold shadow-sm px-3 py-2 rounded-nahkya">
            <div
              className="w-8 h-8 rounded-nahkya border border-nahkya-gold-soft shrink-0"
              style={{ backgroundColor: selectedColour.hex }}
            />
            <input
              type="color"
              value={selectedColour.hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-8 h-8 rounded-nahkya cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={selectedColour.hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="h-8 w-24 rounded-nahkya border border-nahkya-gold-soft px-2 text-sm font-mono uppercase focus:outline-none focus:border-nahkya-gold"
            />
            <span className="text-sm text-nahkya-text-muted font-body max-w-36 truncate">
              {selectedColour.name}
            </span>
          </div>
        }
        actions={
          !showNew ? (
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-4 py-2 bg-nahkya-gold text-nahkya-text text-body-sm font-body font-medium rounded-nahkya hover:bg-nahkya-gold-soft transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} /> New Category
            </button>
          ) : null
        }
      />
      <div className="p-8 lg:p-12">
        {/* New Category inline form */}
        {showNew && (
          <div className="flex items-center gap-3 mb-6">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Category name"
              className="bg-nahkya-surface border border-nahkya-gold-soft text-nahkya-text text-sm px-4 py-2 rounded-nahkya focus:outline-none focus:border-nahkya-gold w-52 font-body"
            />
            <button
              onClick={() => {
                if (newCat.trim()) {
                  createCategory(newCat.trim());
                  setNewCat('');
                  setShowNew(false);
                }
              }}
              className="px-4 py-2 bg-nahkya-gold text-nahkya-text text-body-sm font-body font-medium rounded-nahkya"
            >
              Create
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 border border-nahkya-gold-soft text-body-sm font-body text-nahkya-text-muted rounded-nahkya"
            >
              Cancel
            </button>
          </div>
        )}

      {/* System Palettes */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-mono-sm font-medium uppercase text-nahkya-gold flex items-center gap-2">
          <Lock className="w-3 h-3" /> System Palettes — {systemCatCount} {systemCatCount === 1 ? 'Family' : 'Families'}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-body text-nahkya-text-muted border border-nahkya-gold-soft rounded-nahkya hover:text-nahkya-text hover:border-nahkya-charcoal transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Template
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-body text-nahkya-text bg-nahkya-gold rounded-nahkya hover:bg-nahkya-gold-soft transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = '';
            }}
          />
          {systemCatCount > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all system palettes? This cannot be undone.')) {
                  useColourStore.getState().clearSystemCategories();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-body text-nahkya-error border border-nahkya-error/30 rounded-nahkya hover:bg-nahkya-error/10 transition-colors"
            >
              <Trash className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {categories.filter(c => c.isSystem).map((cat) => {
          const isExpanded = expandedSystem[cat.id] !== false;
          return (
            <div key={cat.id} className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya overflow-hidden">
              {/* Family Header */}
              <button onClick={() => toggleSystem(cat.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-nahkya-ivory/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Lock className="w-3.5 h-3.5 text-nahkya-gold flex-shrink-0" strokeWidth={1.5} />
                  <h3 className="text-base font-body font-medium text-nahkya-text">{cat.name}</h3>
                  <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label">
                    {cat.colours.length} colours
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {cat.colours.map((col) => (
                      <div key={col.id} className="w-5 h-5 rounded-nahkya border border-nahkya-gold-soft" style={{ backgroundColor: col.hex }} title={col.name} />
                    ))}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-nahkya-text-muted" /> : <ChevronDown className="w-4 h-4 text-nahkya-text-muted" />}
                </div>
              </button>

              {/* Expanded Colour Grid */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-nahkya-gold-soft">
                  <div className="grid grid-cols-colour-row gap-4 mt-4 mb-2">
                    <span className="font-mono text-body-3xs text-nahkya-text-muted uppercase tracking-widest">Sub-Colour</span>
                    <span className="font-mono text-body-3xs text-nahkya-text-muted uppercase tracking-widest text-center">Swatch</span>
                    <span className="font-mono text-body-3xs text-nahkya-text-muted uppercase tracking-widest">Hex</span>
                  </div>
                  {cat.colours.map((col) => {
                    const isSelected = selectedColour.id === col.id;
                    return (
                      <div key={col.id} className="grid grid-cols-colour-row gap-4 items-center py-2 border-b border-nahkya-gold-soft/40 last:border-0">
                        <span className="text-body-sm text-nahkya-text font-body">{col.name}</span>
                        <div className="flex justify-center">
                          <button
                            onClick={() => setSelectedColour(col)}
                            className={`w-10 h-10 rounded-nahkya border transition-all duration-150 hover:scale-105 hover:border-nahkya-gold ${
                              isSelected ? 'border-nahkya-gold ring-2 ring-nahkya-gold/30' : 'border-nahkya-gold-soft/60'
                            }`}
                            style={{ backgroundColor: col.hex }}
                            title={`${col.name} — ${col.hex}`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={col.hex}
                            onChange={(e) => handleSystemHexChange(cat.id, col.id, e.target.value)}
                            className="w-8 h-8 rounded-nahkya cursor-pointer bg-transparent border-0 p-0"
                          />
                          <input
                            type="text"
                            value={col.hex}
                            onChange={(e) => handleSystemHexChange(cat.id, col.id, e.target.value)}
                            className="h-8 w-28 rounded-nahkya border border-nahkya-gold-soft px-2 text-sm font-mono uppercase focus:outline-none focus:border-nahkya-gold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User-Created Palettes */}
      {userCats.length > 0 && (
        <>
          <p className="font-mono text-mono-sm font-medium uppercase  text-nahkya-text-muted mb-4">
            Member-Created Palettes
          </p>
          <div className="space-y-3">
            {userCats.map(cat => (
              <div key={cat.id} className="bg-nahkya-surface border border-nahkya-gold-soft rounded-nahkya p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-body font-medium text-nahkya-text">{cat.name}</h3>
                    <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label">{cat.colours.length} colours</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { const name = prompt('Rename:', cat.name); if (name) renameCategory(cat.id, name); }}
                      className="p-1.5 text-nahkya-text-muted hover:text-nahkya-text"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => removeCategory(cat.id)}
                      className="p-1.5 text-nahkya-text-muted hover:text-nahkya-error"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.colours.map(col => (
                    <div key={col.id} className="relative group">
                      <button onClick={() => setSelectedColour(col)}
                        className={`w-12 h-12 rounded-nahkya border transition-all duration-150 hover:scale-110 hover:border-nahkya-gold ${
                          selectedColour.hex === col.hex ? 'border-nahkya-gold ring-1 ring-nahkya-gold/30' : 'border-nahkya-gold-soft'
                        }`}
                        style={{ backgroundColor: col.hex }} title={`${col.name} — ${col.hex}`} />
                      <button onClick={() => removeColour(cat.id, col.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-nahkya-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addColourToCategory(cat.id, { id: `new-${Date.now()}`, name: 'New Colour', hex: selectedColour.hex })}
                    className="w-12 h-12 rounded-nahkya border border-dashed border-nahkya-taupe flex items-center justify-center text-nahkya-text-muted hover:text-nahkya-gold hover:border-nahkya-gold/40 transition-all">
                    <Plus className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
);
}
