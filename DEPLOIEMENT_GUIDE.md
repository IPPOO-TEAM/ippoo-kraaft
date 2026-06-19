# 🚀 GUIDE DE DÉPLOIEMENT
## IPPOO KRAAFT - React + Vite + localStorage

---

## 📋 PRÉREQUIS

- Node.js 18+ installé
- pnpm (gestionnaire de paquets)
- Serveur web avec support HTTPS (Netlify, Vercel, ou autre)

---

## 🎯 DÉPLOIEMENT EXPRESS (3 ÉTAPES)

### 1️⃣ Nettoyage (optionnel)

```bash
# Retirer les fichiers de test
./scripts/cleanup-for-prod.sh
```

**OU** manuellement :
- Commenter les lignes 96-97 dans `src/app/routes.tsx`
- Supprimer les fichiers `/test-*` et `/verif-*` dans `src/app/pages/`

### 2️⃣ Build production

```bash
# Installer les dépendances
pnpm install

# Build optimisé
pnpm run build
```

**Résultat:** Dossier `/dist` créé (~600 KB gzippé)

### 3️⃣ Déploiement

**Option A - Netlify (recommandé)**
```bash
# Drag & drop du dossier /dist dans Netlify
# OU via CLI :
netlify deploy --prod --dir=dist
```

**Option B - Vercel**
```bash
vercel --prod
```

**Option C - Serveur classique**
```bash
# Copier le contenu de /dist sur votre serveur
rsync -avz dist/ user@server:/var/www/ippoo-kraaft/
```

---

## ⚙️ CONFIGURATION SERVEUR

### Rewrites nécessaires (SPA)

**Netlify** (`netlify.toml`)
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel** (`vercel.json`)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Apache** (`.htaccess`)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 🔐 APRÈS DÉPLOIEMENT

### ✅ Checklist de vérification

1. **Accueil** → `https://votredomaine.com/`
2. **Login admin** → `https://votredomaine.com/admin/login`
   - Tester : `admin` / `admin`
3. **Boutique** → `https://votredomaine.com/boutique`
4. **Panier** → Ajouter produit + tester checkout
5. **Upload média** → `/admin/media` → Upload image
6. **Mobile** → Tester sur smartphone réel

### 🔧 Premier pas admin

1. Aller sur `/admin/login`
2. Se connecter : `admin` / `admin`
3. **IMPORTANT:** Aller dans `/admin/parametres` et :
   - Changer le mot de passe admin
   - Configurer les webhooks si besoin
   - Vérifier les paramètres généraux

### 📊 Vérifier localStorage

Ouvrir DevTools → Application → Local Storage → Vérifier :
- `ipk:admin:v1` → Session admin
- `ipk:cart:v1` → Panier utilisateur
- `ipk:media:v1` → Bibliothèque média

---

## 🎨 PERSONNALISATION POST-DÉPLOIEMENT

### Logo & Favicon

1. **Remplacer le logo** :
   - Fichier : `src/imports/logo_IPPOO_Kraaft.png`
   - Rebuild : `pnpm run build`

2. **Ajouter favicon** :
   ```bash
   # Créer favicon.ico et le mettre dans /public
   cp votre-favicon.ico public/favicon.ico
   ```

### Couleurs de marque

Fichier : `src/styles/theme.css`

```css
:root {
  --ipk-green-dark: #0D8A3E;    /* Vert principal */
  --ipk-blue: #0057FF;          /* Bleu accent */
  --ipk-ink: #1a1a1a;           /* Noir texte */
}
```

### Textes page accueil

**Via admin** (recommandé) :
- `/admin/cms` → Éditer sections live

**Via code** :
- Fichier : `src/app/hooks/use-cms.tsx`

---

## 📈 MONITORING & ANALYTICS

### Ajouter Google Analytics

1. Créer un compte GA4
2. Obtenir le Measurement ID (G-XXXXXXXXXX)
3. Ajouter dans `public/index.html` (créer si absent) :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔄 MISES À JOUR

### Déployer une mise à jour

```bash
# 1. Modifier le code
# 2. Rebuild
pnpm run build

# 3. Redéployer
netlify deploy --prod --dir=dist
# OU
vercel --prod
```

### Rollback vers version précédente

**Netlify/Vercel** : Interface web → Deployments → Restore

---

## 🐛 TROUBLESHOOTING

### Page blanche après déploiement
- ✅ Vérifier les rewrites SPA (voir config serveur)
- ✅ Vérifier console navigateur (F12)
- ✅ Vérifier que `/dist` contient `index.html`

### Routes 404
- ✅ Ajouter rewrites serveur (voir Configuration)
- ✅ Vérifier base URL dans config

### localStorage vide
- ✅ Normal au premier lancement
- ✅ Se connecter admin pour initialiser
- ✅ Ajouter un produit au panier pour tester

### Images ne chargent pas
- ✅ Vérifier HTTPS activé
- ✅ Vérifier CORS si images externes
- ✅ Upload via `/admin/media` fonctionne toujours

---

## 💾 BACKUP & RESTAURATION

### Sauvegarder les données localStorage

**Script côté client** (à exécuter dans DevTools) :
```javascript
// Exporter toutes les données
const backup = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('ipk:')) {
    backup[key] = localStorage.getItem(key);
  }
}
console.log(JSON.stringify(backup));
// Copier la sortie et sauvegarder dans un fichier
```

**Restaurer** :
```javascript
// Coller le JSON de backup dans backupData
const backupData = { /* ... */ };
Object.entries(backupData).forEach(([key, value]) => {
  localStorage.setItem(key, value);
});
location.reload();
```

---

## 🚀 OPTIMISATIONS AVANCÉES

### CDN pour assets

**Cloudflare** (gratuit) :
1. Ajouter site à Cloudflare
2. Activer Auto Minify (JS, CSS, HTML)
3. Activer Brotli compression
4. Cache TTL : 4 heures

### PWA (Progressive Web App)

Service Worker déjà inclus (`public/sw.js`), activer :

1. Ajouter `manifest.json` dans `/public`
2. Décommenter SW registration dans `src/app/App.tsx`

---

## 📞 SUPPORT

### En cas de problème

1. Vérifier `CHECKUP_DEPLOIEMENT_FINAL.md`
2. Consulter logs serveur
3. Tester en local : `pnpm run build && pnpm preview`

### Identifiants par défaut

**Admin complet** : `admin` / `admin`  
**Modérateur** : `moderateur` / `moderateur`  
**Groupement** : `groupement` / `groupement`

⚠️ **CHANGER EN PRODUCTION !**

---

## ✅ CHECKLIST FINALE

- [ ] Build réussi (`pnpm run build`)
- [ ] Fichiers de test retirés (optionnel)
- [ ] Rewrites SPA configurés
- [ ] HTTPS actif
- [ ] Login admin testé
- [ ] Panier testé
- [ ] Upload média testé
- [ ] Mobile testé
- [ ] Mot de passe admin changé
- [ ] Favicon ajouté
- [ ] Analytics configuré (optionnel)

---

**Application prête ! 🎉**

Pour toute question : consulter `DOCUMENTATION_INDEX.md`
