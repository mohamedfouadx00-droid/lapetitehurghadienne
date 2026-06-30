// script.js

// Nav scroll
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu
function openMenu() { document.getElementById('mobileMenu').classList.add('open'); }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

// ─── LANGUAGE ───
let currentLang = localStorage.getItem('lang') || 'fr';

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
  // Mettre à jour les boutons actifs
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.style.opacity = btn.dataset.lang === lang ? '1' : '0.5';
  });
}

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // Mettre à jour le titre
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = dict.nav_reserver || 'La Petite Hurghadienne';

  // Parcourir tous les éléments avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });
}

// Appliquer la langue au chargement
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lang') || 'fr';
  applyTranslations(saved);
  // Mettre à jour l'état des boutons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.style.opacity = btn.dataset.lang === saved ? '1' : '0.5';
  });
});

// ─── PARTICLES ───
const container = document.getElementById('particles');
if (container) {
  for (let i = 0; i < 30; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.top  = Math.random() * 100 + '%';
    s.style.animationDelay  = Math.random() * 6 + 's';
    s.style.animationDuration = (4 + Math.random() * 4) + 's';
    container.appendChild(s);
  }
}

// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── AVIS (COMMENTS & STARS) ───
let selectedStar = 0;
const API_URL = 'https://script.google.com/macros/s/AKfycbytEyQUOO4Z6fjorxo-XkW-4FZOy09K7e_KOlHDUoXSEqxOyAo0w8K8OsCzXmkEAaxQ/exec';

// تحميل التعليقات من Google Sheets
async function loadAvis() {
  const container = document.getElementById('avisList');
  if (!container) return;
  
  container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">⏳ Chargement des avis...</p>';
  
  try {
    const response = await fetch(`${API_URL}?action=get`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur de chargement');
    }
    
    const avisList = result.data || [];
    
    if (avisList.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:var(--text-muted);font-style:italic;">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>`;
      return;
    }
    
    // Afficher les avis (du plus récent au plus ancien)
    const sorted = avisList.reverse();
    container.innerHTML = sorted.map(a => `
      <div style="background:#fff;border-radius:16px;padding:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,.06);border-left:4px solid var(--gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem;">
          <strong style="font-size:1.1rem;">${escapeHTML(a.name)}</strong>
          <div style="color:var(--gold);font-size:1.2rem;">${'★'.repeat(a.stars)}${'☆'.repeat(5 - a.stars)}</div>
        </div>
        <p style="color:var(--text-muted);line-height:1.6;font-size:.95rem;">${escapeHTML(a.text)}</p>
        <small style="color:var(--text-muted);opacity:.6;font-size:.75rem;">${escapeHTML(a.date)}</small>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Erreur:', error);
    container.innerHTML = `<p style="text-align:center;color:var(--coral);">❌ Impossible de charger les avis. Réessayez plus tard.</p>`;
  }
}

// إرسال تعليق جديد
async function submitAvis() {
  const name = document.getElementById('avisName').value.trim();
  const text = document.getElementById('avisText').value.trim();
  
  if (!name || !text || selectedStar === 0) {
    alert('⚠️ Veuillez remplir tous les champs et sélectionner une note !');
    return;
  }

  const btn = document.querySelector('#avis .btn-primary');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Envoi...';
  btn.disabled = true;

  try {
    const formData = new URLSearchParams();
    formData.append('action', 'post');
    formData.append('name', name);
    formData.append('text', text);
    formData.append('stars', selectedStar);
    formData.append('date', new Date().toLocaleDateString('fr-FR'));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Réinitialiser le formulaire
      document.getElementById('avisName').value = '';
      document.getElementById('avisText').value = '';
      selectedStar = 0;
      document.querySelectorAll('#starRating span').forEach(s => s.textContent = '☆');
      
      alert('✅ Votre avis a été publié avec succès !');
      loadAvis(); // Recharger la liste
    } else {
      alert('❌ Erreur: ' + (result.error || 'Problème lors de l\'envoi'));
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Erreur de connexion. Vérifiez votre connexion internet.');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// Fonction utilitaire pour sécuriser les affichages (éviter le XSS)
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"]/g, function(tag) {
    const chars = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return chars[tag] || tag;
  });
}

// تهيئة النجوم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // Stars
  const stars = document.querySelectorAll('#starRating span');
  if (stars.length) {
    stars.forEach(star => {
      star.addEventListener('click', function() {
        selectedStar = parseInt(this.dataset.value);
        stars.forEach((s, idx) => {
          s.textContent = (idx < selectedStar) ? '★' : '☆';
        });
      });
    });
  }
  
  // Charger les avis
  loadAvis();
});

// ─── PROFESSIONAL LANGUAGE DROPDOWN ───
function toggleLangDropdown() {
  const dropdown = document.getElementById('langDropdown');
  const toggle = document.querySelector('.lang-toggle');
  dropdown.classList.toggle('open');
  toggle.classList.toggle('active');
}

// Fermer le dropdown en cliquant ailleurs
document.addEventListener('click', function(event) {
  const wrapper = document.querySelector('.lang-dropdown-wrapper');
  if (wrapper && !wrapper.contains(event.target)) {
    document.getElementById('langDropdown').classList.remove('open');
    document.querySelector('.lang-toggle').classList.remove('active');
  }
});

// Mettre à jour le label du bouton
function updateLangLabel(lang) {
  const labelMap = {
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
    it: 'Italiano',
    pl: 'Polski'
  };
  const labelEl = document.getElementById('currentLangLabel');
  if (labelEl) {
    labelEl.textContent = labelMap[lang] || lang;
  }
}

// Surcharger switchLanguage pour gérer le label et le dropdown
const originalSwitch = switchLanguage;
switchLanguage = function(lang) {
  originalSwitch(lang);
  updateLangLabel(lang);
  
  // Marquer l'élément actif dans la liste
  document.querySelectorAll('.lang-dropdown li').forEach(li => {
    li.classList.remove('active-lang');
    if (li.dataset.lang === lang) {
      li.classList.add('active-lang');
    }
  });
  
  // Fermer le dropdown
  document.getElementById('langDropdown').classList.remove('open');
  document.querySelector('.lang-toggle').classList.remove('active');
};

// Appliquer au chargement
document.addEventListener('DOMContentLoaded', function() {
  const saved = localStorage.getItem('lang') || 'fr';
  // Appliquer les traductions (existant)
  if (typeof applyTranslations === 'function') {
    applyTranslations(saved);
  }
  updateLangLabel(saved);
  // Marquer l'élément actif
  document.querySelectorAll('.lang-dropdown li').forEach(li => {
    li.classList.remove('active-lang');
    if (li.dataset.lang === saved) {
      li.classList.add('active-lang');
    }
  });
});