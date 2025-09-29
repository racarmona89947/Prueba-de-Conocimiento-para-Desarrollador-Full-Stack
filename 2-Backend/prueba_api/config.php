<?php
// CONFIGURACIÓN DE LA CONEXIÓN DB
$db_host = '127.0.0.1';
$db_name = 'prueba_labtica';
$db_user = 'root';
$db_pass = ''; 

// INTENTO DE CONEXIÓN A LA DB
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}
