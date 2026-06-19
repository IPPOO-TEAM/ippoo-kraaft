import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Bell, Check, Trash2, X, Gift, Megaphone, Package, AlertTriangle, Info } from "lucide-react";
import { useNotifications, type NotificationCategory, type NotificationItem, type NotificationTone } from "../hooks/use-notifications";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d} j`;
  return new Date(iso).toLocaleDateString("fr-FR");
}

const CATEGORY_META: Record<NotificationCategory, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  reward:    { label: "Récompenses", icon: Gift },
  marketing: { label: "Marketing",   icon: Megaphone },
  order:     { label: "Commandes",   icon: Package },
  alert:     { label: "Alertes",     icon: AlertTriangle },
  system:    { label: "Système",     icon: Info },
};

const TONE_BAR: Record<NotificationTone, string> = {
  info:    "bg-sky-400",
  success: "bg-emerald-500",
  reward:  "bg-amber-500",
  warn:    "bg-orange-500",
  danger:  "bg-red-500",
};

const TONE_ICON_BG: Record<NotificationTone, string> = {
  info:    "bg-sky-100 text-sky-600",
  success: "bg-emerald-100 text-emerald-600",
  reward:  "bg-amber-100 text-amber-600",
  warn:    "bg-orange-100 text-orange-600",
  danger:  "bg-red-100 text-red-600",
};

type Filter = "all" | NotificationCategory;

export function NotificationBell() {
  const { items, unreadCount, markRead, markAllRead, remove, clear } = useNotifications();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [pinging, setPinging] = useState(false);
  const prevUnreadRef = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) {
      setPinging(true);
      const t = setTimeout(() => setPinging(false), 900);
      return () => clearTimeout(t);
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: items.length, reward: 0, marketing: 0, order: 0, alert: 0, system: 0 };
    items.forEach(n => { const k = (n.category || "system") as NotificationCategory; c[k] = (c[k] || 0) + 1; });
    return c;
  }, [items]);

  const filtered = filter === "all" ? items : items.filter(n => (n.category || "system") === filter);
  const visibleCategories = (Object.keys(CATEGORY_META) as NotificationCategory[]).filter(k => counts[k] > 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="p-2 rounded-lg hover:bg-[var(--ipk-surface)] transition-colors relative"
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Notifications"}
        >
          <Bell className={`w-5 h-5 text-[var(--ipk-text)] ${pinging ? "animate-bounce" : ""}`} aria-hidden="true" />
          {unreadCount > 0 && (
            <>
              {pinging && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--ipk-orange)] animate-ping opacity-75" aria-hidden="true" />
              )}
              <span
                className="absolute -top-0.5 -right-0.5 bg-[var(--ipk-orange)] text-white rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center"
                style={{ fontSize: "10px", fontWeight: 600 }}
                aria-hidden="true"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] sm:w-[380px] p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--ipk-border)]">
          <div style={{ fontSize: "14px", fontWeight: 600 }}>Notifications</div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--ipk-surface)] text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }} aria-label="Tout marquer comme lu">
                <Check className="w-3 h-3" /> Tout lire
              </button>
            )}
            {items.length > 0 && (
              <button onClick={clear} className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--ipk-surface)] text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }} aria-label="Tout effacer">
                <Trash2 className="w-3 h-3" /> Effacer
              </button>
            )}
          </div>
        </div>

        {visibleCategories.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5 border-b border-[var(--ipk-border)]" role="tablist">
            <FilterChip label="Toutes" count={counts.all} active={filter === "all"} onClick={() => setFilter("all")} />
            {visibleCategories.map(cat => (
              <FilterChip
                key={cat}
                label={CATEGORY_META[cat].label}
                count={counts[cat]}
                active={filter === cat}
                onClick={() => setFilter(cat)}
              />
            ))}
          </div>
        )}

        <div className="max-h-[420px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-[var(--ipk-text-muted)]" style={{ fontSize: "13px" }}>
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              {filter === "all" ? "Aucune notification pour le moment" : "Aucune notification dans cette catégorie"}
            </div>
          ) : (
            <ul className="divide-y divide-[var(--ipk-border)]">
              {filtered.map(n => (
                <NotificationRow key={n.id} n={n} onClick={() => { markRead(n.id); setOpen(false); }} onRemove={() => remove(n.id)} />
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${active ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)]"}`}
      style={{ fontSize: "11px", fontWeight: 600 }}
    >
      {label}
      <span className={`inline-block px-1 rounded-full ${active ? "bg-white/25" : "bg-white"}`} style={{ fontSize: "10px" }}>{count}</span>
    </button>
  );
}

function NotificationRow({ n, onClick, onRemove }: { n: NotificationItem; onClick: () => void; onRemove: () => void }) {
  const tone = n.tone || (n.category === "reward" ? "reward" : n.category === "alert" ? "warn" : "info");
  const cat = (n.category || "system") as NotificationCategory;
  const Meta = CATEGORY_META[cat];

  const inner = (
    <div className="flex items-start gap-2.5 px-3 py-2.5 pr-9">
      <span className={`mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${TONE_ICON_BG[tone]}`} aria-hidden="true">
        <Meta.icon className="w-3.5 h-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[var(--ipk-orange)] flex-shrink-0" aria-label="Non lue" />}
          <div className="truncate text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 600 }}>{n.title}</div>
        </div>
        {n.body && <div className="line-clamp-2 text-[var(--ipk-text-muted)] mt-0.5" style={{ fontSize: "12px" }}>{n.body}</div>}
        <div className="text-[var(--ipk-text-muted)] mt-0.5" style={{ fontSize: "11px" }}>{formatRelative(n.at)}</div>
      </div>
    </div>
  );

  return (
    <li className={`group relative ${!n.read ? "bg-[var(--ipk-green-dark)]/5" : ""}`}>
      <span className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r ${TONE_BAR[tone]}`} aria-hidden="true" />
      {n.url ? (
        <Link to={n.url} onClick={onClick} className="block hover:bg-[var(--ipk-surface)] transition-colors cursor-pointer">{inner}</Link>
      ) : (
        <button onClick={onClick} className="block w-full text-left hover:bg-[var(--ipk-surface)] transition-colors cursor-pointer">{inner}</button>
      )}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--ipk-border)] transition-opacity"
        aria-label="Supprimer"
      >
        <X className="w-3.5 h-3.5 text-[var(--ipk-text-muted)]" />
      </button>
    </li>
  );
}
