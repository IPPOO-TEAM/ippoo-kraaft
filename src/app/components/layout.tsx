import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Search, ShoppingCart, Menu, X, Home, Store, Image, Users,
  GraduationCap, Heart, User, ChevronRight, Phone, BookOpen,
  Calendar, Shield, Handshake, MapPin, ArrowRight,
  Tag, Flame, Trophy, Gift, Ticket, RotateCw, Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogIn, LogOut, UserPlus, Briefcase } from "lucide-react";
import { useUser } from "../hooks/use-user";
import { useStore } from "../hooks/use-store";
import { toast } from "sonner";
import { NewsletterForm } from "./newsletter-form";
import { NotificationBell } from "./notification-bell";
import { CurrencySwitcher } from "./currency-switcher";
import { LoyaltyHeaderBadge } from "./loyalty-badge";
import logoImg from "../../imports/logo_IPPOO_Kraft.png";

const navLinks = [
  { to: "/boutique", label: "Boutique", icon: Store },
  { to: "/galeries", label: "Galeries", icon: Image },
  { to: "/promotions", label: "Promos", icon: Tag },
  { to: "/groupements", label: "Groupements", icon: Users },
  { to: "/formations", label: "Formations", icon: GraduationCap },
  { to: "/blog", label: "Art & Cultures", icon: BookOpen },
  { to: "/achats-groupes", label: "Achats Groupés", icon: Users },
  { to: "/evenements", label: "Événements", icon: Calendar },
  { to: "/devenir-artisan", label: "Devenir artisan", icon: Handshake },
  { to: "/contact", label: "Contact", icon: Phone },
];

const marketingLinks = [
  { to: "/promotions", label: "Promotions", icon: Tag },
  { to: "/flash", label: "Ventes flash", icon: Flame },
  { to: "/concours", label: "Concours", icon: Trophy },
  { to: "/roue", label: "Roue de la fortune", icon: RotateCw },
  { to: "/carte-cadeau", label: "Cartes cadeaux", icon: Gift },
  { to: "/tickets-cadeaux", label: "Tickets cadeaux", icon: Ticket },
  { to: "/jour-de-marche", label: "Jour de marché", icon: Calendar },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useStore();
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const initials = user ? (user.fullName.split(/\s+/).map(s => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?") : "";
  const mainRef = useRef<HTMLElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);
  const firstRouteRef = useRef(true);

  useEffect(() => {
    if (firstRouteRef.current) { firstRouteRef.current = false; return; }
    setMobileMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const id = window.setTimeout(() => {
      mainRef.current?.focus({ preventScroll: true });
      const title = document.title || location.pathname;
      if (announcerRef.current) announcerRef.current.textContent = `Page chargée : ${title}`;
    }, 60);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  React.useEffect(() => {
    const onBroadcast = (e: Event) => {
      const detail = (e as CustomEvent<{ title: string; body: string; url?: string }>).detail;
      if (!detail) return;
      try {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(detail.title, { body: detail.body, icon: "/favicon.ico" });
        }
      } catch {}
      // Toast fallback
      import("sonner").then(({ toast }) => {
        toast(detail.title, { description: detail.body, action: detail.url ? { label: "Ouvrir", onClick: () => navigate(detail.url!) } : undefined });
      }).catch(() => {});
    };
    window.addEventListener("ipk:marketing:broadcast", onBroadcast as EventListener);
    return () => window.removeEventListener("ipk:marketing:broadcast", onBroadcast as EventListener);
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/boutique?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Skip to content (a11y) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--ipk-green-dark)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      {/* Top promo strip */}
      <PromoStrip />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--ipk-border)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/accueil" className="flex items-center gap-2 shrink-0">
            <img src={logoImg} alt="IPPOO KRAAFT" className="h-8 sm:h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {navLinks.slice(0, 6).map((link) => {
              const active = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? "bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)]"
                      : "text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]"
                  }`}
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-[var(--ipk-surface)] transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5 text-[var(--ipk-text)]" />
            </button>
            <LoyaltyHeaderBadge />
            <CurrencySwitcher />
            <NotificationBell />
            <Link
              to="/panier"
              className="p-2 rounded-lg hover:bg-[var(--ipk-surface)] transition-colors relative"
              aria-label={cartCount > 0 ? `Panier, ${cartCount} article${cartCount > 1 ? "s" : ""}` : "Panier vide"}
            >
              <ShoppingCart className="w-5 h-5 text-[var(--ipk-text)]" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--ipk-green-dark)] text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: "10px", fontWeight: 600 }} aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-[var(--ipk-surface)] transition-colors hidden sm:flex" aria-label={user ? `Compte de ${user.fullName}` : "Se connecter"}>
                  {user ? (
                    <Avatar className="w-8 h-8">
                      {user.profilePhoto && <AvatarImage src={user.profilePhoto} alt={user.fullName} />}
                      <AvatarFallback className="bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 600 }}>{initials}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="p-1.5"><User className="w-5 h-5 text-[var(--ipk-text)]" /></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{user.fullName}</div>
                      <div className="truncate text-muted-foreground" style={{ fontSize: "11px", fontWeight: 400 }}>{user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/compte")}><User className="w-4 h-4 mr-2" />Mon compte</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/favoris")}><Heart className="w-4 h-4 mr-2" />Favoris</DropdownMenuItem>
                    {(user.accountType === "artisan" || user.accountType === "entreprise") && (
                      <DropdownMenuItem onClick={() => navigate("/espace-artisan")}><Briefcase className="w-4 h-4 mr-2" />Espace artisan</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { logout(); toast.success("Déconnecté"); navigate("/"); }}>
                      <LogOut className="w-4 h-4 mr-2" />Se déconnecter
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Bienvenue</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/connexion")}><LogIn className="w-4 h-4 mr-2" />Se connecter</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/inscription")}><UserPlus className="w-4 h-4 mr-2" />Créer un compte</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-[var(--ipk-surface)] transition-colors lg:hidden" aria-label="Menu">
                  <Menu className="w-5 h-5 text-[var(--ipk-text)]" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0">
                <SheetHeader className="p-4 border-b border-[var(--ipk-border)]">
                  <SheetTitle className="flex items-center gap-2">
                    <img src={logoImg} alt="IPPOO KRAAFT" className="h-8 w-auto" />
                    <span style={{ color: "var(--ipk-ink)" }}>IPPOO KRAAFT</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col py-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                          location.pathname.startsWith(link.to)
                            ? "bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)]"
                            : "text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]"
                        }`}
                        style={{ fontSize: "15px" }}
                      >
                        <Icon className="w-5 h-5" />
                        <span style={{ fontWeight: 500 }}>{link.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                      </Link>
                    );
                  })}
                  <div className="border-t border-[var(--ipk-border)] my-2" />
                  {user ? (
                    <>
                      <Link to="/compte" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]" style={{ fontSize: "15px", fontWeight: 500 }}>
                        <User className="w-5 h-5" /> {user.fullName}
                      </Link>
                      {user.accountType === "artisan" && (
                        <Link to="/espace-artisan" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]" style={{ fontSize: "15px", fontWeight: 500 }}>
                          <Briefcase className="w-5 h-5" /> Espace artisan
                        </Link>
                      )}
                      <button onClick={() => { setMobileMenuOpen(false); logout(); toast.success("Déconnecté"); navigate("/"); }} className="flex items-center gap-3 px-4 py-3 text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)] text-left" style={{ fontSize: "15px", fontWeight: 500 }}>
                        <LogOut className="w-5 h-5" /> Se déconnecter
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/connexion" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]" style={{ fontSize: "15px", fontWeight: 500 }}>
                        <LogIn className="w-5 h-5" /> Se connecter
                      </Link>
                      <Link to="/inscription" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]" style={{ fontSize: "15px", fontWeight: 500 }}>
                        <UserPlus className="w-5 h-5" /> Créer un compte
                      </Link>
                    </>
                  )}
                  <div className="border-t border-[var(--ipk-border)] my-2" />
                  <div className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-wide text-[var(--ipk-text)]/60">Promos & Cadeaux</div>
                  {marketingLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                          location.pathname.startsWith(link.to) ? "bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)]" : "text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]"
                        }`}
                        style={{ fontSize: "14px", fontWeight: 500 }}
                      >
                        <Icon className="w-4 h-4" /> {link.label}
                      </Link>
                    );
                  })}
                  <div className="border-t border-[var(--ipk-border)] my-2" />
                  <Link to="/a-propos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]" style={{ fontSize: "15px", fontWeight: 500 }}>
                    À propos
                  </Link>
                  <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]" style={{ fontSize: "15px", fontWeight: 500 }}>
                    FAQ
                  </Link>
                  <Link to="/statistiques" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]" style={{ fontSize: "15px", fontWeight: 500 }}>
                    Chiffres clés
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-[var(--ipk-border)] px-3 sm:px-4 py-3 bg-white" role="search">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <div className="flex-1 relative">
                <label htmlFor="global-search" className="sr-only">Rechercher des produits ou artisans</label>
                <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ipk-text)]" />
                <input
                  id="global-search"
                  type="search"
                  placeholder="Rechercher produits, artisans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl"
                  style={{ fontSize: "14px" }}
                  autoFocus
                />
              </div>
              <Button type="submit" className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl px-4 sm:px-5 shrink-0">
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Rechercher</span>
              </Button>
            </form>
          </div>
        )}
      </header>

      {/* Main content */}
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* Route change live region (a11y) */}
      <div ref={announcerRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />


      {/* Footer */}
      <footer className="bg-[var(--ipk-ink)] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <img src={logoImg} alt="IPPOO KRAAFT" className="h-8 sm:h-10 w-auto" />
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700 }}>IPPOO KRAAFT</div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>ART & HANDMADE</div>
                </div>
              </div>
              <p style={{ fontSize: "14px", opacity: 0.7, lineHeight: 1.6 }}>
                Valorisation de l'artisanat africain authentique. Chaque pièce raconte une histoire, chaque achat soutient un artisan.
              </p>
              <div className="flex gap-3 mt-4">
                <MapPin className="w-4 h-4 opacity-60" />
                <span style={{ fontSize: "13px", opacity: 0.7 }}>Lomé, Togo</span>
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-green-dark)" }}>Boutique</h4>
              <div className="flex flex-col gap-2">
                {["Sculptures", "Textiles", "Poterie", "Vannerie", "Bijoux", "Nouveautés"].map(item => (
                  <Link key={item} to="/boutique" className="opacity-70 hover:opacity-100 transition-opacity" style={{ fontSize: "14px" }}>{item}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-green-dark)" }}>IPPOO KRAAFT</h4>
              <div className="flex flex-col gap-2">
                {[
                  { label: "À propos", to: "/a-propos" },
                  { label: "Groupements", to: "/groupements" },
                  { label: "Formations", to: "/formations" },
                  { label: "Événements", to: "/evenements" },
                  { label: "Blog", to: "/blog" },
                ].map(item => (
                  <Link key={item.to} to={item.to} className="opacity-70 hover:opacity-100 transition-opacity" style={{ fontSize: "14px" }}>{item.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-green-dark)" }}>Promos & cadeaux</h4>
              <div className="flex flex-col gap-2">
                {marketingLinks.map(item => (
                  <Link key={item.to} to={item.to} className="opacity-70 hover:opacity-100 transition-opacity" style={{ fontSize: "14px" }}>{item.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-green-dark)" }}>Aide</h4>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Contact", to: "/contact" },
                  { label: "FAQ", to: "/faq" },
                  { label: "Livraison", to: "/faq" },
                  { label: "Retours", to: "/faq" },
                  { label: "CGV", to: "/legal/cgv" },
                  { label: "Confidentialité", to: "/legal/confidentialite" },
                ].map(item => (
                  <Link key={item.label} to={item.to} className="opacity-70 hover:opacity-100 transition-opacity" style={{ fontSize: "14px" }}>{item.label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 600 }}>Restez informé</h4>
                <p style={{ fontSize: "13px", opacity: 0.7 }}>Nouveautés, événements, exclusivités... directement dans votre boîte mail.</p>
              </div>
              <NewsletterForm />
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-4" style={{ fontSize: "11px", opacity: 0.5 }}>
            <span>&copy; 2026 IPPOO KRAAFT ART AND HANDMADE. Tous droits réservés.</span>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link to="/legal/cgv">CGV</Link>
              <Link to="/legal/confidentialite">Confidentialité</Link>
              <Link to="/legal/cookies">Cookies</Link>
              <Link to="/legal/mentions">Mentions légales</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile bottom bar */}
      <nav
        aria-label="Navigation mobile"
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--ipk-border)] z-50 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-around py-1">
          {[
            { to: "/accueil", icon: Home, label: "Accueil" },
            { to: "/boutique", icon: Store, label: "Explorer" },
            { to: "/favoris", icon: Heart, label: "Favoris" },
            { to: "/panier", icon: ShoppingCart, label: "Panier" },
            { to: "/compte", icon: User, label: "Compte" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = item.to === "/accueil" ? location.pathname === "/accueil" : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                className="flex flex-col items-center py-1 px-2 min-w-0"
              >
                <Icon aria-hidden="true" className={`w-5 h-5 ${isActive ? "text-[var(--ipk-green-dark)]" : "text-[var(--ipk-text)]"}`} />
                <span className="truncate w-full text-center" style={{ fontSize: "9px", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--ipk-green-dark)" : "var(--ipk-text)" }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom spacer for mobile nav */}
      <div className="h-14 lg:hidden" />
    </div>
  );
}

function PromoStrip() {
  const STORAGE_KEY = "ipk:promoStrip:dismissedAt:v1";
  const [hidden, setHidden] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) return false;
      return Date.now() - Number(v) < 1000 * 60 * 60 * 24;
    } catch { return false; }
  });
  const items = [
    { to: "/flash", icon: Flame, text: "Ventes flash en cours" },
    { to: "/promotions", icon: Tag, text: "Codes promo du mois" },
    { to: "/roue", icon: RotateCw, text: "Tournez la roue chaque jour" },
    { to: "/carte-cadeau", icon: Gift, text: "Cartes cadeaux disponibles" },
    { to: "/jour-de-marche", icon: Calendar, text: "Jour de marché aujourd'hui" },
  ];
  const [idx, setIdx] = useState(0);
  React.useEffect(() => {
    if (hidden) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [hidden, items.length]);
  if (hidden) return null;
  const it = items[idx];
  const Icon = it.icon;
  return (
    <div className="bg-gradient-to-r from-[var(--ipk-green-dark)] via-emerald-700 to-amber-600 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-9 flex items-center justify-between gap-2 text-xs sm:text-[13px]">
        <Link to={it.to} className="flex items-center gap-2 min-w-0 hover:underline">
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{it.text}</span>
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
        </Link>
        <button
          onClick={() => { try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {} setHidden(true); }}
          aria-label="Masquer la bannière"
          className="p-1 rounded hover:bg-white/10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}