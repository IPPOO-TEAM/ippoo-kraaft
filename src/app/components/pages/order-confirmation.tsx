import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { CheckCircle2, XCircle, Loader2, RefreshCw, Printer, ArrowLeft, Package, Receipt, Copy, Check, Clock, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { usePayments, type Order, type PaymentStatus } from "../../hooks/use-payments";
import { useStore } from "../../hooks/use-store";
import { formatPrice } from "../../data/mock-data";
import { useSeo } from "../../hooks/use-seo";
import { toast } from "sonner";

const STATUS_META: Record<PaymentStatus, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
  created: { label: "En attente", tone: "bg-slate-100 text-slate-700", icon: Clock },
  processing: { label: "En cours…", tone: "bg-blue-100 text-blue-700", icon: Loader2 },
  succeeded: { label: "Payée", tone: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  failed: { label: "Échec", tone: "bg-red-100 text-red-700", icon: XCircle },
  refunded: { label: "Remboursée", tone: "bg-amber-100 text-amber-700", icon: RefreshCw },
  expired: { label: "Expirée", tone: "bg-gray-100 text-gray-700", icon: AlertTriangle },
};

export function OrderConfirmationPage() {
  const { ref } = useParams<{ ref: string }>();
  const navigate = useNavigate();
  const { getOrder, retryOrder } = usePayments();
  const { clearCart } = useStore();
  const order: Order | undefined = ref ? getOrder(ref) : undefined;
  const [retrying, setRetrying] = useState(false);
  const [copied, setCopied] = useState(false);

  useSeo({ title: order ? `Commande ${order.ref}` : "Commande introuvable", description: "Détails de votre commande IPPOO KRAAFT" });

  useEffect(() => {
    if (order?.status === "succeeded") {
      try { clearCart(); } catch {}
    }
  }, [order?.status, clearCart]);

  const meta = useMemo(() => order ? STATUS_META[order.status] : null, [order]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <h1 className="text-xl font-medium mb-2">Commande introuvable</h1>
        <p className="text-sm text-muted-foreground mb-6">La référence « {ref} » n'existe pas ou a expiré.</p>
        <Button onClick={() => navigate("/boutique")} className="bg-[var(--ipk-green-dark)] text-white">Retour à la boutique</Button>
      </div>
    );
  }

  const Icon = meta!.icon;
  const isPending = order.status === "created" || order.status === "processing";

  const onRetry = async () => {
    setRetrying(true);
    const tid = toast.loading("Nouvelle tentative…");
    try {
      const r = await retryOrder(order.ref);
      if (r.status === "succeeded") toast.success("Paiement confirmé !", { id: tid });
      else toast.error(r.failureReason || "Échec du paiement", { id: tid });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur", { id: tid });
    } finally {
      setRetrying(false);
    }
  };

  const onCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(order.ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onPrint = () => window.print();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 print:hidden">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <div className="bg-white rounded-2xl border border-[var(--ipk-border)] overflow-hidden">
        <div className={`p-6 text-center ${order.status === "succeeded" ? "bg-emerald-50" : order.status === "failed" ? "bg-red-50" : "bg-slate-50"}`}>
          <Icon className={`w-12 h-12 mx-auto mb-2 ${order.status === "succeeded" ? "text-emerald-600" : order.status === "failed" ? "text-red-600" : "text-slate-600"} ${order.status === "processing" ? "animate-spin" : ""}`} />
          <Badge className={`${meta!.tone} border-0 mb-2`}>{meta!.label}</Badge>
          <h1 className="text-xl font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
            {order.status === "succeeded" ? "Merci pour votre commande !" :
              order.status === "failed" ? "Le paiement a échoué" :
              order.status === "refunded" ? "Commande remboursée" :
              order.status === "expired" ? "Commande expirée" :
              "Paiement en cours…"}
          </h1>
          {order.status === "failed" && order.failureReason && (
            <p className="text-sm text-red-700 mt-1">{order.failureReason}</p>
          )}
          {order.status === "succeeded" && (
            <p className="text-sm text-muted-foreground mt-1">Un reçu a été généré. Conservez la référence.</p>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs text-muted-foreground">Référence commande</div>
              <div className="font-mono text-sm">{order.ref}</div>
            </div>
            <Button variant="outline" size="sm" onClick={onCopyRef} className="gap-1.5 print:hidden">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copié" : "Copier"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Méthode</div>
              <div>{order.providerLabel}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Date</div>
              <div>{new Date(order.createdAt).toLocaleString("fr-FR")}</div>
            </div>
            {order.transactionId && (
              <div>
                <div className="text-xs text-muted-foreground">Transaction</div>
                <div className="font-mono text-xs break-all">{order.transactionId}</div>
              </div>
            )}
            {order.receipt && (
              <div>
                <div className="text-xs text-muted-foreground">N° reçu</div>
                <div className="font-mono text-xs">{order.receipt.number}</div>
              </div>
            )}
            {order.payer?.phone && (
              <div>
                <div className="text-xs text-muted-foreground">Payeur</div>
                <div>{order.payer.phone}</div>
              </div>
            )}
            {order.attempts > 1 && (
              <div>
                <div className="text-xs text-muted-foreground">Tentatives</div>
                <div>{order.attempts}</div>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--ipk-border)] pt-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5"><Package className="w-4 h-4" /> Articles</h3>
            <ul className="divide-y divide-[var(--ipk-border)]">
              {order.items.map((it, i) => (
                <li key={`${it.productId}-${i}`} className="py-2 flex items-center gap-3">
                  {it.thumb && <img src={it.thumb} alt="" className="w-10 h-10 rounded object-cover" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.quantity} × {formatPrice(it.unitPrice)}</div>
                  </div>
                  <div className="text-sm font-medium">{formatPrice(it.unitPrice * it.quantity)}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[var(--ipk-border)] pt-4 flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-medium">{formatPrice(order.amount)}</span>
          </div>

          <div className="flex gap-2 flex-wrap pt-2 print:hidden">
            {order.status === "failed" && (
              <Button onClick={onRetry} disabled={retrying} className="bg-[var(--ipk-green-dark)] text-white gap-1.5">
                {retrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Réessayer le paiement
              </Button>
            )}
            {order.status === "succeeded" && (
              <Button onClick={onPrint} variant="outline" className="gap-1.5">
                <Printer className="w-4 h-4" /> Imprimer le reçu
              </Button>
            )}
            {isPending && (
              <Button disabled className="gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin" /> Traitement…
              </Button>
            )}
            <Link to="/boutique"><Button variant="outline">Continuer mes achats</Button></Link>
            {order.customer.email && (
              <Link to="/compte"><Button variant="ghost" className="gap-1.5"><Receipt className="w-4 h-4" /> Mes commandes</Button></Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
