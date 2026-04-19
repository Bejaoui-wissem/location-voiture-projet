<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['nom']) || empty($data['email']) || empty($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
    exit;
}

$nom = trim(strip_tags($data['nom']));
$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
$password = $data['password'];
$telephone = isset($data['telephone']) ? preg_replace('/[^0-9+\s]/', '', $data['telephone']) : null;

if (strlen($nom) < 2 || strlen($nom) > 50) {
    echo json_encode(['success' => false, 'message' => 'Nom invalide (entre 2 et 50 caracteres)']);
    exit;
}

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

if (strlen($password) < 6 || strlen($password) > 100) {
    echo json_encode(['success' => false, 'message' => 'Le mot de passe doit contenir entre 6 et 100 caracteres']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM utilisateurs WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Cet email est deja utilise']);
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
$stmt = $pdo->prepare("INSERT INTO utilisateurs (nom, email, mot_de_passe, telephone, role) VALUES (?, ?, ?, ?, 'client')");
$stmt->execute([$nom, $email, $hash, $telephone]);

echo json_encode(['success' => true, 'message' => 'Compte cree avec succes']);
