#!/bin/bash
# Script de nettoyage pour production
# Retire les fichiers de test et routes de développement

echo "🧹 Nettoyage pour production IPPOO KRAAFT..."

# Créer dossier archive si nécessaire
mkdir -p .archive/test-pages

# Déplacer les pages de test vers archive
echo "📦 Archivage des pages de test..."
mv src/app/pages/test-*.tsx .archive/test-pages/ 2>/dev/null || true
mv src/app/pages/debug-*.tsx .archive/test-pages/ 2>/dev/null || true
mv src/app/pages/verif-*.tsx .archive/test-pages/ 2>/dev/null || true
mv src/app/pages/public-test-*.tsx .archive/test-pages/ 2>/dev/null || true
mv src/app/components/SupabaseTest.tsx .archive/test-pages/ 2>/dev/null || true

echo "✅ Pages de test archivées dans .archive/test-pages/"

# Créer backup des routes
cp src/app/routes.tsx src/app/routes.tsx.backup

# Commenter les routes de test
echo "🔧 Nettoyage des routes de test..."
sed -i.bak '/VerifSupabase/d; /TestBasique/d; /verif-supabase/d; /test-basique/d' src/app/routes.tsx

echo "✅ Routes de test retirées (backup: routes.tsx.backup)"

# Compter les fichiers archivés
TEST_COUNT=$(find .archive/test-pages -type f 2>/dev/null | wc -l)

echo ""
echo "✨ Nettoyage terminé !"
echo "   • $TEST_COUNT fichiers de test archivés"
echo "   • Routes de test retirées de routes.tsx"
echo "   • Backup créé: src/app/routes.tsx.backup"
echo ""
echo "📊 Vérification..."
echo "   Fichiers source restants: $(find src -name '*.tsx' -o -name '*.ts' | wc -l)"
echo "   Taille src/: $(du -sh src/ | cut -f1)"
echo ""
echo "🚀 Application prête pour: pnpm run build"
