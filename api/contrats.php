<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$reservationId = isset($_GET['reservation_id']) ? intval($_GET['reservation_id']) : null;
$contratId = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($contratId) {
    $stmt = $pdo->prepare("SELECT * FROM contrats WHERE id = ?");
    $stmt->execute([$contratId]);
    $contrat = $stmt->fetch();
    echo json_encode($contrat ?: null);
} elseif ($reservationId) {
    $stmt = $pdo->prepare("SELECT * FROM contrats WHERE reservation_id = ?");
    $stmt->execute([$reservationId]);
    $contrat = $stmt->fetch();
    echo json_encode($contrat ?: null);
} else {
    $stmt = $pdo->prepare("SELECT * FROM contrats ORDER BY created_at DESC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll());
}
