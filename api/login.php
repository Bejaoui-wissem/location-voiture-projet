<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
session_start();
require_once 'config.php';

// ──────────── Rate limiting — max 5 tentatives / 15 min par IP ────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = time();

if (!isset($_SESSION['login_attempts'])) $_SESSION['login_attempts'] = [];
$_SESSION['login_attempts'] = array_filter($_SESSION['login_attempts'], fn($t) => $t > $now - 900);

if (count($_SESSION['login_attempts']) >= 5) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Trop de tentatives. Réessayez dans 15 minutes.'
    ]);
    exit;
}

// ──────────── Validation des données ────────────
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['email']) || empty($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email et mot de passe requis']);
    exit;
}

$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
if (!$email) {
    $_SESSION['login_attempts'][] = $now;
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

if (strlen($data['password']) > 100) {
    echo json_encode(['success' => false, 'message' => 'Mot de passe trop long']);
    exit;
}

// ──────────── Vérification en BD ────────────
$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($data['password'], $user['mot_de_passe'])) {
    $_SESSION['login_attempts'][] = $now;
    $restantes = 5 - count($_SESSION['login_attempts']);
    echo json_encode([
        'success' => false,
        'message' => 'Email ou mot de passe incorrect' . ($restantes > 0 ? " ({$restantes} tentatives restantes)" : '')
    ]);
    exit;
}

// ──────────── Connexion réussie ────────────
$_SESSION['login_attempts'] = [];
session_regenerate_id(true);

$_SESSION['user'] = [
    'id' => $user['id'],
    'nom' => $user['nom'],
    'email' => $user['email'],
    'role' => $user['role']
];
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
$_SESSION['last_activity'] = $now;

echo json_encode([
    'success' => true,
    'id' => $user['id'],
    'nom' => $user['nom'],
    'email' => $user['email'],
    'role' => $user['role'],
    'csrf' => $_SESSION['csrf_token']
]);
