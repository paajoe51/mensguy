<?php
// api/orders.php
require_once 'config.php';
require_once __DIR__ . '/access_control/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $customer_id = $_GET['customer_id'] ?? null;

        try {
            if ($id) {
                // Require auth to view order
                $authUser = requireAuth();

                $stmt = $pdo->prepare("
                    SELECT o.*, 
                           c.first_name, c.last_name, c.phone, c.address, u.email
                    FROM orders o 
                    JOIN customers c ON o.customer_id = c.id 
                    JOIN users u ON c.user_id = u.id
                    WHERE o.id = ?
                ");
                $stmt->execute([$id]);
                $order = $stmt->fetch();

                if ($order) {
                    // Restrict customer from viewing other customers' orders
                    if ($authUser['role'] === 'Customer' && $authUser['customer_id'] != $order['customer_id']) {
                        http_response_code(403);
                        echo json_encode(['status' => 'error', 'message' => 'Forbidden. You do not own this order.']);
                        exit;
                    }

                    $itemStmt = $pdo->prepare("
                        SELECT oi.*, p.name 
                        FROM order_items oi 
                        LEFT JOIN products p ON oi.product_id = p.id 
                        WHERE oi.order_id = ?
                    ");
                    $itemStmt->execute([$id]);
                    $order['items'] = $itemStmt->fetchAll();

                    echo json_encode(['status' => 'success', 'data' => $order]);
                } else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Order not found.']);
                }
            } else {
                $authUser = requireAuth();
                $query = "SELECT o.*, CONCAT(c.first_name, ' ', c.last_name) as customer_name FROM orders o JOIN customers c ON o.customer_id = c.id";
                $params = [];

                if ($authUser['role'] === 'Customer') {
                    if ($authUser['customer_id']) {
                        $query .= " WHERE o.customer_id = ?";
                        $params[] = $authUser['customer_id'];
                    } else {
                        echo json_encode(['status' => 'success', 'data' => []]);
                        exit;
                    }
                } elseif ($customer_id) {
                    $query .= " WHERE o.customer_id = ?";
                    $params[] = $customer_id;
                }

                $query .= " ORDER BY o.created_at DESC";

                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                $orders = $stmt->fetchAll();
                echo json_encode(['status' => 'success', 'data' => $orders]);
            }
        } catch (Exception $e) {
            error_log("Orders GET Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to retrieve order records.']);
        }
        break;

    case 'POST':
        $authUser = requireAuth();
        $data = json_decode(file_get_contents("php://input"), true);

        // Assign customer_id from authenticated session if not set or if customer
        $customerId = ($authUser['role'] === 'Customer') ? $authUser['customer_id'] : ($data['customer_id'] ?? $authUser['customer_id']);

        if (!$customerId) {
            // Fallback: try finding customer record for user
            $cStmt = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
            $cStmt->execute([$authUser['id']]);
            $customerId = $cStmt->fetchColumn();
        }

        if (!$customerId) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Customer profile not found. Please complete profile setup.']);
            exit;
        }

        try {
            $pdo->beginTransaction();

            $orderNumber = 'ORD-' . time() . '-' . rand(100, 999);
            $totalAmount = floatval($data['total_amount'] ?? 0);
            $orderType = $data['type'] ?? 'In-Stock';

            $stmt = $pdo->prepare("INSERT INTO orders (order_number, customer_id, type, status, total_amount, outstanding_balance) VALUES (?, ?, ?, 'Pending', ?, ?)");
            $stmt->execute([
                $orderNumber,
                $customerId,
                $orderType,
                $totalAmount,
                $totalAmount
            ]);
            $orderId = $pdo->lastInsertId();

            if (isset($data['items']) && is_array($data['items'])) {
                $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
                foreach ($data['items'] as $item) {
                    $itemStmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['unit_price']]);

                    // Deduct stock with Pessimistic Row Lock (FOR UPDATE) if in-stock
                    if ($orderType === 'In-Stock' && !empty($item['product_id'])) {
                        $lockStmt = $pdo->prepare("SELECT stock_quantity FROM products WHERE id = ? FOR UPDATE");
                        $lockStmt->execute([$item['product_id']]);
                        $currentStock = $lockStmt->fetchColumn();

                        if ($currentStock !== false) {
                            $newStock = max(0, $currentStock - $item['quantity']);
                            $stockStmt = $pdo->prepare("UPDATE products SET stock_quantity = ? WHERE id = ?");
                            $stockStmt->execute([$newStock, $item['product_id']]);
                        }
                    }
                }
            }

            $pdo->commit();
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Order placed successfully.', 'order_id' => $orderId, 'order_number' => $orderNumber]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log("Order POST Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to process order placement.']);
        }
        break;

    case 'PUT':
        $authUser = requireRole(['Administrator', 'Order Manager', 'Accounts Officer', 'Accounts Head']);
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        $newStatus = $data['status'] ?? null;

        if (!$id || !$newStatus) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Order ID and new status required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$newStatus, $id]);
            echo json_encode(['status' => 'success', 'message' => 'Order status updated.']);
        } catch (Exception $e) {
            error_log("Order PUT Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to update order status.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
        break;
}
?>
