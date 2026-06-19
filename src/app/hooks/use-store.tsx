import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const CART_BASE = "ipk:cart:v1";
const FAV_BASE = "ipk:favorites:v1";
const GUEST_SUFFIX = ":guest";
const USER_KEY = "ipk:user:v1";

function scopedKey(base: string, userId: string | null): string {
  return userId ? `${base}:u:${userId}` : `${base}${GUEST_SUFFIX}`;
}

function readCurrentUserId(): string | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?.id ?? null;
  } catch { return null; }
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: number;
}

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or disabled — silent
  }
}

/**
 * À la connexion d'un guest devenu user, on migre son panier+favoris guest
 * vers son espace personnel (merge non-destructif).
 */
function migrateGuestToUser(userId: string) {
  try {
    const guestCart = safeRead<CartItem[]>(`${CART_BASE}${GUEST_SUFFIX}`, []);
    const guestFav = safeRead<string[]>(`${FAV_BASE}${GUEST_SUFFIX}`, []);
    if (guestCart.length === 0 && guestFav.length === 0) return;

    const userCartKey = scopedKey(CART_BASE, userId);
    const userFavKey = scopedKey(FAV_BASE, userId);
    const existingCart = safeRead<CartItem[]>(userCartKey, []);
    const existingFav = safeRead<string[]>(userFavKey, []);

    const cartMap = new Map<string, CartItem>();
    [...existingCart, ...guestCart].forEach(it => {
      const prev = cartMap.get(it.productId);
      if (prev) cartMap.set(it.productId, { ...prev, quantity: prev.quantity + it.quantity });
      else cartMap.set(it.productId, it);
    });
    safeWrite(userCartKey, Array.from(cartMap.values()));
    safeWrite(userFavKey, Array.from(new Set([...existingFav, ...guestFav])));

    // Vider le bucket guest après merge
    localStorage.removeItem(`${CART_BASE}${GUEST_SUFFIX}`);
    localStorage.removeItem(`${FAV_BASE}${GUEST_SUFFIX}`);
  } catch {}
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => readCurrentUserId());
  const cartKey = useMemo(() => scopedKey(CART_BASE, userId), [userId]);
  const favKey = useMemo(() => scopedKey(FAV_BASE, userId), [userId]);

  const [cart, setCart] = useState<CartItem[]>(() => safeRead<CartItem[]>(scopedKey(CART_BASE, userId), []));
  const [favorites, setFavorites] = useState<string[]>(() => safeRead<string[]>(scopedKey(FAV_BASE, userId), []));

  // Persist
  useEffect(() => { safeWrite(cartKey, cart); }, [cart, cartKey]);
  useEffect(() => { safeWrite(favKey, favorites); }, [favorites, favKey]);

  // React to user login/logout
  useEffect(() => {
    const onAuth = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string } | null;
      const nextId = detail?.id ?? null;
      if (nextId !== userId) {
        if (nextId && !userId) migrateGuestToUser(nextId);
        setUserId(nextId);
        // Reload from the new namespace
        setCart(safeRead<CartItem[]>(scopedKey(CART_BASE, nextId), []));
        setFavorites(safeRead<string[]>(scopedKey(FAV_BASE, nextId), []));
      }
    };
    window.addEventListener("ipk:user:auth", onAuth);
    return () => window.removeEventListener("ipk:user:auth", onAuth);
  }, [userId]);

  // Cross-tab sync (only for current namespace)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === cartKey) setCart(safeRead<CartItem[]>(cartKey, []));
      else if (e.key === favKey) setFavorites(safeRead<string[]>(favKey, []));
      else if (e.key === USER_KEY) {
        const nextId = readCurrentUserId();
        if (nextId !== userId) {
          setUserId(nextId);
          setCart(safeRead<CartItem[]>(scopedKey(CART_BASE, nextId), []));
          setFavorites(safeRead<string[]>(scopedKey(FAV_BASE, nextId), []));
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [cartKey, favKey, userId]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { productId, quantity, addedAt: Date.now() }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId));
      return;
    }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const isFavorite = useCallback((productId: string) => favorites.includes(productId), [favorites]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const value = useMemo<StoreContextValue>(() => ({
    cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart,
    favorites, isFavorite, toggleFavorite, removeFavorite,
  }), [cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart, favorites, isFavorite, toggleFavorite, removeFavorite]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
