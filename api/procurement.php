<?php
// api/procurement/index.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        try {
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM procurement WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success', 'data' => $stmt->fetch()]);
            } else {
                $stmt = $pdo->query("SELECT * FROM procurement ORDER BY created_at DESC");
                echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $stmt = $pdo->prepare("INSERT INTO procurement (supplier_name, purchase_cost, shipping_cost, expected_arrival, status) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['supplier_name'],
                $data['purchase_cost'],
                $data['shipping_cost'] ?? null,
                $data['expected_arrival'] ?? null,
                $data['status'] ?? 'Pending'
            ]);
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Procurement added.', 'id' => $pdo->lastInsertId()]);
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
            $stmt = $pdo->prepare("UPDATE procurement SET supplier_name=?, purchase_cost=?, shipping_cost=?, expected_arrival=?, actual_arrival=?, status=? WHERE id=?");
            $stmt->execute([
                $data['supplier_name'],
                $data['purchase_cost'],
                $data['shipping_cost'],
                $data['expected_arrival'],
                $data['actual_arrival'] ?? null,
                $data['status'],
                $id
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Procurement updated.']);
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
