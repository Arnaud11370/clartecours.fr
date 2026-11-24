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

**Fin de session : toujours arrêter le serveur Astro** (`pnpm dev`, `pnpm preview`) démarré pendant la session, pour ne pas laisser le port occupé.

## Architecture

```
src/
  layouts/BaseLayout.astro     Gabarit unique de toutes les pages : <head>, header, footer, éléments fixes, scripts communs
  components/
    tracking/GtmHead.astro     Script GTM (Stape) : TOUJOURS le premier enfant du <head>
    tracking/GtmNoscript.astro Iframe GTM noscript, juste après <body>
    Header.astro               En-tête + menu (alimenté par NAV, masqué avec nav={false})
    HeaderEpure.astro          En-tête des landing épurées : logo non cliquable, menu d'ancres (`menuEpure`, hamburger sur mobile) et bouton de réservation
    Footer.astro               Pied de page : icônes sociales + boutons des pages légales
    SocialLinks.astro          Rangée d'icônes sociales du pied de page
    SocialIcon.astro           Icônes SVG des réseaux sociaux (instagram, tiktok, youtube, linkedin)
    CallBar.astro              Barre d'appel fixe en bas d'écran (variante `mobile` pour les landing épurées)
    AgendaCalendly.astro       Agenda Calendly (iframe unique, plein écran via [data-calendly]) ; `differe` = chargé à la demande
    Avis.astro                 Carte d'un avis écrit (données dans data/avis.ts)
    Emilie.astro               Bouton + panneau de l'assistante IA (markup + script)
    LegalDialogs.astro         Mentions légales, CGV, confidentialité (<dialog>)
    Divider.astro              Séparateur décoratif entre deux sections
    sections/                  Sections de page partagées par l'accueil et les landing pages (markup + script + style)
      Hero, Preuves, Methode, Temoignages, Etapes, Offres, QuiJeSuis, Defi, PourQui, Faq, Contact
  data/site.ts                 Source unique : coordonnées, domaine (SITE.url), Calendly (CALENDLY_EMBED), liens d'avis, ID GTM, réseaux sociaux (SOCIALS), menu (NAV)
  data/avis.ts                 Avis écrits, résultats (Angélina, Gabin) et citations de parents, mot pour mot
  data/mini-groupe.ts          Offre mini-groupe : taille, niveaux, durées, PRIX, forfaits dégressifs (source unique)
  scripts/site.ts              JS commun à toutes les pages
  scripts/suivi-landing.ts     Événements dataLayer `lp_*` des landing pages (entonnoir de réservation)
  styles/global.css            Styles globaux (tokens, thème clair uniquement, composants)
  pages/index.astro            Page d'accueil (une page = un fichier dans src/pages/)
  pages/brevet.astro           Landing page pub collège (4ème, 3ème) : sans menu, noindex
  pages/lycee.astro            Landing page pub lycée (Seconde, Première) : sans menu, noindex, sans l'Académie
  pages/cours-particuliers.astro         Landing Google Ads « mini-groupe » : gabarit épuré, prix affichés, INDEXABLE
public/                        Fichiers servis tels quels : fonts/, img/, robots.txt, temoignages-videos.json
netlify/
  functions/coach.mjs          API /api/coach (proxy vers l'API Claude, clé côté serveur)
  shared/coachs.js             Personnalité et règles d'Émilie (NON publié sur le site)
netlify.toml                   Build Netlify : pnpm build → dist/
```

### Le layout

`BaseLayout` accepte `title`, `description`, `ogTitle`, `ogDescription`, `ogImage` (valeurs par défaut dans `SITE`), `nav` (`false` : en-tête sans menu, pour les landing pages), `epure` (`true` : en-tête `HeaderEpure` avec bouton de réservation et menu d'ancres facultatif `menuEpure`, pied de page légal seul, barre de réservation mobile vers `#reserver`, sans Émilie, sans téléphone ni WhatsApp) et trois points d'insertion :

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
- **Numéros de téléphone : toujours affichés en chiffres**, jamais remplacés par un libellé (« Appelez-moi », « Téléphone »…) : `<a href={`tel:${SITE.phone.tel}`}>{SITE.phone.display}</a>`. Google Ads remplace le numéro affiché par son numéro de transfert pour suivre les appels : sans numéro visible dans la page, ce suivi ne fonctionne plus. Exception voulue : `/cours-particuliers` n'affiche ni téléphone ni WhatsApp (seule conversion : la réservation Calendly).
- Le suivi des réservations Calendly (inline et popup) est géré dans GTM : ne rien ajouter côté site.
- Landing pages : `scripts/suivi-landing.ts` pousse en plus des événements d'entonnoir (`lp_cta_clic`, `lp_agenda_vu`, `lp_agenda_affiche`, `lp_creneau_choisi`) avec `landing_id`. Ils ne remplacent pas les conversions GTM existantes.

### DRY

- Toute info répétée (email, téléphone, WhatsApp, Calendly, menu, ID GTM) vient de `src/data/site.ts`. Ne jamais la recopier en dur : `href={`mailto:${SITE.email}`}`, `href={`tel:${SITE.phone.tel}`}`, `href={SITE.whatsapp}`.
- **Tous** les liens vers les réseaux sociaux (Instagram, TikTok, YouTube, LinkedIn) passent par `SOCIALS` : `href={SOCIALS.youtube.href}`, `{SOCIALS.youtube.handle}`. Icônes via `<SocialIcon name={SOCIALS.youtube.icon} />` ; `icons: true` les affiche dans la rangée d'icônes `<SocialLinks />` du pied de page ; le `sameAs` du JSON-LD est généré automatiquement. Nouveau réseau = une entrée dans `SOCIALS` + son SVG dans `SocialIcon.astro`.
- Liens vers les avis : `SITE.avis.google` (fiche Google Maps) et `SITE.avis.superprof`. Ne pas utiliser le lien Google « laisser un avis » (`g.page/r/…/review`) pour montrer les avis.
- Un bloc présent sur plusieurs pages devient un composant dans `src/components/`. Un bloc utilisé sur une seule page reste dans la page.
- Header, footer, Émilie, barre d'appel et pages légales sont déjà dans le layout : ne pas les remettre dans une page.

### Liens et chemins

- Chemins d'assets **absolus** depuis `public/` : `/img/portrait.jpg`, `/fonts/…`, `fetch('/temoignages-videos.json')`.
- Liens vers des sections de l'accueil depuis un composant partagé : `/#contact`, pas `#contact`. Une ancre seule (`#contact`) n'est acceptable qu'à l'intérieur de la page qui contient la section, ce qui inclut les composants de `components/sections/` (toujours utilisés avec `<Contact />` sur la même page).

### Scripts

- Par défaut, `<script>` sans attribut : Astro le bundle en module (TypeScript, dédoublonné, mis en cache entre pages). La logique va dans `src/scripts/*.ts` ou dans le composant qu'elle pilote (comme `Emilie.astro`).
- `is:inline` seulement pour les scripts qui doivent rester tels quels (GTM, scripts tiers comme Calendly, JSON-LD). Pour passer une valeur serveur à un script inline : `define:vars`.
- Le code commun ne doit pas planter quand un élément manque sur une page : tester l'existence (`if (el)`) avant d'agir (voir `scripts/site.ts`).
- Pas de framework front : JS natif, amélioration progressive, respect de `prefers-reduced-motion`.

### Styles

- Les couleurs passent **toujours** par les tokens CSS (`--ink`, `--paper`, `--gold`, `--card`, `--rule`, `--deep`…), dérivés de 3 teintes de base `--p-ink`, `--p-gold`, `--p-margin`. Pas de couleur en dur : une palette se change en modifiant ces 3 teintes. Le site est volontairement en thème clair uniquement (le mode sombre a été retiré, il rendait mal) : ne pas le réintroduire.
- Polices : `--display` (Gloock, titres), `--body` (Figtree, texte), `--hand` (Caveat, annotations manuscrites).
- `global.css` contient des couches de surcharges successives (« V3 », « V7 »…) : l'ordre des règles compte. Pour du style propre à un nouveau composant, préférer un `<style>` scopé dans le `.astro` plutôt que d'allonger `global.css`.
- Tester à 375 px de large (mobile).

### Clean code

- Un fichier = une responsabilité. Composants courts, nommés en PascalCase ; scripts et données en camelCase/kebab-case.
- Commentaire d'en-tête d'une ligne dans chaque composant pour dire à quoi il sert ; commentaires en français, sur le *pourquoi* plutôt que le *quoi*.
- Pas de code mort ni de doublons : avant d'écrire une fonction utilitaire, vérifier qu'elle n'existe pas déjà.
- Toute donnée insérée en `innerHTML` est échappée (`esc()`), notamment les réponses d'Émilie et les données de `temoignages-videos.json`.
- Garder des changements visuellement neutres quand la demande est technique : vérifier le rendu avant/après.

## Landing pages et tarifs

- Une landing page = un fichier dans `src/pages/` qui assemble les composants de `components/sections/` avec ses propres textes (props du `Hero`, `palier` de `Methode`, `objectif` de `PourQui`, `academie={false}` pour retirer l'Académie). Elle passe `nav={false}` au layout et `<meta slot="head" name="robots" content="noindex">` pour ne pas concurrencer l'accueil sur Google.
- Offres : la section « Ce que je propose » (`Offres`) présente toutes les offres (Académie, cours particuliers, accompagnement sur 12 semaines, stages) en cartes identiques, sans aucun prix. Une offre = une entrée dans le tableau `cartes`.
- Tarifs : **aucun prix affiché sur le site**. La FAQ (`Combien ça coûte ?`) renvoie vers l'appel diagnostic, où Arnaud communique le tarif par écrit (comme le prévoient les CGV).
- **Exception : `/cours-particuliers`** (demande explicite pour le trafic Google Ads « prix cours de maths »). Ses prix, durées et forfaits viennent uniquement de `src/data/mini-groupe.ts` : badge « Dès … », titre, cartes, FAQ et économies des forfaits sont calculés, jamais écrits en dur. Les valeurs marquées `TODO(Arnaud)` attendent sa validation.
- Landing épurée (`epure`) : la section de réservation a l'id `#reserver` et contient `<AgendaCalendly differe utmContent="…" />` ; les boutons portent `data-calendly`, `href="#reserver"` et `data-emplacement` (suivi).

## Réservation (Calendly)

- C'est la conversion principale de la page d'accueil, qui sert de landing page aux campagnes Meta et Google Ads.
- Tout bouton de réservation porte `data-calendly` avec `href="/#contact"` (ou `#contact` dans la page d'accueil, `#reserver` dans une landing épurée) : le script d'`AgendaCalendly.astro` affiche alors en plein écran l'agenda déjà chargé dans `#contact`. On ne crée jamais de seconde iframe (pas d'`initPopupWidget`) : l'agenda Calendly pèse ~3 Mo, le recharger au clic ajoutait plusieurs secondes d'attente. Sur une page sans `<Contact />`, le lien mène simplement à `/#contact`.
- L'iframe reste masquée derrière un placeholder (`.cal-wait`) jusqu'à ce que Calendly signale qu'il est affiché (`data-pret`).
- Bloc `#contact` : pas de lien qui fasse quitter la page (réseaux sociaux, email, avis) à côté de l'agenda ; seuls le téléphone et WhatsApp restent, en secondaire.

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
