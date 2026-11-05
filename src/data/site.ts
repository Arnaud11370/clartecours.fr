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
};

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
  { href: "/#defi", label: "Défi" },
  { href: "/#offres", label: "Formules" },
  { href: "/#stages", label: "Stages" },
  { href: "/#qui", label: "Qui je suis" },
  { href: "/#faq", label: "FAQ" },
];
