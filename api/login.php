<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if(!$data || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
$stmt->execute([$data['email']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($data['password'], $user['mot_de_passe'])) {
    $_SESSION['user'] = $user;
    echo json_encode(['success' => true, 'role' => $user['role'], 'nom' => $user['nom'], 'email' => $user['email'], 'id' => $user['id']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
}
?>