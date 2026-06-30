/* ================================================================
   script.js — La Petite Hurghadienne
   ✏️  Ce fichier gère les animations et interactions du site.
       Tu n'as normalement PAS besoin de modifier ce fichier.
   ================================================================ */

/* ─── Navigation : fond bleu au scroll ─── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── Menu mobile ─── */
function openMenu()  { document.getElementById('mobileMenu').classList.add('open'); }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

/* ─── Particules dorées dans le Hero ─── */
const container = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const s = document.createElement('span');
  s.style.left            = Math.random() * 100 + '%';
  s.style.top             = Math.random() * 100 + '%';
  s.style.animationDelay  = Math.random() * 6 + 's';
  s.style.animationDuration = (4 + Math.random() * 4) + 's';
  container.appendChild(s);
}

/* ─── Animation d'apparition au scroll ─── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
