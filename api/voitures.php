<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM voitures ORDER BY id ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Changement de statut — réservé à l'admin
    session_start();
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Accès non autorisé']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['id']) || empty($data['statut'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Données manquantes']);
        exit;
    }

    $statutsValides = ['disponible', 'louee'];
    if (!in_array($data['statut'], $statutsValides)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Statut invalide']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE voitures SET statut = ? WHERE id = ?");
    $stmt->execute([$data['statut'], intval($data['id'])]);
    echo json_encode(['success' => true]);
}
?>
