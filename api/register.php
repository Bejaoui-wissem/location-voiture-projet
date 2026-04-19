<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

// ── Validation serveur ────────────────────────────────────
$required = ['nom', 'email', 'telephone', 'password'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Champ manquant : $field"]);
        exit;
    }
}

$nom       = htmlspecialchars(trim($data['nom']));
$email     = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
$telephone = htmlspecialchars(trim($data['telephone']));
$password  = $data['password'];

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Le mot de passe doit contenir au moins 6 caractères.']);
    exit;
}

// ── Vérifier si email déjà utilisé ───────────────────────
$stmt = $pdo->prepare("SELECT id FROM utilisateurs WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Cette adresse email est déjà utilisée.']);
    exit;
}

// ── Hasher le mot de passe ────────────────────────────────
$hash = password_hash($password, PASSWORD_BCRYPT);

// ── Insérer le nouvel utilisateur ─────────────────────────
$stmt = $pdo->prepare("
    INSERT INTO utilisateurs (nom, email, mot_de_passe, telephone, role)
    VALUES (?, ?, ?, ?, 'client')
");
$stmt->execute([$nom, $email, $hash, $telephone]);

echo json_encode([
    'success' => true,
    'message' => 'Compte créé avec succès !',
    'id'      => $pdo->lastInsertId()
]);
?>
