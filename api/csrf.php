<?php
/**
 * ╔══════════════════════════════════════════════════════════════════╗
 *  CharthaGo — Protection CSRF centralisée
 *
 *  Fonctionnement :
 *   1. csrf_get_token()   → génère (ou retourne) le token en session
 *   2. csrf_verify()      → vérifie le token envoyé dans la requête POST
 *      Cherche dans l'ordre :
 *        a) Header HTTP  : X-CSRF-Token
 *        b) Corps JSON   : champ "csrf_token"
 *      Si invalide → répond 403 et stoppe l'exécution.
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ── Générer ou récupérer le token de session ──────────────────────────────────
function csrf_get_token(): string {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// ── Vérifier le token CSRF sur les requêtes POST ──────────────────────────────
function csrf_verify(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Routes publiques qui ne nécessitent PAS de session préalable :
    // register et mdp_envoyer_code sont accessibles sans être connecté,
    // mais on exige quand même le token fourni par l'API csrf_token.php
    $tokenSession = $_SESSION['csrf_token'] ?? '';

    // Cherche le token côté client (header prioritaire, puis corps JSON)
    $tokenClient = '';

    // 1. Header HTTP X-CSRF-Token
    $headerKey = 'HTTP_X_CSRF_TOKEN';
    if (!empty($_SERVER[$headerKey])) {
        $tokenClient = $_SERVER[$headerKey];
    }

    // 2. Corps JSON — on lit php://input une seule fois
    if ($tokenClient === '') {
        $raw = file_get_contents('php://input');
        // On stocke dans une variable globale pour éviter de re-lire le stream
        $GLOBALS['_CSRF_RAW_BODY'] = $raw;
        $decoded = json_decode($raw, true);
        $tokenClient = $decoded['csrf_token'] ?? '';
    }

    // 3. Validation : comparaison temps-constant (résistant au timing attack)
    if (
        empty($tokenSession) ||
        empty($tokenClient)  ||
        !hash_equals($tokenSession, $tokenClient)
    ) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Token CSRF invalide ou manquant. Rechargez la page et réessayez.'
        ]);
        exit;
    }
}

// ── Lire le corps JSON déjà consommé (si csrf_verify a été appelé avant) ──────
function csrf_get_body(): ?array {
    if (isset($GLOBALS['_CSRF_RAW_BODY'])) {
        return json_decode($GLOBALS['_CSRF_RAW_BODY'], true);
    }
    return json_decode(file_get_contents('php://input'), true);
}
