<?php
// ============================================
// Script auto de mise a jour des statuts
// A appeler au chargement de chaque page admin (simule un cron)
// ============================================
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config.php';

$updates = [];

try {
    // 1) Annuler les reservations non retirees apres 48h
    $stmt = $pdo->prepare("
        UPDATE reservations
        SET statut = 'annulee'
        WHERE statut = 'en_attente'
        AND date_limite_retrait < NOW()
        AND mode_paiement = 'sur_place'
    ");
    $stmt->execute();
    $updates['annulees_48h'] = $stmt->rowCount();

    // 2) Les voitures dont la reservation confirmee est active -> louee
    $stmt = $pdo->prepare("
        UPDATE voitures v
        INNER JOIN reservations r ON r.voiture_id = v.id
        SET v.statut = 'louee'
        WHERE r.statut = 'confirmee'
        AND r.date_debut <= CURDATE()
        AND r.date_fin >= CURDATE()
    ");
    $stmt->execute();
    $updates['voitures_louees'] = $stmt->rowCount();

    // 3) Les voitures dont la reservation est terminee (date_fin passee) -> disponible
    $stmt = $pdo->prepare("
        UPDATE voitures v
        SET v.statut = 'disponible'
        WHERE v.statut = 'louee'
        AND NOT EXISTS (
            SELECT 1 FROM reservations r
            WHERE r.voiture_id = v.id
            AND r.statut = 'confirmee'
            AND r.date_debut <= CURDATE()
            AND r.date_fin >= CURDATE()
        )
    ");
    $stmt->execute();
    $updates['voitures_liberees'] = $stmt->rowCount();

    echo json_encode(['success' => true, 'updates' => $updates]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
