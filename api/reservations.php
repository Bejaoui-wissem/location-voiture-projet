<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
session_start();
require_once 'config.php';

// Protection : seul l'admin peut accéder
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Accès non autorisé']);
    exit;
}

$stmt = $pdo->query("
    SELECT r.*, v.marque, v.modele
    FROM reservations r
    LEFT JOIN voitures v ON r.voiture_id = v.id
    ORDER BY r.created_at DESC
");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
