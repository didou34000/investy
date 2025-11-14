# 🔍 Guide de dépannage Localhost vs Vercel

## Problèmes courants et solutions

### 1. ❌ Variables d'environnement manquantes

**Symptôme** : Erreurs 500, données non chargées, authentification qui ne fonctionne pas

**Solution** : Vérifier dans Vercel Dashboard → Project Settings → Environment Variables

#### Variables OBLIGATOIRES pour le nouveau système de plans :

```bash
# Supabase (obligatoire)
NEXT_PUBLIC_SUPABASE_URL=https://kpninitrrpycnxhgpgpq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Variables pour les nouvelles fonctionnalités :

```bash
# Pour les subscriptions (si utilisé)
NEXT_PUBLIC_BASE_URL=https://investy.app

# Pour les emails (optionnel mais recommandé)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Action** : 
1. Aller sur https://vercel.com/dashboard
2. Sélectionner ton projet
3. Settings → Environment Variables
4. Vérifier que toutes les variables ci-dessus sont présentes
5. **Redéployer** après avoir ajouté/modifié des variables

---

### 2. ❌ Migrations SQL non exécutées sur Supabase PROD

**Symptôme** : Erreurs "relation does not exist", tables manquantes, erreurs 500 sur les routes API

**Solution** : Exécuter les migrations sur Supabase Production

#### Checklist des migrations :

- [ ] `0011_plans_subscriptions.sql` → **CRITIQUE** pour le nouveau système de plans
- [ ] Toutes les migrations précédentes (0001 à 0010)

**Action** :

1. **Via Supabase Dashboard** :
   - Aller sur https://supabase.com/dashboard
   - Sélectionner ton projet **PRODUCTION** (pas local)
   - SQL Editor → New Query
   - Copier le contenu de `supabase/migrations/0011_plans_subscriptions.sql`
   - Exécuter

2. **Via Supabase CLI** (si installé) :
   ```bash
   supabase db push --db-url "postgresql://postgres:[password]@[host]:5432/postgres"
   ```

3. **Vérifier** : Tester `/api/test-plans` sur Vercel pour voir si les tables existent

---

### 3. ❌ Cache de build Vercel

**Symptôme** : Code mis à jour sur GitHub mais pas sur Vercel, anciennes versions

**Solution** : Forcer un rebuild complet

**Action** :
1. Vercel Dashboard → Deployments
2. Cliquer sur les 3 points du dernier déploiement
3. "Redeploy" → Sélectionner "Use existing Build Cache" = **OFF**
4. Ou supprimer le cache : Settings → General → Clear Build Cache

---

### 4. ❌ Différence Supabase Local vs Production

**Symptôme** : Fonctionne en local mais pas sur Vercel

**Vérifications** :

1. **URL Supabase** : 
   - Local : peut pointer vers un projet local ou différent
   - Vercel : doit pointer vers le projet **PRODUCTION**

2. **RLS (Row Level Security)** :
   - Les policies RLS doivent être identiques sur les deux environnements
   - Vérifier que les policies sur `plans`, `user_plans`, `subscriptions` sont créées

3. **Données de test** :
   - Les plans (`free`, `standard`, `pro`) doivent exister dans la table `plans` en PROD
   - La migration `0011_plans_subscriptions.sql` les crée automatiquement

---

### 5. ✅ Checklist de vérification rapide

#### Sur Vercel Dashboard :

- [ ] Toutes les variables d'environnement sont configurées
- [ ] Le build passe sans erreur (regarder les logs)
- [ ] Le déploiement est récent (après le dernier push)

#### Sur Supabase Dashboard (PROD) :

- [ ] Table `plans` existe avec 3 lignes (free, standard, pro)
- [ ] Table `user_plans` existe
- [ ] Table `subscriptions` existe
- [ ] Table `deliveries` existe
- [ ] RLS activé sur toutes ces tables
- [ ] Policies créées (voir `0011_plans_subscriptions.sql`)

#### Test rapide :

1. Sur Vercel : `https://ton-domaine.vercel.app/api/test-plans`
   - Doit retourner `{"overall": "✅ Tous les tests passent"}`

2. Sur Vercel : `https://ton-domaine.vercel.app/suivi-actifs`
   - Doit afficher la page avec les 3 plans

---

### 6. 🔧 Commandes de diagnostic

#### Vérifier les variables d'env sur Vercel :
```bash
# Via Vercel CLI (si installé)
vercel env ls
```

#### Tester la connexion Supabase :
```bash
# Créer une route de test temporaire
curl https://ton-domaine.vercel.app/api/test-plans
```

#### Vérifier les migrations :
```sql
-- Dans Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('plans', 'user_plans', 'subscriptions', 'deliveries');
```

---

### 7. 📝 Logs Vercel

Si ça ne marche toujours pas :

1. Vercel Dashboard → Deployments → Cliquer sur le déploiement
2. Onglet "Functions" ou "Logs"
3. Chercher les erreurs liées à :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `relation "plans" does not exist`
   - `unauthorized`

---

### 8. 🚀 Quick Fix (Solution rapide)

Si tu veux tout réinitialiser rapidement :

1. **Vercel** :
   - Settings → Environment Variables → Vérifier toutes les variables
   - Deployments → Redeploy (sans cache)

2. **Supabase PROD** :
   - SQL Editor → Exécuter `0011_plans_subscriptions.sql`
   - Vérifier que les tables existent

3. **Tester** :
   - `https://ton-domaine.vercel.app/api/test-plans`
   - `https://ton-domaine.vercel.app/suivi-actifs`

---

## 📞 Support

Si le problème persiste, vérifier :
- Les logs Vercel (erreurs spécifiques)
- Les logs Supabase (queries qui échouent)
- La console navigateur (erreurs côté client)

