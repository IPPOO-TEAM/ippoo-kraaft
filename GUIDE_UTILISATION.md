# 📖 GUIDE D'UTILISATION - IPPOO KRAAFT

> Guide complet pour travailler avec le projet IPPOO KRAAFT
> Mis à jour: 2026-05-16

---

## 🎯 Table des matières

1. [Démarrage rapide](#démarrage-rapide)
2. [Accéder au projet](#accéder-au-projet)
3. [Navigation dans l'application](#navigation-dans-lapplication)
4. [Utiliser Supabase](#utiliser-supabase)
5. [Développement](#développement)
6. [Administration](#administration)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Démarrage rapide

### Prérequis
- Projet Supabase connecté ✅
- Environnement Figma Make ✅

### Premier lancement

Le serveur de développement est **déjà en cours d'exécution** dans Figma Make. Vous n'avez rien à faire !

---

## 🌐 Accéder au projet

### Dans Figma Make

L'application s'affiche directement dans le **panneau de prévisualisation** de Figma Make (côté droit de votre interface).

### Pages principales

**Frontend public:**
- 🏠 Accueil: `/`
- 🛍️ Boutique: `/boutique`
- 👨‍🎨 Artisans: `/groupements`
- 📚 Formations: `/formations`
- 📝 Blog: `/blog`
- 📅 Événements: `/evenements`
- 🎁 Promotions: `/promotions`
- 🎡 Roue de la fortune: `/roue`
- 🎪 Concours: `/concours`
- 💳 Cartes cadeaux: `/carte-cadeau`

**Admin:**
- 🔐 Connexion admin: `/admin/login`
- 📊 Dashboard: `/admin`
- 🗄️ **Supabase Dashboard: `/admin/supabase`** ⭐

---

## 🗄️ Utiliser Supabase

### 1. Vérifier la connexion

1. Allez sur `/admin/supabase`
2. Vérifiez que le statut est "✅ Connecté"
3. Consultez la liste des tables disponibles

### 2. Créer les tables

#### Méthode 1: Via le SQL Editor de Supabase (Recommandé)

1. Ouvrez votre **Supabase Dashboard**: https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah
2. Allez dans **SQL Editor** (menu de gauche)
3. Créez une nouvelle query
4. Copiez-collez le contenu de `/supabase/schema.sql`
5. Cliquez sur **Run** (ou Ctrl+Enter)
6. Attendez que toutes les tables soient créées ✅

#### Méthode 2: Via l'interface Supabase

1. Dashboard > **Table Editor**
2. Cliquez sur **New table**
3. Créez chaque table manuellement (long!)

### 3. Migrer les données mock

Une fois les tables créées, migrez les données existantes:

```bash
# Dans le terminal (si disponible)
npx ts-node scripts/migrate-to-supabase.ts
```

Ou utilisez le dashboard admin Supabase pour importer manuellement.

### 4. Utiliser les services dans votre code

```typescript
import { supabaseServices } from '@/lib/supabase/services';

// Exemple: Récupérer tous les produits
const products = await supabaseServices.products.getAll();

// Exemple: Créer une commande
const order = await supabaseServices.orders.create({
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  total: 50000,
  // ...
});

// Exemple: Ajouter des points de fidélité
await supabaseServices.loyalty.addPoints(
  accountId,
  500,
  'Achat de 50000 Fcfa'
);
```

---

## 💻 Développement

### Structure du projet

```
src/
├── app/
│   ├── components/         # Composants React
│   │   ├── admin/         # Pages admin
│   │   ├── artisan/       # Espace artisan
│   │   └── ...
│   ├── data/              # Données mock
│   │   └── mock-data.ts   # 56 produits, artisans, etc.
│   ├── hooks/             # Hooks personnalisés (19)
│   ├── pages/             # Pages supplémentaires
│   │   └── admin/
│   │       └── supabase-dashboard.tsx
│   ├── routes.tsx         # Configuration des routes
│   └── App.tsx            # Composant racine
├── lib/
│   └── supabase/
│       ├── services.ts    # Services backend ⭐
│       └── ...
└── styles/
    ├── theme.css          # Thème Tailwind v4
    └── fonts.css          # Imports de fonts
```

### Hooks disponibles

Tous les hooks sont dans `src/app/hooks/`:

- `use-store.tsx` - Panier et favoris (localStorage actuellement)
- `use-admin.tsx` - Authentification admin
- `use-admin-data.tsx` - Données admin (produits, commandes, etc.)
- `use-marketing.tsx` - Promotions, concours, roue, etc.
- `use-user.tsx` - Gestion utilisateur
- `use-payments.tsx` - Paiements
- `use-notifications.tsx` - Système de notifications
- `use-media.tsx` - Bibliothèque média
- `use-cms.tsx` - Contenu CMS
- ... et 10 autres !

### Créer un nouveau composant

```bash
# Créer dans src/app/components/
touch src/app/components/mon-composant.tsx
```

```tsx
// mon-composant.tsx
export function MonComposant() {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold">Mon Composant</h2>
    </div>
  );
}
```

### Ajouter une nouvelle route

Éditez `src/app/routes.tsx`:

```tsx
{
  path: "/ma-page",
  lazy: lazyNamed(() => import("./components/ma-page"), "MaPage")
}
```

---

## 🔧 Administration

### Accéder à l'admin

1. Allez sur `/admin/login`
2. Entrez vos identifiants admin
3. Vous êtes redirigé vers `/admin`

### Fonctionnalités admin

**Catalogue:**
- 📦 Produits - Gérer les 56 produits
- 🏷️ Catégories - 11 catégories
- 📊 Stocks - Mouvements de stock
- ⭐ Avis - Modération des avis

**Utilisateurs:**
- 👨‍🎨 Artisans - 6 artisans
- 🏢 Groupements - 5 groupements
- 📧 Messages - Contact et demandes
- 📋 Leads - Demandes d'adhésion artisan

**Contenu:**
- 📝 Blog - 12 articles
- 📅 Événements - Gestion des événements
- 🎓 Formations - Cursus de formation

**Marketing:**
- 🎁 Promotions - Codes promo
- ⚡ Flash Sales - Ventes flash
- 🎡 Roue - Configuration de la roue
- 🎪 Concours - Gestion des concours
- 💳 Cartes cadeaux - Émission et suivi

**Système:**
- 🗄️ **Supabase** - Dashboard et monitoring ⭐
- 📊 CMS - Gestion contenu accueil
- 🖼️ Médias - Bibliothèque d'images
- 📜 Journal - Audit log
- ⚙️ Paramètres - Configuration

---

## 🐛 Troubleshooting

### Problème: "Connexion Supabase échouée"

**Solutions:**
1. Vérifiez vos credentials dans `.env`
2. Testez la connexion sur `/admin/supabase`
3. Vérifiez que le projet Supabase est actif
4. Consultez les logs dans la console navigateur

### Problème: "Table does not exist"

**Solution:**
1. Les tables n'ont pas été créées
2. Exécutez le script SQL de `/supabase/schema.sql`
3. Voir section "Créer les tables" ci-dessus

### Problème: "Permission denied"

**Solution:**
1. Vérifiez les politiques RLS dans Supabase
2. Dashboard > **Authentication** > **Policies**
3. Assurez-vous que les politiques sont actives

### Problème: "Data not loading"

**Solutions:**
1. Vérifiez que les données ont été migrées
2. Consultez `/admin/supabase` pour voir les tables
3. Testez les services dans la console:
   ```js
   import { supabaseServices } from './lib/supabase/services';
   await supabaseServices.products.getAll();
   ```

### Problème: "Page blanche / Erreur 404"

**Solutions:**
1. Vérifiez la route dans `routes.tsx`
2. Vérifiez l'import du composant
3. Consultez la console pour les erreurs
4. Rafraîchissez la page (Ctrl+R)

---

## 📚 Ressources

### Documentation

- [EVOLUTION.md](./EVOLUTION.md) - Journal des évolutions
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuration Supabase
- [Schema SQL](./supabase/schema.sql) - Structure complète
- [Services](./src/lib/supabase/services.ts) - API backend

### Liens externes

- **Supabase Dashboard**: https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah
- **Supabase Docs**: https://supabase.com/docs
- **React Router**: https://reactrouter.com
- **Tailwind CSS v4**: https://tailwindcss.com

### Commandes utiles

```bash
# Installer les dépendances
pnpm install

# Installer un nouveau package
pnpm add nom-du-package

# Voir les logs
# (Consultez la console navigateur dans Figma Make)
```

---

## ✨ Conseils de développement

### Bonnes pratiques

1. **Toujours tester localement** avant de déployer
2. **Utiliser TypeScript** pour la sécurité des types
3. **Commenter le code complexe** pour faciliter la maintenance
4. **Suivre la convention de nommage** existante
5. **Tester sur mobile** (design mobile-first)

### Performance

- Utilisez les **indexes SQL** pour les requêtes fréquentes
- Limitez les résultats avec `.limit()`
- Implémentez la **pagination** pour les longues listes
- Utilisez le **cache** quand approprié

### Sécurité

- **Jamais de secrets dans le code** (utilisez `.env`)
- Activez **RLS** sur toutes les tables sensibles
- Validez **toutes les entrées utilisateur**
- Testez les **politiques d'accès**

---

## 🎓 Formation continue

Pour rester à jour avec le projet:

1. Consultez `EVOLUTION.md` régulièrement
2. Lisez les commentaires dans le code
3. Explorez le dashboard Supabase
4. Testez les nouvelles fonctionnalités

---

## 💡 Support

En cas de blocage:

1. Consultez ce guide
2. Vérifiez `EVOLUTION.md` pour les dernières modifications
3. Consultez le schema SQL pour comprendre la structure
4. Testez dans le dashboard admin Supabase

---

*Guide mis à jour automatiquement - Dernière version: 2026-05-16*
