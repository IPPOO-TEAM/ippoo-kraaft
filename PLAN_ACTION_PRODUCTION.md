# 🚀 PLAN D'ACTION POUR LA PRODUCTION

> Roadmap détaillée pour rendre IPPOO KRAAFT production-ready
> Basé sur l'audit du 2026-05-17

---

## 📊 VUE D'ENSEMBLE

**Statut actuel:** 🔴 NON PRÊT (40% complet)
**Objectif:** ✅ PRODUCTION READY (100%)
**Temps estimé:** 25-30 jours de développement
**Effort:** 1 développeur full-time OU 2-3 développeurs en parallèle

---

## 🗓️ PLANNING PAR SEMAINE

### 📅 SEMAINE 1 - Fondations Critiques

**Objectif:** Rendre les fonctionnalités core opérationnelles

#### Jour 1-2: Paiements 💳
**Tâche:** Intégrer CinetPay pour MOOV, MTN, ORANGE, WAVE, CELTIS, CB

**Actions:**
1. ✅ Créer compte CinetPay
2. ✅ Obtenir API Key et Site ID
3. ✅ Créer service `/src/lib/payment/cinetpay.ts`
4. ✅ Remplacer `mockProcessor` par `cinetpayProcessor`
5. ✅ Tester en mode sandbox
6. ✅ Configurer variables d'environnement

**Fichiers à modifier:**
- `src/app/hooks/use-payments.tsx` (remplacer mockProcessor)
- `.env` (ajouter CINETPAY_*)
- Nouveau: `src/lib/payment/cinetpay.ts`

**Code clé:**
```typescript
// src/lib/payment/cinetpay.ts
export async function initCinetpayPayment(order: Order) {
  const response = await fetch(import.meta.env.VITE_CINETPAY_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apikey: import.meta.env.VITE_CINETPAY_API_KEY,
      site_id: import.meta.env.VITE_CINETPAY_SITE_ID,
      transaction_id: order.ref,
      amount: order.amount,
      currency: 'XOF',
      channels: getChannel(order.method),
      description: `Commande ${order.ref}`,
      notify_url: `${import.meta.env.VITE_APP_URL}/api/webhooks/payment`,
      return_url: `${import.meta.env.VITE_APP_URL}/commande/${order.ref}`,
      cancel_url: `${import.meta.env.VITE_APP_URL}/panier`,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone_number: order.payer?.phone
    })
  });
  
  const data = await response.json();
  
  if (data.code === '201') {
    return { 
      ok: true, 
      paymentUrl: data.data.payment_url,
      transactionId: data.data.payment_token 
    };
  }
  
  return { ok: false, reason: data.message };
}

function getChannel(method: PayMethod): string {
  switch(method) {
    case 'moov': return 'FLOOZ_TOGO';
    case 'mtn': return 'MTN_TOGO';
    case 'card': return 'CREDIT_CARD';
    // ... autres
  }
}
```

**Validation:**
- [ ] Paiement test MOOV réussi
- [ ] Paiement test MTN réussi
- [ ] Paiement test carte réussi
- [ ] Statut commande mis à jour
- [ ] Webhook reçu et traité

---

#### Jour 3-4: Authentification 🔐
**Tâche:** Migrer vers Supabase Auth

**Actions:**
1. ✅ Activer Email Auth dans Supabase Dashboard
2. ✅ Configurer SMTP (Brevo)
3. ✅ Personnaliser templates emails
4. ✅ Réécrire `use-user.tsx` avec Supabase Auth
5. ✅ Réécrire `use-admin.tsx` avec Supabase Auth
6. ✅ Migrer utilisateurs existants (si nécessaire)
7. ✅ Tester inscription/connexion/déconnexion

**Fichiers à modifier:**
- `src/app/hooks/use-user.tsx` (réécriture complète)
- `src/app/hooks/use-admin.tsx` (réécriture complète)
- `.env` (ajouter SMTP_*)

**Code clé:**
```typescript
// use-user.tsx - Version Supabase
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) return { ok: false, error: error.message };
  
  // Charger profil utilisateur
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  setUser({ ...data.user, ...profile });
  return { ok: true };
};

const signup = async (payload: SignupPayload) => {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        phone: payload.phone,
        // ... autres métadonnées
      },
      emailRedirectTo: `${window.location.origin}/verifier-email`
    }
  });
  
  if (error) return { ok: false, error: error.message };
  
  // Créer profil dans table users
  await supabase.from('users').insert({
    id: data.user.id,
    email: payload.email,
    full_name: payload.fullName,
    // ... autres champs
  });
  
  return { ok: true };
};
```

**Validation:**
- [ ] Inscription fonctionnelle
- [ ] Email de vérification reçu
- [ ] Connexion fonctionnelle
- [ ] Déconnexion fonctionnelle
- [ ] Réinitialisation mot de passe OK
- [ ] Sessions persistantes

---

#### Jour 5: Stockage Fichiers 📁
**Tâche:** Configurer Supabase Storage

**Actions:**
1. ✅ Créer buckets dans Supabase
2. ✅ Créer service `src/lib/supabase/storage.ts`
3. ✅ Intégrer dans formulaires d'upload
4. ✅ Tester upload photo profil
5. ✅ Tester upload image produit

**Buckets à créer:**
```sql
-- Dans Supabase Storage Dashboard
CREATE BUCKET profiles (public);
CREATE BUCKET products (public);
CREATE BUCKET blog (public);
CREATE BUCKET media (public);
CREATE BUCKET documents (private);
```

**Politiques RLS:**
```sql
-- Profiles: tout le monde peut lire, seul le propriétaire peut uploader
CREATE POLICY "Public Access" ON storage.objects FOR SELECT 
USING (bucket_id = 'profiles');

CREATE POLICY "User Upload Own Photo" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Products: public read, artisans/admin write
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Artisan Upload Products" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'products');
```

**Validation:**
- [ ] Upload photo profil fonctionne
- [ ] Upload image produit fonctionne
- [ ] Images s'affichent correctement
- [ ] Suppression fonctionne
- [ ] URLs publiques correctes

---

#### Jour 6: Service Email 📧
**Tâche:** Configurer Brevo pour emails transactionnels

**Actions:**
1. ✅ Créer compte Brevo
2. ✅ Obtenir API Key
3. ✅ Vérifier domaine
4. ✅ Créer service `/src/lib/email/brevo.ts`
5. ✅ Créer templates emails
6. ✅ Tester envoi email

**Templates à créer:**
- Confirmation de commande
- Notification d'expédition
- Facture
- Bienvenue nouvel utilisateur
- Réinitialisation mot de passe (si pas Supabase Auth)

**Code clé:**
```typescript
// src/lib/email/brevo.ts
export const emailService = {
  async sendOrderConfirmation(order: Order) {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': import.meta.env.VITE_BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'IPPOO KRAAFT',
          email: 'noreply@ippookraaft.com'
        },
        to: [{ 
          email: order.customer.email, 
          name: order.customer.name 
        }],
        subject: `Commande ${order.ref} confirmée`,
        htmlContent: generateOrderEmailHTML(order)
      })
    });
  }
};
```

**Validation:**
- [ ] Email de commande reçu
- [ ] Design email correct
- [ ] Liens fonctionnels
- [ ] Templates responsive

---

#### Jour 7: Variables d'environnement & Webhooks ⚙️
**Tâche:** Finaliser configuration et webhooks

**Actions:**
1. ✅ Créer `.env` complet
2. ✅ Créer `.env.example`
3. ✅ Créer webhooks paiement
4. ✅ Tester webhook en local (ngrok)
5. ✅ Documenter toutes les variables

**Validation:**
- [ ] `.env` complet et fonctionnel
- [ ] Webhook paiement reçu
- [ ] Statut commande mis à jour automatiquement
- [ ] Email envoyé après paiement réussi

**✅ FIN SEMAINE 1 - Checkpoint:**
- Paiements réels fonctionnels
- Auth Supabase opérationnelle
- Upload de fichiers OK
- Emails envoyés
- Configuration complète

---

### 📅 SEMAINE 2-3 - Migration des Données

**Objectif:** Remplacer localStorage par Supabase dans tous les hooks

#### Priorité 1: Hooks critiques (Jours 8-10)

**1. use-store.tsx** - Panier & Favoris
```typescript
// Migration vers Supabase
const addToCart = async (productId: string, quantity: number) => {
  if (!user) {
    // Guest: localStorage temporaire
    setLocalCart([...cart, { productId, quantity }]);
    return;
  }
  
  // User connecté: Supabase
  await supabase.from('cart_items').upsert({
    user_id: user.id,
    product_id: productId,
    quantity
  });
  
  // Recharger panier
  loadCart();
};
```

**2. use-payments.tsx** - Commandes
```typescript
// Utiliser services Supabase
const createOrder = async (input) => {
  const order = await supabaseServices.orders.create({
    user_id: user?.id,
    customer_name: input.customer.name,
    customer_email: input.customer.email,
    total: input.amount,
    // ...
  });
  
  await supabaseServices.orders.addItems(order.id, input.items);
  
  return order;
};
```

**3. use-admin-data.tsx** - Données admin
```typescript
// Remplacer par services Supabase
const loadProducts = async () => {
  const products = await supabaseServices.products.getAll();
  setProducts(products);
};
```

**Validation Jour 10:**
- [ ] Panier synchronisé avec Supabase
- [ ] Commandes en base
- [ ] Admin lit depuis Supabase

---

#### Priorité 2: Hooks secondaires (Jours 11-14)

**Hooks à migrer:**
- use-marketing.tsx
- use-media.tsx
- use-cms.tsx
- use-categories.tsx
- use-stock-movements.tsx
- use-leads.tsx
- use-admin-audit.tsx
- use-notifications.tsx

**Pattern de migration:**
```typescript
// AVANT
const [data, setData] = useState(() => 
  safeRead('ipk:key:v1', []));

useEffect(() => {
  safeWrite('ipk:key:v1', data);
}, [data]);

// APRÈS
const [data, setData] = useState([]);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  const result = await supabaseServices.MODULE.getAll();
  setData(result);
};

const saveData = async (item) => {
  await supabaseServices.MODULE.create(item);
  loadData();
};
```

**Validation Jour 14:**
- [ ] Tous les hooks utilisent Supabase
- [ ] localStorage utilisé uniquement pour cache temporaire
- [ ] Synchronisation multi-devices fonctionne

---

#### Priorité 3: Images & Assets (Jours 15-16)

**Actions:**
1. ✅ Télécharger toutes les images Unsplash
2. ✅ Renommer avec convention claire
3. ✅ Uploader dans Supabase Storage
4. ✅ Remplacer URLs dans mock-data.ts
5. ✅ Tester chargement images

**Script de migration:**
```bash
#!/bin/bash
# migrate-images.sh

# Télécharger toutes les images
node scripts/download-unsplash-images.js

# Uploader vers Supabase
node scripts/upload-to-supabase-storage.js

# Générer nouveau fichier d'URLs
node scripts/generate-image-urls.js
```

**Validation:**
- [ ] Toutes les images hébergées sur Supabase
- [ ] URLs mises à jour
- [ ] Chargement rapide
- [ ] Pas d'images cassées

---

#### Tests intégration (Jours 17-18)

**Scénarios à tester:**
1. **Parcours complet utilisateur:**
   - Inscription
   - Connexion
   - Ajout produits au panier
   - Checkout
   - Paiement MOOV
   - Réception email confirmation
   - Consultation commande

2. **Parcours artisan:**
   - Inscription artisan
   - Upload documents KYC
   - Ajout produit
   - Upload photo produit
   - Réception commande

3. **Parcours admin:**
   - Connexion admin
   - Modération avis
   - Validation artisan
   - Consultation commandes
   - Export données

**Validation:**
- [ ] Tous les scénarios passent
- [ ] Pas d'erreurs console
- [ ] Performances acceptables
- [ ] Mobile fonctionne

---

### 📅 SEMAINE 4 - Optimisations

**Objectif:** Polish et fonctionnalités secondaires

#### Jour 19-20: SEO & Analytics

**SEO:**
```typescript
// Implémenter sur toutes les pages clés
const ProductDetailPage = () => {
  useSeo({
    title: product.name,
    description: product.story.substring(0, 160),
    image: product.images[0],
    url: `https://ippookraaft.com/boutique/${product.slug}`,
    type: 'product',
    keywords: product.niches?.join(', ')
  });
  
  // ... reste du composant
};
```

**Analytics:**
```typescript
// Google Analytics
useEffect(() => {
  analytics.pageView(location.pathname);
}, [location]);

// Events
const handleAddToCart = (product) => {
  analytics.event('add_to_cart', {
    item_id: product.id,
    item_name: product.name,
    price: product.price
  });
  
  addToCart(product.id);
};
```

**Validation:**
- [ ] GA configuré
- [ ] Events tracking OK
- [ ] Meta tags sur toutes les pages
- [ ] Sitemap.xml généré
- [ ] Robots.txt configuré

---

#### Jour 21-22: Sécurité & Performance

**Sécurité:**
- Rate limiting sur APIs
- CORS configuré
- CSP headers
- XSS protection
- SQL injection protection (RLS Supabase)

**Performance:**
- Lazy loading images
- Code splitting
- Caching
- Compression
- CDN Cloudflare

**Validation:**
- [ ] Lighthouse score > 90
- [ ] Pas de vulnérabilités connues
- [ ] Headers sécurité OK

---

#### Jour 23-24: Tests & QA

**Tests automatisés:**
```typescript
// tests/e2e/checkout.spec.ts
test('Complete checkout flow', async ({ page }) => {
  await page.goto('/boutique');
  await page.click('[data-product="p1"]');
  await page.click('[data-action="add-to-cart"]');
  await page.goto('/panier');
  await page.click('[data-action="checkout"]');
  
  // Fill form
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="phone"]', '+22800000000');
  
  // Select payment
  await page.click('[data-method="moov"]');
  await page.click('[data-action="pay"]');
  
  // Wait for redirect
  await page.waitForURL(/commande/);
  
  expect(await page.textContent('h1')).toContain('Merci');
});
```

**Validation:**
- [ ] Tests E2E passent
- [ ] Tests unitaires passent
- [ ] Pas de régression

---

### 📅 SEMAINE 5 - Pré-lancement

**Objectif:** Validation finale et déploiement

#### Jour 25-27: Tests utilisateurs

**Beta testing:**
- Inviter 10-20 utilisateurs beta
- Recueillir feedback
- Corriger bugs critiques

#### Jour 28-29: Déploiement

**Infrastructure:**
1. ✅ Configurer domaine
2. ✅ Configurer SSL
3. ✅ Déployer sur Vercel/Netlify
4. ✅ Configurer variables prod
5. ✅ Migrer données vers DB prod
6. ✅ Tester en production

**Validation finale:**
- [ ] Paiement réel réussi
- [ ] Email reçu
- [ ] App accessible
- [ ] Mobile OK
- [ ] Pas d'erreurs

#### Jour 30: Monitoring & Lancement 🚀

**Post-lancement:**
- Monitoring actif (Sentry)
- Support client prêt
- Backup configuré
- Plan de rollback prêt

---

## 📋 CHECKLIST COMPLÈTE

### Infrastructure ⚙️
- [ ] Supabase tables créées (schema.sql exécuté)
- [ ] Supabase Storage buckets créés
- [ ] Supabase Auth configuré
- [ ] RLS policies activées
- [ ] Backups automatiques OK

### Paiements 💳
- [ ] CinetPay configuré
- [ ] Test sandbox réussi
- [ ] Webhooks configurés
- [ ] Tous les opérateurs testés
- [ ] Mode production activé

### Authentification 🔐
- [ ] Supabase Auth actif
- [ ] SMTP configuré
- [ ] Templates emails personnalisés
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Reset password fonctionne

### Stockage 📁
- [ ] Supabase Storage configuré
- [ ] Upload photo profil OK
- [ ] Upload images produits OK
- [ ] Upload documents OK
- [ ] CDN configuré

### Emails 📧
- [ ] Brevo configuré
- [ ] Domaine vérifié
- [ ] Templates créés
- [ ] Email commande OK
- [ ] Email expédition OK

### Données 💾
- [ ] Tous hooks migrés
- [ ] localStorage = cache uniquement
- [ ] Sync multi-devices OK
- [ ] Images hébergées

### Sécurité 🔒
- [ ] Variables .env sécurisées
- [ ] Secrets pas en dur
- [ ] RLS activé
- [ ] HTTPS forcé
- [ ] Headers sécurité OK

### SEO & Analytics 📊
- [ ] Meta tags dynamiques
- [ ] Google Analytics
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Open Graph tags

### Tests ✅
- [ ] Tests E2E passent
- [ ] Tests unitaires passent
- [ ] Tests manuels OK
- [ ] Beta testing fait

### Déploiement 🚀
- [ ] Domaine configuré
- [ ] SSL actif
- [ ] App déployée
- [ ] Variables prod OK
- [ ] Monitoring actif

---

## 🎯 PRIORITÉS ABSOLUES

Si le temps/budget est limité, **faire AU MINIMUM:**

### Phase Minimale (2 semaines)
1. ✅ Paiements CinetPay (3 jours)
2. ✅ Supabase Auth (2 jours)
3. ✅ Migration hooks critiques (3 jours)
   - use-store (panier)
   - use-payments (commandes)
   - use-user (auth)
4. ✅ Email configuration (1 jour)
5. ✅ Variables .env (1 jour)
6. ✅ Tests basiques (2 jours)
7. ✅ Déploiement (2 jours)

**= 14 jours minimum pour MVP fonctionnel**

---

## 💡 CONSEILS

1. **Paralléliser:** Plusieurs développeurs peuvent travailler en parallèle
   - Dev 1: Paiements
   - Dev 2: Auth
   - Dev 3: Migration hooks

2. **Tester continuellement:** Ne pas attendre la fin pour tester

3. **Documentation:** Documenter au fur et à mesure

4. **Backup:** Sauvegarder avant chaque grosse modification

5. **Incrementiel:** Déployer par petits incréments

---

**🚀 Bon courage pour la mise en production !**

*Plan d'action créé automatiquement - 2026-05-17*
