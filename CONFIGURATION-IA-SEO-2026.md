# Walid Hotels — Assistant IA, FAQ, SEO et réservation

## 1. Ce qui est intégré dans le code
- Chatbot flottant accessible sur \`index.html\` et \`ar.html\`, versions français / العربية / tunisien darja / anglais.
- Assistance locale **sans API** : repérage d’un hôtel dans le catalogue visible et création de liens de recherche sur \`https://www.walid-voyages.com/liste\` avec \`checkin\`, \`checkout\`, \`hotel\`, \`q\`, \`destination\`.
- Réponses de secours même si Firebase, le Worker ou l'IA sont indisponibles.
- L'IA distante est **facultative** et nécessite un déploiement Cloudflare Worker sécurisé.
- Admin > **Hôtels** : trois champs FAQ propres à chaque hôtel : heures d'arrivée/départ, services, conditions d'annulation. Ne saisir que des informations vérifiées.
- FAQ dynamique dans le catalogue, sur les hôtels publiés via Firebase, après chargement.
- \`generate-seo.py\` : pages HTML pré-rendues **uniquement** pour les hôtels marqués \`published:true\` en Firebase, puis sitemap. Ajoute FAQ visible, JSON-LD \`Hotel\` et \`BreadcrumbList\`, lien de recherche de réservation officiel.
- Une FAQ existait déjà sur la page principale FR et AR. Aucun faux avis, fausses étoiles, disponibilité ou prix n'est injecté dans les pages.
- L'ancien HTML du site est statique : ce système est du **pré-rendu** par GitHub Actions, **pas du SSR à chaque requête**. Google peut lire les pages générées sans exécuter JavaScript.

## 2. Activer le Worker IA (facultatif)
1. Cloudflare > Workers, déployer \`chat-worker/worker.js\` via Wrangler en utilisant \`chat-worker/wrangler.toml\`, avec Wrangler >= 4.36.0.
2. Ajouter le secret **\`OPENAI_API_KEY\` uniquement dans Cloudflare**, jamais dans le site, GitHub ou le navigateur. Modèle par défaut \`gpt-4o-mini\`; \`OPENAI_MODEL\` peut être configuré côté Worker.
3. Vérifier l'existence du binding \`CHAT_RATE_LIMITER\`, 8 requêtes/60 secondes, déclaré dans Wrangler. La limitation Cloudflare reste approximative et localisée géographiquement ; configurer WAF / Turnstile / autres limites si le trafic augmente.
4. Dans Firebase Realtime Database, autoriser la **lecture publique** de \`siteSettings/chatbot\`, mais réserver son écriture aux admins. NE PAS publier la clé OpenAI dans cette collection.
5. Se connecter à \`admin.html\` > **Assistant IA**, saisir le point de terminaison HTTPS réel (\`https://<worker>.workers.dev/chat\`) dans **endpoint**, mettre **enabled = true**, puis Enregistrer.
6. Tester le chatbot sur les versions FR et AR, vérifier que les messages contenant une demande de prix renvoient vers le moteur officiel pour les tarifs réels.
7. Le Worker accepte les origines \`www.walidvoyages.com\`, \`walidvoyages.com\`, \`walidvoyages.github.io\` et localhost. Adapter la liste au domaine **réel** avant publication.

Note : la bibliothèque d'assistance est utilisable **sans** API OpenAI, mais dans ce mode elle est un chatbot à règles, et **non** une IA générative. Le code frontend et le Worker ont été enregistrés ; leur configuration, déploiement effectif et la facturation éventuelle des API ne sont pas validés dans cette session.

## 3. Prix et disponibilités : aucun tarif inventé
Le site **ne possède pas encore d'API authentifiée des prix et disponibilités** du moteur \`walid-voyages.com/liste\`. Le chatbot prépare une URL de recherche avec hôtel/destination/dates, puis l'utilisateur vérifie les résultats dans le deuxième site. On ne peut pas garantir que le second moteur sélectionne automatiquement l'hôtel sans prise en charge de ses paramètres.

Pour de vraies réponses avec prix en direct, il faudra **une API officielle côté réservation**, qui accepte hôtel, dates, voyageurs, devise et renvoie disponibilités, chambres, conditions et prix. L'API devra être intégrée côté serveur (pas de clés dans JS public). Ne pas scraper ni inventer de prix.

## 4. Activer le pré-rendu SEO
1. Configurer le secret GitHub Actions \`FIREBASE_SERVICE_ACCOUNT_JSON\` avec des permissions limitées à la lecture des données nécessaires. Ne pas l'ajouter au repository.
2. Configurer \`PUBLIC_SITE_URL\` avec le domaine **réel** et unique de Walid Hotels.
3. Lancer \`.github/workflows/seo.yml\` manuellement la première fois ; vérifier le résultat. Ensuite, exécution planifiée chaque jour.
4. Confirmer la présence des fichiers dans \`hotels/*.html\`, le fichier \`sitemap.xml\` mis à jour, les canonicals et l'indexabilité par Google Search Console.
5. Publier un hôtel nouveau ou modifier ses FAQ depuis Admin, puis relancer la publication SEO pour le pré-rendu. Un simple enregistrement Firebase met à jour l'interface JS, mais **pas** la page statique Google tant que le workflow n'a pas tourné.
6. Vérifier qu'il n'y a pas de conflit avec le \`CNAME\` existant \`www.walidvoyages.com\`, potentiellement domaine du site principal. Ne pas remplacer le site principal par ce repository sans une décision explicite.

## 5. Contrôles qualité et sécurité
- Les fichiers JS sont vérifiés pour la syntaxe via analyse statique. Les tests de réseau Firebase, Cloudflare, du moteur de réservation et du déploiement public doivent être réalisés depuis un navigateur et le tableau de bord des services.
- Les avis clients nécessitent **toujours** l'activation de Firebase Anonymous Auth, les règles RTDB et la modération décrites dans \`SETUP-HOTELS-PREMIUM-2026.md\`.
- Les réponses et les avis utilisateur sont affichés en texte, sans HTML non fiable.
- Vérifier les Core Web Vitals (LCP/INP/CLS), robots.txt, Search Console, sitemap, images et URL canoniques avec le domaine de production.
- Google n'accorde pas de résultats enrichis FAQ généraux à tous les sites ; le balisage FAQ ne garantit pas un affichage spécial. Les contenus doivent répondre aux vrais besoins des utilisateurs.
