// Avis et résultats publiés sur le site, mot pour mot : source unique pour l'accueil, les landing pages et la page mini-groupe.

export interface Avis {
  categorie: "famille" | "eleve";
  initiale: string;
  nom: string;
  role: string;
  texte: string;
}

export const AVIS: Avis[] = [
  { categorie: "famille", initiale: "I", nom: "Isabelle", role: "maman · préparation au brevet",
    texte: "Nous recommandons Arnaud, jeune professeur qui accompagne ma fille de 15 ans pour le brevet, avec beaucoup de sérieux et de bienveillance. Il a su mettre en place un récapitulatif systématique sur feuille blanche, ce qui lui permet de vérifier les acquis, de structurer les notions et de consolider les révisions de manière très efficace. Pour nous, d'avoir un retour sur la séance, sa gentillesse, sa patience et sa pédagogie mettent ma fille en confiance. Elle apprécie sincèrement les moments d'accompagnement et progresse avec plus de sérénité." },
  { categorie: "eleve", initiale: "S", nom: "Sara", role: "élève de Première · spé maths",
    texte: "Mes parents et moi avons décidé de faire appel à un professeur de maths afin de m'aider à rattraper mon retard. Arnaud est très pédagogue et comprend rapidement mes besoins. Il adapte ses explications en fonction de mes difficultés, ce qui m'aide à mieux comprendre les notions travaillées. Je me sens déjà mieux accompagnée dans mon travail." },
  { categorie: "famille", initiale: "G", nom: "Famille de Gabin", role: "Première · spé maths",
    texte: "Gabin avait pris du retard sur certains chapitres de la spécialité mathématiques. Il avait du mal à comprendre les notions et surtout à les appliquer aux exercices. Donc il ne se sentait pas prêt pour l'épreuve. Ce qui a bien marché, c'est que tu sois très à l'écoute de ses besoins, et surtout la façon d'aller à l'essentiel. Il a obtenu la note de 12 alors qu'il pensait avant tes cours avoir 8/9. Il a repris tes explications et cela lui a permis de travailler plus sereinement." },
  { categorie: "famille", initiale: "O", nom: "Océane", role: "maman",
    texte: "Parfait ! Professeur très à l'écoute, professionnel et accessible. Il propose des méthodes modernes, s'adapte au niveau de mon fils et met en place une approche pédagogique efficace pour l'aider à progresser. Son travail est réfléchi et ses explications sont toujours claires. Il sait également tenir compte des difficultés que rencontre mon fils, prendre le temps de réexpliquer si nécessaire et instaurer un climat de confiance. Une excellente pédagogie et un accompagnement de qualité. Je recommande fortement." },
  { categorie: "eleve", initiale: "C", nom: "Charline", role: "élève de Première · maths tronc commun",
    texte: "Je suis une élève de première générale avec maths en tronc commun, et j'ai commencé les cours particuliers à quelques semaines des épreuves. Honnêtement, ça m'a vraiment aidée à tout remettre à niveau sur les chapitres de l'année. Arnaud explique très bien, de façon claire et structurée, ce qui permet de comprendre même les notions les plus compliquées. Il prend le temps de revenir sur les points non compris sans jamais mettre de pression, ce qui rend les séances très agréables et efficaces. La méthode de travail est très bonne : les exercices sont bien choisis, progressifs et adaptés à mon niveau. Tout est bien organisé, et les supports et documents envoyés sont propres et utiles pour réviser ensuite. Grâce à cet accompagnement, je me sens beaucoup plus en confiance en mathématiques à l'approche du bac. Je recommande vivement Arnaud." },
  { categorie: "eleve", initiale: "L", nom: "Louise", role: "élève",
    texte: "Parfait ! Le cours était très bien organisé et cela m'a permis de bien comprendre les notions et d'ensuite pouvoir m'exercer. C'était très intéressant !" },
  { categorie: "famille", initiale: "C", nom: "Chantal", role: "grand-mère",
    texte: "Arnaud a été un super prof pendant les grandes vacances pour ma petite-fille, sa pédagogie et sa gentillesse l'ont beaucoup aidée pendant les 4 ans pour sa progression en maths." },
  { categorie: "famille", initiale: "C", nom: "Caroline", role: "maman de Juliette",
    texte: "Parfait ! Mon premier cours avec Arnaud s'est très bien déroulé, il est à l'écoute, calme et agréable." },
  { categorie: "eleve", initiale: "D", nom: "Dorian", role: "élève",
    texte: "Si vous avez des lacunes en maths ou pour du perfectionnement, c'est la meilleure personne à contacter. Explication, compréhension, il a tout." },
];

/** Résultats d'élèves mis en avant (note avant → après) */
export const RESULTATS = {
  angelina: { avant: "11", apres: "TB", titre: "Angélina, de 11/20 à la mention très bien au brevet, en un trimestre." },
  gabin: { avant: "8", apres: "12", titre: "Gabin pensait avoir 8 ou 9 à l'épreuve de spé maths. Il a obtenu 12." },
};

/** Ce que les parents disent souvent au premier contact */
export const CITATIONS_PARENTS = [
  "Il ne comprend pas quand il est seul.",
  "Les maths, c'est toujours la bagarre.",
  "Il stagne, alors qu'il travaille.",
];
