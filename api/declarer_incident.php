<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$required = ['reservation_id', 'type', 'description'];
foreach ($required as $f) {
    if (empty($data[$f])) {
        echo json_encode(['success' => false, 'message' => "Champ manquant : $f"]);
        exit;
    }
}

$resaId = intval($data['reservation_id']);
$type = $data['type'];

if (!in_array($type, ['accident','panne'])) {
    echo json_encode(['success' => false, 'message' => 'Type invalide']);
    exit;
}

// Recuperer la reservation
$stmt = $pdo->prepare("SELECT * FROM reservations WHERE id = ?");
$stmt->execute([$resaId]);
$resa = $stmt->fetch();
if (!$resa) {
    echo json_encode(['success' => false, 'message' => 'Reservation introuvable']);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO incidents
        (reservation_id, voiture_id, type, description, localisation, latitude, longitude, photo, nom_client, telephone, statut)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'declare')
    ");
    $stmt->execute([
        $resaId,
        $resa['voiture_id'],
        $type,
        htmlspecialchars(trim($data['description'])),
        htmlspecialchars(trim($data['localisation'] ?? '')),
        !empty($data['latitude']) ? floatval($data['latitude']) : null,
        !empty($data['longitude']) ? floatval($data['longitude']) : null,
        htmlspecialchars(trim($data['photo'] ?? '')),
        $resa['nom_client'],
        $resa['telephone']
    ]);

    $incidentId = $pdo->lastInsertId();

    // Mettre la voiture en panne/accident
    $nouveauStatut = ($type === 'accident') ? 'accidentee' : 'en_panne';
    $pdo->prepare("UPDATE voitures SET statut = ? WHERE id = ?")
        ->execute([$nouveauStatut, $resa['voiture_id']]);

    $pdo->commit();
    echo json_encode(['success' => true, 'id' => $incidentId]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
