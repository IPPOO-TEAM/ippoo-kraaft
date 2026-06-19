// Page Admin - Tableau de bord Supabase
import { useState, useEffect } from 'react';
import { supabase, supabaseConfig } from '../../../lib/supabase';
import { Database, CheckCircle, XCircle, RefreshCw, Table, Eye } from 'lucide-react';

interface TableInfo {
  name: string;
  count?: number;
  error?: string;
}

export function SupabaseDashboard() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test simple de connexion
      const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });

      if (error && !error.message.includes('does not exist')) {
        throw error;
      }

      setIsConnected(true);
      await discoverTables();
    } catch (err: any) {
      console.error('Erreur de connexion:', err?.message || err || 'Erreur inconnue');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const discoverTables = async () => {
    // Liste des tables courantes potentielles pour IPPOO KRAAFT
    const potentialTables = [
      'products',
      'orders',
      'users',
      'artisans',
      'categories',
      'blog_posts',
      'events',
      'formations',
      'galleries',
      'reviews',
      'cart',
      'wishlist',
      'loyalty_points',
      'referrals',
      'promotions',
      'gift_cards'
    ];

    const tableInfos: TableInfo[] = [];

    for (const tableName of potentialTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          tableInfos.push({ name: tableName, count });
        }
      } catch (err) {
        // Table n'existe pas, on l'ignore
      }
    }

    setTables(tableInfos);
  };

  const loadTableData = async (tableName: string) => {
    setLoadingData(true);
    setSelectedTable(tableName);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10);

      if (error) throw error;
      setTableData(data || []);
    } catch (err: any) {
      console.error('Erreur de chargement:', err);
      setTableData([]);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-[#0057FF]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tableau de bord Supabase
                </h1>
                <p className="text-sm text-gray-600">
                  Gestion et monitoring de votre base de données
                </p>
              </div>
            </div>
            <button
              onClick={testConnection}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#0057FF] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>

          {/* Status de connexion */}
          <div className="border-t pt-4">
            {loading && isConnected === null && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0057FF] border-t-transparent"></div>
                <span>Test de connexion en cours...</span>
              </div>
            )}

            {isConnected === true && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#0D8A3E]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Connexion établie avec succès</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Projet ID:</span>
                    <span className="ml-2 font-mono text-gray-900">{supabaseConfig.projectId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">URL:</span>
                    <span className="ml-2 font-mono text-gray-900 text-xs">{supabaseConfig.url}</span>
                  </div>
                </div>
              </div>
            )}

            {isConnected === false && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Échec de connexion à Supabase</span>
              </div>
            )}
          </div>
        </div>

        {/* Tables disponibles */}
        {isConnected && tables.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Table className="w-5 h-5 text-[#0057FF]" />
              Tables disponibles ({tables.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <button
                  key={table.name}
                  onClick={() => loadTableData(table.name)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedTable === table.name
                      ? 'border-[#0057FF] bg-blue-50'
                      : 'border-gray-200 hover:border-[#0057FF]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{table.name}</span>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                  {table.count !== undefined && (
                    <span className="text-sm text-gray-600">
                      {table.count} {table.count > 1 ? 'entrées' : 'entrée'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Données de la table sélectionnée */}
        {selectedTable && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Données: {selectedTable}
            </h2>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0057FF] border-t-transparent"></div>
              </div>
            ) : tableData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(tableData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((value: any, cellIdx) => (
                          <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-sm text-gray-500 mt-4">
                  Affichage des 10 premières entrées
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune donnée trouvée dans cette table
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        {isConnected && tables.length === 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Aucune table détectée
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Votre projet Supabase est connecté, mais aucune table n'a été trouvée.
              Vous devez créer vos tables dans le SQL Editor de Supabase.
            </p>
            <a
              href={`${supabaseConfig.url.replace('.supabase.co', '')}.supabase.co/project/${supabaseConfig.projectId}/editor`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0057FF] text-white rounded-lg hover:bg-blue-700"
            >
              Ouvrir Supabase SQL Editor
              <Eye className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
