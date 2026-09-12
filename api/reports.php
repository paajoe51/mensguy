<?php
// api/reports.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$type = $_GET['type'] ?? 'sales';

try {
    if ($type === 'sales') {
        // 1. KPI: Quarterly Revenue (past 90 days)
        $qRevenue = $pdo->query("SELECT SUM(total_amount) FROM orders WHERE status NOT IN ('Cancelled', 'Refunded') AND created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)")->fetchColumn() ?: 0;

        // 2. KPI: Average Order Value
        $aov = $pdo->query("SELECT AVG(total_amount) FROM orders WHERE status NOT IN ('Cancelled', 'Refunded')")->fetchColumn() ?: 0;

        // 3. Trends: Daily Revenue (past 30 days)
        $trends = $pdo->query("SELECT DATE(created_at) as label, SUM(total_amount) as value FROM orders WHERE status NOT IN ('Cancelled', 'Refunded') AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY label ASC")->fetchAll();

        echo json_encode([
            'status' => 'success',
            'data' => [
                'kpi' => [
                    'quarterly_revenue' => (float)$qRevenue,
                    'aov' => (float)$aov,
                    'conversion_rate' => 3.45, // Mocked for now, requires traffic logs
                    'forecast' => $qRevenue * 1.15
                ],
                'trends' => $trends
            ]
        ]);
    } elseif ($type === 'inventory') {
        // 1. KPI: Warehouse Value (Retail & Wholesale)
        $stockValue = $pdo->query("SELECT SUM(retail_price * stock_quantity) as retail, SUM(wholesale_price * stock_quantity) as wholesale FROM products WHERE status = 'active'")->fetch();

        // 2. Category Distribution
        $distribution = $pdo->query("SELECT c.name, COUNT(p.id) as count, SUM(p.retail_price * p.stock_quantity) as value FROM categories c JOIN products p ON p.category_id = c.id WHERE p.status = 'active' GROUP BY c.id")->fetchAll();

        // 3. Low Stock Items
        $lowStock = $pdo->query("SELECT name, stock_quantity as stock, retail_price FROM products WHERE stock_quantity <= 5 AND status = 'active' ORDER BY stock_quantity ASC LIMIT 10")->fetchAll();

        echo json_encode([
            'status' => 'success',
            'data' => [
                'kpi' => [
                    'warehouse_value' => (float)($stockValue['retail'] ?: 0),
                    'stock_turnover' => 4.2, // Mocked
                    'depreciation_risk' => 1.8 // Mocked
                ],
                'distribution' => $distribution,
                'low_stock' => $lowStock
            ]
        ]);
    } elseif ($type === 'customers') {
        // 1. KPI: Lifetime Value (LTV)
        $avgLtv = $pdo->query("SELECT AVG(total_spend) FROM (SELECT SUM(total_amount) as total_spend FROM orders GROUP BY customer_id) as ltv")->fetchColumn() ?: 0;

        // 2. Monthly Acquisitions
        $newAcquisitions = $pdo->query("SELECT COUNT(*) FROM customers WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetchColumn() ?: 0;

        // 3. Top Customers
        $topCustomers = $pdo->query("SELECT CONCAT(c.first_name, ' ', c.last_name) as name, COUNT(o.id) as orders, SUM(o.total_amount) as value FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.id ORDER BY value DESC LIMIT 10")->fetchAll();

        echo json_encode([
            'status' => 'success',
            'data' => [
                'kpi' => [
                    'retention_rate' => 68.4, // Mocked
                    'acquisitions' => (int)$newAcquisitions,
                    'avg_ltv' => (float)$avgLtv
                ],
                'top_customers' => $topCustomers
            ]
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Unknown report type']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
