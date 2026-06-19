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
import { logAudit } from "../../hooks/use-admin-audit";
import { usePayments, type PayMethod } from "../../hooks/use-payments";
import { useProducts } from "../../hooks/use-products";
import { recommendCrossSell } from "../../hooks/use-recommendations";
import { useMarketing } from "../../hooks/use-marketing";
import { useLoyaltyTier } from "../../hooks/use-loyalty-tiers";
import { ProductRecommendations } from "../product-recommendations";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import orangeLogo from "../../../imports/Orange-Money-logo.jpg";
import waveLogo from "../../../imports/wave_logo_670.jpg";
import mastercardLogo from "../../../imports/MasterCard-Logo.svg.png";
import mtnLogo from "../../../imports/promotion-1-1-350x250__1_.png";
import moovLogo from "../../../imports/images__19_.png";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";


// ============= PROMO CODE FORM =============
const FALLBACK_PROMOS: { code: string; label: string; pct: number }[] = [
  { code: "IPK10", label: "−10%", pct: 10 },
  { code: "BIENVENUE", label: "−15% nouveau client", pct: 15 },
  { code: "ARTISAN20", label: "−20% artisans", pct: 20 },
];

function loadAdminPromos(): { code: string; label: string; pct: number }[] {
  try {
    const raw = localStorage.getItem("ipk:admin:promos:v1");
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch {}
  return FALLBACK_PROMOS;
}

function PromoCodeForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const onApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 3) {
      toast.error("Code promo trop court");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    const promo = loadAdminPromos().find(p => p.code === trimmed);
    if (promo) {
      toast.success(`Code « ${trimmed} » appliqué`, { description: `Réduction ${promo.label} sur votre commande.` });
      setCode("");
    } else {
      toast.error("Code promo invalide ou expiré");
    }
  };
  return (
    <form onSubmit={onApply} className="flex gap-2 mb-6" noValidate>
      <label htmlFor="promo-code" className="sr-only">Code promo</label>
      <input
        id="promo-code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Code promo"
        className="flex-1 px-4 py-2.5 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl"
        style={{ fontSize: "14px" }}
      />
      <Button type="submit" disabled={loading} variant="outline" className="rounded-xl border-[var(--ipk-border)] disabled:opacity-60">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : "Appliquer"}
      </Button>
    </form>
  );
}

// ============= CART PAGE =============
export function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const { user } = useUser();
  const { createOrder, processOrder } = usePayments();
  const navigate = useNavigate();
  const allProducts = useProducts();
  const { adjustUserPoints, loyaltyConfig } = useMarketing();
  const { tier } = useLoyaltyTier();
  const crossSell = React.useMemo(
    () => recommendCrossSell(cart.map(c => c.productId), allProducts, 6),
    [cart, allProducts],
  );
  const cartItems = React.useMemo(
    () => cart.map(ci => {
      const p = products.find(pp => pp.id === ci.productId);
      return p ? { product: p, quantity: ci.quantity } : null;
    }).filter(Boolean) as { product: typeof products[number]; quantity: number }[],
    [cart]
  );
  const total = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const PAY_PREF_KEY = "ipk:pay:pref:v1";
  const PAY_PHONE_KEY = "ipk:pay:phone:v1";
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>(() => {
    try { const v = localStorage.getItem(PAY_PREF_KEY) as PayMethod | null; return v || "card"; } catch { return "card"; }
  });
  const [phone, setPhone] = useState<string>(() => { try { return localStorage.getItem(PAY_PHONE_KEY) || ""; } catch { return ""; } });
  React.useEffect(() => {
    if (!phone && user?.phone) setPhone(user.phone.replace(/\D/g, "").slice(0, 12).replace(/(\d{2})(?=\d)/g, "$1 ").trim());
  }, [user?.phone]); // eslint-disable-line react-hooks/exhaustive-deps
  const [processing, setProcessing] = useState(false);
  const PAY_OPTIONS: { id: PayMethod; label: string; sub: string; logo?: string; color: string }[] = [
    { id: "card",   label: "Carte bancaire", sub: "Visa, Mastercard",    logo: mastercardLogo, color: "#1A1F71" },
    { id: "moov",   label: "Moov Money",     sub: "Mobile Money",        logo: moovLogo,       color: "#0066B3" },
    { id: "mtn",    label: "MTN Money",      sub: "Mobile Money",        logo: mtnLogo,        color: "#FFCC00" },
    { id: "celtis", label: "Celtiis Cash",   sub: "Mobile Money",        color: "#E30613" },
    { id: "wave",   label: "Wave",           sub: "Paiement instantané", logo: waveLogo,       color: "#1DC8DC" },
    { id: "orange", label: "Orange Money",   sub: "Mobile Money",        logo: orangeLogo,     color: "#FF6600" },
  ];
  const PROVIDERS: Record<Exclude<PayMethod, "card">, { label: string; color: string; ussd: string; scheme: string; prefixes: string[] }> = {
    moov:   { label: "Moov Money",   color: "#0066B3", ussd: "*155#",      scheme: "moovmoney://pay", prefixes: ["96", "97", "98", "99"] },
    mtn:    { label: "MTN Money",    color: "#FFCC00", ussd: "*133*1#",    scheme: "mtnmomo://pay",  prefixes: ["90", "91", "92", "93"] },
    celtis: { label: "Celtiis Cash", color: "#E30613", ussd: "*135#",      scheme: "celtis://pay",   prefixes: ["55", "57", "61"] },
    wave:   { label: "Wave",         color: "#1DC8DC", ussd: "*999#",      scheme: "wave://send",    prefixes: ["7", "9"] },
    orange: { label: "Orange Money", color: "#FF6600", ussd: "#144*82*1#", scheme: "om://pay",       prefixes: ["07", "77", "78"] },
  };
  const isQr = paymentMethod !== "card";
  const provider = isQr ? PROVIDERS[paymentMethod as Exclude<PayMethod, "card">] : null;
  React.useEffect(() => { try { localStorage.setItem(PAY_PREF_KEY, paymentMethod); } catch {} }, [paymentMethod]);
  React.useEffect(() => { try { phone ? localStorage.setItem(PAY_PHONE_KEY, phone) : localStorage.removeItem(PAY_PHONE_KEY); } catch {} }, [phone]);

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 8 && phoneDigits.length <= 12;
  const formatPhone = (raw: string) => raw.replace(/\D/g, "").slice(0, 12).replace(/(\d{2})(?=\d)/g, "$1 ").trim();

  useSeo({ title: "Panier & paiement", description: "Validez votre commande IPPOO KRAAFT par Mobile Money, Wave ou carte bancaire.", noIndex: true });

  const handleCheckout = async () => {
    if (cartItems.length === 0) { toast.error("Votre panier est vide" ); return; }
    if (processing) return;
    if (isQr && !phoneValid) { toast.error("Numéro de téléphone invalide"); return; }

    setProcessing(true);
    const order = createOrder({
      method: paymentMethod,
      providerLabel: isQr ? provider!.label : "Carte bancaire",
      amount: total,
      items: cartItems.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity,
        thumb: product.images?.[0],
      })),
      customer: { name: user?.fullName || user?.name, email: user?.email, phone: user?.phone },
      payer: isQr ? { phone: `+228 ${phone}` } : undefined,
    });

    toast.loading(`Traitement avec ${order.providerLabel}…`, { id: order.ref });
    try {
      const result = await processOrder(order.ref);
      toast.dismiss(order.ref);
      if (result.status === "succeeded") {
        if (user?.email) {
          const earned = Math.max(0, Math.floor(total * loyaltyConfig.perFcfa));
          if (earned > 0) {
            adjustUserPoints(user.email, earned, `Commande ${order.ref}`);
            toast.success(`+${earned} pts fidélité (niveau ${tier.label})`);
          }
        }
        clearCart();
        toast.success("Paiement confirmé !");
        navigate(`/commande/${result.ref}`);
      } else {
        toast.error(`Paiement échoué — ${result.failureReason || "Veuillez réessayer"}`);
        navigate(`/commande/${result.ref}`);
      }
    } catch (err) {
      toast.dismiss(order.ref);
      toast.error(err instanceof Error ? err.message : "Erreur de paiement");
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center pb-20 lg:pb-6">
        <div className="w-20 h-20 rounded-full bg-[var(--ipk-surface)] flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-9 h-9 text-[var(--ipk-text)]" aria-hidden="true" />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 600, color: "var(--ipk-ink)" }}>Votre panier est vide</h1>
        <p className="text-[var(--ipk-text)] mt-2 mb-6" style={{ fontSize: "14px" }}>Découvrez nos créations artisanales authentiques.</p>
        <Link to="/boutique">
          <Button className="bg-[var(--ipk-green-dark)] text-white rounded-xl h-11 px-6">
            Voir la boutique <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-20 lg:pb-6">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Panier
      </h1>
      <p className="text-[var(--ipk-text)] mt-1 mb-6" style={{ fontSize: "14px" }}>{cartItems.length} article{cartItems.length > 1 ? "s" : ""}</p>

      <div className="space-y-4 mb-6">
        {cartItems.map(({ product: item, quantity }) => (
          <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-[var(--ipk-border)]">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <LazyImage src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="truncate" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{item.name}</h4>
              <p style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{item.origin.region}, {item.origin.country}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 border border-[var(--ipk-border)] rounded-lg">
                  <button onClick={() => updateQuantity(item.id, quantity - 1)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ipk-text)]" aria-label={`Diminuer la quantité de ${item.name}`}><Minus className="w-3 h-3" /></button>
                  <span style={{ fontSize: "13px", fontWeight: 600 }} aria-live="polite">{quantity}</span>
                  <button onClick={() => updateQuantity(item.id, quantity + 1)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ipk-text)]" aria-label={`Augmenter la quantité de ${item.name}`}><Plus className="w-3 h-3" /></button>
                </div>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--ipk-green)" }}>{formatPrice(item.price * quantity)}</span>
              </div>
            </div>
            <button
              onClick={() => { removeFromCart(item.id); toast.success(`${item.name} retiré du panier`); }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ipk-text)] hover:text-red-500 self-start"
              aria-label={`Retirer ${item.name} du panier`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Promo code */}
      <PromoCodeForm />


      {/* Summary */}
      <div className="bg-[var(--ipk-surface)] rounded-2xl p-5 space-y-3">
        <div className="flex justify-between" style={{ fontSize: "14px", color: "var(--ipk-text)" }}>
          <span>Sous-total</span><span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between" style={{ fontSize: "14px", color: "var(--ipk-text)" }}>
          <span>Livraison</span><span>Calculée au checkout</span>
        </div>
        <div className="border-t border-[var(--ipk-border)] pt-3 flex justify-between">
          <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>Total</span>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--ipk-green)" }}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Payment method selector */}
      <div className="mt-5 mb-4">
        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }} className="mb-3">Mode de paiement</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PAY_OPTIONS.map(opt => {
            const selected = paymentMethod === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setPaymentMethod(opt.id)}
                aria-pressed={selected}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all bg-white ${
                  selected ? "shadow-sm" : "border-[var(--ipk-border)] hover:border-[#3B4450]/30"
                }`}
                style={selected ? { borderColor: opt.color, backgroundColor: `${opt.color}10` } : undefined}
              >
                <div className="h-10 w-full flex items-center justify-center">
                  {opt.logo ? (
                    <img src={opt.logo} alt={opt.label} className="max-h-10 max-w-full object-contain" />
                  ) : opt.id === "card" ? (
                    <CreditCard className="w-7 h-7" style={{ color: opt.color }} />
                  ) : (
                    <div
                      className="px-2 py-1 rounded text-white text-center"
                      style={{ backgroundColor: opt.color, fontSize: "11px", fontWeight: 700 }}
                    >
                      {opt.label.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ipk-ink)" }} className="block leading-tight">{opt.label}</span>
                  <span style={{ fontSize: "10px", color: "var(--ipk-text)" }}>{opt.sub}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isQr && provider && (
        <div className="mb-4 p-4 rounded-xl border" style={{ borderColor: `${provider.color}40`, backgroundColor: `${provider.color}08` }}>
          <label htmlFor="pay-phone" className="block mb-2" style={{ fontSize: "12px", fontWeight: 600, color: "var(--ipk-ink)" }}>
            Numéro {provider.label}
          </label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 rounded-lg bg-white border border-[var(--ipk-border)]" style={{ fontSize: "13px", color: "var(--ipk-text)" }}>+228</span>
            <input
              id="pay-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              placeholder="90 12 34 56"
              aria-invalid={phone.length > 0 && !phoneValid}
              className="flex-1 px-3 py-2 rounded-lg bg-white border border-[var(--ipk-border)] focus:outline-none focus:ring-2"
              style={{ fontSize: "14px" }}
            />
          </div>
          <p className="mt-2" style={{ fontSize: "11px", color: "var(--ipk-text)" }}>
            Préfixes acceptés : {provider.prefixes.join(", ")} · USSD fallback : <strong>{provider.ussd}</strong>
          </p>
        </div>
      )}

      {crossSell.length > 0 && (
        <ProductRecommendations
          title="Complétez votre intérieur"
          subtitle="Cross-sell par domaine d'artisanat — sélection complémentaire à votre panier"
          products={crossSell}
          icon={<Sparkles className="w-3.5 h-3.5" />}
          accent="amber"
        />
      )}

      <Button
        onClick={handleCheckout}
        disabled={processing || (isQr && !phoneValid)}
        className="w-full rounded-xl h-12 text-white disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: isQr && provider ? provider.color : "var(--ipk-green-dark)" }}
      >
        {processing ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Traitement…</>
        ) : isQr ? (
          <><QrCode className="w-4 h-4 mr-2" /> Payer {formatPrice(total)} avec {provider?.label}</>
        ) : (
          <><CreditCard className="w-4 h-4 mr-2" /> Payer {formatPrice(total)} par carte</>
        )}
      </Button>
      <Link to="/boutique" className="block text-center mt-3 text-[var(--ipk-blue)]" style={{ fontSize: "14px" }}>
        Continuer mes achats
      </Link>

    </div>
  );
}
