// Composant de test pour vérifier la connexion Supabase
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, XCircle, Database } from 'lucide-react';

export function SupabaseTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test de connexion simple
      const { data, error: queryError } = await supabase
        .from('_test_connection')
        .select('*')
        .limit(1);

      if (queryError) {
        // Si l'erreur est "relation does not exist", c'est OK - la connexion fonctionne
        if (queryError.message.includes('does not exist')) {
          setIsConnected(true);
          setError(null);
          await listTables();
        } else {
          throw queryError;
        }
      } else {
        setIsConnected(true);
        setError(null);
        await listTables();
      }
    } catch (err: any) {
      setIsConnected(false);
      setError(err.message || 'Erreur de connexion');
    }
  };

  const listTables = async () => {
    try {
      // Requête pour lister les tables publiques
      const { data, error } = await supabase
        .rpc('get_tables_list')
        .select('*');

      if (!error && data) {
        setTables(data.map((t: any) => t.tablename));
      }
    } catch (err) {
      console.log('Impossible de lister les tables:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <Database className="w-5 h-5 text-[#0057FF]" />
        <h3 className="font-semibold text-sm">Connexion Supabase</h3>
      </div>

      <div className="space-y-2">
        {isConnected === null && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#0057FF] border-t-transparent"></div>
            <span>Test de connexion...</span>
          </div>
        )}

        {isConnected === true && (
          <div className="flex items-center gap-2 text-sm text-[#0D8A3E]">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Connecté avec succès</span>
          </div>
        )}

        {isConnected === false && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <XCircle className="w-4 h-4" />
              <span className="font-medium">Échec de connexion</span>
            </div>
            {error && (
              <p className="text-xs text-gray-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t">
          <p><strong>Projet:</strong> xovnqrlpgkcrakmgrrah</p>
          <p><strong>URL:</strong> https://xovnqrlpgkcrakmgrrah.supabase.co</p>
          {tables.length > 0 && (
            <div className="mt-2">
              <p className="font-medium mb-1">Tables disponibles:</p>
              <ul className="list-disc list-inside text-xs">
                {tables.map(table => (
                  <li key={table}>{table}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={testConnection}
          className="w-full mt-3 bg-[#0057FF] text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Retester la connexion
        </button>
      </div>
    </div>
  );
}
