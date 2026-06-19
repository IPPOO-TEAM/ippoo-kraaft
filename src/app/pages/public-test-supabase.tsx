import { useEffect, useState } from "react";
import { supabase, supabaseConfig } from "../../lib/supabase";

export function PublicTestSupabase() {
  const [status, setStatus] = useState("Testing...");
  const [details, setDetails] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runTest();
  }, []);

  const runTest = async () => {
    try {
      setStatus("🔌 Vérification de la configuration...");
      setError(null);

      // Vérifier que supabase est défini
      if (!supabase) {
        throw new Error("Le client Supabase n'est pas initialisé");
      }

      // Vérifier que la config est valide
      if (!supabaseConfig.url || !supabaseConfig.anonKey) {
        throw new Error("Configuration Supabase manquante (URL ou Anon Key)");
      }

      // Afficher la config
      const config = {
        url: supabaseConfig.url,
        projectId: supabaseConfig.projectId,
        anonKeyLength: supabaseConfig.anonKey.length,
        anonKeyPreview: `...${supabaseConfig.anonKey.slice(-30)}`,
        anonKeyStart: supabaseConfig.anonKey.slice(0, 20) + '...',
      };

      setDetails((prev: any) => ({ ...prev, config }));
      setStatus("✅ Configuration chargée");

      // Test de connexion
      setStatus("🧪 Test de connexion à Supabase...");

      const { data, error: testError, count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      console.log('Supabase test result:', { data, error: testError, count });

      if (testError) {
        console.error('Supabase error details:', {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code
        });

        // Vérifier le type d'erreur
        if (testError.code === 'PGRST116' || testError.message.includes('does not exist') || testError.message.includes('relation') || testError.message.includes('table')) {
          setStatus("⚠️ Connexion OK - Tables non créées");
          setDetails((prev: any) => ({
            ...prev,
            connected: true,
            tablesExist: false,
            errorCode: testError.code,
            errorMessage: testError.message,
            message: "La connexion fonctionne mais le schema SQL n'a pas été exécuté"
          }));
          return; // Pas d'erreur, juste que les tables n'existent pas
        } else if (testError.message.includes('JWT') || testError.message.includes('auth') || testError.message.includes('unauthorized')) {
          throw new Error(`Erreur d'authentification: Clé API invalide ou expirée. ${testError.message}`);
        } else if (testError.message.includes('CORS')) {
          throw new Error(`Erreur CORS: Vérifiez la configuration CORS dans Supabase. ${testError.message}`);
        } else {
          throw new Error(`Erreur Supabase: ${testError.message || 'Erreur inconnue'} (Code: ${testError.code || 'N/A'})`);
        }
      } else {
        setStatus("✅ Connexion réussie!");
        setDetails((prev: any) => ({
          ...prev,
          connected: true,
          tablesExist: true,
          productsCount: count || 0
        }));
      }
    } catch (err: any) {
      console.error('Test error:', err);
      const errorMessage = err.message || err.toString() || 'Erreur inconnue (message vide)';
      setError(errorMessage);
      setStatus("❌ Erreur de connexion");
      setDetails((prev: any) => ({
        ...prev,
        connected: false,
        errorDetails: {
          name: err.name,
          message: err.message,
          stack: err.stack,
          raw: JSON.stringify(err, null, 2)
        }
      }));
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '50px auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        🧪 Test Connexion Supabase
      </h1>

      <div style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>État</h2>
        <p style={{ fontSize: '16px', margin: 0 }}>{status}</p>
      </div>

      {error && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#c00'
        }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}

      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Détails</h2>

        {details.config && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>Configuration</h3>
            <div style={{ fontSize: '13px', fontFamily: 'monospace' }}>
              <div>URL: <code>{details.config.url}</code></div>
              <div>Project ID: <code>{details.config.projectId}</code></div>
              <div>Anon Key Start: <code>{details.config.anonKeyStart}</code></div>
              <div>Anon Key End: <code>{details.config.anonKeyPreview}</code></div>
              <div>Anon Key Length: <code>{details.config.anonKeyLength} caractères</code></div>
            </div>
          </div>
        )}

        {details.errorDetails && (
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px'
          }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#c00' }}>Détails de l'erreur</h3>
            <pre style={{
              fontSize: '11px',
              overflow: 'auto',
              maxHeight: '200px',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {details.errorDetails.raw}
            </pre>
          </div>
        )}

        {details.connected !== undefined && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>Connexion</h3>
            <div style={{ fontSize: '14px' }}>
              <div>
                Status: <strong style={{ color: details.connected ? 'green' : 'red' }}>
                  {details.connected ? '✅ Connecté' : '❌ Échec'}
                </strong>
              </div>
              {details.tablesExist !== undefined && (
                <div>
                  Tables: <strong style={{ color: details.tablesExist ? 'green' : 'orange' }}>
                    {details.tablesExist ? '✅ Créées' : '⚠️ Non créées'}
                  </strong>
                </div>
              )}
              {details.message && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                  ℹ️ {details.message}
                </div>
              )}
            </div>
          </div>
        )}

        {details.tablesExist === false && (
          <div style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '6px',
            marginTop: '15px'
          }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>⚠️ Prochaine étape</h3>
            <p style={{ fontSize: '13px', margin: '0 0 10px 0' }}>
              Vous devez exécuter le fichier <code>supabase/schema.sql</code> dans votre dashboard Supabase.
            </p>
            <a
              href={`https://supabase.com/dashboard/project/${details.config?.projectId}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#0057FF',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '13px'
              }}
            >
              Ouvrir SQL Editor →
            </a>
          </div>
        )}
      </div>

      <button
        onClick={runTest}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0D8A3E',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        🔄 Retester
      </button>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>📋 Checklist</h3>
        <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '20px' }}>
          <li>✅ Fichier .env créé avec vos credentials</li>
          <li>✅ Connexion Supabase fonctionnelle</li>
          <li style={{ color: details.tablesExist ? 'green' : 'orange' }}>
            {details.tablesExist ? '✅' : '⏳'} Exécuter supabase/schema.sql
          </li>
          <li>⏳ Créer les 5 buckets Storage</li>
          <li>⏳ Configurer FedaPay dans .env</li>
          <li>⏳ Configurer Brevo dans .env</li>
        </ul>
      </div>
    </div>
  );
}
