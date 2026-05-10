<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
$role = $_GET['role'] ?? 'admin';

if ($role === 'comptable' && $userId) {
    $stmt = $pdo->prepare("SELECT * FROM depot_comptable WHERE user_id = ? ORDER BY date_depot DESC");
    $stmt->execute([$userId]);
} else {
    $stmt = $pdo->query("SELECT * FROM depot_comptable ORDER BY date_depot DESC");
}

$depots = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->query("SELECT COUNT(*) as nb FROM depot_comptable WHERE lu_par_admin = 0");
$nonLus = $stmt->fetch()['nb'];

echo json_encode(['depots' => $depots, 'non_lus' => intval($nonLus)]);
