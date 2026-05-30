import { create } from 'zustand';
import { subscribeConfig, setConfig } from '@/lib/firebase/db';

export interface LogItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

interface LogState {
  items: LogItem[];
  isLoaded: boolean;
  addItem: (text: string) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
}

const FALLBACK: { items: LogItem[] } = {
  items: [
    {
      id: 'reminder-001',
      text: 'Wire up remaining brand strings (hero background image URL, footer nav links, "A digital scarf atelier" tagline) to platformStore',
      done: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'reminder-002',
      text: 'Process rule: when something is marked "not yet settled" during work, add it to this log automatically',
      done: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'reminder-003',
      text: 'Mobile version of design tools (Atelier, Monogram, Petak): responsive StudioShell, touch events, collapsible panels, pinch-to-zoom',
      done: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

export const useLogStore = create<LogState>((set, get) => ({
  items: FALLBACK.items,
  isLoaded: false,

  addItem: (text) => {
    const item: LogItem = {
      id: `log-${Date.now()}`,
      text,
      done: false,
      createdAt: new Date().toISOString(),
    };
    const next = { items: [item, ...get().items] };
    set(next);
    setConfig('log', { ...get(), ...next });
  },

  toggleItem: (id) => {
    const next = {
      items: get().items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    };
    set(next);
    setConfig('log', { ...get(), ...next });
  },

  deleteItem: (id) => {
    const next = { items: get().items.filter((i) => i.id !== id) };
    set(next);
    setConfig('log', { ...get(), ...next });
  },
}));

subscribeConfig<{ items: LogItem[] }>('log', FALLBACK, (data) => {
  useLogStore.setState({ ...data, isLoaded: true });
});
