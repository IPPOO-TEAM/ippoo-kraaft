import { Link } from "react-router";
import { toast } from "sonner";
import { Gift, Coins, Ticket, Sparkles, Truck, Trophy, Star, type LucideIcon } from "lucide-react";
import { shouldFire } from "../lib/throttle-queue";
import { shouldShowToast, playNotifSound } from "../hooks/use-notif-prefs";

export type RewardKind = "gift" | "points" | "ticket" | "shipping" | "wheel" | "tier" | "promo";

const KIND_ICON: Record<RewardKind, LucideIcon> = {
  gift: Gift,
  points: Coins,
  ticket: Ticket,
  shipping: Truck,
  wheel: Sparkles,
  tier: Trophy,
  promo: Star,
};

const KIND_TONE: Record<RewardKind, { from: string; to: string; ring: string; iconBg: string; iconFg: string }> = {
  gift:     { from: "from-pink-50",   to: "to-rose-100",    ring: "ring-rose-200",    iconBg: "bg-rose-500",    iconFg: "text-white" },
  points:   { from: "from-amber-50",  to: "to-yellow-100",  ring: "ring-amber-200",   iconBg: "bg-amber-500",   iconFg: "text-white" },
  ticket:   { from: "from-emerald-50", to: "to-green-100",  ring: "ring-emerald-200", iconBg: "bg-emerald-600", iconFg: "text-white" },
  shipping: { from: "from-sky-50",    to: "to-blue-100",    ring: "ring-sky-200",     iconBg: "bg-sky-600",     iconFg: "text-white" },
  wheel:    { from: "from-violet-50", to: "to-fuchsia-100", ring: "ring-violet-200",  iconBg: "bg-violet-600",  iconFg: "text-white" },
  tier:     { from: "from-amber-50",  to: "to-orange-100",  ring: "ring-orange-200",  iconBg: "bg-orange-500",  iconFg: "text-white" },
  promo:    { from: "from-yellow-50", to: "to-amber-100",   ring: "ring-yellow-200",  iconBg: "bg-yellow-500",  iconFg: "text-white" },
};

export interface RewardToastInput {
  kind: RewardKind;
  title: string;
  description?: string;
  highlight?: string;
  ctaLabel?: string;
  ctaHref?: string;
  duration?: number;
}

export function rewardToast(input: RewardToastInput) {
  const { kind, title, description, highlight, ctaLabel = "Voir mon compte", ctaHref = "/compte", duration = 5000 } = input;

  if (!shouldFire(`reward:${kind}:${title}:${highlight ?? ""}`, { ttlMs: 5000 })) return null;

  try {
    window.dispatchEvent(new CustomEvent("ipk:reward", {
      detail: { kind, title, description, highlight, url: ctaHref },
    }));
  } catch {}

  playNotifSound();
  if (!shouldShowToast("reward")) return null;
  const Icon = KIND_ICON[kind];
  const t = KIND_TONE[kind];

  return toast.custom((id) => (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto w-[min(380px,calc(100vw-32px))] rounded-2xl bg-gradient-to-br ${t.from} ${t.to} ring-1 ${t.ring} shadow-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-xl ${t.iconBg} ${t.iconFg} flex items-center justify-center shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 700 }}>{title}</span>
          {highlight && (
            <span className="px-2 py-0.5 rounded-full bg-white/80 text-[var(--ipk-ink)]" style={{ fontSize: "11px", fontWeight: 700 }}>
              {highlight}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-0.5 text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>{description}</p>
        )}
        {ctaHref && (
          <Link
            to={ctaHref}
            onClick={() => toast.dismiss(id)}
            className="inline-block mt-1.5 text-[var(--ipk-green-dark)] hover:underline"
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            {ctaLabel} →
          </Link>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(id)}
        aria-label="Fermer"
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[var(--ipk-text)] hover:bg-white/60"
        style={{ fontSize: "14px" }}
      >
        ×
      </button>
    </div>
  ), { duration });
}
