<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';
session_start();

if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Ikke autoriseret']);
    exit;
}

if (!isset($_FILES['billede'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Ingen fil modtaget']);
    exit;
}

$file = $_FILES['billede'];
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowed)) {
    http_response_code(400);
    echo json_encode(['error' => 'Kun billedfiler er tilladt']);
    exit;
}

if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'Filen er for stor (max 5MB)']);
    exit;
}

$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$filename = time() . '_' . rand(1000, 9999) . '.' . $ext;
$destination = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    echo json_encode(['url' => '/uploads/' . $filename]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Kunne ikke uploade fil']);
}
