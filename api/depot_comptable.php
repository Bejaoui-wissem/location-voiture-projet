<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'POST requis']);
    exit;
}

$userId = intval($_POST['user_id'] ?? 0);
$userNom = $_POST['user_nom'] ?? '';
$categorie = $_POST['categorie'] ?? '';
$mois = !empty($_POST['mois']) ? intval($_POST['mois']) : null;
$annee = intval($_POST['annee'] ?? date('Y'));
$commentaire = $_POST['commentaire'] ?? '';

$categoriesValides = ['CNSS','CNRPS','RNE','bilan_mensuel','bilan_annuel','penalite','autre'];
if (!in_array($categorie, $categoriesValides)) {
    echo json_encode(['success' => false, 'message' => 'Categorie invalide']);
    exit;
}

if (!isset($_FILES['fichier']) || $_FILES['fichier']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Fichier manquant ou erreur']);
    exit;
}

$file = $_FILES['fichier'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$extAutorisees = ['pdf','xlsx','xls','jpg','jpeg','png','docx','doc','csv'];

if (!in_array($ext, $extAutorisees)) {
    echo json_encode(['success' => false, 'message' => 'Extension non autorisee. Acceptes : ' . implode(', ', $extAutorisees)]);
    exit;
}

if ($file['size'] > 10 * 1024 * 1024) { // 10 MB max
    echo json_encode(['success' => false, 'message' => 'Fichier trop gros (max 10 Mo)']);
    exit;
}

// Creer le dossier si n'existe pas
$uploadDir = __DIR__ . '/../uploads/comptable/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Nom unique pour eviter les collisions
$nomFichier = uniqid('doc_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file['name']);
$chemin = $uploadDir . $nomFichier;
$cheminRelatif = 'uploads/comptable/' . $nomFichier;

if (!move_uploaded_file($file['tmp_name'], $chemin)) {
    echo json_encode(['success' => false, 'message' => 'Erreur upload']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO depot_comptable
    (user_id, user_nom, nom_fichier, chemin, taille_fichier, categorie, mois, annee, commentaire)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([
    $userId,
    htmlspecialchars($userNom),
    htmlspecialchars($file['name']),
    $cheminRelatif,
    $file['size'],
    $categorie,
    $mois,
    $annee,
    htmlspecialchars($commentaire)
]);

echo json_encode([
    'success' => true,
    'id' => $pdo->lastInsertId(),
    'message' => 'Document depose avec succes'
]);
