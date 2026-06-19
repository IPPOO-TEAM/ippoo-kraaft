import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search, X, Check } from "lucide-react";
import { CRAFT_TAXONOMY, searchTaxonomy, findBySlug, type FlatNiche } from "../data/craft-taxonomy";

interface NicheSelectorProps {
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  max?: number;
  label?: string;
  helperText?: string;
  ariaLabel?: string;
}

// Sélecteur hiérarchique : domaines repliables, sous-niches en chips, recherche full-text.
// Multi-sélection par défaut (artisan peut couvrir plusieurs niches).
export function NicheSelector({
  value, onChange, multiple = true, max = 8,
  label = "Niches d'activité",
  helperText = "Sélectionnez 1 à 8 niches qui décrivent votre activité.",
  ariaLabel,
}: NicheSelectorProps) {
  const [query, setQuery] = useState("");
  const [openDomain, setOpenDomain] = useState<string | null>(CRAFT_TAXONOMY[0]?.slug || null);

  const selectedSet = useMemo(() => new Set(value), [value]);
  const results = useMemo(() => query.trim() ? searchTaxonomy(query, 50) : [], [query]);

  const toggle = (slug: string) => {
    if (selectedSet.has(slug)) {
      onChange(value.filter(v => v !== slug));
    } else {
      if (!multiple) { onChange([slug]); return; }
      if (value.length >= max) return;
      onChange([...value, slug]);
    }
  };

  const remove = (slug: string) => onChange(value.filter(v => v !== slug));
  const atMax = multiple && value.length >= max;

  return (
    <div aria-label={ariaLabel || label}>
      {label && <div className="text-[var(--ipk-text)] mb-1" style={{ fontSize: "12px", fontWeight: 500 }}>{label}</div>}
      {helperText && <p className="text-[var(--ipk-text)] mb-2" style={{ fontSize: "11px" }}>{helperText} {multiple && <span className="font-medium">({value.length}/{max})</span>}</p>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map(slug => {
            const f = findBySlug(slug);
            return (
              <span key={slug} className="inline-flex items-center gap-1 pl-2 pr-1 py-1 bg-[var(--ipk-green-dark)] text-white rounded-full" style={{ fontSize: "11px" }}>
                <span>{f ? (f.isSubNiche ? `${f.nicheLabel} · ${f.label}` : f.label) : slug}</span>
                <button type="button" onClick={() => remove(slug)} aria-label={`Retirer ${f?.label || slug}`} className="hover:bg-white/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </span>
            );
          })}
        </div>
      )}

      <div className="relative mb-2">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ipk-text)]" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher une niche…"
          className="w-full pl-8 pr-3 py-2 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl"
          style={{ fontSize: "13px" }}
        />
      </div>

      <div className="border border-[var(--ipk-border)] rounded-xl bg-white max-h-64 overflow-y-auto">
        {query.trim() ? (
          <SearchResults items={results} selectedSet={selectedSet} onToggle={toggle} atMax={atMax} />
        ) : (
          <DomainTree openDomain={openDomain} setOpenDomain={setOpenDomain} selectedSet={selectedSet} onToggle={toggle} atMax={atMax} />
        )}
      </div>
    </div>
  );
}

function SearchResults({ items, selectedSet, onToggle, atMax }: { items: FlatNiche[]; selectedSet: Set<string>; onToggle: (s: string) => void; atMax: boolean }) {
  if (items.length === 0) return <div className="p-3 text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>Aucun résultat.</div>;
  return (
    <ul className="divide-y divide-[var(--ipk-border)]">
      {items.map(f => {
        const sel = selectedSet.has(f.slug);
        const disabled = !sel && atMax;
        return (
          <li key={f.slug}>
            <button type="button" disabled={disabled} onClick={() => onToggle(f.slug)} className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[var(--ipk-surface)] ${disabled ? "opacity-40 cursor-not-allowed" : ""}`} style={{ fontSize: "12px" }}>
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded border ${sel ? "bg-[var(--ipk-green-dark)] border-[var(--ipk-green-dark)]" : "border-[var(--ipk-border)]"}`}>{sel && <Check className="w-3 h-3 text-white" />}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[var(--ipk-ink)] truncate">{f.label}</span>
                <span className="block text-[var(--ipk-text)] truncate" style={{ fontSize: "10px" }}>{f.domainLabel}{f.isSubNiche && ` · ${f.nicheLabel}`}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function DomainTree({ openDomain, setOpenDomain, selectedSet, onToggle, atMax }: { openDomain: string | null; setOpenDomain: (s: string | null) => void; selectedSet: Set<string>; onToggle: (s: string) => void; atMax: boolean }) {
  return (
    <ul>
      {CRAFT_TAXONOMY.map(domain => {
        const open = openDomain === domain.slug;
        const countSelected = domain.niches.reduce((acc, n) => {
          let c = selectedSet.has(n.slug) ? 1 : 0;
          if (n.subNiches) c += n.subNiches.filter(s => selectedSet.has(`${n.slug}/${s.slug}`)).length;
          return acc + c;
        }, 0);
        return (
          <li key={domain.slug} className="border-b border-[var(--ipk-border)] last:border-0">
            <button type="button" onClick={() => setOpenDomain(open ? null : domain.slug)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--ipk-surface)] text-left" aria-expanded={open}>
              {open ? <ChevronDown className="w-3.5 h-3.5 text-[var(--ipk-text)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--ipk-text)]" />}
              <span className="flex-1 text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 500 }}>{domain.label}</span>
              {countSelected > 0 && <span className="px-1.5 py-0.5 bg-[var(--ipk-green-dark)] text-white rounded-full" style={{ fontSize: "10px" }}>{countSelected}</span>}
            </button>
            {open && (
              <div className="px-3 pb-2 pt-1 space-y-2">
                {domain.niches.map(n => (
                  <NicheBlock key={n.slug} domainSlug={domain.slug} niche={n} selectedSet={selectedSet} onToggle={onToggle} atMax={atMax} />
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function NicheBlock({ niche, selectedSet, onToggle, atMax }: { domainSlug: string; niche: { slug: string; label: string; subNiches?: { slug: string; label: string }[] }; selectedSet: Set<string>; onToggle: (s: string) => void; atMax: boolean }) {
  const sel = selectedSet.has(niche.slug);
  const disabled = !sel && atMax;
  return (
    <div>
      <button type="button" disabled={disabled} onClick={() => onToggle(niche.slug)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${sel ? "bg-[var(--ipk-green-dark)] text-white border-[var(--ipk-green-dark)]" : "bg-white text-[var(--ipk-ink)] border-[var(--ipk-border)] hover:border-[var(--ipk-green-dark)]"} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`} style={{ fontSize: "11px" }}>
        {sel && <Check className="w-3 h-3" />} {niche.label}
      </button>
      {niche.subNiches && niche.subNiches.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5 ml-3">
          {niche.subNiches.map(s => {
            const slug = `${niche.slug}/${s.slug}`;
            const ss = selectedSet.has(slug);
            const sd = !ss && atMax;
            return (
              <button key={slug} type="button" disabled={sd} onClick={() => onToggle(slug)} className={`px-2 py-0.5 rounded-full border ${ss ? "bg-[var(--ipk-blue)] text-white border-[var(--ipk-blue)]" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] border-transparent hover:border-[var(--ipk-blue)]"} ${sd ? "opacity-40 cursor-not-allowed" : ""}`} style={{ fontSize: "10px" }}>
                {s.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
