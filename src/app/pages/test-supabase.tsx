import { useEffect, useState } from "react";
import { testSupabaseConnection, getSupabaseStats, type ConnectionTestResult } from "../../lib/supabase/test-connection";
import { supabaseConfig } from "../../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CheckCircle2, XCircle, RefreshCw, Database, Link as LinkIcon } from "lucide-react";

export function TestSupabasePage() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [stats, setStats] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    setStats(null);

    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);

      if (testResult.ok) {
        const statsResult = await getSupabaseStats();
        if (statsResult.ok) {
          setStats(statsResult.stats);
        }
      }
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test de Connexion Supabase</h1>
        <p className="text-muted-foreground">
          Vérification de la configuration et de la connexion à votre base de données Supabase
        </p>
      </div>

      <div className="space-y-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-1">Project ID</div>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {supabaseConfig.projectId}
              </code>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">URL</div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                  {supabaseConfig.url}
                </code>
                <a
                  href={`${supabaseConfig.url.replace('.supabase.co', '.supabase.co')}/project/${supabaseConfig.projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Anon Key (aperçu)</div>
              <code className="text-sm bg-muted px-2 py-1 rounded block truncate">
                {supabaseConfig.anonKey.slice(0, 30)}...{supabaseConfig.anonKey.slice(-20)}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Test de connexion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <span>État de la Connexion</span>
              <Button
                onClick={runTest}
                disabled={testing}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Test en cours...' : 'Retester'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testing && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Test de connexion en cours...</span>
              </div>
            )}

            {result && !testing && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {result.ok ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {result.ok ? 'Connexion réussie ✅' : 'Connexion échouée ❌'}
                    </div>
                    {result.error && (
                      <div className="text-sm text-muted-foreground mb-2">
                        {result.error}
                      </div>
                    )}
                    {result.tablesCount !== undefined && (
                      <div className="text-sm">
                        <Badge variant={result.tablesCount > 0 ? 'default' : 'secondary'}>
                          {result.tablesCount} table(s) trouvée(s)
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {result.ok && result.error?.includes('schema non créé') && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                      ⚠️ Base de données vide
                    </div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                      La connexion fonctionne mais les tables n'ont pas encore été créées.
                      Vous devez exécuter le fichier <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">supabase/schema.sql</code> dans votre dashboard Supabase.
                    </p>
                    <a
                      href={`https://supabase.com/dashboard/project/${supabaseConfig.projectId}/sql/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-yellow-900 dark:text-yellow-100 underline hover:no-underline"
                    >
                      Ouvrir SQL Editor →
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{stats.products}</div>
                  <div className="text-sm text-muted-foreground">Produits</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{stats.orders}</div>
                  <div className="text-sm text-muted-foreground">Commandes</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{stats.users}</div>
                  <div className="text-sm text-muted-foreground">Utilisateurs</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{stats.artisans}</div>
                  <div className="text-sm text-muted-foreground">Artisans</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aide */}
        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="font-medium min-w-[24px]">1.</div>
              <div>
                <div className="font-medium mb-1">Créer les tables</div>
                <div className="text-muted-foreground">
                  Exécutez le fichier <code className="bg-muted px-1 rounded">supabase/schema.sql</code> dans le SQL Editor de Supabase
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="font-medium min-w-[24px]">2.</div>
              <div>
                <div className="font-medium mb-1">Créer les buckets Storage</div>
                <div className="text-muted-foreground">
                  Créez 5 buckets: profiles, products, blog, media, documents
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="font-medium min-w-[24px]">3.</div>
              <div>
                <div className="font-medium mb-1">Configurer les services externes</div>
                <div className="text-muted-foreground">
                  Ajoutez vos clés FedaPay et Brevo dans le fichier <code className="bg-muted px-1 rounded">.env</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
