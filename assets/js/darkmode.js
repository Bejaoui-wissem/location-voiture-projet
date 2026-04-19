/**
 * AutoDrive — darkmode.js
 * Toggle dark/light mode partagé entre toutes les pages.
 * Inclure via : <script src="assets/js/darkmode.js"></script>
 * Ajouter le bouton dans la navbar : <button onclick="toggleDark()" id="btn-dark">...</button>
 */

(function () {

  // Appliquer le thème sauvegardé dès le chargement (évite le flash)
  const saved = localStorage.getItem('autodrive_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  if (isDark) {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }

  // Injecter les styles dark mode globaux
  const style = document.createElement('style');
  style.textContent = `
    /* ── Transition douce au changement de thème ── */
    *, *::before, *::after {
      transition: background-color 0.25s ease, border-color 0.25s ease, color 0.15s ease;
    }

    /* ── Bouton toggle ── */
    #btn-dark {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      background: transparent; border: 1.5px solid #e5e7eb;
      cursor: pointer; transition: all 0.2s;
      flex-shrink: 0;
    }
    #btn-dark:hover { border-color: #b90027; background: rgba(185,0,39,0.06); }
    #btn-dark svg { width: 18px; height: 18px; }

    /* ── Dark mode global ── */
    html.dark body                         { background: #0f1011 !important; color: #e8e6e3 !important; }
    html.dark .bg-surface                  { background-color: #0f1011 !important; }
    html.dark .bg-surface-container-lowest { background-color: #1c1e1f !important; }
    html.dark .bg-surface-container-low    { background-color: #232526 !important; }
    html.dark .bg-surface-container        { background-color: #2a2c2d !important; }
    html.dark .bg-surface-container-high   { background-color: #313435 !important; }
    html.dark .bg-light                    { background-color: #1c1e1f !important; }
    html.dark .bg-white                    { background-color: #1c1e1f !important; }
    html.dark .bg-zinc-50                  { background-color: #1c1e1f !important; }
    html.dark .bg-zinc-900                 { background-color: #070809 !important; }

    html.dark .text-on-surface,
    html.dark .text-on-background,
    html.dark .text-zinc-900               { color: #e8e6e3 !important; }
    html.dark .text-secondary,
    html.dark .text-zinc-600,
    html.dark .text-zinc-500               { color: #9c9a92 !important; }
    html.dark .text-zinc-400               { color: #6b6965 !important; }

    html.dark .border-zinc-100,
    html.dark .border-surface-container,
    html.dark .border-surface-container-high { border-color: #2f3132 !important; }

    html.dark .shadow-sm,
    html.dark .shadow-lg,
    html.dark .kinetic-shadow              { box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important; }

    html.dark nav,
    html.dark .navbar                      { background: rgba(15,16,17,0.85) !important; border-bottom-color: #2f3132 !important; }

    html.dark .card,
    html.dark .rounded-3xl,
    html.dark .rounded-2xl                 { border-color: #2f3132 !important; }

    html.dark input, html.dark textarea, html.dark select {
      background: #232526 !important; color: #e8e6e3 !important;
      border-color: #3a3c3d !important;
    }
    html.dark input::placeholder,
    html.dark textarea::placeholder        { color: #5a5855 !important; }

    html.dark table thead tr               { background: #232526 !important; }
    html.dark table tbody tr:hover         { background: #1c1e1f !important; }
    html.dark .divide-surface-container > * + * { border-color: #2f3132 !important; }

    html.dark .skeleton {
      background: linear-gradient(90deg, #232526 25%, #2a2c2d 50%, #232526 75%) !important;
      background-size: 200% 100% !important;
    }

    /* Sidebar admin dark */
    html.dark aside { background: #141617 !important; border-color: #2f3132 !important; }
    html.dark .nav-link.active { background: #1c1e1f !important; }
    html.dark .nav-link:hover  { background: rgba(255,255,255,0.04) !important; }

    /* Footer dark */
    html.dark footer { background: #070809 !important; }
  `;
  document.head.appendChild(style);

  // Fonction toggle globale
  window.toggleDark = function () {
    const html = document.documentElement;
    const nowDark = html.classList.contains('dark');
    html.classList.toggle('dark', !nowDark);
    html.classList.toggle('light', nowDark);
    localStorage.setItem('autodrive_theme', nowDark ? 'light' : 'dark');
    updateBtnIcon(!nowDark);
  };

  // Mettre à jour l'icône du bouton
  function updateBtnIcon(dark) {
    const btn = document.getElementById('btn-dark');
    if (!btn) return;
    btn.innerHTML = dark
      ? `<svg viewBox="0 0 24 24" fill="currentColor" style="color:#f9c74f"><path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-5a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zM3 11H2a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm15.36-6.36.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 0 1-1.41-1.41zM4.93 18.36l-.7.7a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 1.41zM18.36 19.07l.7.7a1 1 0 0 1-1.41 1.41l-.7-.7a1 1 0 0 1 1.41-1.41zM5.64 5.64l-.7-.7A1 1 0 0 0 3.53 6.34l.7.7a1 1 0 0 0 1.41-1.41z"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="currentColor" style="color:#9c9a92"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
    btn.title = dark ? 'Passer en mode clair' : 'Passer en mode sombre';
  }

  // Init icône après chargement du DOM
  document.addEventListener('DOMContentLoaded', () => {
    updateBtnIcon(document.documentElement.classList.contains('dark'));
  });

})();
