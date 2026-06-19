import { useCallback, useEffect, useState } from "react";
import { effectiveNiches } from "../data/craft-taxonomy";

const RECENT_KEY = "ipk:recently-viewed:v1";
const MAX_RECENT = 30;

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === "string") : [];
  } catch { return []; }
}

function writeIds(ids: string[]) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, MAX_RECENT))); } catch {}
}

export function recordView(productId: string) {
  if (!productId) return;
  const ids = readIds().filter(id => id !== productId);
  ids.unshift(productId);
  writeIds(ids);
  try { window.dispatchEvent(new CustomEvent("ipk:recently-viewed:changed")); } catch {}
}

export function useRecentlyViewed(): string[] {
  const [ids, setIds] = useState<string[]>(() => readIds());
  useEffect(() => {
    const reload = () => setIds(readIds());
    window.addEventListener("ipk:recently-viewed:changed", reload);
    const onStorage = (e: StorageEvent) => { if (e.key === RECENT_KEY) reload(); };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("ipk:recently-viewed:changed", reload);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return ids;
}

export function clearRecentlyViewed() {
  writeIds([]);
  try { window.dispatchEvent(new CustomEvent("ipk:recently-viewed:changed")); } catch {}
}

function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  sa.forEach(x => { if (sb.has(x)) inter++; });
  const union = sa.size + sb.size - inter;
  return union > 0 ? inter / union : 0;
}

export function similarityScore(target: any, candidate: any): number {
  if (!target || !candidate || target.id === candidate.id) return 0;
  let score = 0;
  if (candidate.category === target.category) score += 6;
  if (candidate.technique && candidate.technique === target.technique) score += 4;
  if (candidate.artisanId === target.artisanId) score += 3;
  if (candidate.origin?.region === target.origin?.region) score += 2;
  score += jaccard(target.materials || [], candidate.materials || []) * 5;
  score += jaccard(effectiveNiches(target), effectiveNiches(candidate)) * 6;
  if (candidate.rating) score += (candidate.rating - 3) * 0.4;
  if (candidate.stock === 0) score -= 2;
  return score;
}

export function recommendSimilar(target: any, all: any[], limit = 8): any[] {
  if (!target) return [];
  return all
    .map(p => ({ p, s: similarityScore(target, p) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(x => x.p);
}

export function recommendForUser(seedIds: string[], viewedIds: string[], all: any[], limit = 8): any[] {
  const seeds = seedIds.map(id => all.find(p => p.id === id)).filter(Boolean) as any[];
  const viewed = viewedIds.map(id => all.find(p => p.id === id)).filter(Boolean) as any[];
  if (seeds.length === 0 && viewed.length === 0) return [];
  const exclude = new Set([...seedIds, ...viewedIds]);
  const scored = new Map<string, { p: any; s: number }>();
  const accumulate = (target: any, weight: number) => {
    for (const c of all) {
      if (exclude.has(c.id)) continue;
      const s = similarityScore(target, c) * weight;
      if (s <= 0) continue;
      const cur = scored.get(c.id);
      if (cur) cur.s += s; else scored.set(c.id, { p: c, s });
    }
  };
  seeds.forEach(t => accumulate(t, 1.5));
  viewed.slice(0, 5).forEach((t, i) => accumulate(t, 1 - i * 0.15));
  return [...scored.values()].sort((a, b) => b.s - a.s).slice(0, limit).map(x => x.p);
}

export function recommendCrossSell(cartIds: string[], all: any[], limit = 6): any[] {
  if (cartIds.length === 0) return [];
  const cartProducts = cartIds.map(id => all.find(p => p.id === id)).filter(Boolean) as any[];
  if (cartProducts.length === 0) return [];
  const cartCategories = new Set(cartProducts.map(p => p.category));
  const exclude = new Set(cartIds);
  const scored = new Map<string, { p: any; s: number }>();
  for (const c of all) {
    if (exclude.has(c.id)) continue;
    let s = 0;
    if (cartCategories.has(c.category)) s += 1;
    else s += 4;
    s += jaccard(
      cartProducts.flatMap(p => effectiveNiches(p)),
      effectiveNiches(c),
    ) * 5;
    cartProducts.forEach(p => { if (p.origin?.region === c.origin?.region) s += 1; });
    s += (c.rating || 3) * 0.5;
    if (c.stock === 0) s -= 5;
    if (s > 0) scored.set(c.id, { p: c, s });
  }
  return [...scored.values()].sort((a, b) => b.s - a.s).slice(0, limit).map(x => x.p);
}
