# 🚀 Investy - Guide de déploiement en production

## Variables d'environnement requises

### Base de données (Supabase)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Emails (Resend)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Analytics (PostHog)
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Environnement
```bash
NEXT_PUBLIC_ENV=prod
NEXT_PUBLIC_BASE_URL=https://investy.app
```

### SEO (Google)
```bash
GOOGLE_SITE_VERIFICATION=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Restrictions email (optionnel)
```bash
EMAIL_ALLOWLIST=test@example.com,admin@investy.app
```

## Checklist de déploiement Vercel

### 1. Configuration du projet
- [ ] Connecter le repo GitHub à Vercel
- [ ] Configurer toutes les variables d'environnement
- [ ] Définir le domaine personnalisé `investy.app`
- [ ] Activer HTTPS et redirections www→non-www

### 2. Base de données Supabase
- [ ] Créer un projet Supabase
- [ ] Exécuter toutes les migrations SQL
- [ ] Configurer RLS (Row Level Security)
- [ ] Tester les connexions

### 3. Emails Resend
- [ ] Créer un compte Resend
- [ ] Configurer le domaine `investy.app`
- [ ] Valider DKIM et SPF
- [ ] Tester l'envoi d'emails

### 4. Analytics PostHog
- [ ] Créer un projet PostHog
- [ ] Configurer les événements de tracking
- [ ] Tester les conversions

### 5. Assets et SEO
- [ ] Créer `/public/og-cover.png` (1200x630px)
- [ ] Ajouter favicon.ico
- [ ] Tester les métadonnées Open Graph
- [ ] Vérifier le sitemap.xml

### 6. Tests de production
- [ ] Quiz complet → résultat
- [ ] Dashboard avec données
- [ ] Alertes email fonctionnelles
- [ ] Mobile responsive
- [ ] Lighthouse score > 90
- [ ] Vitesse de chargement < 3s

### 7. Sécurité
- [ ] Aucune clé service exposée côté client
- [ ] Auth Supabase sécurisée
- [ ] CORS configuré correctement
- [ ] Headers de sécurité activés

### 8. Légal
- [ ] Mentions légales complètes
- [ ] Disclaimer affiché
- [ ] Politique de cookies
- [ ] RGPD conforme

## Commandes utiles

```bash
# Build de production
npm run build

# Test local avec variables de production
npm run dev

# Vérification des types
npm run type-check

# Linting
npm run lint
```

## Monitoring

- **Vercel Analytics** : Performance et erreurs
- **PostHog** : Comportement utilisateur
- **Supabase** : Logs de base de données
- **Resend** : Statuts d'envoi d'emails

## Support

- Email : contact@investy.app
- Documentation : README.md
- Issues : GitHub Issues
