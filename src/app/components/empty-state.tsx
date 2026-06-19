import { SearchX } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title = "Aucun résultat", message = "Essayez d'élargir vos filtres.", actionLabel, onAction }: Props) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-[var(--ipk-surface)] flex items-center justify-center mb-3">
        <SearchX className="w-7 h-7 text-[var(--ipk-text)]" aria-hidden="true" />
      </div>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ipk-ink)" }}>{title}</h3>
      <p className="mt-1 mb-4 max-w-sm" style={{ fontSize: "13px", color: "var(--ipk-text)" }}>{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="rounded-xl border border-[var(--ipk-border)] h-10 px-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
