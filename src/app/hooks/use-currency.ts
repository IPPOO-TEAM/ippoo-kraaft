import { useEffect, useState, useCallback } from "react";

export type CurrencyCode = "XOF" | "EUR" | "USD" | "GBP" | "CAD";

export interface CurrencyDef {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateFromXOF: number; // 1 XOF = X target
  decimals: number;
}

export const DEFAULT_CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  XOF: { code: "XOF", symbol: "Fcfa", label: "Franc CFA", rateFromXOF: 1, decimals: 0 },
  EUR: { code: "EUR", symbol: "€", label: "Euro", rateFromXOF: 0.00152, decimals: 2 },
  USD: { code: "USD", symbol: "$", label: "Dollar US", rateFromXOF: 0.00164, decimals: 2 },
  GBP: { code: "GBP", symbol: "£", label: "Livre sterling", rateFromXOF: 0.00130, decimals: 2 },
  CAD: { code: "CAD", symbol: "C$", label: "Dollar canadien", rateFromXOF: 0.00224, decimals: 2 },
};

interface CurrencyConfig {
  enabled: CurrencyCode[];
  rates: Partial<Record<CurrencyCode, number>>;
}

const CONFIG_KEY = "ipk:admin:currency:v1";
const ACTIVE_KEY = "ipk:user:currency:v1";
const EVENT = "ipk:currency:changed";

function readConfig(): CurrencyConfig {
  if (typeof window === "undefined") return { enabled: ["XOF", "EUR", "USD"], rates: {} };
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: ["XOF", "EUR", "USD"], rates: {} };
}

export function saveCurrencyConfig(config: CurrencyConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function readActive(): CurrencyCode {
  if (typeof window === "undefined") return "XOF";
  try {
    const v = localStorage.getItem(ACTIVE_KEY);
    if (v && (v in DEFAULT_CURRENCIES)) return v as CurrencyCode;
  } catch {}
  return "XOF";
}

export function useCurrencyConfig() {
  const [config, setConfig] = useState<CurrencyConfig>(() => readConfig());
  useEffect(() => {
    const reload = () => setConfig(readConfig());
    window.addEventListener(EVENT, reload);
    window.addEventListener("storage", (e) => { if (e.key === CONFIG_KEY) reload(); });
    return () => { window.removeEventListener(EVENT, reload); };
  }, []);
  return { config, save: (next: CurrencyConfig) => { saveCurrencyConfig(next); setConfig(next); } };
}

export function useCurrency() {
  const { config } = useCurrencyConfig();
  const [active, setActiveState] = useState<CurrencyCode>(() => readActive());

  useEffect(() => {
    const reload = () => setActiveState(readActive());
    window.addEventListener(EVENT, reload);
    window.addEventListener("storage", (e) => { if (e.key === ACTIVE_KEY) reload(); });
    return () => { window.removeEventListener(EVENT, reload); };
  }, []);

  const setActive = useCallback((code: CurrencyCode) => {
    localStorage.setItem(ACTIVE_KEY, code);
    setActiveState(code);
    window.dispatchEvent(new CustomEvent(EVENT));
  }, []);

  const def = DEFAULT_CURRENCIES[active];
  const rate = config.rates[active] ?? def.rateFromXOF;

  const convert = useCallback((priceXOF: number): number => {
    const v = priceXOF * rate;
    return def.decimals === 0 ? Math.round(v) : Math.round(v * 100) / 100;
  }, [rate, def.decimals]);

  const format = useCallback((priceXOF: number): string => {
    const v = convert(priceXOF);
    const formatted = v.toLocaleString("fr-FR", { minimumFractionDigits: def.decimals, maximumFractionDigits: def.decimals });
    return active === "XOF" ? `${formatted} ${def.symbol}` : `${def.symbol}${formatted}`;
  }, [convert, active, def.symbol, def.decimals]);

  const enabled = config.enabled.length > 0 ? config.enabled : (["XOF", "EUR", "USD"] as CurrencyCode[]);

  return { active, setActive, format, convert, def, enabled, allCurrencies: DEFAULT_CURRENCIES, config };
}
