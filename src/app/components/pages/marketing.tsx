import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  Sparkles, Trophy, Gift, Ticket, Calendar, RotateCw, Copy, Check,
  Clock, Flame, Tag, ArrowRight, ChevronRight, Star, Users, MapPin,
  Bell, BellOff, ThumbsUp, Award, Medal, Crown,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Coupon } from "../coupon-art";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { rewardToast } from "../reward-toast";
import { useSeo } from "../../hooks/use-seo";
import { useMarketing } from "../../hooks/use-marketing";
import {
  promotions, flashDeals, contests, wheelPrizes, giftCardOffers, marketDays, giftTickets,
  CONTEST_KIND_LABEL, CONTEST_RANKING_LABEL, type ContestKind,
} from "../../data/marketing-data";
import { formatPrice } from "../../data/mock-data";

// ============= Helpers =============
function useCountdown(target: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, expired: diff === 0 };
}

function CountdownPill({ target, compact, dark }: { target: string; compact?: boolean; dark?: boolean }) {
  const { d, h, m, s, expired } = useCountdown(target);
  if (expired) return <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">Terminé</span>;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-full ${dark ? "bg-black/30" : "bg-white/20"}`}>
      <Clock className="w-3 h-3" />
      {compact ? `${pad(h + d * 24)}:${pad(m)}:${pad(s)}` : `${d}j ${pad(h)}:${pad(m)}:${pad(s)}`}
    </span>
  );
}

function CopyCode({ code, light }: { code: string; light?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(code); setDone(true); toast.success(`Code « ${code} » copié`); setTimeout(() => setDone(false), 1500); } catch {}
      }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs ${light ? "bg-white/20 hover:bg-white/30" : "bg-[var(--ipk-green-dark)]/10 text-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-dark)]/20"}`}
    >
      {done ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {code}
    </button>
  );
}

function PageHero({ icon: Icon, eyebrow, title, subtitle }: { icon: typeof Tag; eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-[var(--ipk-green-dark)] mb-2"><Icon className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">{eyebrow}</span></div>
      <h1 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>{title}</h1>
      <p className="text-[var(--ipk-text)]" style={{ fontSize: "15px" }}>{subtitle}</p>
    </div>
  );
}

// ============= PROMOTIONS =============
const SEGMENT_LABEL: Record<string, string> = { all: "Tous", new: "Nouveau client", loyalty: "Fidélité" };

function PromoBadge({ kind, value }: { kind: "percent" | "fixed"; value: number }) {
  if (kind === "percent") {
    return (
      <div className="text-center">
        <div className="leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700 }}>-{value}%</div>
        <div className="text-[10px] uppercase opacity-80 mt-1">remise</div>
      </div>
    );
  }
  return (
    <div className="text-center">
      <div className="leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>{formatPrice(value)}</div>
      <div className="text-[10px] uppercase opacity-80 mt-1">offerts</div>
    </div>
  );
}

export function PromotionsPage() {
  useSeo({ title: "Promotions - IPPOO KRAAFT", description: "Profitez des promotions du moment sur l'artisanat togolais." });
  const [filter, setFilter] = useState<"all" | "new" | "loyalty" | "artisan">("all");
  const { promotions: livePromotions } = useMarketing();
  const filtered = livePromotions.filter(p => {
    if (p.disabled) return false;
    if (filter === "all") return true;
    if (filter === "artisan") return !!p.artisanSlug;
    return p.segment === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <PageHero icon={Tag} eyebrow="Bons plans" title="Promotions du moment" subtitle="Codes valables sur la boutique en ligne et au showroom de Lomé." />

      <div className="flex flex-wrap gap-2 mb-5">
        {([
          { id: "all", label: "Toutes" },
          { id: "new", label: "Nouveaux clients" },
          { id: "loyalty", label: "Fidélité" },
          { id: "artisan", label: "Par artisan" },
        ] as const).map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs transition ${filter === f.id ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-green-dark)]/10"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <Coupon
            key={p.id}
            theme={p.style.theme}
            pattern={p.style.pattern}
            eyebrow={p.category}
            title={p.title}
            subtitle={p.description}
            badge={<PromoBadge kind={p.kind} value={p.value} />}
            footer={
              <>
                <CopyCode code={p.code} light />
                <span>Jusqu'au {new Date(p.validUntil).toLocaleDateString("fr-FR")}</span>
                <Link to={p.artisanSlug ? `/artisan/${p.artisanSlug}` : "/boutique"} className="inline-flex items-center gap-1 hover:underline">
                  {p.artisanSlug ? p.artisanName || "Artisan" : "Boutique"} <ArrowRight className="w-3 h-3" />
                </Link>
              </>
            }
          >
            <div className="flex flex-wrap gap-1.5 mt-1">
              {p.segment !== "all" && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25">{SEGMENT_LABEL[p.segment]}</span>
              )}
              {p.minCart && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25">Min. {formatPrice(p.minCart)}</span>
              )}
              {p.artisanName && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25">{p.artisanName}</span>
              )}
            </div>
          </Coupon>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link to="/flash"><Coupon theme="rose" pattern="rays" variant="stamp" badge={<Flame className="w-5 h-5" />} eyebrow="En cours" title="Ventes flash" subtitle="Comptes à rebours" /></Link>
        <Link to="/roue"><Coupon theme="fuchsia" pattern="diamonds" variant="stamp" badge={<RotateCw className="w-5 h-5" />} eyebrow="Quotidien" title="Roue de la fortune" subtitle="Tentez votre chance" /></Link>
        <Link to="/jour-de-marche"><Coupon theme="amber" pattern="kente" variant="stamp" badge={<Calendar className="w-5 h-5" />} eyebrow="Programme" title="Jour de marché" subtitle="Cette semaine" /></Link>
      </div>
    </div>
  );
}

// ============= FLASH =============
const FLASH_SUBS_KEY = "ipk:marketing:flashSubs:v1";
const FLASH_NOTIFIED_KEY = "ipk:marketing:flashNotified:v1";

function loadFlashSubs(): string[] {
  try { const r = localStorage.getItem(FLASH_SUBS_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function saveFlashSubs(ids: string[]) { try { localStorage.setItem(FLASH_SUBS_KEY, JSON.stringify(ids)); } catch {} }
function loadNotified(): Record<string, string[]> {
  try { const r = localStorage.getItem(FLASH_NOTIFIED_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function saveNotified(m: Record<string, string[]>) { try { localStorage.setItem(FLASH_NOTIFIED_KEY, JSON.stringify(m)); } catch {} }

export function FlashPage() {
  useSeo({ title: "Ventes flash - IPPOO KRAAFT", description: "Pièces d'exception à prix éclair, stocks limités." });
  const { flashDeals: liveFlash } = useMarketing();
  const flashDeals = liveFlash.filter(d => !d.disabled);
  const [subs, setSubs] = useState<string[]>(() => loadFlashSubs());
  useEffect(() => saveFlashSubs(subs), [subs]);

  useEffect(() => {
    const onBroadcast = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string };
      const d = liveFlash.find(x => x.id === detail.id);
      if (!d) return;
      const msg = `Nouvelle vente flash : « ${d.productName} » à ${new Intl.NumberFormat("fr-FR").format(d.flashPrice)} F !`;
      toast(msg, { icon: "⚡" });
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try { new Notification("IPPOO KRAAFT - Vente flash", { body: msg }); } catch {}
      }
    };
    window.addEventListener("ipk:flash:broadcast", onBroadcast);
    return () => window.removeEventListener("ipk:flash:broadcast", onBroadcast);
  }, [liveFlash]);

  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(typeof Notification !== "undefined" ? Notification.permission : "denied");
  const requestNotif = async () => {
    if (typeof Notification === "undefined") { toast.error("Notifications non supportées par ce navigateur"); return; }
    if (Notification.permission === "granted") { setNotifPerm("granted"); toast.info("Notifications déjà activées"); return; }
    const p = await Notification.requestPermission();
    setNotifPerm(p);
    if (p === "granted") toast.success("Notifications navigateur activées");
    else toast.info("Notifications refusées - vous serez alerté en page");
  };
  const pushNative = (title: string) => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try { new Notification("IPPOO KRAAFT - Vente flash", { body: title, icon: "/favicon.ico" }); } catch {}
    }
  };

  const toggleSub = (id: string, name: string) => {
    setSubs(prev => {
      if (prev.includes(id)) {
        toast.info(`Notifications désactivées pour « ${name} »`);
        return prev.filter(x => x !== id);
      }
      toast.success(`Vous serez alerté pour « ${name} »`);
      return [...prev, id];
    });
  };

  // Watcher : alertes stock bas / temps restant pour les deals abonnés
  useEffect(() => {
    if (subs.length === 0) return;
    const tick = () => {
      const notified = loadNotified();
      const now = Date.now();
      let changed = false;
      for (const id of subs) {
        const d = flashDeals.find(x => x.id === id);
        if (!d) continue;
        const msLeft = new Date(d.endsAt).getTime() - now;
        const events: { kind: string; label: string }[] = [];
        if (msLeft > 0 && msLeft < 60 * 60 * 1000) events.push({ kind: "1h", label: `« ${d.productName} » se termine dans moins d'1 h` });
        if (d.stockLeft <= 3 && d.stockLeft > 0) events.push({ kind: `low${d.stockLeft}`, label: `Plus que ${d.stockLeft} « ${d.productName} » en stock` });
        if (msLeft <= 0) events.push({ kind: "ended", label: `« ${d.productName} » terminée` });
        const sent = notified[id] || [];
        for (const ev of events) {
          if (!sent.includes(ev.kind)) {
            toast(ev.label, { icon: "⚡" });
            pushNative(ev.label);
            sent.push(ev.kind); changed = true;
          }
        }
        notified[id] = sent;
      }
      if (changed) saveNotified(notified);
    };
    tick();
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, [subs]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <Coupon
        theme="rose"
        pattern="rays"
        variant="stamp"
        eyebrow="Limité dans le temps"
        title="Ventes Flash"
        subtitle="Pièces uniques, prix cassés, stocks limités. Quand c'est parti, c'est parti."
        className="mb-8 min-h-[140px]"
        badge={<Flame className="w-7 h-7" />}
      />

      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap p-3 rounded-2xl bg-[var(--ipk-surface)] border border-[var(--ipk-border)]">
        <div className="flex items-center gap-2 min-w-0">
          <Bell className="w-4 h-4 text-[var(--ipk-green-dark)]" />
          <span style={{ fontSize: "13px" }}>
            {notifPerm === "granted" ? "Notifications navigateur activées." : "Recevez les alertes flash en notification système."}
          </span>
        </div>
        {notifPerm !== "granted" && (
          <button
            type="button"
            onClick={requestNotif}
            className="px-3 py-1.5 rounded-full bg-[var(--ipk-green-dark)] text-white"
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            Activer les notifications
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashDeals.map(d => {
          const pct = Math.round((1 - d.flashPrice / d.basePrice) * 100);
          const sold = Math.round(((d.totalStock - d.stockLeft) / d.totalStock) * 100);
          return (
            <Coupon
              key={d.id}
              theme={d.style.theme}
              pattern={d.style.pattern}
              eyebrow="Flash"
              title={d.productName}
              badge={
                <div className="text-center">
                  <div className="leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700 }}>-{pct}%</div>
                  <CountdownPill target={d.endsAt} compact dark />
                </div>
              }
              footer={
                <>
                  <span className="font-mono">{formatPrice(d.flashPrice)} <span className="line-through opacity-60 ml-1">{formatPrice(d.basePrice)}</span></span>
                  <button
                    type="button"
                    onClick={() => toggleSub(d.id, d.productName)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 text-[11px]"
                    aria-label={subs.includes(d.id) ? "Désactiver les alertes" : "Être alerté"}
                  >
                    {subs.includes(d.id) ? <><BellOff className="w-3 h-3" /> Alerté</> : <><Bell className="w-3 h-3" /> M'alerter</>}
                  </button>
                  <Link to="/boutique" className="inline-flex items-center gap-1 hover:underline">J'en profite <ArrowRight className="w-3 h-3" /></Link>
                </>
              }
            >
              <div className="mt-2">
                <div className="flex justify-between text-[11px] opacity-90 mb-1"><span>{d.stockLeft} restants</span><span>{sold}% vendu</span></div>
                <div className="h-1.5 bg-black/25 rounded-full overflow-hidden"><div className="h-full bg-white/80" style={{ width: `${sold}%` }} /></div>
              </div>
            </Coupon>
          );
        })}
      </div>
    </div>
  );
}

// ============= CONCOURS =============
const VOTER_EMAIL_KEY = "ipk:marketing:voterEmail:v1";
const KIND_ICON: Record<ContestKind, typeof Trophy> = { buyer: Users, artisan: Award, design: Sparkles, share: Star };

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-4 h-4 text-amber-500" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-700" />;
  return <span className="w-4 text-center text-xs text-[var(--ipk-text)]">#{rank}</span>;
}

export function ConcoursPage() {
  useSeo({ title: "Concours - IPPOO KRAAFT", description: "Participez à nos concours et tentez de gagner des œuvres uniques." });
  const { enterContest, contestEntries, voteForEntry, hasVoted, rankingFor, badgesFor, contests: liveContests } = useMarketing();
  const contests = liveContests.filter(c => !c.disabled);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resultsId, setResultsId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submission, setSubmission] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | ContestKind>("all");
  const [voterEmail, setVoterEmail] = useState<string>(() => { try { return localStorage.getItem(VOTER_EMAIL_KEY) || ""; } catch { return ""; } });

  useEffect(() => { try { voterEmail ? localStorage.setItem(VOTER_EMAIL_KEY, voterEmail) : localStorage.removeItem(VOTER_EMAIL_KEY); } catch {} }, [voterEmail]);

  const active = contests.find(c => c.id === activeId);
  const results = contests.find(c => c.id === resultsId);
  const filtered = contests.filter(c => kindFilter === "all" || c.kind === kindFilter);
  const myBadges = voterEmail ? badgesFor(voterEmail) : [];

  const submit = () => {
    if (!active) return;
    if (!name.trim() || !email.trim()) { toast.error("Nom et email requis"); return; }
    if (contestEntries.some(e => e.contestId === active.id && e.email.toLowerCase() === email.toLowerCase())) {
      toast.error("Vous avez déjà participé à ce concours"); return;
    }
    if (active.submission && !submission.trim()) { toast.error(`${active.submission.label} requis`); return; }
    enterContest({
      contestId: active.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      submission: submission.trim() || undefined,
    });
    toast.success("Participation enregistrée - badge « Premier pas » obtenu !");
    setActiveId(null); setName(""); setEmail(""); setPhone(""); setSubmission("");
  };

  const handleVote = (entryId: string) => {
    if (!voterEmail.trim() || !voterEmail.includes("@")) { toast.error("Renseignez votre email pour voter"); return; }
    const r = voteForEntry({ entryId, voterEmail: voterEmail.trim() });
    if (r.ok) toast.success(`Vote enregistré (${r.total} vote${r.total > 1 ? "s" : ""})`);
    else toast.error(r.reason);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <PageHero icon={Trophy} eyebrow="Jeux & concours" title="Concours en cours" subtitle="Acheteur, artisan, design ou partage : participez gratuitement et gagnez des badges." />

      <div className="flex flex-wrap gap-2 mb-5">
        {([
          { id: "all", label: "Tous" },
          { id: "buyer", label: "Acheteur" },
          { id: "artisan", label: "Artisan" },
          { id: "design", label: "Design" },
          { id: "share", label: "Partage" },
        ] as const).map(f => (
          <button
            key={f.id}
            onClick={() => setKindFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs transition ${kindFilter === f.id ? "bg-[var(--ipk-green-dark)] text-white" : "bg-[var(--ipk-surface)] text-[var(--ipk-text)] hover:bg-[var(--ipk-green-dark)]/10"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Identité voteur + badges */}
      <div className="mb-6 p-4 rounded-2xl bg-[var(--ipk-surface)] flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Award className="w-5 h-5 text-[var(--ipk-green-dark)]" />
          <input
            type="email" value={voterEmail} onChange={e => setVoterEmail(e.target.value)}
            placeholder="Votre email pour voter"
            className="flex-1 px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {myBadges.length === 0 ? (
            <span className="text-xs text-[var(--ipk-text)]">Aucun badge - participez ou votez pour en gagner !</span>
          ) : myBadges.map(b => (
            <span key={b.id} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-[var(--ipk-green-dark)]/10 text-[var(--ipk-green-dark)]">
              <Star className="w-3 h-3" /> {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => {
          const KindIcon = KIND_ICON[c.kind];
          const ranking = rankingFor(c.id);
          const top = ranking.slice(0, 3);
          return (
            <Coupon
              key={c.id}
              theme={c.style.theme}
              pattern={c.style.pattern}
              eyebrow={`${CONTEST_KIND_LABEL[c.kind]} · ${CONTEST_RANKING_LABEL[c.ranking]}`}
              title={c.title}
              subtitle={c.prize}
              badge={<KindIcon className="w-7 h-7" />}
              footer={
                <>
                  <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {c.participants + ranking.length}</span>
                  <CountdownPill target={c.endsAt} dark />
                  <button onClick={() => setResultsId(c.id)} className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 text-xs">Classement</button>
                  <Link to={`/concours/${c.id}/resultats`} className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 text-xs">Résultats</Link>
                  <button onClick={() => setActiveId(c.id)} className="px-3 py-1 rounded-md bg-white text-fuchsia-700 hover:bg-white/90 font-medium">Je participe</button>
                </>
              }
            >
              <p className="text-sm opacity-90">{c.description}</p>
              {c.ranking === "votes" && top.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="text-[10px] uppercase tracking-widest opacity-80">Top 3 actuel</div>
                  {top.map(e => (
                    <div key={e.id} className="flex items-center gap-2 text-xs bg-black/20 rounded-md px-2 py-1">
                      <RankIcon rank={e.rank} />
                      <span className="flex-1 truncate">{e.name}</span>
                      <span className="font-mono">{e.votes} ♥</span>
                    </div>
                  ))}
                </div>
              )}
              <details className="mt-2 text-xs opacity-90">
                <summary className="cursor-pointer">Règlement</summary>
                <ul className="mt-1 list-disc list-inside space-y-0.5">{c.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </details>
            </Coupon>
          );
        })}
      </div>

      {/* Modale participation */}
      {active && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={() => setActiveId(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-3" onClick={e => e.stopPropagation()}>
            <h3 className="font-medium" style={{ fontSize: "18px" }}>Participer - {active.title}</h3>
            <div className="text-xs text-[var(--ipk-text)]">{CONTEST_KIND_LABEL[active.kind]} · {CONTEST_RANKING_LABEL[active.ranking]}</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom complet" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm" />
            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="Téléphone (facultatif)" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm" />
            {active.submission && (
              active.submission.type === "image" ? (
                <input value={submission} onChange={e => setSubmission(e.target.value)} type="url" placeholder={active.submission.label} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm" />
              ) : (
                <textarea value={submission} onChange={e => setSubmission(e.target.value)} placeholder={active.submission.label} className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm h-24 resize-none" />
              )
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveId(null)} className="flex-1">Annuler</Button>
              <Button onClick={submit} className="flex-1 bg-[var(--ipk-green-dark)] text-white">Valider</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modale classement / résultats */}
      {results && (() => {
        const ranking = rankingFor(results.id);
        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={() => setResultsId(null)}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-[var(--ipk-border)]">
                <h3 className="font-medium" style={{ fontSize: "18px" }}>{results.title}</h3>
                <p className="text-xs text-[var(--ipk-text)] mt-1">{CONTEST_KIND_LABEL[results.kind]} · {CONTEST_RANKING_LABEL[results.ranking]} · {ranking.length} participation{ranking.length > 1 ? "s" : ""}</p>
              </div>
              <div className="p-5 overflow-y-auto flex-1">
                {ranking.length === 0 ? (
                  <p className="text-sm text-[var(--ipk-text)] text-center py-8">Aucune participation pour l'instant. Soyez le premier !</p>
                ) : (
                  <ul className="space-y-2">
                    {ranking.map(e => {
                      const voted = voterEmail ? hasVoted(e.id, voterEmail) : false;
                      return (
                        <li key={e.id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--ipk-border)]">
                          <div className="w-8 flex justify-center"><RankIcon rank={e.rank} /></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{e.name}</div>
                            {e.submission && (
                              <div className="text-xs text-[var(--ipk-text)] truncate">{e.submission}</div>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 font-mono text-sm">{e.votes}<ThumbsUp className="w-3.5 h-3.5" /></span>
                          {results.ranking === "votes" && (
                            <button
                              type="button"
                              onClick={() => handleVote(e.id)}
                              disabled={voted}
                              className={`px-2.5 py-1 rounded-md text-xs ${voted ? "bg-[var(--ipk-surface)] text-[var(--ipk-text)] cursor-default" : "bg-[var(--ipk-green-dark)] text-white hover:bg-[var(--ipk-green-darker)]"}`}
                            >
                              {voted ? "Voté" : "Voter"}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="p-4 border-t border-[var(--ipk-border)]">
                <Button variant="outline" onClick={() => setResultsId(null)} className="w-full">Fermer</Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export function ContestResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const { rankingFor, badgesFor, contests: liveContests } = useMarketing();
  const contest = liveContests.find(c => c.id === id);
  useSeo({
    title: contest ? `Résultats - ${contest.title}` : "Résultats du concours",
    description: contest ? `Classement officiel : ${contest.title}` : "Classement du concours IPK",
  });

  if (!contest) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Trophy className="w-10 h-10 mx-auto mb-3 text-[var(--ipk-text-muted)]" />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700 }}>Concours introuvable</h1>
        <Link to="/concours" className="inline-flex items-center gap-1 mt-4 text-[var(--ipk-green-dark)] hover:underline">
          <ArrowRight className="w-4 h-4 rotate-180" /> Retour aux concours
        </Link>
      </div>
    );
  }

  const ranking = rankingFor(contest.id);
  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);
  const ended = new Date(contest.endsAt) < new Date();
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `Résultats - ${contest.title}`, url });
      else { await navigator.clipboard.writeText(url); toast.success("Lien copié"); }
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <div className="mb-4">
        <Link to="/concours" className="inline-flex items-center gap-1 text-sm text-[var(--ipk-text-muted)] hover:underline">
          <ArrowRight className="w-3 h-3 rotate-180" /> Tous les concours
        </Link>
      </div>

      <div className="rounded-3xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B6B3A 0%, #B45309 60%, #C026D3 100%)" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0 6px, transparent 6px 14px)" }} />
        <div className="relative">
          <div className="opacity-90" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {CONTEST_KIND_LABEL[contest.kind]} · {CONTEST_RANKING_LABEL[contest.ranking]}
          </div>
          <h1 className="mt-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700 }}>{contest.title}</h1>
          <p className="opacity-90 mt-2" style={{ fontSize: "14px" }}>{contest.prize}</p>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-white/20" style={{ fontSize: "11px" }}>
              {ended ? "Terminé" : "En cours"} · Fin {new Date(contest.endsAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/20" style={{ fontSize: "11px" }}>{ranking.length} participation{ranking.length > 1 ? "s" : ""}</span>
            <button onClick={share} className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[var(--ipk-ink)] hover:bg-white/90" style={{ fontSize: "12px", fontWeight: 600 }}>
              Partager
            </button>
          </div>
        </div>
      </div>

      {ranking.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[var(--ipk-border)]">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-[var(--ipk-text-muted)]" />
          <p className="text-[var(--ipk-text)]">Aucune participation pour l'instant.</p>
          <Link to="/concours" className="inline-block mt-3 px-4 py-2 rounded-full bg-[var(--ipk-green-dark)] text-white" style={{ fontSize: "13px" }}>Participer</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6 items-end">
            {[1, 0, 2].map(i => {
              const e = podium[i];
              if (!e) return <div key={i} />;
              const heights = ["h-32", "h-40", "h-24"];
              const tones = ["from-amber-300 to-amber-500", "from-yellow-400 to-yellow-600", "from-orange-300 to-orange-500"];
              const medals = ["🥈", "🥇", "🥉"];
              const order = [1, 0, 2].indexOf(i);
              const winnerBadges = badgesFor(e.email).filter(b => b.contestId === contest.id);
              return (
                <div key={e.id} className="flex flex-col items-center gap-2">
                  <div className="text-3xl">{medals[order]}</div>
                  <div className="text-center min-w-0 w-full">
                    <div className="truncate" style={{ fontSize: "13px", fontWeight: 700 }}>{e.name}</div>
                    <div className="text-[var(--ipk-text-muted)] inline-flex items-center gap-1 justify-center" style={{ fontSize: "11px" }}>
                      {e.votes} <ThumbsUp className="w-3 h-3" />
                    </div>
                    {winnerBadges.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1 justify-center">
                        {winnerBadges.slice(0, 2).map(b => (
                          <span key={b.id} className="px-1.5 py-0.5 rounded-full bg-[#B45309]/10 text-[#B45309]" style={{ fontSize: "10px" }}>{b.label}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`w-full ${heights[order]} rounded-t-2xl bg-gradient-to-b ${tones[order]} flex items-start justify-center pt-2`}>
                    <span className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>#{e.rank}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {rest.length > 0 && (
            <div className="bg-white rounded-2xl border border-[var(--ipk-border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--ipk-border)] bg-[var(--ipk-surface)]" style={{ fontSize: "13px", fontWeight: 700 }}>Suite du classement</div>
              <ul>
                {rest.map(e => (
                  <li key={e.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--ipk-border)] last:border-b-0">
                    <span className="w-8 text-center text-[var(--ipk-text-muted)]" style={{ fontSize: "13px", fontWeight: 700 }}>#{e.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate" style={{ fontSize: "13px", fontWeight: 600 }}>{e.name}</div>
                      {e.submission && <div className="truncate text-[var(--ipk-text-muted)]" style={{ fontSize: "11px" }}>{e.submission}</div>}
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono" style={{ fontSize: "13px" }}>{e.votes}<ThumbsUp className="w-3.5 h-3.5" /></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============= ROUE DE LA FORTUNE =============
export function WheelPage() {
  useSeo({ title: "Roue de la fortune - IPPOO KRAAFT", description: "Tentez votre chance et gagnez des bons d'achat IPK." });
  const { canSpinWheel, recordWheelSpin, nextSpinIn, spinsLeftToday, awardTicket, earnPoints, wheelPrizes } = useMarketing();
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<typeof wheelPrizes[number] | null>(null);
  const [available, setAvailable] = useState(canSpinWheel());
  const [spinsLeft, setSpinsLeft] = useState(spinsLeftToday());
  const [remainingMs, setRemainingMs] = useState(nextSpinIn());
  const segDeg = 360 / wheelPrizes.length;

  useEffect(() => {
    if (available) return;
    const t = setInterval(() => {
      const r = nextSpinIn();
      setRemainingMs(r);
      if (r === 0) { setAvailable(true); clearInterval(t); }
    }, 1000);
    return () => clearInterval(t);
  }, [available, nextSpinIn]);

  const pickPrize = () => {
    const total = wheelPrizes.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * total;
    for (const p of wheelPrizes) { if ((r -= p.weight) <= 0) return p; }
    return wheelPrizes[0];
  };

  const spin = () => {
    if (spinning || !available) return;
    setSpinning(true); setResult(null);
    const prize = pickPrize();
    const idx = wheelPrizes.indexOf(prize);
    const turns = 5 + Math.random() * 2;
    const target = turns * 360 + (360 - (idx * segDeg + segDeg / 2));
    setAngle(prev => prev + target);
    setTimeout(() => {
      setSpinning(false);
      setResult(prize);
      recordWheelSpin(prize.id);
      const left = spinsLeftToday();
      setSpinsLeft(left);
      setAvailable(left > 0);
      setRemainingMs(nextSpinIn());
      if (prize.type === "discount") {
        awardTicket({ label: `Roue : -${prize.value}%`, pct: prize.value });
        rewardToast({ kind: "wheel", title: "Bravo !", description: `${prize.label} ajouté à vos tickets`, highlight: `-${prize.value}%` });
      } else if (prize.type === "freeship") {
        awardTicket({ label: "Roue : livraison offerte" });
        rewardToast({ kind: "shipping", title: "Livraison offerte !", description: "Ajoutée à vos tickets" });
      } else if (prize.type === "giftcard") {
        awardTicket({ label: `Roue : carte ${prize.value} Fcfa`, amount: prize.value });
        rewardToast({ kind: "gift", title: "Carte cadeau créditée", highlight: formatPrice(prize.value || 0) });
      } else if (prize.type === "ticket") {
        awardTicket({ label: "Ticket cadeau bonus" });
        rewardToast({ kind: "ticket", title: "Ticket cadeau ajouté" });
      } else if (prize.type === "points") {
        earnPoints(prize.value || 0, "Roue de la fortune");
        rewardToast({ kind: "points", title: "Points fidélité gagnés", highlight: `+${prize.value} pts` });
      } else {
        toast.info("Pas cette fois - retentez demain !");
      }
    }, 4500);
  };

  const fmtRemain = () => {
    const h = Math.floor(remainingMs / 3600000);
    const m = Math.floor((remainingMs % 3600000) / 60000);
    const s = Math.floor((remainingMs % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <h1 className="text-center mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 600, color: "var(--ipk-ink)" }}>Roue de la fortune</h1>
      <p className="text-center text-[var(--ipk-text)] mb-2">3 chances par jour. Bons d'achat, livraison offerte, cartes cadeaux à gagner.</p>
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--ipk-green-dark)]/10 text-[var(--ipk-green-dark)] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          {spinsLeft > 0 ? `${spinsLeft} tour${spinsLeft > 1 ? "s" : ""} restant${spinsLeft > 1 ? "s" : ""} aujourd'hui` : "Quota du jour atteint - revenez demain"}
        </span>
      </div>

      <div className="relative mx-auto" style={{ width: "min(92vw, 380px)", height: "min(92vw, 380px)" }}>
        {/* Halo lumineux derrière la roue */}
        <div
          className="absolute -inset-6 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.35), rgba(217,119,6,0.18) 40%, transparent 70%)",
            filter: "blur(8px)",
            animation: spinning ? "ipk-coupon-pulse 1.2s ease-in-out infinite" : undefined,
          }}
        />

        {/* Anneau extérieur or avec ampoules */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, #fbbf24, #f59e0b, #b45309, #f59e0b, #fbbf24)",
            padding: "10px",
            boxShadow: "0 20px 50px -15px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(255,255,255,0.4)",
          }}
        >
          {/* 16 ampoules régulièrement espacées */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (360 / 16) * i;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full"
                style={{
                  transformOrigin: "0 50%",
                  transform: `rotate(${a - 90}deg) translateX(calc(50% - 14px)) translate(-50%, -50%)`,
                  background: "radial-gradient(circle at 30% 30%, #fffbeb, #fcd34d 60%, #b45309)",
                  boxShadow: "0 0 8px rgba(252,211,77,0.9), inset 0 -1px 1px rgba(0,0,0,0.25)",
                  animation: `ipk-bulb-blink 1.4s ease-in-out ${i * 0.08}s infinite`,
                }}
              />
            );
          })}

          {/* Disque rotatif */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{
              transform: `rotate(${angle}deg)`,
              transition: spinning ? "transform 4.4s cubic-bezier(0.17, 0.67, 0.16, 0.99)" : "none",
              background: `conic-gradient(${wheelPrizes.map((p, i) => `${p.color} ${i * segDeg}deg ${(i + 1) * segDeg}deg`).join(", ")})`,
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.35), inset 0 0 0 3px rgba(255,255,255,0.25)",
            }}
          >
            {/* Séparateurs blancs entre segments */}
            {wheelPrizes.map((_, i) => (
              <div
                key={`sep-${i}`}
                className="absolute left-1/2 top-1/2 origin-top-left pointer-events-none"
                style={{
                  width: "50%", height: "2px",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.4))",
                  transform: `rotate(${i * segDeg - 90}deg)`,
                }}
              />
            ))}

            {/* Voile radial pour donner du volume */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{ background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.18) 100%)" }}
            />

            {/* Libellés radiaux */}
            {wheelPrizes.map((p, i) => {
              const a = i * segDeg + segDeg / 2;
              return (
                <div
                  key={p.id}
                  className="absolute left-1/2 top-1/2 text-white pointer-events-none flex items-center justify-end uppercase"
                  style={{
                    width: "42%",
                    height: "24px",
                    transformOrigin: "0 50%",
                    transform: `rotate(${a - 90}deg) translateX(8%)`,
                    paddingRight: "10%",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "clamp(11px, 2.6vw, 13px)",
                    letterSpacing: "0.08em",
                    textShadow: "0 1px 2px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.35)",
                    whiteSpace: "nowrap",
                    textAlign: "right",
                  }}
                >
                  {p.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hub central premium */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 30% 30%, #fffbeb, #fbbf24 55%, #b45309)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35), inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 3px rgba(255,255,255,0.6), 0 0 0 4px rgba(255,255,255,0.85)",
          }}
        >
          <Sparkles className={`w-7 h-7 text-white ${spinning ? "animate-spin" : ""}`} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }} />
        </div>

        {/* Pointeur moderne en goutte */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.45))" }}>
          <svg width="36" height="44" viewBox="0 0 36 44">
            <defs>
              <linearGradient id="ipk-pointer-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
            </defs>
            <path d="M18 42 L4 14 A14 14 0 1 1 32 14 Z" fill="url(#ipk-pointer-grad)" stroke="#fff" strokeWidth="2" />
            <circle cx="18" cy="14" r="4" fill="#fff" opacity="0.9" />
          </svg>
        </div>
      </div>

      <div className="text-center mt-10 space-y-4">
        <button
          onClick={spin}
          disabled={spinning || !available}
          className="group relative inline-flex items-center gap-2 px-8 h-14 rounded-full text-white font-medium transition-transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #fbbf24, #d97706 55%, #7c2d12)",
            boxShadow: "0 12px 28px -10px rgba(217,119,6,0.65), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 0 rgba(0,0,0,0.2)",
            fontSize: "15px",
          }}
        >
          <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <span className="ipk-coupon-shimmer__bar" />
          </span>
          <RotateCw className={`w-5 h-5 ${spinning ? "animate-spin" : "group-hover:rotate-45 transition-transform"}`} />
          {spinning
            ? "La roue tourne…"
            : available
              ? `Faire tourner${spinsLeft < 3 ? ` (${spinsLeft} restant${spinsLeft > 1 ? "s" : ""})` : ""}`
              : `Revenez dans ${fmtRemain()}`}
        </button>
        {result && (
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white"
            style={{
              background: "linear-gradient(135deg, #10b981, #047857)",
              boxShadow: "0 10px 24px -10px rgba(4,120,87,0.6)",
            }}
          >
            <Sparkles className="w-4 h-4" /> Résultat : <span className="font-medium">{result.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============= CARTE CADEAU =============
export function GiftCardPage() {
  useSeo({ title: "Carte cadeau - IPPOO KRAAFT", description: "Offrez l'artisanat togolais avec une carte cadeau IPK." });
  const { buyGiftCard, sendGiftCardEmail, redeemGiftCard, giftCards } = useMarketing();
  const [amount, setAmount] = useState(25000);
  const [recipient, setRecipient] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [message, setMessage] = useState("");
  const [delivery, setDelivery] = useState<"digital" | "physical">("digital");
  const [redeemCode, setRedeemCode] = useState("");
  const [issued, setIssued] = useState<string | null>(null);

  const purchase = () => {
    if (amount < 5000) { toast.error("Montant minimum : 5 000 Fcfa"); return; }
    if (delivery === "digital" && !recipientEmail.trim()) { toast.error("Email destinataire requis pour l'envoi digital"); return; }
    if (delivery === "physical" && !recipientAddress.trim()) { toast.error("Adresse postale requise pour l'envoi physique"); return; }
    const card = buyGiftCard({
      amount,
      recipientName: recipient.trim() || undefined,
      recipientEmail: recipientEmail.trim() || undefined,
      recipientAddress: recipientAddress.trim() || undefined,
      message: message.trim() || undefined,
      delivery,
    });
    setIssued(card.code);
    if (delivery === "digital") {
      const r = sendGiftCardEmail(card.code);
      if (r.ok) rewardToast({ kind: "gift", title: "Carte cadeau envoyée", description: `Code ${card.code} - destinataire : ${recipientEmail}`, highlight: formatPrice(amount) });
      else toast.error(r.reason);
    } else {
      rewardToast({ kind: "gift", title: "Carte cadeau créée", description: `Envoi postal vers ${recipientAddress.split("\n")[0]}`, highlight: formatPrice(amount) });
    }
  };

  const resendEmail = () => {
    if (!issued) return;
    const r = sendGiftCardEmail(issued);
    if (r.ok) toast.success("Email renvoyé");
    else toast.error(r.reason);
  };

  const redeem = () => {
    if (!redeemCode.trim()) return;
    const r = redeemGiftCard(redeemCode);
    if (r.ok) toast.success(`Solde disponible : ${formatPrice(r.balance)}`);
    else toast.error(r.reason);
  };

  const selected = giftCardOffers.find(g => g.amount === amount) || giftCardOffers[1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <PageHero icon={Gift} eyebrow="Cadeau" title="Cartes cadeaux IPK" subtitle="Offrez la liberté de choisir parmi nos pièces d'artisanat." />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {giftCardOffers.map(g => (
          <button key={g.id} onClick={() => setAmount(g.amount)} className={`text-left rounded-2xl ring-2 transition ${amount === g.amount ? "ring-[var(--ipk-green-dark)]" : "ring-transparent"}`}>
            <Coupon
              theme={g.style.theme}
              pattern={g.style.pattern}
              variant="stamp"
              eyebrow="Carte cadeau"
              title={formatPrice(g.amount)}
              subtitle="IPPOO KRAAFT"
              badge={<Gift className="w-5 h-5" />}
            />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-medium">Acheter une carte</h3>
          <div>
            <label className="text-xs text-[var(--ipk-text)]">Montant</label>
            <input type="number" min={5000} step={1000} value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-[var(--ipk-border)] rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["digital", "physical"] as const).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDelivery(d)}
                className={`px-3 py-2 rounded-xl border text-sm transition ${delivery === d ? "border-[var(--ipk-green-dark)] bg-[var(--ipk-green-dark)]/5 text-[var(--ipk-green-dark)] font-medium" : "border-[var(--ipk-border)] text-[var(--ipk-text)] hover:bg-[var(--ipk-surface)]"}`}
              >
                {d === "digital" ? "Envoi digital (email)" : "Envoi physique (postal)"}
              </button>
            ))}
          </div>
          <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Nom du destinataire" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm" />
          {delivery === "digital" ? (
            <input value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} type="email" placeholder="Email du destinataire" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm" />
          ) : (
            <textarea value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} placeholder="Adresse postale (rue, ville, pays)" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm h-20 resize-none" />
          )}
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message personnalisé" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl text-sm h-20 resize-none" />
          <Button onClick={purchase} className="w-full bg-[var(--ipk-green-dark)] text-white">Acheter - {formatPrice(amount)}</Button>
          {issued && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm space-y-2">
              <div>Code généré : <CopyCode code={issued} /></div>
              {delivery === "digital" && recipientEmail && (
                <Button size="sm" variant="outline" onClick={resendEmail} className="w-full">Renvoyer l'email</Button>
              )}
            </div>
          )}
        </CardContent></Card>

        <div className="space-y-4">
          <Coupon
            theme={selected.style.theme}
            pattern={selected.style.pattern}
            variant="stamp"
            eyebrow="Aperçu"
            title={formatPrice(amount)}
            subtitle={recipient ? `Pour ${recipient}` : "À offrir"}
            badge={<Gift className="w-6 h-6" />}
          >
            {message && <p className="italic text-sm opacity-90">« {message} »</p>}
            <div className="mt-3 text-[10px] uppercase tracking-widest opacity-80">IPPOO KRAAFT · Art & Handmade</div>
          </Coupon>
          <Card><CardContent className="p-5 space-y-3">
            <h3 className="font-medium">Vérifier un solde</h3>
            <input value={redeemCode} onChange={e => setRedeemCode(e.target.value.toUpperCase())} placeholder="GC-XXXXXXXX" className="w-full px-3 py-2 border border-[var(--ipk-border)] rounded-xl font-mono uppercase text-sm" />
            <Button onClick={redeem} variant="outline" className="w-full">Vérifier</Button>
            <div className="text-xs text-[var(--ipk-text)] pt-2 border-t border-[var(--ipk-border)]">Cartes émises : {giftCards.length}</div>
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
}

// ============= TICKETS CADEAUX =============
export function GiftTicketsPage() {
  useSeo({ title: "Tickets cadeaux - IPPOO KRAAFT", description: "Vos avantages exclusifs : bienvenue, anniversaire, parrainage, fidélité." });
  const { tickets, awardTicket, consumeTicket, loyaltyPoints, redeemPoints } = useMarketing();
  const [redeemAmount, setRedeemAmount] = useState(1000);
  const claim = (label: string, pct?: number) => {
    awardTicket({ label, pct });
    toast.success(`${label} activé !`);
  };
  const doRedeem = () => {
    const r = redeemPoints(redeemAmount);
    if (r.ok) rewardToast({ kind: "ticket", title: "Ticket de réduction créé", description: `Code ${r.ticketCode}`, highlight: formatPrice(r.amount), ctaLabel: "Voir mes tickets", ctaHref: "/compte" });
    else toast.error(r.reason);
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <PageHero icon={Ticket} eyebrow="Avantages" title="Tickets cadeaux" subtitle="Cumulez des tickets et utilisez-les sur vos prochains paniers." />

      {/* Solde points fidélité */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl flex items-center gap-4 flex-wrap"
        style={{ background: "linear-gradient(135deg, #fbbf24, #d97706 70%, #7c2d12)", color: "#fffbeb", boxShadow: "0 12px 28px -12px rgba(217,119,6,0.55)" }}>
        <div className="flex items-center gap-3 flex-1 min-w-[180px]">
          <Star className="w-7 h-7" />
          <div>
            <div className="text-[10px] uppercase tracking-widest opacity-85">Points fidélité</div>
            <div className="font-medium" style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px" }}>{loyaltyPoints} pts</div>
            <div className="text-xs opacity-90">1 point = 5 Fcfa · convertibles dès 1 000 pts</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number" min={1000} step={500} value={redeemAmount}
            onChange={e => setRedeemAmount(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl border border-white/40 bg-white/15 text-white placeholder-white/60 text-sm"
          />
          <Button onClick={doRedeem} disabled={loyaltyPoints < 1000} className="bg-white text-amber-800 hover:bg-white/90 disabled:opacity-50">Convertir</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {giftTickets.map(t => (
          <div key={t.id} className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => claim(t.label, t.id === "tk-1" ? 10 : undefined)}
              className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ipk-green-dark)] rounded-full"
              aria-label={t.cta}
            >
              <Coupon
                theme={t.style.theme}
                pattern={t.style.pattern}
                variant="sticker"
                badge={<Ticket className="w-6 h-6" />}
                eyebrow="Avantage"
                title={t.label.replace("Ticket ", "")}
                subtitle={t.cta}
              />
            </button>
            <p className="text-xs text-center text-[var(--ipk-text)] px-1 leading-snug">{t.description}</p>
          </div>
        ))}
      </div>

      <h2 className="font-medium mb-3" style={{ fontSize: "18px" }}>Mes tickets ({tickets.length})</h2>
      {tickets.length === 0 ? (
        <div className="p-6 rounded-2xl bg-[var(--ipk-surface)] text-center text-sm text-[var(--ipk-text)]">Aucun ticket pour l'instant. Activez-en un ci-dessus ou tentez la <Link to="/roue" className="text-[var(--ipk-green-dark)] underline">roue de la fortune</Link>.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tickets.map(t => {
            const expired = t.status === "expired";
            const used = t.status === "used";
            const dim = expired || used;
            const daysLeft = Math.max(0, Math.ceil((new Date(t.expiresAt).getTime() - Date.now()) / 86400000));
            return (
              <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border ${dim ? "border-[var(--ipk-border)] opacity-60" : "border-[var(--ipk-green-dark)]/30 bg-[var(--ipk-green-dark)]/5"}`}>
                <div className="shrink-0 p-1.5 bg-white rounded-md border border-[var(--ipk-border)]">
                  <QRCodeSVG value={`IPK-TKT:${t.code}`} size={56} level="M" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.label}</div>
                  <div className="text-xs text-[var(--ipk-text)] font-mono truncate">{t.code}</div>
                  <div className="text-[11px] text-[var(--ipk-text)] mt-0.5">
                    {used ? "Utilisé" : expired ? "Expiré" : daysLeft > 0 ? `Expire dans ${daysLeft} j` : "Expire aujourd'hui"}
                  </div>
                </div>
                {t.status === "active" ? (
                  <Button size="sm" variant="outline" onClick={() => { consumeTicket(t.id); rewardToast({ kind: "ticket", title: "Ticket utilisé", description: t.label }); }}>Utiliser</Button>
                ) : (
                  <Badge variant="outline" className="text-xs">{expired ? "Expiré" : "Utilisé"}</Badge>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============= JOUR DE MARCHÉ =============
export function MarketDayPage() {
  useSeo({ title: "Jour de marché - IPPOO KRAAFT", description: "Le programme hebdomadaire de la communauté IPK." });
  const today = new Date();
  const { marketDays } = useMarketing();
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20 lg:pb-8">
      <PageHero icon={Calendar} eyebrow="Programme" title="Jour de marché" subtitle="Chaque jour, un thème, des offres dédiées et la communauté en direct du showroom de Lomé." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {marketDays.map(d => {
          const isToday = new Date(d.date).toDateString() === today.toDateString();
          return (
            <Coupon
              key={d.id}
              theme={d.style.theme}
              pattern={d.style.pattern}
              eyebrow={`${d.weekday} · ${new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}${isToday ? " · Aujourd'hui" : ""}`}
              title={d.theme}
              subtitle={d.description}
              badge={<Calendar className="w-7 h-7" />}
              className={isToday ? "ring-2 ring-[var(--ipk-green-dark)] rounded-2xl" : ""}
              footer={
                <>
                  <span className="inline-flex items-center gap-1"><Star className="w-3 h-3" /> {d.highlight}</span>
                  <Link to="/boutique" className="inline-flex items-center gap-1 hover:underline">Voir <ChevronRight className="w-3 h-3" /></Link>
                </>
              }
            />
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-[var(--ipk-surface)] flex items-center gap-3 flex-wrap">
        <MapPin className="w-5 h-5 text-[var(--ipk-green-dark)]" />
        <div className="flex-1 min-w-0">
          <div className="font-medium">Showroom IPK - Lomé, quartier Djidjolé</div>
          <div className="text-sm text-[var(--ipk-text)]">Du mardi au dimanche, 9h-18h. Entrée libre.</div>
        </div>
        <Link to="/contact"><Button variant="outline">Itinéraire</Button></Link>
      </div>
    </div>
  );
}
