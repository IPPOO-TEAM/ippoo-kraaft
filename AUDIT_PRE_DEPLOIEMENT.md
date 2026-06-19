# 🔍 AUDIT PRÉ-DÉPLOIEMENT - IPPOO KRAAFT

> Analyse complète de tous les éléments manquants avant mise en production
> Date: 2026-05-17
> Status: ⚠️ CRITIQUE - Nombreux gaps à combler

---

## 📋 RÉSUMÉ EXÉCUTIF

**Statut global: 🔴 NON PRÊT POUR PRODUCTION**

- ✅ **Infrastructure Supabase**: Configurée (37 tables définies)
- ⚠️ **Services Backend**: Créés mais NON connectés au frontend
- 🔴 **Paiements**: Simulateur MOCK uniquement, aucune vraie API
- 🔴 **Authentification**: localStorage, pas Supabase Auth
- 🔴 **Stockage**: Aucun système d'upload de fichiers
- 🔴 **Emails**: Aucun service configuré
- 🔴 **Variables d'environnement**: Fichier .env inexistant

**Estimation temps de correction: 40-60 heures de développement**

---

## 🚨 PROBLÈMES CRITIQUES (BLOQUANTS)

### 1. SYSTÈME DE PAIEMENT - 🔴 CRITIQUE

**Problème:** 
Le système utilise actuellement un `mockProcessor` qui simule les paiements. **Aucune vraie API de paiement n'est connectée.**

**Fichier:** `src/app/hooks/use-payments.tsx`

**Code actuel (lignes 93-108):**
```typescript
async function mockProcessor(order: Order, signal?: AbortSignal): 
  Promise<{ ok: true; transactionId: string } | { ok: false; reason: string }> {
  const delay = 1200 + Math.random() * 1800;
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, delay);
    signal?.addEventListener("abort", () => { 
      clearTimeout(t); reject(new DOMException("Aborted", "AbortError")); 
    });
  });
  // Card : 92% succès. Mobile money : 88% succès
  const successRate = order.method === "card" ? 0.92 : 0.88;
  if (Math.random() < successRate) {
    return { 
      ok: true, 
      transactionId: `TX-${Date.now().toString(36).toUpperCase()}...` 
    };
  }
  const reasons = order.method === "card"
    ? ["Carte refusée par la banque", "Solde insuffisant", "3D Secure échoué"]
    : ["Solde insuffisant", "Code USSD non confirmé", "Délai d'attente dépassé"];
  return { ok: false, reason: reasons[Math.floor(Math.random() * reasons.length)] };
}
```

**Opérateurs manquants:**
- ❌ **MOOV MONEY** - API non intégrée
- ❌ **MTN MONEY** - API non intégrée
- ❌ **ORANGE MONEY** - API non intégrée
- ❌ **WAVE** - API non intégrée
- ❌ **CELTIS CASH** - API non intégrée
- ❌ **CARTE BANCAIRE** (Visa/Mastercard) - API non intégrée

**Solutions possibles:**

#### Option 1: Agrégateur de paiement (Recommandé)
**CinetPay** (Leader en Afrique de l'Ouest)
- URL: https://cinetpay.com
- Couvre: MOOV, MTN, ORANGE, WAVE, Visa, Mastercard
- Coût: 2-3% par transaction
- Intégration: 2-3 jours

**Configuration requise:**
```env
VITE_CINETPAY_API_KEY=votre_api_key
VITE_CINETPAY_SITE_ID=votre_site_id
VITE_CINETPAY_SECRET_KEY=votre_secret_key (serveur uniquement)
VITE_CINETPAY_API_URL=https://api-checkout.cinetpay.com/v2/payment
```

**Code à implémenter:**
```typescript
async function cinetpayProcessor(order: Order): Promise<PaymentResult> {
  const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_CINETPAY_API_KEY
    },
    body: JSON.stringify({
      apikey: import.meta.env.VITE_CINETPAY_API_KEY,
      site_id: import.meta.env.VITE_CINETPAY_SITE_ID,
      transaction_id: order.ref,
      amount: order.amount,
      currency: 'XOF',
      channels: order.method, // MOBILE_MONEY, CREDIT_CARD
      description: `Commande ${order.ref}`,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone_number: order.payer?.phone,
      notify_url: `${window.location.origin}/api/payment/webhook`,
      return_url: `${window.location.origin}/commande/${order.ref}`,
      cancel_url: `${window.location.origin}/panier`
    })
  });
  
  const data = await response.json();
  
  if (data.code === '201') {
    // Redirection vers page de paiement
    window.location.href = data.data.payment_url;
    return { ok: true, transactionId: data.data.payment_token };
  }
  
  return { ok: false, reason: data.message };
}
```

#### Option 2: APIs individuelles par opérateur
- Plus complexe (6 intégrations distinctes)
- Coûts variables
- Maintenance plus lourde
- **Non recommandé** pour MVP

#### Option 3: PayDunya (Alternative)
- Similaire à CinetPay
- Également supporté en Afrique de l'Ouest

**Impact si non corrigé:**
- 🔴 **Aucun paiement réel ne fonctionnera**
- 🔴 **Aucune transaction ne sera traitée**
- 🔴 **App inutilisable pour l'e-commerce**

---

### 2. AUTHENTIFICATION - 🔴 CRITIQUE

**Problème:**
L'authentification utilise localStorage au lieu de Supabase Auth.

**Fichiers concernés:**
- `src/app/hooks/use-user.tsx` - 150 lignes de code d'auth localStorage
- `src/app/hooks/use-admin.tsx` - Credentials en dur dans le code

**Code actuel (use-admin.tsx lignes 10-14):**
```typescript
const DEMO_CREDS: DemoCred[] = [
  { user: "admin",      pass: "admin",      role: "admin" },
  { user: "moderateur", pass: "moderateur", role: "moderator" },
  { user: "groupement", pass: "groupement", role: "groupement" },
];
```

**Problèmes de sécurité:**
- ❌ Mots de passe en clair dans le code source
- ❌ Pas de vraie base de données utilisateurs
- ❌ Sessions stockées en localStorage (vulnérable XSS)
- ❌ Pas de tokens JWT
- ❌ Pas de refresh tokens
- ❌ Pas de multi-device sync

**Solution requise:**

Migrer vers **Supabase Auth**

```typescript
// use-user.tsx - Version Supabase Auth
import { supabase } from '@/lib/supabase';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Récupérer session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    // Écouter changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };
  
  const signup = async (email: string, password: string, metadata: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
  };
  
  // ... reste du code
}
```

**Configuration Supabase Auth requise:**
1. Activer Email Auth dans Supabase Dashboard
2. Configurer SMTP pour envoi emails
3. Personnaliser templates d'emails
4. Configurer redirections
5. Activer Row Level Security (RLS)

**Variables d'environnement:**
```env
# Déjà configuré
VITE_SUPABASE_URL=https://xovnqrlpgkcrakmgrrah.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# À ajouter si OAuth
VITE_GOOGLE_CLIENT_ID=...
VITE_FACEBOOK_APP_ID=...
```

**Impact si non corrigé:**
- 🔴 Données utilisateurs perdues au nettoyage du cache
- 🔴 Pas de synchronisation multi-devices
- 🔴 Failles de sécurité majeures
- 🔴 Impossible de gérer les utilisateurs côté serveur

---

### 3. STOCKAGE FICHIERS - 🔴 CRITIQUE

**Problème:**
Aucun système d'upload de fichiers n'est configuré.

**Fonctionnalités impactées:**
- ❌ Upload photos de profil utilisateur
- ❌ Upload pièces d'identité (KYC artisans)
- ❌ Upload photos de produits (artisans)
- ❌ Upload images de blog
- ❌ Upload images de galeries
- ❌ Upload documents (preuves d'activité)
- ❌ Bibliothèque média admin

**Fichier concerné:**
`src/app/components/admin/media-library.tsx` - UI existe mais pas de backend

**Solution: Supabase Storage**

**1. Créer les buckets Supabase:**
```sql
-- Dans Supabase Storage Dashboard
CREATE BUCKET profiles (public);
CREATE BUCKET products (public);
CREATE BUCKET documents (private);
CREATE BUCKET blog (public);
CREATE BUCKET media (public);
```

**2. Code upload:**
```typescript
// src/lib/supabase/storage.ts
import { supabase } from './supabase';

export const storage = {
  async uploadProfilePhoto(userId: string, file: File) {
    const ext = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },
  
  async uploadProductImage(productId: string, file: File) {
    const ext = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },
  
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
  }
};
```

**3. Intégration dans les composants:**
```typescript
// Exemple: Upload photo de profil
const handlePhotoUpload = async (file: File) => {
  setUploading(true);
  try {
    const url = await storage.uploadProfilePhoto(user.id, file);
    await supabaseServices.users.update(user.id, { avatar_url: url });
    toast.success('Photo mise à jour');
  } catch (error) {
    toast.error('Erreur lors de l\'upload');
  } finally {
    setUploading(false);
  }
};
```

**Limites Supabase Storage:**
- 1 GB gratuit
- 2 GB max par fichier
- Upgrade à 100GB: $25/mois

**Impact si non corrigé:**
- 🔴 Impossible d'uploader des images
- 🔴 Artisans ne peuvent pas ajouter leurs produits
- 🔴 Pas de photos de profil
- 🔴 KYC impossible

---

### 4. SERVICE EMAIL - 🔴 CRITIQUE

**Problème:**
Aucun service d'envoi d'emails configuré.

**Emails requis:**
- ❌ Vérification email à l'inscription
- ❌ Réinitialisation mot de passe
- ❌ Confirmation de commande
- ❌ Notification expédition
- ❌ Factures/reçus
- ❌ Newsletter
- ❌ Notifications marketing
- ❌ Alertes admin
- ❌ Messages de contact

**Code actuel:**
Les fonctions d'email existent dans le code mais ne font rien:
```typescript
// use-user.tsx ligne 72
requestEmailVerification: () => { 
  ok: boolean; code?: string; error?: string 
};
```

**Solutions:**

#### Option 1: Supabase Auth Email (Recommandé pour auth)
Configuration dans Supabase Dashboard > Authentication > Email Templates

**SMTP requis:**
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@ippookraaft.com
SMTP_PASSWORD=your_password
SMTP_FROM=IPPOO KRAAFT <noreply@ippookraaft.com>
```

**Providers SMTP recommandés:**
- **SendGrid**: 100 emails/jour gratuit, puis $15/mois
- **Mailgun**: 5000 emails/mois gratuit
- **AWS SES**: $0.10 pour 1000 emails
- **Brevo (ex-Sendinblue)**: 300 emails/jour gratuit

#### Option 2: Service email transactionnel
Pour emails de commande, factures, etc.

**Recommandation: Brevo (Sendinblue)**
```typescript
// src/lib/email.ts
import axios from 'axios';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

export const emailService = {
  async sendOrderConfirmation(order: Order) {
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: 'IPPOO KRAAFT', email: 'noreply@ippookraaft.com' },
      to: [{ email: order.customer.email, name: order.customer.name }],
      subject: `Commande ${order.ref} confirmée`,
      htmlContent: `
        <h1>Merci pour votre commande !</h1>
        <p>Référence: ${order.ref}</p>
        <p>Montant: ${order.amount} Fcfa</p>
        <p>Statut: ${order.status}</p>
      `
    }, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
  },
  
  async sendShippingNotification(order: Order, trackingNumber: string) {
    // ...
  },
  
  async sendPasswordReset(email: string, resetLink: string) {
    // ...
  }
};
```

**Variables d'environnement:**
```env
VITE_BREVO_API_KEY=your_brevo_api_key
VITE_BREVO_SENDER_EMAIL=noreply@ippookraaft.com
VITE_BREVO_SENDER_NAME=IPPOO KRAAFT
```

**Impact si non corrigé:**
- 🔴 Utilisateurs ne reçoivent pas de confirmation
- 🔴 Impossible de réinitialiser mot de passe
- 🔴 Pas de factures par email
- 🔴 Communication client impossible

---

### 5. VARIABLES D'ENVIRONNEMENT - 🔴 CRITIQUE

**Problème:**
Le fichier `.env` n'existe PAS. Toutes les configurations sont en dur dans le code.

**Créer `.env` à la racine:**
```env
# =============================================================================
# IPPOO KRAAFT - Variables d'environnement
# =============================================================================

# -----------------------------------------------------------------------------
# SUPABASE (Déjà configuré)
# -----------------------------------------------------------------------------
VITE_SUPABASE_URL=https://xovnqrlpgkcrakmgrrah.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvdm5xcmxwZ2tjcmFrbWdycmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODY3MjksImV4cCI6MjA5NDI2MjcyOX0.cA6GKru3pf0h3Yid9RprTb1QqQPoXt9f9c8nguh6LTo

# NE PAS EXPOSER AU FRONTEND (serveur uniquement)
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici

# -----------------------------------------------------------------------------
# PAIEMENT - CinetPay
# -----------------------------------------------------------------------------
VITE_CINETPAY_API_KEY=
VITE_CINETPAY_SITE_ID=
VITE_CINETPAY_SECRET_KEY=  # Serveur uniquement
VITE_CINETPAY_API_URL=https://api-checkout.cinetpay.com/v2/payment
VITE_CINETPAY_WEBHOOK_URL=https://votre-domaine.com/api/payment/webhook

# -----------------------------------------------------------------------------
# EMAIL - Brevo (Sendinblue)
# -----------------------------------------------------------------------------
VITE_BREVO_API_KEY=
VITE_BREVO_SENDER_EMAIL=noreply@ippookraaft.com
VITE_BREVO_SENDER_NAME=IPPOO KRAAFT

# -----------------------------------------------------------------------------
# SMTP (Pour Supabase Auth)
# -----------------------------------------------------------------------------
SMTP_HOST=smtp.brevo.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=IPPOO KRAAFT <noreply@ippookraaft.com>

# -----------------------------------------------------------------------------
# OAUTH (Optionnel)
# -----------------------------------------------------------------------------
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_SECRET=  # Serveur uniquement
VITE_FACEBOOK_APP_ID=
VITE_FACEBOOK_APP_SECRET=  # Serveur uniquement

# -----------------------------------------------------------------------------
# ANALYTICS (Optionnel)
# -----------------------------------------------------------------------------
VITE_GA_TRACKING_ID=
VITE_HOTJAR_ID=

# -----------------------------------------------------------------------------
# AUTRES
# -----------------------------------------------------------------------------
VITE_APP_URL=https://ippookraaft.com
VITE_APP_NAME=IPPOO KRAAFT
VITE_SUPPORT_EMAIL=support@ippookraaft.com
VITE_SUPPORT_PHONE=+228XXXXXXXX

# Mode environnement
NODE_ENV=development  # development | production | test
```

**Créer `.env.example` (versionné):**
```env
# Copier ce fichier en .env et remplir les valeurs

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

VITE_CINETPAY_API_KEY=
VITE_CINETPAY_SITE_ID=

VITE_BREVO_API_KEY=
# ... etc
```

**Ajouter à `.gitignore`:**
```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development
.env.test

# Keep example
!.env.example
```

**Impact si non corrigé:**
- 🔴 Secrets exposés dans le code source
- 🔴 Impossible de changer de configuration par environnement
- 🔴 Risque de sécurité majeur

---

## ⚠️ PROBLÈMES MAJEURS (IMPORTANTS)

### 6. DONNÉES EN LOCALSTORAGE - ⚠️ MAJEUR

**Problème:**
88 occurrences de localStorage/sessionStorage dans 22 fichiers de hooks.

**Hooks à migrer:**

| Hook | localStorage | À migrer vers |
|------|--------------|---------------|
| `use-store.tsx` | Panier, favoris | Supabase `cart`, `favorites` tables |
| `use-admin-data.tsx` | Produits, commandes, avis | Services Supabase |
| `use-marketing.tsx` | Promotions, concours, roue | Services Supabase |
| `use-payments.tsx` | Commandes | Table `orders` Supabase |
| `use-user.tsx` | Utilisateurs | Supabase Auth + table `users` |
| `use-admin.tsx` | Sessions admin | Supabase Auth |
| `use-media.tsx` | Bibliothèque média | Table `media_library` |
| `use-cms.tsx` | Configuration CMS | Table `site_config` |
| `use-categories.tsx` | Catégories | Table `categories` |
| `use-stock-movements.tsx` | Mouvements stock | Table `stock_movements` |
| `use-leads.tsx` | Demandes artisan | Table `artisan_leads` |
| `use-notifications.tsx` | Notifications | Table dédiée à créer |
| `use-loyalty-tiers.ts` | Paliers fidélité | Config en base |
| `use-admin-audit.tsx` | Journal audit | Table `audit_log` |

**Impact:**
- ⚠️ Données perdues si utilisateur vide cache
- ⚠️ Pas de synchronisation multi-devices
- ⚠️ Limite de stockage ~5-10MB
- ⚠️ Performances dégradées avec beaucoup de données

**Estimation:** 20-30 heures de migration

---

### 7. WEBHOOKS PAIEMENT - ⚠️ MAJEUR

**Problème:**
Aucun endpoint webhook pour recevoir confirmations de paiement.

**Requis pour:**
- Confirmer paiements asynchrones (mobile money)
- Mettre à jour statuts de commandes
- Déclencher notifications
- Générer factures

**Code à créer:**
```typescript
// src/api/webhooks/payment.ts
import { supabase } from '@/lib/supabase';
import { emailService } from '@/lib/email';

export async function handlePaymentWebhook(req: Request) {
  const body = await req.json();
  
  // Vérifier signature webhook (sécurité)
  const signature = req.headers.get('x-webhook-signature');
  if (!verifySignature(body, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  // Traiter selon le type d'événement
  switch (body.event) {
    case 'payment.success':
      await handlePaymentSuccess(body.data);
      break;
    case 'payment.failed':
      await handlePaymentFailed(body.data);
      break;
    case 'refund.processed':
      await handleRefund(body.data);
      break;
  }
  
  return new Response('OK', { status: 200 });
}

async function handlePaymentSuccess(data: any) {
  const orderRef = data.transaction_id;
  
  // Mettre à jour la commande
  await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_status: 'completed',
      transaction_id: data.payment_token,
      paid_at: new Date().toISOString()
    })
    .eq('order_number', orderRef);
  
  // Envoyer email de confirmation
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderRef)
    .single();
  
  if (order) {
    await emailService.sendOrderConfirmation(order);
  }
  
  // Réduire le stock
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);
  
  for (const item of items) {
    await supabase.rpc('decrement_stock', {
      product_id: item.product_id,
      quantity: item.quantity
    });
  }
}
```

**URL webhook à configurer:**
```
https://votre-domaine.com/api/webhooks/payment
```

---

### 8. GESTION DES IMAGES - ⚠️ MAJEUR

**Problème:**
Toutes les images produits sont des URLs Unsplash. Pas de gestion d'images propres.

**Fichier:** `src/app/data/mock-data.ts` - 51 URLs Unsplash

**Exemple:**
```typescript
export const IMAGES = {
  heroArtisan: "https://images.unsplash.com/photo-1606077089838-0ac4a27fc96f...",
  textileWeaving: "https://images.unsplash.com/photo-1688240817677-d28b8e232dd4...",
  // ... 49 autres
};
```

**Problèmes:**
- ⚠️ URLs externes peuvent devenir invalides
- ⚠️ Pas de contrôle sur les images
- ⚠️ Dépendance service tiers
- ⚠️ Performances (pas de CDN propre)

**Solution:**
1. Télécharger toutes les images Unsplash
2. Uploader dans Supabase Storage
3. Remplacer URLs dans le code
4. Configurer CDN Supabase

---

### 9. SEO & META TAGS - ⚠️ MAJEUR

**Problème:**
Pas de gestion dynamique des meta tags pour SEO.

**Impact:**
- ⚠️ Mauvais référencement Google
- ⚠️ Partages sociaux sans preview
- ⚠️ Pas de Open Graph tags

**Solution requise:**

```typescript
// src/app/hooks/use-seo.tsx (existe mais incomplet)
export function useSeo(meta: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}) {
  useEffect(() => {
    // Title
    document.title = `${meta.title} | IPPOO KRAAFT`;
    
    // Meta description
    setMeta('description', meta.description);
    
    // Open Graph
    setMeta('og:title', meta.title);
    setMeta('og:description', meta.description);
    setMeta('og:image', meta.image || '/og-image.jpg');
    setMeta('og:url', meta.url || window.location.href);
    setMeta('og:type', meta.type || 'website');
    
    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', meta.image || '/og-image.jpg');
  }, [meta]);
}

function setMeta(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
```

**À ajouter sur chaque page:**
```typescript
// Exemple: page produit
useSeo({
  title: product.name,
  description: product.story.substring(0, 160),
  image: product.images[0],
  url: `https://ippookraaft.com/boutique/${product.slug}`,
  type: 'product'
});
```

---

## 🟡 PROBLÈMES MINEURS (AMÉLIORATIONS)

### 10. ANALYTICS - 🟡 MINEUR

**Manquant:**
- Google Analytics
- Hotjar
- Facebook Pixel

**Configuration rapide:**
```typescript
// src/lib/analytics.ts
export const analytics = {
  pageView(path: string) {
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
        page_path: path
      });
    }
  },
  
  event(name: string, params?: any) {
    if (window.gtag) {
      window.gtag('event', name, params);
    }
  },
  
  purchase(order: Order) {
    this.event('purchase', {
      transaction_id: order.ref,
      value: order.amount,
      currency: 'XOF',
      items: order.items
    });
  }
};
```

---

### 11. RATE LIMITING - 🟡 MINEUR

**Problème:**
Pas de protection contre spam/abuse.

**À implémenter:**
- Limite de créations de compte
- Limite de tentatives de login
- Limite d'envois de formulaire
- Limite de requêtes API

**Solution: Supabase Edge Functions + Upstash Redis**

---

### 12. TESTS - 🟡 MINEUR

**Problème:**
Aucun test unitaire ou d'intégration.

**À créer:**
- Tests unitaires (Vitest)
- Tests E2E (Playwright)
- Tests de composants (React Testing Library)

---

### 13. MONITORING - 🟡 MINEUR

**Manquant:**
- Sentry pour erreurs
- LogRocket pour sessions
- Uptime monitoring

---

### 14. BACKUP & RECOVERY - 🟡 MINEUR

**À configurer:**
- Backups automatiques Supabase (déjà inclus)
- Plan de disaster recovery
- Scripts de restauration

---

## 📊 CHECKLIST PRÉ-DÉPLOIEMENT

### Phase 1: CRITIQUES (Semaine 1)
- [ ] Intégrer API de paiement (CinetPay) - 3 jours
- [ ] Migrer auth vers Supabase Auth - 2 jours
- [ ] Configurer Supabase Storage - 1 jour
- [ ] Configurer service email (Brevo) - 1 jour
- [ ] Créer fichier .env complet - 1h
- [ ] Créer webhooks paiement - 1 jour

**Total Phase 1: 7-8 jours**

### Phase 2: MAJEURS (Semaine 2-3)
- [ ] Migrer tous les hooks vers Supabase - 5 jours
- [ ] Télécharger et héberger images - 1 jour
- [ ] Implémenter SEO dynamique - 1 jour
- [ ] Tests paiements réels - 2 jours

**Total Phase 2: 9 jours**

### Phase 3: MINEURS (Semaine 4)
- [ ] Ajouter Analytics - 0.5 jour
- [ ] Rate limiting - 1 jour
- [ ] Tests basiques - 2 jours
- [ ] Monitoring - 0.5 jour

**Total Phase 3: 4 jours**

### Phase 4: VALIDATION (Semaine 5)
- [ ] Tests end-to-end complets
- [ ] Tests de charge
- [ ] Audit sécurité
- [ ] Optimisation performances
- [ ] Documentation finale

**TOTAL ESTIMATION: 25-30 jours de développement**

---

## 💰 COÛTS ESTIMÉS

### Services mensuels (après lancement)

| Service | Plan | Coût/mois |
|---------|------|-----------|
| **Supabase** | Pro | $25 |
| **CinetPay** | Commission | 2-3% par transaction |
| **Brevo Email** | Lite | $15 (jusqu'à 10k emails) |
| **Domaine** | .com | $12/an |
| **SSL** | Let's Encrypt | Gratuit |
| **CDN** | Cloudflare | Gratuit |
| **Total** | | ~$40-50/mois + commissions |

### Services optionnels

| Service | Coût |
|---------|------|
| Google Analytics | Gratuit |
| Sentry (monitoring) | $26/mois |
| LogRocket | $99/mois |
| Uptime Robot | Gratuit (50 monitors) |

---

## 🎯 RECOMMANDATIONS

### Priorité 1 (URGENT - Avant tout déploiement)
1. ✅ Intégrer CinetPay pour paiements réels
2. ✅ Migrer vers Supabase Auth
3. ✅ Configurer Supabase Storage
4. ✅ Configurer emails transactionnels
5. ✅ Créer fichier .env

### Priorité 2 (Important - Première semaine post-lancement)
6. ✅ Migrer hooks vers Supabase
7. ✅ Webhooks paiement
8. ✅ Héberger images proprement

### Priorité 3 (Améliorations - Premier mois)
9. ✅ Analytics
10. ✅ SEO dynamique
11. ✅ Tests automatisés

---

## 📞 CONTACTS UTILES

**CinetPay:**
- Site: https://cinetpay.com
- Support: support@cinetpay.com
- Documentation: https://docs.cinetpay.com

**Brevo (Email):**
- Site: https://www.brevo.com
- Support: https://www.brevo.com/support
- Documentation: https://developers.brevo.com

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Documentation: https://supabase.com/docs
- Support: https://supabase.com/support

---

## ✅ VALIDATION FINALE

Avant de marquer le projet "prêt pour production", vérifier:

- [ ] ✅ Au moins un paiement réel a été testé avec succès
- [ ] ✅ Inscription/connexion utilisateur fonctionne
- [ ] ✅ Upload de fichier fonctionne
- [ ] ✅ Email de confirmation reçu
- [ ] ✅ Webhook paiement répond correctement
- [ ] ✅ Toutes les routes fonctionnent
- [ ] ✅ App fonctionne sur mobile
- [ ] ✅ Images se chargent correctement
- [ ] ✅ Pas d'erreurs console
- [ ] ✅ SEO vérifié (meta tags présents)
- [ ] ✅ SSL configuré (HTTPS)
- [ ] ✅ Variables d'environnement en production
- [ ] ✅ Backups configurés
- [ ] ✅ Monitoring actif

---

**🚀 Une fois tous ces points corrigés, le projet sera prêt pour la production !**

*Audit créé automatiquement - 2026-05-17*
