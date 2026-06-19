# Guide de Configuration des Variables d'Environnement

## Fichiers `.env` créés

✅ `.env` - Contient vos clés réelles (ne jamais committer)  
✅ `.env.example` - Template sans clés sensibles (peut être commité)

## Variables OBLIGATOIRES pour le déploiement

### 1. SUPABASE ✅ Configuré

Les clés Supabase sont déjà configurées dans votre `.env`:

```env
VITE_SUPABASE_URL=https://xovnqrlpgkcrakmgrrah.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 2. FEDAPAY (Paiements) ⚠️ À configurer

**Où obtenir les clés:**
1. Créer un compte sur https://fedapay.com
2. Aller dans **Dashboard > Developers > API Keys**
3. Copier vos clés `pk_sandbox_...` et `sk_sandbox_...`

**À remplir dans `.env`:**
```env
VITE_FEDAPAY_PUBLIC_KEY=pk_sandbox_VotreCléPublique
VITE_FEDAPAY_SECRET_KEY=sk_sandbox_VotreCléSecrète
VITE_FEDAPAY_MODE=sandbox
```

**Pour la production:**
```env
VITE_FEDAPAY_PUBLIC_KEY=pk_live_VotreCléPublique
VITE_FEDAPAY_SECRET_KEY=sk_live_VotreCléSecrète
VITE_FEDAPAY_MODE=live
```

**Méthodes de paiement supportées:**
- 💳 Carte bancaire
- 📱 MOOV Money
- 📱 MTN Mobile Money
- 📱 Orange Money
- 📱 Wave
- 📱 Celtis

### 3. BREVO (Emails) ⚠️ À configurer

**Où obtenir la clé:**
1. Créer un compte sur https://app.brevo.com
2. Aller dans **Settings > SMTP & API > API Keys**
3. Créer une nouvelle clé API

**À remplir dans `.env`:**
```env
VITE_BREVO_API_KEY=xkeysib-VotreCléAPI
VITE_BREVO_SENDER_EMAIL=noreply@ippookraaft.com
VITE_BREVO_SENDER_NAME=IPPOO KRAAFT
```

**⚠️ Important:** Vérifier votre domaine dans Brevo pour éviter que les emails tombent en spam.

**Emails configurés:**
- ✅ Confirmation de commande
- ✅ Notification d'expédition
- ✅ Email de bienvenue
- ✅ Réinitialisation de mot de passe

### 4. SMTP (pour Supabase Auth) 🔄 Optionnel

Vous pouvez utiliser le SMTP de Brevo pour les emails d'authentification.

**À remplir dans `.env`:**
```env
VITE_SMTP_HOST=smtp-relay.brevo.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=VotreEmailBrevo
VITE_SMTP_PASSWORD=VotreMotDePasseSMTP
```

**Alternative:** Configurer directement dans Supabase Dashboard > Project Settings > Auth > SMTP Settings

## Variables OPTIONNELLES

### OAuth (Connexion sociale)

**Google OAuth:**
1. Aller sur https://console.cloud.google.com/apis/credentials
2. Créer un nouveau projet
3. Créer des identifiants OAuth 2.0
4. Ajouter les URLs de redirection autorisées

```env
VITE_GOOGLE_CLIENT_ID=VotreClientID.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=VotreClientSecret
```

**Configuration Supabase:**
- Dashboard > Authentication > Providers > Google
- Activer et entrer les credentials

### Analytics

**Google Analytics:**
```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Facebook Pixel:**
```env
VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXX
```

**Hotjar:**
```env
VITE_HOTJAR_ID=XXXXXXX
```

## Configuration de l'Application

### URLs et Domaine

```env
VITE_APP_URL=https://ippookraaft.com
VITE_API_URL=https://api.ippookraaft.com
VITE_SUPPORT_EMAIL=support@ippookraaft.com
VITE_SUPPORT_PHONE=+228 XX XX XX XX
```

### Paramètres de Paiement

```env
VITE_MIN_ORDER_AMOUNT=1000          # Montant minimum en Fcfa
VITE_PLATFORM_FEE_PERCENT=10         # Commission plateforme (%)
VITE_DEFAULT_CURRENCY=XOF            # Franc CFA
```

### Localisation

```env
VITE_DEFAULT_LOCALE=fr-FR            # Français
VITE_DEFAULT_TIMEZONE=Africa/Lome    # Fuseau horaire Togo
VITE_DEFAULT_COUNTRY=TG              # Code pays
```

## Fonctionnalités (Feature Flags)

Activez/désactivez les modules selon vos besoins:

```env
VITE_ENABLE_OAUTH=false              # Connexion Google/Facebook
VITE_ENABLE_GROUP_BUYING=true        # Achats groupés
VITE_ENABLE_LOYALTY_PROGRAM=true     # Programme de fidélité
VITE_ENABLE_GIFT_CARDS=true          # Cartes cadeaux
VITE_ENABLE_BLOG=true                # Blog
VITE_ENABLE_EVENTS=true              # Événements
VITE_ENABLE_FORMATIONS=true          # Formations
VITE_ENABLE_MARKETPLACE=true         # Place de marché artisans
VITE_ENABLE_ANALYTICS=false          # Google Analytics
VITE_ENABLE_CHATBOT=false            # Chat support
```

## Sécurité

### Secrets à générer

**JWT Secret (si utilisé):**
```bash
openssl rand -hex 32
```

**Webhook Secret:**
```bash
openssl rand -hex 32
```

### ⚠️ Bonnes pratiques

1. ✅ Ne jamais committer le fichier `.env`
2. ✅ Utiliser `.env.example` pour documenter les variables nécessaires
3. ✅ Changer tous les secrets par défaut
4. ✅ Utiliser des clés différentes pour sandbox et production
5. ✅ Stocker les secrets de production dans votre hébergeur (Vercel, Netlify, etc.)

## Configuration par Environnement

### Développement (local)
```env
VITE_ENV=development
VITE_FEDAPAY_MODE=sandbox
```

### Production
```env
VITE_ENV=production
VITE_FEDAPAY_MODE=live
VITE_MAINTENANCE_MODE=false
```

## Vérification de la Configuration

### 1. Tester Supabase
```typescript
// Dans la console navigateur
import { supabase } from './src/lib/supabase';
const { data, error } = await supabase.from('products').select('*').limit(1);
console.log(data, error);
```

### 2. Tester FedaPay
Créer une commande test et vérifier que la redirection vers la page de paiement fonctionne.

### 3. Tester Brevo
Créer un compte test et vérifier la réception d'un email de bienvenue.

### 4. Dashboard Admin
Accéder à `/admin/supabase` pour voir les statistiques de connexion.

## Webhooks à Configurer

### FedaPay Webhook
**URL:** `https://votredomaine.com/api/webhooks/fedapay`

Configurer dans FedaPay Dashboard > Developers > Webhooks

**Events à écouter:**
- `transaction.approved`
- `transaction.declined`
- `transaction.canceled`

### Supabase Auth Webhook (optionnel)
Pour des actions personnalisées lors de l'inscription/connexion.

## Stockage Supabase

### Buckets à créer

Aller dans Supabase Dashboard > Storage > New bucket:

1. **profiles** - Public - Photos de profil
2. **products** - Public - Images produits
3. **blog** - Public - Images blog
4. **media** - Public - Bibliothèque média admin
5. **documents** - Private - Documents KYC, justificatifs

**Politiques RLS à appliquer:**
- Voir fichier `supabase/storage-policies.sql` (à créer)

## Support

Pour toute question sur la configuration:
- 📧 Email: support@ippookraaft.com
- 📖 Documentation: `/docs`
- 🔧 Dashboard Admin: `/admin`

## Checklist avant Déploiement

- [ ] Toutes les clés API obligatoires renseignées
- [ ] Mode FedaPay changé en `live`
- [ ] Email sender vérifié dans Brevo
- [ ] Buckets Supabase créés avec RLS
- [ ] Schema SQL exécuté dans Supabase
- [ ] Webhooks FedaPay configurés
- [ ] URLs de production correctes
- [ ] Tests de paiement en sandbox réussis
- [ ] Tests d'envoi d'emails réussis
- [ ] Variables d'environnement configurées sur l'hébergeur
- [ ] Mode maintenance désactivé
