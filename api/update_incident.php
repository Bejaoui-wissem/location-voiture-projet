<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);
$statut = $data['statut'] ?? '';

if (!$id || !in_array($statut, ['declare','traite','resolu'])) {
    echo json_encode(['success' => false, 'message' => 'Donnees invalides']);
    exit;
}

$stmt = $pdo->prepare("UPDATE incidents SET statut = ? WHERE id = ?");
$stmt->execute([$statut, $id]);

echo json_encode(['success' => true]);
