# Clarté · site vitrine

Site de cours de maths d'Arnaud (Académie Clarté). Site statique **Astro**, hébergé sur **Netlify**, avec une fonction serverless pour l'assistante IA « Émilie ». Tout le contenu et le code sont en français (textes, commentaires, noms de variables métier).

## Commandes

Gestionnaire de paquets : **pnpm uniquement** (version fixée par `packageManager` dans `package.json`). Ne jamais utiliser npm ou yarn : seul `pnpm-lock.yaml` est commité.

```bash
pnpm install      # installer les dépendances
pnpm dev          # serveur local : http://localhost:4321
pnpm build        # génère dist/ (ce que Netlify publie)
pnpm preview      # sert dist/ en local
pnpm add <pkg>    # ajouter une dépendance (-D pour une dépendance de dev)
```

Node ≥ 22.23.4 requis par Astro 7 (Netlify : `NODE_VERSION = "24"` dans `netlify.toml`).

## Architecture

```
src/
  layouts/BaseLayout.astro     Gabarit unique de toutes les pages : <head>, header, footer, éléments fixes, scripts communs
  components/
    tracking/GtmHead.astro     Script GTM (Stape) : TOUJOURS le premier enfant du <head>
    tracking/GtmNoscript.astro Iframe GTM noscript, juste après <body>
    Header.astro               En-tête + menu (alimenté par NAV)
    Footer.astro               Pied de page + boutons des pages légales
    CallBar.astro              Barre d'appel fixe en bas d'écran
    Emilie.astro               Bouton + panneau de l'assistante IA (markup + script)
    LegalDialogs.astro         Mentions légales, CGV, confidentialité (<dialog>)
  data/site.ts                 Source unique : coordonnées, Calendly, ID GTM, menu (NAV)
  scripts/site.ts              JS commun à toutes les pages
  scripts/home.ts              JS propre à la page d'accueil
  styles/global.css            Styles globaux (tokens, thèmes clair/sombre, composants)
  pages/index.astro            Page d'accueil (une page = un fichier dans src/pages/)
public/                        Fichiers servis tels quels : fonts/, img/, robots.txt, temoignages-videos.json
netlify/
  functions/coach.mjs          API /api/coach (proxy vers l'API Claude, clé côté serveur)
  shared/coachs.js             Personnalité et règles d'Émilie (NON publié sur le site)
netlify.toml                   Build Netlify : pnpm build → dist/
```

### Le layout

`BaseLayout` accepte `title`, `description`, `ogTitle`, `ogDescription`, `ogImage` (valeurs par défaut dans `SITE`) et trois points d'insertion :

- slot par défaut : contenu placé dans `<main>` ;
- `slot="head"` : balises `<head>` spécifiques à la page ;
- `slot="after-main"` : dialogs, scripts tiers et scripts propres à la page (rendus dans `<body>`, après les éléments fixes).

Nouvelle page :

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Stages · Clarté" description="…">
  <section class="wrap" id="…">…</section>

  <Fragment slot="after-main">
    <script>
      import "../scripts/ma-page.ts";
    </script>
  </Fragment>
</BaseLayout>
```

## Règles à respecter

### Tracking (GTM)

- `<GtmHead />` reste **le premier élément du `<head>`** dans `BaseLayout`. Ne rien insérer avant.
- Le script GTM est en `is:inline` : ne pas le reformater ni le faire passer par le bundler.
- Ne jamais réécrire un `<head>` dans une page : toute page passe par `BaseLayout`.
- Classes de suivi GTM à conserver sur les liens : `email-link` (`mailto:`), `whatsapplink` (WhatsApp). Les numéros sont toujours des liens `tel:`.

### DRY

- Toute info répétée (email, téléphone, WhatsApp, Calendly, menu, ID GTM) vient de `src/data/site.ts`. Ne jamais la recopier en dur : `href={`mailto:${SITE.email}`}`, `href={`tel:${SITE.phone.tel}`}`, `href={SITE.whatsapp}`.
- Un bloc présent sur plusieurs pages devient un composant dans `src/components/`. Un bloc utilisé sur une seule page reste dans la page.
- Header, footer, Émilie, barre d'appel et pages légales sont déjà dans le layout : ne pas les remettre dans une page.

### Liens et chemins

- Chemins d'assets **absolus** depuis `public/` : `/img/portrait.jpg`, `/fonts/…`, `fetch('/temoignages-videos.json')`.
- Liens vers des sections de l'accueil depuis un composant partagé : `/#contact`, pas `#contact`. Une ancre seule (`#contact`) n'est acceptable qu'à l'intérieur de la page qui contient la section.

### Scripts

- Par défaut, `<script>` sans attribut : Astro le bundle en module (TypeScript, dédoublonné, mis en cache entre pages). La logique va dans `src/scripts/*.ts` ou dans le composant qu'elle pilote (comme `Emilie.astro`).
- `is:inline` seulement pour les scripts qui doivent rester tels quels (GTM, scripts tiers comme Calendly, JSON-LD). Pour passer une valeur serveur à un script inline : `define:vars`.
- Le code commun ne doit pas planter quand un élément manque sur une page : tester l'existence (`if (el)`) avant d'agir (voir `scripts/site.ts`).
- Pas de framework front : JS natif, amélioration progressive, respect de `prefers-reduced-motion`.

### Styles

- Les couleurs passent **toujours** par les tokens CSS (`--ink`, `--paper`, `--gold`, `--card`, `--rule`, `--deep`…), dérivés de 3 teintes de base `--p-ink`, `--p-gold`, `--p-margin`. Pas de couleur en dur qui casserait le mode sombre.
- Polices : `--display` (Gloock, titres), `--body` (Figtree, texte), `--hand` (Caveat, annotations manuscrites).
- `global.css` contient des couches de surcharges successives (« V3 », « V7 »…) : l'ordre des règles compte. Pour du style propre à un nouveau composant, préférer un `<style>` scopé dans le `.astro` plutôt que d'allonger `global.css`.
- Tester à 375 px de large (mobile) et en mode sombre.

### Clean code

- Un fichier = une responsabilité. Composants courts, nommés en PascalCase ; scripts et données en camelCase/kebab-case.
- Commentaire d'en-tête d'une ligne dans chaque composant pour dire à quoi il sert ; commentaires en français, sur le *pourquoi* plutôt que le *quoi*.
- Pas de code mort ni de doublons : avant d'écrire une fonction utilitaire, vérifier qu'elle n'existe pas déjà.
- Toute donnée insérée en `innerHTML` est échappée (`esc()`), notamment les réponses d'Émilie et les données de `temoignages-videos.json`.
- Garder des changements visuellement neutres quand la demande est technique : vérifier le rendu avant/après.

## Émilie (assistante IA)

- Front : `src/components/Emilie.astro` → `POST /api/coach`.
- Back : `netlify/functions/coach.mjs` ; instructions et réglages dans `netlify/shared/coachs.js` (c'est le fichier à modifier pour changer son comportement).
- Variables d'environnement Netlify : `ANTHROPIC_API_KEY` (obligatoire), `CODES_PARENTS`, `MODELE` (facultatives).
- `data-live="1"` sur `<html>` active les vraies réponses ; sans lui, réponse factice d'aperçu.
- La clé API ne doit jamais apparaître côté client.

## Contenu dynamique

- Témoignages vidéo : ajouter une entrée dans `public/temoignages-videos.json` (`nom`, `video` = URL YouTube ou Shorts, `classe`, `legende` facultative). Aucun code à modifier.

## Git

- Ne jamais commiter : `.env*` (sauf `.env.example`), `node_modules/`, `dist/`, `.astro/`, `.netlify/`, lockfiles autres que pnpm. Voir `.gitignore`.
- Les secrets (clé API Anthropic…) vivent uniquement dans les variables d'environnement Netlify ou un `.env` local.

## À faire

- Renseigner `site` dans `astro.config.mjs` (domaine de production) pour que `og:image` soit une URL absolue.
