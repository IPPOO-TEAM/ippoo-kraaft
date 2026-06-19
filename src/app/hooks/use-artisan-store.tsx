import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "./use-user";

const SHOPS_KEY = "ipk:artisan:shops:v1";
const PRODUCTS_KEY = "ipk:artisan:products:v1";
const ORDERS_KEY = "ipk:artisan:orders:v1";
const NOTIFS_KEY = "ipk:artisan:notifs:v1";

export interface ArtisanShop {
  userId: string;
  name: string;
  tagline: string;
  story: string;
  region: string;
  country: string;
  specialty: string;
  niches?: string[];
  logo?: string;
  cover?: string;
  socials: { website?: string; instagram?: string; facebook?: string; whatsapp?: string };
  acceptsOrders: boolean;
  updatedAt: string;
}

export interface ArtisanProductVariant { name: string; price: number; stock: number }
export interface ArtisanProduct {
  id: string;
  userId: string;
  name: string;
  slug: string;
  category: string;
  niches?: string[];
  description: string;
  price: number;
  stock: number;
  images: string[];
  variants: ArtisanProductVariant[];
  status: "draft" | "published" | "archived";
  promoPercent?: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled" | "refunded";
export interface ArtisanOrder {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  history: { at: string; status: OrderStatus; note?: string }[];
}

export interface ArtisanNotification {
  id: string;
  userId: string;
  kind: "order" | "stock" | "message" | "review" | "system";
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

function load<T>(key: string): T[] { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } }
function save<T>(key: string, list: T[]) { try { localStorage.setItem(key, JSON.stringify(list)); } catch {} }

function emit(detail: ArtisanNotification) {
  window.dispatchEvent(new CustomEvent("ipk:artisan:notif", { detail }));
}

export function useArtisanStore() {
  const { user } = useUser();
  const userId = user?.id || "";
  const [shops, setShops] = useState<ArtisanShop[]>(() => load(SHOPS_KEY));
  const [products, setProducts] = useState<ArtisanProduct[]>(() => load(PRODUCTS_KEY));
  const [orders, setOrders] = useState<ArtisanOrder[]>(() => load(ORDERS_KEY));
  const [notifications, setNotifications] = useState<ArtisanNotification[]>(() => load(NOTIFS_KEY));

  useEffect(() => save(SHOPS_KEY, shops), [shops]);
  useEffect(() => save(PRODUCTS_KEY, products), [products]);
  useEffect(() => save(ORDERS_KEY, orders), [orders]);
  useEffect(() => save(NOTIFS_KEY, notifications), [notifications]);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SHOPS_KEY) setShops(load(SHOPS_KEY));
      else if (e.key === PRODUCTS_KEY) setProducts(load(PRODUCTS_KEY));
      else if (e.key === ORDERS_KEY) setOrders(load(ORDERS_KEY));
      else if (e.key === NOTIFS_KEY) setNotifications(load(NOTIFS_KEY));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const myShop = useMemo(() => shops.find(s => s.userId === userId) || null, [shops, userId]);
  const myProducts = useMemo(() => products.filter(p => p.userId === userId), [products, userId]);
  const myOrders = useMemo(() => orders.filter(o => o.userId === userId), [orders, userId]);
  const myNotifications = useMemo(() => notifications.filter(n => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [notifications, userId]);

  const addNotification = useCallback((n: Omit<ArtisanNotification, "id" | "userId" | "createdAt" | "read">) => {
    if (!userId) return;
    const entry: ArtisanNotification = { id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, userId, createdAt: new Date().toISOString(), read: false, ...n };
    setNotifications(prev => [entry, ...prev]);
    emit(entry);
  }, [userId]);

  const upsertShop = useCallback((patch: Partial<ArtisanShop>) => {
    if (!userId) return;
    setShops(prev => {
      const existing = prev.find(s => s.userId === userId);
      const base: ArtisanShop = existing || {
        userId, name: user?.fullName || "Ma boutique", tagline: "", story: "", region: "", country: "",
        specialty: "", socials: {}, acceptsOrders: true, updatedAt: new Date().toISOString(),
      };
      const next = { ...base, ...patch, userId, updatedAt: new Date().toISOString() };
      const others = prev.filter(s => s.userId !== userId);
      return [...others, next];
    });
  }, [user, userId]);

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const createProduct = useCallback((p: Omit<ArtisanProduct, "id" | "userId" | "createdAt" | "updatedAt" | "views" | "slug">) => {
    if (!userId) return;
    const id = `ap-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const now = new Date().toISOString();
    const product: ArtisanProduct = { id, userId, slug: slugify(p.name) || id, views: 0, createdAt: now, updatedAt: now, ...p };
    setProducts(prev => [product, ...prev]);
    addNotification({ kind: "stock", title: "Produit créé", body: product.name, link: "/espace-artisan/produits" });
    return product;
  }, [userId, addNotification]);

  const updateProduct = useCallback((id: string, patch: Partial<ArtisanProduct>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const setProductStatus = useCallback((id: string, status: ArtisanProduct["status"]) => {
    updateProduct(id, { status });
  }, [updateProduct]);

  const incrementViews = useCallback((id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, views: p.views + 1 } : p));
  }, []);

  const setOrderStatus = useCallback((id: string, status: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const at = new Date().toISOString();
      return { ...o, status, updatedAt: at, history: [...o.history, { at, status, note }] };
    }));
    const order = orders.find(o => o.id === id);
    if (order) addNotification({ kind: "order", title: `Commande ${id} → ${status}`, body: order.productName, link: "/espace-artisan/commandes" });
  }, [orders, addNotification]);

  const seedDemoOrder = useCallback(() => {
    if (!userId || myProducts.length === 0) return;
    const p = myProducts[Math.floor(Math.random() * myProducts.length)];
    const qty = 1 + Math.floor(Math.random() * 3);
    const id = `CMD-${Date.now().toString().slice(-6)}`;
    const at = new Date().toISOString();
    const order: ArtisanOrder = {
      id, userId, customerName: ["Awa K.", "Pierre M.", "Sandra D.", "Yao A."][Math.floor(Math.random() * 4)],
      customerEmail: "client@example.com", customerAddress: "Lomé, Togo",
      productId: p.id, productName: p.name, qty, unitPrice: p.price, total: p.price * qty,
      status: "pending", createdAt: at, updatedAt: at, history: [{ at, status: "pending" }],
    };
    setOrders(prev => [order, ...prev]);
    addNotification({ kind: "order", title: "Nouvelle commande", body: `${order.productName} × ${qty}`, link: "/espace-artisan/commandes" });
  }, [userId, myProducts, addNotification]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);
  const markAllNotificationsRead = useCallback(() => {
    if (!userId) return;
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  }, [userId]);
  const clearNotifications = useCallback(() => {
    if (!userId) return;
    setNotifications(prev => prev.filter(n => n.userId !== userId));
  }, [userId]);

  const stats = useMemo(() => {
    const published = myProducts.filter(p => p.status === "published");
    const stock = myProducts.reduce((s, p) => s + p.stock, 0);
    const lowStock = myProducts.filter(p => p.stock > 0 && p.stock <= 3).length;
    const outOfStock = myProducts.filter(p => p.stock === 0).length;
    const totalViews = myProducts.reduce((s, p) => s + p.views, 0);
    const orderCount = myOrders.length;
    const revenue = myOrders.filter(o => o.status === "delivered" || o.status === "shipped").reduce((s, o) => s + o.total, 0);
    const conversion = totalViews > 0 ? (orderCount / totalViews) * 100 : 0;
    const topByViews = [...myProducts].sort((a, b) => b.views - a.views).slice(0, 5);
    const revenueByProduct = myProducts.map(p => ({
      name: p.name,
      revenue: myOrders.filter(o => o.productId === p.id && (o.status === "delivered" || o.status === "shipped")).reduce((s, o) => s + o.total, 0),
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    return { published: published.length, stock, lowStock, outOfStock, totalViews, orderCount, revenue, conversion, topByViews, revenueByProduct };
  }, [myProducts, myOrders]);

  return {
    myShop, myProducts, myOrders, myNotifications, stats,
    upsertShop,
    createProduct, updateProduct, removeProduct, setProductStatus, incrementViews,
    setOrderStatus, seedDemoOrder,
    addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications,
  };
}
