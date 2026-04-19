<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
if (empty($data['email']) || empty($data['nom'])) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

$email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    // Créer un nouveau compte client automatiquement
    $pass = password_hash(bin2hex(random_bytes(8)), PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, 'client')");
    $stmt->execute([$data['nom'], $email, $pass]);
    $id = $pdo->lastInsertId();
    $user = ['id' => $id, 'nom' => $data['nom'], 'email' => $email, 'role' => 'client'];
}

$_SESSION['user'] = $user;
echo json_encode([
    'success' => true,
    'id' => $user['id'],
    'nom' => $user['nom'],
    'email' => $user['email'],
    'role' => $user['role']
]);
