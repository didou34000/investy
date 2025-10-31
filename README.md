# Investy – Déploiement Vercel

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

### Optionnels
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (optionnels)
- `RESEND_API_KEY` (optionnel)

Les APIs renvoient un succès simulé si les clés manquent (aucun blocage en prod).

## Scripts
- `npm run dev` – dev server
- `npm run build` – build prod
- `npm start` – démarrer le build
- `npm run analyze` – build avec analyse (optionnel)

## Déploiement Vercel
1. Pousser le repo
2. Importer sur Vercel (root: `investy/`)
3. Renseigner les ENV dans Project Settings
4. Déployer

## Santé & Erreurs
- Page: `/health`
- API: `/api/health`
- 404: `app/not-found.tsx`
- Error boundary: `app/error.tsx`

## Sécurité
- Headers via `next.config.js` et `vercel.json`
# investy
