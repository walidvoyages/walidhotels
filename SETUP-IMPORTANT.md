# Walid Voyages — Activation des fonctionnalités

Le ZIP restaure `admin.js`, `site.js`, `style.css`, `cinematic.js`, `cinematic.css` et les images manquantes. Ne pas ajouter de clef privée au dépôt.

## 1. Déployer
Téléverser tous les fichiers et sous-dossiers dans la racine du dépôt GitHub Pages. Activer `Deploy from a branch > main > /(root)`. Supprimer l’ancien workflow Astro/Jekyll si nécessaire.

## 2. Cloudinary + SEO automatiques
Installer Cloudflare Wrangler (`npm i -g wrangler`), se connecter `wrangler login`, ouvrir le sous-dossier cloudinary-worker.
Ajouter les secrets (ne **jamais** les envoyer sur ChatGPT ou GitHub):
- `wrangler secret put CLOUDINARY_API_SECRET`
- `wrangler secret put CLOUDINARY_API_KEY` (clé publique Cloudinary)
- `wrangler secret put FIREBASE_WEB_API_KEY` (configuration Firebase Web)
- `wrangler secret put GITHUB_TOKEN` (fine-grained PAT, accès Actions: write au dépôt uniquement)
- `wrangler secret put GITHUB_REPO` (exemple: `walidvoyages/walidvoyages1`)
Puis `wrangler deploy`. Les secrets doivent être configurés dans le dossier Worker concerné.
Dans `admin.html`, après connexion : indiquer URL Worker sous **Publication SEO**, pour upload ajouter `/upload` dans la case API Cloudinary. Choisir fichier PC > Envoyer vers Cloudinary > Enregistrer.

## 3. Règles de sécurité
Les données `admins/UID` doivent rester non-modifiables par les clients. Seuls les admins authentifiés doivent pouvoir écrire. **Attention** : les anciennes rules rendent toutes les données de `articles`, `omra`, `hotels` publiquement lisibles, y compris les brouillons. Migrer les brouillons dans une branche privée ou écrire des règles par document avant toute publication de brouillons.

## 4. Publication
Enregistrer = écrit dans Firebase. Publier SEO = lance le workflow GitHub qui régénère les meta HTML de la page FR et les pages d’articles publiés et sitemap. Les autres SEO pages (AR, sous-pages) restent statiques en attendant un gestionnaire SEO par page. Google ne garantit ni indexation immédiate ni première position.

## 5. Limites
Tests réels Firebase/Cloudinary/GitHub **non effectués** car authentification et secrets externes requis. GitHub Pages est statique; worker nécessaire pour téléversement `Signed`. Les recherches vols et hôtels ouvrent le site de réservation officiel sans transfert automatique des critères.
