<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$resaId = isset($_GET['reservation_id']) ? intval($_GET['reservation_id']) : null;

if ($resaId) {
    $stmt = $pdo->prepare("
        SELECT i.*, v.marque, v.modele 
        FROM incidents i 
        LEFT JOIN voitures v ON v.id = i.voiture_id 
        WHERE i.reservation_id = ? 
        ORDER BY i.date_incident DESC
    ");
    $stmt->execute([$resaId]);
} else {
    $stmt = $pdo->query("
        SELECT i.*, v.marque, v.modele 
        FROM incidents i 
        LEFT JOIN voitures v ON v.id = i.voiture_id 
        ORDER BY i.date_incident DESC
    ");
}
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
