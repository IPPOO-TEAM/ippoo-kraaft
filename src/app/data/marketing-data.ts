// Données mock pour les modules marketing : promotions, concours, roue, cartes cadeaux,
// tickets, ventes flash, jour de marché. Les visuels sont conçus en CSS (coupons),
// inspirés des codes graphiques d'affiches de promotion sans utiliser de photos externes.

export type CouponTheme =
  | "amber" | "rose" | "emerald" | "indigo" | "fuchsia" | "cyan" | "slate"
  | "terracotta" | "ochre" | "bronze" | "clay" | "ivory";
export type CouponPattern = "kente" | "dots" | "rays" | "diamonds" | "weave" | "adinkra" | "bogolan";

export interface CouponStyle {
  theme: CouponTheme;
  pattern: CouponPattern;
}

export type PromotionKind = "percent" | "fixed";
export type PromotionSegment = "all" | "new" | "loyalty";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  /** Type de remise : pourcentage ou montant fixe en Fcfa */
  kind: PromotionKind;
  /** Valeur (% ou Fcfa) */
  value: number;
  code: string;
  validUntil: string;
  category?: string;
  /** Cible la promo sur un artisan précis (slug ou id) */
  artisanSlug?: string;
  artisanName?: string;
  /** Segment client : tous, nouveaux, fidélité (≥ 3 commandes) */
  segment: PromotionSegment;
  /** Panier minimum requis (Fcfa) */
  minCart?: number;
  style: CouponStyle;
  /** Compat ancien champ — getter dérivé */
  pct?: number;
  /** Désactivée par l'admin (visible mais non utilisable) */
  disabled?: boolean;
}

/** Liste de seed initiale — l'admin peut éditer/ajouter via le hook marketing. */
export const promotions: Promotion[] = [
  { id: "promo-1", title: "Marché Grand Lancement", description: "-20% sur toutes les pièces de la collection Éwé.", kind: "percent", value: 20, pct: 20, code: "GRAND20", validUntil: "2026-06-15", category: "Collection", segment: "all", style: { theme: "emerald", pattern: "kente" } },
  { id: "promo-2", title: "Bienvenue chez IPK", description: "5 000 Fcfa offerts sur votre premier panier dès 25 000 Fcfa.", kind: "fixed", value: 5000, code: "BIENVENUE5K", validUntil: "2026-12-31", category: "Nouveau client", segment: "new", minCart: 25000, style: { theme: "ochre", pattern: "adinkra" } },
  { id: "promo-3", title: "Fête des Mères", description: "-25% sur les bijoux artisanaux pour la fête des mères.", kind: "percent", value: 25, pct: 25, code: "MAMAN25", validUntil: "2026-05-25", category: "Bijoux", segment: "all", style: { theme: "fuchsia", pattern: "diamonds" } },
  { id: "promo-4", title: "Atelier Kossi — édition limitée", description: "-15% sur les sculptures de l'atelier de l'artisan Kossi.", kind: "percent", value: 15, pct: 15, code: "KOSSI15", validUntil: "2026-07-31", category: "Artisan", artisanSlug: "kossi-adoglo", artisanName: "Kossi Adoglo", segment: "all", style: { theme: "bronze", pattern: "weave" } },
  { id: "promo-5", title: "Fidélité Or — 10 000 Fcfa", description: "Cadeau pour nos clients dès 3 commandes : 10 000 Fcfa offerts.", kind: "fixed", value: 10000, code: "FIDELE10K", validUntil: "2026-12-31", category: "Fidélité", segment: "loyalty", style: { theme: "terracotta", pattern: "bogolan" } },
];

export interface FlashDeal {
  id: string;
  productName: string;
  basePrice: number;
  flashPrice: number;
  endsAt: string;
  stockLeft: number;
  totalStock: number;
  style: CouponStyle;
  /** Désactivée par l'admin */
  disabled?: boolean;
}

export const flashDeals: FlashDeal[] = [
  { id: "flash-1", productName: "Masque Éwé édition limitée", basePrice: 95000, flashPrice: 59000, endsAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(), stockLeft: 7, totalStock: 20, style: { theme: "rose", pattern: "rays" } },
  { id: "flash-2", productName: "Pagne Kente royal 2 m", basePrice: 48000, flashPrice: 32000, endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), stockLeft: 3, totalStock: 15, style: { theme: "ochre", pattern: "kente" } },
  { id: "flash-3", productName: "Statuette Akouaba", basePrice: 70000, flashPrice: 49000, endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), stockLeft: 12, totalStock: 25, style: { theme: "bronze", pattern: "adinkra" } },
  { id: "flash-4", productName: "Calebasse gravée XL", basePrice: 28000, flashPrice: 17500, endsAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(), stockLeft: 2, totalStock: 10, style: { theme: "rose", pattern: "dots" } },
];

export type ContestKind = "buyer" | "artisan" | "design" | "share";
export type ContestRanking = "votes" | "draw" | "jury";

export interface Contest {
  id: string;
  title: string;
  prize: string;
  description: string;
  endsAt: string;
  participants: number;
  rules: string[];
  style: CouponStyle;
  kind: ContestKind;
  ranking: ContestRanking;
  /** Permet la soumission d'une œuvre (URL image ou texte) */
  submission?: { type: "image" | "text"; label: string };
  /** Concours clôturé manuellement par l'admin */
  closed?: boolean;
  /** Désactivé (masqué côté public) */
  disabled?: boolean;
}

export const CONTEST_KIND_LABEL: Record<ContestKind, string> = {
  buyer: "Acheteur",
  artisan: "Artisan",
  design: "Design",
  share: "Partage",
};

export const CONTEST_RANKING_LABEL: Record<ContestRanking, string> = {
  votes: "Vote du public",
  draw: "Tirage au sort",
  jury: "Jury IPK",
};

export const contests: Contest[] = [
  {
    id: "contest-1",
    title: "Grand jeu IPK — Une œuvre offerte",
    prize: "Statuette Akouaba certifiée (valeur 75 000 Fcfa)",
    description: "Tentez de remporter une pièce signée par nos artisans. Tirage au sort parmi tous les participants.",
    endsAt: "2026-06-30",
    participants: 412,
    rules: ["Réservé aux résidents Togo, Ghana, Bénin, Côte d'Ivoire", "Une participation par adresse e-mail", "Tirage en direct sur Instagram"],
    style: { theme: "fuchsia", pattern: "rays" },
    kind: "buyer",
    ranking: "draw",
  },
  {
    id: "contest-2",
    title: "Concours Photo #MonIPK",
    prize: "Bon d'achat 50 000 Fcfa + visite atelier",
    description: "Partagez une photo de votre objet IPK favori avec le hashtag #MonIPK.",
    endsAt: "2026-07-15",
    participants: 89,
    rules: ["Photo originale uniquement", "Compte Instagram public", "Mention @ippookraaft"],
    style: { theme: "clay", pattern: "bogolan" },
    kind: "share",
    ranking: "votes",
    submission: { type: "image", label: "URL de votre photo Instagram" },
  },
  {
    id: "contest-3",
    title: "Trophée Artisan d'Or",
    prize: "Trophée + reportage vidéo + 100 000 Fcfa",
    description: "Réservé aux artisans IPK : présentez votre pièce signature 2026. Jury professionnel.",
    endsAt: "2026-08-31",
    participants: 27,
    rules: ["Réservé aux artisans certifiés IPK", "Une œuvre par artisan", "Jury composé de 5 professionnels"],
    style: { theme: "ochre", pattern: "kente" },
    kind: "artisan",
    ranking: "jury",
    submission: { type: "text", label: "Description de votre pièce signature" },
  },
  {
    id: "contest-4",
    title: "Design IPK 2026 — Motif textile",
    prize: "Édition limitée à votre nom + 50 000 Fcfa",
    description: "Proposez un motif inspiré du patrimoine ouest-africain. Le motif gagnant sera tissé en édition limitée.",
    endsAt: "2026-07-31",
    participants: 64,
    rules: ["Création originale", "Format vectoriel ou photo HD", "Cession de droits si gagnant"],
    style: { theme: "indigo", pattern: "diamonds" },
    kind: "design",
    ranking: "votes",
    submission: { type: "image", label: "URL de votre proposition" },
  },
];

export interface WheelPrize {
  id: string;
  label: string;
  type: "discount" | "freeship" | "giftcard" | "lose" | "ticket" | "points";
  value?: number;
  weight: number;
  color: string;
}

export const wheelPrizes: WheelPrize[] = [
  { id: "w1", label: "-5%",          type: "discount", value: 5,     weight: 25, color: "#0B6B3A" },
  { id: "w2", label: "Livraison",    type: "freeship",                weight: 15, color: "#B45309" },
  { id: "w3", label: "Rejouez",      type: "lose",                    weight: 20, color: "#6B7280" },
  { id: "w4", label: "-10%",         type: "discount", value: 10,    weight: 15, color: "#1E40AF" },
  { id: "w5", label: "Ticket",       type: "ticket",                  weight: 12, color: "#BE185D" },
  { id: "w6", label: "-20%",         type: "discount", value: 20,    weight: 8,  color: "#7C3AED" },
  { id: "w7", label: "5 000 F",      type: "giftcard", value: 5000,  weight: 4,  color: "#0E7490" },
  { id: "w8", label: "+200 pts",     type: "points",   value: 200,    weight: 8,  color: "#0E7490" },
];

export interface GiftCardOffer { id: string; label: string; amount: number; style: CouponStyle; }
export const giftCardOffers: GiftCardOffer[] = [
  { id: "gc-10", label: "Carte 10 000 Fcfa", amount: 10000, style: { theme: "emerald", pattern: "kente" } },
  { id: "gc-25", label: "Carte 25 000 Fcfa", amount: 25000, style: { theme: "amber", pattern: "dots" } },
  { id: "gc-50", label: "Carte 50 000 Fcfa", amount: 50000, style: { theme: "fuchsia", pattern: "diamonds" } },
  { id: "gc-100", label: "Carte 100 000 Fcfa", amount: 100000, style: { theme: "indigo", pattern: "weave" } },
];

export interface MarketDay {
  id: string;
  weekday: string;
  date: string;
  theme: string;
  description: string;
  highlight: string;
  style: CouponStyle;
}

export const marketDays: MarketDay[] = [
  { id: "md-1", weekday: "Mercredi", date: "2026-05-13", theme: "Bijoux & parures", description: "Offres exclusives sur les colliers de perles, bagues en bronze et bracelets cauris.", highlight: "-15% sur la collection bijoux", style: { theme: "fuchsia", pattern: "diamonds" } },
  { id: "md-2", weekday: "Vendredi", date: "2026-05-15", theme: "Textiles & wax", description: "Pagnes Kente, tissages Éwé et batiks d'exception.", highlight: "1 mètre offert tous les 5 m achetés", style: { theme: "amber", pattern: "kente" } },
  { id: "md-3", weekday: "Samedi", date: "2026-05-16", theme: "Sculptures & masques", description: "Pièces d'art majeures avec certificat d'authenticité.", highlight: "Livraison offerte dès 30 000 Fcfa", style: { theme: "emerald", pattern: "weave" } },
  { id: "md-4", weekday: "Dimanche", date: "2026-05-17", theme: "Marché des artisans", description: "Toute la communauté IPK en direct du showroom de Lomé.", highlight: "Roue de la fortune offerte à tout achat", style: { theme: "rose", pattern: "rays" } },
];

export interface GiftTicket {
  id: string;
  label: string;
  description: string;
  cta: string;
  style: CouponStyle;
}

export const giftTickets: GiftTicket[] = [
  { id: "tk-1", label: "Ticket Bienvenue", description: "Offert à votre première inscription : -10% sur tout votre premier panier.", cta: "Activer", style: { theme: "terracotta", pattern: "adinkra" } },
  { id: "tk-2", label: "Ticket Anniversaire", description: "Une surprise pour votre mois d'anniversaire.", cta: "Réclamer", style: { theme: "ochre", pattern: "rays" } },
  { id: "tk-3", label: "Ticket Parrainage", description: "Invitez un ami : 5 000 Fcfa pour vous deux.", cta: "Parrainer", style: { theme: "clay", pattern: "bogolan" } },
  { id: "tk-4", label: "Ticket Fidélité", description: "5 commandes = 1 cadeau surprise.", cta: "Ma progression", style: { theme: "bronze", pattern: "adinkra" } },
];
