/**
 * AutoDrive — utils.js
 * Fonctions utilitaires partagées entre toutes les pages.
 * Importé via : <script src="assets/js/utils.js"></script>
 */

const AutoDriveUtils = (() => {

  // ── Toast notifications ─────────────────────────────────────────────
  function showToast(message, type = 'success', duration = 3000) {
    // Supprimer toast existant
    const existing = document.getElementById('ad-toast');
    if (existing) existing.remove();

    const icons = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };
    const colors = {
      success: 'background:#1a1c1c',
      error:   'background:#ba1a1a',
      warning: 'background:#b45309',
      info:    'background:#185fa5',
    };

    const toast = document.createElement('div');
    toast.id = 'ad-toast';
    toast.style.cssText = `
      position:fixed; top:24px; right:24px; z-index:99999;
      ${colors[type] || colors.success}; color:white;
      padding:14px 20px; border-radius:12px;
      font-size:14px; font-weight:500; font-family:'Inter',sans-serif;
      display:flex; align-items:center; gap:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.2);
      animation:toastIn .3s ease-out;
      max-width:340px;
    `;
    toast.innerHTML = `
      <style>@keyframes toastIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}</style>
      <span class="material-symbols-outlined" style="font-size:20px;flex-shrink:0">${icons[type] || icons.success}</span>
      <span>${escapeHtml(message)}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast?.remove(), duration);
  }

  // ── Escape HTML ─────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Formatage ───────────────────────────────────────────────────────
  function formatPrix(montant, devise = 'DT') {
    return `${parseFloat(montant).toFixed(0)} ${devise}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-TN', { day:'2-digit', month:'short', year:'numeric' });
  }

  function calculerJours(dateDebut, dateFin) {
    const d1 = new Date(dateDebut);
    const d2 = new Date(dateFin);
    const diff = d2 - d1;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }

  // ── Validation formulaire ───────────────────────────────────────────
  function validerTelephone(tel) {
    return /^[0-9\s\+]{8,15}$/.test(tel.trim());
  }

  function validerEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function validerDates(dateDebut, dateFin) {
    const d1 = new Date(dateDebut);
    const d2 = new Date(dateFin);
    const today = new Date(); today.setHours(0,0,0,0);
    if (d1 < today) return { ok: false, message: 'La date de début ne peut pas être dans le passé.' };
    if (d2 <= d1)   return { ok: false, message: 'La date de fin doit être après la date de début.' };
    return { ok: true };
  }

  // ── Afficher une erreur dans un champ ───────────────────────────────
  function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.style.borderColor = '#ba1a1a';
    input.style.boxShadow   = '0 0 0 3px rgba(186,26,26,0.12)';

    let err = document.getElementById(inputId + '-error');
    if (!err) {
      err = document.createElement('p');
      err.id = inputId + '-error';
      err.style.cssText = 'color:#ba1a1a;font-size:12px;margin-top:4px;font-weight:500;';
      input.parentNode.appendChild(err);
    }
    err.textContent = message;
  }

  function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.style.borderColor = '';
    input.style.boxShadow   = '';
    const err = document.getElementById(inputId + '-error');
    if (err) err.remove();
  }

  // ── Debounce ────────────────────────────────────────────────────────
  function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // ── Stocker / récupérer données locales ────────────────────────────
  function saveLocal(key, value) {
    try { localStorage.setItem('autodrive_' + key, JSON.stringify(value)); } catch(_) {}
  }

  function loadLocal(key, fallback = null) {
    try {
      const val = localStorage.getItem('autodrive_' + key);
      return val ? JSON.parse(val) : fallback;
    } catch(_) { return fallback; }
  }

  function removeLocal(key) {
    try { localStorage.removeItem('autodrive_' + key); } catch(_) {}
  }

  // ── Image voiture par marque ────────────────────────────────────────
  const imagesParMarque = {
    peugeot:   'assets/images/voitures/peugeot.jpg',
    renault:   'assets/images/voitures/renault.jpg',
    mercedes:  'assets/images/voitures/mercedes.jpg',
    bmw:       'assets/images/voitures/bmw.jpg',
    volkswagen:'assets/images/voitures/volkswagen.jpg',
    toyota:    'assets/images/voitures/toyota.jpg',
    kia:       'assets/images/voitures/kia.jpg',
    hyundai:   'assets/images/voitures/hyundai.jpg',
    default:   'assets/images/voitures/default.jpg',
  };

  const imagesFallbackUnsplash = {
    peugeot:   'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=60',
    renault:   'https://images.unsplash.com/photo-1621007947382-34c769ce59d6?auto=format&fit=crop&w=600&q=60',
    mercedes:  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=60',
    default:   'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=60',
  };

  function getImageVoiture(voiture) {
    if (voiture.image_url && voiture.image_url.startsWith('http')) return voiture.image_url;
    const marque = (voiture.marque || '').toLowerCase();
    for (const key of Object.keys(imagesFallbackUnsplash)) {
      if (marque.includes(key)) return imagesFallbackUnsplash[key];
    }
    return imagesFallbackUnsplash.default;
  }

  // ── Spinner dans un bouton ──────────────────────────────────────────
  function setBtnLoading(btnId, loading, texteNormal = 'Confirmer') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.style.opacity = loading ? '0.7' : '1';
    btn.style.pointerEvents = loading ? 'none' : '';
    const span = btn.querySelector('[data-btn-text]');
    if (span) span.textContent = loading ? 'Chargement...' : texteNormal;
  }

  // ── Exposition publique ─────────────────────────────────────────────
  return {
    showToast,
    escapeHtml,
    formatPrix,
    formatDate,
    calculerJours,
    validerTelephone,
    validerEmail,
    validerDates,
    showFieldError,
    clearFieldError,
    debounce,
    saveLocal,
    loadLocal,
    removeLocal,
    getImageVoiture,
    setBtnLoading,
  };

})();
