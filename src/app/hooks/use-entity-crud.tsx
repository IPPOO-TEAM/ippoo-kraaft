import { useCallback, useMemo, useState } from "react";
import { useLocalState } from "./use-admin-data";
import { logAudit } from "./use-admin-audit";

// Hook générique pour les modules admin "seed + overrides + removed + editing".
// Il NE déclenche PAS de confirmation : le caller utilise useConfirm() lui-même
// (séparation du hook et de l'UI).

export interface EntityCrudOptions<T extends { id: string }> {
  // Soit storageKey (préfixe → :overrides/:removed), soit clés explicites pour
  // rester compatible avec les modules existants.
  storageKey?: string;
  overridesKey?: string;
  removedKey?: string;
  seed: readonly T[];
  entityName: string;            // pour l'audit log (ex. "blog", "event")
  actor?: string;
  cascadeRemove?: (id: string) => void;
  searchableFields?: (keyof T)[];
}

export interface EntityCrudResult<T extends { id: string }, O> {
  merged: (T & Partial<O>)[];
  removed: string[];
  removedCount: number;
  editing: string | null;
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  save: (id: string, patch: Partial<O>, label?: string) => void;
  setOverride: (id: string, patch: Partial<O>) => void;          // sans changer l'éditing
  remove: (id: string, label?: string) => void;
  bulkRemove: (ids: string[]) => void;
  bulkUpdate: (ids: string[], patch: Partial<O>, detail?: string) => void;
  restoreAll: () => void;
  filter: (query: string, predicate?: (item: T & Partial<O>) => boolean) => (T & Partial<O>)[];
}

export function useEntityCrud<T extends { id: string; name?: string; title?: string }, O extends Record<string, unknown> = Partial<T>>(
  opts: EntityCrudOptions<T>,
): EntityCrudResult<T, O> {
  const { storageKey, overridesKey, removedKey, seed, entityName, actor = "system", cascadeRemove, searchableFields } = opts;
  const ovKey = overridesKey || `${storageKey}:overrides`;
  const rmKey = removedKey || `${storageKey}:removed`;
  const [overrides, setOverrides] = useLocalState<Record<string, Partial<O>>>(ovKey, {});
  const [removed, setRemoved] = useLocalState<string[]>(rmKey, []);
  const [editing, setEditing] = useState<string | null>(null);

  const merged = useMemo(() =>
    seed.filter(x => !removed.includes(x.id)).map(x => ({ ...x, ...(overrides[x.id] || {}) })) as (T & Partial<O>)[],
    [overrides, removed, seed],
  );

  const startEdit = useCallback((id: string) => setEditing(id), []);
  const cancelEdit = useCallback(() => setEditing(null), []);

  const setOverride = useCallback((id: string, patch: Partial<O>) => {
    setOverrides(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
  }, [setOverrides]);

  const save = useCallback((id: string, patch: Partial<O>, label?: string) => {
    setOverrides(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
    setEditing(null);
    logAudit({ actor, action: "update", entity: entityName, entityId: id, details: label });
  }, [setOverrides, entityName, actor]);

  const remove = useCallback((id: string, label?: string) => {
    cascadeRemove?.(id);
    setRemoved(prev => prev.includes(id) ? prev : [...prev, id]);
    logAudit({ actor, action: "archive", entity: entityName, entityId: id, details: label });
  }, [cascadeRemove, setRemoved, entityName, actor]);

  const bulkRemove = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    ids.forEach(id => cascadeRemove?.(id));
    setRemoved(prev => Array.from(new Set([...prev, ...ids])));
    ids.forEach(id => logAudit({ actor, action: "archive", entity: entityName, entityId: id }));
  }, [cascadeRemove, setRemoved, entityName, actor]);

  const bulkUpdate = useCallback((ids: string[], patch: Partial<O>, detail?: string) => {
    if (ids.length === 0) return;
    setOverrides(prev => { const next = { ...prev }; ids.forEach(id => { next[id] = { ...(next[id] || {}), ...patch }; }); return next; });
    ids.forEach(id => logAudit({ actor, action: "update", entity: entityName, entityId: id, details: detail }));
  }, [setOverrides, entityName, actor]);

  const restoreAll = useCallback(() => {
    const count = removed.length;
    setRemoved([]);
    logAudit({ actor, action: "restore", entity: entityName, details: `${count} entrée(s) restaurée(s)` });
  }, [removed.length, setRemoved, entityName, actor]);

  const filter = useCallback((query: string, predicate?: (item: T & Partial<O>) => boolean) => {
    const q = query.trim().toLowerCase();
    return merged.filter(item => {
      if (predicate && !predicate(item)) return false;
      if (!q) return true;
      if (searchableFields && searchableFields.length > 0) {
        return searchableFields.some(f => String((item as any)[f] ?? "").toLowerCase().includes(q));
      }
      const haystack = String(item.name || item.title || item.id).toLowerCase();
      return haystack.includes(q);
    });
  }, [merged, searchableFields]);

  return { merged, removed, removedCount: removed.length, editing, startEdit, cancelEdit, save, setOverride, remove, bulkRemove, bulkUpdate, restoreAll, filter };
}
