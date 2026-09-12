<?php
// api/upload_image.php – Handles product image uploads
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No valid image file uploaded.']);
    exit;
}

$productName = $_POST['product_name'] ?? 'product';
$productId   = $_POST['product_id'] ?? null;

// Sanitise the product name for a safe filename
$safeName = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $productName));
$safeName = trim($safeName, '-');
$date     = date('Ymd-His');
$ext      = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));

// Validate extension
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
if (!in_array($ext, $allowed)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file type. Allowed: jpg, jpeg, png, webp, gif.']);
    exit;
}

// Validate size (max 5MB)
if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'File too large. Maximum 5MB allowed.']);
    exit;
}

// Build upload path — stored under public/uploads/products/
$uploadDir = __DIR__ . '/../public/uploads/products/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

$filename    = "{$safeName}_{$date}.{$ext}";
$destination = $uploadDir . $filename;

if (!move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save the uploaded file.']);
    exit;
}

// The public URL path that Next.js will serve from /public
$publicPath = "/uploads/products/{$filename}";

// If a product ID was provided, update the images column straight away
if ($productId) {
    try {
        // Store as a JSON array so the schema can hold multiple images later
        $stmt = $pdo->prepare("UPDATE products SET images = ? WHERE id = ?");
        $stmt->execute([json_encode([$publicPath]), $productId]);
    } catch (Exception $e) {
        // Non-fatal – the path is still returned so the front-end can handle it
    }
}

echo json_encode([
    'status'   => 'success',
    'message'  => 'Image uploaded successfully.',
    'path'     => $publicPath,
    'filename' => $filename,
]);
