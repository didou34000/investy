#!/usr/bin/env bash
set -e

git add .
git commit -m "auto: update from Cursor" || echo "No changes to commit"
git push


