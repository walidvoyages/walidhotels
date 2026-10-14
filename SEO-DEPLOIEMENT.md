# Walid Voyages – SEO FR/AR: activation indispensable

## Pourquoi l'ancien SEO Admin ne publiait pas ?
1. Il enregistrait un unique `seo/home`, pas les titres et descriptions par page et par langue.
2. L'ancien `generate-seo.py` ne modifiait que `index.html` et pas `ar.html` ni les pages Omra, Hôtels, Vols, Voyages.
3. Il tentait de lire la base Firebase en accès public et ignorait silencieusement les erreurs : workflow « réussi » même si l'Admin data n'avait pas été lue.
4. Le bouton « Enregistrer » n'est pas un bouton de publication: il faut déclencher le worker `/publish`, GitHub Actions, puis attendre la nouvelle version GitHub Pages.
5. Les balises canonicals pointaient sur walidvoyages.com tandis que la version test est sur `walidvoyages.github.io/walidvoyagessite/`.

## Activation sécurisée – à faire manuellement une seule fois
1. GitHub Repository > Settings > Secrets and variables > Actions > New repository secret: `FIREBASE_SERVICE_ACCOUNT_JSON` = clé JSON d'un compte de service Firebase doté d'un accès en lecture seulement aux données utiles (ne jamais commiter cette clé).
2. Repository variables: `PUBLIC_SITE_URL` = `https://walidvoyages.github.io/walidvoyagessite` pour les tests. Seulement lorsque www.walidvoyages.com sert effectivement la même version, modifier en `https://www.walidvoyages.com` et relancer SEO.
3. Repository > Settings > Actions > General: donner à GitHub Actions « Read and write permissions » pour pouvoir pousser les pages générées.
4. Cloudflare Worker: configurer secrètement `FIREBASE_WEB_API_KEY`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO=walidvoyages/walidvoyagessite`. Fournir son URL au champ « API sécurisée » dans l'Admin pour déclencher `/publish`.
5. Dans Admin SEO Manager, choisir la page FR/AR, saisir titre et description, Enregistrer (Firebase), puis Publier SEO. Contrôler Actions > dernier job avant de tester View Source du site.
6. Dans Google Search Console, ajouter la propriété du domaine vérifié et soumettre `/sitemap.xml`, puis inspecter une URL. Ne pas promettre la première position.

**Attention :** la clé JSON de service Firebase doit rester absolument privée (secret GitHub uniquement). Avant création du compte, appliquer le moindre privilège possible. Le compte d'authentification Firebase de l'Admin est différent du compte de service du build.

## Vérifications non effectuées
Aucun test authentifié de Firebase, Cloudinary, Cloudflare Worker ou GitHub Actions n'est possible sans les accès externes. Les fichiers et le script sont testables localement sur la syntaxe et le schéma, mais l'activation réelle exige les étapes ci-dessus.
