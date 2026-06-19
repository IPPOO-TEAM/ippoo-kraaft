import React from "react";
import { Link } from "react-router";
import { ArrowRight, Star, Shield, Award, Users, ChevronRight, Quote, Calendar, MapPin, Hammer, Scissors, Coffee, ShoppingBasket, Gem, Wrench, Briefcase, Music, TrendingDown, Clock, Tag, Flame, Trophy, Gift, Ticket, RotateCw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { IMAGES, groupements, testimonials, events, statsData, formatPrice, groupBuyingOffers } from "../data/mock-data";
import { useProducts, useArtisans } from "../hooks/use-products";
import { useCategories } from "../hooks/use-categories";
import { CRAFT_TAXONOMY, effectiveNiches } from "../data/craft-taxonomy";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { MarketDayBanner } from "./market-day-banner";
import { useCms } from "../hooks/use-cms";
import { useStore } from "../hooks/use-store";
import { useRecentlyViewed, recommendForUser } from "../hooks/use-recommendations";
import { ProductRecommendations } from "./product-recommendations";
import { Sparkles } from "lucide-react";

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hammer, Scissors, Coffee, ShoppingBasket, Gem, Wrench, Briefcase, Music,
};

const trustIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Award, Users, MapPin, Star, Tag, Flame, Trophy, Gift, Ticket, RotateCw, Calendar, Hammer,
};

export function HomePage() {
  useSeo({
    title: "Artisanat africain authentique",
    description: "Découvrez l'artisanat africain ancestral certifié IPPOO KRAAFT : oeuvres uniques, traçabilité QR, formations et groupements d'artisans.",
  });
  const products = useProducts();
  const artisans = useArtisans();
  const { home: cms } = useCms();
  const { favorites } = useStore();
  const recentlyViewed = useRecentlyViewed();
  const personalized = React.useMemo(
    () => recommendForUser(favorites, recentlyViewed, products, 8),
    [favorites, recentlyViewed, products],
  );
  const { visibleCategories: categories } = useCategories();
  const featuredProducts = products.filter(p => p.isExclusive || p.isUnique).slice(0, 4);
  const newProducts = products.slice(0, 6);
  const domainCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of CRAFT_TAXONOMY) {
      const slugs = new Set<string>();
      d.niches.forEach(n => { slugs.add(n.slug); n.subNiches?.forEach(s => slugs.add(`${n.slug}/${s.slug}`)); });
      map[d.slug] = products.filter(p => effectiveNiches(p).some(s => slugs.has(s))).length;
    }
    return map;
  }, [products]);

  return (
    <div className="pb-8">
      {cms.sections.marketDayBanner && <MarketDayBanner />}
      {/* Hero */}
      {cms.sections.hero && cms.hero.enabled && (
      <section className="relative overflow-hidden bg-[var(--ipk-ink)]">
        <div className="absolute inset-0">
          <LazyImage src={cms.hero.image || IMAGES.heroArtisan} alt="Hero" className="w-full h-full object-cover" style={{ opacity: 1 - cms.hero.overlay }} loading="eager" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-16 md:py-28">
          <div className="max-w-xl">
            <h1 className="text-white mb-3 sm:mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 6vw, 48px)", fontWeight: 700, lineHeight: 1.15 }}>
              {cms.hero.title}
            </h1>
            <p className="text-white/80 mb-5 sm:mb-6" style={{ fontSize: "15px", lineHeight: 1.7 }}>
              {cms.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={cms.hero.cta.href}>
                <Button className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-11 sm:h-12 px-6 w-full sm:w-auto">
                  {cms.hero.cta.label} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Trust bar */}
      {cms.sections.trust && cms.trust.enabled && (
      <section className="bg-white border-b border-[var(--ipk-border)]">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-12 sm:flex-wrap sm:justify-center scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
            {cms.trust.items.map((item, i) => {
              const Icon = trustIconMap[item.icon] || Shield;
              return (
                <div key={i} className="flex items-center gap-2 shrink-0">
                  <Icon className="w-4 h-4 text-[var(--ipk-green-dark)] shrink-0" />
                  <span className="whitespace-nowrap" style={{ fontSize: "12px", fontWeight: 500, color: "var(--ipk-text)" }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Savoir-faire section */}
      {cms.sections.savoir && cms.savoir.enabled && (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
            {cms.savoir.title}
          </h2>
          <p className="text-[var(--ipk-text)] mt-2 max-w-lg mx-auto" style={{ fontSize: "15px" }}>
            {cms.savoir.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cms.savoir.items.map((item, i) => (
            <Link key={i} to={item.link} className="group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[4/5]">
              <LazyImage src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-5">
                <h3 className="text-white" style={{ fontSize: "20px", fontWeight: 600 }}>{item.title}</h3>
                <p className="text-white/80" style={{ fontSize: "14px" }}>{item.desc}</p>
                <div className="flex items-center gap-1 mt-2 text-[var(--ipk-green-dark)]" style={{ fontSize: "13px", fontWeight: 500 }}>
                  <span className="text-white">Découvrir</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* Promos & cadeaux */}
      {cms.sections.promos && (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="flex items-end justify-between mb-4 sm:mb-5 gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[var(--ipk-green-dark)] mb-1"><Tag className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Bons plans</span></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>Promos, jeux & cadeaux</h2>
          </div>
          <Link to="/promotions" className="text-sm text-[var(--ipk-green-dark)] hover:underline flex items-center gap-1">Tout voir <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/flash", icon: Flame, label: "Ventes flash", desc: "Stocks limités", grad: "from-rose-500 to-rose-700" },
            { to: "/promotions", icon: Tag, label: "Promotions", desc: "Codes du moment", grad: "from-emerald-500 to-emerald-800" },
            { to: "/concours", icon: Trophy, label: "Concours", desc: "Tentez de gagner", grad: "from-fuchsia-500 to-purple-700" },
            { to: "/roue", icon: RotateCw, label: "Roue de la fortune", desc: "1 chance / jour", grad: "from-amber-500 to-orange-700" },
            { to: "/carte-cadeau", icon: Gift, label: "Cartes cadeaux", desc: "Offrez l'artisanat", grad: "from-cyan-500 to-blue-700" },
            { to: "/tickets-cadeaux", icon: Ticket, label: "Tickets cadeaux", desc: "Avantages fidèles", grad: "from-indigo-500 to-indigo-800" },
            { to: "/jour-de-marche", icon: Calendar, label: "Jour de marché", desc: "Programme semaine", grad: "from-teal-500 to-emerald-700" },
            { to: "/achats-groupes", icon: Users, label: "Achats groupés", desc: "Plus on est…", grad: "from-slate-600 to-slate-800" },
          ].map(t => {
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to} className={`p-4 rounded-2xl text-white bg-gradient-to-br ${t.grad} hover:scale-[1.02] transition-transform`}>
                <Icon className="w-5 h-5 mb-2" />
                <div className="font-medium" style={{ fontSize: "14px" }}>{t.label}</div>
                <div className="text-xs opacity-80">{t.desc}</div>
              </Link>
            );
          })}
        </div>
      </section>
      )}

      {/* Pièces uniques */}
      {cms.sections.exclusives && (
      <section className="bg-[var(--ipk-surface)] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
                Pièces Uniques & Exclusivités
              </h2>
              <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "14px" }}>Des oeuvres rares, certifiées et traçables</p>
            </div>
            <Link to="/boutique" className="text-[var(--ipk-blue)] flex items-center gap-1 shrink-0" style={{ fontSize: "14px", fontWeight: 500 }}>
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((product) => {
              const artisan = artisans.find(a => a.id === product.artisanId);
              return (
                <Link key={product.id} to={`/boutique/${product.slug}`} className="bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] group">
                  <div className="relative aspect-square overflow-hidden">
                    <LazyImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isUnique && <Badge className="bg-[var(--ipk-green-dark)] text-white border-0" style={{ fontSize: "10px" }}>Pièce unique</Badge>}
                      {product.isExclusive && <Badge className="bg-[var(--ipk-blue)] text-white border-0" style={{ fontSize: "10px" }}>Exclusivité</Badge>}
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <h4 className="text-[var(--ipk-ink)] truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{product.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />
                      <span style={{ fontSize: "11px", color: "var(--ipk-text)" }}>{product.rating} ({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ipk-green)" }}>{formatPrice(product.price)}</span>
                      <span className="hidden sm:inline" style={{ fontSize: "11px", color: "var(--ipk-text)" }}>{artisan?.name?.split(" ").pop()}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Categories */}
      {cms.sections.categories && (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-center mb-5 sm:mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
          Explorer par Catégorie
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {categories.map((cat, i) => {
            const Icon = categoryIconMap[cat.icon];
            return (
              <Link key={i} to={`/boutique?cat=${cat.name}`} className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[var(--ipk-surface)] hover:bg-[#0B6B3A]/10 transition-colors">
                {Icon && <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--ipk-green)]" />}
                <span className="truncate w-full" style={{ fontSize: "10px", fontWeight: 500, color: "var(--ipk-ink)", textAlign: "center" }}>{cat.name}</span>
                <span style={{ fontSize: "9px", color: "var(--ipk-text)" }}>{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>
      )}

      {/* Explorer par domaine d'artisanat (taxonomie complète) */}
      {cms.sections.taxonomy && (
      <section className="max-w-7xl mx-auto px-4 pb-8 sm:pb-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
              Explorer par domaine
            </h2>
            <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "13px" }}>11 domaines, plus de 70 niches d'artisanat</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {CRAFT_TAXONOMY.map((d) => {
            const nicheCount = d.niches.length + d.niches.reduce((s, n) => s + (n.subNiches?.length || 0), 0);
            return (
              <Link
                key={d.slug}
                to={`/boutique?dom=${d.slug}`}
                className="group p-3 sm:p-4 rounded-xl bg-white border border-[var(--ipk-border)] hover:border-[var(--ipk-green-dark)] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-[var(--ipk-ink)] group-hover:text-[var(--ipk-green-dark)]" style={{ fontSize: "13px", fontWeight: 600 }}>{d.label}</h4>
                  <ChevronRight className="w-4 h-4 text-[var(--ipk-text)] group-hover:text-[var(--ipk-green-dark)] shrink-0" />
                </div>
                <div className="mt-1 text-[var(--ipk-text)]" style={{ fontSize: "10px" }}>
                  {domainCounts[d.slug] || 0} produit{(domainCounts[d.slug] || 0) > 1 ? "s" : ""} · {nicheCount} niche{nicheCount > 1 ? "s" : ""}
                </div>
                {d.description && <p className="text-[var(--ipk-text)] mt-1 line-clamp-2" style={{ fontSize: "11px" }}>{d.description}</p>}
                <div className="mt-2 flex flex-wrap gap-1">
                  {d.niches.slice(0, 3).map(n => (
                    <span key={n.slug} className="px-1.5 py-0.5 rounded-full bg-[#0B6B3A]/8 text-[var(--ipk-green-dark)]" style={{ fontSize: "9px" }}>{n.label}</span>
                  ))}
                  {nicheCount > 3 && <span className="text-[var(--ipk-text)]" style={{ fontSize: "9px" }}>+{nicheCount - 3}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      )}

      {/* Groupements */}
      {cms.sections.groupements && (
      <section className="bg-[var(--ipk-surface)] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
                Artisans & Groupements
              </h2>
              <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "14px" }}>Des communautés organisées qui préservent les savoir-faire</p>
            </div>
            <Link to="/groupements" className="text-[var(--ipk-blue)] flex items-center gap-1 shrink-0" style={{ fontSize: "14px", fontWeight: 500 }}>
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupements.slice(0, 3).map((g) => (
              <Link key={g.id} to={`/groupements/${g.slug}`} className="bg-white rounded-2xl overflow-hidden border border-[var(--ipk-border)] group">
                <div className="relative h-40 overflow-hidden">
                  <LazyImage src={g.image} alt={g.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2">
                    <span className="text-white" style={{ fontSize: "11px" }}>{g.region}, {g.country}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--ipk-ink)" }}>{g.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {g.specialties.map((s, i) => (
                      <Badge key={i} variant="secondary" className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0" style={{ fontSize: "11px" }}>{s}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3" style={{ fontSize: "12px", color: "var(--ipk-text)" }}>
                    <span>{g.artisanCount} artisans</span>
                    <span>{g.productCount} oeuvres</span>
                    <span className="text-[var(--ipk-green-dark)]">{g.conformity}% conforme</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Formation */}
      {cms.sections.formation && (
      <section className="bg-[var(--ipk-green-dark)] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[4/3]">
              <LazyImage src={IMAGES.training} alt="Formation artisans" className="w-full h-full object-cover" />
            </div>
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-4">Transmission</Badge>
              <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 600 }}>
                Formations pour Artisans
              </h2>
              <p className="text-white/80 mt-3" style={{ fontSize: "15px", lineHeight: 1.7 }}>
                Perfectionnez vos techniques, développez vos compétences entrepreneuriales et obtenez vos certifications IPPOO KRAAFT.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-5 sm:mt-6">
                {[
                  { num: "12", label: "Formations" },
                  { num: "340+", label: "Formés" },
                  { num: "95%", label: "Satisfaction" },
                  { num: "5", label: "Pays" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3">
                    <div className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>{s.num}</div>
                    <div className="text-white/70" style={{ fontSize: "12px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <Link to="/formations">
                <Button className="mt-6 bg-white text-[var(--ipk-green-dark)] hover:bg-white/90 rounded-xl h-11 px-6">
                  Voir les formations <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Achats Groupés */}
      {cms.sections.groupBuying && (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Achats Groupés
          </h2>
          <Link to="/achats-groupes" className="text-[var(--ipk-blue)] flex items-center gap-1 shrink-0" style={{ fontSize: "14px", fontWeight: 500 }}>
            Toutes les offres <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {groupBuyingOffers.filter(o => o.status !== "completed").slice(0, 3).map((offer) => {
            const bestDiscount = offer.tiers[offer.tiers.length - 1].discount;
            const daysLeft = Math.max(0, Math.ceil((new Date(offer.deadline).getTime() - Date.now()) / 86400000));
            const pct = Math.min((offer.currentParticipants / offer.maxParticipants) * 100, 100);
            return (
              <Link key={offer.id} to={`/achats-groupes/${offer.slug}`} className="group bg-white rounded-2xl border border-[var(--ipk-border)] overflow-hidden hover:shadow-md transition-all">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <LazyImage src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-white ${offer.status === "closing_soon" ? "bg-[var(--ipk-amber)]" : offer.status === "upcoming" ? "bg-[var(--ipk-blue)]" : "bg-[var(--ipk-green)]"}`} style={{ fontSize: "11px", fontWeight: 600 }}>
                      {offer.status === "closing_soon" ? "Clôture imminente" : offer.status === "upcoming" ? "Bientôt" : "En cours"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-[var(--ipk-green)]" />
                    <span className="text-[var(--ipk-green)]" style={{ fontSize: "12px", fontWeight: 700 }}>-{bestDiscount}%</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[var(--ipk-ink)] mb-2 line-clamp-1" style={{ fontSize: "14px", fontWeight: 600 }}>{offer.title}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-[var(--ipk-text)] line-through" style={{ fontSize: "12px" }}>{formatPrice(offer.originalPrice)}</span>
                    <span className="text-[var(--ipk-green)]" style={{ fontSize: "15px", fontWeight: 700 }}>Dès {formatPrice(offer.tiers[0].price)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--ipk-border)] overflow-hidden mb-2">
                    <div className="h-full rounded-full bg-[var(--ipk-green)]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{offer.currentParticipants}/{offer.maxParticipants} participants</span>
                    <span className="text-[var(--ipk-text)] flex items-center gap-1" style={{ fontSize: "11px" }}><Clock className="w-3 h-3" />{daysLeft}j restants</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      )}

      {/* Événements */}
      {cms.sections.events && (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Prochains Événements
          </h2>
          <Link to="/evenements" className="text-[var(--ipk-blue)] flex items-center gap-1 shrink-0" style={{ fontSize: "14px", fontWeight: 500 }}>
            Tout voir <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {events.slice(0, 2).map((event) => (
            <Link key={event.id} to={`/evenements/${event.slug}`} className="flex gap-3 sm:gap-4 bg-white rounded-2xl border border-[var(--ipk-border)] p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0">
                <LazyImage src={event.image} alt={event.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Badge className="bg-[#0057FF]/10 text-[var(--ipk-blue)] border-0 mb-1" style={{ fontSize: "10px" }}>{event.type}</Badge>
                <h4 className="truncate" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{event.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-[var(--ipk-text)]" />
                  <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--ipk-text)]" />
                  <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{event.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* Testimonials */}
      {cms.sections.testimonials && (
      <section className="bg-[var(--ipk-surface)] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-6 sm:mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Ils nous font confiance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 border border-[var(--ipk-border)]">
                <Quote className="w-6 h-6 text-[#0B6B3A]/30 mb-3" />
                <p style={{ fontSize: "14px", color: "var(--ipk-text)", lineHeight: 1.7, fontStyle: "italic" }}>"{t.text}"</p>
                <div className="flex items-center gap-1 mt-4 mb-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />
                  ))}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{t.name}</div>
                <div style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Impact stats */}
      {cms.sections.stats && (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-center mb-5 sm:mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
          Notre Impact
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {[
            { num: statsData.artisans, label: "Artisans" },
            { num: statsData.groupements, label: "Groupements" },
            { num: statsData.uniquePieces, label: "Pièces uniques" },
            { num: statsData.countries, label: "Pays" },
            { num: statsData.partners, label: "Partenaires" },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 sm:p-4 rounded-2xl bg-[var(--ipk-surface)]">
              <div style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "var(--ipk-green-dark)" }}>{s.num}</div>
              <div style={{ fontSize: "13px", color: "var(--ipk-text)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Personalized recommendations */}
      {personalized.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-2">
          <ProductRecommendations
            title="Inspirés par votre historique"
            subtitle="Sélection personnalisée selon vos favoris et vos dernières visites"
            products={personalized}
            icon={<Sparkles className="w-3.5 h-3.5" />}
            accent="blue"
            ctaLabel="Voir la boutique"
            ctaHref="/boutique"
          />
        </section>
      )}

      {/* CTA Section */}
      {cms.sections.cta && (
      <section className="max-w-7xl mx-auto px-4 py-5 sm:py-8">
        <div className="bg-[var(--ipk-ink)] rounded-2xl p-5 sm:p-8 md:p-12 text-center">
          <h2 className="text-white mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600 }}>
            Rejoignez l'aventure IPPOO KRAAFT
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-6" style={{ fontSize: "15px" }}>
            Artisan, partenaire, collectionneur... trouvez votre place dans notre écosystème dédié à l'artisanat africain authentique.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/devenir-artisan">
              <Button className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-11 px-6">
                Devenir artisan
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-2 border-[var(--ipk-blue)] text-[var(--ipk-blue)] hover:bg-[var(--ipk-blue)] hover:text-white rounded-xl h-11 px-6 bg-transparent">
                Devenir partenaire
              </Button>
            </Link>
            <Link to="/boutique">
              <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-xl h-11 px-6 bg-transparent">
                Acheter
              </Button>
            </Link>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}