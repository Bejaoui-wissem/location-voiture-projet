<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$required = ['voiture_id', 'nom_client', 'telephone', 'date_debut', 'date_fin', 'prix_total', 'mode_paiement', 'agence_retrait'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Champ manquant : $field"]);
        exit;
    }
}

$debut = new DateTime($data['date_debut']);
$fin   = new DateTime($data['date_fin']);
if ($fin <= $debut) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Date fin doit etre apres date debut.']);
    exit;
}

$mode = $data['mode_paiement'];
if (!in_array($mode, ['sur_place', 'carte_bancaire'])) {
    echo json_encode(['success' => false, 'message' => 'Mode de paiement invalide']);
    exit;
}

$paiementValide = 0;
$numeroCarte = null;
if ($mode === 'carte_bancaire') {
    $numero = preg_replace('/\s+/', '', $data['numero_carte'] ?? '');
    if (strlen($numero) !== 16 || !ctype_digit($numero)) {
        echo json_encode(['success' => false, 'message' => 'Numero de carte invalide']);
        exit;
    }
    $paiementValide = 1;
    $numeroCarte = '**** **** **** ' . substr($numero, -4);
}

$agence = $data['agence_retrait'];
if (!in_array($agence, ['Tunis', 'Sfax', 'Sousse'])) {
    echo json_encode(['success' => false, 'message' => 'Agence invalide']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM voitures WHERE id = ?");
$stmt->execute([intval($data['voiture_id'])]);
$voiture = $stmt->fetch();

if (!$voiture) {
    echo json_encode(['success' => false, 'message' => 'Voiture introuvable']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT COUNT(*) as conflits FROM reservations
    WHERE voiture_id = ? AND statut != 'annulee'
    AND NOT (date_fin < ? OR date_debut > ?)
");
$stmt->execute([intval($data['voiture_id']), $data['date_debut'], $data['date_fin']]);
$result = $stmt->fetch();

if ($result['conflits'] > 0) {
    echo json_encode(['success' => false, 'message' => 'Cette voiture est deja reservee sur ces dates']);
    exit;
}

$dateLimite = date('Y-m-d H:i:s', strtotime('+48 hours'));

$stmt = $pdo->prepare("
    INSERT INTO reservations
    (voiture_id, nom_client, telephone, email_client, date_debut, date_fin, prix_total, mode_paiement, numero_carte, paiement_valide, agence_retrait, date_limite_retrait)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([
    intval($data['voiture_id']),
    htmlspecialchars(trim($data['nom_client'])),
    htmlspecialchars(trim($data['telephone'])),
    htmlspecialchars(trim($data['email_client'] ?? '')),
    $data['date_debut'],
    $data['date_fin'],
    floatval($data['prix_total']),
    $mode,
    $numeroCarte,
    $paiementValide,
    $agence,
    $dateLimite
]);

$reservationId = $pdo->lastInsertId();

echo json_encode([
    'success' => true,
    'message' => 'Reservation enregistree',
    'id' => $reservationId,
    'date_limite_retrait' => $dateLimite
]);
