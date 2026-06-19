/**
 * Copie du texte dans le presse-papiers de manière sécurisée
 * avec fallback pour les environnements où l'API Clipboard n'est pas disponible
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Méthode moderne : Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback : execCommand (deprecated mais fonctionne dans plus de contextes)
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    console.warn("Erreur de copie dans le presse-papiers:", error);
    return false;
  }
}
