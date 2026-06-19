import { useEffect, useState } from "react";
import { supabase, supabaseConfig } from "../../lib/supabase";

export function DebugSupabase() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    runDebug();
  }, []);

  const runDebug = async () => {
    setLogs([]);

    addLog("🔍 === DÉMARRAGE DU DEBUG SUPABASE ===");
    addLog("");

    // 1. Vérifier les variables d'environnement
    addLog("📋 Variables d'environnement:");
    addLog(`  VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL || '(non définie)'}`);
    addLog(`  VITE_SUPABASE_ANON_KEY présente: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'OUI' : 'NON'}`);
    if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      addLog(`  Longueur de la clé: ${key.length} caractères`);
      addLog(`  Début: ${key.slice(0, 20)}...`);
      addLog(`  Fin: ...${key.slice(-20)}`);
    }
    addLog("");

    // 2. Vérifier la configuration
    addLog("⚙️ Configuration Supabase:");
    addLog(`  URL: ${supabaseConfig.url}`);
    addLog(`  Project ID: ${supabaseConfig.projectId}`);
    addLog(`  Anon Key Length: ${supabaseConfig.anonKey?.length || 0}`);
    addLog(`  Début clé: ${supabaseConfig.anonKey?.slice(0, 20)}...`);
    addLog(`  Fin clé: ...${supabaseConfig.anonKey?.slice(-20)}`);
    addLog(`  Config depuis .env: URL=${supabaseConfig.isConfiguredFromEnv?.url}, Key=${supabaseConfig.isConfiguredFromEnv?.key}`);
    addLog("");

    // 3. Vérifier le client Supabase
    addLog("🔌 Client Supabase:");
    addLog(`  Client créé: ${supabase ? 'OUI' : 'NON'}`);
    if (supabase) {
      addLog(`  Type: ${typeof supabase}`);
      addLog(`  A une méthode 'from': ${typeof supabase.from === 'function' ? 'OUI' : 'NON'}`);
    }
    addLog("");

    // 4. Test de connexion simple
    addLog("🧪 Test de connexion...");
    try {
      const startTime = Date.now();

      const { data, error, count, status, statusText } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const duration = Date.now() - startTime;

      addLog(`  Durée de la requête: ${duration}ms`);
      addLog(`  Status: ${status}`);
      addLog(`  StatusText: ${statusText}`);
      addLog(`  Count: ${count}`);
      addLog(`  Data: ${JSON.stringify(data)}`);

      if (error) {
        addLog(`  ❌ ERREUR DÉTECTÉE:`);
        addLog(`     Message: "${error.message || '(vide)'}"`);
        addLog(`     Code: ${error.code || '(aucun)'}`);
        addLog(`     Details: ${error.details || '(aucun)'}`);
        addLog(`     Hint: ${error.hint || '(aucun)'}`);
        addLog(`     Erreur complète: ${JSON.stringify(error, null, 2)}`);

        // Diagnostic
        if (!error.message) {
          addLog("");
          addLog("⚠️ DIAGNOSTIC: Message d'erreur vide");
          addLog("   Cela peut indiquer:");
          addLog("   - Un problème réseau (CORS, firewall)");
          addLog("   - Une clé API invalide");
          addLog("   - Un problème de connexion");
        }

        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          addLog("");
          addLog("✅ DIAGNOSTIC: Connexion réussie mais tables non créées");
          addLog("   Action requise: Exécuter supabase/schema.sql");
        }
      } else {
        addLog(`  ✅ CONNEXION RÉUSSIE!`);
        addLog(`     ${count || 0} produit(s) trouvé(s)`);
      }
    } catch (err: any) {
      addLog(`  ❌ EXCEPTION ATTRAPÉE:`);
      addLog(`     Type: ${err?.name || typeof err}`);
      addLog(`     Message: "${err?.message || '(vide)'}"`);
      addLog(`     Stack: ${err?.stack || '(aucune)'}`);
      addLog(`     Erreur brute: ${JSON.stringify(err, null, 2)}`);
    }

    addLog("");
    addLog("🏁 === FIN DU DEBUG ===");
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'monospace',
      fontSize: '13px'
    }}>
      <h1 style={{ fontFamily: 'sans-serif', marginBottom: '20px' }}>
        🐛 Debug Supabase
      </h1>

      <div style={{
        backgroundColor: '#000',
        color: '#0f0',
        padding: '20px',
        borderRadius: '8px',
        overflow: 'auto',
        maxHeight: '600px'
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '2px', whiteSpace: 'pre-wrap' }}>
            {log}
          </div>
        ))}
      </div>

      <button
        onClick={runDebug}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0057FF',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'sans-serif'
        }}
      >
        🔄 Relancer le debug
      </button>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px',
        fontFamily: 'sans-serif'
      }}>
        <h3 style={{ marginBottom: '10px' }}>📋 Actions possibles</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Vérifiez que le fichier .env existe dans /workspaces/default/code/</li>
          <li>Vérifiez que les variables VITE_SUPABASE_* sont présentes</li>
          <li>Rafraîchissez la page (Ctrl+R) si vous venez de modifier .env</li>
          <li>Ouvrez la console navigateur (F12) pour voir les logs détaillés</li>
        </ul>
      </div>
    </div>
  );
}
