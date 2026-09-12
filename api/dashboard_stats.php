<?php
// api/dashboard_stats.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit;
}

try {
    // Basic stats for admin dashboard

    // 1. Finance (Mocking capital for now but summing sales)
    $stmt = $pdo->query("SELECT SUM(total_amount) as total_sales FROM orders WHERE status != 'Cancelled'");
    $finance = $stmt->fetch();

    // 2. Orders
    $stmt = $pdo->query("SELECT status, COUNT(*) as count FROM orders GROUP BY status");
    $orderStats = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // 3. Inventory
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
    $totalSKUs = $stmt->fetchColumn();

    $stmt = $pdo->query("SELECT COUNT(*) as count FROM products WHERE stock_quantity <= 5 AND stock_quantity > 0");
    $lowStock = $stmt->fetchColumn();

    $stmt = $pdo->query("SELECT COUNT(*) as count FROM products WHERE stock_quantity <= 0");
    $outOfStock = $stmt->fetchColumn();

    // 4. Customers
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM customers");
    $totalCustomers = $stmt->fetchColumn();

    // 5. Requests
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM item_requests WHERE status = 'Pending'");
    $pendingRequests = $stmt->fetchColumn();

    echo json_encode([
        'status' => 'success',
        'data' => [
            'total_sales' => (float)($finance['total_sales'] ?? 0),
            'order_counts' => $orderStats,
            'inventory' => [
                'total' => (int)$totalSKUs,
                'low' => (int)$lowStock,
                'out' => (int)$outOfStock
            ],
            'customers' => (int)$totalCustomers,
            'pending_requests' => (int)$pendingRequests
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
