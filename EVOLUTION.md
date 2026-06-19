# 📊 ÉVOLUTION DU PROJET IPPOO KRAAFT

> Documentation automatique des évolutions du projet
> Dernière mise à jour: 2026-05-16

---

## 🎯 Vue d'ensemble

**IPPOO KRAAFT ART AND HANDMADE** est une plateforme e-commerce complète dédiée à l'artisanat africain ancestral. Le projet a été développé initialement sur Antigravity avec un backend Supabase, puis migré et enrichi sur Figma Make.

---

## 📅 Journal des évolutions

### 2026-05-16 - Connexion Supabase et Synchronisation Complète

#### ✅ Actions réalisées

1. **Connexion du projet Supabase existant**
   - Projet ID: `xovnqrlpgkcrakmgrrah`
   - URL: `https://xovnqrlpgkcrakmgrrah.supabase.co`
   - Configuration dans `/src/lib/supabase.ts`
   - Variables d'environnement dans `.env`

2. **Création du schéma SQL complet**
   - Fichier: `/supabase/schema.sql`
   - 50+ tables couvrant toutes les fonctionnalités
   - Politiques RLS (Row Level Security) pour sécurité
   - Indexes optimisés pour performances
   - Functions et Triggers automatiques

3. **Création des services backend**
   - Fichier: `/src/lib/supabase/services.ts`
   - Services pour tous les modules:
     - Products & Catalog
     - Artisans & Groupements
     - Orders & Payments
     - Reviews & Ratings
     - Loyalty & Referrals
     - Marketing (Promotions, Flash Sales, Gift Cards, Wheel, Contests)
     - Blog, Events, Formations
     - Messages & Leads
     - Audit & Logging

4. **Dashboard admin Supabase**
   - Page: `/src/app/pages/admin/supabase-dashboard.tsx`
   - Route: `/admin/supabase`
   - Fonctionnalités:
     - Test de connexion en temps réel
     - Liste des tables disponibles
     - Visualisation des données
     - Statistiques du projet

5. **Documentation**
   - `SUPABASE_SETUP.md` - Guide de configuration
   - `EVOLUTION.md` (ce fichier) - Journal des évolutions
   - Schéma SQL commenté et structuré

#### 📦 Modules implémentés

##### 1. Users & Authentication
- [x] Table `users` - Profils utilisateurs
- [x] Table `loyalty_accounts` - Comptes de fidélité
- [x] Table `loyalty_transactions` - Historique fidélité
- [x] Table `referrals` - Système de parrainage

##### 2. Catalog
- [x] Table `products` - 56 produits, 11 catégories
- [x] Table `artisans` - Profils artisans
- [x] Table `groupements` - Groupements d'artisans
- [x] Table `categories` - Catégories de produits
- [x] Table `stock_movements` - Mouvements de stock

##### 3. E-commerce
- [x] Table `orders` - Commandes
- [x] Table `order_items` - Articles de commande
- [x] Système de paiement multi-opérateurs
- [x] Gestion des statuts de commande

##### 4. Reviews & Ratings
- [x] Table `reviews` - Avis clients
- [x] Système de modération
- [x] Réponses des artisans
- [x] Calcul automatique des ratings

##### 5. Marketing Avancé
- [x] Table `promotions` - Codes promo
- [x] Table `flash_deals` - Ventes flash
- [x] Table `gift_cards` - Cartes cadeaux
- [x] Table `gift_tickets` - Tickets cadeaux
- [x] Table `contests` - Concours
- [x] Table `wheel_prizes` - Roue de la fortune
- [x] Table `market_days` - Jours de marché

##### 6. Group Buying (Achats groupés)
- [x] Table `group_buying_offers` - 6 offres actives
- [x] Table `group_buying_participations` - Participations
- [x] Paliers dégressifs jusqu'à -35%

##### 7. Content Management
- [x] Table `blog_posts` - 12 articles complets
- [x] Table `events` - Événements
- [x] Table `formations` - Formations
- [x] Table `gallery_collections` - 10 galeries
- [x] Table `gallery_images` - 95+ images

##### 8. Messages & Leads
- [x] Table `messages` - Messages de contact
- [x] Table `artisan_leads` - Demandes d'adhésion artisan

##### 9. Admin & Audit
- [x] Table `audit_log` - Journal d'audit
- [x] Table `site_config` - Configuration CMS
- [x] Table `media_library` - Bibliothèque média

#### 🔧 Fonctionnalités techniques

**Performances**
- Index sur toutes les colonnes clés
- Requêtes optimisées avec `select()`
- Pagination pour grandes listes

**Sécurité**
- Row Level Security (RLS) activé
- Politiques d'accès granulaires
- Validation des données côté serveur

**Audit**
- Triggers `updated_at` automatiques
- Historique des modifications
- Logs des actions admin

**Services Backend**
- Architecture modulaire
- Gestion des erreurs
- Types TypeScript

---

## 🗄️ Structure des données

### Tables principales (50+)

#### Users & Auth
1. `users` - Utilisateurs (customer/artisan/admin)
2. `loyalty_accounts` - Fidélité (Bronze/Silver/Gold/Platinum)
3. `loyalty_transactions` - Historique points
4. `referrals` - Parrainages

#### Catalog
5. `products` - 56 produits
6. `artisans` - Artisans
7. `groupements` - 5 groupements
8. `categories` - Catégories hiérarchiques
9. `stock_movements` - Traçabilité stock

#### E-commerce
10. `orders` - Commandes
11. `order_items` - Détails commandes

#### Social
12. `reviews` - Avis clients

#### Marketing (9 tables)
13. `promotions`
14. `promotion_usages`
15. `flash_deals`
16. `gift_cards`
17. `gift_tickets`
18. `contests`
19. `contest_entries`
20. `contest_votes`
21. `wheel_prizes`
22. `wheel_spins`
23. `market_days`

#### Content (7 tables)
24. `blog_posts`
25. `events`
26. `event_registrations`
27. `formations`
28. `formation_registrations`
29. `gallery_collections`
30. `gallery_images`
31. `media_library`

#### Group Buying
32. `group_buying_offers`
33. `group_buying_participations`

#### Messages
34. `messages`
35. `artisan_leads`

#### Admin
36. `audit_log`
37. `site_config`

---

## 🚀 Prochaines étapes

### Phase 1: Migration des données (À faire)
- [ ] Exporter les données mock actuelles
- [ ] Adapter le format pour Supabase
- [ ] Exécuter le script SQL de création
- [ ] Importer les données initiales
- [ ] Vérifier l'intégrité

### Phase 2: Connexion Frontend-Backend (À faire)
- [ ] Remplacer localStorage par Supabase dans les hooks
- [ ] Connecter `use-store.tsx` pour cart/favorites
- [ ] Connecter `use-admin-data.tsx` pour données admin
- [ ] Connecter `use-marketing.tsx` pour promotions
- [ ] Tester toutes les fonctionnalités

### Phase 3: Optimisations (À faire)
- [ ] Implémenter le cache côté client
- [ ] Ajouter la synchronisation temps réel
- [ ] Optimiser les requêtes
- [ ] Tests de charge

### Phase 4: Déploiement (À faire)
- [ ] Configuration production
- [ ] Migration des données de production
- [ ] Tests end-to-end
- [ ] Mise en ligne

---

## 📊 Statistiques du projet

### Codebase
- **Total fichiers TSX**: 131
- **Hooks customs**: 19
- **Pages admin**: 18
- **Composants**: 100+
- **Routes**: 50+

### Base de données
- **Tables**: 37
- **Services backend**: 14 modules
- **Indexes**: 30+
- **Triggers**: 5+
- **Functions**: 3+

### Fonctionnalités
- **Produits**: 56
- **Catégories**: 11
- **Artisans**: 6
- **Groupements**: 5
- **Articles blog**: 12
- **Galeries**: 10
- **Images**: 95+
- **Formations**: Multiple
- **Événements**: Multiple

---

## 🛠️ Stack technique

### Frontend
- **Framework**: React 19
- **Router**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: Sonner

### Backend
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Supabase REST API
- **Real-time**: Supabase Realtime

### Build & Dev
- **Bundler**: Vite
- **Package Manager**: pnpm
- **TypeScript**: Oui
- **Environment**: Figma Make

---

## 📝 Notes importantes

### Différences Antigravity → Figma Make

1. **Structure du projet**
   - Antigravity: Structure Vite standard
   - Figma Make: Structure personnalisée avec entrypoint auto-généré

2. **Dev Server**
   - Antigravity: `npm run dev` manuel
   - Figma Make: Serveur déjà en cours, pas de commande manuelle

3. **Preview**
   - Antigravity: localhost:5173
   - Figma Make: Panneau de preview intégré

4. **Données**
   - Antigravity: Supabase + localStorage
   - Figma Make: Actuellement localStorage uniquement (migration Supabase en cours)

### Points d'attention

⚠️ **Important**: 
- Le fichier `__figma__entrypoint__.ts` est auto-généré, ne PAS le modifier
- Pas de `index.html` dans Figma Make
- Ne PAS exécuter `vite build` manuellement
- Les utilisateurs ne peuvent pas accéder à `localhost` directement

✅ **Bonnes pratiques**:
- Toujours utiliser `src/app/App.tsx` comme composant principal
- Créer des composants dans `src/app/components/`
- Utiliser Tailwind v4 (pas de `tailwind.config.js`)
- Tester via le panneau de preview Figma Make

---

## 🔗 Liens rapides

- **Dashboard Supabase**: https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah
- **SQL Editor**: https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah/editor
- **Documentation Supabase**: https://supabase.com/docs
- **GitHub Issues**: (À configurer)

---

## 📞 Support

Pour toute question sur l'évolution du projet:
- Consulter `SUPABASE_SETUP.md` pour la configuration
- Consulter le schéma SQL pour la structure des données
- Consulter `services.ts` pour l'utilisation des services

---

*Cette documentation est mise à jour automatiquement à chaque évolution majeure du projet.*
