// IPPOO KRAAFT - Test de connexion Supabase
// Utilitaire pour vérifier que Supabase est bien configuré

import { supabase, supabaseConfig } from '../supabase';

export interface ConnectionTestResult {
  ok: boolean;
  projectId: string;
  url: string;
  anonKeyPreview: string; // Derniers caractères de la clé
  error?: string;
  tablesCount?: number;
  tables?: string[];
}

/**
 * Teste la connexion à Supabase
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    ok: false,
    projectId: supabaseConfig.projectId,
    url: supabaseConfig.url,
    anonKeyPreview: `...${supabaseConfig.anonKey.slice(-20)}`,
  };

  try {
    // Test 1: Vérifier que le client est initialisé
    if (!supabase) {
      result.error = 'Client Supabase non initialisé';
      return result;
    }

    // Test 2: Essayer de lister les tables (via une requête simple)
    const { data, error } = await supabase
      .from('products') // Table principale
      .select('count', { count: 'exact', head: true });

    if (error) {
      // Si la table n'existe pas, ce n'est pas grave, au moins on a contacté Supabase
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        result.ok = true;
        result.error = 'Connexion OK mais schema non créé (tables manquantes)';
        result.tablesCount = 0;
        result.tables = [];
        return result;
      }

      result.error = `Erreur Supabase: ${error.message}`;
      return result;
    }

    // Test 3: Connexion réussie!
    result.ok = true;
    result.tablesCount = 1; // Au moins products existe
    result.tables = ['products'];

    return result;
  } catch (err) {
    result.error = err instanceof Error ? err.message : 'Erreur inconnue';
    return result;
  }
}

/**
 * Affiche les informations de connexion dans la console
 */
export async function logSupabaseInfo() {
  console.group('🔌 Supabase Connection Info');
  console.log('Project ID:', supabaseConfig.projectId);
  console.log('URL:', supabaseConfig.url);
  console.log('Anon Key:', `...${supabaseConfig.anonKey.slice(-20)}`);
  console.log('Full Anon Key (last 50):', `...${supabaseConfig.anonKey.slice(-50)}`);

  console.log('\n🧪 Testing connection...');
  const test = await testSupabaseConnection();

  if (test.ok) {
    console.log('✅ Connexion réussie!');
    if (test.tablesCount !== undefined) {
      console.log(`📊 Tables trouvées: ${test.tablesCount}`);
      if (test.tables && test.tables.length > 0) {
        console.log('Tables:', test.tables.join(', '));
      }
    }
    if (test.error) {
      console.warn('⚠️', test.error);
    }
  } else {
    console.error('❌ Connexion échouée');
    console.error('Erreur:', test.error);
  }

  console.groupEnd();

  return test;
}

/**
 * Récupère des statistiques basiques
 */
export async function getSupabaseStats() {
  try {
    const stats = {
      products: 0,
      orders: 0,
      users: 0,
      artisans: 0,
    };

    // Compter les produits
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    stats.products = productsCount || 0;

    // Compter les commandes
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    stats.orders = ordersCount || 0;

    // Compter les utilisateurs
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    stats.users = usersCount || 0;

    // Compter les artisans
    const { count: artisansCount } = await supabase
      .from('artisans')
      .select('*', { count: 'exact', head: true });
    stats.artisans = artisansCount || 0;

    return { ok: true, stats };
  } catch (error) {
    console.error('[Supabase] Stats error:', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
