// IPPOO KRAAFT - Supabase Client Configuration
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Utiliser les variables d'environnement en priorité, sinon fallback sur les valeurs fournies
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xovnqrlpgkcrakmgrrah.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvdm5xcmxwZ2tjcmFrbWdycmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzAyNjQsImV4cCI6MjA2MjgwNjI2NH0.qY7dA4AZgw4eN_dYQPr4ckz2oeMPpY8dLfKEj7Wd66Y';

// Vérification de la configuration au chargement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Configuration manquante!', { supabaseUrl, hasKey: !!supabaseAnonKey });
}

// Log de débogage (seulement en dev)
if (import.meta.env.DEV) {
  console.log('[Supabase] Initialisation du client singleton:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey?.length,
    keyPreview: supabaseAnonKey?.slice(-20),
    fromEnv: {
      url: !!import.meta.env.VITE_SUPABASE_URL,
      key: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  });
}

// Singleton: une seule instance du client Supabase pour toute l'application
// Cela évite le warning "Multiple GoTrueClient instances detected"
let _supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!_supabaseInstance) {
    _supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Utiliser une storage key unique pour éviter les conflits
        storageKey: 'sb-xovnqrlpgkcrakmgrrah-auth-token',
      }
    });

    if (import.meta.env.DEV) {
      console.log('[Supabase] ✅ Client singleton créé');
    }
  }
  return _supabaseInstance;
}

export const supabase = getSupabaseClient();

// Export configuration details
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  projectId: supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'xovnqrlpgkcrakmgrrah',
  isConfiguredFromEnv: {
    url: !!import.meta.env.VITE_SUPABASE_URL,
    key: !!import.meta.env.VITE_SUPABASE_ANON_KEY
  }
};
