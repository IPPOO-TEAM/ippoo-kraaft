import { ReactNode, useState, useMemo } from "react";
import { Link } from "react-router";
import { ChevronLeft, Plus, ChevronUp, ChevronDown, ChevronsUpDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";

export function PageHeader({ title, subtitle, action, backTo }: { title: string; subtitle?: string; action?: ReactNode; backTo?: string }) {
  return (
    <header className="mb-6">
      {backTo && (
        <Link to={backTo} className="inline-flex items-center gap-1 text-[var(--ipk-text)] hover:text-[var(--ipk-green-dark)] mb-2" style={{ fontSize: "12px" }}>
          <ChevronLeft className="w-4 h-4" /> Retour
        </Link>
      )}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
            {title}
          </h1>
          {subtitle && <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "13px" }}>{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export function AddButton({ onClick, label = "Ajouter" }: { onClick: () => void; label?: string }) {
  return (
    <Button onClick={onClick} className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-4">
      <Plus className="w-4 h-4 mr-1" /> {label}
    </Button>
  );
}

export function StatusPill({ status, tone = "neutral" }: { status: string; tone?: "success" | "warn" | "danger" | "info" | "neutral" }) {
  const tones: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    warn: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    neutral: "bg-gray-100 text-gray-700",
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full ${tones[tone]}`} style={{ fontSize: "11px", fontWeight: 600 }}>{status}</span>;
}

export function DataCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-[var(--ipk-border)] p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function SearchInput({ value, onChange, placeholder = "Rechercher…", ariaLabel }: { value: string; onChange: (v: string) => void; placeholder?: string; ariaLabel?: string }) {
  return (
    <input
      type="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel || placeholder}
      className="w-full sm:max-w-xs px-3 py-2 bg-white border border-[var(--ipk-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30"
      style={{ fontSize: "13px" }}
    />
  );
}

export function EmptyRow({ message = "Aucun élément." }: { message?: string }) {
  return (
    <div className="text-center py-10 text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{message}</div>
  );
}

// ============= SAFE NUMBER INPUT =============
export function NumberInput({ value, onChange, min = 0, max = 999_999_999, step = 1, integer = false, className = "", ariaLabel }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; integer?: boolean; className?: string; ariaLabel?: string;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : ""}
      min={min}
      max={max}
      step={step}
      inputMode={integer ? "numeric" : "decimal"}
      aria-label={ariaLabel}
      onChange={e => {
        const raw = e.target.value;
        if (raw === "") { onChange(0); return; }
        let n = integer ? parseInt(raw, 10) : Number(raw);
        if (!Number.isFinite(n)) n = 0;
        n = Math.min(max, Math.max(min, n));
        onChange(n);
      }}
      className={`border border-[var(--ipk-border)] rounded-lg px-2 py-1 text-right ${className}`}
    />
  );
}

// ============= BULK SELECTION =============
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const visibleIds = useMemo(() => items.map(i => i.id), [items]);
  const allSelected = visibleIds.length > 0 && visibleIds.every(id => selected.has(id));
  const someSelected = visibleIds.some(id => selected.has(id));

  const toggle = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(s => {
    const n = new Set(s);
    if (allSelected) visibleIds.forEach(id => n.delete(id));
    else visibleIds.forEach(id => n.add(id));
    return n;
  });
  const clear = () => setSelected(new Set());
  const selectedItems = items.filter(i => selected.has(i.id));

  return { selected, selectedItems, count: selected.size, allSelected, someSelected, toggle, toggleAll, clear };
}

export function BulkBar({ count, onClear, children }: { count: number; onClear: () => void; children: ReactNode }) {
  if (count === 0) return null;
  return (
    <div className="sticky top-14 lg:top-0 z-30 mb-3 flex items-center gap-2 p-3 bg-[var(--ipk-ink)] text-white rounded-xl shadow-lg flex-wrap">
      <span style={{ fontSize: "13px", fontWeight: 500 }}>{count} sélectionné{count > 1 ? "s" : ""}</span>
      <div className="flex gap-1 ml-auto flex-wrap">{children}</div>
      <button onClick={onClear} className="text-white/70 hover:text-white px-2" style={{ fontSize: "12px" }}>Désélectionner</button>
    </div>
  );
}

export function SelectCheckbox({ checked, onChange, ariaLabel, indeterminate }: { checked: boolean; onChange: () => void; ariaLabel: string; indeterminate?: boolean }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      ref={el => { if (el) el.indeterminate = !!indeterminate && !checked; }}
      className="w-4 h-4 rounded border-[var(--ipk-border)] accent-[var(--ipk-green-dark)] cursor-pointer"
    />
  );
}

// ============= SORT HEADER =============
export type SortDir = "asc" | "desc";
export interface SortState<K extends string = string> { key: K | null; dir: SortDir; }

export function SortHeader<K extends string>({ label, sortKey, state, onSort, align = "left" }: { label: string; sortKey: K; state: SortState<K>; onSort: (k: K) => void; align?: "left" | "right" | "center" }) {
  const active = state.key === sortKey;
  const Icon = active ? (state.dir === "asc" ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`inline-flex items-center gap-1 hover:text-[var(--ipk-ink)] transition-colors ${active ? "text-[var(--ipk-ink)]" : "text-[var(--ipk-text)]"} ${align === "right" ? "ml-auto" : ""}`}
      aria-sort={active ? (state.dir === "asc" ? "ascending" : "descending") : "none"}
      style={{ fontWeight: 500 }}
    >
      {label} <Icon className="w-3 h-3" />
    </button>
  );
}

export function useSortable<T, K extends string>(items: T[], accessor: (item: T, key: K) => string | number | null | undefined, initial: SortState<K> = { key: null, dir: "asc" }) {
  const [sort, setSort] = useState<SortState<K>>(initial);
  const sorted = useMemo(() => {
    if (!sort.key) return items;
    const k = sort.key;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...items].sort((a, b) => {
      const av = accessor(a, k); const bv = accessor(b, k);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv), "fr") * dir;
    });
  }, [items, sort, accessor]);
  const onSort = (key: K) => setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  return { sorted, sort, onSort };
}

// ============= PAGINATION =============
export function usePagination<T>(items: T[], pageSize = 20) {
  const [page, setPage] = useState(0);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const slice = useMemo(() => items.slice(safePage * pageSize, safePage * pageSize + pageSize), [items, safePage, pageSize]);
  // Reset page when filter shrinks
  if (page !== safePage) setTimeout(() => setPage(safePage), 0);
  return { page: safePage, pageCount, total, slice, setPage };
}

export function Pagination({ page, pageCount, total, pageSize, onChange }: { page: number; pageCount: number; total: number; pageSize: number; onChange: (p: number) => void }) {
  if (total <= pageSize) return null;
  const from = page * pageSize + 1;
  const to = Math.min(total, (page + 1) * pageSize);
  const canPrev = page > 0;
  const canNext = page < pageCount - 1;
  return (
    <nav className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[var(--ipk-border)] flex-wrap" aria-label="Pagination">
      <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{from}–{to} sur {total}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(0)} disabled={!canPrev} aria-label="Première page" className="p-1.5 rounded-lg border border-[var(--ipk-border)] disabled:opacity-30 hover:bg-[var(--ipk-surface)]"><ChevronsLeft className="w-3.5 h-3.5" /></button>
        <button onClick={() => onChange(page - 1)} disabled={!canPrev} aria-label="Page précédente" className="p-1.5 rounded-lg border border-[var(--ipk-border)] disabled:opacity-30 hover:bg-[var(--ipk-surface)]"><ChevronLeft className="w-3.5 h-3.5" /></button>
        <span className="px-2 text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>Page {page + 1} / {pageCount}</span>
        <button onClick={() => onChange(page + 1)} disabled={!canNext} aria-label="Page suivante" className="p-1.5 rounded-lg border border-[var(--ipk-border)] disabled:opacity-30 hover:bg-[var(--ipk-surface)]"><ChevronLeft className="w-3.5 h-3.5 rotate-180" /></button>
        <button onClick={() => onChange(pageCount - 1)} disabled={!canNext} aria-label="Dernière page" className="p-1.5 rounded-lg border border-[var(--ipk-border)] disabled:opacity-30 hover:bg-[var(--ipk-surface)]"><ChevronsRight className="w-3.5 h-3.5" /></button>
      </div>
    </nav>
  );
}
