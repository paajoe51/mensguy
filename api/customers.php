<?php
// api/customers/index.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        try {
            if ($id) {
                // Fetch detailed customer profile
                $stmt = $pdo->prepare("
                    SELECT c.*, u.email, u.status as user_status 
                    FROM customers c 
                    JOIN users u ON c.user_id = u.id 
                    WHERE c.id = ?
                ");
                $stmt->execute([$id]);
                $customer = $stmt->fetch();

                if ($customer) {
                    // Aggregated metrics
                    $stmtStats = $pdo->prepare("
                        SELECT 
                            COUNT(*) as orders_count,
                            SUM(total_amount) as total_spent
                        FROM orders 
                        WHERE customer_id = ? AND status != 'Cancelled'
                    ");
                    $stmtStats->execute([$id]);
                    $stats = $stmtStats->fetch();

                    $customer['orders_count'] = (int)($stats['orders_count'] ?? 0);
                    $customer['total_spent'] = (float)($stats['total_spent'] ?? 0);
                    $customer['outstanding_balance'] = 0; // Simplified for now

                    // Recent Orders
                    $stmtOrders = $pdo->prepare("
                        SELECT id, order_number, created_at, total_amount, status 
                        FROM orders 
                        WHERE customer_id = ? 
                        ORDER BY created_at DESC LIMIT 5
                    ");
                    $stmtOrders->execute([$id]);
                    $customer['recent_orders'] = $stmtOrders->fetchAll();

                    echo json_encode(['status' => 'success', 'data' => $customer]);
                } else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Customer not found.']);
                }
            } else {
                // List all customers with aggregate metrics
                $stmt = $pdo->query("
                    SELECT 
                        c.*, 
                        u.email, 
                        u.status as user_status,
                        (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id AND o.status != 'Cancelled') as orders_count,
                        (SELECT SUM(total_amount) FROM orders o WHERE o.customer_id = c.id AND o.status != 'Cancelled') as total_spent
                    FROM customers c 
                    JOIN users u ON c.user_id = u.id 
                    ORDER BY c.created_at DESC
                ");
                $customers = $stmt->fetchAll();

                // Cast types
                foreach ($customers as &$cust) {
                    $cust['orders_count'] = (int)($cust['orders_count'] ?? 0);
                    $cust['total_spent'] = (float)($cust['total_spent'] ?? 0);
                    $cust['outstanding_balance'] = 0; // Simplified for now
                }

                echo json_encode(['status' => 'success', 'data' => $customers]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

        // Update customer profile
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Customer ID required.']);
            exit;
        }

        // Security: Customer can only update their own profile
        if ($_SESSION['role'] === 'Customer') {
            $stmt = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $owner = $stmt->fetch();
            if (!$owner || $owner['id'] != $id) {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Access denied.']);
                exit;
            }
        }

        try {
            $stmt = $pdo->prepare("UPDATE customers SET first_name=?, last_name=?, phone=?, address=? WHERE id=?");
            $stmt->execute([$data['first_name'], $data['last_name'], $data['phone'], $data['address'], $id]);
            echo json_encode(['status' => 'success', 'message' => 'Customer profile updated.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
        break;
}
