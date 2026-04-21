<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$reservationId = intval($data['reservation_id'] ?? 0);

if (!$reservationId) {
    echo json_encode(['success' => false, 'message' => 'ID reservation requis']);
    exit;
}

// Verifier si contrat existe deja
$stmt = $pdo->prepare("SELECT * FROM contrats WHERE reservation_id = ?");
$stmt->execute([$reservationId]);
$existing = $stmt->fetch();

if ($existing) {
    echo json_encode(['success' => true, 'contrat' => $existing, 'deja_existe' => true]);
    exit;
}

// Recuperer les infos de la reservation
$stmt = $pdo->prepare("
    SELECT r.*, v.marque, v.modele, v.prix_jour
    FROM reservations r
    LEFT JOIN voitures v ON v.id = r.voiture_id
    WHERE r.id = ?
");
$stmt->execute([$reservationId]);
$resa = $stmt->fetch();

if (!$resa) {
    echo json_encode(['success' => false, 'message' => 'Reservation introuvable']);
    exit;
}

if ($resa['statut'] !== 'confirmee') {
    echo json_encode(['success' => false, 'message' => 'La reservation doit etre confirmee pour generer un contrat']);
    exit;
}

// Calculer nb_jours
$debut = new DateTime($resa['date_debut']);
$fin = new DateTime($resa['date_fin']);
$nbJours = $fin->diff($debut)->days;

// Generer numero contrat unique
$numeroContrat = 'CG-' . date('Y') . '-' . str_pad($reservationId, 5, '0', STR_PAD_LEFT);

// Generer immatriculation fictive
$immat = strtoupper(substr($resa['marque'], 0, 2)) . '-' . rand(1000, 9999) . '-TUN';

// Insertion
$stmt = $pdo->prepare("
    INSERT INTO contrats
    (reservation_id, numero_contrat, nom_client, telephone, email, voiture_marque, voiture_modele, voiture_immatriculation, date_debut, date_fin, prix_jour, nb_jours, prix_total, mode_paiement, agence_retrait, statut)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'actif')
");
$stmt->execute([
    $reservationId,
    $numeroContrat,
    $resa['nom_client'],
    $resa['telephone'],
    $resa['email_client'] ?? '',
    $resa['marque'],
    $resa['modele'],
    $immat,
    $resa['date_debut'],
    $resa['date_fin'],
    $resa['prix_jour'],
    $nbJours,
    $resa['prix_total'],
    $resa['mode_paiement'],
    $resa['agence_retrait']
]);

$contratId = $pdo->lastInsertId();

// Retourner le contrat complet
$stmt = $pdo->prepare("SELECT * FROM contrats WHERE id = ?");
$stmt->execute([$contratId]);
$contrat = $stmt->fetch();

echo json_encode(['success' => true, 'contrat' => $contrat]);
