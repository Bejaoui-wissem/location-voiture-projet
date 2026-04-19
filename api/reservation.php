<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $pdo->prepare("INSERT INTO reservations 
    (voiture_id, nom_client, telephone, date_debut, date_fin, prix_total) 
    VALUES (?, ?, ?, ?, ?, ?)");

$stmt->execute([
    $data['voiture_id'],
    $data['nom_client'],
    $data['telephone'],
    $data['date_debut'],
    $data['date_fin'],
    $data['prix_total']
]);

echo json_encode(['success' => true, 'message' => 'Reservation enregistree !']);
?>