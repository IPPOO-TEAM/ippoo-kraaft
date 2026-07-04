import type { CSSProperties, ReactNode } from "react";
import type { CouponPattern, CouponTheme } from "../data/marketing-data";

// Coupons CSS-only - inspirés des affiches promotionnelles et motifs textiles ouest-africains
// (kente, perles, calebasse, adinkra, bogolan). Aucune image externe : dégradés, conic/radial-gradient
// composent les visuels. Animations légères (shimmer, pulse) et adapté mobile.

const THEME: Record<CouponTheme, { from: string; via: string; to: string; ink: string; accent: string; glow: string }> = {
  amber:     { from: "#FBBF24", via: "#D97706", to: "#7C2D12", ink: "#FFFBEB", accent: "#FFE4A8", glow: "#FDE68A" },
  rose:      { from: "#FB7185", via: "#E11D48", to: "#881337", ink: "#FFF1F2", accent: "#FECDD3", glow: "#FECACA" },
  emerald:   { from: "#34D399", via: "#0B6B3A", to: "#064E3B", ink: "#ECFDF5", accent: "#A7F3D0", glow: "#6EE7B7" },
  indigo:    { from: "#818CF8", via: "#4338CA", to: "#1E1B4B", ink: "#EEF2FF", accent: "#C7D2FE", glow: "#A5B4FC" },
  fuchsia:   { from: "#F0ABFC", via: "#C026D3", to: "#701A75", ink: "#FAE8FF", accent: "#F5D0FE", glow: "#F5D0FE" },
  cyan:      { from: "#67E8F9", via: "#0891B2", to: "#164E63", ink: "#ECFEFF", accent: "#A5F3FC", glow: "#A5F3FC" },
  slate:     { from: "#94A3B8", via: "#334155", to: "#0F172A", ink: "#F1F5F9", accent: "#CBD5E1", glow: "#CBD5E1" },
  terracotta:{ from: "#F5A78B", via: "#C2410C", to: "#7C2D12", ink: "#FFF7ED", accent: "#FED7AA", glow: "#FDBA74" },
  ochre:     { from: "#F4C95D", via: "#B45309", to: "#78350F", ink: "#FFFBEB", accent: "#FCD34D", glow: "#FBBF24" },
  bronze:    { from: "#D4A373", via: "#8B5E34", to: "#3F2A14", ink: "#FFF8EE", accent: "#E7C9A0", glow: "#D4A373" },
  clay:      { from: "#E2725B", via: "#9A3F2F", to: "#5A1F18", ink: "#FFF5F1", accent: "#F4B6A2", glow: "#F1A38B" },
  ivory:     { from: "#FFF6E0", via: "#E8D7A8", to: "#A6824D", ink: "#3F2A14", accent: "#8B5E34", glow: "#FFE9B5" },
};

function patternStyle(pattern: CouponPattern, accent: string): CSSProperties {
  switch (pattern) {
    case "kente":
      return {
        backgroundImage: `repeating-linear-gradient(90deg, ${accent}33 0 8px, transparent 8px 22px), repeating-linear-gradient(0deg, ${accent}22 0 6px, transparent 6px 14px)`,
      };
    case "dots":
      return {
        backgroundImage: `radial-gradient(${accent}66 1.6px, transparent 1.8px)`,
        backgroundSize: "12px 12px",
      };
    case "rays":
      return {
        backgroundImage: `conic-gradient(from 0deg at 50% 100%, ${accent}44 0deg 8deg, transparent 8deg 22deg, ${accent}33 22deg 30deg, transparent 30deg 44deg)`,
      };
    case "diamonds":
      return {
        backgroundImage: `linear-gradient(135deg, ${accent}44 25%, transparent 25%), linear-gradient(225deg, ${accent}44 25%, transparent 25%), linear-gradient(315deg, ${accent}44 25%, transparent 25%), linear-gradient(45deg, ${accent}44 25%, transparent 25%)`,
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0, 8px 0, 8px -8px, 0px 8px",
      };
    case "weave":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${accent}33 0 6px, transparent 6px 12px), repeating-linear-gradient(-45deg, ${accent}22 0 6px, transparent 6px 12px)`,
      };
    case "adinkra":
      return {
        backgroundImage: `radial-gradient(circle at 50% 50%, transparent 6px, ${accent}33 7px, ${accent}33 8px, transparent 9px), radial-gradient(circle at 50% 50%, transparent 12px, ${accent}22 13px, ${accent}22 14px, transparent 15px), linear-gradient(0deg, transparent 47%, ${accent}22 47%, ${accent}22 53%, transparent 53%), linear-gradient(90deg, transparent 47%, ${accent}22 47%, ${accent}22 53%, transparent 53%)`,
        backgroundSize: "36px 36px",
      };
    case "bogolan":
      return {
        backgroundImage: `repeating-linear-gradient(0deg, ${accent}33 0 2px, transparent 2px 10px), repeating-linear-gradient(90deg, ${accent}22 0 2px, transparent 2px 14px), repeating-linear-gradient(45deg, ${accent}1a 0 4px, transparent 4px 12px)`,
      };
  }
}

interface CouponProps {
  theme: CouponTheme;
  pattern: CouponPattern;
  badge?: ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  variant?: "classic" | "stamp" | "sticker";
  className?: string;
  children?: ReactNode;
  noShimmer?: boolean;
}

export function Coupon({ theme, pattern, badge, eyebrow, title, subtitle, footer, variant = "classic", className = "", children, noShimmer }: CouponProps) {
  const t = THEME[theme];
  const bg: CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${t.from} 0%, ${t.via} 55%, ${t.to} 100%)`,
    color: t.ink,
  };
  const overlay: CSSProperties = patternStyle(pattern, t.accent);
  const glow: CSSProperties = {
    background: `radial-gradient(circle at 100% 0%, ${t.glow}55, transparent 55%), radial-gradient(circle at 0% 100%, ${t.accent}33, transparent 60%)`,
  };
  const shimmer = !noShimmer && (
    <div className="ipk-coupon-shimmer pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div className="ipk-coupon-shimmer__bar" />
    </div>
  );

  if (variant === "sticker") {
    return (
      <div className={`relative aspect-square ${className}`}>
        <div
          className="ipk-coupon-sticker absolute inset-0 rounded-full overflow-hidden"
          style={{ ...bg, boxShadow: `0 12px 32px -10px ${t.via}66, 0 0 0 6px ${t.accent}22` }}
        >
          <div className="absolute inset-0" style={overlay} />
          <div className="absolute inset-0" style={glow} />
          <div className="absolute inset-1 rounded-full border-2 border-dashed" style={{ borderColor: `${t.accent}99` }} />
          {shimmer}
          <div className="relative h-full w-full flex flex-col items-center justify-center text-center px-4">
            {badge && <div className="mb-1 ipk-coupon-pulse">{badge}</div>}
            {eyebrow && <div className="text-[10px] uppercase tracking-widest opacity-90">{eyebrow}</div>}
            <div className="font-medium leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(14px, 3.5vw, 18px)" }}>{title}</div>
            {subtitle && <div className="text-[11px] opacity-90 mt-1 line-clamp-2 px-2">{subtitle}</div>}
            {children && <div className="mt-2 w-full">{children}</div>}
            {footer && <div className="mt-2 text-[10px] opacity-90">{footer}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "stamp") {
    return (
      <div className={`ipk-coupon relative rounded-2xl overflow-hidden shadow-md ${className}`} style={bg}>
        <div className="absolute inset-0 pointer-events-none" style={overlay} />
        <div className="absolute inset-0 pointer-events-none" style={glow} />
        {shimmer}
        <div className="relative p-4 sm:p-5 flex flex-col h-full">
          {badge && <div className="mb-2 inline-flex w-fit items-center justify-center rounded-xl px-2.5 py-1.5 ipk-coupon-pulse" style={{ background: "rgba(0,0,0,0.22)", border: `1px dashed ${t.accent}77` }}>{badge}</div>}
          {eyebrow && <div className="text-[10px] uppercase tracking-widest opacity-85">{eyebrow}</div>}
          <div className="font-medium" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px, 3.6vw, 20px)" }}>{title}</div>
          {subtitle && <div className="text-sm opacity-90 mt-1">{subtitle}</div>}
          {children && <div className="mt-3">{children}</div>}
          {footer && <div className="mt-auto pt-3 text-xs opacity-90">{footer}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="ipk-coupon relative rounded-2xl overflow-hidden shadow-md"
        style={{
          ...bg,
          WebkitMaskImage:
            "radial-gradient(circle at 0 50%, transparent 10px, black 11px), radial-gradient(circle at 100% 50%, transparent 10px, black 11px)",
          WebkitMaskComposite: "source-in" as never,
          maskImage:
            "radial-gradient(circle at 0 50%, transparent 10px, black 11px), radial-gradient(circle at 100% 50%, transparent 10px, black 11px)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={overlay} />
        <div className="absolute inset-0 pointer-events-none" style={glow} />
        {shimmer}

        <div className="relative grid grid-cols-[auto_1fr] gap-3 sm:gap-4 p-4 sm:p-5 min-h-[130px] sm:min-h-[140px]">
          <div className="flex items-center">
            <div
              className="flex items-center justify-center rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-center min-w-[64px] sm:min-w-[72px] ipk-coupon-pulse"
              style={{ background: "rgba(0,0,0,0.22)", border: `1px dashed ${t.accent}77` }}
            >
              {badge}
            </div>
          </div>
          <div
            className="absolute top-3 bottom-3 left-[88px] sm:left-[100px]"
            style={{ borderLeft: `2px dashed ${t.accent}77`, opacity: 0.75 }}
          />
          <div className="pl-2 sm:pl-3 min-w-0">
            {eyebrow && <div className="text-[10px] uppercase tracking-widest opacity-85">{eyebrow}</div>}
            <div className="font-medium leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(15px, 3.2vw, 18px)" }}>{title}</div>
            {subtitle && <div className="text-sm opacity-90 mt-1">{subtitle}</div>}
            {children && <div className="mt-2">{children}</div>}
            {footer && <div className="mt-3 pt-2 border-t border-white/25 text-xs opacity-95 flex items-center justify-between gap-2 flex-wrap">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
