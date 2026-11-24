// Offre « cours de maths en mini-groupe » : SOURCE UNIQUE des prix et paramètres affichés sur /cours-particuliers.
// Téléphone, WhatsApp et Calendly restent dans site.ts. Tout ce qui est marqué TODO(Arnaud) attend sa validation.

export interface NiveauMiniGroupe {
  id: string;
  libelle: string;
  /** Durée d'une séance, en minutes */
  duree: number;
  /** Prix d'une séance à l'unité, en euros */
  prix: number;
}

export interface Forfait {
  /** Nombre de séances du forfait */
  seances: number;
  /** Prix PAR SÉANCE dans ce forfait, pour chaque niveau (clé = id du niveau). Un niveau absent n'affiche pas ce forfait. */
  prixSeance: Record<string, number>;
}

export const MINI_GROUPE = {
  /** Identifiant de la landing : utm_content par défaut envoyé à Calendly et `landing_id` des événements dataLayer */
  suivi: "landing-mini-groupe",
  route: "/cours-particuliers",
  eleves: { min: 3, max: 4 },
  frequence: "Chaque semaine",
  // Durée et prix d'une séance par niveau.
  niveaux: [
    { id: "quatrieme", libelle: "4ème", duree: 60, prix: 45 },
    { id: "troisieme-lycee", libelle: "3ème · Seconde · Première", duree: 90, prix: 60 },
  ] as NiveauMiniGroupe[],
  // TODO(Arnaud) : forfaits dégressifs inconnus. Exemple de saisie :
  //   { seances: 10, prixSeance: { quatrieme: 42, "troisieme-lycee": 56 } }
  // Liste vide : la page affiche l'encart « Tarif dégressif » ; renseignée : la grille et les économies apparaissent (calculées, jamais saisies).
  forfaits: [] as Forfait[],
  // TODO(Arnaud) : les groupes sont-ils constitués par niveau (même classe) ?
  // true : pastille « Élèves du même niveau » + question de la FAQ affichées. null : non confirmé, rien n'est affiché.
  groupesParNiveau: null as boolean | null,
};

const nombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** 45 → « 45 € » (espace insécable) */
export function euros(montant: number) {
  return `${nombre.format(montant)} €`;
}

/** 90 → « 1 h 30 » */
export function formatDuree(minutes: number) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

/** Prix d'appel du badge « Dès … la séance » : la séance la moins chère, forfaits compris */
export const prixMin = Math.min(
  ...MINI_GROUPE.niveaux.map((n) => n.prix),
  ...MINI_GROUPE.forfaits.flatMap((f) => Object.values(f.prixSeance)),
);

const durees = MINI_GROUPE.niveaux.map((n) => n.duree);
/** « 1 h à 1 h 30 » (ou « 1 h » si toutes les séances ont la même durée) */
export const plageDurees = Math.min(...durees) === Math.max(...durees)
  ? formatDuree(durees[0])
  : `${formatDuree(Math.min(...durees))} à ${formatDuree(Math.max(...durees))}`;

/** « 3 à 4 élèves » */
export const tailleGroupe = `${MINI_GROUPE.eleves.min} à ${MINI_GROUPE.eleves.max} élèves`;

/** Forfaits proposés pour un niveau, avec l'économie par rapport aux séances à l'unité */
export function forfaitsDuNiveau(niveau: NiveauMiniGroupe) {
  return MINI_GROUPE.forfaits
    .filter((f) => f.prixSeance[niveau.id] !== undefined)
    .sort((a, b) => a.seances - b.seances)
    .map((f) => ({
      seances: f.seances,
      prixSeance: f.prixSeance[niveau.id],
      economie: (niveau.prix - f.prixSeance[niveau.id]) * f.seances,
    }));
}
