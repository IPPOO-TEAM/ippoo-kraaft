// IPPOO KRAAFT - Script de migration des données vers Supabase
// Ce script migre toutes les données mock vers la base Supabase

import { supabase } from '../src/lib/supabase';
import { products, artisans, groupements } from '../src/app/data/mock-data';

export async function migrateData() {
  console.log('🚀 Début de la migration des données vers Supabase...\n');

  try {
    // 1. Migrer les groupements
    console.log('📦 Migration des groupements...');
    const { data: groupementsData, error: groupementsError } = await supabase
      .from('groupements')
      .upsert(
        groupements.map(g => ({
          id: g.id,
          name: g.name,
          slug: g.slug,
          specialties: g.specialties,
          region: g.region,
          country: g.country,
          description: g.description,
          artisan_count: g.artisanCount,
          product_count: g.productCount,
          conformity_score: g.conformity,
          image_url: g.image,
        })),
        { onConflict: 'id' }
      )
      .select();

    if (groupementsError) throw groupementsError;
    console.log(`✅ ${groupementsData?.length || 0} groupements migrés\n`);

    // 2. Migrer les artisans
    console.log('👨‍🎨 Migration des artisans...');
    const { data: artisansData, error: artisansError } = await supabase
      .from('artisans')
      .upsert(
        artisans.map(a => ({
          id: a.id,
          name: a.name,
          slug: a.slug,
          specialty: a.specialty,
          niches: a.niches,
          region: a.region,
          country: a.country,
          bio: a.bio,
          image_url: a.image,
          groupement_id: a.groupementId,
          products_count: a.productsCount,
          rating: a.rating,
        })),
        { onConflict: 'id' }
      )
      .select();

    if (artisansError) throw artisansError;
    console.log(`✅ ${artisansData?.length || 0} artisans migrés\n`);

    // 3. Migrer les produits
    console.log('🎨 Migration des produits...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .upsert(
        products.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          technique: p.technique,
          niches: p.niches,
          artisan_id: p.artisanId,
          groupement_id: p.groupementId,
          origin_country: p.origin.country,
          origin_region: p.origin.region,
          origin_village: p.origin.village,
          story: p.story,
          ancestrality: p.ancestrality,
          norms: p.norms,
          materials: p.materials,
          dimensions: p.dimensions,
          weight: p.weight,
          care_instructions: p.care,
          price: p.price,
          currency: p.currency,
          stock: p.stock,
          is_unique: p.isUnique,
          is_exclusive: p.isExclusive,
          images: p.images,
          rating: p.rating,
          review_count: p.reviewCount,
          badges: p.badges,
          delivery_zones: p.delivery.zones,
          delivery_delay: p.delivery.delay,
          delivery_cost: p.delivery.cost,
          is_active: true,
          is_featured: false,
        })),
        { onConflict: 'id' }
      )
      .select();

    if (productsError) throw productsError;
    console.log(`✅ ${productsData?.length || 0} produits migrés\n`);

    console.log('🎉 Migration terminée avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`   - Groupements: ${groupementsData?.length || 0}`);
    console.log(`   - Artisans: ${artisansData?.length || 0}`);
    console.log(`   - Produits: ${productsData?.length || 0}`);
    console.log('\n✨ Vous pouvez maintenant utiliser Supabase comme source de données !\n');

    return {
      groupements: groupementsData?.length || 0,
      artisans: artisansData?.length || 0,
      products: productsData?.length || 0,
    };
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

// Fonction pour vérifier la connexion avant migration
export async function checkConnection() {
  try {
    const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error && !error.message.includes('does not exist')) {
      throw error;
    }
    console.log('✅ Connexion Supabase OK\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Supabase:', error);
    return false;
  }
}

// Fonction pour nettoyer les données (ATTENTION: supprime tout!)
export async function cleanDatabase() {
  console.log('⚠️  Nettoyage de la base de données...\n');

  try {
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Produits supprimés');

    await supabase.from('artisans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Artisans supprimés');

    await supabase.from('groupements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Groupements supprimés\n');

    console.log('🧹 Base de données nettoyée\n');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

// Exécution si appelé directement
if (require.main === module) {
  (async () => {
    const connected = await checkConnection();
    if (!connected) {
      console.error('💥 Impossible de se connecter à Supabase. Vérifiez votre configuration.');
      process.exit(1);
    }

    // Décommenter la ligne suivante pour nettoyer avant migration (DANGER!)
    // await cleanDatabase();

    await migrateData();
  })();
}
