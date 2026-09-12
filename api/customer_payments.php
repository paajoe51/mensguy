<?php
// api/customer_payments.php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Customer') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized.']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];

    // Get customer_id
    $stmt = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $customer_id = $stmt->fetchColumn();

    if (!$customer_id) {
        echo json_encode(['status' => 'success', 'data' => [], 'summary' => [
            'total_paid' => 0,
            'outstanding' => 0,
            'transaction_count' => 0
        ]]);
        exit;
    }

    // 1. Payment Summary
    $sumStmt = $pdo->prepare("SELECT SUM(amount_paid) as total_paid, SUM(outstanding_balance) as total_outstanding FROM orders WHERE customer_id = ? AND status != 'Cancelled'");
    $sumStmt->execute([$customer_id]);
    $summary = $sumStmt->fetch();

    // 2. Transaction List
    $listStmt = $pdo->prepare("
        SELECT p.*, o.order_number 
        FROM payments p 
        JOIN orders o ON p.order_id = o.id 
        WHERE p.customer_id = ? 
        ORDER BY p.created_at DESC
    ");
    $listStmt->execute([$customer_id]);
    $payments = $listStmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $payments,
        'summary' => [
            'total_paid' => (float)($summary['total_paid'] ?? 0),
            'outstanding' => (float)($summary['total_outstanding'] ?? 0),
            'transaction_count' => count($payments)
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
