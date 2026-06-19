import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import {
  Heart, MapPin, Shield, Award, Users, Target, Eye, Star,
  Phone, Mail, Clock, Calendar, MessageCircle, Send, ChevronRight,
  Trash2, Plus, Minus, CreditCard, ArrowRight, BarChart3, TrendingUp,
  Package, ShoppingCart, Globe, CheckCircle2, QrCode, Smartphone, Copy, Check, X, Loader2
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  IMAGES, events, faqData, statsData,
  products, artisans, testimonials, formatPrice
} from "../../data/mock-data";
import { LazyImage } from "../lazy-image";
import { useModal } from "../../hooks/use-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues, joinArtisanSchema, type JoinArtisanFormValues, profileSchema, type ProfileFormValues } from "../../lib/validations";
import { useSeo } from "../../hooks/use-seo";
import { useStore } from "../../hooks/use-store";
import { useUser } from "../../hooks/use-user";
import { usePayments } from "../../hooks/use-payments";
import { useMarketing } from "../../hooks/use-marketing";
import { Coins, Trophy, Crown, Truck, Percent, Sparkles, Gift, Star as StarIcon } from "lucide-react";
import { useLoyaltyTier, TIERS, REFERRAL_BONUS_OWNER, REFERRAL_BONUS_REDEEMER, redeemReferralCode, referralStats } from "../../hooks/use-loyalty-tiers";
import { toast } from "sonner";
import { rewardToast } from "../reward-toast";
import { NotifPrefsPanel } from "../notif-prefs-panel";
import { QRCodeSVG } from "qrcode.react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";


// ============= ACCOUNT PAGE =============
const ORDER_STATUS_TONE: Record<string, string> = {
  succeeded: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  processing: "bg-blue-100 text-blue-700",
  created: "bg-slate-100 text-slate-700",
  refunded: "bg-amber-100 text-amber-700",
  expired: "bg-gray-100 text-gray-700",
};
const ORDER_STATUS_LABEL: Record<string, string> = {
  succeeded: "Payée",
  failed: "Échec",
  processing: "En cours",
  created: "En attente",
  refunded: "Remboursée",
  expired: "Expirée",
};

function OrdersList({ email }: { email: string }) {
  const { ordersByEmail } = usePayments();
  const list = ordersByEmail(email);
  if (list.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-8 text-center">
        <Package className="w-10 h-10 mx-auto mb-2 text-[var(--ipk-text)]" />
        <p style={{ fontSize: "14px", color: "var(--ipk-text)" }}>Aucune commande pour l'instant.</p>
        <Link to="/boutique"><Button variant="outline" size="sm" className="mt-3">Découvrir la boutique</Button></Link>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {list.map((order) => (
        <Link key={order.ref} to={`/commande/${order.ref}`} className="block bg-white rounded-2xl border border-[var(--ipk-border)] p-4 hover:border-[var(--ipk-green-dark)] transition-colors">
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            <span className="font-mono" style={{ fontSize: "13px", color: "var(--ipk-ink)" }}>{order.ref}</span>
            <Badge className={`border-0 ${ORDER_STATUS_TONE[order.status]}`} style={{ fontSize: "11px" }}>
              {ORDER_STATUS_LABEL[order.status]}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap" style={{ fontSize: "13px", color: "var(--ipk-text)" }}>
            <span>{new Date(order.createdAt).toLocaleString("fr-FR")} — {order.items.length} article{order.items.length > 1 ? "s" : ""} · {order.providerLabel}</span>
            <span style={{ fontWeight: 600, color: "var(--ipk-green)" }}>{formatPrice(order.amount)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ProfileForm() {
  const PROFILE_KEY = "ipk:profile:v1";
  const defaults: ProfileFormValues = (() => {
    if (typeof window === "undefined") return { name: "Jean Dupont", email: "jean.dupont@email.com", phone: "+33 6 12 34 56 78", address: "12 rue de la Paix, Paris" };
    try {
      const raw = window.localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return { name: "Jean Dupont", email: "jean.dupont@email.com", phone: "+33 6 12 34 56 78", address: "12 rue de la Paix, Paris" };
  })();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
  });
  const onSubmit = async (values: ProfileFormValues) => {
    await new Promise(r => setTimeout(r, 600));
    try { window.localStorage.setItem(PROFILE_KEY, JSON.stringify(values)); } catch { /* ignore */ }
    toast.success("Profil mis à jour");
  };
  const fields: { name: keyof ProfileFormValues; label: string; type?: string; autoComplete?: string }[] = [
    { name: "name", label: "Nom", autoComplete: "name" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "phone", label: "Téléphone", type: "tel", autoComplete: "tel" },
    { name: "address", label: "Adresse", autoComplete: "street-address" },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={`profile-${f.name}`} style={{ fontSize: "13px" }}>{f.label}</label>
            <input
              id={`profile-${f.name}`}
              type={f.type ?? "text"}
              autoComplete={f.autoComplete}
              aria-invalid={!!errors[f.name]}
              aria-describedby={errors[f.name] ? `profile-${f.name}-err` : undefined}
              className="w-full mt-1 px-4 py-2.5 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl"
              style={{ fontSize: "14px" }}
              {...register(f.name)}
            />
            {errors[f.name] && (
              <p id={`profile-${f.name}-err`} role="alert" className="mt-1 text-red-600" style={{ fontSize: "12px" }}>{errors[f.name]?.message}</p>
            )}
          </div>
        ))}
      </div>
      <Button type="submit" disabled={isSubmitting} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-10 disabled:opacity-60">
        {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Sauvegarde…</> : "Sauvegarder"}
      </Button>
    </form>
  );
}

export function AccountPage() {
  useSeo({ title: "Mon compte", description: "Gérez votre compte IPPOO KRAAFT : commandes, favoris, profil.", noIndex: true });
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/connexion" replace />;
  if (!user.profileComplete) return <Navigate to="/completer-profil" replace />;

  const initials = user.fullName.split(/\s+/).map(s => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
  const accountTypeLabel = user.accountType === "artisan" ? "Professionnel-Artisan" : user.accountType === "entreprise" ? "Entreprise" : "Particulier";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between gap-3">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
          Mon Compte
        </h1>
        <Button variant="outline" onClick={() => { logout(); toast.success("Déconnecté"); navigate("/"); }}>Se déconnecter</Button>
      </div>

      {!user.emailVerified && (
        <div className="mt-4 p-3 rounded-xl border border-[var(--ipk-amber)]/40 bg-[#F59E0B]/10 flex items-center gap-3 flex-wrap">
          <span style={{ fontSize: "13px", color: "var(--ipk-ink)" }}>Votre adresse e-mail n'est pas encore vérifiée.</span>
          <Button size="sm" variant="outline" onClick={() => navigate("/verifier-email")}>Vérifier maintenant</Button>
        </div>
      )}

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="loyalty">Fidélité</TabsTrigger>
          <TabsTrigger value="notifs">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-6 space-y-4">
            <div className="flex items-center gap-4">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.fullName} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 bg-[var(--ipk-green-dark)] rounded-full flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>{initials}</span>
                </div>
              )}
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--ipk-ink)" }}>{user.fullName}</h3>
                <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>{user.email}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge className="bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] border-0" style={{ fontSize: "11px" }}>{accountTypeLabel}</Badge>
                  {user.nationality && <Badge variant="outline" style={{ fontSize: "11px" }}>{user.nationality}</Badge>}
                  {user.provider === "google" && <Badge variant="outline" style={{ fontSize: "11px" }}>Google</Badge>}
                </div>
              </div>
            </div>
            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
              {user.phone && (<div><dt className="text-[var(--ipk-text)]">Téléphone</dt><dd>{user.phone}</dd></div>)}
              {user.dateOfBirth && (<div><dt className="text-[var(--ipk-text)]">Date de naissance</dt><dd>{user.dateOfBirth}</dd></div>)}
              {user.address && (<div className="sm:col-span-2"><dt className="text-[var(--ipk-text)]">Adresse</dt><dd>{user.address}</dd></div>)}
            </dl>
            <ProfileForm />

          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <OrdersList email={user.email} />
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((p) => (
              <Link key={p.id} to={`/boutique/${p.slug}`} className="rounded-xl overflow-hidden border border-[var(--ipk-border)]">
                <div className="aspect-square overflow-hidden">
                  <LazyImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <h4 className="truncate" style={{ fontSize: "12px", fontWeight: 600 }}>{p.name}</h4>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ipk-green-dark)" }}>{formatPrice(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-4">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" />
                ))}
              </div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>Masque Ancestral Éwé</h4>
              <p style={{ fontSize: "13px", color: "var(--ipk-text)" }}>"Pièce magnifique, le certificat d'authenticité est un vrai plus."</p>
              <span style={{ fontSize: "11px", color: "var(--ipk-text)" }}>Publié le 2026-02-15</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="mt-4">
          <LoyaltyPanel email={user.email} />
        </TabsContent>

        <TabsContent value="notifs" className="mt-4">
          <NotifPrefsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const PERK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Coins, Truck, Percent, Clock, Sparkles, Gift, Star: StarIcon, Crown,
};

function LoyaltyPanel({ email }: { email: string }) {
  const { loyaltyHistory, redeemPoints, badgesFor, tickets, adjustUserPoints, loyaltyForUser } = useMarketing();
  const { tier, next, progress, points, code } = useLoyaltyTier();
  const userLoyalty = React.useMemo(() => loyaltyForUser(email), [email, loyaltyForUser]);
  const userPoints = userLoyalty.points;
  const myBadges = badgesFor(email);
  const myTickets = tickets.filter(t => t.status === "active").slice(0, 6);
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
  const [redeemCode, setRedeemCode] = useState("");
  const [copied, setCopied] = useState(false);
  const stats = React.useMemo(() => referralStats(email), [email, code]);

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); toast.success("Code copié"); setTimeout(() => setCopied(false), 1800); } catch { toast.error("Impossible de copier"); }
  };

  const submitReferral = () => {
    const c = redeemCode.trim().toUpperCase();
    if (!c) return;
    const r = redeemReferralCode(c, email);
    if (!r.ok) { toast.error(r.reason || "Code invalide"); return; }
    adjustUserPoints(email, REFERRAL_BONUS_REDEEMER, `Bonus parrainage (code ${c})`);
    if (r.ownerEmail) adjustUserPoints(r.ownerEmail, REFERRAL_BONUS_OWNER, `Filleul ${email}`);
    rewardToast({ kind: "points", title: "Parrainage validé", description: "Bonus crédité à votre solde", highlight: `+${REFERRAL_BONUS_REDEEMER} pts` });
    setRedeemCode("");
  };

  return (
    <div className="space-y-4">
      {/* Tier card */}
      <div className="rounded-2xl border border-[var(--ipk-border)] p-5 text-white" style={{ background: tier.bg }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="opacity-80 inline-flex items-center gap-1.5" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <Crown className="w-3 h-3" /> Niveau {tier.label}
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: 700 }}>{fmt(userPoints)}</div>
            <div className="opacity-90" style={{ fontSize: "12px" }}>points fidélité</div>
          </div>
          {next ? (
            <div className="text-right">
              <div className="opacity-90" style={{ fontSize: "11px" }}>Prochain palier : {next.label}</div>
              <div className="opacity-80" style={{ fontSize: "11px" }}>Encore {fmt(Math.max(0, next.minPoints - userPoints))} pts</div>
            </div>
          ) : (
            <Badge className="bg-white/20 text-white border-0">Niveau maximum atteint</Badge>
          )}
        </div>
        {next && (
          <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}
      </div>

      {/* Perks */}
      <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-4">
        <h4 className="mb-3 flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 700, color: "var(--ipk-ink)" }}>
          <Sparkles className="w-4 h-4 text-[var(--ipk-green-dark)]" /> Avantages {tier.label}
        </h4>
        <ul className="grid sm:grid-cols-2 gap-2">
          {tier.perks.map((p, i) => {
            const Icon = PERK_ICONS[p.icon] || Sparkles;
            return (
              <li key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-lg bg-[var(--ipk-surface)]">
                <Icon className="w-4 h-4 mt-0.5 text-[var(--ipk-green-dark)] shrink-0" />
                <span style={{ fontSize: "12px", color: "var(--ipk-ink)" }}>{p.label}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {TIERS.map(t => (
            <span
              key={t.id}
              className={`px-2 py-1 rounded-full ${t.id === tier.id ? "ring-2 ring-offset-1 ring-[var(--ipk-green-dark)]" : ""}`}
              style={{ background: t.bg, color: "white", fontSize: "10px", fontWeight: 600 }}
            >
              {t.label} ≥ {fmt(t.minPoints)}
            </span>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-4">
        <h4 className="mb-2 flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 700, color: "var(--ipk-ink)" }}>
          <Users className="w-4 h-4" /> Parrainage
        </h4>
        <p className="text-[var(--ipk-text)] mb-3" style={{ fontSize: "12px" }}>
          Partagez votre code : votre filleul gagne <strong>{REFERRAL_BONUS_REDEEMER} pts</strong> à l'utilisation, vous gagnez <strong>{REFERRAL_BONUS_OWNER} pts</strong>.
        </p>
        <div className="flex items-center gap-2 mb-3">
          <code className="flex-1 px-3 py-2 rounded-xl bg-[var(--ipk-surface)] border border-[var(--ipk-border)] text-[var(--ipk-ink)]" style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em" }}>{code}</code>
          <Button onClick={copyCode} className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-10 px-3 gap-1.5" style={{ fontSize: "12px" }}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copié" : "Copier"}
          </Button>
        </div>
        <div className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>
          <strong className="text-[var(--ipk-ink)]">{stats.count}</strong> filleul{stats.count > 1 ? "s" : ""} actif{stats.count > 1 ? "s" : ""}
        </div>
        <div className="mt-3 pt-3 border-t border-[var(--ipk-border)]">
          <p className="text-[var(--ipk-text)] mb-2" style={{ fontSize: "12px" }}>Vous avez un code ? Saisissez-le pour réclamer votre bonus.</p>
          <div className="flex gap-2">
            <input
              value={redeemCode}
              onChange={e => setRedeemCode(e.target.value.toUpperCase())}
              placeholder="EX. ABCD-1234"
              className="flex-1 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl px-3 py-2"
              style={{ fontSize: "13px", letterSpacing: "0.05em" }}
            />
            <Button onClick={submitReferral} disabled={!redeemCode.trim()} variant="outline" className="rounded-xl h-10 px-3" style={{ fontSize: "12px" }}>
              Valider
            </Button>
          </div>
        </div>
      </div>

      {/* Conversion card */}
      <div className="rounded-2xl border border-[var(--ipk-border)] bg-gradient-to-br from-[#0B6B3A] to-[#B45309] p-5 text-white">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="opacity-80" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Convertir mes points</div>
            <div className="opacity-90 mt-1" style={{ fontSize: "12px" }}>1 000 pts = 5 000 Fcfa de bon d'achat</div>
          </div>
          <Button
            disabled={userPoints < 1000}
            onClick={() => {
              const r = redeemPoints(1000);
              if (r.ok) rewardToast({ kind: "ticket", title: "Bon créé", description: `Code ${r.ticketCode}`, highlight: `${fmt(r.amount)} Fcfa` });
              else toast.error(r.reason);
            }}
            className="bg-white text-[var(--ipk-ink)] hover:bg-white/90"
          >
            <Coins className="w-4 h-4 mr-1" /> Convertir 1 000 pts
          </Button>
        </div>
      </div>

      {myBadges.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-4">
          <h4 className="mb-2 flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 700 }}><Trophy className="w-4 h-4" /> Mes badges</h4>
          <div className="flex flex-wrap gap-2">
            {myBadges.map(b => (
              <Badge key={b.id} className="bg-[#B45309]/10 text-[#B45309] border-0">{b.label}</Badge>
            ))}
          </div>
        </div>
      )}

      {myTickets.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-4">
          <h4 className="mb-2" style={{ fontSize: "14px", fontWeight: 700 }}>Mes tickets actifs</h4>
          <ul className="space-y-1.5">
            {myTickets.map(t => (
              <li key={t.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-[var(--ipk-surface)]" style={{ fontSize: "12px" }}>
                <span className="truncate min-w-0"><strong>{t.label}</strong> · <code>{t.code}</code></span>
                <span className="shrink-0 text-[var(--ipk-text-muted)]">{t.pct ? `-${t.pct}%` : t.amount ? `${fmt(t.amount)} F` : ""}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[var(--ipk-border)] p-4">
        <h4 className="mb-2" style={{ fontSize: "14px", fontWeight: 700 }}>Historique des points</h4>
        {loyaltyHistory.length === 0 ? (
          <p className="text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>Aucune transaction. Effectuez une commande ou tournez la roue pour gagner vos premiers points.</p>
        ) : (
          <ul className="space-y-1">
            {loyaltyHistory.slice(0, 20).map(h => (
              <li key={h.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-[var(--ipk-surface)]" style={{ fontSize: "12px" }}>
                <span className="truncate min-w-0">{h.reason}</span>
                <span className={`shrink-0 ${h.delta > 0 ? "text-emerald-700" : "text-amber-700"}`} style={{ fontWeight: 700 }}>{h.delta > 0 ? "+" : ""}{fmt(h.delta)} pts</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
