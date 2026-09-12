#!/bin/bash
# Met à jour et redéploie le site sur le VPS : git pull + build + restart.
# Usage : bash deploy/update.sh (depuis le dossier web/)
set -e
cd "$(dirname "$0")/.."
git -C .. pull
npm run build
sudo systemctl restart torrow-web
echo "Déployé."
