<?php
/**
 * CharthaGo — api/csrf_token.php
 *
 * Endpoint public appelé par le JS au chargement de chaque page.
 * Retourne le token CSRF de session sous forme JSON.
 *
 * Usage côté JS :
 *   const { token } = await fetch('api/csrf_token.php').then(r => r.json());
 *   // Stocker dans window.csrfToken et l'inclure dans chaque POST
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials: true');

session_start();
require_once __DIR__ . '/csrf.php';

echo json_encode([
    'token' => csrf_get_token()
]);
