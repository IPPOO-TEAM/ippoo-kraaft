import { useCallback, useEffect, useState } from "react";
import { categories as seedCategories } from "../data/mock-data";

export interface Category {
  name: string;
  icon: string;
  count: number;
  hidden?: boolean;
}

const KEY = "ipk:admin:categories:v1";
const EVENT = "ipk:categories:changed";

function safeRead(): Category[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch {}
  return seedCategories.map(c => ({ ...c }));
}

function safeWrite(list: Category[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {}
}

export function useCategories() {
  const [list, setList] = useState<Category[]>(() => safeRead());

  useEffect(() => {
    const refresh = () => setList(safeRead());
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const createCategory = useCallback((cat: Category) => {
    setList(prev => {
      const next = [...prev, cat];
      safeWrite(next);
      return next;
    });
  }, []);

  const updateCategory = useCallback((name: string, patch: Partial<Category>) => {
    setList(prev => {
      const next = prev.map(c => (c.name === name ? { ...c, ...patch } : c));
      safeWrite(next);
      return next;
    });
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setList(prev => {
      const next = prev.filter(c => c.name !== name);
      safeWrite(next);
      return next;
    });
  }, []);

  const toggleHidden = useCallback((name: string) => {
    setList(prev => {
      const next = prev.map(c => (c.name === name ? { ...c, hidden: !c.hidden } : c));
      safeWrite(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = seedCategories.map(c => ({ ...c }));
    safeWrite(fresh);
    setList(fresh);
  }, []);

  return { categories: list, visibleCategories: list.filter(c => !c.hidden), createCategory, updateCategory, deleteCategory, toggleHidden, reset };
}
