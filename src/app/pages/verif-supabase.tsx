import { useEffect, useState } from "react";
import { supabase, supabaseConfig } from "../../lib/supabase";

export function VerifSupabase() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnexion();
  }, []);

  const testConnexion = async () => {
    setLoading(true);
    const info: any = {
      timestamp: new Date().toISOString(),
      config: {
        url: supabaseConfig.url,
        keyLength: supabaseConfig.anonKey?.length,
        projectId: supabaseConfig.projectId,
        keyEnd: supabaseConfig.anonKey?.slice(-30),
        fromEnv: supabaseConfig.isConfiguredFromEnv,
      }
    };

    // Test simple
    try {
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (error) {
        info.connexion = {
          ok: error.code === 'PGRST116' || error.message.includes('does not exist'),
          error: error.message,
          code: error.code,
          diagnostic: error.code === 'PGRST116'
            ? "✅ Connexion réussie - Tables non créées (normal)"
            : "❌ Erreur de connexion"
        };
      } else {
        info.connexion = {
          ok: true,
          count: count,
          diagnostic: "✅ Connexion réussie - Tables créées!"
        };
      }
    } catch (err: any) {
      info.connexion = {
        ok: false,
        error: err.message,
        diagnostic: "❌ Exception - Problème réseau ou configuration"
      };
    }

    setResult(info);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
        <div style={{ fontSize: '18px' }}>Test en cours...</div>
      </div>
    );
  }

  const isOk = result?.connexion?.ok;
  const bgColor = isOk ? '#dcfce7' : '#fee2e2';
  const borderColor = isOk ? '#22c55e' : '#ef4444';
  const textColor = isOk ? '#15803d' : '#dc2626';

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>
        🔌 Vérification Connexion Supabase
      </h1>

      {/* Résultat principal */}
      <div style={{
        padding: '30px',
        backgroundColor: bgColor,
        border: `3px solid ${borderColor}`,
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <div style={{
          fontSize: '48px',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          {isOk ? '✅' : '❌'}
        </div>
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: textColor,
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          {result.connexion.diagnostic}
        </div>
        {result.connexion.error && (
          <div style={{
            fontSize: '14px',
            color: textColor,
            textAlign: 'center',
            opacity: 0.8
          }}>
            {result.connexion.error}
          </div>
        )}
      </div>

      {/* Configuration */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '15px',
          color: '#334155'
        }}>
          📋 Configuration Détectée
        </h2>
        <table style={{ width: '100%', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b', width: '160px' }}>
                Source des variables:
              </td>
              <td style={{ padding: '8px 0', fontWeight: '500' }}>
                {result.config.fromEnv?.url ? '🟢 .env' : '🟡 Hardcodé'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b' }}>URL:</td>
              <td style={{
                padding: '8px 0',
                fontFamily: 'monospace',
                fontSize: '12px',
                wordBreak: 'break-all'
              }}>
                {result.config.url}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b' }}>Project ID:</td>
              <td style={{ padding: '8px 0', fontFamily: 'monospace' }}>
                {result.config.projectId}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b' }}>Clé (longueur):</td>
              <td style={{ padding: '8px 0', fontFamily: 'monospace' }}>
                {result.config.keyLength} caractères
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#64748b' }}>Clé (fin):</td>
              <td style={{
                padding: '8px 0',
                fontFamily: 'monospace',
                fontSize: '11px'
              }}>
                ...{result.config.keyEnd}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Diagnostic */}
      {isOk && result.connexion.code === 'PGRST116' && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
            ⚠️ Prochaine Étape
          </div>
          <div style={{ fontSize: '14px', marginBottom: '15px' }}>
            La connexion fonctionne parfaitement! Il faut maintenant créer les tables de la base de données.
          </div>
          <a
            href={`https://supabase.com/dashboard/project/${result.config.projectId}/sql/new`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#0057FF',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📝 Ouvrir SQL Editor →
          </a>
          <div style={{ fontSize: '13px', marginTop: '10px', color: '#92400e' }}>
            Copiez-y le contenu du fichier <code>supabase/schema.sql</code>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={testConnexion}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0057FF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🔄 Retester
        </button>

        <a
          href={`https://supabase.com/dashboard/project/${result.config.projectId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0D8A3E',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          🗄️ Dashboard Supabase
        </a>
      </div>

      {/* Info */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#eff6ff',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#1e40af'
      }}>
        <strong>ℹ️ Note:</strong> Les credentials sont maintenant <strong>hardcodés dans le code</strong>
        avec un fallback. Même si le fichier <code>.env</code> n'est pas chargé par Vite,
        la connexion fonctionnera car les valeurs sont directement dans <code>src/lib/supabase.ts</code>.
      </div>
    </div>
  );
}
