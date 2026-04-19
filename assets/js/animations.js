/**
 * AutoDrive — animations.js
 * Animations d'entrée au chargement des pages.
 * Inclure via : <script src="assets/js/animations.js"></script>
 */

(function () {

  const style = document.createElement('style');
  style.textContent = `
    /* ── Classes de base (éléments invisibles avant animation) ── */
    .ad-anim         { opacity: 0; }
    .ad-fade-up      { opacity: 0; transform: translateY(24px); }
    .ad-fade-left    { opacity: 0; transform: translateX(-24px); }
    .ad-fade-right   { opacity: 0; transform: translateX(24px); }
    .ad-scale-in     { opacity: 0; transform: scale(0.94); }
    .ad-fade         { opacity: 0; }

    /* ── Animations ── */
    @keyframes adFadeUp    { to { opacity:1; transform: translateY(0); } }
    @keyframes adFadeLeft  { to { opacity:1; transform: translateX(0); } }
    @keyframes adFadeRight { to { opacity:1; transform: translateX(0); } }
    @keyframes adScaleIn   { to { opacity:1; transform: scale(1); } }
    @keyframes adFade      { to { opacity:1; } }

    /* ── Classes actives (ajoutées par JS) ── */
    .ad-fade-up.ad-visible    { animation: adFadeUp    0.55s cubic-bezier(.4,0,.2,1) forwards; }
    .ad-fade-left.ad-visible  { animation: adFadeLeft  0.55s cubic-bezier(.4,0,.2,1) forwards; }
    .ad-fade-right.ad-visible { animation: adFadeRight 0.55s cubic-bezier(.4,0,.2,1) forwards; }
    .ad-scale-in.ad-visible   { animation: adScaleIn   0.45s cubic-bezier(.4,0,.2,1) forwards; }
    .ad-fade.ad-visible       { animation: adFade      0.6s  ease forwards; }

    /* ── Délais ── */
    .ad-d1 { animation-delay: 0.05s !important; }
    .ad-d2 { animation-delay: 0.10s !important; }
    .ad-d3 { animation-delay: 0.15s !important; }
    .ad-d4 { animation-delay: 0.20s !important; }
    .ad-d5 { animation-delay: 0.25s !important; }
    .ad-d6 { animation-delay: 0.30s !important; }
    .ad-d7 { animation-delay: 0.35s !important; }
    .ad-d8 { animation-delay: 0.40s !important; }

    /* ── Respect de prefers-reduced-motion ── */
    @media (prefers-reduced-motion: reduce) {
      .ad-fade-up, .ad-fade-left, .ad-fade-right, .ad-scale-in, .ad-fade {
        opacity: 1 !important; transform: none !important; animation: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Observer Intersection pour déclencher les animations au scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('ad-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Appliquer les animations aux éléments cibles au chargement
  function initAnimations() {
    // Hero sections
    document.querySelectorAll('section .relative.z-10, .hero-content').forEach((el, i) => {
      el.classList.add('ad-fade-up', `ad-d${Math.min(i + 1, 8)}`);
      observer.observe(el);
    });

    // Cards voitures
    document.querySelectorAll('.car-card, #catalogue-voitures > div').forEach((el, i) => {
      el.classList.add('ad-fade-up', `ad-d${Math.min((i % 6) + 1, 8)}`);
      observer.observe(el);
    });

    // Stats cards admin
    document.querySelectorAll('.kinetic-shadow').forEach((el, i) => {
      el.classList.add('ad-scale-in', `ad-d${Math.min(i + 1, 8)}`);
      observer.observe(el);
    });

    // Formulaires / sections principales
    document.querySelectorAll('.login-container, .card.shadow-lg, #resa-form').forEach(el => {
      el.classList.add('ad-scale-in', 'ad-d1');
      observer.observe(el);
    });

    // Titres de section
    document.querySelectorAll('h1, h2').forEach((el, i) => {
      if (!el.closest('nav') && !el.closest('aside')) {
        el.classList.add('ad-fade-up', `ad-d${Math.min(i + 1, 3)}`);
        observer.observe(el);
      }
    });

    // Navbar — slide down
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.cssText += '; animation: navSlideDown 0.4s cubic-bezier(.4,0,.2,1) forwards;';
      const navStyle = document.createElement('style');
      navStyle.textContent = `@keyframes navSlideDown { from { opacity:0; transform:translateY(-100%); } to { opacity:1; transform:translateY(0); } }`;
      document.head.appendChild(navStyle);
    }

    // Filtre bar / search bar
    document.querySelectorAll('.bg-surface-container-lowest.p-6, .bg-surface-container-lowest.p-4').forEach(el => {
      el.classList.add('ad-fade-up', 'ad-d3');
      observer.observe(el);
    });
  }

  // Observer les nouvelles cards ajoutées dynamiquement (catalogue chargé via API)
  window.animateNewCards = function () {
    document.querySelectorAll('#catalogue-voitures > div:not(.ad-visible):not(.ad-fade-up)').forEach((el, i) => {
      el.classList.add('ad-fade-up', `ad-d${Math.min((i % 6) + 1, 8)}`);
      observer.observe(el);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

})();
