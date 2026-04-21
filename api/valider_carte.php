<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$data = json_decode(file_get_contents('php://input'), true);
$numero = preg_replace('/\s+/', '', $data['numero'] ?? '');
$cvv = $data['cvv'] ?? '';
$expire = $data['expire'] ?? '';

// Validation format
if (strlen($numero) !== 16 || !ctype_digit($numero)) {
    echo json_encode(['valide' => false, 'message' => 'Numero de carte invalide (16 chiffres requis)']);
    exit;
}

// Algorithme de Luhn (vrai check de validite)
function luhn($num) {
    $sum = 0; $alt = false;
    for ($i = strlen($num)-1; $i >= 0; $i--) {
        $n = (int)$num[$i];
        if ($alt) { $n *= 2; if ($n > 9) $n -= 9; }
        $sum += $n; $alt = !$alt;
    }
    return $sum % 10 === 0;
}

if (!luhn($numero)) {
    echo json_encode(['valide' => false, 'message' => 'Numero de carte invalide (checksum incorrect)']);
    exit;
}

if (strlen($cvv) !== 3 || !ctype_digit($cvv)) {
    echo json_encode(['valide' => false, 'message' => 'CVV invalide (3 chiffres)']);
    exit;
}

if (!preg_match('/^(0[1-9]|1[0-2])\/([0-9]{2})$/', $expire, $m)) {
    echo json_encode(['valide' => false, 'message' => 'Date expiration invalide (MM/YY)']);
    exit;
}

$mois = (int)$m[1];
$annee = 2000 + (int)$m[2];
$moisActuel = (int)date('n');
$anneeActuelle = (int)date('Y');

if ($annee < $anneeActuelle || ($annee === $anneeActuelle && $mois < $moisActuel)) {
    echo json_encode(['valide' => false, 'message' => 'Carte expiree']);
    exit;
}

// Type de carte (detection simple)
$type = 'Inconnue';
if (preg_match('/^4/', $numero)) $type = 'Visa';
elseif (preg_match('/^5[1-5]/', $numero)) $type = 'Mastercard';
elseif (preg_match('/^3[47]/', $numero)) $type = 'American Express';

echo json_encode([
    'valide' => true,
    'type' => $type,
    'masque' => '**** **** **** ' . substr($numero, -4),
    'message' => 'Carte validee avec succes'
]);
