<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once 'env_loader.php';

$GEMINI_KEY = env('GEMINI_API_KEY');

if (!$GEMINI_KEY) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Cle API non configuree']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (empty($data['contents'])) {
    echo json_encode(['success' => false, 'message' => 'Message manquant']);
    exit;
}

$sysPrompt = "Tu es l'assistant de CharthaGo, agence tunisienne de location de voitures. Sois chaleureux, professionnel et concis (max 3 phrases). Prix : Citadines 50-70 DT/jour, Berlines 70-100 DT, SUV 90-140 DT, Premium 150+ DT. Offres : Code BIENVENUE15 (-15%), WEEKEND25 (-25%), remise auto -10% des 7 jours. Agences : Tunis, Sfax, Sousse. Reponds en francais.";

$payload = [
    'contents' => $data['contents'],
    'systemInstruction' => ['parts' => [['text' => $sysPrompt]]],
    'generationConfig' => ['temperature' => 0.7, 'maxOutputTokens' => 250]
];

$ch = curl_init('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-goog-api-key: ' . $GEMINI_KEY
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['success' => false, 'message' => 'Erreur API Gemini']);
    exit;
}

$apiData = json_decode($response, true);
$reply = $apiData['candidates'][0]['content']['parts'][0]['text'] ?? 'Desole, je n\'ai pas compris.';

echo json_encode(['success' => true, 'reply' => $reply]);