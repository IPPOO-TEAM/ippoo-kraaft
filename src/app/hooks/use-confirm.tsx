import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../components/ui/button";

export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
}

type Resolver = (ok: boolean) => void;

interface Ctx { confirm: (opts: ConfirmOptions) => Promise<boolean>; }
const ConfirmContext = createContext<Ctx | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<Resolver | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>(resolve => {
    setOpts(options);
    setOpen(true);
    resolverRef.current = resolve;
  }), []);

  const close = useCallback((result: boolean) => {
    setOpen(false);
    resolverRef.current?.(result);
    resolverRef.current = null;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(false); }
      else if (e.key === "Enter") { e.preventDefault(); close(true); }
    };
    document.addEventListener("keydown", onKey);
    confirmBtnRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && opts && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="absolute inset-0 bg-black/50" onClick={() => close(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-6">
            <button onClick={() => close(false)} aria-label="Fermer" className="absolute top-3 right-3 p-1 text-[var(--ipk-text)] hover:text-[var(--ipk-ink)]"><X className="w-4 h-4" /></button>
            <div className="flex items-start gap-3 mb-4">
              {opts.tone === "danger" && <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-5 h-5 text-red-600" /></div>}
              <div className="min-w-0 flex-1">
                <h2 id="confirm-title" className="text-[var(--ipk-ink)]" style={{ fontSize: "16px", fontWeight: 600 }}>{opts.title}</h2>
                {opts.message && <div className="text-[var(--ipk-text)] mt-1" style={{ fontSize: "13px", lineHeight: 1.5 }}>{opts.message}</div>}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => close(false)} variant="outline" className="rounded-xl h-10 px-4">{opts.cancelLabel || "Annuler"}</Button>
              <Button ref={confirmBtnRef} onClick={() => close(true)} className={`rounded-xl h-10 px-4 text-white ${opts.tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[var(--ipk-green-dark)] hover:bg-[var(--ipk-green-darker)]"}`}>{opts.confirmLabel || "Confirmer"}</Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be inside ConfirmProvider");
  return ctx.confirm;
}
