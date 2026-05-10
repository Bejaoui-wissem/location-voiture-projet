<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);

if (!$id) {
    echo json_encode(['success' => false]);
    exit;
}

$stmt = $pdo->prepare("UPDATE depot_comptable SET lu_par_admin = 1, date_lecture = NOW() WHERE id = ?");
$stmt->execute([$id]);
echo json_encode(['success' => true]);
