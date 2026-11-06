// Informations communes à tout le site : à modifier ici une seule fois.
export const SITE = {
  name: "Clarté",
  title: "Clarté · Cours de maths avec Arnaud",
  description:
    "Cours de maths en ligne de la 4ème à la Première. Votre enfant comprend en classe mais bloque seul ? Appel diagnostic offert avec Arnaud, fondateur de Clarté.",
  ogImage: "/img/portrait.jpg",
  email: "contact@clartecours.fr",
  phone: { display: "06 62 71 71 43", tel: "0662717143", intl: "+33662717143" },
  whatsapp: "https://wa.me/33662717143",
  calendly: "https://calendly.com/comprendrepourmieuxexpliquer/30min",
  gtm: { id: "GTM-NVLWXKBS", domain: "https://internal.clartecours.fr" },
  // Pages où lire les avis (et non le lien Google « laisser un avis »)
  avis: {
    google: "https://maps.app.goo.gl/t4XjapJY7zKGx6hg6",
    superprof: "https://www.superprof.fr/comprendre-mathematiques-possible-accompagnement-personnalise-2nde-objectif-brevet-orientation.html",
  },
};

// Agenda Calendly tel qu'affiché sur le site (intégré dans #contact et en popup via [data-calendly])
export const CALENDLY_EMBED = `${SITE.calendly}?hide_gdpr_banner=1&primary_color=b8862e`;

// Réseaux sociaux : source unique de TOUS les liens sociaux du site (pied de page, page d'accueil, sameAs du JSON-LD).
// `icon` correspond à un nom géré par SocialIcon.astro ; `icons: true` = affiché dans les rangées d'icônes (SocialLinks.astro : pied de page, bloc contact).
export const SOCIALS = {
  instagram: { label: "Instagram", href: "https://www.instagram.com/clartecours.fr", handle: "@clartecours.fr", icon: "instagram", icons: true },
  tiktok: { label: "TikTok", href: "https://www.tiktok.com/@clarte_arnaud", handle: "@clarte_arnaud", icon: "tiktok", icons: true },
  youtube: { label: "YouTube", href: "https://www.youtube.com/@clarte-arnaud", handle: "@clarte-arnaud", icon: "youtube", icons: true },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/arnaud-amador-clarte", handle: "Arnaud, Clarté", icon: "linkedin", icons: false },
} as const;

export type SocialIconName = (typeof SOCIALS)[keyof typeof SOCIALS]["icon"];

// Navigation principale (ancres de la page d'accueil, préfixées par "/" pour fonctionner depuis toutes les pages)
export const NAV = [
  { href: "/#methode", label: "Méthode" },
  { href: "/#temoignages", label: "Témoignages" },
  { href: "/#offres", label: "Ce que je propose" },
  { href: "/#qui", label: "Qui je suis" },
  { href: "/#defi", label: "Défi" },
  { href: "/#faq", label: "FAQ" },
];
