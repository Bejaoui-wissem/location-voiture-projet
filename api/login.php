<?php
header('Content-Type: application/json');
session_start();
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
$stmt->execute([$data['email']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($data['password'], $user['mot_de_passe'])) {
    $_SESSION['user'] = $user;
    echo json_encode(['succ