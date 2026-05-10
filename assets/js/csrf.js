/**
 * ╔══════════════════════════════════════════════════════════════╗
 *  CharthaGo — csrf.js
 *  Gestionnaire CSRF côté client.
 *
 *  Fonctionnement :
 *   1. Au chargement de chaque page, fetchCsrfToken() appelle
 *      api/csrf_token.php et stocke le token dans window.csrfToken.
 *   2. secureFetch() est un wrapper autour de fetch() qui injecte
 *      automatiquement le token dans le header X-CSRF-Token de
 *      chaque requête POST / PUT / DELETE.
 *   3. Après un login réussi, le nouveau token renvoyé par le serveur
 *      est mis à jour via updateCsrfToken().
 *
 *  Utilisation :
 *   • Inclure ce fichier AVANT tout script qui fait des appels API.
 *   • Remplacer fetch('api/xxx.php', { method:'POST', ... })
 *     par     secureFetch('api/xxx.php', { method:'POST', ... })
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ── Stockage du token en mémoire (non exposé via localStorage) ────────────────
window.csrfToken = '';

/**
 * Récupère un token CSRF frais depuis le serveur.
 * À appeler une fois au DOMContentLoaded de chaque page protégée.
 */
async function fetchCsrfToken() {
  try {
    const res  = await fetch('api/csrf_token.php', { credentials: 'include' });
    const data = await res.json();
    if (data && data.token) {
      window.csrfToken = data.token;
    }
  } catch (err) {
    console.warn('[CSRF] Impossible de récupérer le token CSRF :', err);
  }
}

/**
 * Met à jour le token en mémoire (à appeler après un login réussi
 * quand le serveur retourne un nouveau token).
 * @param {string} newToken
 */
function updateCsrfToken(newToken) {
  if (newToken) {
    window.csrfToken = newToken;
  }
}

/**
 * Wrapper sécurisé autour de fetch().
 * Injecte automatiquement X-CSRF-Token sur les requêtes mutantes.
 *
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<Response>}
 */
async function secureFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const mutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  if (mutating) {
    // Assure que les headers existent
    options.headers = options.headers || {};

    // Injecter le token CSRF dans le header HTTP
    options.headers['X-CSRF-Token'] = window.csrfToken;

    // S'assurer que les cookies de session sont envoyés
    options.credentials = options.credentials || 'include';
  }

  return fetch(url, options);
}

// ── Initialisation automatique au chargement de la page ──────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchCsrfToken();
});
