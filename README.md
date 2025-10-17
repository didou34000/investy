# Investy – Déploiement Vercel

## ENV
Copiez `.env.example` vers `.env` et remplissez si nécessaire:
- `NEXT_PUBLIC_SITE_URL`
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
