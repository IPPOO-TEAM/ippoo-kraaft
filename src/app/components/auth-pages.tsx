import { useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { useUser, type AccountType, type Sex, type SignupPayload } from "../hooks/use-user";
import { AFRICAN_COUNTRIES } from "../data/african-countries";
import { validateAndReadImage, validateAndReadDocument } from "../lib/file-validation";
import { NicheSelector } from "./niche-selector";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-1.9 13.2-5.1l-6.1-5c-2 1.4-4.5 2.1-7.1 2.1-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.1 5c4.3-4 6.7-9.9 6.7-17.4 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}

function FileField({ label, value, onChange, accept, kind = "doc" }: { label: string; value?: string; onChange: (v: string | undefined) => void; accept?: string; kind?: "image" | "doc" }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-background hover:bg-muted cursor-pointer text-sm">
          <Upload className="h-4 w-4" />
          {value ? "Remplacer" : "Choisir un fichier"}
          <input type="file" accept={accept} className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const dataUrl = kind === "image"
                ? await validateAndReadImage(f, { maxBytes: 2 * 1024 * 1024 })
                : await validateAndReadDocument(f, { maxBytes: 2 * 1024 * 1024 });
              onChange(dataUrl);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Fichier invalide");
            }
            e.target.value = "";
          }} />
        </label>
        {value && (
          <>
            <span className="text-xs text-muted-foreground">Fichier chargé</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>Retirer</Button>
          </>
        )}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { isAuthenticated, login } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/compte" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (!res.ok) { toast.error(res.error || "Échec de la connexion"); return; }
    toast.success("Connexion réussie");
    navigate("/compte");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Accédez à votre espace IPPOO KRAAFT</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleButton mode="login" />
          <DividerOr />
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="vous@exemple.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-9" />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Afficher/masquer">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Se connecter
            </Button>
          </form>
          <div className="mt-3 text-right">
            <Link to="/mot-de-passe-oublie" className="text-sm underline text-muted-foreground">Mot de passe oublié ?</Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground text-center">
            Pas encore inscrit ? <Link to="/inscription" className="underline">Créer un compte</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = requestPasswordReset(email);
    setBusy(false);
    if (!res.ok) { toast.error(res.error || "Erreur"); return; }
    toast.success("Code envoyé", { description: `Code de démonstration : ${res.code}` });
    navigate(`/reinitialiser-mot-de-passe?email=${encodeURIComponent(email.trim())}`);
  };
  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>Entrez votre e-mail pour recevoir un code de réinitialisation.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fpemail">E-mail</Label>
              <Input id="fpemail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Envoyer le code
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">Mode démo : aucun e-mail réel n'est envoyé. Le code s'affiche dans une notification.</p>
          <p className="mt-6 text-sm text-muted-foreground text-center">
            <Link to="/connexion" className="underline">Retour à la connexion</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResetPasswordPage() {
  const { confirmPasswordReset } = useUser();
  const navigate = useNavigate();
  const initialEmail = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("email") || "" : "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pwd !== pwd2) return toast.error("Les mots de passe ne correspondent pas");
    setBusy(true);
    const res = await confirmPasswordReset(email, code, pwd);
    setBusy(false);
    if (!res.ok) { toast.error(res.error || "Erreur"); return; }
    toast.success("Mot de passe réinitialisé");
    navigate("/connexion");
  };
  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Réinitialiser le mot de passe</CardTitle>
          <CardDescription>Saisissez le code reçu et votre nouveau mot de passe.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Code de vérification (6 chiffres)</Label>
              <Input inputMode="numeric" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input type="password" required minLength={8} value={pwd} onChange={(e) => setPwd(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Confirmer</Label>
              <Input type="password" required value={pwd2} onChange={(e) => setPwd2(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Mettre à jour
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function VerifyEmailPage() {
  const { user, requestEmailVerification, confirmEmailVerification } = useUser();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  if (!user) return <Navigate to="/connexion" replace />;
  if (user.emailVerified) return <Navigate to="/compte" replace />;
  const sendCode = () => {
    const res = requestEmailVerification();
    if (!res.ok) { toast.error(res.error || "Erreur"); return; }
    toast.success("Code envoyé", { description: `Code de démonstration : ${res.code}` });
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = confirmEmailVerification(code);
    setBusy(false);
    if (!res.ok) { toast.error(res.error || "Erreur"); return; }
    toast.success("E-mail vérifié");
    navigate("/compte");
  };
  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Vérifier votre e-mail</CardTitle>
          <CardDescription>Nous avons besoin de confirmer {user.email}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" className="w-full" onClick={sendCode}>
            <Mail className="h-4 w-4 mr-2" />Envoyer un code
          </Button>
          <DividerOr />
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>Code reçu</Label>
              <Input inputMode="numeric" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Valider
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">Mode démo : aucun e-mail réel n'est envoyé. Le code s'affiche dans une notification.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function GoogleButton({ mode }: { mode: "login" | "signup" }) {
  const { signupWithGoogle } = useUser();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    setBusy(true);
    const res = await signupWithGoogle();
    setBusy(false);
    if (!res.ok) { toast.error("Connexion Google impossible"); return; }
    if (res.needsCompletion) { toast.info("Complétez vos informations"); navigate("/completer-profil"); }
    else { toast.success("Connecté avec Google"); navigate("/compte"); }
  };
  return (
    <Button type="button" variant="outline" className="w-full" onClick={handle} disabled={busy}>
      {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <GoogleIcon className="h-4 w-4 mr-2" />}
      {mode === "login" ? "Continuer avec Google" : "S'inscrire avec Google"}
    </Button>
  );
}

function DividerOr() {
  return (
    <div className="my-4 flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-xs text-muted-foreground">ou</span>
      <Separator className="flex-1" />
    </div>
  );
}

interface FormState {
  fullName: string;
  dateOfBirth: string;
  sex: Sex | "";
  phone: string;
  email: string;
  address: string;
  countryCode: string;
  accountType: AccountType | "";
  password: string;
  passwordConfirm: string;
  idDoc?: string;
  profilePhoto?: string;
  activityProof?: string;
  cguAccepted: boolean;
  niches: string[];
}

const EMPTY_FORM: FormState = {
  fullName: "", dateOfBirth: "", sex: "", phone: "", email: "", address: "",
  countryCode: "", accountType: "", password: "", passwordConfirm: "",
  cguAccepted: false, niches: [],
};

function RegistrationForm({ initial, hidePassword, hideEmail, submitLabel, onSubmit }: {
  initial?: Partial<FormState>;
  hidePassword?: boolean;
  hideEmail?: boolean;
  submitLabel: string;
  onSubmit: (payload: SignupPayload) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, ...initial });
  const [busy, setBusy] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(f => ({ ...f, [k]: v }));

  const country = useMemo(() => AFRICAN_COUNTRIES.find(c => c.code === form.countryCode), [form.countryCode]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return toast.error("Nom complet requis");
    if (!form.dateOfBirth) return toast.error("Date de naissance requise");
    if (!form.sex) return toast.error("Sexe requis");
    if (!form.phone.trim()) return toast.error("Téléphone requis");
    if (!hideEmail && !form.email.trim()) return toast.error("E-mail requis");
    if (!form.address.trim()) return toast.error("Adresse requise");
    if (!form.countryCode || !country) return toast.error("Pays requis");
    if (!form.accountType) return toast.error("Type de compte requis");
    if (form.accountType === "artisan" && form.niches.length === 0) return toast.error("Sélectionnez au moins une niche d'activité");
    if (!hidePassword) {
      if (form.password.length < 8) return toast.error("Mot de passe : 8 caractères minimum");
      if (form.password !== form.passwordConfirm) return toast.error("Les mots de passe ne correspondent pas");
    }
    if (!form.cguAccepted) return toast.error("Vous devez accepter les CGU");

    setBusy(true);
    const res = await onSubmit({
      fullName: form.fullName.trim(),
      dateOfBirth: form.dateOfBirth,
      sex: form.sex as Sex,
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      countryCode: form.countryCode,
      nationality: country.nationality,
      accountType: form.accountType as AccountType,
      password: form.password,
      idDoc: form.idDoc,
      profilePhoto: form.profilePhoto,
      activityProof: form.activityProof,
      cguAccepted: form.cguAccepted,
      niches: form.accountType === "artisan" ? form.niches : undefined,
    });
    setBusy(false);
    if (!res.ok) toast.error(res.error || "Échec de l'inscription");
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-base font-medium">1. Informations personnelles</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fullName">Nom complet *</Label>
            <Input id="fullName" required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Prénom et nom" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date de naissance *</Label>
            <Input id="dob" type="date" required value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Sexe *</Label>
            <Select value={form.sex} onValueChange={(v) => set("sex", v as Sex)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="homme">Homme</SelectItem>
                <SelectItem value="femme">Femme</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <Input id="phone" type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+225 …" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailField">E-mail *</Label>
            <Input id="emailField" type="email" required disabled={hideEmail} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vous@exemple.com" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Adresse complète *</Label>
            <Textarea id="address" required value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Rue, ville, code postal…" rows={2} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium">2. Pays et nationalité</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Pays *</Label>
            <Select value={form.countryCode} onValueChange={(v) => set("countryCode", v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un pays" /></SelectTrigger>
              <SelectContent className="max-h-72">
                {AFRICAN_COUNTRIES.map(c => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nationalité</Label>
            <Input value={country?.nationality || ""} readOnly placeholder="Renseignée automatiquement" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-medium">3. Type de compte *</h3>
        <RadioGroup value={form.accountType} onValueChange={(v) => set("accountType", v as AccountType)} className="grid sm:grid-cols-3 gap-3">
          {[
            { v: "particulier", t: "Particulier", d: "Achats personnels" },
            { v: "artisan", t: "Professionnel-Artisan", d: "Vendre vos créations" },
            { v: "entreprise", t: "Entreprise", d: "Acheteur professionnel" },
          ].map(opt => (
            <label key={opt.v} className={`border rounded-md p-3 cursor-pointer flex items-start gap-3 ${form.accountType === opt.v ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
              <RadioGroupItem value={opt.v} className="mt-0.5" />
              <div>
                <div className="text-sm font-medium">{opt.t}</div>
                <div className="text-xs text-muted-foreground">{opt.d}</div>
              </div>
            </label>
          ))}
        </RadioGroup>
        {form.accountType === "artisan" && (
          <div className="pt-3 border-t mt-2">
            <NicheSelector value={form.niches} onChange={(n) => set("niches", n)} max={8} label="Vos niches d'activité *" helperText="Sélectionnez 1 à 8 niches qui décrivent vos productions. Elles permettront aux clients de vous trouver via les filtres." />
          </div>
        )}
      </section>

      {!hidePassword && (
        <section className="space-y-4">
          <h3 className="text-base font-medium">4. Identifiants</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pwd">Mot de passe *</Label>
              <div className="relative">
                <Input id="pwd" type={showPwd ? "text" : "password"} required minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Afficher/masquer">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">8 caractères minimum.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd2">Confirmer le mot de passe *</Label>
              <Input id="pwd2" type={showPwd ? "text" : "password"} required value={form.passwordConfirm} onChange={(e) => set("passwordConfirm", e.target.value)} />
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-base font-medium">{hidePassword ? "4" : "5"}. Pièces jointes (facultatif)</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <FileField label="Pièce d'identité" value={form.idDoc} onChange={(v) => set("idDoc", v)} accept="image/*,application/pdf" />
          <FileField label="Photo de profil" value={form.profilePhoto} onChange={(v) => set("profilePhoto", v)} accept="image/*" kind="image" />
          <FileField label="Justificatif d'activité" value={form.activityProof} onChange={(v) => set("activityProof", v)} accept="image/*,application/pdf" />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-medium">{hidePassword ? "5" : "6"}. Conditions générales d'utilisation</h3>
        <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer">
          <Checkbox checked={form.cguAccepted} onCheckedChange={(v) => set("cguAccepted", !!v)} className="mt-0.5" />
          <span className="text-sm">
            J'accepte les <Link to="/legal/cgu" className="underline">conditions générales d'utilisation</Link> et la <Link to="/legal/confidentialite" className="underline">politique de confidentialité</Link> d'IPPOO KRAAFT. *
          </span>
        </label>
      </section>

      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{submitLabel}
      </Button>
    </form>
  );
}

export function SignupPage() {
  const { isAuthenticated, signup } = useUser();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/compte" replace />;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Créer votre compte</CardTitle>
          <CardDescription>Rejoignez la communauté IPPOO KRAAFT en quelques étapes.</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleButton mode="signup" />
          <DividerOr />
          <RegistrationForm
            submitLabel="Créer mon compte"
            onSubmit={async (payload) => {
              const res = await signup(payload);
              if (res.ok) { toast.success("Inscription réussie"); navigate("/accueil"); }
              return res;
            }}
          />
          <p className="mt-6 text-sm text-muted-foreground text-center">
            Déjà inscrit ? <Link to="/connexion" className="underline">Se connecter</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function CompleteProfilePage() {
  const { user, completeProfile } = useUser();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/connexion" replace />;
  if (user.profileComplete) return <Navigate to="/compte" replace />;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Compléter votre profil</CardTitle>
          <CardDescription>Bienvenue {user.fullName}. Quelques informations pour finaliser votre compte Google.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm
            hidePassword
            hideEmail
            initial={{ fullName: user.fullName, email: user.email, cguAccepted: user.cguAccepted }}
            submitLabel="Enregistrer mon profil"
            onSubmit={async (payload) => {
              const res = await completeProfile(payload);
              if (res.ok) { toast.success("Profil complété"); navigate("/compte"); }
              return res;
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
