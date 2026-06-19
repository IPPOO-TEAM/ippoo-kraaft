import { RotateCcw, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useCms, type SectionToggles, type TrustItem, type SavoirItem } from "../../hooks/use-cms";
import { useConfirm } from "../../hooks/use-confirm";
import { toast } from "sonner";
import { DataCard } from "./admin-shared";
import { MediaPickerButton } from "./media-picker";
import { useSeo } from "../../hooks/use-seo";

const SECTION_LABELS: Record<keyof SectionToggles, string> = {
  hero: "Hero (bannière principale)",
  marketDayBanner: "Bandeau jour de marché",
  trust: "Barre de confiance",
  savoir: "Savoir-faire vivant",
  promos: "Promos, jeux & cadeaux",
  exclusives: "Pièces uniques",
  categories: "Catégories",
  taxonomy: "Explorer par domaine",
  groupements: "Groupements",
  formation: "Formation",
  groupBuying: "Achats groupés",
  events: "Événements",
  testimonials: "Témoignages",
  stats: "Chiffres clés",
  cta: "CTA final",
};

const TRUST_ICONS = ["Shield", "Award", "Users", "MapPin", "Star", "Tag", "Flame", "Trophy", "Gift", "Ticket", "RotateCw", "Calendar", "Hammer"];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block mb-1 text-[var(--ipk-text-muted)]" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full px-3 py-2 rounded-lg border border-[var(--ipk-border)] ${props.className || ""}`} style={{ fontSize: "13px", ...(props.style || {}) }} />;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full px-3 py-2 rounded-lg border border-[var(--ipk-border)] ${props.className || ""}`} style={{ fontSize: "13px", ...(props.style || {}) }} />;
}

export function AdminCmsPage() {
  useSeo({ title: "Admin — CMS", noIndex: true });
  const { home, setHero, setTrust, setSavoir, toggleSection, reset } = useCms();
  const confirm = useConfirm();

  const handleReset = async () => {
    if (!await confirm({ title: "Réinitialiser le CMS ?", message: "Toutes les personnalisations de la page d'accueil seront effacées.", tone: "danger", confirmLabel: "Réinitialiser" })) return;
    reset();
    toast.success("CMS réinitialisé");
  };

  const moveTrust = (i: number, dir: -1 | 1) => {
    const items = [...home.trust.items];
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    setTrust({ items });
  };

  const moveSavoir = (i: number, dir: -1 | 1) => {
    const items = [...home.savoir.items];
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    setSavoir({ items });
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700 }}>CMS — Page d'accueil</h1>
          <p className="text-[var(--ipk-text-muted)]" style={{ fontSize: "13px" }}>Édition des sections, textes et images. Les changements sont visibles instantanément sur le site.</p>
        </div>
        <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--ipk-border)] hover:bg-[var(--ipk-surface)]" style={{ fontSize: "13px", fontWeight: 500 }}>
          <RotateCcw className="w-4 h-4" /> Réinitialiser
        </button>
      </div>

      {/* Toggles */}
      <DataCard>
        <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Sections actives</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {(Object.keys(SECTION_LABELS) as Array<keyof SectionToggles>).map(key => (
            <label key={key} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--ipk-border)] cursor-pointer hover:bg-[var(--ipk-surface)]">
              <input type="checkbox" checked={home.sections[key]} onChange={(e) => toggleSection(key, e.target.checked)} />
              <span style={{ fontSize: "13px" }}>{SECTION_LABELS[key]}</span>
            </label>
          ))}
        </div>
      </DataCard>

      {/* Hero */}
      <DataCard>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Hero</h2>
          <label className="flex items-center gap-2" style={{ fontSize: "12px" }}>
            <input type="checkbox" checked={home.hero.enabled} onChange={e => setHero({ enabled: e.target.checked })} /> Activé
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Titre</FieldLabel>
            <Textarea rows={2} value={home.hero.title} onChange={e => setHero({ title: e.target.value })} />
          </div>
          <div>
            <FieldLabel>Sous-titre</FieldLabel>
            <Textarea rows={2} value={home.hero.subtitle} onChange={e => setHero({ subtitle: e.target.value })} />
          </div>
          <div>
            <FieldLabel>CTA — libellé</FieldLabel>
            <Input value={home.hero.cta.label} onChange={e => setHero({ cta: { ...home.hero.cta, label: e.target.value } })} />
          </div>
          <div>
            <FieldLabel>CTA — lien</FieldLabel>
            <Input value={home.hero.cta.href} onChange={e => setHero({ cta: { ...home.hero.cta, href: e.target.value } })} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Image de fond</FieldLabel>
            <MediaPickerButton value={home.hero.image} onChange={(url) => setHero({ image: url })} />
          </div>
          <div>
            <FieldLabel>Opacité de l'overlay sombre ({Math.round(home.hero.overlay * 100)} %)</FieldLabel>
            <input type="range" min={0} max={1} step={0.05} value={home.hero.overlay} onChange={e => setHero({ overlay: Number(e.target.value) })} className="w-full" />
          </div>
        </div>
      </DataCard>

      {/* Trust */}
      <DataCard>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Barre de confiance</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2" style={{ fontSize: "12px" }}>
              <input type="checkbox" checked={home.trust.enabled} onChange={e => setTrust({ enabled: e.target.checked })} /> Activée
            </label>
            <button
              onClick={() => setTrust({ items: [...home.trust.items, { icon: "Shield", text: "Nouvelle valeur" }] })}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[var(--ipk-border)]"
              style={{ fontSize: "11px" }}
            >
              <Plus className="w-3 h-3" /> Ajouter
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {home.trust.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-[var(--ipk-border)]">
              <select
                value={item.icon}
                onChange={e => { const items = [...home.trust.items]; items[i] = { ...item, icon: e.target.value }; setTrust({ items }); }}
                className="px-2 py-1 rounded border border-[var(--ipk-border)]"
                style={{ fontSize: "12px" }}
              >
                {TRUST_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <Input
                value={item.text}
                onChange={e => { const items = [...home.trust.items]; items[i] = { ...item, text: e.target.value }; setTrust({ items }); }}
                className="flex-1"
              />
              <div className="flex gap-1">
                <button onClick={() => moveTrust(i, -1)} className="p-1 rounded hover:bg-[var(--ipk-surface)]" disabled={i === 0}><ArrowUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => moveTrust(i, 1)} className="p-1 rounded hover:bg-[var(--ipk-surface)]" disabled={i === home.trust.items.length - 1}><ArrowDown className="w-3.5 h-3.5" /></button>
                <button onClick={() => setTrust({ items: home.trust.items.filter((_, k) => k !== i) })} className="p-1 rounded hover:bg-[var(--ipk-surface)] text-[var(--ipk-danger,#c0392b)]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </DataCard>

      {/* Savoir-faire */}
      <DataCard>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700 }}>Savoir-faire</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2" style={{ fontSize: "12px" }}>
              <input type="checkbox" checked={home.savoir.enabled} onChange={e => setSavoir({ enabled: e.target.checked })} /> Activée
            </label>
            <button
              onClick={() => setSavoir({ items: [...home.savoir.items, { image: "", title: "Nouveau", desc: "Description", link: "/galeries" }] })}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[var(--ipk-border)]"
              style={{ fontSize: "11px" }}
            >
              <Plus className="w-3 h-3" /> Ajouter
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <FieldLabel>Titre de section</FieldLabel>
            <Input value={home.savoir.title} onChange={e => setSavoir({ title: e.target.value })} />
          </div>
          <div>
            <FieldLabel>Sous-titre</FieldLabel>
            <Input value={home.savoir.subtitle} onChange={e => setSavoir({ subtitle: e.target.value })} />
          </div>
        </div>
        <div className="space-y-3">
          {home.savoir.items.map((item: SavoirItem, i) => (
            <div key={i} className="p-3 rounded-lg border border-[var(--ipk-border)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[var(--ipk-text-muted)]" style={{ fontSize: "11px", fontWeight: 600 }}>Carte {i + 1}</div>
                <div className="flex gap-1">
                  <button onClick={() => moveSavoir(i, -1)} className="p-1 rounded hover:bg-[var(--ipk-surface)]" disabled={i === 0}><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => moveSavoir(i, 1)} className="p-1 rounded hover:bg-[var(--ipk-surface)]" disabled={i === home.savoir.items.length - 1}><ArrowDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setSavoir({ items: home.savoir.items.filter((_, k) => k !== i) })} className="p-1 rounded hover:bg-[var(--ipk-surface)] text-[var(--ipk-danger,#c0392b)]"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input value={item.title} placeholder="Titre" onChange={e => { const items = [...home.savoir.items]; items[i] = { ...item, title: e.target.value }; setSavoir({ items }); }} />
                <Input value={item.desc} placeholder="Description" onChange={e => { const items = [...home.savoir.items]; items[i] = { ...item, desc: e.target.value }; setSavoir({ items }); }} />
                <Input value={item.link} placeholder="/lien" onChange={e => { const items = [...home.savoir.items]; items[i] = { ...item, link: e.target.value }; setSavoir({ items }); }} />
              </div>
              <MediaPickerButton value={item.image} onChange={(url) => { const items = [...home.savoir.items]; items[i] = { ...item, image: url }; setSavoir({ items }); }} />
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );
}
