import { useState } from 'react';
import { useColourStore } from '@/stores/colourStore';
import { Plus, X, Pencil, Trash2, Lock } from 'lucide-react';

export default function ColourSystem() {
  const {
    categories, recentColours, selectedColour, setSelectedColour,
    createCategory, addColourToCategory, removeColour, removeCategory,
    renameCategory, renameColour, addToRecent,
  } = useColourStore();

  const [newCatName, setNewCatName] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [editingColour, setEditingColour] = useState<{ catId: string; colId: string } | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddColour = (catId: string) => {
    addColourToCategory(catId, { id: `c-${Date.now()}`, name: selectedColour.name, hex: selectedColour.hex });
  };

  const startEditColour = (catId: string, colId: string, _hex: string, name: string) => {
    setEditingColour({ catId, colId });
        setEditName(name);
  };

  const saveEditColour = () => {
    if (editingColour) {
      renameColour(editingColour.catId, editingColour.colId, editName);
      setEditingColour(null);
    }
  };

  return (
    <div className="p-8 lg:p-12 min-h-screen">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Colour System</h1>
      <p className="text-body-md text-nahkya-text-muted font-body mb-8">Create and manage your reusable colour categories. These palettes will be available across all design tools.</p>

      {/* Sticky Preview */}
      <div className="sticky top-0 z-content bg-workspace-panel border border-workspace-border rounded-nahkya p-6 mb-8 flex flex-wrap gap-8 items-start">
        <div>
          <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-gold mb-3">SELECTED</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-nahkya border-2 border-nahkya-gold" style={{ backgroundColor: selectedColour.hex }} />
            <div>
              <input value={selectedColour.hex} onChange={(e) => setSelectedColour({ ...selectedColour, hex: e.target.value })}
                className="bg-transparent font-mono text-body-2xs text-nahkya-text w-20 focus:outline-none focus:border-b focus:border-nahkya-gold" />
              <p className="text-body-xs text-nahkya-text-muted font-body">{selectedColour.name}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="font-mono text-mono-sm font-medium uppercase tracking-widest text-nahkya-text-muted mb-3">RECENTLY SELECTED</p>
          <div className="flex flex-wrap gap-1.5">
            {recentColours.map((c, i) => (
              <button key={i} onClick={() => setSelectedColour(c)}
                className="w-6 h-6 rounded-nahkya border border-workspace-border hover:border-nahkya-gold transition-all hover:scale-110"
                style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
        </div>
      </div>

      {/* Add Category */}
      <div className="mb-6">
        {!showNewCat ? (
          <button onClick={() => setShowNewCat(true)}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-workspace-border text-nahkya-text-muted hover:text-nahkya-gold hover:border-nahkya-gold/30 transition-colors rounded-nahkya font-body text-sm">
            <Plus className="w-4 h-4" strokeWidth={1.5} /> New Category
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Category name"
              className="bg-workspace-panel border border-workspace-border text-nahkya-text font-body text-sm px-4 py-2 rounded-nahkya focus:outline-none focus:border-nahkya-gold w-52" />
            <button onClick={() => { if (newCatName.trim()) { createCategory(newCatName.trim()); setNewCatName(''); setShowNewCat(false); } }}
              className="px-4 py-2 bg-nahkya-gold text-nahkya-text font-body text-body-sm font-medium rounded-nahkya">Create</button>
            <button onClick={() => setShowNewCat(false)}
              className="px-4 py-2 border border-workspace-border text-nahkya-text-muted font-body text-body-sm rounded-nahkya hover:text-nahkya-text">Cancel</button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-workspace-panel border border-workspace-border rounded-nahkya p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {cat.isSystem && <Lock className="w-3.5 h-3.5 text-nahkya-gold" strokeWidth={1.5} />}
                <h3 className="text-lg font-body font-medium text-nahkya-text">{cat.name}</h3>
                <span className="font-mono text-mono-sm text-nahkya-text-muted uppercase tracking-label">{cat.colours.length} COLOURS</span>
              </div>
              <div className="flex items-center gap-2">
                {!cat.isSystem && (
                  <>
                    <button onClick={() => {
                      const newName = prompt('Rename category:', cat.name);
                      if (newName) renameCategory(cat.id, newName);
                    }} className="p-1.5 text-nahkya-text-muted hover:text-nahkya-text transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => removeCategory(cat.id)} className="p-1.5 text-nahkya-text-muted hover:text-nahkya-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.colours.map(col => (
                <div key={col.id} className="relative group">
                  <button onClick={() => { setSelectedColour(col); addToRecent(col); }}
                    className={`w-12 h-12 rounded-nahkya border transition-all duration-150 hover:scale-110 hover:border-nahkya-gold ${
                      selectedColour.hex === col.hex ? 'border-nahkya-gold ring-1 ring-nahkya-gold/30' : 'border-workspace-border'
                    }`}
                    style={{ backgroundColor: col.hex }} title={`${col.name} — ${col.hex}`} />
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 flex gap-0.5">
                    <button onClick={(e) => { e.stopPropagation(); startEditColour(cat.id, col.id, col.hex, col.name); }}
                      className="w-4 h-4 bg-workspace-panel border border-workspace-border rounded-full flex items-center justify-center"><Pencil className="w-2.5 h-2.5 text-nahkya-text-muted" /></button>
                    {!cat.isSystem && (
                      <button onClick={(e) => { e.stopPropagation(); removeColour(cat.id, col.id); }}
                        className="w-4 h-4 bg-workspace-panel border border-workspace-border rounded-full flex items-center justify-center"><X className="w-2.5 h-2.5 text-nahkya-error" /></button>
                    )}
                  </div>
                  {/* Inline Edit */}
                  {editingColour?.catId === cat.id && editingColour?.colId === col.id && (
                    <div className="absolute z-dropdown top-14 left-0 bg-workspace-hover border border-workspace-border rounded-nahkya p-3 w-48 shadow-xl">
                      <input value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-workspace-panel border border-workspace-border text-nahkya-text text-body-xs px-2 py-1 rounded mb-2 focus:outline-none focus:border-nahkya-gold" />
                      <div className="flex gap-2">
                        <button onClick={saveEditColour} className="px-3 py-1 bg-nahkya-gold text-nahkya-text text-body-2xs font-medium rounded-nahkya">Save</button>
                        <button onClick={() => setEditingColour(null)} className="px-3 py-1 border border-workspace-border text-nahkya-text-muted text-body-2xs rounded-nahkya">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {!cat.isSystem && (
                <button onClick={() => handleAddColour(cat.id)}
                  className="w-12 h-12 rounded-nahkya border border-dashed border-nahkya-taupe/40 flex items-center justify-center text-nahkya-text-muted hover:text-nahkya-gold hover:border-nahkya-gold/40 transition-all">
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
