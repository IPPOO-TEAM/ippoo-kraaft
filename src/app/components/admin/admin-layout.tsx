import { useEffect, useMemo, useRef, useState } from "react";
import { loadReviews } from "../../hooks/use-admin-data";
import { NavLink, Outlet, Navigate, Link, useLocation } from "react-router";
import { toast } from "sonner";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Building2, GraduationCap,
  Calendar, FileText, MessageSquare, Star, Tag, Settings, LogOut, Menu, X, Home, Layers, History, Inbox, Image, Sparkles,
  Wifi, WifiOff, RefreshCw, Database
} from "lucide-react";
import { useAdmin, canAccessAdminPath } from "../../hooks/use-admin";
import { useSeo } from "../../hooks/use-seo";
import { AdminCommandPalette } from "./admin-command-palette";
import { useSyncQueue } from "../../hooks/use-sync-queue";

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/categories", label: "Catégories", icon: Tag },
  { to: "/admin/stocks", label: "Stocks", icon: Package },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { to: "/admin/avis", label: "Avis", icon: Star },
  { to: "/admin/artisans", label: "Artisans", icon: Users },
  { to: "/admin/groupements", label: "Groupements", icon: Building2 },
  { to: "/admin/formations", label: "Formations", icon: GraduationCap },
  { to: "/admin/evenements", label: "Événements", icon: Calendar },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/achats-groupes", label: "Achats groupés", icon: Layers },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/leads", label: "Demandes", icon: Inbox },
  { to: "/admin/marketing", label: "Marketing", icon: Tag },
  { to: "/admin/media", label: "Médias", icon: Image },
  { to: "/admin/cms", label: "CMS Accueil", icon: Sparkles },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
  { to: "/admin/supabase", label: "Supabase", icon: Database },
  { to: "/admin/journal", label: "Journal d'audit", icon: History },
];

export function AdminLayout() {
  const { session, logout, refresh } = useAdmin();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const wasSessionRef = useRef(!!session);
  useSeo({ title: "Administration", noIndex: true });

  // Activity-based session refresh (throttled to once per minute)
  useEffect(() => {
    if (!session) return;
    let last = Date.now();
    const onActivity = () => {
      if (Date.now() - last > 60_000) { last = Date.now(); refresh(); }
    };
    window.addEventListener("mousedown", onActivity);
    window.addEventListener("keydown", onActivity);
    return () => {
      window.removeEventListener("mousedown", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [session, refresh]);

  // Close drawer on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Notify on auto-logout (session expiry)
  useEffect(() => {
    if (wasSessionRef.current && !session) {
      toast.info("Session expirée", { description: "Veuillez vous reconnecter." });
    }
    wasSessionRef.current = !!session;
  }, [session]);

  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (session.role === "artisan" || session.role === "entreprise") return <Navigate to="/espace-artisan" replace />;
  if (!canAccessAdminPath(session.role, location.pathname)) {
    const allowed = ["/admin/avis", "/admin/artisans", "/admin/groupements", "/admin/produits", "/admin/messages", "/admin"];
    const target = allowed.find(p => canAccessAdminPath(session.role, p)) || "/admin";
    if (target !== location.pathname) return <Navigate to={target} replace />;
  }

  const badges = computeBadges(location.pathname);
  const visibleNav = NAV.filter(item => canAccessAdminPath(session.role, item.to));

  return (
    <div className="min-h-screen flex bg-[var(--ipk-surface)]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[var(--ipk-ink)] text-white shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent onNavigate={() => {}} onLogout={logout} username={session.username} badges={badges} items={visibleNav} role={session.role} />
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-[88vw] max-w-xs sm:w-72 bg-[var(--ipk-ink)] text-white overflow-y-auto">
            <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="absolute top-3 right-3 text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} onLogout={logout} username={session.username} badges={badges} items={visibleNav} role={session.role} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="lg:hidden bg-white border-b border-[var(--ipk-border)] px-4 h-14 flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" className="p-2 -ml-2">
            <Menu className="w-5 h-5 text-[var(--ipk-ink)]" />
          </button>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ipk-ink)" }}>Admin IPPOO KRAAFT</span>
          <div className="flex items-center gap-1">
            <SyncIndicator compact />
            <Link to="/accueil" aria-label="Voir le site" className="p-2 -mr-2"><Home className="w-5 h-5 text-[var(--ipk-ink)]" /></Link>
          </div>
        </header>

        <SyncBanner />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <AdminCommandPalette />
    </div>
  );
}

function SyncBanner() {
  const { isOnline, pendingCount, failedCount, flush } = useSyncQueue();
  if (isOnline && pendingCount === 0 && failedCount === 0) return null;
  if (!isOnline) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-2" role="status">
        <div className="flex items-center gap-2 text-amber-800 min-w-0">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span style={{ fontSize: "12px", fontWeight: 500 }} className="truncate">Hors-ligne — vos modifications sont mises en file d'attente{pendingCount > 0 ? ` (${pendingCount})` : ""}.</span>
        </div>
      </div>
    );
  }
  if (failedCount > 0) {
    return (
      <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between gap-2" role="alert">
        <div className="flex items-center gap-2 text-red-800 min-w-0">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span style={{ fontSize: "12px", fontWeight: 500 }} className="truncate">{failedCount} opération(s) en échec — voir Paramètres › File de synchro.</span>
        </div>
        <button onClick={flush} className="px-2 py-1 rounded-lg bg-red-600 text-white shrink-0" style={{ fontSize: "11px" }}>Réessayer</button>
      </div>
    );
  }
  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between gap-2" role="status">
      <div className="flex items-center gap-2 text-blue-800 min-w-0">
        <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
        <span style={{ fontSize: "12px", fontWeight: 500 }}>Synchronisation de {pendingCount} opération(s)…</span>
      </div>
    </div>
  );
}

function SyncIndicator({ compact = false }: { compact?: boolean }) {
  const { isOnline, pendingCount, failedCount } = useSyncQueue();
  const tone = !isOnline ? "amber" : failedCount > 0 ? "red" : pendingCount > 0 ? "blue" : "green";
  const Icon = !isOnline ? WifiOff : pendingCount > 0 ? RefreshCw : Wifi;
  const colorClass = tone === "red" ? "text-red-600" : tone === "amber" ? "text-amber-600" : tone === "blue" ? "text-blue-600" : "text-emerald-600";
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${colorClass}`} title={!isOnline ? "Hors-ligne" : `${pendingCount} en attente`} aria-label={!isOnline ? "Hors-ligne" : "En ligne"}>
        <Icon className={`w-4 h-4 ${pendingCount > 0 && isOnline ? "animate-spin" : ""}`} />
        {(pendingCount + failedCount) > 0 && <span style={{ fontSize: "10px", fontWeight: 700 }}>{pendingCount + failedCount}</span>}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 ${colorClass}`} style={{ fontSize: "11px", fontWeight: 600 }}>
      <Icon className={`w-3.5 h-3.5 ${pendingCount > 0 && isOnline ? "animate-spin" : ""}`} />
      {!isOnline ? "Hors-ligne" : pendingCount > 0 ? `Sync ${pendingCount}` : failedCount > 0 ? `${failedCount} échec` : "En ligne"}
    </span>
  );
}

function computeBadges(_path: string): Record<string, number> {
  const badges: Record<string, number> = {};
  try {
    const messagesRaw = localStorage.getItem("ipk:admin:messages:v1");
    if (messagesRaw) {
      const list = JSON.parse(messagesRaw) as { read?: boolean }[];
      const unread = list.filter(m => !m.read).length;
      if (unread > 0) badges["/admin/messages"] = unread;
    }
  } catch {}
  try {
    const reviews = loadReviews();
    let pending = 0;
    Object.values(reviews).forEach(arr => arr.forEach(r => { if (!(r as any).approved) pending++; }));
    if (pending > 0) badges["/admin/avis"] = pending;
  } catch {}
  try {
    const ordersRaw = localStorage.getItem("ipk:admin:orders:v1");
    if (ordersRaw) {
      const list = JSON.parse(ordersRaw) as { status: string }[];
      const pending = list.filter(o => o.status === "pending").length;
      if (pending > 0) badges["/admin/commandes"] = pending;
    }
  } catch {}
  try {
    const leadsRaw = localStorage.getItem("ipk:leads:v1");
    if (leadsRaw) {
      const list = JSON.parse(leadsRaw) as { read?: boolean; processed?: boolean }[];
      const unread = list.filter(l => !l.read && !l.processed).length;
      if (unread > 0) badges["/admin/leads"] = unread;
    }
  } catch {}
  return badges;
}

function SidebarContent({ onNavigate, onLogout, username, badges, items, role }: { onNavigate: () => void; onLogout: () => void; username: string; badges: Record<string, number>; items: typeof NAV; role: string }) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4 px-2">
        <Link to="/accueil" className="block" onClick={onNavigate}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>IPPOO KRAAFT</div>
          <div className="text-white/60" style={{ fontSize: "11px" }}>Administration</div>
        </Link>
      </div>
      <button
        type="button"
        onClick={() => { onNavigate(); window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true })); }}
        className="mb-4 mx-1 flex items-center justify-between gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white/80"
        style={{ fontSize: "12px" }}
      >
        <span className="flex items-center gap-2">🔍 Recherche</span>
        <kbd className="px-1.5 py-0.5 bg-white/10 rounded" style={{ fontSize: "10px" }}>⌘K</kbd>
      </button>
      <nav className="flex-1 space-y-1">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-[var(--ipk-green-dark)] text-white" : "text-white/80 hover:bg-white/10"}`
            }
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{item.label}</span>
            {badges[item.to] && badges[item.to] > 0 ? (
              <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-500 text-white" style={{ fontSize: "10px", fontWeight: 700, minWidth: "18px", textAlign: "center" }}>{badges[item.to]}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>
      <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-white/60" style={{ fontSize: "11px" }}>Connecté · {role}</div>
            <div className="truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{username}</div>
          </div>
          <span className="shrink-0"><SyncIndicator /></span>
        </div>
        <Link to="/accueil" onClick={onNavigate} className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:bg-white/10" style={{ fontSize: "12px" }}>
          <Home className="w-4 h-4" /> Voir le site
        </Link>
        <button onClick={() => { onLogout(); onNavigate(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:bg-white/10" style={{ fontSize: "12px" }}>
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    </div>
  );
}
