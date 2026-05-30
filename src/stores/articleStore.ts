import { create } from 'zustand';
import type { EditorialArticle } from '@/types';
import {
  getCollection,
  addDocToCollection,
  updateDocInCollection,
  deleteDocFromCollection,
  subscribeCollection,
} from '@/lib/firebase/db';

const COLLECTION = 'articles';

interface ArticleState {
  articles: EditorialArticle[];
  isLoading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
  addArticle: (article: Omit<EditorialArticle, 'id'>) => Promise<string>;
  updateArticle: (id: string, data: Partial<EditorialArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  subscribe: () => (() => void);
  getByColumn: (column: string) => EditorialArticle[];
  getFeatured: () => EditorialArticle | undefined;
}

function docToArticle(doc: Record<string, unknown> & { id: string }): EditorialArticle {
  return {
    id: doc.id,
    title: String(doc.title || ''),
    excerpt: String(doc.excerpt || ''),
    category: String(doc.category || ''),
    column: (doc.column as 'by-nahkya' | 'silk-report' | 'herstory' | 'silk-wire') || 'by-nahkya',
    author: String(doc.author || ''),
    date: String(doc.date || ''),
    image: String(doc.image || ''),
    readTime: doc.readTime ? String(doc.readTime) : undefined,
    featured: Boolean(doc.featured ?? false),
  };
}

export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  isLoading: false,
  error: null,

  fetchArticles: async () => {
    set({ isLoading: true, error: null });
    try {
      const docs = await getCollection<Record<string, unknown> & { id: string }>(COLLECTION);
      set({ articles: docs.map(docToArticle), isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch articles', isLoading: false });
    }
  },

  addArticle: async (article) => {
    const id = await addDocToCollection(COLLECTION, article as Record<string, unknown>);
    await get().fetchArticles();
    return id;
  },

  updateArticle: async (id, data) => {
    await updateDocInCollection(COLLECTION, id, data as Record<string, unknown>);
    await get().fetchArticles();
  },

  deleteArticle: async (id) => {
    await deleteDocFromCollection(COLLECTION, id);
    await get().fetchArticles();
  },

  subscribe: () => {
    set({ isLoading: true });
    return subscribeCollection<Record<string, unknown> & { id: string }>(
      COLLECTION,
      (docs) => {
        set({ articles: docs.map(docToArticle), isLoading: false, error: null });
      }
    );
  },

  getByColumn: (column) => get().articles.filter((a) => a.column === column),

  getFeatured: () => get().articles.find((a) => a.featured) || get().articles[0],
}));
