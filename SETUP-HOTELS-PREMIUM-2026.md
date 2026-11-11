# Walid Hotels Premium — contrôle de mise en production

## Fonctions livrées
- Site FR/AR avec catalogue hôtels filtrable, renouvellement quotidien de l'ordre, en priorité les hôtels publiés via Admin.
- Omra et voyages organisés gérés dans Admin, visibles automatiquement après publication.
- Formulaire d'avis par hôtel : prénom, note, mois de séjour, commentaire, consentement.
- Les demandes sont enregistrées dans `hotelReviewSubmissions/{hotelId}/{uid}` en attente de validation.
- L'onglet Admin **Avis à modérer** permet d'approuver ou refuser. Seuls les avis approuvés sont copiés dans `hotelReviews`, puis affichés publiquement.
- Animations discrètes et adaptées à la préférence *reduced motion*.
- Site SEO FR/AR, sitemap et pages SEO statiques pour les hôtels publiés lors de l'exécution du workflow.

## Paramètres Firebase indispensables
Le frontend utilise le projet Firebase existant `walidvoyages-13332`. Dans Firebase Console > Authentication, activer **Anonymous** pour autoriser le formulaire sans compte. Vérifier que l'admin est autorisé selon les règles existantes : `admins/{uid} = "admin"`.

**IMPORTANT** : les règles de sécurité de la Realtime Database ne sont pas modifiées par un commit GitHub. Fusionner les règles nécessaires avec les règles existantes (ne pas remplacer toute la configuration sans audit). Exemple de structure des chemins additionnels à intégrer :

```json
{
  "hotelReviewSubmissions": {
    ".read": "auth != null && root.child('admins').child(auth.uid).val() === 'admin'",
    "$hotel": {
      "$uid": {
        ".write": "auth != null && (root.child('admins').child(auth.uid).val() === 'admin' || (auth.uid === $uid && !data.exists() && newData.exists()))",
        ".validate": "newData.hasChildren(['hotelName','author','comment','score','status','userId','submittedAt']) && newData.child('userId').val() === auth.uid && newData.child('status').val() === 'pending' && newData.child('hotelName').isString() && newData.child('hotelName').val().length <= 140 && newData.child('author').isString() && newData.child('author').val().length >= 2 && newData.child('author').val().length <= 80 && newData.child('comment').isString() && newData.child('comment').val().length >= 20 && newData.child('comment').val().length <= 1500 && newData.child('score').isNumber() && newData.child('score').val() >= 1 && newData.child('score').val() <= 5"
      }
    }
  },
  "hotelReviews": {
    ".read": true,
    ".write": "auth != null && root.child('admins').child(auth.uid).val() === 'admin'"
  }
}
```

Les règles sont un exemple *à fusionner*, pas un fichier déployé. Le projet doit conserver les permissions existantes pour `hotels`, `omra`, `voyages` et `admins`. Vérifier en Firebase Emulator avant application; idéalement ajouter App Check, une limite de débit côté serveur et une modération anti-spam. Si Firebase bloque les écritures, le formulaire affiche une erreur sans prétendre avoir envoyé l'avis.

## Recherche sur le deuxième site
Les cartes ouvrent `https://www.walid-voyages.com/liste` en transmettant `checkin`, `checkout`, `hotel`, `q`, `destination`. Les deux premiers paramètres ont été observés dans des URLs de recherche publiques. Le support des paramètres **hotel/q/destination** n'a PAS été confirmé : pour sélectionner automatiquement un hôtel précis, le moteur de réservation doit les interpréter ou exposer une API / route permettant l'identifiant hôtel. L'URL actuelle constitue une tentative de préremplissage, pas une garantie de résultat.

## SEO
Le workflow `.github/workflows/seo.yml` tourne manuellement et chaque jour à 04:17 UTC, **uniquement si** le secret GitHub `FIREBASE_SERVICE_ACCOUNT_JSON` et la variable `PUBLIC_SITE_URL=https://www.walidvoyages.com` sont configurés. Le script `generate-seo.py` crée `hotels/*.html` pour les hôtels réellement publiés et les ajoute au sitemap. Ne pas créer de faux prix, étoiles, scores ou avis dans les balises Schema.org.

**Attention au domaine** : le repository possède actuellement `CNAME = www.walidvoyages.com`, qui peut entrer en conflit avec le site principal Walid Voyages. Définir un sous-domaine dédié et mettre à jour CNAME, canoniques, alternates, Worker origins, sitemap et PUBLIC_SITE_URL avant de publier sur un domaine différent. Ne pas basculer un domaine de production sans vérification.

## Vérifications manuelles avant lancement
1. Vérifier l'URL déployée GitHub Pages, la version FR et la version AR (mobile et ordinateur).
2. Publier un nouvel hôtel depuis Admin et vérifier l'apparition en tête du catalogue.
3. Publier Omra et voyage avec dates futures; vérifier affichage et réservation WhatsApp.
4. Envoyer un avis test en navigation privée, valider dans Admin, vérifier sa publication.
5. Vérifier les règles avec un compte anonyme et un compte admin. Anonyme ne doit pas pouvoir publier ou modifier `hotelReviews`.
6. Vérifier le comportement réel du moteur `/liste` après clic sur un hôtel.
7. Vérifier GitHub Actions et la présence des pages `hotels/` dans le sitemap, puis tester Search Console.

Les fichiers JS ont passé la vérification syntaxique statique dans l'environnement d'édition. Les vérifications backend, permissions Firebase et déploiement réel doivent encore être effectuées dans les services externes.
