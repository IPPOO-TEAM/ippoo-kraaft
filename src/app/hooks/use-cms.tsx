import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// ===== Types =====
export type CtaConfig = { label: string; href: string };
export type TrustItem = { icon: string; text: string };
export type SavoirItem = { image: string; title: string; desc: string; link: string };

export type HomeHero = {
  enabled: boolean;
  title: string;
  subtitle: string;
  image: string;
  cta: CtaConfig;
  overlay: number; // 0..1
};

export type HomeTrust = {
  enabled: boolean;
  items: TrustItem[];
};

export type HomeSavoir = {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: SavoirItem[];
};

export type SectionToggles = {
  hero: boolean;
  marketDayBanner: boolean;
  trust: boolean;
  savoir: boolean;
  promos: boolean;
  exclusives: boolean;
  categories: boolean;
  taxonomy: boolean;
  groupements: boolean;
  formation: boolean;
  groupBuying: boolean;
  events: boolean;
  testimonials: boolean;
  stats: boolean;
  cta: boolean;
};

export type HomeConfig = {
  hero: HomeHero;
  trust: HomeTrust;
  savoir: HomeSavoir;
  sections: SectionToggles;
};

// ===== Defaults (match current hardcoded values) =====
import { IMAGES } from "../data/mock-data";

export const DEFAULT_HOME: HomeConfig = {
  hero: {
    enabled: true,
    title: "L'Art Ancestral Africain, Vivant et Traçable",
    subtitle: "Découvrez des pièces uniques créées par des maîtres artisans, certifiées d'origine et porteuses d'une histoire millénaire.",
    image: IMAGES.heroArtisan,
    cta: { label: "Explorer la boutique", href: "/boutique" },
    overlay: 0.5,
  },
  trust: {
    enabled: true,
    items: [
      { icon: "Shield", text: "Certifié Authentique" },
      { icon: "Award", text: "Normes IPPOO KRAAFT" },
      { icon: "Users", text: "89 Artisans" },
      { icon: "MapPin", text: "15 Pays" },
    ],
  },
  savoir: {
    enabled: true,
    title: "Savoir-faire Vivant",
    subtitle: "Chaque technique est un patrimoine. Chaque geste, une transmission.",
    items: [
      { image: IMAGES.textileWeaving, title: "Tissage", desc: "Kente, Bogolan, teintures naturelles", link: "/galeries" },
      { image: IMAGES.sculpture, title: "Sculpture", desc: "Bois, bronze, terre cuite", link: "/galeries" },
      { image: IMAGES.wovenBasket, title: "Vannerie", desc: "Fibres naturelles, tressage spiralé", link: "/galeries" },
    ],
  },
  sections: {
    hero: true, marketDayBanner: true, trust: true, savoir: true,
    promos: true, exclusives: true, categories: true, taxonomy: true,
    groupements: true, formation: true, groupBuying: true, events: true,
    testimonials: true, stats: true, cta: true,
  },
};

// ===== Storage =====
const STORAGE_KEY = "ipk:cms:home:v1";

function load(): HomeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HOME;
    const parsed = JSON.parse(raw);
    return {
      hero: { ...DEFAULT_HOME.hero, ...(parsed.hero || {}) },
      trust: { ...DEFAULT_HOME.trust, ...(parsed.trust || {}), items: parsed.trust?.items || DEFAULT_HOME.trust.items },
      savoir: { ...DEFAULT_HOME.savoir, ...(parsed.savoir || {}), items: parsed.savoir?.items || DEFAULT_HOME.savoir.items },
      sections: { ...DEFAULT_HOME.sections, ...(parsed.sections || {}) },
    };
  } catch { return DEFAULT_HOME; }
}

function persist(cfg: HomeConfig) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch {}
}

type Ctx = {
  home: HomeConfig;
  setHero: (patch: Partial<HomeHero>) => void;
  setTrust: (patch: Partial<HomeTrust>) => void;
  setSavoir: (patch: Partial<HomeSavoir>) => void;
  toggleSection: (key: keyof SectionToggles, value: boolean) => void;
  reset: () => void;
};

const CmsContext = createContext<Ctx | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [home, setHome] = useState<HomeConfig>(() => load());

  useEffect(() => { persist(home); }, [home]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setHome(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setHero = useCallback((patch: Partial<HomeHero>) => setHome(h => ({ ...h, hero: { ...h.hero, ...patch } })), []);
  const setTrust = useCallback((patch: Partial<HomeTrust>) => setHome(h => ({ ...h, trust: { ...h.trust, ...patch } })), []);
  const setSavoir = useCallback((patch: Partial<HomeSavoir>) => setHome(h => ({ ...h, savoir: { ...h.savoir, ...patch } })), []);
  const toggleSection = useCallback((key: keyof SectionToggles, value: boolean) => setHome(h => ({ ...h, sections: { ...h.sections, [key]: value } })), []);
  const reset = useCallback(() => setHome(DEFAULT_HOME), []);

  const value = useMemo<Ctx>(() => ({ home, setHero, setTrust, setSavoir, toggleSection, reset }), [home, setHero, setTrust, setSavoir, toggleSection, reset]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
