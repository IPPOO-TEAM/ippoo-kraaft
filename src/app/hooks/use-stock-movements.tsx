import { useCallback, useEffect, useState } from "react";

const KEY = "ipk:admin:stockMovements:v1";
const EVENT = "ipk:stock:movement";
const MAX = 1000;

export type MovementReason = "reception" | "sale" | "loss" | "breakage" | "inventory" | "return" | "other";

export const REASON_LABEL: Record<MovementReason, string> = {
  reception: "Réception",
  sale: "Vente",
  loss: "Perte",
  breakage: "Casse",
  inventory: "Inventaire",
  return: "Retour",
  other: "Autre",
};

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  reason: MovementReason;
  note?: string;
  actor: string;
  date: string;
  balanceAfter: number;
}

function safeRead(): StockMovement[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch {}
  return [];
}

function safeWrite(list: StockMovement[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {}
}

export function logStockMovement(m: Omit<StockMovement, "id" | "date">) {
  const entry: StockMovement = {
    id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    ...m,
  };
  const list = safeRead();
  list.unshift(entry);
  safeWrite(list);
  return entry;
}

export function useStockMovements() {
  const [list, setList] = useState<StockMovement[]>(() => safeRead());

  useEffect(() => {
    const refresh = () => setList(safeRead());
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const clear = useCallback(() => { safeWrite([]); setList([]); }, []);

  return { movements: list, clear };
}
