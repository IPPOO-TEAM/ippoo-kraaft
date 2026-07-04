import { useEffect, useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router";
import { Loader2, Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { useAdmin } from "../../hooks/use-admin";
import { logAudit } from "../../hooks/use-admin-audit";
import { useSeo } from "../../hooks/use-seo";
import { toast } from "sonner";

function formatRemaining(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m} min ${r.toString().padStart(2, "0")}s` : `${r}s`;
}

export function AdminLoginPage() {
  useSeo({ title: "Connexion admin", noIndex: true });
  const { session, login, lockedUntil } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!lockedUntil) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [lockedUntil]);

  if (session) {
    const from = (location.state as { from?: string } | null)?.from || "/admin";
    return <Navigate to={from} replace />;
  }

  const remainingLockMs = lockedUntil ? lockedUntil.getTime() - now : 0;
  const isLocked = remainingLockMs > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(username.trim(), password);
    setLoading(false);
    if (result.ok) {
      logAudit({ actor: username.trim(), action: "login", entity: "session" });
      toast.success("Bienvenue dans l'administration");
      navigate("/admin", { replace: true });
    } else if (result.reason === "locked") {
      logAudit({ actor: username.trim() || "?", action: "lockout", entity: "session", details: "trop de tentatives" });
      toast.error("Compte temporairement verrouillé", { description: "Trop de tentatives. Réessayez plus tard." });
    } else {
      toast.error("Identifiants incorrects", {
        description: result.remaining !== undefined && result.remaining > 0
          ? `${result.remaining} tentative${result.remaining > 1 ? "s" : ""} restante${result.remaining > 1 ? "s" : ""}.`
          : undefined,
      });
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ipk-ink)] p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--ipk-green-dark)] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: "var(--ipk-ink)" }}>
              Administration
            </h1>
            <p className="text-[var(--ipk-text)]" style={{ fontSize: "13px" }}>IPPOO KRAAFT</p>
          </div>
        </div>

        {isLocked && (
          <div role="alert" className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700" style={{ fontSize: "13px", fontWeight: 600 }}>Compte verrouillé</p>
              <p className="text-red-600" style={{ fontSize: "12px" }}>Réessayez dans {formatRemaining(remainingLockMs)}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="adm-user" style={{ fontSize: "13px", fontWeight: 500 }}>Identifiant</label>
            <input
              id="adm-user"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={isLocked}
              className="w-full mt-1 px-4 py-2.5 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30 disabled:opacity-60"
              style={{ fontSize: "14px" }}
            />
          </div>
          <div>
            <label htmlFor="adm-pass" style={{ fontSize: "13px", fontWeight: 500 }}>Mot de passe</label>
            <input
              id="adm-pass"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={isLocked}
              className="w-full mt-1 px-4 py-2.5 bg-[var(--ipk-surface)] border border-[var(--ipk-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/30 disabled:opacity-60"
              style={{ fontSize: "14px" }}
            />
          </div>
          <Button type="submit" disabled={loading || isLocked} className="w-full bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)] text-white rounded-xl h-11 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connexion…</> : <><Lock className="w-4 h-4 mr-2" /> Se connecter</>}
          </Button>
        </div>

        <p className="mt-4 text-center text-[var(--ipk-text)]" style={{ fontSize: "11px" }}>
          Session sécurisée - expiration automatique après 30 minutes d'inactivité
        </p>
      </form>
    </div>
  );
}
