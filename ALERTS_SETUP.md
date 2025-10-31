# Configuration du Système d'Alertes Automatiques

## Vue d'ensemble

Le système d'alertes automatiques d'Investy permet d'envoyer des emails personnalisés aux utilisateurs basés sur :
- Leur profil d'investisseur (Prudent, Équilibré, Dynamique, Agressif)
- Leurs actifs suivis dans leur watchlist
- Les seuils d'alerte personnalisés par actif
- La fréquence configurée (quotidien/hebdomadaire)

## Configuration requise

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Resend (pour l'envoi d'emails)
RESEND_API_KEY=your_resend_api_key_here

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 2. Migrations Supabase

Exécutez les migrations dans l'ordre :

```bash
# 1. Tables de base (déjà existantes)
supabase db push

# 2. Nouvelles tables pour les alertes
# Le fichier 0006_alert_runs_events.sql sera appliqué automatiquement
```

### 3. Configuration Vercel

Le fichier `vercel.json` est déjà configuré avec :
- **Daily**: 08:00 UTC, jours ouvrés (lundi-vendredi)
- **Weekly**: 08:00 UTC, lundi

## Architecture

### Tables Supabase

1. **`alert_runs`** - Suivi des exécutions de cron
   - `id`, `freq`, `started_at`, `finished_at`, `status`, `error`
   - `idempotency_key` - Évite les doublons
   - `processed_count` - Nombre d'utilisateurs traités

2. **`alert_events`** - Détails des envois d'emails
   - `run_id`, `user_id`, `email`, `profile_type`
   - `items` (JSON) - Liste des alertes déclenchées
   - `sent` - Statut d'envoi

### Seuils par profil

| Profil | Actions/ETF | Crypto | Forex |
|--------|-------------|--------|-------|
| Prudent | 3% | 6% | 0.6% |
| Équilibré | 5% | 8% | 0.8% |
| Dynamique | 8% | 10% | 1.0% |
| Agressif | 12% | 12% | 1.2% |

### Override par actif

Chaque actif dans la watchlist peut avoir un seuil personnalisé qui override le seuil du profil.

## Fonctionnalités

### 1. API Cron (`/api/cron/alerts`)

- **GET** `/api/cron/alerts?freq=daily` - Déclenchement manuel
- **GET** `/api/cron/alerts?freq=weekly` - Déclenchement manuel
- Idempotency : un seul run par jour/fréquence
- Traitement par batch avec throttling (300ms entre utilisateurs)

### 2. Page Admin (`/admin/runs`)

- Vue des exécutions récentes
- Détails des événements par run
- Statistiques (runs réussis, erreurs, utilisateurs traités)
- Bouton de test manuel

### 3. Templates d'emails

- Design brandé Investy
- Responsive et accessible
- Lien de désinscription automatique
- Contenu éducatif (non prescriptif)

## Tests

### Test manuel de l'API

```bash
# Test weekly
curl "http://localhost:3005/api/cron/alerts?freq=weekly"

# Test daily
curl "http://localhost:3005/api/cron/alerts?freq=daily"
```

### Test de la page admin

```bash
# Accès à la page admin
curl "http://localhost:3005/admin/runs"
```

## Déploiement

### 1. Variables d'environnement Vercel

Configurez dans le dashboard Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_BASE_URL`

### 2. Vercel Scheduler

Les crons sont automatiquement configurés via `vercel.json` :
- **Daily**: `0 8 * * 1-5` (08:00 UTC, lundi-vendredi)
- **Weekly**: `0 8 * * MON` (08:00 UTC, lundi)

### 3. Monitoring

- Logs Vercel pour les exécutions
- Page `/admin/runs` pour le monitoring
- Table `alert_runs` pour l'historique

## Sécurité

- `SUPABASE_SERVICE_ROLE_KEY` : Utilisée uniquement côté serveur
- Idempotency : Évite les doublons d'envoi
- Throttling : Évite le spam des APIs
- Désinscription : Lien automatique dans chaque email

## Troubleshooting

### Variables d'environnement manquantes

```json
{
  "ok": false,
  "error": "Missing environment variables",
  "required": ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY"]
}
```

### Run déjà exécuté (idempotency)

```json
{
  "ok": false,
  "reason": "already_ran",
  "run_id": "uuid"
}
```

### Erreurs courantes

1. **Supabase non configuré** → Vérifier les variables d'environnement
2. **Resend non configuré** → Vérifier `RESEND_API_KEY`
3. **Tables manquantes** → Exécuter les migrations
4. **Cron non déclenché** → Vérifier `vercel.json` et le déploiement

## Prochaines étapes

- [ ] Ajouter des tests unitaires
- [ ] Implémenter un système de queue pour >3k utilisateurs
- [ ] Ajouter des métriques avancées
- [ ] Intégrer des données macro (CPI, taux, etc.)
- [ ] Localisation des heures (Europe/Paris)
