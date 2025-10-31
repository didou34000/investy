# Configuration du Système d'Adoption

## Vue d'ensemble

Le système d'adoption d'Investy comprend :
- **Centre d'intérêts** : Packs d'actifs prêts à suivre selon le profil
- **Analytics PostHog** : Suivi des actions clés utilisateur
- **Double opt-in** : Confirmation email avant alertes régulières

## Configuration requise

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Supabase (déjà existant)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Resend (déjà existant)
RESEND_API_KEY=your_resend_api_key_here

# PostHog (nouveau)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3005
```

### 2. Migrations Supabase

Exécutez la nouvelle migration :

```bash
# Migration pour le double opt-in
supabase db push
```

### 3. Configuration PostHog

1. Créez un compte sur [PostHog](https://posthog.com)
2. Créez un nouveau projet
3. Récupérez votre clé API (format: `phc_xxx`)
4. Configurez l'host selon votre région (EU/US)

## Fonctionnalités

### 1. Centre d'intérêts (`/interets`)

**Packs disponibles :**
- **ETF Monde** : Diversification globale (tous profils)
- **Tech US** : Croissance tech (Équilibré, Dynamique, Agressif)
- **Obligations Europe** : Défensif (Prudent, Équilibré)
- **Crypto Majors** : Volatil (Dynamique, Agressif)
- **Marchés émergents** : Diversification géographique
- **Énergies renouvelables** : Transition énergétique

**Logos des actifs :**
- 🍎 Apple (AAPL)
- ⚡ Tesla (TSLA)
- 🪟 Microsoft (MSFT)
- ₿ Bitcoin
- ⟠ Ethereum
- ◎ Solana
- 🌍 MSCI World
- 📈 S&P 500
- Et bien d'autres...

### 2. Analytics PostHog

**Événements trackés :**
- `page_interests_view` : Vue de la page centre d'intérêts
- `interest_pack_added` : Ajout d'un pack (avec id, profile, items_count)
- `email_sent_confirm` : Envoi d'email de confirmation
- `email_confirmed` : Confirmation d'email réussie
- `watchlist_add_manual` : Ajout manuel d'actif
- `alerts_prefs_saved` : Sauvegarde des préférences d'alertes

### 3. Double opt-in

**Flux :**
1. Utilisateur crée un compte
2. Système envoie un email de confirmation
3. Utilisateur clique sur le lien
4. Email confirmé → alertes activées
5. Redirection vers dashboard avec message de confirmation

**Sécurité :**
- Token unique par utilisateur
- Expiration automatique
- Vérification côté serveur
- RLS policies Supabase

## Architecture

### Tables Supabase

1. **`email_confirm`** - Double opt-in
   - `user_id`, `token`, `confirmed`, `created_at`
   - RLS : utilisateur peut voir ses propres confirmations

2. **`user_watchlist`** - Actifs suivis (existant)
   - Enrichi avec les packs d'actifs
   - Logos et catégories

### Composants

1. **`/app/interets/page.tsx`** - Centre d'intérêts
2. **`/app/confirm/[token]/page.tsx`** - Confirmation email
3. **`/lib/assetPacks.ts`** - Packs et logos
4. **`/lib/analytics.ts`** - PostHog integration
5. **`/components/PostHogProvider.tsx`** - Initialisation

## Tests

### Test manuel

```bash
# 1. Centre d'intérêts
curl "http://localhost:3005/interets"

# 2. API de confirmation
curl -X POST "http://localhost:3005/api/email/send-confirm" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","email":"test@example.com"}'

# 3. Page de confirmation
curl "http://localhost:3005/confirm/test-token"
```

### Test PostHog

1. Ouvrez les DevTools du navigateur
2. Allez sur `/interets`
3. Vérifiez les événements dans l'onglet Network
4. Vérifiez dans PostHog dashboard

## Intégration UI

### Liens ajoutés

- **Dashboard** : Bouton "Centre d'intérêts" en premier
- **Résultats** : Bouton "Centre d'intérêts" en vert
- **Navigation** : Intégration dans le flux utilisateur

### Design

- **Cohérence** : Même palette (bleu #3B82F6, blanc, gris)
- **Logos** : Emojis pour les actifs populaires
- **Responsive** : Grid adaptatif
- **Accessibilité** : ARIA labels, focus rings

## Déploiement

### Variables d'environnement Vercel

Ajoutez dans le dashboard Vercel :
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

### PostHog Production

1. Créez un projet production
2. Configurez les domaines autorisés
3. Activez les fonctionnalités avancées (session recording, etc.)

## Monitoring

### PostHog Dashboard

- **Funnels** : Quiz → Résultats → Centre d'intérêts → Dashboard
- **Cohorts** : Utilisateurs par profil
- **Retention** : Retour sur le centre d'intérêts
- **Events** : Actions clés par utilisateur

### Métriques clés

- **Taux d'adoption** : % utilisateurs ajoutant des packs
- **Engagement** : Nombre de packs ajoutés par utilisateur
- **Conversion** : Quiz → Centre d'intérêts → Dashboard
- **Retention** : Retour sur le centre d'intérêts

## Prochaines étapes

- [ ] A/B testing des packs
- [ ] Recommandations personnalisées
- [ ] Notifications push
- [ ] Gamification (badges, niveaux)
- [ ] Intégration réseaux sociaux
- [ ] Analytics avancées (cohorts, funnels)

## Troubleshooting

### PostHog ne track pas

1. Vérifiez `NEXT_PUBLIC_POSTHOG_KEY`
2. Vérifiez `NEXT_PUBLIC_POSTHOG_HOST`
3. Ouvrez DevTools → Network → cherchez les requêtes PostHog
4. Vérifiez les erreurs console

### Centre d'intérêts ne charge pas

1. Vérifiez la connexion Supabase
2. Vérifiez les variables d'environnement
3. Vérifiez les RLS policies
4. Testez avec un utilisateur connecté

### Double opt-in ne fonctionne pas

1. Vérifiez `RESEND_API_KEY`
2. Vérifiez la table `email_confirm`
3. Vérifiez les RLS policies
4. Testez l'API `/api/email/send-confirm`
