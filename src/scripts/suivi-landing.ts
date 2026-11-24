// Événements dataLayer des landing pages (lus par GTM) pour suivre l'entonnoir : clic sur un bouton, agenda vu, agenda affiché, créneau choisi.
// La conversion « RDV Calendly » reste gérée par GTM comme sur l'accueil.

type Donnees = Record<string, string>;

export function suivreLanding(landingId: string) {
  const w = window as unknown as { dataLayer?: object[] };
  const pousser = function (event: string, donnees: Donnees = {}) {
    (w.dataLayer = w.dataLayer || []).push({ event, landing_id: landingId, ...donnees });
  };

  /* Agenda vu une première fois : en plein écran (bouton) ou en arrivant sur la section de réservation */
  let vu = false;
  const agendaVu = function (mode: string) {
    if (vu) return;
    vu = true;
    pousser('lp_agenda_vu', { agenda_mode: mode });
  };

  /* Clics sur les boutons de réservation : chacun porte data-emplacement (en-tete, hero, pourquoi, tarifs, demarrer, barre-fixe) */
  document.addEventListener('click', function (e) {
    const lien = (e.target as Element).closest<HTMLAnchorElement>('a[data-calendly][data-emplacement]');
    if (!lien) return;
    pousser('lp_cta_clic', { cta_emplacement: lien.dataset.emplacement! });
    agendaVu('plein-ecran');
  });

  const agenda = document.getElementById('calendly-embed');
  if (agenda && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (es) {
      if (!es.some(function (x) { return x.isIntersecting; })) return;
      io.disconnect();
      agendaVu('section');
    }, { threshold: .3 });
    io.observe(agenda);
  }

  /* Messages envoyés par l'iframe Calendly (la réservation elle-même est suivie par GTM) */
  let affiche = false;
  addEventListener('message', function (e) {
    if (e.origin !== 'https://calendly.com' || !e.data || typeof e.data.event !== 'string') return;
    if (e.data.event === 'calendly.event_type_viewed' && !affiche) { affiche = true; pousser('lp_agenda_affiche'); }
    if (e.data.event === 'calendly.date_and_time_selected') pousser('lp_creneau_choisi');
  });
}
