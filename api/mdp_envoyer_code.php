<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM utilisateurs WHERE email = ?");
$stmt->execute([$email]);
if (!$stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email introuvable']);
    exit;
}

$code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
$_SESSION['reset_code']  = $code;
$_SESSION['reset_email'] = $email;
$_SESSION['reset_expire'] = time() + 600;

// En production : envoyer par email via PHPMailer ou mail()
// Pour la démo, on retourne le code directement
echo json_encode(['success' => true, 'code' => $code]);
