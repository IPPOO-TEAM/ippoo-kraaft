import { useEffect, useState } from "react";
import { supabase, supabaseConfig } from "../../lib/supabase";

export function TestConnexionDirecte() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
    console.log(msg);
  };

  useEffect(() => {
    runTest();
  }, []);

  const runTest = async () => {
    setLogs([]);
    setStatus('testing');

    addLog("🔍 === TEST CONNEXION DIRECTE SUPABASE ===");
    addLog("");

    // Utiliser la config du client singleton
    const SUPABASE_URL = supabaseConfig.url;
    const SUPABASE_ANON_KEY = supabaseConfig.anonKey;

    addLog(`📋 Configuration utilisée:`);
    addLog(`   URL: ${SUPABASE_URL}`);
    addLog(`   Key Length: ${SUPABASE_ANON_KEY.length} chars`);
    addLog(`   Key Start: ${SUPABASE_ANON_KEY.slice(0, 30)}...`);
    addLog(`   Key End: ...${SUPABASE_ANON_KEY.slice(-30)}`);
    addLog(`   Config source: ${supabaseConfig.isConfiguredFromEnv?.url ? '.env' : 'hardcoded'}`);
    addLog("");

    // Test 1: Vérifier le client
    addLog("🔌 Étape 1: Vérification du client Supabase singleton...");
    if (!supabase) {
      addLog(`   ❌ Client non initialisé`);
      setStatus('error');
      return;
    }
    addLog("   ✅ Client singleton OK");
    addLog("");

    // Test 2: Requête HTTP simple avec fetch
    addLog("🌐 Étape 2: Test fetch HTTP direct...");
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      addLog(`   Status: ${response.status} ${response.statusText}`);
      addLog(`   OK: ${response.ok}`);

      if (!response.ok) {
        const text = await response.text();
        addLog(`   Body: ${text.slice(0, 200)}`);
      }
    } catch (err: any) {
      addLog(`   ❌ Erreur fetch: ${err.message}`);
      addLog(`   Type: ${err.name}`);
      if (err.message.includes('CORS')) {
        addLog(`   ⚠️ PROBLÈME CORS DÉTECTÉ`);
      }
    }
    addLog("");

    // Test 3: Requête Supabase simple
    addLog("🧪 Étape 3: Test requête Supabase...");
    try {
      const { data, error, count, status, statusText } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      addLog(`   Status: ${status}`);
      addLog(`   StatusText: ${statusText || '(vide)'}`);
      addLog(`   Count: ${count}`);
      addLog(`   Data: ${JSON.stringify(data)}`);

      if (error) {
        addLog(`   ❌ Erreur Supabase:`);
        addLog(`      message: "${error.message}"`);
        addLog(`      code: ${error.code || 'N/A'}`);
        addLog(`      details: ${error.details || 'N/A'}`);
        addLog(`      hint: ${error.hint || 'N/A'}`);

        // Analyse du type d'erreur
        if (!error.message || error.message === '') {
          addLog("");
          addLog(`   🔍 DIAGNOSTIC: Message d'erreur vide`);
          addLog(`      Cela indique généralement:`);
          addLog(`      1. Problème réseau/CORS`);
          addLog(`      2. Clé API invalide/expirée`);
          addLog(`      3. URL incorrecte`);
          addLog(`      4. Restriction firewall`);
        } else if (error.message.includes('does not exist') || error.code === 'PGRST116') {
          addLog("");
          addLog(`   ✅ DIAGNOSTIC: Connexion OK, tables non créées`);
          setStatus('success');
        } else {
          addLog("");
          addLog(`   ❌ DIAGNOSTIC: Erreur de connexion`);
          setStatus('error');
        }
      } else {
        addLog(`   ✅ CONNEXION RÉUSSIE!`);
        addLog(`      Tables existent et fonctionnent`);
        setStatus('success');
      }
    } catch (err: any) {
      addLog(`   ❌ Exception catchée:`);
      addLog(`      Type: ${err.name}`);
      addLog(`      Message: "${err.message}"`);
      addLog(`      Stack: ${err.stack?.slice(0, 300)}`);
      setStatus('error');
    }

    addLog("");
    addLog("🏁 === FIN DU TEST ===");
  };

  const getStatusColor = () => {
    if (status === 'success') return '#0D8A3E';
    if (status === 'error') return '#dc2626';
    return '#0057FF';
  };

  const getStatusEmoji = () => {
    if (status === 'success') return '✅';
    if (status === 'error') return '❌';
    return '🔄';
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: getStatusColor(),
        color: 'white',
        borderRadius: '8px'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>
          {getStatusEmoji()} Test Connexion Directe Supabase
        </h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
          Test avec credentials en dur (sans .env)
        </p>
      </div>

      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#00ff00',
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: '1.5',
        overflow: 'auto',
        maxHeight: '600px',
        marginBottom: '20px'
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap' }}>
            {log}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={runTest}
          style={{
            padding: '12px 24px',
            backgroundColor: '#0057FF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🔄 Relancer le test
        </button>

        <a
          href="https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 24px',
            backgroundColor: '#0D8A3E',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          🔗 Ouvrir Dashboard Supabase
        </a>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 Que faire selon le résultat</h3>

        <div style={{ marginTop: '15px' }}>
          <strong>✅ Si "Connexion OK, tables non créées":</strong>
          <p style={{ margin: '5px 0' }}>
            Parfait! La connexion fonctionne. Il faut juste exécuter le schema SQL.
          </p>
          <a
            href="https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0057FF' }}
          >
            → Ouvrir SQL Editor
          </a>
        </div>

        <div style={{ marginTop: '15px' }}>
          <strong>❌ Si "Message d'erreur vide":</strong>
          <p style={{ margin: '5px 0' }}>
            Problème de connexion. Vérifiez:
          </p>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li>Que vous avez accès à internet</li>
            <li>Que Supabase n'est pas bloqué par un firewall</li>
            <li>Les logs dans la console (F12)</li>
          </ul>
        </div>

        <div style={{ marginTop: '15px' }}>
          <strong>❌ Si "Clé API invalide":</strong>
          <p style={{ margin: '5px 0' }}>
            La clé a peut-être été régénérée. Vérifiez dans le dashboard Supabase:
          </p>
          <a
            href="https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0057FF' }}
          >
            → Vérifier les clés API
          </a>
        </div>
      </div>
    </div>
  );
}
