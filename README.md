# Invsty – Déploiement Vercel

## ENV
Copiez `env.example` vers `.env.local` et remplissez si nécessaire:

### Configuration de base
- `NEXT_PUBLIC_SITE_URL`

### Pipeline d'analyse (nouveau)
- `OPENAI_API_KEY` - Clé API OpenAI pour l'analyse LLM
- `USE_LLM_CLASSIFY=true` - Utiliser LLM pour classifier la pertinence
- `USE_LLM_ANALYZE=true` - Utiliser LLM pour analyser l'impact marché
- `ANALYSIS_BATCH=25` - Nombre d'articles à analyser par batch
- `CRON_ANALYZE_EVERY_MIN=5` - Fréquence d'analyse (minutes)

### Supabase (OBLIGATOIRE pour le système de plans)
- `NEXT_PUBLIC_SUPABASE_URL` - URL de ton projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Clé service role (côté serveur uniquement)

### Optionnels
- `RESEND_API_KEY` - Pour l'envoi d'emails
- `NEXT_PUBLIC_BASE_URL` - URL de base de l'application (pour les liens)

⚠️ **IMPORTANT** : Les variables Supabase sont **OBLIGATOIRES** pour le nouveau système de plans et subscriptions.

## Scripts
- `npm run dev` – dev server
- `npm run build` – build prod
- `npm start` – démarrer le build
- `npm run analyze` – build avec analyse (optionnel)
- `node scripts/check-vercel-setup.js` – vérifier la config Vercel

## Déploiement Vercel
1. Pousser le repo
2. Importer sur Vercel (root: `investy/`)
3. **Renseigner les ENV dans Project Settings** (voir ci-dessus)
4. **Exécuter les migrations SQL sur Supabase PROD** (voir `supabase/migrations/`)
5. Déployer

📖 **Problèmes de déploiement ?** → Voir `VERCEL_TROUBLESHOOTING.md`

## Santé & Erreurs
- Page: `/health`
- API: `/api/health`
- 404: `app/not-found.tsx`
- Error boundary: `app/error.tsx`

## Sécurité
- Headers via `next.config.js` et `vercel.json`
# investy
