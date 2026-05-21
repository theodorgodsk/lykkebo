<?php
header('Content-Type: application/json; charset=utf-8');
$file = __DIR__ . '/../indhold.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Kunne ikke læse indhold']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once 'config.php';
    session_start();
    if (!isset($_SESSION['admin_logged_in'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Ikke autoriseret']);
        exit;
    }
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Ugyldigt JSON']);
        exit;
    }
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['ok' => true]);
    exit;
}
