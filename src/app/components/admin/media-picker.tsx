import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MediaLibraryPanel } from "./media-library";
import type { MediaAsset } from "../../hooks/use-media";

export function MediaPickerButton({
  value,
  onChange,
  label = "Choisir une image",
  className = "",
}: {
  value?: string;
  onChange: (url: string, asset?: MediaAsset) => void;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--ipk-border)] hover:bg-[var(--ipk-surface)]"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          <ImageIcon className="w-4 h-4" /> {value ? "Changer" : label}
        </button>
        {value && (
          <>
            <div className="w-12 h-12 rounded border border-[var(--ipk-border)] overflow-hidden bg-[var(--ipk-surface)] flex items-center justify-center">
              <img src={value} alt="" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1 rounded hover:bg-[var(--ipk-surface)] text-[var(--ipk-text-muted)]"
              aria-label="Retirer l'image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bibliothèque média</DialogTitle>
          </DialogHeader>
          <MediaLibraryPanel
            onPick={(asset) => {
              onChange(asset.url, asset);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
