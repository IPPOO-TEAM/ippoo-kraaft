import { useEffect, useState } from "react";
import { Star, Send, ShieldCheck, Lock } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useUser } from "../hooks/use-user";
import { usePurchaseCheck } from "../hooks/use-purchase-check";
import { useMarketing } from "../hooks/use-marketing";
import { REVIEW_BONUS_POINTS } from "../hooks/use-loyalty-tiers";

interface Review {
  rating: number;
  comment: string;
  author: string;
  date: string;
  approved?: boolean;
  flagged?: boolean;
  verified?: boolean;
  authorEmail?: string;
  reply?: { text: string; author: string; date: string };
}

interface Props {
  productId: string;
}

const KEY = "ipk:reviews:v1";

function loadAll(): Record<string, Review[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function ReviewForm({ productId }: Props) {
  const { user } = useUser();
  const purchased = usePurchaseCheck(productId, user?.email);
  const { adjustUserPoints } = useMarketing();
  const alreadyReviewed = !!user && (loadAll()[productId] || []).some(r => r.authorEmail?.toLowerCase() === user.email.toLowerCase());
  const canReview = !!user && purchased && !alreadyReviewed;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState(user?.fullName || "");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setReviews(loadAll()[productId] || []);
  }, [productId]);

  useEffect(() => {
    if (user?.fullName && !author) setAuthor(user.fullName);
  }, [user?.fullName, author]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReview) return;
    if (rating === 0) { toast.error("Sélectionnez une note"); return; }
    if (comment.trim().length < 10) { toast.error("Commentaire trop court (10 caractères min)"); return; }
    const review: Review = {
      rating,
      comment: comment.trim(),
      author: author.trim() || user?.fullName || "Anonyme",
      authorEmail: user?.email,
      verified: true,
      approved: false,
      date: new Date().toISOString(),
    };
    const all = loadAll();
    const updated = [review, ...(all[productId] || [])];
    all[productId] = updated;
    localStorage.setItem(KEY, JSON.stringify(all));
    setReviews(updated);
    setRating(0); setComment("");
    if (user?.email) adjustUserPoints(user.email, REVIEW_BONUS_POINTS, `Avis vérifié sur produit ${productId}`);
    toast.success(`Merci ! +${REVIEW_BONUS_POINTS} pts fidélité — votre avis sera publié après modération.`);
  };

  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: "var(--ipk-ink)" }}>
        Avis clients ({reviews.length})
      </h2>

      {!canReview ? (
        <div className="bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-2xl p-4 sm:p-5 mb-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-[var(--ipk-text)] mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            {!user ? (
              <>
                <div className="text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 600 }}>Connectez-vous pour laisser un avis</div>
                <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "12px" }}>Seuls les clients ayant acheté ce produit peuvent publier un avis.</p>
                <div className="mt-2 flex gap-2">
                  <Link to="/connexion" className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "12px", fontWeight: 500 }}>Se connecter</Link>
                  <Link to="/inscription" className="inline-flex items-center px-3 py-1.5 rounded-xl border border-[var(--ipk-border)] text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 500 }}>Créer un compte</Link>
                </div>
              </>
            ) : alreadyReviewed ? (
              <>
                <div className="text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 600 }}>Vous avez déjà publié un avis</div>
                <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "12px" }}>Un seul avis par client et par produit.</p>
              </>
            ) : (
              <>
                <div className="text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 600 }}>Achat requis pour donner un avis</div>
                <p className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "12px" }}>Cette fiche est réservée aux clients vérifiés. Une fois votre commande livrée, vous pourrez la noter ici.</p>
              </>
            )}
          </div>
        </div>
      ) : (
      <form onSubmit={submit} className="bg-white border border-[var(--ipk-border)] rounded-2xl p-4 sm:p-5 mb-4">
        <div className="mb-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: "11px", fontWeight: 600 }}>
          <ShieldCheck className="w-3.5 h-3.5" /> Achat vérifié — vous pouvez noter ce produit
        </div>
        <label className="block mb-2" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ipk-ink)" }}>Votre note</label>
        <div className="flex gap-1 mb-3" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`Donner ${n} étoile${n > 1 ? "s" : ""}`}
              className="p-1"
            >
              <Star className={`w-6 h-6 ${(hover || rating) >= n ? "fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" : "text-[var(--ipk-border)]"}`} />
            </button>
          ))}
        </div>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Votre nom (optionnel)"
          className="w-full border border-[var(--ipk-border)] rounded-xl px-3 py-2 mb-2"
          style={{ fontSize: "14px" }}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience…"
          rows={3}
          className="w-full border border-[var(--ipk-border)] rounded-xl px-3 py-2 mb-3 resize-none"
          style={{ fontSize: "14px" }}
        />
        <Button type="submit" className="bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-10 px-5">
          <Send className="w-4 h-4 mr-2" /> Publier l'avis
        </Button>
      </form>
      )}

      {(() => {
        const visible = reviews.filter(r => !r.flagged && r.approved !== false);
        if (visible.length === 0) return null;
        return (
          <ul className="space-y-3">
            {visible.map((r, i) => (
              <li key={i} className="bg-[var(--ipk-surface)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ipk-ink)" }}>{r.author}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700" style={{ fontSize: "10px", fontWeight: 700 }} title="Cet avis a été déposé par un client vérifié">
                        <ShieldCheck className="w-3 h-3" /> Achat vérifié
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--ipk-text)" }}>{new Date(r.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className={`w-3.5 h-3.5 ${k < r.rating ? "fill-[var(--ipk-amber)] text-[var(--ipk-amber)]" : "text-[var(--ipk-border)]"}`} />
                  ))}
                </div>
                <p style={{ fontSize: "13px", color: "var(--ipk-text)", lineHeight: 1.6 }}>{r.comment}</p>
                {r.reply && (
                  <div className="mt-3 ml-3 pl-3 border-l-2 border-[var(--ipk-green-dark)]">
                    <div className="text-[var(--ipk-ink)]" style={{ fontSize: "12px", fontWeight: 600 }}>
                      Réponse de {r.reply.author} <span className="text-[var(--ipk-text)]" style={{ fontWeight: 400 }}>· {new Date(r.reply.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <p className="text-[var(--ipk-text)] mt-0.5" style={{ fontSize: "12px", lineHeight: 1.5 }}>{r.reply.text}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        );
      })()}
    </section>
  );
}
