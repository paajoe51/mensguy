<?php
// api/installment_management.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to get customer ID from session
function getCustomerId($pdo, $user_id) {
    $stmt = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $res = $stmt->fetch();
    return $res ? $res['id'] : null;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

switch ($method) {
    case 'GET':
        $request_id = $_GET['request_id'] ?? null;
        if (!$request_id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Request ID required.']);
            exit;
        }

        try {
            // Find order linked to this request
            // Note: We might need to add a request_id column to orders or a mapping table.
            // For now, let's look for an order with order_number = REQ-[ID] or similar
            // Better yet, let's assume item_requests.status = 'Converted to Order' and we find the order
            
            // Actually, let's add a `request_id` to `orders` table if it's missing or use order_number
            // Let's check if `orders` has `request_id`.
            
            $stmt = $pdo->prepare("SELECT * FROM orders WHERE order_number = ?");
            $stmt->execute(["REQ-" . str_pad($request_id, 3, '0', STR_PAD_LEFT)]);
            $order = $stmt->fetch();

            if (!$order) {
                echo json_encode(['status' => 'success', 'data' => null, 'message' => 'No installment plan found for this request.']);
                exit;
            }

            // Get payments for this order
            $stmt = $pdo->prepare("SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC");
            $stmt->execute([$order['id']]);
            $payments = $stmt->fetchAll();

            echo json_encode([
                'status' => 'success',
                'data' => [
                    'order' => $order,
                    'payments' => $payments
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $request_id = $data['request_id'] ?? null;
        $initial_deposit = $data['initial_deposit'] ?? 0;
        $duration = $data['duration'] ?? 3; // Months

        if (!$request_id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Request ID required.']);
            exit;
        }

        try {
            // Get request details
            $stmt = $pdo->prepare("SELECT * FROM item_requests WHERE id = ?");
            $stmt->execute([$request_id]);
            $request = $stmt->fetch();

            if (!$request || $request['status'] !== 'Approved') {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Request must be approved to start installments.']);
                exit;
            }

            $customer_id = $request['customer_id'];
            $total_amount = $request['budget'];
            $order_number = "REQ-" . str_pad($request_id, 3, '0', STR_PAD_LEFT);

            // Create Order
            $stmt = $pdo->prepare("
                INSERT INTO orders (order_number, customer_id, type, status, total_amount, amount_paid, outstanding_balance)
                VALUES (?, ?, 'Installment', 'Pending', ?, 0, ?)
            ");
            $stmt->execute([$order_number, $customer_id, $total_amount, $total_amount]);
            $order_id = $pdo->lastInsertId();

            // Create Installment Record
            $due_date = date('Y-m-d', strtotime("+$duration months"));
            $stmt = $pdo->prepare("
                INSERT INTO installments (order_id, total_amount, initial_deposit, due_date, status)
                VALUES (?, ?, ?, ?, 'Active')
            ");
            $stmt->execute([$order_id, $total_amount, $initial_deposit, $due_date]);

            // Mark request as converted
            $stmt = $pdo->prepare("UPDATE item_requests SET status = 'Converted to Order' WHERE id = ?");
            $stmt->execute([$request_id]);

            echo json_encode(['status' => 'success', 'message' => 'Installment plan submitted for approval.', 'order_id' => $order_id]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Record a flexible payment ("bit")
        $data = json_decode(file_get_contents("php://input"), true);
        $order_id = $data['order_id'] ?? null;
        $amount = $data['amount'] ?? null;
        $method = $data['method'] ?? 'Manual Transfer';

        if (!$order_id || !$amount) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Order ID and amount required.']);
            exit;
        }

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$order_id]);
            $order = $stmt->fetch();

            if (!$order) {
                throw new Exception("Order not found.");
            }

            // Record Payment
            $stmt = $pdo->prepare("
                INSERT INTO payments (order_id, customer_id, amount, method)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$order['id'], $order['customer_id'], $amount, $method]);

            // Update Order
            $new_paid = $order['amount_paid'] + $amount;
            $new_balance = $order['total_amount'] - $new_paid;
            $status = ($new_balance <= 0) ? 'Fully Paid' : 'Partially Paid';

            $stmt = $pdo->prepare("UPDATE orders SET amount_paid = ?, outstanding_balance = ?, status = ? WHERE id = ?");
            $stmt->execute([$new_paid, max(0, $new_balance), $status, $order_id]);

            $pdo->commit();
            echo json_encode(['status' => 'success', 'message' => 'Payment recorded successfully.']);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
        break;
}
