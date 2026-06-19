# 🎨 IPPOO KRAAFT ART AND HANDMADE

> Plateforme e-commerce et culturelle dédiée à l'artisanat africain ancestral

[![Supabase](https://img.shields.io/badge/Supabase-Connected-green)](https://supabase.com)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com)

---

## 📋 Vue d'ensemble

**IPPOO KRAAFT** est une plateforme complète mobile-first pour la promotion et la vente d'artisanat africain authentique. Le projet intègre un système complet de e-commerce, marketing avancé, gestion multi-utilisateurs, et back-office admin.

### 🎯 Caractéristiques principales

- ✅ **56 produits** couvrant 11 domaines d'artisanat
- ✅ **6 artisans** avec profils complets et traçabilité
- ✅ **5 groupements** d'artisans certifiés
- ✅ **12 articles de blog** culturels et éducatifs
- ✅ **10 galeries photo** avec 95+ images
- ✅ **Système de fidélité** 4 paliers (Bronze/Argent/Or/Platine)
- ✅ **Programme de parrainage** avec récompenses
- ✅ **Marketing avancé**: promotions, flash sales, roue de la fortune, concours
- ✅ **Achats groupés** avec réductions dégressives jusqu'à -35%
- ✅ **Paiement multi-opérateurs** (MOOV, MTN, WAVE, ORANGE, CELTIS, CB)
- ✅ **Back-office complet** pour admin et artisans
- ✅ **Base de données Supabase** avec 37+ tables

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** 18+
- **pnpm** (package manager)
- **Compte Supabase** (déjà connecté)
- **Figma Make** ou environnement de développement compatible

### Installation

Le projet est prêt à l'emploi dans Figma Make. Le serveur de développement est déjà en cours d'exécution.

### Configuration Supabase

Votre projet Supabase est déjà configuré :

- **Projet ID**: `xovnqrlpgkcrakmgrrah`
- **URL**: `https://xovnqrlpgkcrakmgrrah.supabase.co`
- **Status**: ✅ Connecté

#### Créer les tables (première fois)

1. Ouvrez votre [Supabase Dashboard](https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah)
2. Allez dans **SQL Editor**
3. Copiez le contenu de [`/supabase/schema.sql`](./supabase/schema.sql)
4. Exécutez le script
5. Vérifiez que les tables sont créées ✅

---

## 📁 Structure du projet

```
ippoo-kraaft/
├── src/
│   ├── app/
│   │   ├── components/       # Composants React (100+)
│   │   │   ├── admin/       # 18 pages admin
│   │   │   ├── artisan/     # Espace artisan
│   │   │   └── ...
│   │   ├── data/            # Données mock
│   │   ├── hooks/           # 19 hooks personnalisés
│   │   ├── pages/           # Pages supplémentaires
│   │   ├── routes.tsx       # 50+ routes
│   │   └── App.tsx          # Composant racine
│   ├── lib/
│   │   └── supabase/
│   │       ├── services.ts  # Services backend (14 modules)
│   │       └── ...
│   └── styles/
│       ├── theme.css        # Thème Tailwind v4
│       └── fonts.css
├── supabase/
│   └── schema.sql           # Schéma SQL complet (37 tables)
├── scripts/
│   └── migrate-to-supabase.ts  # Script de migration
├── EVOLUTION.md             # Journal des évolutions 📊
├── GUIDE_UTILISATION.md     # Guide complet 📖
├── SUPABASE_SETUP.md        # Configuration Supabase 🗄️
└── README.md                # Ce fichier
```

---

## 🎨 Fonctionnalités

### 🛍️ E-commerce

- **Boutique complète** avec 56 produits authentiques
- **Fiches produit enrichies** : story, ancestralité, normes, traçabilité QR
- **Système de panier** multi-sessions (invité → connecté)
- **Favoris** synchronisés
- **Checkout complet** avec QR code de paiement
- **Multi-opérateurs** : MOOV, MTN, WAVE, ORANGE, CELTIS, CB
- **Gestion stock** avec traçabilité
- **Avis clients** avec modération
- **Achats groupés** : 6 offres avec paliers dégressifs

### 👨‍🎨 Artisans & Groupements

- **6 profils d'artisans** détaillés
- **5 groupements** certifiés
- **Espace artisan** complet :
  - Dashboard personnalisé
  - Gestion produits
  - Suivi commandes
  - Messagerie
  - Statistiques

### 🎯 Marketing

- **Promotions** : codes promo avec conditions
- **Flash Sales** : ventes flash limitées
- **Roue de la fortune** : cadeaux aléatoires
- **Concours** : photo, vote, créatif
- **Cartes cadeaux** : digitales et physiques
- **Tickets cadeaux** : réductions gagnées
- **Jour de marché** : événements spéciaux
- **Programme de fidélité** : 4 paliers avec avantages
- **Parrainage** : récompenses pour parrains et filleuls

### 📚 Contenu

- **Blog** : 12 articles culturels
- **Événements** : calendrier et inscriptions
- **Formations** : cursus d'artisanat
- **Galeries** : 10 collections avec 95+ photos
- **Normes & Authentification** : N001KHAM, N001PAAG

### 🔧 Administration

**Back-office complet** accessible sur `/admin` :

- 📊 **Dashboard** : statistiques temps réel
- 📦 **Produits** : CRUD complet
- 🏷️ **Catégories** : gestion hiérarchique
- 📊 **Stocks** : mouvements et alertes
- 🛒 **Commandes** : suivi et statuts
- ⭐ **Avis** : modération et réponses
- 👨‍🎨 **Artisans** : validation et profils
- 🏢 **Groupements** : gestion
- 📅 **Événements** : planning
- 📝 **Blog** : éditeur de contenu
- 🎁 **Marketing** : promotions, concours, roue
- 📧 **Messages** : contact et leads
- 🗄️ **Supabase** : dashboard et monitoring ⭐
- 🖼️ **Médias** : bibliothèque d'images
- ⚙️ **CMS** : gestion contenu accueil
- 📜 **Audit** : journal des actions

---

## 🗄️ Base de données Supabase

### Architecture

**37+ tables** organisées en 10 sections :

1. **Users & Auth** (4 tables)
   - users, loyalty_accounts, loyalty_transactions, referrals

2. **Catalog** (5 tables)
   - products, artisans, groupements, categories, stock_movements

3. **E-commerce** (2 tables)
   - orders, order_items

4. **Reviews** (1 table)
   - reviews

5. **Marketing** (11 tables)
   - promotions, flash_deals, gift_cards, gift_tickets
   - contests, wheel_prizes, wheel_spins, market_days...

6. **Content** (7 tables)
   - blog_posts, events, formations, galleries...

7. **Group Buying** (2 tables)
   - group_buying_offers, group_buying_participations

8. **Messages** (2 tables)
   - messages, artisan_leads

9. **Admin** (2 tables)
   - audit_log, site_config

10. **Media** (1 table)
    - media_library

### Services backend

14 modules de services dans `/src/lib/supabase/services.ts` :

```typescript
import { supabaseServices } from '@/lib/supabase/services';

// Exemples d'utilisation
const products = await supabaseServices.products.getAll();
const order = await supabaseServices.orders.create({...});
await supabaseServices.loyalty.addPoints(accountId, 500, 'Purchase');
```

---

## 🎨 Design & UX

### Palette de couleurs

- **Vert principal** : `#0D8A3E` (authenticité africaine)
- **Bleu accent** : `#0057FF` (modernité)
- **Fonds neutres** : blanc, gris clair

### Mobile-First

- Design responsive optimisé mobile
- Navigation intuitive
- Expérience fluide sur tous écrans

### Accessibilité

- Contraste AAA
- Navigation au clavier
- Screen readers compatibles

---

## 📖 Documentation

- **[GUIDE_UTILISATION.md](./GUIDE_UTILISATION.md)** - Guide complet d'utilisation 📖
- **[EVOLUTION.md](./EVOLUTION.md)** - Journal des évolutions du projet 📊
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Configuration Supabase détaillée 🗄️
- **[schema.sql](./supabase/schema.sql)** - Schéma SQL commenté 💾

---

## 🔧 Stack Technique

### Frontend

- **React** 19 - Framework UI
- **TypeScript** - Type safety
- **React Router** v7 - Routing
- **Tailwind CSS** v4 - Styling
- **Radix UI** - Composants accessibles
- **Lucide React** - Icônes
- **React Hook Form** - Formulaires
- **Sonner** - Notifications

### Backend

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Real-time subscriptions
  - REST & GraphQL APIs

### Build & Dev

- **Vite** - Build tool
- **pnpm** - Package manager
- **Figma Make** - Development environment

---

## 🚧 Roadmap

### ✅ Phase 1: Infrastructure (Terminé)
- [x] Connexion Supabase
- [x] Schéma SQL complet
- [x] Services backend
- [x] Dashboard admin Supabase
- [x] Documentation automatique

### 🔄 Phase 2: Migration (En cours)
- [ ] Migrer les données mock vers Supabase
- [ ] Connecter les hooks au backend
- [ ] Remplacer localStorage par Supabase
- [ ] Tests de synchronisation

### 📋 Phase 3: Optimisations (À venir)
- [ ] Cache côté client
- [ ] Real-time subscriptions
- [ ] Optimisation des requêtes
- [ ] Tests de performance

### 🚀 Phase 4: Déploiement (À venir)
- [ ] Configuration production
- [ ] Migration données production
- [ ] Tests end-to-end
- [ ] Mise en ligne

---

## 📊 Statistiques

### Code
- **131 fichiers TSX**
- **19 hooks personnalisés**
- **100+ composants**
- **50+ routes**
- **1200+ lignes de données mock**

### Base de données
- **37 tables**
- **14 services backend**
- **30+ indexes**
- **5 triggers**
- **3 functions**

### Contenu
- **56 produits**
- **11 catégories**
- **6 artisans**
- **5 groupements**
- **12 articles blog**
- **10 galeries**
- **95+ images**

---

## 🤝 Contribution

Ce projet est en développement actif. Pour contribuer :

1. Consultez `EVOLUTION.md` pour l'état actuel
2. Lisez `GUIDE_UTILISATION.md` pour comprendre le fonctionnement
3. Respectez la structure et les conventions existantes
4. Testez vos modifications
5. Documentez les changements importants

---

## 📞 Support

### Ressources

- **Documentation**: Consultez les fichiers `.md` à la racine
- **Supabase Dashboard**: [Votre projet](https://supabase.com/dashboard/project/xovnqrlpgkcrakmgrrah)
- **Supabase Docs**: https://supabase.com/docs

### Troubleshooting

Consultez la section **Troubleshooting** du [Guide d'utilisation](./GUIDE_UTILISATION.md#troubleshooting)

---

## 📜 Licence

© 2026 IPPOO KRAAFT ART AND HANDMADE - Tous droits réservés

---

## 🌟 Remerciements

- **Artisans africains** pour leur savoir-faire ancestral
- **Communauté open-source** pour les outils utilisés
- **Supabase** pour l'infrastructure backend

---

<div align="center">

**Fait avec ❤️ pour préserver et promouvoir l'artisanat africain**

[🌐 Site Web](#) | [📧 Contact](mailto:contact@ippookraaft.com) | [📱 Social](#)

</div>
