<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$technicienId = isset($_GET['technicien_id']) ? intval($_GET['technicien_id']) : null;
$statut = $_GET['statut'] ?? null;

$sql = "
    SELECT r.*, v.marque, v.modele, v.image_url
    FROM reparations r
    LEFT JOIN voitures v ON v.id = r.voiture_id
    WHERE 1=1
";
$params = [];

if ($technicienId) {
    $sql .= " AND r.technicien_id = ?";
    $params[] = $technicienId;
}

if ($statut && in_array($statut, ['declaree','en_cours','terminee'])) {
    $sql .= " AND r.statut = ?";
    $params[] = $statut;
}

$sql .= " ORDER BY r.date_declaration DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
