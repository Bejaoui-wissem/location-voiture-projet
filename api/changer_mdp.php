<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['email']) || empty($data['actuel']) || empty($data['nouveau'])) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
$stmt->execute([$data['email']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($data['actuel'], $user['mot_de_passe'])) {
    echo json_encode(['success' => false, 'message' => 'Mot de passe actuel incorrect']);
    exit;
}

if (strlen($data['nouveau']) < 6) {
    echo json_encode(['success' => false, 'message' => 'Le nouveau mot de passe doit contenir au moins 6 caractères']);
    exit;
}

$hash = password_hash($data['nouveau'], PASSWORD_BCRYPT);
$stmt = $pdo->prepare("UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?");
$stmt->execute([$hash, $data['email']]);

echo json_encode(['success' => true, 'message' => 'Mot de passe modifié avec succès']);
?>
