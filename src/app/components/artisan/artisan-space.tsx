import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, NavLink, Navigate, Outlet, useNavigate, useParams } from "react-router";
import { nicheLabel } from "../../data/craft-taxonomy";
import { ArrowLeft, BarChart3, Bell, Box, MessageSquare, Package, ShoppingBag, Store, Upload, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { useUser } from "../../hooks/use-user";
import { useArtisanStore, type OrderStatus, type ArtisanProduct } from "../../hooks/use-artisan-store";
import { formatPrice } from "../../data/mock-data";
import { validateAndReadImage } from "../../lib/file-validation";
import { NicheSelector } from "../niche-selector";

const NAV = [
  { to: "/espace-artisan", end: true, label: "Tableau de bord", icon: BarChart3 },
  { to: "/espace-artisan/boutique", label: "Ma boutique", icon: Store },
  { to: "/espace-artisan/produits", label: "Produits", icon: Box },
  { to: "/espace-artisan/commandes", label: "Commandes", icon: ShoppingBag },
  { to: "/espace-artisan/messages", label: "Messages", icon: MessageSquare },
  { to: "/espace-artisan/notifications", label: "Notifications", icon: Bell },
  { to: "/espace-artisan/profil", label: "Profil", icon: UserIcon },
];

export function ArtisanLayout() {
  const { user } = useUser();
  const { myNotifications, myOrders } = useArtisanStore();
  const unread = myNotifications.filter(n => !n.read).length;
  const pendingOrders = myOrders.filter(o => o.status === "pending" || o.status === "confirmed" || o.status === "preparing").length;

  if (!user) return <Navigate to="/connexion" replace />;
  if (user.accountType !== "artisan" && user.accountType !== "entreprise") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl text-center">
        <h1 className="text-xl font-medium">Espace réservé aux artisans</h1>
        <p className="text-muted-foreground mt-2">Votre compte est de type « {user.accountType ?? "non renseigné"} ». Vous pouvez modifier votre type de compte depuis votre profil.</p>
        <Button className="mt-4" onClick={() => window.history.back()}>Retour</Button>
      </div>
    );
  }

  const badgeFor = (to: string) => {
    if (to === "/espace-artisan/notifications") return unread;
    if (to === "/espace-artisan/commandes") return pendingOrders;
    return 0;
  };

  return (
    <div className="min-h-screen bg-muted/20 flex">
      <aside className="hidden md:flex w-60 flex-col border-r bg-background sticky top-0 h-screen">
        <div className="p-4 border-b">
          <NavLink to="/accueil" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour au site
          </NavLink>
          <div className="mt-3 font-medium">Espace artisan</div>
          <div className="text-xs text-muted-foreground truncate">{user.fullName}</div>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {NAV.map(n => {
            const b = badgeFor(n.to);
            return (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                <n.icon className="h-4 w-4" />
                <span className="flex-1">{n.label}</span>
                {b > 0 && <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">{b}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-10 bg-background border-b p-3 flex items-center gap-2 overflow-x-auto">
          {NAV.map(n => {
            const b = badgeFor(n.to);
            return (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <n.icon className="h-3.5 w-3.5" />{n.label}
                {b > 0 && <span className="ml-1 text-[10px] bg-red-500 text-white rounded-full px-1">{b}</span>}
              </NavLink>
            );
          })}
        </header>
        <div className="p-4 md:p-6 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// =============== F2 — Profil boutique ===============
export function ArtisanShopPage() {
  const { user } = useUser();
  const { myShop, upsertShop } = useArtisanStore();
  const [form, setForm] = useState({
    name: myShop?.name || user!.fullName,
    tagline: myShop?.tagline || "",
    story: myShop?.story || "",
    region: myShop?.region || "",
    country: myShop?.country || user!.countryCode || "",
    specialty: myShop?.specialty || "",
    niches: (myShop?.niches || user?.niches || []) as string[],
    logo: myShop?.logo || user!.profilePhoto || "",
    cover: myShop?.cover || "",
    website: myShop?.socials.website || "",
    instagram: myShop?.socials.instagram || "",
    facebook: myShop?.socials.facebook || "",
    whatsapp: myShop?.socials.whatsapp || user!.phone || "",
    acceptsOrders: myShop?.acceptsOrders ?? true,
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    upsertShop({
      name: form.name, tagline: form.tagline, story: form.story, region: form.region, country: form.country,
      specialty: form.specialty, niches: form.niches, logo: form.logo, cover: form.cover, acceptsOrders: form.acceptsOrders,
      socials: { website: form.website, instagram: form.instagram, facebook: form.facebook, whatsapp: form.whatsapp },
    });
    toast.success("Boutique mise à jour");
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>, key: "logo" | "cover") => {
    const f = e.target.files?.[0]; if (!f) return;
    try {
      const dataUrl = await validateAndReadImage(f, { maxBytes: 2 * 1024 * 1024, minWidth: 64, minHeight: 64 });
      set(key, dataUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image invalide");
    }
    e.target.value = "";
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-xl font-medium">Ma boutique</h1>
        <p className="text-sm text-muted-foreground">Personnalisez votre vitrine publique.</p>
      </header>

      <Card>
        <CardHeader><CardTitle className="text-base">Identité</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nom de la boutique *</Label><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div className="space-y-2"><Label>Spécialité</Label><Input value={form.specialty} onChange={(e) => set("specialty", e.target.value)} placeholder="Sculpture, tissage…" /></div>
            <div className="space-y-2"><Label>Région / atelier</Label><Input value={form.region} onChange={(e) => set("region", e.target.value)} /></div>
            <div className="space-y-2"><Label>Pays</Label><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Slogan</Label><Input maxLength={100} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Une phrase qui résume votre boutique" /></div>
          <div className="space-y-2"><Label>Notre histoire</Label><Textarea rows={5} value={form.story} onChange={(e) => set("story", e.target.value)} placeholder="Présentez votre démarche, vos techniques…" /></div>
          <div className="space-y-2 pt-2 border-t">
            <NicheSelector value={form.niches} onChange={(n) => set("niches", n)} max={8} label="Niches d'activité" helperText="Permet aux clients de vous trouver via les filtres de la boutique." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Visuels</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="space-y-2">
              <Label>Logo</Label>
              {form.logo ? <img src={form.logo} alt="logo" className="w-24 h-24 rounded-full object-cover border" /> : <div className="w-24 h-24 rounded-full bg-muted" />}
              <label className="inline-flex items-center gap-2 px-2 py-1 rounded border cursor-pointer text-xs"><Upload className="h-3.5 w-3.5" />Choisir<input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, "logo")} /></label>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Bannière de couverture</Label>
              {form.cover ? <img src={form.cover} alt="cover" className="w-full h-32 rounded object-cover border" /> : <div className="w-full h-32 rounded bg-muted" />}
              <label className="inline-flex items-center gap-2 px-2 py-1 rounded border cursor-pointer text-xs"><Upload className="h-3.5 w-3.5" />Choisir<input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, "cover")} /></label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Réseaux & contact</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Site web</Label><Input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" /></div>
          <div className="space-y-2"><Label>Instagram</Label><Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@pseudo" /></div>
          <div className="space-y-2"><Label>Facebook</Label><Input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} /></div>
          <div className="space-y-2"><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+225…" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div><div className="text-sm font-medium">Accepter les commandes</div><div className="text-xs text-muted-foreground">Décochez si vous mettez votre boutique en pause.</div></div>
          <Switch checked={form.acceptsOrders} onCheckedChange={(v) => set("acceptsOrders", v)} />
        </CardContent>
      </Card>

      <div className="flex gap-2"><Button type="submit">Enregistrer</Button></div>
    </form>
  );
}

// =============== F5 — Tableau de bord ===============
export function ArtisanDashboardPage() {
  const { user } = useUser();
  const { stats, myShop, seedDemoOrder, myProducts } = useArtisanStore();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-medium">Bonjour {user!.fullName.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">{myShop ? `${myShop.name} — ${myShop.specialty || "boutique"}` : "Configurez votre boutique pour démarrer."}</p>
          {myShop?.niches && myShop.niches.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {myShop.niches.map(s => (
                <Link key={s} to={`/niche/${s}`} className="px-2 py-0.5 rounded-full bg-[#0B6B3A]/10 text-[var(--ipk-green-dark)] hover:bg-[#0B6B3A]/20" style={{ fontSize: "10px" }}>
                  {nicheLabel(s)}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!myShop && <Button onClick={() => navigate("/espace-artisan/boutique")}>Configurer ma boutique</Button>}
          <Button variant="outline" onClick={seedDemoOrder} disabled={myProducts.length === 0}>Simuler une commande</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Produits publiés" value={stats.published} />
        <Stat label="Stock total" value={stats.stock} sub={stats.lowStock > 0 ? `${stats.lowStock} en stock faible` : undefined} />
        <Stat label="Commandes" value={stats.orderCount} />
        <Stat label="Revenus" value={formatPrice(stats.revenue)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Performance</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Vues totales" value={stats.totalViews} />
            <Row label="Taux de conversion" value={`${stats.conversion.toFixed(1)} %`} />
            <Row label="Ruptures" value={stats.outOfStock} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Top produits (vues)</CardTitle></CardHeader>
          <CardContent>
            {stats.topByViews.length === 0 ? <p className="text-sm text-muted-foreground">Aucun produit pour le moment.</p> : (
              <ul className="text-sm divide-y">
                {stats.topByViews.map(p => (
                  <li key={p.id} className="py-2 flex justify-between gap-3"><span className="truncate">{p.name}</span><span className="text-muted-foreground">{p.views} vues</span></li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Revenus par produit</CardTitle></CardHeader>
        <CardContent>
          {stats.revenueByProduct.every(r => r.revenue === 0) ? <p className="text-sm text-muted-foreground">Pas encore de revenus.</p> : (
            <ul className="text-sm divide-y">
              {stats.revenueByProduct.map(r => (
                <li key={r.name} className="py-2 flex justify-between gap-3"><span className="truncate">{r.name}</span><span className="font-medium">{formatPrice(r.revenue)}</span></li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="text-xl font-medium mt-1">{value}</div>{sub && <div className="text-[11px] text-amber-600 mt-1">{sub}</div>}</CardContent></Card>;
}
function Row({ label, value }: { label: string; value: string | number }) {
  return <div className="flex justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}

// =============== F3 — CRUD produits ===============
export function ArtisanProductsPage() {
  const { myProducts, removeProduct, setProductStatus } = useArtisanStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ArtisanProduct["status"]>("all");
  const filtered = myProducts.filter(p => (statusFilter === "all" || p.status === statusFilter) && (!q || p.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-medium">Mes produits</h1>
        <Button size="sm" onClick={() => navigate("/espace-artisan/produits/nouveau")}><Package className="h-4 w-4 mr-1" />Ajouter</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Input className="max-w-xs" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="published">Publié</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="text-left p-2">Produit</th><th className="text-left p-2">Catégorie</th><th className="text-right p-2">Stock</th><th className="text-right p-2">Prix</th><th className="text-left p-2">Statut</th><th className="text-right p-2">Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Aucun produit. Commencez par en ajouter un.</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2 flex items-center gap-2 min-w-0">
                  {p.images[0] ? <img src={p.images[0]} alt="" className="w-9 h-9 rounded object-cover" /> : <div className="w-9 h-9 rounded bg-muted" />}
                  <div className="min-w-0"><div className="font-medium truncate">{p.name}</div><div className="text-xs text-muted-foreground truncate">{p.views} vues</div></div>
                </td>
                <td className="p-2">{p.category}</td>
                <td className="p-2 text-right">{p.stock}{p.stock > 0 && p.stock <= 3 && <Badge variant="outline" className="ml-1 text-[10px]">faible</Badge>}</td>
                <td className="p-2 text-right">{formatPrice(p.price)}{p.promoPercent ? <Badge className="ml-1 text-[10px]">-{p.promoPercent}%</Badge> : null}</td>
                <td className="p-2"><Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status === "published" ? "Publié" : p.status === "archived" ? "Archivé" : "Brouillon"}</Badge></td>
                <td className="p-2 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/espace-artisan/produits/${p.id}`)}>Modifier</Button>
                    {p.status !== "published"
                      ? <Button size="sm" variant="outline" onClick={() => setProductStatus(p.id, "published")}>Publier</Button>
                      : <Button size="sm" variant="outline" onClick={() => setProductStatus(p.id, "archived")}>Archiver</Button>}
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm("Supprimer ?")) { removeProduct(p.id); toast.success("Supprimé"); } }}>×</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CATEGORIES = ["Sculpture", "Textile", "Poterie", "Vannerie", "Bijoux", "Métal & Bronze", "Cuir", "Peinture", "Autre"];

export function ArtisanProductEditorPage() {
  const { id } = useParams();
  const { myProducts, createProduct, updateProduct } = useArtisanStore();
  const navigate = useNavigate();
  const existing = id && id !== "nouveau" ? myProducts.find(p => p.id === id) : undefined;
  const [form, setForm] = useState({
    name: existing?.name || "",
    category: existing?.category || CATEGORIES[0],
    niches: (existing?.niches || []) as string[],
    description: existing?.description || "",
    price: existing?.price ?? 0,
    stock: existing?.stock ?? 0,
    promoPercent: existing?.promoPercent ?? 0,
    status: existing?.status || ("draft" as ArtisanProduct["status"]),
    images: existing?.images || ([] as string[]),
    variants: existing?.variants || ([] as ArtisanProduct["variants"]),
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      try {
        const url = await validateAndReadImage(f, { maxBytes: 2 * 1024 * 1024 });
        setForm(s => ({ ...s, images: [...s.images, url] }));
      } catch (err) {
        toast.error(`${f.name} : ${err instanceof Error ? err.message : "invalide"}`);
      }
    }
    e.target.value = "";
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Nom requis");
    if (form.price <= 0) return toast.error("Prix invalide");
    if (form.stock < 0) return toast.error("Stock invalide");
    if (existing) {
      updateProduct(existing.id, form);
      toast.success("Produit mis à jour");
    } else {
      createProduct(form);
      toast.success("Produit créé");
    }
    navigate("/espace-artisan/produits");
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-medium">{existing ? "Modifier le produit" : "Nouveau produit"}</h1>
        <Button type="button" variant="ghost" onClick={() => navigate("/espace-artisan/produits")}>Annuler</Button>
      </header>

      <Card><CardContent className="p-4 space-y-4">
        <div className="space-y-2"><Label>Nom *</Label><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2"><Label>Catégorie</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Prix (Fcfa) *</Label><Input type="number" required min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Stock</Label><Input type="number" min={0} value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} /></div>
        </div>
        <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
        <div className="pt-2 border-t">
          <NicheSelector value={form.niches} onChange={(n) => set("niches", n)} max={5} label="Niches du produit" helperText="Aide les clients à trouver ce produit dans les filtres taxonomie." />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Promo (%)</Label><Input type="number" min={0} max={90} value={form.promoPercent} onChange={(e) => set("promoPercent", Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Statut</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as ArtisanProduct["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent></Card>

      <Card><CardHeader><CardTitle className="text-base">Photos</CardTitle></CardHeader><CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {form.images.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} alt="" className="w-20 h-20 rounded object-cover border" />
              <button type="button" onClick={() => setForm(s => ({ ...s, images: s.images.filter((_, j) => j !== i) }))} className="absolute -top-1 -right-1 bg-background border rounded-full w-5 h-5 text-xs">×</button>
            </div>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 px-2 py-1 rounded border cursor-pointer text-xs"><Upload className="h-3.5 w-3.5" />Ajouter des photos<input type="file" multiple accept="image/*" className="hidden" onChange={addImage} /></label>
      </CardContent></Card>

      <Card><CardHeader><CardTitle className="text-base">Variantes (option)</CardTitle></CardHeader><CardContent className="space-y-3">
        {form.variants.length === 0 && <p className="text-xs text-muted-foreground">Aucune variante. Ajoutez tailles, couleurs, etc.</p>}
        {form.variants.map((v, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1"><Label className="text-xs">Nom</Label><Input value={v.name} onChange={(e) => setForm(s => ({ ...s, variants: s.variants.map((x, j) => j === i ? { ...x, name: e.target.value } : x) }))} /></div>
            <div className="w-28 space-y-1"><Label className="text-xs">Prix</Label><Input type="number" value={v.price} onChange={(e) => setForm(s => ({ ...s, variants: s.variants.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x) }))} /></div>
            <div className="w-24 space-y-1"><Label className="text-xs">Stock</Label><Input type="number" value={v.stock} onChange={(e) => setForm(s => ({ ...s, variants: s.variants.map((x, j) => j === i ? { ...x, stock: Number(e.target.value) } : x) }))} /></div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm(s => ({ ...s, variants: s.variants.filter((_, j) => j !== i) }))}>×</Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setForm(s => ({ ...s, variants: [...s.variants, { name: "", price: form.price, stock: 0 }] }))}>+ Ajouter une variante</Button>
      </CardContent></Card>

      <div className="flex gap-2"><Button type="submit">{existing ? "Mettre à jour" : "Créer"}</Button></div>
    </form>
  );
}

// =============== F4 — Commandes ===============
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Nouvelle", confirmed: "Confirmée", preparing: "En préparation", shipped: "Expédiée",
  delivered: "Livrée", cancelled: "Annulée", refunded: "Remboursée",
};
const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["shipped", "cancelled"],
  shipped: ["delivered", "refunded"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};

export function ArtisanOrdersPage() {
  const { myOrders, setOrderStatus } = useArtisanStore();
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const filtered = statusFilter === "all" ? myOrders : myOrders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-medium">Commandes</h1>
      <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          {(Object.keys(STATUS_LABEL) as OrderStatus[]).map(s => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
        </SelectContent>
      </Select>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune commande pour ce filtre. Vous pouvez en simuler une depuis le tableau de bord.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <Card key={o.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-mono text-xs">{o.id}</div>
                    <div className="text-sm font-medium">{o.productName} × {o.qty}</div>
                    <div className="text-xs text-muted-foreground">{o.customerName} — {o.customerEmail}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatPrice(o.total)}</div>
                    <Badge variant={o.status === "delivered" ? "default" : "secondary"}>{STATUS_LABEL[o.status]}</Badge>
                  </div>
                </div>
                <details className="text-xs"><summary className="cursor-pointer text-muted-foreground">Historique ({o.history.length})</summary>
                  <ul className="mt-2 pl-4 list-disc space-y-1">{o.history.map((h, i) => <li key={i}>{new Date(h.at).toLocaleString("fr-FR")} → {STATUS_LABEL[h.status]}{h.note ? ` (${h.note})` : ""}</li>)}</ul>
                </details>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_FLOW[o.status].map(next => (
                    <Button key={next} size="sm" variant={next === "cancelled" || next === "refunded" ? "outline" : "default"} onClick={() => { setOrderStatus(o.id, next); toast.success(`Commande → ${STATUS_LABEL[next]}`); }}>
                      {STATUS_LABEL[next]}
                    </Button>
                  ))}
                  {STATUS_FLOW[o.status].length === 0 && <span className="text-xs text-muted-foreground self-center">Statut final.</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// =============== F6 — Messages ===============
const MESSAGES_KEY = "ipk:artisan:messages:v1";
interface Thread { id: string; userId: string; customer: string; subject: string; messages: { from: "customer" | "artisan"; body: string; at: string }[]; unread: boolean }
function loadThreads(): Thread[] { try { return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]"); } catch { return []; } }
function saveThreads(t: Thread[]) { try { localStorage.setItem(MESSAGES_KEY, JSON.stringify(t)); } catch {} }

export function ArtisanMessagesPage() {
  const { user } = useUser();
  const { addNotification } = useArtisanStore();
  const [threads, setThreads] = useState<Thread[]>(() => loadThreads().filter(t => t.userId === user?.id));
  const [activeId, setActiveId] = useState<string | null>(threads[0]?.id || null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    saveThreads([...loadThreads().filter(t => t.userId !== user?.id), ...threads]);
  }, [threads, user]);

  const seedDemo = () => {
    if (!user) return;
    const t: Thread = {
      id: `t-${Date.now()}`, userId: user.id,
      customer: ["Awa K.", "Pierre M.", "Sandra D."][Math.floor(Math.random() * 3)],
      subject: ["Disponibilité ?", "Délai de livraison", "Personnalisation possible ?"][Math.floor(Math.random() * 3)],
      messages: [{ from: "customer", body: "Bonjour, j'aimerais en savoir plus sur ce produit. Est-il toujours disponible ?", at: new Date().toISOString() }],
      unread: true,
    };
    setThreads(prev => [t, ...prev]);
    setActiveId(t.id);
    addNotification({ kind: "message", title: "Nouveau message", body: t.subject, link: "/espace-artisan/messages" });
  };

  const active = threads.find(t => t.id === activeId);
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!active || !reply.trim()) return;
    setThreads(prev => prev.map(t => t.id === active.id ? { ...t, unread: false, messages: [...t.messages, { from: "artisan", body: reply.trim(), at: new Date().toISOString() }] } : t));
    setReply("");
    toast.success("Réponse envoyée");
  };

  const markRead = (id: string) => setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: false } : t));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-medium">Messages clients</h1>
        <Button size="sm" variant="outline" onClick={seedDemo}>Simuler un message</Button>
      </div>
      {threads.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun message. Vos clients pourront vous écrire depuis vos fiches produit.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-3 min-h-[400px]">
          <div className="md:col-span-1 border rounded-md divide-y">
            {threads.map(t => (
              <button key={t.id} onClick={() => { setActiveId(t.id); markRead(t.id); }} className={`w-full text-left p-3 hover:bg-muted ${activeId === t.id ? "bg-muted" : ""}`}>
                <div className="flex items-center justify-between"><span className="text-sm font-medium truncate">{t.customer}</span>{t.unread && <span className="w-2 h-2 rounded-full bg-primary" />}</div>
                <div className="text-xs text-muted-foreground truncate">{t.subject}</div>
              </button>
            ))}
          </div>
          <div className="md:col-span-2 border rounded-md flex flex-col">
            {active ? (
              <>
                <div className="p-3 border-b"><div className="text-sm font-medium">{active.customer}</div><div className="text-xs text-muted-foreground">{active.subject}</div></div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {active.messages.map((m, i) => (
                    <div key={i} className={`max-w-[80%] p-2 rounded-md text-sm ${m.from === "artisan" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <div>{m.body}</div>
                      <div className="text-[10px] opacity-70 mt-1">{new Date(m.at).toLocaleString("fr-FR")}</div>
                    </div>
                  ))}
                </div>
                <form onSubmit={send} className="p-3 border-t flex gap-2">
                  <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Votre réponse…" />
                  <Button type="submit">Envoyer</Button>
                </form>
              </>
            ) : <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Sélectionnez un message</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// =============== F7 — Notifications ===============
export function ArtisanNotificationsPage() {
  const { myNotifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useArtisanStore();
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-medium">Notifications</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>Tout marquer lu</Button>
          <Button size="sm" variant="ghost" onClick={() => { if (confirm("Effacer toutes les notifications ?")) clearNotifications(); }}>Effacer</Button>
        </div>
      </div>
      {myNotifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune notification.</p>
      ) : (
        <ul className="divide-y border rounded-md">
          {myNotifications.map(n => (
            <li key={n.id} className={`p-3 flex items-start gap-3 ${n.read ? "opacity-60" : ""}`}>
              <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" style={{ visibility: n.read ? "hidden" : "visible" }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{n.title}</div>
                {n.body && <div className="text-xs text-muted-foreground truncate">{n.body}</div>}
                <div className="text-[11px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString("fr-FR")}</div>
              </div>
              {n.link && <Button size="sm" variant="outline" onClick={() => { markNotificationRead(n.id); navigate(n.link!); }}>Voir</Button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// =============== Profil ===============
export function ArtisanProfilePage() {
  const { user, updateProfile } = useUser();
  const [fullName, setFullName] = useState(user!.fullName);
  const [phone, setPhone] = useState(user!.phone || "");
  const [address, setAddress] = useState(user!.address || "");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, phone, address });
    toast.success("Profil mis à jour");
  };
  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-xl font-medium">Profil</h1>
      <p className="text-sm text-muted-foreground">Informations personnelles liées à votre compte.</p>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label>Nom complet</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
        <div className="space-y-2"><Label>Téléphone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div className="space-y-2"><Label>Adresse</Label><Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} /></div>
        <Button type="submit">Enregistrer</Button>
      </form>
    </div>
  );
}
