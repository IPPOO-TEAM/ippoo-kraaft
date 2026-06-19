import { useMemo } from "react";
import { useMarketing } from "./use-marketing";
import { useUser } from "./use-user";

export type TierId = "bronze" | "silver" | "gold" | "platinum";

export interface Tier {
  id: TierId;
  label: string;
  minPoints: number;
  color: string;
  bg: string;
  perks: { icon: string; label: string }[];
  discountPct: number;
  freeShippingThreshold: number; // Fcfa, 0 = always free
  earlyAccessHours: number;
}

export const TIERS: Tier[] = [
  {
    id: "bronze",
    label: "Bronze",
    minPoints: 0,
    color: "#B45309",
    bg: "linear-gradient(135deg,#92400E,#B45309)",
    perks: [
      { icon: "Coins", label: "1 pt par 100 Fcfa dépensé" },
      { icon: "Star", label: "+50 pts par avis vérifié" },
      { icon: "Gift", label: "Roue cadeau hebdomadaire" },
    ],
    discountPct: 0,
    freeShippingThreshold: 100000,
    earlyAccessHours: 0,
  },
  {
    id: "silver",
    label: "Argent",
    minPoints: 1000,
    color: "#475569",
    bg: "linear-gradient(135deg,#64748B,#94A3B8)",
    perks: [
      { icon: "Truck", label: "Livraison offerte dès 75 000 Fcfa" },
      { icon: "Percent", label: "-3 % sur toutes les commandes" },
      { icon: "Clock", label: "Accès anticipé 6 h aux exclusivités" },
    ],
    discountPct: 3,
    freeShippingThreshold: 75000,
    earlyAccessHours: 6,
  },
  {
    id: "gold",
    label: "Or",
    minPoints: 5000,
    color: "#B45309",
    bg: "linear-gradient(135deg,#D97706,#FCD34D)",
    perks: [
      { icon: "Truck", label: "Livraison offerte dès 50 000 Fcfa" },
      { icon: "Percent", label: "-7 % sur toutes les commandes" },
      { icon: "Clock", label: "Accès anticipé 24 h aux exclusivités" },
      { icon: "Sparkles", label: "Cadeau d'anniversaire" },
    ],
    discountPct: 7,
    freeShippingThreshold: 50000,
    earlyAccessHours: 24,
  },
  {
    id: "platinum",
    label: "Platine",
    minPoints: 15000,
    color: "#0F172A",
    bg: "linear-gradient(135deg,#0F172A,#475569)",
    perks: [
      { icon: "Truck", label: "Livraison offerte sans minimum" },
      { icon: "Percent", label: "-12 % sur toutes les commandes" },
      { icon: "Clock", label: "Accès anticipé 72 h aux exclusivités" },
      { icon: "Crown", label: "Conciergerie dédiée par e-mail" },
    ],
    discountPct: 12,
    freeShippingThreshold: 0,
    earlyAccessHours: 72,
  },
];

export function tierForPoints(points: number): Tier {
  let current = TIERS[0];
  for (const t of TIERS) if (points >= t.minPoints) current = t;
  return current;
}

export function nextTier(current: Tier): Tier | null {
  const idx = TIERS.findIndex(t => t.id === current.id);
  return idx >= 0 && idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

const REFERRAL_LEDGER_KEY = "ipk:loyalty:referrals:v1";

interface ReferralRecord { code: string; redeemedBy: string[]; }
interface ReferralLedger { byOwner: Record<string, ReferralRecord>; byCode: Record<string, string>; }

function readLedger(): ReferralLedger {
  if (typeof window === "undefined") return { byOwner: {}, byCode: {} };
  try { const raw = localStorage.getItem(REFERRAL_LEDGER_KEY); if (raw) return JSON.parse(raw); } catch {}
  return { byOwner: {}, byCode: {} };
}

function writeLedger(l: ReferralLedger) {
  try { localStorage.setItem(REFERRAL_LEDGER_KEY, JSON.stringify(l)); } catch {}
}

function deriveCode(email: string): string {
  const seed = email.toLowerCase().replace(/[^a-z0-9]/g, "");
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const tail = hash.toString(36).toUpperCase().slice(0, 4).padStart(4, "X");
  const prefix = (seed.slice(0, 4) || "IPK").toUpperCase();
  return `${prefix}-${tail}`;
}

export function ensureReferralCode(email: string): string {
  if (!email) return "";
  const key = email.toLowerCase();
  const ledger = readLedger();
  if (ledger.byOwner[key]?.code) return ledger.byOwner[key].code;
  const code = deriveCode(key);
  ledger.byOwner[key] = { code, redeemedBy: [] };
  ledger.byCode[code] = key;
  writeLedger(ledger);
  return code;
}

export interface ReferralRedeemResult { ok: boolean; ownerEmail?: string; reason?: string; }

export function redeemReferralCode(code: string, redeemerEmail: string): ReferralRedeemResult {
  if (!code || !redeemerEmail) return { ok: false, reason: "Données manquantes" };
  const c = code.trim().toUpperCase();
  const r = redeemerEmail.toLowerCase();
  const ledger = readLedger();
  const owner = ledger.byCode[c];
  if (!owner) return { ok: false, reason: "Code de parrainage introuvable" };
  if (owner === r) return { ok: false, reason: "Vous ne pouvez pas utiliser votre propre code" };
  const rec = ledger.byOwner[owner];
  if (rec.redeemedBy.includes(r)) return { ok: false, reason: "Code déjà utilisé pour ce compte" };
  rec.redeemedBy.push(r);
  writeLedger(ledger);
  return { ok: true, ownerEmail: owner };
}

export function referralStats(email: string): { code: string; count: number; redeemers: string[] } {
  const key = email.toLowerCase();
  const ledger = readLedger();
  const rec = ledger.byOwner[key];
  if (!rec) return { code: ensureReferralCode(key), count: 0, redeemers: [] };
  return { code: rec.code, count: rec.redeemedBy.length, redeemers: rec.redeemedBy };
}

export const REFERRAL_BONUS_OWNER = 500;
export const REFERRAL_BONUS_REDEEMER = 200;
export const REVIEW_BONUS_POINTS = 50;

export function useLoyaltyTier() {
  const { user } = useUser();
  const { loyaltyForUser } = useMarketing();
  return useMemo(() => {
    if (!user?.email) return { points: 0, tier: TIERS[0], next: nextTier(TIERS[0]), progress: 0, code: "" };
    const u = loyaltyForUser(user.email);
    const tier = tierForPoints(u.points);
    const nxt = nextTier(tier);
    const progress = nxt ? Math.min(1, (u.points - tier.minPoints) / (nxt.minPoints - tier.minPoints)) : 1;
    const code = ensureReferralCode(user.email);
    return { points: u.points, tier, next: nxt, progress, code };
  }, [user?.email, loyaltyForUser]);
}
