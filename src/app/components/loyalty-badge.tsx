import { Link } from "react-router";
import { Crown } from "lucide-react";
import { useLoyaltyTier } from "../hooks/use-loyalty-tiers";
import { useUser } from "../hooks/use-user";

export function LoyaltyHeaderBadge() {
  const { user } = useUser();
  const { tier, points } = useLoyaltyTier();
  if (!user) return null;
  const fmt = new Intl.NumberFormat("fr-FR").format(points);
  return (
    <Link
      to="/compte"
      className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white shadow-sm hover:opacity-90 transition-opacity"
      style={{ background: tier.bg, fontSize: "11px", fontWeight: 600 }}
      aria-label={`Niveau ${tier.label} · ${points} points fidélité`}
      title={`Niveau ${tier.label} · ${fmt} pts`}
    >
      <Crown className="w-3 h-3" />
      <span>{tier.label}</span>
      <span className="opacity-90">·</span>
      <span>{fmt} pts</span>
    </Link>
  );
}
