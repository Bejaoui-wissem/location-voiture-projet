/**
 * AutoDrive — api.js
 * Module centralisé pour tous les appels à l'API PHP.
 * Importé dans les pages via : <script src="assets/js/api.js"></script>
 */

const AutoDriveAPI = (() => {

  const BASE = 'api/';

  // ── Utilitaire fetch générique ──────────────────────────────────────
  async function request(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(BASE + endpoint, options);

    if (!res.ok) {
      let message = `Erreur serveur (${res.status})`;
      try {
        const err = await res.json();
        message = err.message || err.error || message;
      } catch (_) {}
      throw new Error(message);
    }

    return res.json();
  }

  // ── Voitures ────────────────────────────────────────────────────────

  /** Récupère toutes les voitures */
  async function getVoitures() {
    return request('voitures.php');
  }

  /** Récupère uniquement les voitures disponibles */
  async function getVoituresDisponibles() {
    const voitures = await getVoitures();
    return voitures.filter(v => v.statut === 'disponible');
  }

  /** Change le statut d'une voiture (admin) */
  async function updateStatutVoiture(id, statut) {
    return request('voitures.php', 'POST', { id, statut });
  }

  // ── Réservations ────────────────────────────────────────────────────

  /** Crée une réservation */
  async function creerReservation(data) {
    return request('reservation.php', 'POST', data);
  }

  /** Récupère toutes les réservations (admin) */
  async function getReservations() {
    return request('reservations.php');
  }

  // ── Authentification ────────────────────────────────────────────────

  /** Connexion utilisateur */
  async function login(email, password) {
    return request('login.php', 'POST', { email, password });
  }

  /** Déconnexion */
  async function logout() {
    try {
      await request('logout.php', 'POST');
    } catch (_) {}
    window.location.href = 'login.html';
  }

  // ── Exposition publique ─────────────────────────────────────────────
  return {
    getVoitures,
    getVoituresDisponibles,
    updateStatutVoiture,
    creerReservation,
    getReservations,
    login,
    logout,
  };

})();
