/**
 * Validation centralisée pour les uploads de fichiers (images, documents).
 * Chaque utilitaire renvoie soit un dataURL soit lance une Error explicative.
 */

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export interface ImageValidationOptions {
  /** Taille max en octets. Défaut 5 Mo. */
  maxBytes?: number;
  /** Largeur min en px (lue après décodage). */
  minWidth?: number;
  /** Hauteur min en px. */
  minHeight?: number;
  /** Liste de types MIME autorisés. */
  allowedTypes?: readonly string[];
}

const DEFAULT_MAX_IMG = 5 * 1024 * 1024;
const DEFAULT_MAX_DOC = 8 * 1024 * 1024;

function bytesToHuman(b: number): string {
  if (b < 1024) return `${b} o`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} Ko`;
  return `${(b / (1024 * 1024)).toFixed(1)} Mo`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(new Error("Lecture du fichier impossible."));
    r.readAsDataURL(file);
  });
}

/** Valide un upload image et retourne le dataURL. Throws si invalide. */
export async function validateAndReadImage(file: File, opts: ImageValidationOptions = {}): Promise<string> {
  const allowed = opts.allowedTypes ?? ALLOWED_IMAGE_TYPES;
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_IMG;

  if (!allowed.includes(file.type)) {
    throw new Error(`Type non autorisé : ${file.type || "inconnu"}. Formats acceptés : ${allowed.map(t => t.split("/")[1]).join(", ")}.`);
  }
  if (file.size > maxBytes) {
    throw new Error(`Fichier trop volumineux (${bytesToHuman(file.size)}). Maximum : ${bytesToHuman(maxBytes)}.`);
  }
  if (file.size === 0) {
    throw new Error("Le fichier est vide.");
  }

  const dataUrl = await readAsDataUrl(file);

  if (opts.minWidth || opts.minHeight) {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (opts.minWidth && img.width < opts.minWidth) return reject(new Error(`Largeur insuffisante : ${img.width}px (min ${opts.minWidth}px).`));
        if (opts.minHeight && img.height < opts.minHeight) return reject(new Error(`Hauteur insuffisante : ${img.height}px (min ${opts.minHeight}px).`));
        resolve();
      };
      img.onerror = () => reject(new Error("Image illisible ou corrompue."));
      img.src = dataUrl;
    });
  }

  return dataUrl;
}

/** Valide un document (PDF/images justificatifs) et retourne le dataURL. */
export async function validateAndReadDocument(file: File, opts: { maxBytes?: number } = {}): Promise<string> {
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_DOC;
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    throw new Error(`Type non autorisé. Formats acceptés : PDF, JPEG, PNG, WebP.`);
  }
  if (file.size > maxBytes) {
    throw new Error(`Fichier trop volumineux (${bytesToHuman(file.size)}). Maximum : ${bytesToHuman(maxBytes)}.`);
  }
  if (file.size === 0) throw new Error("Le fichier est vide.");
  return readAsDataUrl(file);
}
