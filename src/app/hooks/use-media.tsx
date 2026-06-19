import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type MediaAsset = {
  id: string;
  name: string;
  url: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  source: "upload" | "url";
  tags: string[];
  alt?: string;
  createdAt: string;
};

type Ctx = {
  assets: MediaAsset[];
  add: (input: Omit<MediaAsset, "id" | "createdAt">) => MediaAsset;
  uploadFile: (file: File, opts?: { tags?: string[]; alt?: string }) => Promise<MediaAsset>;
  importUrl: (url: string, opts?: { name?: string; tags?: string[]; alt?: string }) => Promise<MediaAsset>;
  update: (id: string, patch: Partial<Pick<MediaAsset, "name" | "tags" | "alt">>) => void;
  remove: (id: string) => void;
  byId: (id: string) => MediaAsset | undefined;
};

const STORAGE_KEY = "ipk:media:v1";
const MAX_TOTAL_BYTES = 8 * 1024 * 1024 * 1024; // soft cap: 8MB total in localStorage
const MAX_FILE_BYTES = 4 * 1024 * 1024;

const MediaContext = createContext<Ctx | null>(null);

function load(): MediaAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function save(assets: MediaAsset[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(assets)); }
  catch (e) { console.warn("Media storage write failed", e); }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(file);
  });
}

function getImageDims(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise(resolve => {
    if (typeof Image === "undefined") return resolve(null);
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function MediaProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<MediaAsset[]>(() => load());

  useEffect(() => { save(assets); }, [assets]);

  const add: Ctx["add"] = useCallback((input) => {
    const next: MediaAsset = {
      id: `med_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...input,
    };
    setAssets(prev => [next, ...prev]);
    return next;
  }, []);

  const uploadFile: Ctx["uploadFile"] = useCallback(async (file, opts) => {
    if (file.size > MAX_FILE_BYTES) throw new Error(`Fichier trop volumineux (max ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} Mo)`);
    const totalNow = assets.reduce((s, a) => s + a.size, 0);
    if (totalNow + file.size > MAX_TOTAL_BYTES) throw new Error("Quota média dépassé");
    const url = await fileToDataUrl(file);
    const dims = file.type.startsWith("image/") ? await getImageDims(url) : null;
    return add({
      name: file.name,
      url,
      mime: file.type || "application/octet-stream",
      size: file.size,
      width: dims?.width,
      height: dims?.height,
      source: "upload",
      tags: opts?.tags || [],
      alt: opts?.alt,
    });
  }, [add, assets]);

  const importUrl: Ctx["importUrl"] = useCallback(async (url, opts) => {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) throw new Error("URL invalide (http/https requis)");
    const dims = await getImageDims(trimmed);
    return add({
      name: opts?.name || trimmed.split("/").pop()?.split("?")[0] || "image",
      url: trimmed,
      mime: "image/*",
      size: 0,
      width: dims?.width,
      height: dims?.height,
      source: "url",
      tags: opts?.tags || [],
      alt: opts?.alt,
    });
  }, [add]);

  const update: Ctx["update"] = useCallback((id, patch) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  }, []);

  const remove: Ctx["remove"] = useCallback((id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  const byId: Ctx["byId"] = useCallback((id) => assets.find(a => a.id === id), [assets]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setAssets(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<Ctx>(() => ({
    assets, add, uploadFile, importUrl, update, remove, byId,
  }), [assets, add, uploadFile, importUrl, update, remove, byId]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be used within MediaProvider");
  return ctx;
}
