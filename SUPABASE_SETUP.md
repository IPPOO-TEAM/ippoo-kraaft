# Configuration Supabase - IPPOO KRAAFT

## ✅ Connexion établie

Votre projet Supabase a été connecté avec succès à l'application Figma Make.

### Informations de connexion

- **Projet ID**: `xovnqrlpgkcrakmgrrah`
- **URL**: `https://xovnqrlpgkcrakmgrrah.supabase.co`
- **Status**: ✅ Connecté

## 📂 Fichiers créés

1. **`src/lib/supabase.ts`** - Client Supabase principal
   - Exporte l'instance `supabase` configurée
   - Contient la configuration du projet

2. **`.env`** - Variables d'environnement
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **`src/app/pages/admin/supabase-dashboard.tsx`** - Dashboard admin
   - Interface de gestion et monitoring
   - Visualisation des tables
   - Test de connexion

## 🚀 Accès au dashboard

1. Lancez le serveur de développement: `pnpm dev`
2. Connectez-vous à l'admin: `http://localhost:5173/admin/login`
3. Accédez au dashboard Supabase: `http://localhost:5173/admin/supabase`

## 📊 Utilisation du client Supabase

### Import dans vos composants

```typescript
import { supabase } from '../lib/supabase';

// Exemple: récupérer des produits
const { data, error } = await supabase
  .from('products')
  .select('*');
```

### Opérations courantes

#### SELECT
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value');
```

#### INSERT
```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert({ column1: 'value1', column2: 'value2' })
  .select();
```

#### UPDATE
```typescript
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', itemId)
  .select();
```

#### DELETE
```typescript
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', itemId);
```

## 🗄️ Structure de base de données recommandée

Pour IPPOO KRAAFT, voici les tables suggérées:

### Tables principales

1. **products** - Produits de la boutique
   - id (uuid, primary key)
   - name (text)
   - description (text)
   - price (numeric)
   - stock (integer)
   - category (text)
   - artisan_id (uuid, foreign key)
   - images (jsonb)
   - created_at (timestamp)

2. **orders** - Commandes
   - id (uuid, primary key)
   - user_id (uuid)
   - total (numeric)
   - status (text)
   - payment_method (text)
   - items (jsonb)
   - created_at (timestamp)

3. **users** - Utilisateurs (complète auth.users)
   - id (uuid, primary key)
   - email (text)
   - full_name (text)
   - phone (text)
   - loyalty_tier (text)
   - loyalty_points (integer)
   - created_at (timestamp)

4. **artisans** - Artisans
   - id (uuid, primary key)
   - name (text)
   - bio (text)
   - specialty (text)
   - location (text)
   - created_at (timestamp)

5. **blog_posts** - Articles de blog
   - id (uuid, primary key)
   - title (text)
   - content (text)
   - author (text)
   - published_at (timestamp)

6. **events** - Événements
   - id (uuid, primary key)
   - title (text)
   - description (text)
   - date (timestamp)
   - location (text)

## 🔐 Sécurité

- ✅ Les clés sont stockées dans `.env` (non versionné)
- ✅ Utilisation de la clé `anon` publique (sécurisée par RLS)
- ⚠️ **Important**: Activez Row Level Security (RLS) dans Supabase
- ⚠️ Ne stockez pas de données PII sensibles sans chiffrement

## 📝 Prochaines étapes

1. Créez vos tables dans le SQL Editor de Supabase
2. Configurez les politiques RLS pour sécuriser l'accès
3. Migrez vos données existantes vers Supabase
4. Intégrez les appels Supabase dans vos composants

## 🔗 Liens utiles

- [Dashboard Supabase](https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah)
- [SQL Editor](https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah/editor)
- [Documentation Supabase](https://supabase.com/docs)
- [API Reference](https://supabase.com/docs/reference/javascript)
