// IPPOO KRAAFT - Supabase Storage
// Gestion de l'upload et du stockage des fichiers

import { supabase } from '../supabase';

export type StorageBucket = 'profiles' | 'products' | 'documents' | 'blog' | 'media';

export interface UploadResult {
  ok: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload d'une photo de profil
 */
export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<UploadResult> {
  try {
    const ext = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    return {
      ok: true,
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('[Storage] Profile photo upload error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur d\'upload'
    };
  }
}

/**
 * Upload d'une image de produit
 */
export async function uploadProductImage(
  productId: string,
  file: File,
  index?: number
): Promise<UploadResult> {
  try {
    const ext = file.name.split('.').pop();
    const fileName = index !== undefined
      ? `${productId}/${index}-${Date.now()}.${ext}`
      : `${productId}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, {
        cacheControl: '3600'
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return {
      ok: true,
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('[Storage] Product image upload error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur d\'upload'
    };
  }
}

/**
 * Upload d'un document (KYC, justificatifs, etc.)
 */
export async function uploadDocument(
  userId: string,
  file: File,
  type: 'id' | 'proof' | 'certificate' | 'other'
): Promise<UploadResult> {
  try {
    const ext = file.name.split('.').pop();
    const fileName = `${userId}/${type}-${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600'
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    // Les documents sont privés, on ne génère pas d'URL publique
    // L'accès sera contrôlé par RLS
    return {
      ok: true,
      path: fileName
    };
  } catch (error) {
    console.error('[Storage] Document upload error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur d\'upload'
    };
  }
}

/**
 * Upload d'une image de blog
 */
export async function uploadBlogImage(
  file: File,
  postId?: string
): Promise<UploadResult> {
  try {
    const ext = file.name.split('.').pop();
    const fileName = postId
      ? `${postId}/${Date.now()}.${ext}`
      : `${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('blog')
      .upload(fileName, file, {
        cacheControl: '3600'
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog')
      .getPublicUrl(fileName);

    return {
      ok: true,
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('[Storage] Blog image upload error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur d\'upload'
    };
  }
}

/**
 * Upload vers la bibliothèque média (admin)
 */
export async function uploadToMediaLibrary(
  file: File,
  folder: string = 'uncategorized'
): Promise<UploadResult> {
  try {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600'
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    // Enregistrer dans la table media_library
    const { error: dbError } = await supabase
      .from('media_library')
      .insert({
        filename: file.name,
        file_url: publicUrl,
        file_type: file.type.startsWith('image/') ? 'image' : 'document',
        mime_type: file.type,
        file_size: file.size,
        folder,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('[Storage] Media library DB error:', dbError);
    }

    return {
      ok: true,
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('[Storage] Media library upload error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur d\'upload'
    };
  }
}

/**
 * Supprimer un fichier
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    console.error('[Storage] Delete error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur de suppression'
    };
  }
}

/**
 * Obtenir l'URL publique d'un fichier
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

/**
 * Obtenir une URL signée temporaire (pour les fichiers privés)
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn: number = 3600 // 1 heure par défaut
): Promise<{ url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      return { error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error) {
    console.error('[Storage] Signed URL error:', error);
    return {
      error: error instanceof Error ? error.message : 'Erreur de génération d\'URL'
    };
  }
}

/**
 * Lister les fichiers d'un dossier
 */
export async function listFiles(
  bucket: StorageBucket,
  folder?: string
): Promise<{ files: any[]; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) {
      return { files: [], error: error.message };
    }

    return { files: data || [] };
  } catch (error) {
    console.error('[Storage] List files error:', error);
    return {
      files: [],
      error: error instanceof Error ? error.message : 'Erreur de listage'
    };
  }
}

/**
 * Valider un fichier avant upload
 */
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSizeMB = 5, // 5MB par défaut
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
  } = options;

  // Vérifier la taille
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux (max ${maxSizeMB}MB)`
    };
  }

  // Vérifier le type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Utilitaire: Convertir un fichier en base64 (pour aperçu)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
