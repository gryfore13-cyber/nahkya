import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useLogStore } from '@/stores/logStore';
import { cn } from '@/lib/utils';

export default function AdminLog() {
  const { items, addItem, toggleItem, deleteItem, isLoaded } = useLogStore();
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    addItem(text.trim());
    setText('');
  };

  const pending = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  if (!isLoaded) {
    return (
      <div className="p-8 lg:p-12">
        <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Log</h1>
        <p className="text-body-md text-nahkya-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-content">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Log</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8">
        A running list of what to do next and what has been done.
      </p>

      {/* Add new */}
      <div className="flex items-center gap-3 mb-8">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new task or reminder..."
          className="flex-1 bg-nahkya-surface border border-nahkya-border text-nahkya-text font-body text-body-md px-4 py-3 rounded-nahkya focus:outline-none focus:border-nahkya-highlight placeholder:text-nahkya-text-secondary/60"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-3 bg-nahkya-highlight text-nahkya-text text-mono-lg font-body font-medium rounded-nahkya hover:bg-nahkya-border transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add
        </button>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="font-mono text-mono-lg text-nahkya-text-secondary uppercase mb-4">
            To Do ({pending.length})
          </h2>
          <div className="space-y-2">
            {pending.map((item) => (
              <LogRow key={item.id} item={item} onToggle={() => toggleItem(item.id)} onDelete={() => deleteItem(item.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div>
          <h2 className="font-mono text-mono-lg text-nahkya-text-secondary uppercase mb-4">
            Done ({done.length})
          </h2>
          <div className="space-y-2">
            {done.map((item) => (
              <LogRow key={item.id} item={item} onToggle={() => toggleItem(item.id)} onDelete={() => deleteItem(item.id)} />
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-16 text-nahkya-text-secondary font-body">
          No items yet. Add your first task above.
        </div>
      )}
    </div>
  );
}

function LogRow({
  item,
  onToggle,
  onDelete,
}: {
  item: { id: string; text: string; done: boolean; createdAt: string };
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 bg-nahkya-surface border border-nahkya-border rounded-nahkya p-4 transition-all',
        item.done && 'opacity-60'
      )}
    >
      <button onClick={onToggle} className="mt-0.5 text-nahkya-highlight hover:text-nahkya-border transition-colors shrink-0">
        {item.done ? <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} /> : <Circle className="w-5 h-5" strokeWidth={1.5} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-body text-nahkya-text', item.done && 'line-through text-nahkya-text-secondary')}>
          {item.text}
        </p>
        <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase mt-1">
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={onDelete}
        className="text-nahkya-text-secondary hover:text-nahkya-error transition-colors shrink-0"
      >
        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
