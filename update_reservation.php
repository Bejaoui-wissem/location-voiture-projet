<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
session_start();
require_once 'config.php';

// Protection admin uniquement
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Accès non autorisé']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id']) || empty($data['statut'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

$statutsValides = ['en_attente', 'confirmee', 'annulee'];
if (!in_array($data['statut'], $statutsValides)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Statut invalide']);
    exit;
}

$stmt = $pdo->prepare("UPDATE reservations SET statut = ? WHERE id = ?");
$stmt->execute([$data['statut'], intval($data['id'])]);

if ($stmt->rowCount() === 0) {
    echo json_encode(['success' => false, 'message' => 'Réservation introuvable']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Statut mis à jour']);
?>
