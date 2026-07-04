import { useEffect, useMemo, useState } from "react";
import { products as seedProducts, type Product, type Artisan, artisans as seedArtisans, IMAGES } from "../data/mock-data";

const PRODUCTS_KEY = "ipk:artisan:products:v1";
const SHOPS_KEY = "ipk:artisan:shops:v1";
const USERS_KEY = "ipk:users:v1";
const ADMIN_OVERRIDES_KEY = "ipk:admin:productOverrides:v1";
const ADMIN_REMOVED_KEY = "ipk:admin:productRemoved:v1";
const ADMIN_NEW_KEY = "ipk:admin:newProducts:v1";

interface AdminOverride {
  price?: number; stock?: number; status?: "active" | "draft" | "archived";
  images?: string[]; badges?: string[]; tags?: string[]; niches?: string[];
  name?: string; slug?: string; category?: string;
  story?: string; ancestrality?: string; dimensions?: string; weight?: string;
  materials?: string[]; care?: string;
  origin?: { country: string; region: string; village: string };
  delivery?: { zones: string; delay: string; cost: string };
  norms?: { code: string; name: string; status: "Validé" | "En cours" | "Non applicable" }[];
  isUnique?: boolean; isExclusive?: boolean;
  seo?: { title?: string; description?: string; ogImage?: string; keywords?: string };
  promo?: { percent: number; startsAt?: string; endsAt?: string };
}

function isPromoActive(promo?: { percent: number; startsAt?: string; endsAt?: string }): boolean {
  if (!promo || !promo.percent || promo.percent <= 0) return false;
  const t = Date.now();
  if (promo.startsAt && new Date(promo.startsAt).getTime() > t) return false;
  if (promo.endsAt && new Date(promo.endsAt).getTime() < t) return false;
  return true;
}

interface RawArtisanProduct {
  id: string;
  userId: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  status: "draft" | "published" | "archived";
  promoPercent?: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}
interface RawShop {
  userId: string;
  name: string;
  story?: string;
  region?: string;
  country?: string;
  specialty?: string;
  logo?: string;
  cover?: string;
  acceptsOrders: boolean;
}
interface RawUser {
  id: string;
  fullName?: string;
  country?: string;
  region?: string;
  profilePhoto?: string;
}

function safeRead<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}

function mapArtisanProduct(ap: RawArtisanProduct, shop: RawShop | undefined, user: RawUser | undefined): Product {
  const country = shop?.country || user?.country || "-";
  const region = shop?.region || user?.region || "-";
  const artisanName = shop?.name || user?.fullName || "Artisan IPPOO";
  return {
    id: ap.id,
    name: ap.name,
    slug: ap.slug || ap.id,
    category: ap.category || "Artisanat",
    technique: shop?.specialty || ap.category || "Fait main",
    artisanId: `u-${ap.userId}`,
    groupementId: "",
    origin: { country, region, village: region },
    story: ap.description || "",
    ancestrality: shop?.story || "",
    norms: [],
    materials: [],
    dimensions: "",
    weight: "",
    care: "",
    price: ap.promoPercent ? Math.round(ap.price * (1 - ap.promoPercent / 100)) : ap.price,
    currency: "Fcfa",
    stock: ap.stock,
    isUnique: ap.stock === 1,
    isExclusive: false,
    images: ap.images && ap.images.length > 0 ? ap.images : [IMAGES.craftMarket],
    rating: 0,
    reviewCount: 0,
    badges: ap.promoPercent ? [`-${ap.promoPercent}%`, "Nouveau"] : ["Nouveau"],
    delivery: { zones: shop?.country || "Afrique de l'Ouest", delay: "5-10 jours", cost: "Sur devis" },
    // @ts-expect-error annotation marker
    _artisanShop: { artisanName, shopLogo: shop?.logo, userId: ap.userId, isFromArtisan: true },
  };
}

export function useArtisanShops() {
  const [shops, setShops] = useState<RawShop[]>(() => safeRead(SHOPS_KEY));
  const [users, setUsers] = useState<RawUser[]>(() => safeRead(USERS_KEY));
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SHOPS_KEY) setShops(safeRead(SHOPS_KEY));
      else if (e.key === USERS_KEY) setUsers(safeRead(USERS_KEY));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return { shops, users };
}

function safeReadObj<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) as T; } catch {}
  return fallback;
}

function applyAdminOverrides(p: Product, overrides: Record<string, AdminOverride>): Product {
  const o = overrides[p.id];
  if (!o) return p;
  const basePrice = o.price ?? p.price;
  const promoActive = isPromoActive(o.promo);
  const finalPrice = promoActive ? Math.round(basePrice * (1 - (o.promo!.percent / 100))) : basePrice;
  const baseBadges = o.badges ?? p.badges ?? [];
  const promoBadge = promoActive ? `-${o.promo!.percent}%` : null;
  const mergedBadges = promoBadge && !baseBadges.includes(promoBadge) ? [promoBadge, ...baseBadges] : baseBadges;
  return {
    ...p,
    name: o.name ?? p.name,
    slug: o.slug ?? p.slug,
    category: o.category ?? p.category,
    story: o.story ?? p.story,
    ancestrality: o.ancestrality ?? p.ancestrality,
    dimensions: o.dimensions ?? p.dimensions,
    weight: o.weight ?? p.weight,
    materials: o.materials ?? p.materials,
    care: o.care ?? p.care,
    origin: o.origin ?? p.origin,
    delivery: o.delivery ?? p.delivery,
    norms: o.norms ?? p.norms,
    isUnique: o.isUnique ?? p.isUnique,
    isExclusive: o.isExclusive ?? p.isExclusive,
    price: finalPrice,
    // @ts-expect-error originalPrice is admin-managed extra
    originalPrice: promoActive ? basePrice : (p as any).originalPrice,
    // @ts-expect-error promo is admin-managed extra
    promo: o.promo ?? (p as any).promo,
    stock: o.stock ?? p.stock,
    images: o.images && o.images.length > 0 ? o.images : p.images,
    badges: mergedBadges,
    niches: o.niches ?? p.niches,
    // @ts-expect-error tags is admin-managed extra
    tags: o.tags ?? (p as any).tags ?? [],
    // @ts-expect-error seo is admin-managed extra
    seo: o.seo ?? (p as any).seo,
  };
}

export function useProducts() {
  const [aps, setAps] = useState<RawArtisanProduct[]>(() => safeRead(PRODUCTS_KEY));
  const [adminOverrides, setAdminOverrides] = useState<Record<string, AdminOverride>>(() => safeReadObj(ADMIN_OVERRIDES_KEY, {}));
  const [adminRemoved, setAdminRemoved] = useState<string[]>(() => safeReadObj(ADMIN_REMOVED_KEY, []));
  const [adminCreated, setAdminCreated] = useState<Product[]>(() => safeReadObj(ADMIN_NEW_KEY, []));
  const { shops, users } = useArtisanShops();

  useEffect(() => {
    const reload = () => setAps(safeRead(PRODUCTS_KEY));
    const reloadAdmin = () => {
      setAdminOverrides(safeReadObj(ADMIN_OVERRIDES_KEY, {}));
      setAdminRemoved(safeReadObj(ADMIN_REMOVED_KEY, []));
      setAdminCreated(safeReadObj(ADMIN_NEW_KEY, []));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === PRODUCTS_KEY) reload();
      if (e.key === ADMIN_OVERRIDES_KEY || e.key === ADMIN_REMOVED_KEY || e.key === ADMIN_NEW_KEY) reloadAdmin();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("ipk:artisan:notif", reload);
    window.addEventListener("ipk:admin:products", reloadAdmin);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ipk:artisan:notif", reload);
      window.removeEventListener("ipk:admin:products", reloadAdmin);
    };
  }, []);

  return useMemo(() => {
    const published = aps.filter(p => p.status === "published");
    const mapped = published.map(p => {
      const shop = shops.find(s => s.userId === p.userId);
      const user = users.find(u => u.id === p.userId);
      return mapArtisanProduct(p, shop, user);
    });
    const all = [...adminCreated, ...mapped, ...seedProducts]
      .filter(p => !adminRemoved.includes(p.id))
      .map(p => applyAdminOverrides(p, adminOverrides));
    return all;
  }, [aps, shops, users, adminOverrides, adminRemoved, adminCreated]);
}

export function useArtisans(): Artisan[] {
  const { shops, users } = useArtisanShops();
  return useMemo(() => {
    const fromShops: Artisan[] = shops.map(s => {
      const user = users.find(u => u.id === s.userId);
      return {
        id: `u-${s.userId}`,
        name: s.name || user?.fullName || "Artisan",
        slug: `u-${s.userId}`,
        specialty: s.specialty || "Artisanat",
        region: s.region || user?.region || "-",
        country: s.country || user?.country || "-",
        bio: s.story || "",
        image: s.logo || s.cover || user?.profilePhoto || IMAGES.heroArtisan,
        groupementId: "",
        productsCount: 0,
        rating: 0,
      };
    });
    return [...fromShops, ...seedArtisans];
  }, [shops, users]);
}
