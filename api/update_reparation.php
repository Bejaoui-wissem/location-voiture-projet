<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$id = intval($data['id'] ?? 0);
$nouveauStatut = $data['statut'] ?? '';

if (!$id || !in_array($nouveauStatut, ['declaree','en_cours','terminee'])) {
    echo json_encode(['success' => false, 'message' => 'Donnees invalides']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM reparations WHERE id = ?");
$stmt->execute([$id]);
$rep = $stmt->fetch();
if (!$rep) {
    echo json_encode(['success' => false, 'message' => 'Reparation introuvable']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Mettre a jour la reparation
    $params = [$nouveauStatut];
    $sql = "UPDATE reparations SET statut = ?";

    if ($nouveauStatut === 'en_cours' && !$rep['date_debut']) {
        $sql .= ", date_debut = NOW()";
        // Voiture passe en reparation
        $pdo->prepare("UPDATE voitures SET statut = 'en_reparation' WHERE id = ?")
            ->execute([$rep['voiture_id']]);
    }

    if ($nouveauStatut === 'terminee') {
        $sql .= ", date_fin = NOW()";
        if (isset($data['cout_reel']) && $data['cout_reel'] !== '') {
            $sql .= ", cout_reel = ?";
            $params[] = floatval($data['cout_reel']);
        }
        // Voiture redevient disponible auto
        $pdo->prepare("UPDATE voitures SET statut = 'disponible' WHERE id = ?")
            ->execute([$rep['voiture_id']]);
    }

    if (!empty($data['notes_technicien'])) {
        $sql .= ", notes_technicien = ?";
        $params[] = htmlspecialchars(trim($data['notes_technicien']));
    }

    $sql .= " WHERE id = ?";
    $params[] = $id;

    $pdo->prepare($sql)->execute($params);

    $pdo->commit();
    echo json_encode(['success' => true, 'statut' => $nouveauStatut]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
