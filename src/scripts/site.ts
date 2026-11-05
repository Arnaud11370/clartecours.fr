// Comportements communs à toutes les pages (chargé par BaseLayout).

document.documentElement.removeAttribute('data-palette');

/* Barre d'appel : cachée quand la section contact est à l'écran */
const cb = document.getElementById('callbar');
const contact = document.getElementById('contact');
if (cb && contact && 'IntersectionObserver' in window) {
  new IntersectionObserver(function (es) { es.forEach(function (e) { cb.classList.toggle('away', e.isIntersecting); }); }, { threshold: .15 }).observe(contact);
}

/* Pages légales (et toute fenêtre ouverte par un bouton [data-open]) */
document.querySelectorAll<HTMLElement>('[data-open]').forEach(function (b) {
  b.addEventListener('click', function () {
    const d = document.getElementById(b.dataset.open!) as HTMLDialogElement | null;
    if (!d) return;
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
  });
});
document.querySelectorAll<HTMLDialogElement>('.legal').forEach(function (d) {
  d.querySelector('[data-close]')!.addEventListener('click', function () { d.close ? d.close() : d.removeAttribute('open'); });
  d.addEventListener('click', function (e) { if (e.target === d && d.close) d.close(); });
});

/* Animations à l'apparition (.in) et compteurs [data-to] */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement; io.unobserve(el);
      if (!el.dataset.to) { el.classList.add('in'); return; }
      const to = +el.dataset.to, suf = el.dataset.suf || '';
      let t0: number | null = null;
      if (!to) return;
      function step(t: number) { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / 1200); const v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = v + suf; if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }, { threshold: .4 });
  document.querySelectorAll('.gap,.mark,.divider,.doodle,.polas,.week,.tl,[data-to]').forEach(function (el) { io.observe(el); });
}

/* Symboles mathématiques flottants dans chaque section */
(function () {
  const syms = ['π', '√', 'x²', '∑', '÷', '≈', '∞', '%', 'a/b', 'Δ', '∫', '≠', '3x', 'θ', '±', '½'];
  let seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  document.querySelectorAll('section.wrap').forEach(function (sec, i) {
    for (let k = 0; k < 2; k++) {
      const s = document.createElement('span'); s.className = 'deco'; s.setAttribute('aria-hidden', 'true');
      s.textContent = syms[(i * 3 + k) % syms.length];
      const side = k % 2 ? (88 + rnd() * 8) : (rnd() * 8);
      s.style.left = side + '%'; s.style.top = (k === 2 ? 82 + rnd() * 12 : 2 + rnd() * 10) + '%';
      s.style.fontSize = (1.4 + rnd() * 1.6) + 'rem'; s.style.animationDelay = (-rnd() * 14) + 's';
      if (k === 2) s.style.left = (30 + rnd() * 40) + '%';
      sec.insertBefore(s, sec.firstChild);
    }
  });
})();

/* Barre de lecture sous le header */
const bar = document.getElementById('progress');
if (bar) {
  const prog = function () { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; };
  addEventListener('scroll', prog, { passive: true }); prog();
}
