import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Gift, Coins, Ticket, Sparkles, Truck, Trophy, Star, X, type LucideIcon } from "lucide-react";
import type { RewardKind } from "./reward-toast";

const KIND_ICON: Record<RewardKind, LucideIcon> = {
  gift: Gift,
  points: Coins,
  ticket: Ticket,
  shipping: Truck,
  wheel: Sparkles,
  tier: Trophy,
  promo: Star,
};

const KIND_TONE: Record<RewardKind, { from: string; to: string; ring: string; iconBg: string }> = {
  gift:     { from: "from-pink-50",    to: "to-rose-100",    ring: "ring-rose-200",    iconBg: "bg-rose-500" },
  points:   { from: "from-amber-50",   to: "to-yellow-100",  ring: "ring-amber-200",   iconBg: "bg-amber-500" },
  ticket:   { from: "from-emerald-50", to: "to-green-100",   ring: "ring-emerald-200", iconBg: "bg-emerald-600" },
  shipping: { from: "from-sky-50",     to: "to-blue-100",    ring: "ring-sky-200",     iconBg: "bg-sky-600" },
  wheel:    { from: "from-violet-50",  to: "to-fuchsia-100", ring: "ring-violet-200",  iconBg: "bg-violet-600" },
  tier:     { from: "from-amber-50",   to: "to-orange-100",  ring: "ring-orange-200",  iconBg: "bg-orange-500" },
  promo:    { from: "from-yellow-50",  to: "to-amber-100",   ring: "ring-yellow-200",  iconBg: "bg-yellow-500" },
};

export interface RewardModalProps {
  open: boolean;
  onClose: () => void;
  kind: RewardKind;
  title: string;
  description?: string;
  highlight?: string;
  code?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
  confetti?: boolean;
  extra?: ReactNode;
}

const CONFETTI_COLORS = ["#f59e0b", "#10b981", "#ec4899", "#0ea5e9", "#a855f7", "#ef4444"];

function ConfettiBurst() {
  const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.6 + Math.random() * 1.2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 6,
    rotate: Math.random() * 360,
  })), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map(p => (
        <span
          key={p.id}
          className="absolute top-0 block rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `ipk-confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
      <style>{`@keyframes ipk-confetti-fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(420px) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

export function RewardModal({
  open, onClose, kind, title, description, highlight, code,
  ctaLabel = "Voir mon compte", ctaHref = "/compte", onCta, confetti = true, extra,
}: RewardModalProps) {
  const [copied, setCopied] = useState(false);
  const Icon = KIND_ICON[kind];
  const tone = KIND_TONE[kind];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    try {
      window.dispatchEvent(new CustomEvent("ipk:reward", {
        detail: { kind, title, description, highlight, url: ctaHref },
      }));
    } catch {}
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose, kind, title, description, highlight, ctaHref]);

  if (!open) return null;

  const copy = async () => {
    if (!code) return;
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-[min(440px,100%)] rounded-2xl bg-gradient-to-br ${tone.from} ${tone.to} ring-1 ${tone.ring} shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {confetti && <ConfettiBurst />}

        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center text-[var(--ipk-text)] hover:bg-white/70"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative px-5 pt-6 pb-5 text-center">
          <div className={`mx-auto w-16 h-16 rounded-2xl ${tone.iconBg} text-white flex items-center justify-center shadow-lg ring-4 ring-white/60`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="mt-3 text-[var(--ipk-ink)]" style={{ fontSize: "18px", fontWeight: 700 }}>{title}</div>
          {highlight && (
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-white/80 ring-1 ring-white text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 700 }}>
              {highlight}
            </div>
          )}
          {description && (
            <p className="mt-2 text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>{description}</p>
          )}

          {code && (
            <button
              onClick={copy}
              className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 hover:bg-white ring-1 ring-white text-[var(--ipk-ink)] tracking-wider"
              style={{ fontSize: "14px", fontWeight: 700, fontFamily: "monospace" }}
              aria-label={`Copier le code ${code}`}
            >
              {code}
              <span className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px", fontWeight: 600 }}>
                {copied ? "Copié ✓" : "Copier"}
              </span>
            </button>
          )}

          {extra && <div className="mt-3">{extra}</div>}

          <div className="mt-4 flex items-center justify-center gap-2">
            {ctaHref ? (
              <Link
                to={ctaHref}
                onClick={() => { onCta?.(); onClose(); }}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--ipk-green-dark)] text-white hover:opacity-90"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >
                {ctaLabel} →
              </Link>
            ) : (
              <button
                onClick={() => { onCta?.(); onClose(); }}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--ipk-green-dark)] text-white hover:opacity-90"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >
                {ctaLabel}
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center px-3 py-2 rounded-lg bg-white/70 hover:bg-white text-[var(--ipk-ink)]"
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
