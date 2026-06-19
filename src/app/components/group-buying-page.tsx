import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  Users, Clock, ChevronRight, ArrowRight, ShoppingBag, Shield, CheckCircle,
  Tag, TrendingDown, AlertCircle, Package, Truck, Star, Minus, Plus,
  Share2, Heart, ArrowLeft, Timer, Percent, UserPlus, Info, Gift
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  IMAGES, groupBuyingOffers, groupements, artisans, formatPrice,
  type GroupBuyingOffer
} from "../data/mock-data";
import { LazyImage } from "./lazy-image";
import { useSeo } from "../hooks/use-seo";
import { NotFoundDetail } from "./not-found-detail";
import { toast } from "sonner";
import { LeadModal } from "./lead-modal";

function getStatusConfig(status: GroupBuyingOffer["status"]) {
  switch (status) {
    case "active": return { label: "En cours", color: "bg-[var(--ipk-green)]", textColor: "text-[var(--ipk-green)]", bgLight: "bg-[#0D8A3E]/10" };
    case "closing_soon": return { label: "Clôture imminente", color: "bg-[var(--ipk-amber)]", textColor: "text-[var(--ipk-amber)]", bgLight: "bg-[#F59E0B]/10" };
    case "completed": return { label: "Terminé", color: "bg-[var(--ipk-text)]", textColor: "text-[var(--ipk-text)]", bgLight: "bg-[#3B4450]/10" };
    case "upcoming": return { label: "Bientôt disponible", color: "bg-[var(--ipk-blue)]", textColor: "text-[var(--ipk-blue)]", bgLight: "bg-[#0057FF]/10" };
  }
}

function getDaysLeft(deadline: string): number {
  const diff = new Date(deadline).getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function ProgressBar({ current, max, min }: { current: number; max: number; min: number }) {
  const pct = Math.min((current / max) * 100, 100);
  const minPct = (min / max) * 100;
  return (
    <div className="relative">
      <div className="h-3 rounded-full bg-[var(--ipk-border)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--ipk-green)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Min threshold marker */}
      <div
        className="absolute top-0 w-0.5 h-3 bg-[var(--ipk-amber)]"
        style={{ left: `${minPct}%` }}
      />
      <div className="flex justify-between mt-1.5">
        <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
          {current}/{max} participants
        </span>
        <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
          Min. {min}
        </span>
      </div>
    </div>
  );
}

// ── CARD COMPONENT ──
function GroupBuyingCard({ offer }: { offer: GroupBuyingOffer }) {
  const statusCfg = getStatusConfig(offer.status);
  const daysLeft = getDaysLeft(offer.deadline);
  const bestDiscount = offer.tiers[offer.tiers.length - 1].discount;
  const groupement = groupements.find((g) => g.id === offer.groupementId);

  return (
    <Link
      to={`/achats-groupes/${offer.slug}`}
      className="group bg-white rounded-2xl border border-[var(--ipk-border)] overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <LazyImage
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`${statusCfg.color} text-white px-3 py-1 rounded-full`}
            style={{ fontSize: "11px", fontWeight: 600 }}
          >
            {statusCfg.label}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <TrendingDown className="w-3.5 h-3.5 text-[var(--ipk-green)]" />
          <span className="text-[var(--ipk-green)]" style={{ fontSize: "13px", fontWeight: 700 }}>
            -{bestDiscount}%
          </span>
        </div>
        {offer.status === "closing_soon" && (
          <div className="absolute bottom-3 left-3 bg-[#F59E0B]/90 backdrop-blur-sm text-white rounded-full px-3 py-1 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" />
            <span style={{ fontSize: "12px", fontWeight: 600 }}>
              {daysLeft}j restants
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2 py-0.5 rounded-md bg-[var(--ipk-surface)] text-[var(--ipk-text)]"
            style={{ fontSize: "11px", fontWeight: 600 }}
          >
            {offer.category}
          </span>
          {groupement && (
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
              {groupement.name}
            </span>
          )}
        </div>

        <h3
          className="text-[var(--ipk-ink)] mb-2 line-clamp-2"
          style={{ fontSize: "16px", fontWeight: 600, lineHeight: 1.4 }}
        >
          {offer.title}
        </h3>

        <p
          className="text-[var(--ipk-text)] mb-4 line-clamp-2"
          style={{ fontSize: "13px", lineHeight: 1.6 }}
        >
          {offer.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 sm:gap-3 mb-4">
          <span className="text-[var(--ipk-text)] line-through" style={{ fontSize: "13px" }}>
            {formatPrice(offer.originalPrice)}
          </span>
          <span className="text-[var(--ipk-green)]" style={{ fontSize: "18px", fontWeight: 700 }}>
            Dès {formatPrice(offer.tiers[0].price)}
          </span>
        </div>

        {/* Progress */}
        <ProgressBar
          current={offer.currentParticipants}
          max={offer.maxParticipants}
          min={offer.minParticipants}
        />

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--ipk-border)]">
          <div className="flex items-center gap-1.5 text-[var(--ipk-text)]">
            <Clock className="w-3.5 h-3.5" />
            <span style={{ fontSize: "12px" }}>
              Clôture : {new Date(offer.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
          </div>
          <span
            className="flex items-center gap-1 text-[var(--ipk-blue)] group-hover:gap-2 transition-all"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            Voir l'offre <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── LIST PAGE ──
export function GroupBuyingPage() {
  useSeo({ title: "Achats groupés — Jusqu'à -35%", description: "Rejoignez les achats groupés IPPOO KRAAFT et bénéficiez de paliers dégressifs pouvant aller jusqu'à -35% sur l'artisanat certifié." });
  const [filter, setFilter] = useState<"all" | "active" | "closing_soon" | "upcoming">("all");

  const filtered = filter === "all"
    ? groupBuyingOffers
    : groupBuyingOffers.filter((o) => o.status === filter);

  const activeCount = groupBuyingOffers.filter((o) => o.status === "active" || o.status === "closing_soon").length;
  const totalSavings = groupBuyingOffers.reduce((acc, o) => {
    const bestTier = o.tiers[o.tiers.length - 1];
    return acc + (o.originalPrice - bestTier.price) * o.currentParticipants;
  }, 0);

  return (
    <div className="pb-20 lg:pb-12">
      {/* Hero */}
      <section className="relative bg-[var(--ipk-ink)] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <LazyImage src={IMAGES.craftMarket} alt="" role="presentation" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="max-w-2xl">
            <Badge className="bg-[var(--ipk-green)] text-white border-0 mb-4 px-3 py-1" style={{ fontSize: "12px" }}>
              Achats Groupés
            </Badge>
            <h1
              className="text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, lineHeight: 1.15 }}
            >
              Achetez ensemble, économisez plus
            </h1>
            <p className="text-white/70 mb-8" style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Rejoignez un groupe d'acheteurs pour bénéficier de prix dégressifs sur
              l'artisanat authentique certifié. Plus le groupe grandit, plus le prix baisse.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-6">
              {[
                { icon: Package, value: `${activeCount}`, label: "offres actives" },
                { icon: Users, value: `${groupBuyingOffers.reduce((a, o) => a + o.currentParticipants, 0)}`, label: "participants" },
                { icon: TrendingDown, value: formatPrice(totalSavings), label: "économisés" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-[var(--ipk-green)]" />
                  </div>
                  <div>
                    <span className="text-white block" style={{ fontSize: "16px", fontWeight: 700 }}>{s.value}</span>
                    <span className="text-white/50 block" style={{ fontSize: "12px" }}>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[var(--ipk-surface)] border-b border-[var(--ipk-border)]">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
          <h2
            className="text-center text-[var(--ipk-ink)] mb-8"
            style={{ fontSize: "20px", fontWeight: 600 }}
          >
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Tag, step: "1", title: "Choisissez", desc: "Sélectionnez une offre groupée parmi nos collections certifiées." },
              { icon: UserPlus, step: "2", title: "Rejoignez", desc: "Inscrivez-vous au groupe. Le prix baisse à chaque nouveau participant." },
              { icon: Timer, step: "3", title: "Attendez", desc: "Le groupe se remplit jusqu'à la date de clôture de l'offre." },
              { icon: Truck, step: "4", title: "Recevez", desc: "Livraison groupée au meilleur prix, avec certificat et traçabilité." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="relative w-14 h-14 rounded-2xl bg-white border border-[var(--ipk-border)] flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-[var(--ipk-green)]" />
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--ipk-green)] text-white flex items-center justify-center"
                    style={{ fontSize: "11px", fontWeight: 700 }}
                  >
                    {s.step}
                  </span>
                </div>
                <h4 className="text-[var(--ipk-ink)] mb-1" style={{ fontSize: "14px", fontWeight: 600 }}>{s.title}</h4>
                <p className="text-[var(--ipk-text)]" style={{ fontSize: "12px", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {([
            { key: "all", label: "Toutes" },
            { key: "active", label: "En cours" },
            { key: "closing_soon", label: "Clôture imminente" },
            { key: "upcoming", label: "À venir" },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl transition-colors ${
                filter === f.key
                  ? "bg-[var(--ipk-green)] text-white"
                  : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-border)]"
              }`}
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {f.label}
              {f.key === "closing_soon" && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {groupBuyingOffers.filter((o) => o.status === "closing_soon").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-[var(--ipk-border)] mx-auto mb-4" />
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "16px" }}>
              Aucune offre dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((offer) => (
              <GroupBuyingCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>

      {/* CTA professionnel */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[var(--ipk-green)] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-6 h-6 text-white" />
              <h3 className="text-white" style={{ fontSize: "22px", fontWeight: 700 }}>
                Commande sur mesure professionnelle
              </h3>
            </div>
            <p className="text-white/80" style={{ fontSize: "15px", lineHeight: 1.7 }}>
              Hôtels, galeries, décorateurs, boutiques : créez votre propre achat groupé
              personnalisé avec des conditions exclusives et un accompagnement dédié.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-8 py-4 rounded-xl bg-white text-[var(--ipk-green)] hover:bg-white/90 transition-colors shrink-0"
            style={{ fontSize: "15px", fontWeight: 600 }}
          >
            Demander un devis professionnel
          </Link>
        </div>
      </section>
    </div>
  );
}

// ── DETAIL PAGE ──
export function GroupBuyingDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const offer = groupBuyingOffers.find((o) => o.slug === slug);
  const [notifyOpen, setNotifyOpen] = useState(false);

  useSeo({
    title: offer ? offer.title : "Offre introuvable",
    description: offer?.description,
    ogImage: offer?.image,
    noIndex: !offer,
  });

  const [selectedTier, setSelectedTier] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);

  if (!offer) {
    return <NotFoundDetail title="Offre introuvable" message="Cette offre d'achat groupé n'est plus disponible." backTo="/achats-groupes" backLabel="Voir les achats groupés" />;
  }

  const statusCfg = getStatusConfig(offer.status);
  const daysLeft = getDaysLeft(offer.deadline);
  const groupement = groupements.find((g) => g.id === offer.groupementId);
  const artisan = artisans.find((a) => a.id === offer.artisanId);
  const currentTier = offer.tiers[selectedTier];
  const totalPrice = currentTier.price * quantity;
  const totalSaved = (offer.originalPrice - currentTier.price) * quantity;

  const handleJoin = () => {
    toast.success("Inscription confirmée !", {
      description: `Vous avez rejoint le groupe "${offer.title}" — ${quantity} pièce(s) à ${formatPrice(currentTier.price)}/u.`,
    });
  };

  return (
    <div className="pb-20 lg:pb-12">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>
          <Link to="/accueil" className="hover:text-[var(--ipk-green)]">Accueil</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/achats-groupes" className="hover:text-[var(--ipk-green)]">Achats Groupés</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--ipk-ink)] truncate max-w-[200px]">{offer.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Image & info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
              <LazyImage src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`${statusCfg.color} text-white px-3 py-1.5 rounded-full`} style={{ fontSize: "12px", fontWeight: 600 }}>
                  {statusCfg.label}
                </span>
                {offer.status !== "upcoming" && (
                  <span className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-[var(--ipk-amber)]" />
                    <span className="text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 600 }}>
                      {daysLeft}j restants
                    </span>
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsFav(!isFav)}
                  aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                  aria-pressed={isFav}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFav ? "text-red-500 fill-red-500" : "text-[var(--ipk-text)]"}`} />
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Lien copié !"); }}
                  aria-label="Partager cette offre"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Share2 className="w-5 h-5 text-[var(--ipk-text)]" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6">
              <h2 className="text-[var(--ipk-ink)] mb-3" style={{ fontSize: "18px", fontWeight: 600 }}>
                À propos de cette offre
              </h2>
              <p className="text-[var(--ipk-text)] mb-6" style={{ fontSize: "15px", lineHeight: 1.8 }}>
                {offer.description}
              </p>

              {/* Highlights */}
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {offer.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--ipk-green)] mt-0.5 shrink-0" />
                    <span className="text-[var(--ipk-text)]" style={{ fontSize: "14px" }}>{h}</span>
                  </div>
                ))}
              </div>

              {/* Delivery */}
              <div className="bg-[var(--ipk-surface)] rounded-xl p-4 flex items-start gap-3">
                <Truck className="w-5 h-5 text-[var(--ipk-blue)] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[var(--ipk-ink)] block" style={{ fontSize: "14px", fontWeight: 600 }}>Livraison</span>
                  <span className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{offer.deliveryInfo}</span>
                </div>
              </div>
            </div>

            {/* Artisan & Groupement */}
            <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6">
              <h3 className="text-[var(--ipk-ink)] mb-4" style={{ fontSize: "16px", fontWeight: 600 }}>
                Artisan & Groupement
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {artisan && (
                  <Link
                    to={`/groupements/${groupement?.slug || ""}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--ipk-surface)] hover:bg-[var(--ipk-border)] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <LazyImage src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[var(--ipk-ink)] block" style={{ fontSize: "14px", fontWeight: 600 }}>
                        {artisan.name}
                      </span>
                      <span className="text-[var(--ipk-text)] block" style={{ fontSize: "12px" }}>
                        {artisan.specialty} — {artisan.country}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-[var(--ipk-amber)] fill-[var(--ipk-amber)]" />
                        <span className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>{artisan.rating}</span>
                      </div>
                    </div>
                  </Link>
                )}
                {groupement && (
                  <Link
                    to={`/groupements/${groupement.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--ipk-surface)] hover:bg-[var(--ipk-border)] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <LazyImage src={groupement.image} alt={groupement.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[var(--ipk-ink)] block" style={{ fontSize: "14px", fontWeight: 600 }}>
                        {groupement.name}
                      </span>
                      <span className="text-[var(--ipk-text)] block" style={{ fontSize: "12px" }}>
                        {groupement.artisanCount} artisans — {groupement.country}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-[var(--ipk-green)]" />
                        <span className="text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>Conformité {groupement.conformity}%</span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right — Pricing Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-5">
              {/* Main pricing card */}
              <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[var(--ipk-surface)] text-[var(--ipk-text)]" style={{ fontSize: "11px", fontWeight: 600 }}>
                    {offer.category}
                  </span>
                  <span className={`${statusCfg.bgLight} ${statusCfg.textColor} px-2 py-0.5 rounded-md`} style={{ fontSize: "11px", fontWeight: 600 }}>
                    {statusCfg.label}
                  </span>
                </div>
                <h1
                  className="text-[var(--ipk-ink)] mb-4"
                  style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.3 }}
                >
                  {offer.title}
                </h1>

                {/* Progress */}
                <div className="mb-6">
                  <ProgressBar
                    current={offer.currentParticipants}
                    max={offer.maxParticipants}
                    min={offer.minParticipants}
                  />
                </div>

                {/* Tier selector */}
                <div className="mb-5">
                  <span className="text-[var(--ipk-ink)] block mb-3" style={{ fontSize: "14px", fontWeight: 600 }}>
                    Paliers de prix dégressifs
                  </span>
                  <div className="space-y-2">
                    {offer.tiers.map((tier, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedTier(i)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
                          selectedTier === i
                            ? "border-[var(--ipk-green)] bg-[#0D8A3E]/5"
                            : "border-[var(--ipk-border)] hover:border-[#0D8A3E]/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedTier === i ? "border-[var(--ipk-green)]" : "border-[var(--ipk-border)]"
                            }`}
                          >
                            {selectedTier === i && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[var(--ipk-green)]" />
                            )}
                          </div>
                          <div className="text-left">
                            <span className="text-[var(--ipk-ink)] block" style={{ fontSize: "14px", fontWeight: 600 }}>
                              Dès {tier.minQty} pièces
                            </span>
                            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
                              {formatPrice(tier.price)} / pièce
                            </span>
                          </div>
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-lg bg-[#0D8A3E]/10 text-[var(--ipk-green)]"
                          style={{ fontSize: "13px", fontWeight: 700 }}
                        >
                          -{tier.discount}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-5">
                  <span className="text-[var(--ipk-ink)] block mb-2" style={{ fontSize: "14px", fontWeight: 600 }}>
                    Quantité
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Diminuer la quantité"
                      className="w-10 h-10 rounded-xl border border-[var(--ipk-border)] flex items-center justify-center hover:bg-[var(--ipk-surface)] transition-colors"
                    >
                      <Minus className="w-4 h-4 text-[var(--ipk-text)]" />
                    </button>
                    <span className="w-12 text-center text-[var(--ipk-ink)]" style={{ fontSize: "18px", fontWeight: 600 }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Augmenter la quantité"
                      className="w-10 h-10 rounded-xl border border-[var(--ipk-border)] flex items-center justify-center hover:bg-[var(--ipk-surface)] transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[var(--ipk-text)]" />
                    </button>
                  </div>
                </div>

                {/* Price summary */}
                <div className="bg-[var(--ipk-surface)] rounded-xl p-4 mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-[var(--ipk-text)]" style={{ fontSize: "14px" }}>
                      {quantity} x {formatPrice(currentTier.price)}
                    </span>
                    <span className="text-[var(--ipk-ink)]" style={{ fontSize: "14px", fontWeight: 600 }}>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[var(--ipk-text)]" style={{ fontSize: "14px" }}>
                      Prix catalogue
                    </span>
                    <span className="text-[var(--ipk-text)] line-through" style={{ fontSize: "14px" }}>
                      {formatPrice(offer.originalPrice * quantity)}
                    </span>
                  </div>
                  <div className="border-t border-[var(--ipk-border)] pt-2 mt-2 flex justify-between">
                    <span className="text-[var(--ipk-green)]" style={{ fontSize: "14px", fontWeight: 600 }}>
                      Vous économisez
                    </span>
                    <span className="text-[var(--ipk-green)]" style={{ fontSize: "16px", fontWeight: 700 }}>
                      {formatPrice(totalSaved)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                {offer.status === "upcoming" ? (
                  <Button
                    className="w-full py-3.5 rounded-xl bg-[var(--ipk-blue)] hover:bg-[var(--ipk-blue-dark)] text-white"
                    style={{ fontSize: "15px", fontWeight: 600 }}
                    onClick={() => setNotifyOpen(true)}
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Me notifier à l'ouverture
                  </Button>
                ) : (
                  <Button
                    className="w-full py-3.5 rounded-xl bg-[var(--ipk-green)] hover:bg-[#0a7434] text-white"
                    style={{ fontSize: "15px", fontWeight: 600 }}
                    onClick={handleJoin}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Rejoindre le groupe
                  </Button>
                )}

                <p className="text-center text-[var(--ipk-text)] mt-3" style={{ fontSize: "12px" }}>
                  <Shield className="w-3 h-3 inline mr-1" />
                  Paiement sécurisé — Satisfaction garantie
                </p>
              </div>

              {/* Info box */}
              <div className="bg-[#0057FF]/5 rounded-2xl border border-[#0057FF]/15 p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[var(--ipk-blue)] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[var(--ipk-ink)] block mb-1" style={{ fontSize: "14px", fontWeight: 600 }}>
                      Comment fonctionne le palier ?
                    </span>
                    <p className="text-[var(--ipk-text)]" style={{ fontSize: "13px", lineHeight: 1.6 }}>
                      Le prix final est déterminé par le nombre total de participants à la clôture.
                      Si le groupe atteint le palier supérieur, tous les participants bénéficient
                      automatiquement du meilleur tarif.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other offers */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-[var(--ipk-ink)] mb-6" style={{ fontSize: "20px", fontWeight: 600 }}>
          Autres achats groupés
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupBuyingOffers
            .filter((o) => o.id !== offer.id)
            .slice(0, 3)
            .map((o) => (
              <GroupBuyingCard key={o.id} offer={o} />
            ))}
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-[var(--ipk-border)] p-3 z-30 lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[var(--ipk-green)] block" style={{ fontSize: "16px", fontWeight: 700 }}>
              {formatPrice(currentTier.price)}
            </span>
            <span className="text-[var(--ipk-text)] line-through" style={{ fontSize: "12px" }}>
              {formatPrice(offer.originalPrice)}
            </span>
          </div>
          {offer.status === "upcoming" ? (
            <Button
              className="rounded-xl bg-[var(--ipk-blue)] hover:bg-[var(--ipk-blue-dark)] text-white px-6"
              style={{ fontSize: "14px", fontWeight: 600 }}
              onClick={() => toast.success("Vous serez notifié dès l'ouverture de cette offre.")}
            >
              Me notifier
            </Button>
          ) : (
            <Button
              className="rounded-xl bg-[var(--ipk-green)] hover:bg-[#0a7434] text-white px-6"
              style={{ fontSize: "14px", fontWeight: 600 }}
              onClick={handleJoin}
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Rejoindre le groupe
            </Button>
          )}
        </div>
      </div>
      <LeadModal open={notifyOpen} onOpenChange={setNotifyOpen} type="notify_groupbuy" title={`Notification — ${offer.title}`} description="Vous serez prévenu dès l'ouverture de cette offre." refId={offer.id} refLabel={offer.title} fields={{ phone: false, message: false }} successToast="Notification activée pour cette offre." />
    </div>
  );
}