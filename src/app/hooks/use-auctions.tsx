import { useCallback, useEffect, useState } from "react";
import { auctionLots, type AuctionLot } from "../data/auctions";
import { products } from "../data/mock-data";

const KEY = "ipk_auctions_v1";

type Bid = { amount: number; name: string; at: number };
type Store = { anchor: number; bids: Record<string, Bid[]> };

export type LiveLot = AuctionLot & {
  product: (typeof products)[number] | undefined;
  currentBid: number;
  bidCount: number;
  lastBidder: string | null;
  endsAt: number;
  ended: boolean;
  minNextBid: number;
  bids: Bid[];
};

function readStore(): Store {
  if (typeof window === "undefined") return { anchor: Date.now(), bids: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      if (parsed && typeof parsed.anchor === "number") return parsed;
    }
  } catch {
    /* ignore */
  }
  const fresh: Store = { anchor: Date.now(), bids: {} };
  try {
    localStorage.setItem(KEY, JSON.stringify(fresh));
  } catch {
    /* ignore */
  }
  return fresh;
}

function computeLots(store: Store, now: number): LiveLot[] {
  return auctionLots.map((lot) => {
    const bids = (store.bids[lot.id] ?? []).slice().sort((a, b) => b.amount - a.amount);
    const currentBid = bids.length ? bids[0].amount : lot.startBid;
    const endsAt = store.anchor + lot.durationHours * 3600_000;
    const ended = now >= endsAt;
    return {
      ...lot,
      product: products.find((p) => p.id === lot.productId),
      currentBid,
      bidCount: bids.length,
      lastBidder: bids.length ? bids[0].name : null,
      endsAt,
      ended,
      minNextBid: currentBid + lot.minIncrement,
      bids,
    };
  });
}

export function useAuctions() {
  const [store, setStore] = useState<Store>(() => readStore());
  const [now, setNow] = useState<number>(() => Date.now());

  // Horloge pour les comptes à rebours
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Synchronisation entre onglets
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setStore(readStore());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const placeBid = useCallback(
    (lotId: string, amount: number, name: string): { ok: boolean; error?: string } => {
      const lot = auctionLots.find((l) => l.id === lotId);
      if (!lot) return { ok: false, error: "Lot introuvable" };
      const current = readStore();
      const endsAt = current.anchor + lot.durationHours * 3600_000;
      if (Date.now() >= endsAt) return { ok: false, error: "Cette vente est clôturée" };
      const bids = current.bids[lotId] ?? [];
      const best = bids.length ? Math.max(...bids.map((b) => b.amount)) : lot.startBid;
      const min = bids.length ? best + lot.minIncrement : lot.startBid;
      if (!Number.isFinite(amount) || amount < min) {
        return { ok: false, error: `La mise doit être d'au moins ${min.toLocaleString("fr-FR")} Fcfa` };
      }
      const cleanName = name.trim() || "Enchérisseur anonyme";
      const next: Store = {
        anchor: current.anchor,
        bids: { ...current.bids, [lotId]: [...bids, { amount, name: cleanName, at: Date.now() }] },
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      setStore(next);
      return { ok: true };
    },
    [],
  );

  return { lots: computeLots(store, now), now, placeBid };
}

/** Formatte un temps restant (ms) en chaîne lisible. */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "Vente clôturée";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}j ${h}h ${m}min`;
  if (h > 0) return `${h}h ${m}min ${sec}s`;
  return `${m}min ${sec}s`;
}
