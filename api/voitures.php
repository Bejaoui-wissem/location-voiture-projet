<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config.php';

$stmt = $pdo->query("SELECT * FROM voitures");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>