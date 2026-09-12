<?php
// api/installments/index.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        try {
            if ($id) {
                $stmt = $pdo->prepare("SELECT i.*, o.order_number, o.outstanding_balance FROM installments i JOIN orders o ON i.order_id = o.id WHERE i.id = ?");
                $stmt->execute([$id]);
                $plan = $stmt->fetch();
                if ($plan) echo json_encode(['status' => 'success', 'data' => $plan]);
                else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Plan not found']);
                }
            } else {
                $query = "SELECT i.*, o.order_number, CONCAT(c.first_name, ' ', c.last_name) as customer_name, o.outstanding_balance 
                          FROM installments i 
                          JOIN orders o ON i.order_id = o.id 
                          JOIN customers c ON o.customer_id = c.id";
                $params = [];

                if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Customer') {
                    $stmtCust = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
                    $stmtCust->execute([$_SESSION['user_id']]);
                    $cust = $stmtCust->fetch();
                    if ($cust) {
                        $query .= " WHERE o.customer_id = ?";
                        $params[] = $cust['id'];
                    } else {
                        echo json_encode(['status' => 'success', 'data' => []]);
                        exit;
                    }
                }

                $query .= " ORDER BY i.created_at DESC";
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Define installment plan for an order
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            // First get default settings
            $grace = $pdo->query("SELECT setting_value FROM system_settings WHERE setting_key = 'installment_grace_days'")->fetchColumn() ?: 7;
            $penalty = $pdo->query("SELECT setting_value FROM system_settings WHERE setting_key = 'installment_penalty_pct'")->fetchColumn() ?: 30.00;

            $stmt = $pdo->prepare("INSERT INTO installments (order_id, total_amount, initial_deposit, due_date, grace_period_days, penalty_percentage) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['order_id'],
                $data['total_amount'],
                $data['initial_deposit'],
                $data['due_date'],
                $grace,
                $penalty
            ]);

            // Also add the first payment (deposit) into payments table
            $paymentStmt = $pdo->prepare("INSERT INTO payments (order_id, customer_id, amount, method, receipt_number) VALUES (?, ?, ?, ?, ?)");
            $receipt = 'DEP-' . time();
            $paymentStmt->execute([$data['order_id'], $data['customer_id'], $data['initial_deposit'], $data['method'] ?? 'Cash', $receipt]);

            // Update order balance
            $updateOrder = $pdo->prepare("UPDATE orders SET amount_paid = amount_paid + ?, outstanding_balance = outstanding_balance - ? WHERE id = ?");
            $updateOrder->execute([$data['initial_deposit'], $data['initial_deposit'], $data['order_id']]);

            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Installment plan active.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update plan status (e.g. Defaulted)
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE installments SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $id]);
            echo json_encode(['status' => 'success', 'message' => 'Installment status updated.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
