import { useEffect, useState } from "react";

export function TestBasique() {
  const [etapes, setEtapes] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    runTest();
  }, []);

  const addEtape = (msg: string) => {
    setEtapes(prev => [...prev, msg]);
    console.log(msg);
  };

  const runTest = async () => {
    setEtapes([]);
    setFinished(false);

    const URL = 'https://xovnqrlpgkcrakmgrrah.supabase.co';
    const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvdm5xcmxwZ2tjcmFrbWdycmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzAyNjQsImV4cCI6MjA2MjgwNjI2NH0.qY7dA4AZgw4eN_dYQPr4ckz2oeMPpY8dLfKEj7Wd66Y';

    addEtape("🔍 TEST 1: Ping simple vers Supabase");
    try {
      const response = await fetch(`${URL}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': KEY,
        }
      });
      addEtape(`   Status: ${response.status}`);
      addEtape(`   OK: ${response.ok}`);

      if (response.ok || response.status === 404) {
        addEtape("   ✅ Serveur Supabase accessible!");
      } else {
        addEtape(`   ⚠️ Status inattendu: ${response.status}`);
      }
    } catch (err: any) {
      addEtape(`   ❌ ERREUR: ${err.message}`);
      if (err.message.includes('CORS')) {
        addEtape(`   💡 Problème CORS détecté - Figma Make bloque peut-être Supabase`);
      } else if (err.message.includes('Failed to fetch')) {
        addEtape(`   💡 Impossible de joindre le serveur - Vérifiez votre connexion internet`);
      }
    }
    addEtape("");

    addEtape("🔍 TEST 2: Vérification de la clé API");
    addEtape(`   Longueur: ${KEY.length} caractères`);
    addEtape(`   Format: ${KEY.startsWith('eyJ') ? '✅ JWT valide' : '❌ Format invalide'}`);

    // Décoder le JWT (partie payload)
    try {
      const parts = KEY.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        addEtape(`   Project: ${payload.ref}`);
        addEtape(`   Role: ${payload.role}`);
        const exp = new Date(payload.exp * 1000);
        const now = new Date();
        addEtape(`   Expire: ${exp.toLocaleDateString()}`);
        addEtape(`   Valide: ${exp > now ? '✅ Oui' : '❌ Expirée!'}`);
      }
    } catch (err) {
      addEtape(`   ⚠️ Impossible de décoder le JWT`);
    }
    addEtape("");

    addEtape("🔍 TEST 3: Requête vers la table products");
    try {
      const response = await fetch(`${URL}/rest/v1/products?select=count`, {
        method: 'HEAD',
        headers: {
          'apikey': KEY,
          'Authorization': `Bearer ${KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'count=exact'
        }
      });

      addEtape(`   Status: ${response.status}`);

      if (response.status === 200) {
        addEtape(`   ✅ Table 'products' existe!`);
        const count = response.headers.get('content-range');
        addEtape(`   Nombre: ${count || '0'}`);
      } else if (response.status === 404) {
        addEtape(`   ⚠️ Table 'products' n'existe pas (normal - pas encore créée)`);
        addEtape(`   ✅ MAIS la connexion fonctionne!`);
      } else if (response.status === 401) {
        addEtape(`   ❌ Clé API refusée - elle a peut-être été régénérée`);
      } else {
        addEtape(`   ⚠️ Status: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      addEtape(`   ❌ ERREUR: ${err.message}`);
    }
    addEtape("");

    addEtape("🔍 TEST 4: Vérifier sur le Dashboard Supabase");
    addEtape(`   Ouvrez: https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah`);
    addEtape(`   Vérifiez que:`);
    addEtape(`   - Le projet existe`);
    addEtape(`   - Il n'est pas en pause`);
    addEtape(`   - La clé API n'a pas changé`);

    setFinished(true);
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        🧪 Test Basique Supabase (Fetch Pur)
      </h1>

      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#00ff00',
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: '1.8',
        minHeight: '400px',
        maxHeight: '600px',
        overflow: 'auto'
      }}>
        {etapes.map((etape, i) => (
          <div key={i}>{etape}</div>
        ))}
        {!finished && <div style={{ marginTop: '20px' }}>⏳ Test en cours...</div>}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
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
          🔄 Relancer
        </button>

        <a
          href="https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah/settings/api"
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
          🔑 Vérifier les clés API
        </a>
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        border: '2px solid #ffc107',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>⚠️ Actions à faire</h3>
        <ol style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '14px' }}>
          <li>
            <strong>Vérifiez le Dashboard Supabase:</strong>
            <ul style={{ marginTop: '5px' }}>
              <li>Allez sur <a href="https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah" target="_blank" rel="noopener noreferrer">votre projet</a></li>
              <li>Vérifiez qu'il n'est PAS en pause</li>
              <li>Si en pause, cliquez sur "Restore project"</li>
            </ul>
          </li>
          <li style={{ marginTop: '10px' }}>
            <strong>Vérifiez la clé API:</strong>
            <ul style={{ marginTop: '5px' }}>
              <li>Allez dans <a href="https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah/settings/api" target="_blank" rel="noopener noreferrer">Settings → API</a></li>
              <li>Copiez la clé "anon" "public"</li>
              <li>Comparez avec celle utilisée ici</li>
              <li>Si différente, partagez-moi la nouvelle clé</li>
            </ul>
          </li>
          <li style={{ marginTop: '10px' }}>
            <strong>Partagez les résultats:</strong>
            <ul style={{ marginTop: '5px' }}>
              <li>Prenez une capture de cette page après le test</li>
              <li>Partagez-moi ce que vous voyez</li>
              <li>Surtout les status HTTP et les erreurs</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}
