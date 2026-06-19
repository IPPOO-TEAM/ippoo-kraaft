import { Bell, Volume2, Smartphone, MonitorSmartphone, Moon, RotateCcw, Gift, Megaphone, Package, AlertTriangle, Info } from "lucide-react";
import { useNotifPrefs } from "../hooks/use-notif-prefs";
import type { NotificationCategory } from "../hooks/use-notifications";
import { rewardToast } from "./reward-toast";

const CATEGORY_LABELS: Record<NotificationCategory, { label: string; icon: typeof Gift; desc: string }> = {
  reward:    { label: "Récompenses",  icon: Gift,           desc: "Cadeaux, points, paliers, roue" },
  marketing: { label: "Marketing",    icon: Megaphone,      desc: "Promotions et communications" },
  order:     { label: "Commandes",    icon: Package,        desc: "Suivi de vos achats" },
  alert:     { label: "Alertes",      icon: AlertTriangle,  desc: "Stock, prix, événements" },
  system:    { label: "Système",      icon: Info,           desc: "Messages techniques" },
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-[var(--ipk-green-dark)]" : "bg-[var(--ipk-border)]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

function Row({ icon: Icon, title, desc, checked, onChange }: { icon: typeof Bell; title: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex items-start gap-2.5 min-w-0">
        <span className="mt-0.5 w-7 h-7 rounded-lg bg-[var(--ipk-surface)] text-[var(--ipk-text)] flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </span>
        <div className="min-w-0">
          <div className="text-[var(--ipk-ink)]" style={{ fontSize: "13px", fontWeight: 600 }}>{title}</div>
          <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>{desc}</div>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

export function NotifPrefsPanel() {
  const { prefs, update, toggleCategory, reset } = useNotifPrefs();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[var(--ipk-ink)]" style={{ fontSize: "16px", fontWeight: 700 }}>Notifications</h3>
          <p className="text-[var(--ipk-text-muted)]" style={{ fontSize: "12px" }}>Choisissez comment vous voulez être averti</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--ipk-surface)] hover:bg-[var(--ipk-border)] text-[var(--ipk-text)]"
          style={{ fontSize: "12px", fontWeight: 600 }}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
        </button>
      </div>

      <section className="rounded-xl border border-[var(--ipk-border)] bg-white p-3">
        <div className="text-[var(--ipk-text-muted)] mb-1" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Canaux</div>
        <Row icon={MonitorSmartphone} title="Pop-up (toast)"     desc="Affichage flottant en haut de l'écran" checked={prefs.toast} onChange={() => update({ toast: !prefs.toast })} />
        <Row icon={Smartphone}        title="Centre in-app"       desc="Conserver dans la cloche"              checked={prefs.inApp} onChange={() => update({ inApp: !prefs.inApp })} />
        <Row icon={Volume2}           title="Son"                 desc="Bip discret à la réception"            checked={prefs.sound} onChange={() => update({ sound: !prefs.sound })} />
      </section>

      <section className="rounded-xl border border-[var(--ipk-border)] bg-white p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Heures calmes</div>
          <Toggle checked={prefs.quietHours.enabled} onChange={() => update({ quietHours: { ...prefs.quietHours, enabled: !prefs.quietHours.enabled } })} label="Activer les heures calmes" />
        </div>
        <p className="text-[var(--ipk-text-muted)] mb-2" style={{ fontSize: "12px" }}>
          <Moon className="inline w-3.5 h-3.5 mr-1 align-text-bottom" />
          Aucun toast ni son pendant cette plage horaire
        </p>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2">
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>De</span>
            <input
              type="time"
              value={prefs.quietHours.from}
              disabled={!prefs.quietHours.enabled}
              onChange={(e) => update({ quietHours: { ...prefs.quietHours, from: e.target.value } })}
              className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--ipk-border)] bg-white disabled:opacity-50"
              style={{ fontSize: "13px" }}
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-[var(--ipk-text)]" style={{ fontSize: "12px" }}>À</span>
            <input
              type="time"
              value={prefs.quietHours.to}
              disabled={!prefs.quietHours.enabled}
              onChange={(e) => update({ quietHours: { ...prefs.quietHours, to: e.target.value } })}
              className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--ipk-border)] bg-white disabled:opacity-50"
              style={{ fontSize: "13px" }}
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--ipk-border)] bg-white p-3">
        <div className="text-[var(--ipk-text-muted)] mb-1" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Catégories</div>
        {(Object.keys(CATEGORY_LABELS) as NotificationCategory[]).map(cat => {
          const meta = CATEGORY_LABELS[cat];
          return <Row key={cat} icon={meta.icon} title={meta.label} desc={meta.desc} checked={prefs.categories[cat]} onChange={() => toggleCategory(cat)} />;
        })}
      </section>

      <button
        onClick={() => rewardToast({ kind: "gift", title: "Test de notification", description: "Si vous lisez ceci, tout fonctionne ✅", highlight: "Aperçu", duration: 3500 })}
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--ipk-green-dark)] text-white hover:opacity-90"
        style={{ fontSize: "13px", fontWeight: 600 }}
      >
        <Bell className="w-4 h-4" /> Envoyer une notification test
      </button>
    </div>
  );
}
