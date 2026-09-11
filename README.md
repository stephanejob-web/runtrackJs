# runtrackJs — Jour 6 : Bootstrap

Bootstrap 5 and jQuery exercises, one folder per job.

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

## Credit

`papillon.jpg` comes from Wikimedia Commons
([Papilio machaon Mitterbach 01](https://commons.wikimedia.org/wiki/File:Papilio_machaon_Mitterbach_01.jpg)).
