// Interactions propres à la page d'accueil (chargé par src/pages/index.astro).

/* Défi : trouve l'erreur */
const DEFIS = [
  {lvl:'4ème · Calcul littéral',prompt:'Développer et réduire A = 3(x + 4) − 2x',lines:['A = 3(x + 4) − 2x','A = 3x + 4 − 2x','A = x + 4'],bad:1,why:"Le 3 multiplie <b>tout</b> ce qu'il y a dans la parenthèse, donc aussi le 4.",fix:'A = 3x + 12 − 2x = x + 12'},
  {lvl:'4ème · Nombres relatifs',prompt:'Calculer B = −3 − (−5)',lines:['B = −3 − (−5)','B = −3 − 5','B = −8'],bad:1,why:"Soustraire un nombre, c'est ajouter son opposé : <b>− (−5)</b> devient <b>+ 5</b>.",fix:'B = −3 + 5 = 2'},
  {lvl:'4ème · Fractions',prompt:'Calculer C = 2/3 + 1/4',lines:['C = 2/3 + 1/4','C = (2 + 1) / (3 + 4)','C = 3/7'],bad:1,why:"On n'additionne <b>jamais</b> les dénominateurs : il faut d'abord les mettre au même dénominateur.",fix:'C = 8/12 + 3/12 = 11/12'},
  {lvl:'4ème · Pythagore',prompt:'ABC rectangle en A, AB = 3 cm, AC = 4 cm. Calculer BC.',lines:['BC² = AB² + AC²','BC² = 9 + 16 = 25','BC = 25 cm'],bad:2,why:"25, c'est <b>BC²</b>, pas BC. Il manque la racine carrée.",fix:'BC = √25 = 5 cm'}
];
let di = 0, firstTry = 0, tried = false, solved = false;
const dl = document.getElementById('d-lines')!, dfb = document.getElementById('d-fb')!, dnext = document.getElementById('d-next')!, dcta = document.getElementById('d-cta')!;
function showDefi(){
  const d = DEFIS[di]; tried = false; solved = false;
  document.getElementById('d-lvl')!.textContent = 'Niveau ' + d.lvl;
  document.getElementById('d-score')!.textContent = 'Défi ' + (di + 1) + ' / ' + DEFIS.length;
  document.getElementById('d-prompt')!.textContent = d.prompt;
  dl.innerHTML = ''; dnext.hidden = true; dcta.hidden = true;
  dfb.innerHTML = "Quelle ligne contient l'erreur ?";
  d.lines.forEach(function(t, i){
    const li = document.createElement('li'), b = document.createElement('button'); b.type = 'button'; b.textContent = t;
    b.addEventListener('click', function(){
      if(solved) return;
      if(i === d.bad){
        solved = true; if(!tried) firstTry++;
        b.classList.add('bad');
        dfb.innerHTML = '<b>Bien vu !</b> ' + d.why + '<br><span class="fix">' + d.fix + '</span>';
        if(di < DEFIS.length - 1){ dnext.hidden = false; } else {
          dfb.innerHTML += '<br><b>' + firstTry + ' / ' + DEFIS.length + '</b> trouvées du premier coup. Votre enfant hésite sur ce genre d\'erreur ? C\'est exactement ce qu\'on travaille ensemble.';
          dcta.hidden = false; dnext.hidden = false; dnext.textContent = 'Recommencer';
        }
      } else {
        tried = true; b.classList.remove('miss'); void b.offsetWidth; b.classList.add('miss');
        dfb.innerHTML = "Pas celle-ci : cette ligne est juste. Cherche encore.";
      }
    });
    li.appendChild(b); dl.appendChild(li);
  });
}
dnext.addEventListener('click', function(){
  if(di >= DEFIS.length - 1){ di = 0; firstTry = 0; dnext.textContent = 'Défi suivant'; } else di++;
  showDefi();
});
showDefi();

/* Onglets : semaine type / programme par niveau */
document.querySelectorAll('.tab').forEach(function(t){ t.addEventListener('click', function(){
  document.querySelectorAll('.tab').forEach(function(x){ const on = x === t; x.setAttribute('aria-selected', on ? 'true' : 'false'); document.getElementById(x.getAttribute('aria-controls')!)!.hidden = !on; });
}); });

/* Accroche tournante + cartes d'offres inclinées au survol */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window && !reduce){
  const rot = document.getElementById('rot')!, phrases = ["l'élève qui travaille mais stagne","celui qui comprend en classe et bloque seul","le collégien qui prépare le brevet","le lycéen en spé maths","les familles fatiguées de la bagarre des devoirs"];
  let ri = 0;
  setInterval(function(){ ri = (ri + 1) % phrases.length; rot.textContent = phrases[ri]; rot.classList.remove('swap'); void rot.offsetWidth; rot.classList.add('swap'); }, 3200);
  if(window.matchMedia('(hover: hover)').matches){
    document.querySelectorAll<HTMLElement>('.offer').forEach(function(c){
      c.addEventListener('mousemove', function(e){
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
      });
      c.addEventListener('mouseleave', function(){ c.style.transform = ''; });
    });
  }
}

/* Avis écrits : filtres, "voir tout", "lire la suite" */
type Card = HTMLElement & { _rm: HTMLButtonElement };
const cards = [].slice.call(document.querySelectorAll('#reviews .review')) as Card[], chips = document.querySelectorAll('.chip'), more = document.getElementById('showall')!;
let filter = 'all', expanded = false;
const LIMIT = window.matchMedia('(max-width:860px)').matches ? 99 : 6;
cards.forEach(function(c){
  const b = document.createElement('button'); b.type = 'button'; b.className = 'readmore'; b.textContent = 'Lire la suite'; b.hidden = true;
  b.addEventListener('click', function(){ const o = c.classList.toggle('open'); b.textContent = o ? 'Réduire' : 'Lire la suite'; });
  c.appendChild(b); c._rm = b;
});
function render(anim: boolean){
  let shown = 0;
  cards.forEach(function(c){
    const match = filter === 'all' || c.dataset.c === filter;
    const vis = match && (expanded || filter !== 'all' || shown < LIMIT);
    if(match && vis) shown++;
    const was = !c.hidden; c.hidden = !vis;
    if(vis && anim && !was){ c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
  });
  more.hidden = filter !== 'all' || expanded;
  requestAnimationFrame(function(){ cards.forEach(function(c){ if(c.hidden) return; const p = c.querySelector('p')!; c._rm.hidden = c.classList.contains('open') ? false : p.scrollHeight <= p.clientHeight + 2; }); });
}
chips.forEach(function(ch){ ch.addEventListener('click', function(){
  filter = (ch as HTMLElement).dataset.f!; chips.forEach(function(x){ x.setAttribute('aria-pressed', x === ch ? 'true' : 'false'); });
  cards.forEach(function(c){ c.hidden = true; }); render(true);
}); });
more.addEventListener('click', function(){ expanded = true; render(true); });
render(false);
window.addEventListener('resize', function(){ render(false); });

/* Témoignages vidéo : chargés depuis /temoignages-videos.json */
(function(){
  type Video = { nom: string; video: string; classe?: string; legende?: string };
  const box = document.getElementById('videos')!, btn = document.getElementById('showvideos')!;
  const dlg = document.getElementById('dlg-video') as HTMLDialogElement, frame = dlg.querySelector('.frame')!;
  /* Lecture sur place dans une modale ; l'iframe est retirée à la fermeture pour couper le son */
  function lire(v: Video, id: string, short: boolean){
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1" title="Témoignage vidéo de ' + esc(v.nom) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    dlg.classList.toggle('short', short);
    if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function fermer(){ if(dlg.close) dlg.close(); else { dlg.removeAttribute('open'); frame.innerHTML = ''; } }
  dlg.addEventListener('close', function(){ frame.innerHTML = ''; });
  dlg.querySelector('[data-close]')!.addEventListener('click', fermer);
  dlg.addEventListener('click', function(e){ if(e.target === dlg) fermer(); });
  function ytId(u: string){ const m = /(?:youtu\.be\/|shorts\/|[?&]v=)([\w-]{11})/.exec(u || ''); return m && m[1]; }
  function esc(s: unknown){ return String(s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'} as Record<string,string>)[c]; }); }
  function carte(v: Video){
    const id = ytId(v.video)!, short = /\/shorts\//.test(v.video), a = document.createElement('a');
    a.className = 'video' + (short ? ' short' : ''); a.href = v.video; a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'Témoignage vidéo de ' + v.nom + (v.classe ? ', élève de ' + v.classe : ''));
    const img = short
      ? '<img class="bg" src="https://i.ytimg.com/vi/' + id + '/oardefault.jpg" alt="" loading="lazy"><img class="fg" src="https://i.ytimg.com/vi/' + id + '/oardefault.jpg" alt="" loading="lazy">'
      : '<img class="fg" src="https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg" srcset="https://i.ytimg.com/vi/' + id + '/mqdefault.jpg 320w, https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg 1280w" sizes="(max-width:860px) 80vw, 380px" alt="" loading="lazy">';
    a.innerHTML = '<span class="thumb">' + img + (v.classe ? '<span class="badge">' + esc(v.classe) + '</span>' : '') + '<span class="play" aria-hidden="true"></span></span>'
      + '<span class="cap"><span class="who-v">' + esc(v.nom) + '</span><span>' + esc(v.legende || ('élève de ' + v.classe)) + '</span></span>';
    a.addEventListener('click', function(e){
      if(e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
      e.preventDefault(); lire(v, id, short);
    });
    /* miniature absente : YouTube renvoie une image grise de 120 px, on se rabat sur hqdefault */
    a.querySelectorAll('img').forEach(function(im){
      function repli(){ if(/hqdefault/.test(im.src)) return; im.removeAttribute('srcset'); im.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; }
      im.addEventListener('error', repli);
      im.addEventListener('load', function(){ if(im.naturalWidth <= 120) repli(); });
    });
    return a;
  }
  fetch('/temoignages-videos.json').then(function(r){ return r.json(); }).then(function(liste: Video[]){
    const cartes = liste.filter(function(v){ return ytId(v.video); }).map(carte);
    const LIM = window.matchMedia('(max-width:860px)').matches ? 99 : 6;
    cartes.forEach(function(c, i){ c.hidden = i >= LIM; box.appendChild(c); });
    if(cartes.length > LIM){ btn.textContent = 'Voir les ' + cartes.length + ' vidéos'; btn.hidden = false; }
    btn.addEventListener('click', function(){
      cartes.forEach(function(c){ if(c.hidden){ c.hidden = false; c.classList.add('pop'); } });
      btn.hidden = true;
    });
  }).catch(function(){});
})();
