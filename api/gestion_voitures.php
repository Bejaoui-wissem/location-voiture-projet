<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();
require_once 'config.php';

// Protection admin (désactivée en dev local — réactiver en production)
// if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
//     http_response_code(403);
//     echo json_encode(['success' => false, 'message' => 'Accès non autorisé']);
//     exit;
// }

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

switch ($action) {

    // ── Créer une voiture ─────────────────────────────────
    case 'create':
        $marque    = htmlspecialchars(trim($data['marque'] ?? ''));
        $modele    = htmlspecialchars(trim($data['modele'] ?? ''));
        $prix_jour = floatval($data['prix_jour'] ?? 0);
        $statut    = in_array($data['statut'] ?? '', ['disponible','louee']) ? $data['statut'] : 'disponible';
        $image_url = trim($data['image_url'] ?? '');

        if (!$marque || !$modele || $prix_jour <= 0) {
            echo json_encode(['success' => false, 'message' => 'Données invalides']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO voitures (marque, modele, prix_jour, statut, image_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$marque, $modele, $prix_jour, $statut, $image_url ?: null]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'Véhicule ajouté !']);
        break;

    // ── Modifier une voiture ──────────────────────────────
    case 'update':
        $id        = intval($data['id'] ?? 0);
        $marque    = htmlspecialchars(trim($data['marque'] ?? ''));
        $modele    = htmlspecialchars(trim($data['modele'] ?? ''));
        $prix_jour = floatval($data['prix_jour'] ?? 0);
        $statut    = in_array($data['statut'] ?? '', ['disponible','louee']) ? $data['statut'] : 'disponible';
        $image_url = trim($data['image_url'] ?? '');

        if (!$id || !$marque || !$modele || $prix_jour <= 0) {
            echo json_encode(['success' => false, 'message' => 'Données invalides']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE voitures SET marque=?, modele=?, prix_jour=?, statut=?, image_url=? WHERE id=?");
        $stmt->execute([$marque, $modele, $prix_jour, $statut, $image_url ?: null, $id]);

        if ($stmt->rowCount() === 0) {
            echo json_encode(['success' => false, 'message' => 'Véhicule introuvable']);
            exit;
        }
        echo json_encode(['success' => true, 'message' => 'Véhicule modifié !']);
        break;

    // ── Supprimer une voiture ─────────────────────────────
    case 'delete':
        $id = intval($data['id'] ?? 0);
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID invalide']);
            exit;
        }

        // Vérifier qu'aucune réservation active n'est liée
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE voiture_id = ? AND statut = 'confirmee'");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Impossible de supprimer : des réservations confirmées sont liées à ce véhicule.']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM voitures WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Véhicule supprimé.']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Action inconnue']);
}
?>
