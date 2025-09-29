<?php
// CONFIGURACIÓN DE RESPUESTAS
// Se indica que la respuesta será en formato JSON con codificación UTF-8
header("Content-Type: application/json; charset=UTF-8");
// Configuración de CORS (permite que otros dominios accedan a esta API)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Si la petición es de tipo OPTIONS (preflight de CORS), respondemos 200 y terminamos
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// CONEXIÓN A LA BASE DE DATOS
// Se incluye el archivo config.php donde está la conexión PDO
require_once __DIR__ . '/config.php';

// DETECCIÓN DEL MÉTODO HTTP
// Obtenemos el método de la solicitud (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];
// Si viene un parámetro id en la URL (?id=), lo convertimos a número entero
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
// Leemos el cuerpo de la petición (JSON enviado desde el frontend) y lo convertimos a array
$input = json_decode(file_get_contents('php://input'), true);

// MANEJO DE RUTAS SEGÚN MÉTODO
try {
    if ($method === 'GET') {
        // ------- MÉTODO GET -------
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM items WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch();
            if ($item) echo json_encode($item);
            else {
                http_response_code(404);
                echo json_encode(['error' => 'Item no encontrado']);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM items ORDER BY created_at DESC");
            $items = $stmt->fetchAll();
            echo json_encode($items);
        }
    } elseif ($method === 'POST') {
        // ------- MÉTODO POST (crear nuevo item) -------
        $nombre = isset($input['nombre']) ? trim($input['nombre']) : '';
        $descripcion = isset($input['descripcion']) ? trim($input['descripcion']) : '';

        if ($nombre === '') {
            http_response_code(400);
            echo json_encode(['error' => 'El campo nombre es obligatorio']);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO items (nombre, descripcion) VALUES (?, ?)");
        $stmt->execute([$nombre, $descripcion]);
        $newId = $pdo->lastInsertId();
        http_response_code(201);
        echo json_encode(['id' => $newId, 'nombre' => $nombre, 'descripcion' => $descripcion]);
    } elseif ($method === 'PUT') {
        // ------- MÉTODO PUT (actualizar item existente) -------
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta id en la URL (?id=)']);
            exit;
        }
        $nombre = isset($input['nombre']) ? trim($input['nombre']) : '';
        $descripcion = isset($input['descripcion']) ? trim($input['descripcion']) : '';

        if ($nombre === '') {
            http_response_code(400);
            echo json_encode(['error' => 'El campo nombre es obligatorio']);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE items SET nombre = ?, descripcion = ? WHERE id = ?");
        $stmt->execute([$nombre, $descripcion, $id]);
        echo json_encode(['id' => $id, 'nombre' => $nombre, 'descripcion' => $descripcion]);
    } elseif ($method === 'DELETE') {
        // ------- MÉTODO DELETE (eliminar item) -------
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta id en la URL (?id=)']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM items WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['result' => 'Eliminado', 'id' => $id]);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
} catch (PDOException $e) {
    // Si ocurre un error con la base de datos, lo capturamos aquí
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
