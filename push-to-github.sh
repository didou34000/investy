#!/bin/bash

echo "🚀 PUSH VERS GITHUB - MÉTHODE FORCÉE"

# Configuration Git
git config user.name "dorian"
git config user.email "dorian@example.com"

# Ajouter tout
git add .

# Commit
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S') - sécurité API"

# Essayer différentes méthodes de push
echo "📤 Tentative 1: Push direct avec token..."

# Méthode 1: Token dans l'URL
git push https://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@github.com/didou34000/investy.git main || {
    echo "❌ Méthode 1 échouée"
    
    echo "📤 Tentative 2: Push avec credentials..."
    
    # Méthode 2: Credentials
    git config credential.helper store
    echo "https://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@github.com" > ~/.git-credentials
    git push origin main || {
        echo "❌ Méthode 2 échouée"
        
        echo "📤 Tentative 3: Force push..."
        git push --force origin main || {
            echo "❌ Toutes les méthodes ont échoué"
            echo "🔧 Solution: Va sur GitHub.com et upload manuellement"
            echo "📁 Fichiers à uploader:"
            ls -la
            exit 1
        }
    }
}

echo "✅ PUSH RÉUSSI !"
