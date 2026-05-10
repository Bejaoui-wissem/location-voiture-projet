<?php
/**
 * ╔══════════════════════════════════════════════════════════╗
 *  CharthaGo — Gestionnaire CORS centralisé
 *  Inclure ce fichier EN PREMIER dans chaque endpoint API.
 *
 *  En développement  → autorise localhost (toutes variantes)
 *  En production     → autorise uniquement ALLOWED_ORIGINS
 * ╚══════════════════════════════════════════════════════════╝
 */

// ── Domaines autorisés ────────────────────────────────────────────────────────
// Ajoutez ici vos domaines de production, ex: 'https://www.charthago.tn'
define('ALLOWED_ORIGINS', [
    'http://localhost',
    'http://localhost:80',
    'http://localhost:8080',
    'http://127.0.0.1',
    'http://127.0.0.1:80',
    'http://127.0.0.1:8080',
    // ↓ Décommentez et adaptez pour la production :
    // 'https://www.charthago.tn',
    // 'https://charthago.tn',
]);

// ── Lecture de l'origine de la requête entrante ───────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, ALLOWED_ORIGINS, true)) {
    // Origine explicitement autorisée
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    // Origine inconnue : aucun header CORS envoyé → le navigateur bloquera
    // NE JAMAIS renvoyer '*' ici
}

// ── Headers communs à toutes les réponses API ─────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, Authorization');
header('Vary: Origin');   // Important pour les proxies/CDN

// ── Répondre immédiatement aux requêtes preflight OPTIONS ─────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}
