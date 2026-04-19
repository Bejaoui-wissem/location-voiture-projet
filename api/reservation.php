<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validation côté serveur
$required = ['voiture_id', 'nom_client', 'telephone', 'date_debut', 'date_fin', 'prix_total'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Champ manquant : $field"]);
        exit;
    }
}

// Validation des dates
$debut = new DateTime($data['date_debut']);
$fin   = new DateTime($data['date_fin']);
if ($fin <= $debut) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'La date de fin doit être après la date de début.']);
    exit;
}

// Validation prix positif
if (floatval($data['prix_total']) <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Prix total invalide.']);
    exit;
}

// Validation voiture_id entier
if (!is_numeric($data['voiture_id']) || intval($data['voiture_id']) <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Identifiant voiture invalide.']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO reservations (voiture_id, nom_client, telephone, date_debut, date_fin, prix_total)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    intval($data['voiture_id']),
    htmlspecialchars(trim($data['nom_client'])),
    htmlspecialchars(trim($data['telephone'])),
    $data['date_debut'],
    $data['date_fin'],
    floatval($data['prix_total'])
]);

echo json_encode(['success' => true, 'message' => 'Réservation enregistrée !', 'id' => $pdo->lastInsertId()]);
?>
