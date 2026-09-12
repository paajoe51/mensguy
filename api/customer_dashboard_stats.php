<?php
// api/customer_dashboard_stats.php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Customer') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized.']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];

    // Get customer_id for this user
    $stmt = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $customer_id = $stmt->fetchColumn();

    if (!$customer_id) {
        echo json_encode(['status' => 'success', 'data' => [
            'total_orders' => 0,
            'pending_orders' => 0,
            'active_installments' => 0,
            'total_spent' => 0,
            'recent_orders' => [],
            'recent_requests' => []
        ]]);
        exit;
    }

    // 1. Total Orders
    $totalOrders = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE customer_id = ? AND status != 'Cancelled'");
    $totalOrders->execute([$customer_id]);
    $count = $totalOrders->fetchColumn();

    // 2. Pending Orders (Awaiting delivery/processing)
    $pendingOrders = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE customer_id = ? AND status IN ('Pending', 'Approved', 'Processing', 'In Transit')");
    $pendingOrders->execute([$customer_id]);
    $pendingCount = $pendingOrders->fetchColumn();

    // 3. Active Installments
    $activeInstallments = $pdo->prepare("SELECT COUNT(*) FROM installments i JOIN orders o ON i.order_id = o.id WHERE o.customer_id = ? AND i.status = 'Active'");
    $activeInstallments->execute([$customer_id]);
    $installmentCount = $activeInstallments->fetchColumn();

    // 4. Total Spent
    $totalSpent = $pdo->prepare("SELECT SUM(amount_paid) FROM orders WHERE customer_id = ? AND status != 'Cancelled'");
    $totalSpent->execute([$customer_id]);
    $spent = $totalSpent->fetchColumn() ?: 0;

    // 5. Recent Orders
    $recentOrders = $pdo->prepare("SELECT id, order_number, created_at, total_amount, status FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 3");
    $recentOrders->execute([$customer_id]);
    $orders = $recentOrders->fetchAll();

    // 6. Recent Requests
    $recentRequests = $pdo->prepare("SELECT id, product_name, created_at, status FROM item_requests WHERE customer_id = ? ORDER BY created_at DESC LIMIT 3");
    $recentRequests->execute([$customer_id]);
    $requests = $recentRequests->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => [
            'total_orders' => (int)$count,
            'pending_orders' => (int)$pendingCount,
            'active_installments' => (int)$installmentCount,
            'total_spent' => (float)$spent,
            'recent_orders' => $orders,
            'recent_requests' => $requests
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
