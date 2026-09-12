<?php
// api/delivery/index.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        try {
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM deliveries WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success', 'data' => $stmt->fetch()]);
            } else {
                $stmt = $pdo->query("SELECT d.*, o.order_number, u.username as assigned_rider FROM deliveries d JOIN orders o ON d.order_id = o.id LEFT JOIN users u ON d.assigned_to = u.id ORDER BY d.created_at DESC");
                echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Assign a delivery
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $stmt = $pdo->prepare("INSERT INTO deliveries (order_id, method, delivery_address, status) VALUES (?, ?, ?, 'Awaiting Assignment')");
            $stmt->execute([
                $data['order_id'],
                $data['method'], // Customer Pickup, Company Delivery, Third Party Delivery
                $data['delivery_address'] ?? null
            ]);
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Delivery staged.', 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE deliveries SET status=?, assigned_to=? WHERE id=?");
            $stmt->execute([
                $data['status'],
                $data['assigned_to'] ?? null,
                $id
            ]);

            // If Delivered, update order status as well
            if ($data['status'] === 'Delivered') {
                $delivery = $pdo->query("SELECT order_id FROM deliveries WHERE id = " . intval($id))->fetch();
                $updateOrder = $pdo->prepare("UPDATE orders SET status = 'Delivered' WHERE id = ?");
                $updateOrder->execute([$delivery['order_id']]);
            }

            echo json_encode(['status' => 'success', 'message' => 'Delivery updated.']);
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
