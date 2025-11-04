# 🔧 Fix Cron Jobs Vercel - Plan Hobby

## ❌ Problème identifié

Tu avais configuré 2 cron jobs avec des fréquences trop élevées pour le plan Hobby :
- `/api/news/refresh` → toutes les 10 minutes (`*/10 * * * *`)
- `/api/analyze/queue` → toutes les 5 minutes (`*/5 * * * *`)

**Limite plan Hobby** : Les cron jobs ne peuvent être déclenchés qu'**une fois par jour maximum**.

## ✅ Solution appliquée

J'ai modifié `vercel.json` pour que les cron jobs s'exécutent **une fois par jour** :
- `/api/news/refresh` → **08:00 UTC** chaque jour (`0 8 * * *`)
- `/api/analyze/queue` → **09:00 UTC** chaque jour (`0 9 * * *`)

## 📋 Options alternatives

### Option 1 : Garder cette configuration (recommandé pour Hobby)
✅ Fonctionne avec le plan Hobby  
✅ Gratuit  
⚠️ Moins fréquent (1x/jour au lieu de toutes les 5-10 min)

### Option 2 : Passer au plan Pro
- 40 cron jobs maximum
- Fréquence illimitée (toutes les 5 min possible)
- Prix : ~$20/mois

### Option 3 : Combiner en un seul cron job
Créer une route `/api/cron/batch` qui appelle les deux en séquence :
```json
{
  "crons": [
    { "path": "/api/cron/batch", "schedule": "0 8 * * *" }
  ]
}
```

## 🚀 Prochaines étapes

1. **Commit et push** la modification de `vercel.json`
2. **Redéployer** sur Vercel
3. Les cron jobs s'exécuteront maintenant une fois par jour

## ⚠️ Note importante

Sur le plan Hobby, Vercel ne garantit pas l'exécution exacte à l'heure. 
Par exemple, un cron configuré pour `0 8 * * *` (8h) peut s'exécuter entre 8h00 et 8h59.

Pour une exécution plus précise, il faut passer au plan Pro.

