/**
 * AutoDrive — auth.js
 * Gestion de l'authentification côté client.
 * Importé via : <script src="assets/js/auth.js"></script>
 * Dépend de : api.js, utils.js
 */

const AutoDriveAuth = (() => {

  const SESSION_KEY = 'autodrive_session';

  // ── Vérifier si l'utilisateur est connecté ──────────────────────────
  function isLoggedIn() {
    const session = AutoDriveUtils.loadLocal('session');
    return session && session.role;
  }

  // ── Vérifier si admin ───────────────────────────────────────────────
  function isAdmin() {
    const session = AutoDriveUtils.loadLocal('session');
    return session && session.role === 'admin';
  }

  // ── Récupérer l'utilisateur courant ─────────────────────────────────
  function getUser() {
    return AutoDriveUtils.loadLocal('session');
  }

  // ── Connexion ───────────────────────────────────────────────────────
  async function login(email, password) {
    const result = await AutoDriveAPI.login(email, password);
    if (result.success) {
      AutoDriveUtils.saveLocal('session', { role: result.role, email });
    }
    return result;
  }

  // ── Déconnexion ─────────────────────────────────────────────────────
  async function logout() {
    AutoDriveUtils.removeLocal('session');
    await AutoDriveAPI.logout();
  }

  // ── Protéger une page (redirige si non connecté) ────────────────────
  function requireAuth(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  // ── Protéger une page admin ─────────────────────────────────────────
  function requireAdmin(redirectTo = 'login.html') {
    if (!isAdmin()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  // ── Gérer le formulaire de connexion ────────────────────────────────
  function initLoginForm(formOptions = {}) {
    const {
      emailId      = 'email',
      passwordId   = 'password',
      btnId        = 'btn-login',
      alertId      = 'alert-box',
      alertMsgId   = 'alert-msg',
      onSuccess    = null,
    } = formOptions;

    const btnLogin = document.getElementById(btnId);
    if (!btnLogin) return;

    async function handleLogin() {
      const email    = document.getElementById(emailId)?.value?.trim();
      const password = document.getElementById(passwordId)?.value;
      const alertBox = document.getElementById(alertId);
      const alertMsg = document.getElementById(alertMsgId);

      if (alertBox) alertBox.style.display = 'none';

      if (!email || !password) {
        if (alertBox && alertMsg) {
          alertMsg.textContent = 'Veuillez remplir tous les champs.';
          alertBox.style.display = 'flex';
        }
        return;
      }

      if (!AutoDriveUtils.validerEmail(email)) {
        if (alertBox && alertMsg) {
          alertMsg.textContent = 'Adresse email invalide.';
          alertBox.style.display = 'flex';
        }
        return;
      }

      AutoDriveUtils.setBtnLoading(btnId, true, 'Se connecter');

      try {
        const result = await login(email, password);
        if (result.success) {
          if (onSuccess) {
            onSuccess(result);
          } else {
            window.location.href = result.role === 'admin' ? 'admin.html' : 'index.html';
          }
        } else {
          if (alertBox && alertMsg) {
            alertMsg.textContent = result.message || 'Email ou mot de passe incorrect.';
            alertBox.style.display = 'flex';
          }
        }
      } catch (err) {
        if (alertBox && alertMsg) {
          alertMsg.textContent = 'Erreur de connexion au serveur. Vérifiez que PHP est actif.';
          alertBox.style.display = 'flex';
        }
      } finally {
        AutoDriveUtils.setBtnLoading(btnId, false, 'Se connecter');
      }
    }

    btnLogin.addEventListener('click', handleLogin);

    // Connexion via Entrée
    [emailId, passwordId].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
    });
  }

  return {
    isLoggedIn,
    isAdmin,
    getUser,
    login,
    logout,
    requireAuth,
    requireAdmin,
    initLoginForm,
  };

})();
