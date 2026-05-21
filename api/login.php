<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (isset($body['password']) && $body['password'] === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Forkert kodeord']);
    }
    exit;
}
