// Serveur d'Émilie, l'assistante IA Clarté (fonction Netlify).
// Il garde la clé API à l'abri, vérifie le code d'accès éventuel et choisit les instructions d'Émilie.
// Variables à régler dans Netlify (Site configuration > Environment variables) :
//   ANTHROPIC_API_KEY  ta clé API Claude (console.anthropic.com)
//   CODES_PARENTS      facultatif : codes parents. Vide = Émilie ouverte à tous les visiteurs
//   MODELE             facultatif : modèle Claude (par défaut claude-sonnet-5-5)
import "../../site/coachs.js";

const { COACHS, systeme } = globalThis.ClarteCoachs;

const MAX_MESSAGES = 16;      // historique envoyé à l'IA
const MAX_CARACTERES = 4000;  // par message

const liste = (v) => (v || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default async (req) => {
  const codesParents = liste(process.env.CODES_PARENTS);

  if (req.method !== "POST") return json(405, { erreur: "Méthode non autorisée." });

  let corps;
  try { corps = await req.json(); } catch { return json(400, { erreur: "Requête illisible." }); }

  const { coach, code, messages } = corps || {};
  const def = COACHS[coach];
  if (!def) return json(400, { erreur: "Coach inconnu." });

  // Code d'accès (seulement si CODES_PARENTS est rempli)
  const c = String(code || "").trim().toUpperCase();
  if (codesParents.length && !codesParents.includes(c)) return json(401, { erreur: "Code d'accès invalide. Demandez votre code à Arnaud." });
  if (!Array.isArray(messages) || !messages.length) return json(400, { erreur: "Message vide." });

  // Nettoyage de la conversation : rôles et longueur
  const propres = [];
  for (const m of messages.slice(-MAX_MESSAGES)) {
    const role = m?.role === "assistant" ? "assistant" : "user";
    const texte = String(m?.text || "").slice(0, MAX_CARACTERES);
    if (texte) propres.push({ role, content: [{ type: "text", text: texte }] });
  }
  while (propres.length && propres[0].role !== "user") propres.shift();
  if (!propres.length || propres[propres.length - 1].role !== "user") return json(400, { erreur: "Message vide." });

  if (!process.env.ANTHROPIC_API_KEY) return json(500, { erreur: "Le coach n'est pas encore configuré (clé API manquante)." });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.MODELE || "claude-sonnet-5-5",
        max_tokens: 1500,
        system: systeme(coach),
        messages: propres,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("API Claude", r.status, JSON.stringify(data).slice(0, 500));
      if (r.status === 429 || r.status === 529) return json(503, { erreur: "Le coach est très sollicité, réessaie dans une minute." });
      return json(502, { erreur: "Le coach n'a pas pu répondre. Réessaie dans un instant." });
    }
    const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    return json(200, { reply: reply || "Je n'ai pas réussi à répondre, peux-tu reformuler ?" });
  } catch (e) {
    console.error(e);
    return json(502, { erreur: "Le coach n'a pas pu répondre. Réessaie dans un instant." });
  }
};

export const config = { path: "/api/coach" };
