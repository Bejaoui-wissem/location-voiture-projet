<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$email   = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$code    = $data['code'] ?? '';
$nouveau = $data['nouveau'] ?? '';

if (!$email || !$code || strlen($nouveau) < 6) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

if (
    !isset($_SESSION['reset_code'], $_SESSION['reset_email'], $_SESSION['reset_expire']) ||
    $_SESSION['reset_code']  !== $code ||
    $_SESSION['reset_email'] !== $email ||
    $_SESSION['reset_expire'] < time()
) {
    echo json_encode(['success' => false, 'message' => 'Code expiré ou invalide']);
    exit;
}

$hash = password_hash($nouveau, PASSWORD_BCRYPT);
$stmt = $pdo->prepare("UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?");
$stmt->execute([$hash, $email]);

unset($_SESSION['reset_code'], $_SESSION['reset_email'], $_SESSION['reset_expire']);
echo json_encode(['success' => true]);
