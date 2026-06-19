import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search, ArrowRight, Package, ShoppingCart, Star, Users, Building2, GraduationCap, Calendar, FileText, Layers, MessageSquare, Settings, History, LayoutDashboard, Home } from "lucide-react";
import { products, artisans, groupements, formations, blogArticles, events, groupBuyingOffers } from "../../data/mock-data";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
}

const NAV_COMMANDS: Command[] = [
  { id: "nav-dash", label: "Tableau de bord", group: "Navigation", to: "/admin", icon: LayoutDashboard },
  { id: "nav-prod", label: "Produits", group: "Navigation", to: "/admin/produits", icon: Package },
  { id: "nav-orders", label: "Commandes", group: "Navigation", to: "/admin/commandes", icon: ShoppingCart },
  { id: "nav-rev", label: "Avis", group: "Navigation", to: "/admin/avis", icon: Star },
  { id: "nav-art", label: "Artisans", group: "Navigation", to: "/admin/artisans", icon: Users },
  { id: "nav-grp", label: "Groupements", group: "Navigation", to: "/admin/groupements", icon: Building2 },
  { id: "nav-form", label: "Formations", group: "Navigation", to: "/admin/formations", icon: GraduationCap },
  { id: "nav-evt", label: "Événements", group: "Navigation", to: "/admin/evenements", icon: Calendar },
  { id: "nav-blog", label: "Blog", group: "Navigation", to: "/admin/blog", icon: FileText },
  { id: "nav-gb", label: "Achats groupés", group: "Navigation", to: "/admin/achats-groupes", icon: Layers },
  { id: "nav-msg", label: "Messages", group: "Navigation", to: "/admin/messages", icon: MessageSquare },
  { id: "nav-set", label: "Paramètres", group: "Navigation", to: "/admin/parametres", icon: Settings },
  { id: "nav-aud", label: "Journal d'audit", group: "Navigation", to: "/admin/journal", icon: History },
  { id: "nav-site", label: "Voir le site", group: "Navigation", to: "/", icon: Home },
];

function buildEntityCommands(): Command[] {
  const out: Command[] = [];
  products.forEach(p => out.push({ id: `p-${p.id}`, label: p.name, hint: p.category, group: "Produits", to: `/boutique/${p.slug}`, icon: Package, keywords: p.category }));
  artisans.forEach(a => out.push({ id: `a-${a.id}`, label: a.name, hint: a.specialty, group: "Artisans", to: `/groupements/${a.slug}`, icon: Users }));
  groupements.forEach(g => out.push({ id: `g-${g.id}`, label: g.name, group: "Groupements", to: `/groupements/${g.slug}`, icon: Building2 }));
  formations.forEach(f => out.push({ id: `f-${f.id}`, label: f.title, group: "Formations", to: `/formations/${f.slug}`, icon: GraduationCap }));
  events.forEach(e => out.push({ id: `e-${e.id}`, label: e.title, hint: e.location, group: "Événements", to: `/evenements/${e.slug}`, icon: Calendar }));
  blogArticles.forEach(b => out.push({ id: `b-${b.id}`, label: b.title, hint: b.author, group: "Blog", to: `/blog/${b.slug}`, icon: FileText }));
  groupBuyingOffers.forEach(o => out.push({ id: `gb-${o.id}`, label: o.title, group: "Achats groupés", to: `/achats-groupes/${o.slug}`, icon: Layers }));
  return out;
}

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const allCommands = useMemo(() => [...NAV_COMMANDS, ...buildEntityCommands()], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_COMMANDS;
    return allCommands.filter(c => (c.label + " " + (c.hint || "") + " " + (c.keywords || "") + " " + c.group).toLowerCase().includes(q)).slice(0, 30);
  }, [query, allCommands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) { setQuery(""); setHighlight(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => { setHighlight(0); }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight(h => Math.min(filtered.length - 1, h + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => Math.max(0, h - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); const c = filtered[highlight]; if (c) { navigate(c.to); setOpen(false); } }
  };

  if (!open) return null;

  // Group commands
  const grouped: Record<string, Command[]> = {};
  filtered.forEach(c => { (grouped[c.group] ||= []).push(c); });

  let runningIndex = -1;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4" role="dialog" aria-modal="true" aria-label="Recherche rapide">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--ipk-border)]">
          <Search className="w-4 h-4 text-[var(--ipk-text)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Rechercher pages, produits, artisans, articles…"
            className="flex-1 outline-none bg-transparent"
            style={{ fontSize: "14px" }}
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>Esc</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>Aucun résultat</div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="px-4 pt-3 pb-1 text-[var(--ipk-text)] uppercase tracking-wider" style={{ fontSize: "10px", fontWeight: 600 }}>{group}</div>
                {items.map(c => {
                  runningIndex++;
                  const isActive = runningIndex === highlight;
                  const i = runningIndex;
                  return (
                    <button
                      key={c.id}
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => { navigate(c.to); setOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${isActive ? "bg-[var(--ipk-surface)]" : ""}`}
                    >
                      <c.icon className="w-4 h-4 text-[var(--ipk-text)] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px", fontWeight: 500 }}>{c.label}</div>
                        {c.hint && <div className="text-[var(--ipk-text)] truncate" style={{ fontSize: "11px" }}>{c.hint}</div>}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--ipk-text)] flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-2 bg-[var(--ipk-surface)] border-t border-[var(--ipk-border)] text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
          <div className="flex gap-2"><span><kbd>↑↓</kbd> naviguer</span><span><kbd>↵</kbd> ouvrir</span></div>
          <span>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}
