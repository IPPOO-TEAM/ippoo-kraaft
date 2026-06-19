# ✅ Warnings Supabase Corrigés

**Date:** 17 Mai 2026  
**Statut:** Warnings "Multiple GoTrueClient instances" éliminés

---

## ⚠️ Warning Observé

```
GoTrueClient@sb-xovnqrlpgkcrakmgrrah-auth-token:2 (2.105.4)
Multiple GoTrueClient instances detected in the same browser context.
It is not an error, but this should be avoided as it may produce
undefined behavior when used concurrently under the same storage key.
```

---

## 🔍 Cause du Problème

Le warning apparaissait parce que **plusieurs instances du client Supabase** étaient créées:

1. Une instance dans `src/lib/supabase.ts` (le client principal)
2. Une autre instance créée dans `src/app/pages/test-connexion-directe.tsx` avec `createClient()`
3. Possiblement d'autres instances si le module était importé plusieurs fois

Quand plusieurs clients Supabase sont créés avec la même `storageKey`, ils peuvent entrer en conflit lors de la gestion de l'authentification et des sessions.

---

## ✅ Solution Appliquée

### 1. **Pattern Singleton dans `src/lib/supabase.ts`**

Ajout d'un système de singleton pour garantir une seule instance:

```typescript
// Singleton: une seule instance pour toute l'application
let _supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!_supabaseInstance) {
    _supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'sb-xovnqrlpgkcrakmgrrah-auth-token',
      }
    });
  }
  return _supabaseInstance;
}

export const supabase = getSupabaseClient();
```

**Avantages:**
- ✅ Une seule instance créée même si le module est importé plusieurs fois
- ✅ Plus de conflits de sessions
- ✅ Meilleures performances (pas de recréation)

### 2. **Utilisation du Client Singleton Partout**

Modifié `test-connexion-directe.tsx` pour utiliser le client singleton:

**Avant:**
```typescript
import { createClient } from '@supabase/supabase-js';
const client = createClient(url, key); // ❌ Nouvelle instance
```

**Après:**
```typescript
import { supabase } from '../../lib/supabase';
// Utilise le client singleton ✅
```

---

## 🧪 Vérification

Pour vérifier que le warning a disparu:

1. **Ouvrez la console** du navigateur (F12)
2. **Allez sur** `/test-connexion`
3. **Vérifiez** qu'il n'y a plus de warning "Multiple GoTrueClient instances"
4. **Vous devriez voir** uniquement:
   ```
   [Supabase] Initialisation du client singleton: { ... }
   [Supabase] ✅ Client singleton créé
   ```

---

## 📋 Bonnes Pratiques

### ✅ À FAIRE

1. **Toujours importer le client singleton:**
   ```typescript
   import { supabase } from '@/lib/supabase';
   ```

2. **Ne jamais créer de nouvelle instance:**
   ```typescript
   // ❌ NE PAS FAIRE
   const client = createClient(url, key);
   
   // ✅ FAIRE
   import { supabase } from '@/lib/supabase';
   ```

3. **Utiliser le même client partout:**
   - Dans les hooks
   - Dans les components
   - Dans les services
   - Dans les tests

### ❌ À NE PAS FAIRE

1. **Créer plusieurs instances:**
   ```typescript
   // ❌ Crée un nouveau client à chaque fois
   const client1 = createClient(url, key);
   const client2 = createClient(url, key);
   ```

2. **Importer createClient directement:**
   ```typescript
   // ❌ Risque de créer plusieurs instances
   import { createClient } from '@supabase/supabase-js';
   const client = createClient(...);
   ```

3. **Utiliser différentes storageKey:**
   ```typescript
   // ❌ Crée des conflits de sessions
   createClient(url, key, { auth: { storageKey: 'key1' } });
   createClient(url, key, { auth: { storageKey: 'key2' } });
   ```

---

## 🔧 Fichiers Modifiés

### `src/lib/supabase.ts`
- ✅ Ajout du pattern singleton
- ✅ Storage key unique et explicite
- ✅ Logs de debug pour vérification

### `src/app/pages/test-connexion-directe.tsx`
- ✅ Utilisation du client singleton
- ✅ Suppression de createClient local
- ✅ Import depuis `../../lib/supabase`

---

## 🎯 Résultat Attendu

Après ces modifications:

1. ✅ **Plus de warning** "Multiple GoTrueClient instances"
2. ✅ **Une seule instance** du client Supabase dans toute l'app
3. ✅ **Gestion cohérente** de l'authentification
4. ✅ **Meilleures performances** (pas de recréation)

---

## 💡 Pour Aller Plus Loin

### Si vous créez de nouveaux services/hooks:

```typescript
// ✅ BON EXEMPLE - Service avec singleton
import { supabase } from '@/lib/supabase';

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  return { data, error };
}
```

### Si vous avez besoin de plusieurs projets Supabase:

```typescript
// Si vous devez vraiment gérer plusieurs projets
import { createClient } from '@supabase/supabase-js';

// Utilisez des storage keys différentes
const clientProject1 = createClient(url1, key1, {
  auth: { storageKey: 'sb-project1-auth' }
});

const clientProject2 = createClient(url2, key2, {
  auth: { storageKey: 'sb-project2-auth' }
});
```

**Mais pour IPPOO KRAAFT**, vous n'avez qu'**un seul projet Supabase**, donc un seul client suffit! ✅

---

## 📞 Support

Si vous voyez toujours le warning après ces modifications:

1. **Rafraîchir complètement** la page (Ctrl+Shift+R)
2. **Vider le cache** du navigateur
3. **Redémarrer** le serveur de dev
4. **Vérifier** qu'aucun autre code ne crée de client Supabase

---

**Résumé:** Le warning a été éliminé en implémentant un pattern singleton garantissant une seule instance du client Supabase pour toute l'application. 🎉
