import { useEffect, useState } from "react";

interface OrderLike {
  productId?: string;
  status?: string;
  customer?: { email?: string };
  email?: string;
  items?: { productId: string }[];
}

const PAYMENTS_KEY = "ipk:payments:orders:v1";
const ADMIN_ORDERS_KEY = "ipk:admin:orders:v1";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) as T; } catch {}
  return fallback;
}

export function hasUserPurchased(productId: string, email: string | undefined): boolean {
  if (!email) return false;
  const target = email.trim().toLowerCase();
  if (!target) return false;

  const paid = readJSON<OrderLike[]>(PAYMENTS_KEY, []);
  for (const o of paid) {
    if (o.status !== "succeeded" && o.status !== "refunded") continue;
    const cEmail = o.customer?.email?.toLowerCase();
    if (cEmail !== target) continue;
    if (o.items?.some(it => it.productId === productId)) return true;
  }

  const admin = readJSON<OrderLike[]>(ADMIN_ORDERS_KEY, []);
  for (const o of admin) {
    if (o.status === "cancelled" || o.status === "pending") continue;
    if ((o.email || "").toLowerCase() !== target) continue;
    if (o.productId === productId) return true;
  }

  return false;
}

export function usePurchaseCheck(productId: string, email: string | undefined): boolean {
  const [ok, setOk] = useState<boolean>(() => hasUserPurchased(productId, email));
  useEffect(() => {
    setOk(hasUserPurchased(productId, email));
    const reload = () => setOk(hasUserPurchased(productId, email));
    const onStorage = (e: StorageEvent) => { if (e.key === PAYMENTS_KEY || e.key === ADMIN_ORDERS_KEY) reload(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [productId, email]);
  return ok;
}
