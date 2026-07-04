import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { logAudit } from "./use-admin-audit";
import { promotions as seedPromotions, flashDeals as seedFlashDeals, contests as seedContests, giftTickets as seedTicketTemplates, marketDays as seedMarketDays, wheelPrizes as seedWheelPrizes, type Promotion, type FlashDeal, type Contest, type GiftTicket, type MarketDay, type WheelPrize } from "../data/marketing-data";

const GC_KEY = "ipk:marketing:giftcards:v1";
const PROMOTIONS_KEY = "ipk:marketing:promotions:v1";
const FLASH_KEY = "ipk:marketing:flashdeals:v1";
const FLASH_BROADCAST_KEY = "ipk:marketing:flashBroadcast:v1";
const CONTESTS_KEY = "ipk:marketing:contests:v1";
const TICKETS_KEY = "ipk:marketing:tickets:v1";
const WHEEL_KEY = "ipk:marketing:wheelLastSpin:v1";
const CONTEST_KEY = "ipk:marketing:contestEntries:v1";
const LOYALTY_KEY = "ipk:marketing:loyalty:v1";
const VOTES_KEY = "ipk:marketing:contestVotes:v1";
const BADGES_KEY = "ipk:marketing:badges:v1";
const TICKET_TEMPLATES_KEY = "ipk:marketing:ticketTemplates:v1";
const LOYALTY_USERS_KEY = "ipk:marketing:loyaltyByUser:v1";
const LOYALTY_CONFIG_KEY = "ipk:marketing:loyaltyConfig:v1";
const MARKET_DAYS_KEY = "ipk:marketing:marketDays:v1";
const WHEEL_PRIZES_KEY = "ipk:marketing:wheelPrizes:v1";
const WHEEL_CONFIG_KEY = "ipk:marketing:wheelConfig:v1";
const WHEEL_STATS_KEY = "ipk:marketing:wheelStats:v1";

// Valeurs par défaut (l'admin peut ajuster via updateLoyaltyConfig)
// 1 point par 100 Fcfa dépensés, conversion 1000 points = 5 000 Fcfa
export const POINTS_PER_FCFA = 1 / 100;
export const POINTS_TO_FCFA_RATIO = 5; // 1 point = 5 Fcfa
export const POINTS_REDEEM_MIN = 1000;

export interface LoyaltyConfig {
  perFcfa: number;       // points gagnés par Fcfa dépensé
  toFcfaRatio: number;   // valeur Fcfa d'1 point lors de la conversion
  redeemMin: number;     // seuil minimum de conversion en points
}

export interface UserLoyalty {
  email: string;
  points: number;
  history: LoyaltyTxn[];
}

export interface LoyaltyTxn {
  id: string;
  delta: number;
  reason: string;
  at: string;
}

export type GiftCardDelivery = "digital" | "physical";

export type GiftCardStatus = "active" | "blocked" | "cancelled" | "spent";

export interface GiftCard {
  code: string;
  initialAmount: number;
  remainingAmount: number;
  recipientName?: string;
  recipientEmail?: string;
  recipientAddress?: string;
  message?: string;
  delivery: GiftCardDelivery;
  emailSentAt?: string;
  createdAt: string;
  redeemedAt?: string;
  status?: GiftCardStatus;
  /** Date d'expiration ISO optionnelle */
  expiresAt?: string;
  /** Origine de l'émission */
  issuedBy?: "customer" | "admin";
}

export interface GiftTicketRecord {
  id: string;
  label: string;
  code: string;
  pct?: number;
  amount?: number;
  status: "active" | "used" | "expired" | "cancelled";
  earnedAt: string;
  usedAt?: string;
  /** Date d'expiration ISO (par défaut +60 jours) */
  expiresAt: string;
  /** Restriction produits : ids ou catégories applicables */
  scope?: { categories?: string[]; productIds?: string[] };
  /** Email du client destinataire (optionnel - null = ticket non nominatif) */
  assignedEmail?: string;
  /** Origine de l'émission */
  issuedBy?: "system" | "admin";
  /** Modèle source utilisé (si applicable) */
  templateId?: string;
}

export interface ContestEntry {
  id: string;
  contestId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  /** Soumission éventuelle (URL image ou texte) */
  submission?: string;
  /** Compteur de votes reçus (calculé à la lecture) */
}

export type BadgeKind = "first-entry" | "voter" | "winner" | "top3" | "creator";

export interface UserBadge {
  id: string;
  email: string;
  kind: BadgeKind;
  label: string;
  earnedAt: string;
  contestId?: string;
}

interface Ctx {
  promotions: Promotion[];
  createPromotion: (input: Omit<Promotion, "id">) => Promotion;
  updatePromotion: (id: string, patch: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  togglePromotion: (id: string) => void;
  flashDeals: FlashDeal[];
  createFlashDeal: (input: Omit<FlashDeal, "id">) => FlashDeal;
  updateFlashDeal: (id: string, patch: Partial<FlashDeal>) => void;
  deleteFlashDeal: (id: string) => void;
  endFlashDealNow: (id: string) => void;
  extendFlashDeal: (id: string, hours: number) => void;
  broadcastFlashDeal: (id: string) => void;
  contests: Contest[];
  createContest: (input: Omit<Contest, "id">) => Contest;
  updateContest: (id: string, patch: Partial<Contest>) => void;
  deleteContest: (id: string) => void;
  closeContest: (id: string) => void;
  reopenContest: (id: string) => void;
  /** Modération : supprimer une participation (spam, hors-règles) */
  deleteContestEntry: (entryId: string) => void;
  /** Tirage au sort : choisit aléatoirement parmi les participations et attribue un badge "winner" */
  drawContestWinner: (contestId: string) => { ok: true; entry: ContestEntry } | { ok: false; reason: string };
  /** Attribue manuellement un badge à un email (concours optionnel) */
  awardBadge: (input: { email: string; kind: BadgeKind; label: string; contestId?: string }) => UserBadge;
  giftCards: GiftCard[];
  tickets: GiftTicketRecord[];
  contestEntries: ContestEntry[];
  buyGiftCard: (input: { amount: number; recipientName?: string; recipientEmail?: string; recipientAddress?: string; message?: string; delivery: GiftCardDelivery }) => GiftCard;
  /** Émission manuelle par l'admin (cadeau, geste commercial, compensation) */
  issueGiftCard: (input: { amount: number; recipientName?: string; recipientEmail?: string; recipientAddress?: string; message?: string; delivery: GiftCardDelivery; expiresAt?: string }) => GiftCard;
  /** Recharge le solde d'une carte existante */
  topUpGiftCard: (code: string, amount: number) => { ok: true; balance: number } | { ok: false; reason: string };
  /** Annule définitivement une carte (remboursement, fraude) */
  cancelGiftCard: (code: string) => void;
  /** Bloque/débloque temporairement une carte */
  toggleGiftCardBlock: (code: string) => void;
  /** Supprime une carte (admin uniquement) */
  deleteGiftCard: (code: string) => void;
  sendGiftCardEmail: (code: string) => { ok: true } | { ok: false; reason: string };
  redeemGiftCard: (code: string) => { ok: true; balance: number } | { ok: false; reason: string };
  awardTicket: (input: { label: string; pct?: number; amount?: number; expiresInDays?: number; scope?: GiftTicketRecord["scope"]; assignedEmail?: string; templateId?: string; issuedBy?: "system" | "admin" }) => GiftTicketRecord;
  consumeTicket: (id: string) => void;
  /** Prolonge l'expiration d'un ticket de N jours (depuis la date max(now, expiresAt)) */
  extendTicket: (id: string, days: number) => void;
  /** Annule un ticket (statut "cancelled") */
  cancelTicket: (id: string) => void;
  /** Supprime un ticket (admin) */
  deleteTicket: (id: string) => void;
  /** Modèles éditables de tickets (templates de campagne) */
  ticketTemplates: GiftTicket[];
  createTicketTemplate: (input: Omit<GiftTicket, "id">) => GiftTicket;
  updateTicketTemplate: (id: string, patch: Partial<GiftTicket>) => void;
  deleteTicketTemplate: (id: string) => void;
  enterContest: (input: { contestId: string; name: string; email: string; phone?: string; submission?: string }) => ContestEntry;
  /** Vote pour une entrée. Idempotent par (email, entryId). */
  voteForEntry: (input: { entryId: string; voterEmail: string }) => { ok: true; total: number } | { ok: false; reason: string };
  /** Compteur de votes pour une entrée donnée */
  votesForEntry: (entryId: string) => number;
  /** Vrai si voterEmail a déjà voté pour entryId */
  hasVoted: (entryId: string, voterEmail: string) => boolean;
  /** Classement trié décroissant par votes pour un concours donné */
  rankingFor: (contestId: string) => Array<ContestEntry & { votes: number; rank: number }>;
  /** Badges d'un utilisateur (par email) */
  badgesFor: (email: string) => UserBadge[];
  canSpinWheel: () => boolean;
  /** Enregistre un spin (prizeId optionnel pour les statistiques) */
  recordWheelSpin: (prizeId?: string) => void;
  nextSpinIn: () => number;
  spinsLeftToday: () => number;
  /** Lots de la roue (CRUD admin) */
  wheelPrizes: WheelPrize[];
  createWheelPrize: (input: Omit<WheelPrize, "id">) => WheelPrize;
  updateWheelPrize: (id: string, patch: Partial<WheelPrize>) => void;
  deleteWheelPrize: (id: string) => void;
  /** Configuration de la roue (modifiable par l'admin) */
  wheelConfig: { maxSpinsPerDay: number };
  updateWheelConfig: (patch: Partial<{ maxSpinsPerDay: number }>) => void;
  /** Historique des spins (toutes sessions confondues) */
  wheelStats: Array<{ prizeId: string; at: string; day: string }>;
  resetWheelStats: () => void;
  /** Diffuse une notification globale (toast + native + cross-tab) */
  broadcastPush: (input: { title: string; body: string; url?: string }) => void;
  /** Solde points fidélité courant */
  loyaltyPoints: number;
  /** Historique des transactions points */
  loyaltyHistory: LoyaltyTxn[];
  /** Crédite des points (achat, événement, bonus) */
  earnPoints: (delta: number, reason: string) => void;
  /** Convertit des points en ticket cadeau Fcfa */
  redeemPoints: (points: number) => { ok: true; ticketCode: string; amount: number } | { ok: false; reason: string };
  /** Configuration du programme fidélité (modifiable par l'admin) */
  loyaltyConfig: LoyaltyConfig;
  updateLoyaltyConfig: (patch: Partial<LoyaltyConfig>) => void;
  /** Liste des comptes fidélité (vue admin) */
  loyaltyUsers: UserLoyalty[];
  /** Détails d'un compte par email */
  loyaltyForUser: (email: string) => UserLoyalty;
  /** Crédite/débite manuellement les points d'un client (delta négatif = retrait) */
  adjustUserPoints: (email: string, delta: number, reason: string) => void;
  /** Réinitialise le solde d'un client à zéro */
  resetUserPoints: (email: string) => void;
  /** Jours de marché (CRUD admin) */
  marketDays: MarketDay[];
  createMarketDay: (input: Omit<MarketDay, "id">) => MarketDay;
  updateMarketDay: (id: string, patch: Partial<MarketDay>) => void;
  deleteMarketDay: (id: string) => void;
}

const DEFAULT_MAX_SPINS_PER_DAY = 3;
function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function readSpinState(): { day: string; count: number; lastAt: number } {
  try {
    const raw = localStorage.getItem(WHEEL_KEY);
    if (!raw) return { day: todayKey(), count: 0, lastAt: 0 };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "day" in parsed) return parsed;
    // migration depuis l'ancien format (timestamp brut)
    return { day: todayKey(), count: 0, lastAt: Number(parsed) || 0 };
  } catch { return { day: todayKey(), count: 0, lastAt: 0 }; }
}
function writeSpinState(s: { day: string; count: number; lastAt: number }) {
  try { localStorage.setItem(WHEEL_KEY, JSON.stringify(s)); } catch {}
}

const Ctx = createContext<Ctx | null>(null);

function load<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
function save<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

function genCode(prefix: string) {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString(36).slice(-3).toUpperCase();
  return `${prefix}-${ts}${rnd}`;
}

// Plus de cooldown - quota quotidien de MAX_SPINS_PER_DAY (reset à minuit local).

export function MarketingProvider({ children }: { children: ReactNode }) {
  const [promotions, setPromotions] = useState<Promotion[]>(() => load(PROMOTIONS_KEY, seedPromotions));
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>(() => load(FLASH_KEY, seedFlashDeals));
  const [contests, setContests] = useState<Contest[]>(() => load(CONTESTS_KEY, seedContests));
  const [giftCards, setGiftCards] = useState<GiftCard[]>(() => load(GC_KEY, [] as GiftCard[]));
  const [tickets, setTickets] = useState<GiftTicketRecord[]>(() => load(TICKETS_KEY, [] as GiftTicketRecord[]));
  const [contestEntries, setContestEntries] = useState<ContestEntry[]>(() => load(CONTEST_KEY, [] as ContestEntry[]));
  const [votes, setVotes] = useState<Array<{ entryId: string; voterEmail: string; at: string }>>(() => load(VOTES_KEY, [] as Array<{ entryId: string; voterEmail: string; at: string }>));
  const [badges, setBadges] = useState<UserBadge[]>(() => load(BADGES_KEY, [] as UserBadge[]));
  const [loyalty, setLoyalty] = useState<{ points: number; history: LoyaltyTxn[] }>(() => load(LOYALTY_KEY, { points: 0, history: [] }));
  const [ticketTemplates, setTicketTemplates] = useState<GiftTicket[]>(() => load(TICKET_TEMPLATES_KEY, seedTicketTemplates));
  const [loyaltyByUser, setLoyaltyByUser] = useState<Record<string, { points: number; history: LoyaltyTxn[] }>>(() => load(LOYALTY_USERS_KEY, {} as Record<string, { points: number; history: LoyaltyTxn[] }>));
  const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyConfig>(() => load(LOYALTY_CONFIG_KEY, { perFcfa: POINTS_PER_FCFA, toFcfaRatio: POINTS_TO_FCFA_RATIO, redeemMin: POINTS_REDEEM_MIN }));
  const [marketDays, setMarketDays] = useState<MarketDay[]>(() => load(MARKET_DAYS_KEY, seedMarketDays));
  const [wheelPrizes, setWheelPrizes] = useState<WheelPrize[]>(() => load(WHEEL_PRIZES_KEY, seedWheelPrizes));
  const [wheelConfig, setWheelConfig] = useState<{ maxSpinsPerDay: number }>(() => load(WHEEL_CONFIG_KEY, { maxSpinsPerDay: DEFAULT_MAX_SPINS_PER_DAY }));
  const [wheelStats, setWheelStats] = useState<Array<{ prizeId: string; at: string; day: string }>>(() => load(WHEEL_STATS_KEY, [] as Array<{ prizeId: string; at: string; day: string }>));

  useEffect(() => save(PROMOTIONS_KEY, promotions), [promotions]);
  useEffect(() => save(FLASH_KEY, flashDeals), [flashDeals]);
  useEffect(() => save(CONTESTS_KEY, contests), [contests]);
  useEffect(() => save(GC_KEY, giftCards), [giftCards]);
  useEffect(() => save(TICKETS_KEY, tickets), [tickets]);
  useEffect(() => save(CONTEST_KEY, contestEntries), [contestEntries]);
  useEffect(() => save(VOTES_KEY, votes), [votes]);
  useEffect(() => save(BADGES_KEY, badges), [badges]);
  useEffect(() => save(LOYALTY_KEY, loyalty), [loyalty]);
  useEffect(() => save(TICKET_TEMPLATES_KEY, ticketTemplates), [ticketTemplates]);
  useEffect(() => save(LOYALTY_USERS_KEY, loyaltyByUser), [loyaltyByUser]);
  useEffect(() => save(LOYALTY_CONFIG_KEY, loyaltyConfig), [loyaltyConfig]);
  useEffect(() => save(MARKET_DAYS_KEY, marketDays), [marketDays]);
  useEffect(() => save(WHEEL_PRIZES_KEY, wheelPrizes), [wheelPrizes]);
  useEffect(() => save(WHEEL_CONFIG_KEY, wheelConfig), [wheelConfig]);
  useEffect(() => save(WHEEL_STATS_KEY, wheelStats), [wheelStats]);

  // Expiration auto au montage et chaque heure
  useEffect(() => {
    const expire = () => {
      const now = Date.now();
      setTickets(prev => prev.map(t => t.status === "active" && t.expiresAt && new Date(t.expiresAt).getTime() < now
        ? { ...t, status: "expired" as const } : t));
    };
    expire();
    const id = setInterval(expire, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const createPromotion: Ctx["createPromotion"] = useCallback((input) => {
    const promo: Promotion = { ...input, id: `promo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` };
    setPromotions(prev => [promo, ...prev]);
    logAudit({ actor: "admin", action: "promotion_created", entity: "promo", entityId: promo.id, details: `${promo.code} · ${promo.title}` });
    return promo;
  }, []);

  const updatePromotion: Ctx["updatePromotion"] = useCallback((id, patch) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
    logAudit({ actor: "admin", action: "promotion_updated", entity: "promo", entityId: id, details: Object.keys(patch).join(",") });
  }, []);

  const deletePromotion: Ctx["deletePromotion"] = useCallback((id) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    logAudit({ actor: "admin", action: "promotion_deleted", entity: "promo", entityId: id });
  }, []);

  const togglePromotion: Ctx["togglePromotion"] = useCallback((id) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, disabled: !p.disabled } : p));
    logAudit({ actor: "admin", action: "promotion_toggled", entity: "promo", entityId: id });
  }, []);

  const createFlashDeal: Ctx["createFlashDeal"] = useCallback((input) => {
    const deal: FlashDeal = { ...input, id: `flash-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` };
    setFlashDeals(prev => [deal, ...prev]);
    logAudit({ actor: "admin", action: "flash_created", entity: "promo", entityId: deal.id, details: `${deal.productName} · ${deal.flashPrice} F` });
    return deal;
  }, []);

  const updateFlashDeal: Ctx["updateFlashDeal"] = useCallback((id, patch) => {
    setFlashDeals(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));
    logAudit({ actor: "admin", action: "flash_updated", entity: "promo", entityId: id, details: Object.keys(patch).join(",") });
  }, []);

  const deleteFlashDeal: Ctx["deleteFlashDeal"] = useCallback((id) => {
    setFlashDeals(prev => prev.filter(d => d.id !== id));
    logAudit({ actor: "admin", action: "flash_deleted", entity: "promo", entityId: id });
  }, []);

  const endFlashDealNow: Ctx["endFlashDealNow"] = useCallback((id) => {
    const now = new Date().toISOString();
    setFlashDeals(prev => prev.map(d => d.id === id ? { ...d, endsAt: now } : d));
    logAudit({ actor: "admin", action: "flash_ended", entity: "promo", entityId: id });
  }, []);

  const extendFlashDeal: Ctx["extendFlashDeal"] = useCallback((id, hours) => {
    setFlashDeals(prev => prev.map(d => {
      if (d.id !== id) return d;
      const base = Math.max(Date.now(), new Date(d.endsAt).getTime());
      return { ...d, endsAt: new Date(base + hours * 3600_000).toISOString() };
    }));
    logAudit({ actor: "admin", action: "flash_extended", entity: "promo", entityId: id, details: `+${hours}h` });
  }, []);

  const broadcastFlashDeal: Ctx["broadcastFlashDeal"] = useCallback((id) => {
    try {
      const payload = { id, at: new Date().toISOString() };
      localStorage.setItem(FLASH_BROADCAST_KEY, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent("ipk:flash:broadcast", { detail: payload }));
    } catch {}
    logAudit({ actor: "admin", action: "flash_broadcast", entity: "promo", entityId: id });
  }, []);

  const createContest: Ctx["createContest"] = useCallback((input) => {
    const c: Contest = { ...input, id: `contest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` };
    setContests(prev => [c, ...prev]);
    logAudit({ actor: "admin", action: "contest_created", entity: "promo", entityId: c.id, details: c.title });
    return c;
  }, []);

  const updateContest: Ctx["updateContest"] = useCallback((id, patch) => {
    setContests(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    logAudit({ actor: "admin", action: "contest_updated", entity: "promo", entityId: id, details: Object.keys(patch).join(",") });
  }, []);

  const deleteContest: Ctx["deleteContest"] = useCallback((id) => {
    setContests(prev => prev.filter(c => c.id !== id));
    setContestEntries(prev => prev.filter(e => e.contestId !== id));
    logAudit({ actor: "admin", action: "contest_deleted", entity: "promo", entityId: id });
  }, []);

  const closeContest: Ctx["closeContest"] = useCallback((id) => {
    setContests(prev => prev.map(c => c.id === id ? { ...c, closed: true } : c));
    logAudit({ actor: "admin", action: "contest_closed", entity: "promo", entityId: id });
  }, []);

  const reopenContest: Ctx["reopenContest"] = useCallback((id) => {
    setContests(prev => prev.map(c => c.id === id ? { ...c, closed: false } : c));
    logAudit({ actor: "admin", action: "contest_reopened", entity: "promo", entityId: id });
  }, []);

  const deleteContestEntry: Ctx["deleteContestEntry"] = useCallback((entryId) => {
    setContestEntries(prev => prev.filter(e => e.id !== entryId));
    setVotes(prev => prev.filter(v => v.entryId !== entryId));
    logAudit({ actor: "admin", action: "contest_entry_deleted", entity: "promo", entityId: entryId });
  }, []);

  const awardBadge: Ctx["awardBadge"] = useCallback((input) => {
    const b: UserBadge = {
      id: `badge-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      email: input.email.toLowerCase(),
      kind: input.kind,
      label: input.label,
      earnedAt: new Date().toISOString(),
      contestId: input.contestId,
    };
    setBadges(prev => [b, ...prev]);
    logAudit({ actor: "admin", action: "badge_awarded", entity: "promo", entityId: b.id, details: `${input.email} · ${input.label}` });
    return b;
  }, []);

  const drawContestWinner: Ctx["drawContestWinner"] = useCallback((contestId) => {
    const pool = contestEntries.filter(e => e.contestId === contestId);
    if (pool.length === 0) return { ok: false, reason: "Aucune participation à tirer" };
    const winner = pool[Math.floor(Math.random() * pool.length)];
    const b: UserBadge = {
      id: `badge-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      email: winner.email.toLowerCase(),
      kind: "winner",
      label: "Gagnant·e du concours",
      earnedAt: new Date().toISOString(),
      contestId,
    };
    setBadges(prev => [b, ...prev]);
    logAudit({ actor: "admin", action: "contest_drawn", entity: "promo", entityId: contestId, details: `winner=${winner.email}` });
    return { ok: true, entry: winner };
  }, [contestEntries]);

  const buyGiftCard: Ctx["buyGiftCard"] = useCallback((input) => {
    const card: GiftCard = {
      code: genCode("GC"),
      initialAmount: input.amount,
      remainingAmount: input.amount,
      recipientName: input.recipientName,
      recipientEmail: input.recipientEmail,
      recipientAddress: input.recipientAddress,
      message: input.message,
      delivery: input.delivery,
      createdAt: new Date().toISOString(),
    };
    setGiftCards(prev => [card, ...prev]);
    logAudit({ actor: "system", action: "giftcard_created", entity: "promo", entityId: card.code, details: `${input.amount} Fcfa · ${input.delivery}` });
    return card;
  }, []);

  const issueGiftCard: Ctx["issueGiftCard"] = useCallback((input) => {
    const card: GiftCard = {
      code: genCode("GC"),
      initialAmount: input.amount,
      remainingAmount: input.amount,
      recipientName: input.recipientName,
      recipientEmail: input.recipientEmail,
      recipientAddress: input.recipientAddress,
      message: input.message,
      delivery: input.delivery,
      createdAt: new Date().toISOString(),
      expiresAt: input.expiresAt,
      status: "active",
      issuedBy: "admin",
    };
    setGiftCards(prev => [card, ...prev]);
    logAudit({ actor: "admin", action: "giftcard_issued", entity: "promo", entityId: card.code, details: `${input.amount} Fcfa → ${input.recipientEmail || input.recipientName || "anonyme"}` });
    return card;
  }, []);

  const topUpGiftCard: Ctx["topUpGiftCard"] = useCallback((code, amount) => {
    if (amount <= 0) return { ok: false, reason: "Montant invalide" };
    let balance = 0;
    let found = false;
    setGiftCards(prev => prev.map(c => {
      if (c.code !== code) return c;
      found = true;
      balance = c.remainingAmount + amount;
      return { ...c, remainingAmount: balance, initialAmount: c.initialAmount + amount, status: c.status === "spent" ? "active" : (c.status ?? "active") };
    }));
    if (!found) return { ok: false, reason: "Carte introuvable" };
    logAudit({ actor: "admin", action: "giftcard_topup", entity: "promo", entityId: code, details: `+${amount} Fcfa` });
    return { ok: true, balance };
  }, []);

  const cancelGiftCard: Ctx["cancelGiftCard"] = useCallback((code) => {
    setGiftCards(prev => prev.map(c => c.code === code ? { ...c, status: "cancelled", remainingAmount: 0 } : c));
    logAudit({ actor: "admin", action: "giftcard_cancelled", entity: "promo", entityId: code });
  }, []);

  const toggleGiftCardBlock: Ctx["toggleGiftCardBlock"] = useCallback((code) => {
    setGiftCards(prev => prev.map(c => {
      if (c.code !== code) return c;
      const next: GiftCardStatus = c.status === "blocked" ? "active" : "blocked";
      return { ...c, status: next };
    }));
    logAudit({ actor: "admin", action: "giftcard_toggle_block", entity: "promo", entityId: code });
  }, []);

  const deleteGiftCard: Ctx["deleteGiftCard"] = useCallback((code) => {
    setGiftCards(prev => prev.filter(c => c.code !== code));
    logAudit({ actor: "admin", action: "giftcard_deleted", entity: "promo", entityId: code });
  }, []);

  const sendGiftCardEmail: Ctx["sendGiftCardEmail"] = useCallback((code) => {
    const card = load<GiftCard[]>(GC_KEY, []).find(c => c.code === code);
    if (!card) return { ok: false, reason: "Carte introuvable" };
    if (!card.recipientEmail) return { ok: false, reason: "Aucun email destinataire" };
    // Mock - en prod : POST /api/giftcards/:code/email
    const sentAt = new Date().toISOString();
    setGiftCards(prev => prev.map(c => c.code === code ? { ...c, emailSentAt: sentAt } : c));
    logAudit({ actor: "system", action: "giftcard_email_sent", entity: "promo", entityId: code, details: card.recipientEmail });
    return { ok: true };
  }, []);

  const redeemGiftCard: Ctx["redeemGiftCard"] = useCallback((code) => {
    const list = load<GiftCard[]>(GC_KEY, []);
    const card = list.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!card) return { ok: false, reason: "Code introuvable" };
    if (card.status === "blocked") return { ok: false, reason: "Carte bloquée" };
    if (card.status === "cancelled") return { ok: false, reason: "Carte annulée" };
    if (card.expiresAt && new Date(card.expiresAt).getTime() < Date.now()) return { ok: false, reason: "Carte expirée" };
    if (card.remainingAmount <= 0) return { ok: false, reason: "Carte déjà utilisée" };
    return { ok: true, balance: card.remainingAmount };
  }, []);

  const awardTicket: Ctx["awardTicket"] = useCallback((input) => {
    const days = input.expiresInDays ?? 60;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const issuedBy = input.issuedBy ?? "system";
    const t: GiftTicketRecord = {
      id: `tk-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      label: input.label,
      code: genCode("TKT"),
      pct: input.pct,
      amount: input.amount,
      status: "active",
      earnedAt: new Date().toISOString(),
      expiresAt,
      scope: input.scope,
      assignedEmail: input.assignedEmail?.toLowerCase(),
      issuedBy,
      templateId: input.templateId,
    };
    setTickets(prev => [t, ...prev]);
    logAudit({ actor: issuedBy === "admin" ? "admin" : "system", action: "ticket_awarded", entity: "promo", entityId: t.code, details: `${input.label}${input.assignedEmail ? " · " + input.assignedEmail : ""} · expire ${expiresAt.slice(0, 10)}` });
    return t;
  }, []);

  const consumeTicket: Ctx["consumeTicket"] = useCallback((id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "used", usedAt: new Date().toISOString() } : t));
  }, []);

  const extendTicket: Ctx["extendTicket"] = useCallback((id, days) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== id) return t;
      const base = Math.max(Date.now(), new Date(t.expiresAt).getTime());
      const next = new Date(base + days * 24 * 60 * 60 * 1000).toISOString();
      const status = t.status === "expired" ? "active" : t.status;
      return { ...t, expiresAt: next, status };
    }));
    logAudit({ actor: "admin", action: "ticket_extended", entity: "promo", entityId: id, details: `+${days}j` });
  }, []);

  const cancelTicket: Ctx["cancelTicket"] = useCallback((id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "cancelled" } : t));
    logAudit({ actor: "admin", action: "ticket_cancelled", entity: "promo", entityId: id });
  }, []);

  const deleteTicket: Ctx["deleteTicket"] = useCallback((id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    logAudit({ actor: "admin", action: "ticket_deleted", entity: "promo", entityId: id });
  }, []);

  const createTicketTemplate: Ctx["createTicketTemplate"] = useCallback((input) => {
    const tpl: GiftTicket = { ...input, id: `tk-tpl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` };
    setTicketTemplates(prev => [tpl, ...prev]);
    logAudit({ actor: "admin", action: "ticket_template_created", entity: "promo", entityId: tpl.id, details: tpl.label });
    return tpl;
  }, []);

  const updateTicketTemplate: Ctx["updateTicketTemplate"] = useCallback((id, patch) => {
    setTicketTemplates(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    logAudit({ actor: "admin", action: "ticket_template_updated", entity: "promo", entityId: id, details: Object.keys(patch).join(",") });
  }, []);

  const deleteTicketTemplate: Ctx["deleteTicketTemplate"] = useCallback((id) => {
    setTicketTemplates(prev => prev.filter(t => t.id !== id));
    logAudit({ actor: "admin", action: "ticket_template_deleted", entity: "promo", entityId: id });
  }, []);

  const grantBadge = useCallback((email: string, kind: BadgeKind, label: string, contestId?: string) => {
    setBadges(prev => {
      if (prev.some(b => b.email.toLowerCase() === email.toLowerCase() && b.kind === kind && b.contestId === contestId)) return prev;
      const b: UserBadge = { id: `bd-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, email, kind, label, contestId, earnedAt: new Date().toISOString() };
      logAudit({ actor: email, action: "badge_earned", entity: "promo", entityId: b.id, details: `${kind} · ${label}` });
      return [b, ...prev];
    });
  }, []);

  const enterContest: Ctx["enterContest"] = useCallback((input) => {
    const entry: ContestEntry = {
      id: `ce-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    setContestEntries(prev => [entry, ...prev]);
    logAudit({ actor: input.email, action: "contest_entry", entity: "promo", entityId: input.contestId, details: input.name });
    grantBadge(input.email, "first-entry", "Premier pas", input.contestId);
    if (input.submission) grantBadge(input.email, "creator", "Créateur", input.contestId);
    return entry;
  }, [grantBadge]);

  const voteForEntry: Ctx["voteForEntry"] = useCallback(({ entryId, voterEmail }) => {
    if (!voterEmail.includes("@")) return { ok: false, reason: "Email invalide" };
    const exists = votes.some(v => v.entryId === entryId && v.voterEmail.toLowerCase() === voterEmail.toLowerCase());
    if (exists) return { ok: false, reason: "Vous avez déjà voté pour cette entrée" };
    setVotes(prev => [{ entryId, voterEmail, at: new Date().toISOString() }, ...prev]);
    grantBadge(voterEmail, "voter", "Votant engagé");
    const total = votes.filter(v => v.entryId === entryId).length + 1;
    logAudit({ actor: voterEmail, action: "contest_vote", entity: "promo", entityId: entryId });
    return { ok: true, total };
  }, [votes, grantBadge]);

  const votesForEntry: Ctx["votesForEntry"] = useCallback((entryId) => votes.filter(v => v.entryId === entryId).length, [votes]);
  const hasVoted: Ctx["hasVoted"] = useCallback((entryId, voterEmail) => votes.some(v => v.entryId === entryId && v.voterEmail.toLowerCase() === voterEmail.toLowerCase()), [votes]);

  const rankingFor: Ctx["rankingFor"] = useCallback((contestId) => {
    const list = contestEntries
      .filter(e => e.contestId === contestId)
      .map(e => ({ ...e, votes: votes.filter(v => v.entryId === e.id).length }))
      .sort((a, b) => b.votes - a.votes || a.createdAt.localeCompare(b.createdAt));
    return list.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [contestEntries, votes]);

  const badgesFor: Ctx["badgesFor"] = useCallback((email) => badges.filter(b => b.email.toLowerCase() === email.toLowerCase()), [badges]);

  const spinsLeftToday = useCallback(() => {
    const s = readSpinState();
    if (s.day !== todayKey()) return wheelConfig.maxSpinsPerDay;
    return Math.max(0, wheelConfig.maxSpinsPerDay - s.count);
  }, [wheelConfig.maxSpinsPerDay]);
  const canSpinWheel = useCallback(() => spinsLeftToday() > 0, [spinsLeftToday]);
  const recordWheelSpin: Ctx["recordWheelSpin"] = useCallback((prizeId) => {
    const s = readSpinState();
    const today = todayKey();
    const next = s.day === today
      ? { day: today, count: s.count + 1, lastAt: Date.now() }
      : { day: today, count: 1, lastAt: Date.now() };
    writeSpinState(next);
    if (prizeId) {
      setWheelStats(prev => [{ prizeId, at: new Date().toISOString(), day: today }, ...prev].slice(0, 1000));
    }
  }, []);

  const createWheelPrize: Ctx["createWheelPrize"] = useCallback((input) => {
    const p: WheelPrize = { ...input, id: `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` };
    setWheelPrizes(prev => [...prev, p]);
    logAudit({ actor: "admin", action: "wheel_prize_created", entity: "promo", entityId: p.id, details: `${p.label} · poids ${p.weight}` });
    return p;
  }, []);

  const updateWheelPrize: Ctx["updateWheelPrize"] = useCallback((id, patch) => {
    setWheelPrizes(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
    logAudit({ actor: "admin", action: "wheel_prize_updated", entity: "promo", entityId: id, details: Object.keys(patch).join(",") });
  }, []);

  const deleteWheelPrize: Ctx["deleteWheelPrize"] = useCallback((id) => {
    setWheelPrizes(prev => prev.filter(p => p.id !== id));
    logAudit({ actor: "admin", action: "wheel_prize_deleted", entity: "promo", entityId: id });
  }, []);

  const updateWheelConfig: Ctx["updateWheelConfig"] = useCallback((patch) => {
    setWheelConfig(prev => ({ ...prev, ...patch }));
    logAudit({ actor: "admin", action: "wheel_config_updated", entity: "promo", entityId: "wheel", details: Object.entries(patch).map(([k, v]) => `${k}=${v}`).join(",") });
  }, []);

  const broadcastPush: Ctx["broadcastPush"] = useCallback((input) => {
    try {
      const payload = { ...input, at: new Date().toISOString() };
      localStorage.setItem("ipk:marketing:broadcast:v1", JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent("ipk:marketing:broadcast", { detail: payload }));
    } catch {}
    logAudit({ actor: "admin", action: "marketing_broadcast", entity: "promo", entityId: "broadcast", details: input.title });
  }, []);

  const resetWheelStats: Ctx["resetWheelStats"] = useCallback(() => {
    setWheelStats([]);
    logAudit({ actor: "admin", action: "wheel_stats_reset", entity: "promo", entityId: "wheel" });
  }, []);
  const nextSpinIn = useCallback(() => {
    if (spinsLeftToday() > 0) return 0;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return Math.max(0, tomorrow.getTime() - Date.now());
  }, [spinsLeftToday]);

  const earnPoints: Ctx["earnPoints"] = useCallback((delta, reason) => {
    if (delta <= 0) return;
    const txn: LoyaltyTxn = { id: `lp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, delta, reason, at: new Date().toISOString() };
    setLoyalty(prev => ({ points: prev.points + delta, history: [txn, ...prev.history].slice(0, 100) }));
    logAudit({ actor: "system", action: "loyalty_earned", entity: "promo", entityId: txn.id, details: `+${delta} pts · ${reason}` });
  }, []);

  const redeemPoints: Ctx["redeemPoints"] = useCallback((points) => {
    if (points < loyaltyConfig.redeemMin) return { ok: false, reason: `Minimum ${loyaltyConfig.redeemMin} points` };
    if (points > loyalty.points) return { ok: false, reason: "Solde insuffisant" };
    const amount = points * loyaltyConfig.toFcfaRatio;
    const ticket = awardTicket({ label: `Fidélité - ${points} pts`, amount });
    const txn: LoyaltyTxn = { id: `lp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, delta: -points, reason: `Conversion ticket ${ticket.code}`, at: new Date().toISOString() };
    setLoyalty(prev => ({ points: prev.points - points, history: [txn, ...prev.history].slice(0, 100) }));
    logAudit({ actor: "system", action: "loyalty_redeemed", entity: "promo", entityId: ticket.code, details: `-${points} pts → ${amount} Fcfa` });
    return { ok: true, ticketCode: ticket.code, amount };
  }, [loyalty.points, awardTicket, loyaltyConfig]);

  const updateLoyaltyConfig: Ctx["updateLoyaltyConfig"] = useCallback((patch) => {
    setLoyaltyConfig(prev => ({ ...prev, ...patch }));
    logAudit({ actor: "admin", action: "loyalty_config_updated", entity: "promo", entityId: "loyalty", details: Object.entries(patch).map(([k, v]) => `${k}=${v}`).join(",") });
  }, []);

  const adjustUserPoints: Ctx["adjustUserPoints"] = useCallback((email, delta, reason) => {
    if (!email.includes("@")) return;
    const key = email.toLowerCase();
    setLoyaltyByUser(prev => {
      const current = prev[key] || { points: 0, history: [] };
      const nextPoints = Math.max(0, current.points + delta);
      const txn: LoyaltyTxn = { id: `lp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, delta, reason, at: new Date().toISOString() };
      return { ...prev, [key]: { points: nextPoints, history: [txn, ...current.history].slice(0, 100) } };
    });
    logAudit({ actor: "admin", action: delta >= 0 ? "loyalty_user_credited" : "loyalty_user_debited", entity: "promo", entityId: key, details: `${delta > 0 ? "+" : ""}${delta} pts · ${reason}` });
  }, []);

  const resetUserPoints: Ctx["resetUserPoints"] = useCallback((email) => {
    const key = email.toLowerCase();
    setLoyaltyByUser(prev => ({ ...prev, [key]: { points: 0, history: [{ id: `lp-${Date.now()}`, delta: 0, reason: "Réinitialisation admin", at: new Date().toISOString() }] } }));
    logAudit({ actor: "admin", action: "loyalty_user_reset", entity: "promo", entityId: key });
  }, []);

  const loyaltyUsers = useMemo<UserLoyalty[]>(() => Object.entries(loyaltyByUser).map(([email, v]) => ({ email, points: v.points, history: v.history })).sort((a, b) => b.points - a.points), [loyaltyByUser]);
  const loyaltyForUser: Ctx["loyaltyForUser"] = useCallback((email) => {
    const key = email.toLowerCase();
    const v = loyaltyByUser[key] || { points: 0, history: [] };
    return { email: key, points: v.points, history: v.history };
  }, [loyaltyByUser]);

  // Bridge audit → points : 1 point / 100 Fcfa quand un payment_confirmed est émis
  useEffect(() => {
    const onAudit = (e: Event) => {
      const detail = (e as CustomEvent).detail as { action?: string; details?: string } | undefined;
      if (!detail || detail.action !== "payment_confirmed") return;
      // details format: "tx=X · R-2026-1234"
      const m = /(\d{3,})\s*Fcfa/i.exec(detail.details || "");
      if (m) {
        const fcfa = Number(m[1]);
        if (fcfa > 0) earnPoints(Math.floor(fcfa * loyaltyConfig.perFcfa), `Achat ${fcfa} Fcfa`);
      }
    };
    window.addEventListener("ipk:audit", onAudit);
    return () => window.removeEventListener("ipk:audit", onAudit);
  }, [earnPoints, loyaltyConfig.perFcfa]);

  const createMarketDay: Ctx["createMarketDay"] = useCallback((input) => {
    const m: MarketDay = { ...input, id: `md-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` };
    setMarketDays(prev => [...prev, m].sort((a, b) => a.date.localeCompare(b.date)));
    logAudit({ actor: "admin", action: "marketday_created", entity: "promo", entityId: m.id, details: `${m.weekday} ${m.date} · ${m.theme}` });
    return m;
  }, []);

  const updateMarketDay: Ctx["updateMarketDay"] = useCallback((id, patch) => {
    setMarketDays(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m).sort((a, b) => a.date.localeCompare(b.date)));
    logAudit({ actor: "admin", action: "marketday_updated", entity: "promo", entityId: id, details: Object.keys(patch).join(",") });
  }, []);

  const deleteMarketDay: Ctx["deleteMarketDay"] = useCallback((id) => {
    setMarketDays(prev => prev.filter(m => m.id !== id));
    logAudit({ actor: "admin", action: "marketday_deleted", entity: "promo", entityId: id });
  }, []);

  const value = useMemo<Ctx>(() => ({
    promotions, createPromotion, updatePromotion, deletePromotion, togglePromotion,
    flashDeals, createFlashDeal, updateFlashDeal, deleteFlashDeal, endFlashDealNow, extendFlashDeal, broadcastFlashDeal,
    contests, createContest, updateContest, deleteContest, closeContest, reopenContest, deleteContestEntry, drawContestWinner, awardBadge,
    giftCards, tickets, contestEntries,
    buyGiftCard, issueGiftCard, topUpGiftCard, cancelGiftCard, toggleGiftCardBlock, deleteGiftCard, sendGiftCardEmail, redeemGiftCard, awardTicket, consumeTicket, extendTicket, cancelTicket, deleteTicket, ticketTemplates, createTicketTemplate, updateTicketTemplate, deleteTicketTemplate, enterContest,
    voteForEntry, votesForEntry, hasVoted, rankingFor, badgesFor,
    canSpinWheel, recordWheelSpin, nextSpinIn, spinsLeftToday,
    wheelPrizes, createWheelPrize, updateWheelPrize, deleteWheelPrize, wheelConfig, updateWheelConfig, wheelStats, resetWheelStats, broadcastPush,
    loyaltyPoints: loyalty.points, loyaltyHistory: loyalty.history, earnPoints, redeemPoints,
    loyaltyConfig, updateLoyaltyConfig, loyaltyUsers, loyaltyForUser, adjustUserPoints, resetUserPoints,
    marketDays, createMarketDay, updateMarketDay, deleteMarketDay,
  }), [promotions, createPromotion, updatePromotion, deletePromotion, togglePromotion, flashDeals, createFlashDeal, updateFlashDeal, deleteFlashDeal, endFlashDealNow, extendFlashDeal, broadcastFlashDeal, contests, createContest, updateContest, deleteContest, closeContest, reopenContest, deleteContestEntry, drawContestWinner, awardBadge, giftCards, tickets, contestEntries, buyGiftCard, issueGiftCard, topUpGiftCard, cancelGiftCard, toggleGiftCardBlock, deleteGiftCard, sendGiftCardEmail, redeemGiftCard, awardTicket, consumeTicket, extendTicket, cancelTicket, deleteTicket, ticketTemplates, createTicketTemplate, updateTicketTemplate, deleteTicketTemplate, enterContest, voteForEntry, votesForEntry, hasVoted, rankingFor, badgesFor, canSpinWheel, recordWheelSpin, nextSpinIn, spinsLeftToday, loyalty, earnPoints, redeemPoints, loyaltyConfig, updateLoyaltyConfig, loyaltyUsers, loyaltyForUser, adjustUserPoints, resetUserPoints, marketDays, createMarketDay, updateMarketDay, deleteMarketDay, wheelPrizes, createWheelPrize, updateWheelPrize, deleteWheelPrize, wheelConfig, updateWheelConfig, wheelStats, resetWheelStats, broadcastPush]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMarketing(): Ctx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMarketing must be used within MarketingProvider");
  return c;
}
