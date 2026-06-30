// script.js

// ─── NAV SCROLL ───
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── MOBILE MENU ───
function openMenu() { document.getElementById('mobileMenu').classList.add('open'); }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

// ─── LANGUAGE ───
let currentLang = localStorage.getItem('lang') || 'fr';

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.style.opacity = btn.dataset.lang === lang ? '1' : '0.5';
  });
}

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = dict.nav_reserver || 'La Petite Hurghadienne';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerHTML = dict[key];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lang') || 'fr';
  applyTranslations(saved);
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

// ─── AVIS (COMMENTS & STARS WITH IMAGE VIA GAS) ───
let selectedStar = 0;
let selectedImageBase64 = null;   // الصورة كـ Base64 لإرسالها إلى Apps Script
let imagePreviewUrl = null;

// ⚠️ استبدل هذا الرابط برابط Google Apps Script الجديد الخاص بك
const API_URL = 'https://script.google.com/macros/s/AKfycbzDO59SC2R-wT7raqynnnf87aU1phqhQUWAFRQXxnZNXssDRHpQjhGc4g8-sU5qQgj4/exec';

// ─── FUNCTIONS FOR IMAGE ───
function updateImagePreview(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    selectedImageBase64 = e.target.result; // حفظ Base64
    imagePreviewUrl = e.target.result;
    document.getElementById('imageFileName').textContent = file.name;
    const previewDiv = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    img.src = imagePreviewUrl;
    previewDiv.style.display = 'inline-block';
    previewDiv.classList.add('visible');
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  selectedImageBase64 = null;
  imagePreviewUrl = null;
  document.getElementById('avisImage').value = '';
  document.getElementById('imageFileName').textContent = 'Aucune image sélectionnée';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('imagePreview').classList.remove('visible');
}

// ─── LOAD AVIS ───
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
    
    const sorted = avisList.reverse();
    container.innerHTML = sorted.map(a => `
      <div style="background:#fff;border-radius:16px;padding:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,.06);border-left:4px solid var(--gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem;">
          <strong style="font-size:1.1rem;">${escapeHTML(a.name)}</strong>
          <div style="color:var(--gold);font-size:1.2rem;">${'★'.repeat(a.stars)}${'☆'.repeat(5 - a.stars)}</div>
        </div>
        ${a.image ? `<img src="${escapeHTML(a.image)}" alt="Photo" style="max-width:100%;max-height:200px;border-radius:12px;margin:.5rem 0;object-fit:cover;border:1px solid #eee;">` : ''}
        <p style="color:var(--text-muted);line-height:1.6;font-size:.95rem;">${escapeHTML(a.text)}</p>
        <small style="color:var(--text-muted);opacity:.6;font-size:.75rem;">${escapeHTML(a.date)}</small>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Erreur:', error);
    container.innerHTML = `<p style="text-align:center;color:var(--coral);">❌ Impossible de charger les avis. Réessayez plus tard.</p>`;
  }
}

// ─── SUBMIT AVIS (via Google Apps Script) ───
async function submitAvis() {
  const name = document.getElementById('avisName').value.trim();
  const text = document.getElementById('avisText').value.trim();
  
  if (!name || !text || selectedStar === 0) {
    alert('⚠️ Veuillez remplir tous les champs et sélectionner une note !');
    return;
  }

  const btn = document.getElementById('submitAvisBtn');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Envoi en cours...';
  btn.disabled = true;

  try {
    const formData = new URLSearchParams();
    formData.append('action', 'post');
    formData.append('name', name);
    formData.append('text', text);
    formData.append('stars', selectedStar);
    formData.append('date', new Date().toLocaleDateString('fr-FR'));
    
    // إرسال الصورة كـ Base64 إلى Google Apps Script (الخادم سيرفعها إلى Imgur)
    if (selectedImageBase64) {
      formData.append('imageBase64', selectedImageBase64);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      // ✅ إعادة تعيين النموذج
      document.getElementById('avisName').value = '';
      document.getElementById('avisText').value = '';
      selectedStar = 0;
      document.querySelectorAll('.star').forEach(s => {
        s.textContent = '☆';
        s.classList.remove('active', 'gold');
      });
      removeImage();
      
      // ✅ عرض رسالة الشكر
      const thankDiv = document.getElementById('thankYouMessage');
      thankDiv.style.display = 'block';
      thankDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { thankDiv.style.display = 'none'; }, 6000);
      
      loadAvis(); // إعادة تحميل القائمة
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

// ─── GOLDEN STARS ───
function initStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    // Click
    star.addEventListener('click', function() {
      selectedStar = parseInt(this.dataset.value);
      stars.forEach((s, idx) => {
        if (idx < selectedStar) {
          s.textContent = '★';
          s.classList.add('gold');
          s.classList.remove('active');
        } else {
          s.textContent = '☆';
          s.classList.remove('gold', 'active');
        }
      });
    });
    
    // Hover
    star.addEventListener('mouseenter', function() {
      const val = parseInt(this.dataset.value);
      stars.forEach((s, idx) => {
        if (idx < val) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
    
    star.addEventListener('mouseleave', function() {
      stars.forEach(s => s.classList.remove('active'));
    });
  });
}

// ─── ESCAPE HTML (sécurité) ───
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"]/g, function(tag) {
    const chars = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return chars[tag] || tag;
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', function() {
  initStars();
  loadAvis();
});

// ─── PROFESSIONAL LANGUAGE DROPDOWN ───
function toggleLangDropdown() {
  document.getElementById('langDropdown').classList.toggle('open');
  document.querySelector('.lang-toggle').classList.toggle('active');
}

document.addEventListener('click', function(event) {
  const wrapper = document.querySelector('.lang-dropdown-wrapper');
  if (wrapper && !wrapper.contains(event.target)) {
    document.getElementById('langDropdown').classList.remove('open');
    document.querySelector('.lang-toggle').classList.remove('active');
  }
});

function updateLangLabel(lang) {
  const labelMap = { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', pl: 'Polski' };
  const labelEl = document.getElementById('currentLangLabel');
  if (labelEl) labelEl.textContent = labelMap[lang] || lang;
}

const originalSwitch = switchLanguage;
switchLanguage = function(lang) {
  originalSwitch(lang);
  updateLangLabel(lang);
  document.querySelectorAll('.lang-dropdown li').forEach(li => {
    li.classList.remove('active-lang');
    if (li.dataset.lang === lang) li.classList.add('active-lang');
  });
  document.getElementById('langDropdown').classList.remove('open');
  document.querySelector('.lang-toggle').classList.remove('active');
};

// تهيئة اللغة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
  const saved = localStorage.getItem('lang') || 'fr';
  if (typeof applyTranslations === 'function') applyTranslations(saved);
  updateLangLabel(saved);
  document.querySelectorAll('.lang-dropdown li').forEach(li => {
    li.classList.remove('active-lang');
    if (li.dataset.lang === saved) li.classList.add('active-lang');
  });
});