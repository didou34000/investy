#!/bin/bash

echo "🚀 Déploiement Invsty..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Êtes-vous dans le bon répertoire ?"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

# Git add, commit et push
echo "📝 Ajout des fichiers..."
git add .

echo "💾 Commit des changements..."
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"

echo "⬆️ Push vers GitHub..."
git push https://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@github.com/didou34000/investy.git main

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
    echo "🌐 Vérifiez votre déploiement sur Vercel/Render"
else
    echo "❌ Erreur lors du push"
    exit 1
fi
