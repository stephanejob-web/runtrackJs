# runtrackJs

Front-end runtrack, one folder per day, one folder per job.

```
jour06/   Bootstrap 5 and jQuery
jour07/   Materialize
bigjob/   Jours 9 et 10 — site de gestion des présences
```

---

# BigJob — Site La Plateforme_ (jours 9 et 10)

Site de gestion des présences dans les locaux. **Front uniquement** : la
persistance est simulée avec `localStorage`, amorcé depuis un fichier JSON.

## Lancer le projet

Les données sont chargées avec `fetch()`, ce qui ne marche pas en ouvrant le
fichier par double-clic (`file://`). Il faut un serveur :

```bash
cd bigjob && python3 -m http.server 8000
```

Puis <http://localhost:8000>.

## Comptes de démonstration

Ils sont aussi rappelés sur la page d'accueil.

| Rôle | Identifiants |
|---|---|
| Administrateur | `awa.diallo@laplateforme.io` / `admin123` |
| Modérateur | `marin.costa@laplateforme.io` / `modo123` |
| Étudiant | `lea.nguyen@laplateforme.io` / `etudiant123` |

Le bouton « Réinitialiser les données de démonstration » en bas de l'accueil
vide le `localStorage` et recharge le JSON.

## Arborescence

```
bigjob/
├── index.html            inscription et connexion
├── calendrier.html       calendrier et demandes de présence
├── backoffice.html       modération des demandes
├── administration.html   gestion des droits
├── styles/style.css
├── js/
│   ├── donnees.js        JSON → localStorage, accès aux données
│   ├── session.js        session simulée, garde d'accès, navbar
│   ├── auth.js           inscription et connexion
│   ├── calendrier.js
│   ├── backoffice.js
│   └── administration.js
├── assets/logo.svg
└── data/donnees.json
```

## Les règles

- **Inscription réservée à l'école.** Le domaine de l'adresse doit être
  `laplateforme.io`, comparé sans tenir compte de la casse. Le domaine autorisé
  est dans le JSON, pas en dur dans le code.
- **Session simulée.** Une seule entrée de `localStorage` contient l'identifiant
  connecté ; elle survit au rafraîchissement, donc l'utilisateur reste affiché
  comme « Connecté ».
- **Une date passée est figée.** Ni l'étudiant ni le modérateur ne peuvent plus
  rien changer : les jours passés du calendrier sont désactivés, et les lignes
  passées du backoffice n'ont plus de boutons mais la mention « Décision figée ».
- **Trois rôles.** L'étudiant voit le calendrier ; le modérateur ajoute le
  backoffice ; l'administrateur ajoute l'administration. Les pages sont gardées
  côté JavaScript : une URL saisie à la main renvoie à l'accueil.
- **Un administrateur ne peut pas se rétrograder lui-même**, sinon il perdrait
  l'accès à la page qui permet de revenir en arrière.

## Ce qui a été vérifié dans le navigateur

| Parcours | Résultat |
|---|---|
| Inscription hors domaine (`@gmail.com`, `@laplateforme.io.fr`, sans `@`) | refusée |
| Inscription en `@LAPLATEFORME.IO` | acceptée, casse ignorée |
| Email déjà pris, mot de passe court, champs vides | refusés avec le bon message |
| Calendrier : 10 jours passés | désactivés, clic sans effet |
| Calendrier : clic sur un jour à venir, puis re-clic | demande créée puis annulée |
| Étudiant sur `backoffice.html` / `administration.html` | redirigé |
| Rafraîchissement | session et demandes conservées |
| Backoffice : accepter / refuser | statuts et compteurs à jour |
| Backoffice : 3 demandes passées | aucun bouton, « Décision figée » |
| Administration : promotions et rétrogradations | appliquées et persistées |
| Administration : sa propre ligne | aucun bouton, « Votre compte » |
| Responsive à 390 px | 0 débordement, navbar en burger |

## Limite assumée

Les mots de passe sont stockés en clair dans le `localStorage`. C'est une
conséquence directe du « front uniquement » demandé par le sujet : sans serveur,
il n'y a ni hachage ni session réelle possible. À ne pas reproduire en
production.

---

# Jour 6 — Bootstrap

## Layout

```
jour06/
├── job01/   index.html, script.js, papillon.jpg
├── job02/   index.html, script.js, papillon.jpg
└── job03/   index.html, script.js
```

| Job | Subject |
|---|---|
| `job01` | Reproduce the mockup with Bootstrap classes and components, responsive |
| `job02` | Bring the page to life with Bootstrap and jQuery |
| `job03` | Responsive layout built with the Bootstrap grid |

## Running

The pages are plain HTML: open `jour06/job01/index.html` in a browser. Bootstrap
and jQuery are loaded from a CDN, so an internet connection is needed.

To test the responsive behaviour, resize the window or use the device toolbar of
the browser inspector. The `md` breakpoint (768px) is the one that switches
between the desktop and the mobile layouts.

## Job 02 — implemented interactions

| Interaction | Behaviour |
|---|---|
| `Accueil` link | Opens laplateforme.io in a new tab |
| Card button | Opens a modal confirming the butterfly order |
| `Rebooter le Monde` | Replaces the jumbotron text with a random Blade Runner (1982) quote |
| Pagination | Switches the jumbotron between three contents, `«` and `»` included |
| List group | A click makes the clicked item the active one |
| `−` / `+` around the progress bar | Moves it by 10%, clamped between 0 and 100 |
| Keys `D`, `G`, `C` in order | Opens a modal recapping the bottom left form |
| Bottom right form | Submitting with a non empty email and password randomly recolours the spinner |

The key sequence is ignored while typing inside a field, and a wrong key resets
it — pressing `D`, `C`, `D`, `G`, `C` still opens the modal on the last `C`.

## Job 03 — grid

| Blocks | Desktop | Mobile |
|---|---|---|
| Banner | `col-12` | `col-12` |
| Blue | three equal thirds | one full width, then two halves |
| Purple | a wide one then a narrower one | a narrow centred one then a wide one |
| Salmon | one aligned top, two aligned bottom | three equal columns |

The vertical offset of the salmon blocks comes from `align-items-md-end` and
`align-self-md-start`, so it only applies from the `md` breakpoint on.

---

# Jour 7 — Materialize

`Job 00` (create the repository and the folders) and `Job 00.9` (read the
Materialize documentation) produce no file, so the deliverables are `job01` to
`job06`.

## Layout

```
jour07/
├── job01/   index.html
├── job02/   index.html
├── job03/   index.html
├── job04/   index.html
├── job05/   index.html, assets/
└── job06/   index.html, assets/
```

| Job | Subject |
|---|---|
| `job01` | Plain HTML page: header with a nav, signup form, footer with four links |
| `job02` | Include the Materialize 1.0.0 CDN and style the header |
| `job03` | Style the footer |
| `job04` | Modernise the form and give every input an icon |
| `job05` | A themed page of its own: header with a logo and links, cards of several sizes |
| `job06` | Add a Materialize Carousel, initialised in JavaScript |

No CSS file of our own is used from `job02` on, only Materialize classes, as the
subject requires.

## A word on the intermediate states

`job02` and `job03` load Materialize while the form still carries its plain HTML
markup. Materialize hides native radios and checkboxes and expects
`<label><input><span>text</span></label>` instead, so those controls look
invisible on those two pages. That is the subject's own sequencing — `job04` is
the job that rewrites the form, and the controls are back from there on.

## Job 06 — Carousel

The three carousel pictures are `assets/cafe-01.jpg`, `cafe-03.jpg` and
`cafe-05.jpg`. The `assets` folder holds five images in total because the page
cards use the other two.

The component is initialised with `M.Carousel.init()` — without that call it is
just a stack of images. Two floating buttons call `prev()` and `next()`, and a
`setInterval` advances it every four seconds, paused on mouse hover.

## Credits

- `jour06/*/papillon.jpg` — Wikimedia Commons,
  [Papilio machaon Mitterbach 01](https://commons.wikimedia.org/wiki/File:Papilio_machaon_Mitterbach_01.jpg)
- `jour07/job05/assets/`, `jour07/job06/assets/` — Wikimedia Commons, cappuccino
  pictures
