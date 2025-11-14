# 🚀 Guide de redéploiement Vercel

## ✅ Avant de redéployer

### 1. Vérifier les variables d'environnement
Aller sur : Vercel Dashboard → Project Settings → Environment Variables

**Variables OBLIGATOIRES** :
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

Si une variable manque, l'ajouter maintenant.

### 2. Vérifier les migrations SQL
Sur Supabase PROD :
- ✅ Exécuter `supabase/migrations/0011_plans_subscriptions.sql`
- ✅ Vérifier que les tables `plans`, `user_plans`, `subscriptions`, `deliveries` existent

## 📋 Options de redéploiement

### Option recommandée : Redéploiement SANS cache

**Dans la modale "Redeploy"** :
- ✅ **Décocher** "Use existing Build Cache"
- ✅ Cliquer sur "Redeploy"

**Pourquoi ?** 
- Force un rebuild complet avec le nouveau code
- Évite les problèmes de cache qui peuvent causer des différences avec localhost
- Garantit que tout est à jour

### Option alternative : Redéploiement AVEC cache

**Dans la modale "Redeploy"** :
- ⚠️ **Cocher** "Use existing Build Cache"
- Cliquer sur "Redeploy"

**Quand l'utiliser ?**
- Seulement si tu veux un déploiement plus rapide
- Seulement si tu es sûr que le cache est à jour
- **Risque** : Peut ne pas inclure les dernières modifications

## 🎯 Recommandation pour ton cas

**Décoche "Use existing Build Cache"** pour forcer un rebuild complet et garantir que Vercel = localhost.

## ✅ Après le redéploiement

1. Attendre que le déploiement se termine (2-3 minutes)
2. Tester : `https://ton-domaine.vercel.app/api/test-plans`
   - Doit retourner `{"overall": "✅ Tous les tests passent"}`
3. Tester : `https://ton-domaine.vercel.app/suivi-actifs`
   - Doit afficher la page avec les plans

## 🔍 Si ça ne marche toujours pas

1. Vérifier les logs Vercel : Deployments → Cliquer sur le déploiement → Logs
2. Chercher les erreurs liées à :
   - Variables d'environnement manquantes
   - Tables Supabase manquantes
   - Erreurs de build

