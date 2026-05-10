<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$required = ['voiture_id', 'type', 'description', 'technicien_id', 'technicien_nom'];
foreach ($required as $f) {
    if (empty($data[$f])) {
        echo json_encode(['success' => false, 'message' => "Champ manquant : $f"]);
        exit;
    }
}

$voitureId = intval($data['voiture_id']);
$type = $data['type'];
if (!in_array($type, ['accident','panne','maintenance'])) {
    echo json_encode(['success' => false, 'message' => 'Type invalide']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM voitures WHERE id = ?");
$stmt->execute([$voitureId]);
$voiture = $stmt->fetch();
if (!$voiture) {
    echo json_encode(['success' => false, 'message' => 'Voiture introuvable']);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO reparations 
        (voiture_id, incident_id, type, description, localisation, cout_estime, technicien_id, technicien_nom, statut, photos, notes_technicien)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'declaree', ?, ?)
    ");
    $stmt->execute([
        $voitureId,
        !empty($data['incident_id']) ? intval($data['incident_id']) : null,
        $type,
        htmlspecialchars(trim($data['description'])),
        htmlspecialchars(trim($data['localisation'] ?? '')),
        floatval($data['cout_estime'] ?? 0),
        intval($data['technicien_id']),
        htmlspecialchars(trim($data['technicien_nom'])),
        htmlspecialchars(trim($data['photos'] ?? '')),
        htmlspecialchars(trim($data['notes_technicien'] ?? ''))
    ]);

    $reparationId = $pdo->lastInsertId();

    $nouveauStatut = ($type === 'accident') ? 'accidentee' : 'en_panne';
    $pdo->prepare("UPDATE voitures SET statut = ? WHERE id = ?")
        ->execute([$nouveauStatut, $voitureId]);

    $pdo->commit();
    echo json_encode([
        'success' => true,
        'id' => $reparationId,
        'voiture_statut' => $nouveauStatut
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
