<?php
// api/requests.php
require_once 'config.php';
require_once __DIR__ . '/access_control/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            // Check if user is logged in
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'Unauthorized.']);
                exit;
            }

            $user_id = $_SESSION['user_id'];
            $role = $_SESSION['role'];
            $id = $_GET['id'] ?? null;

            if ($id) {
                $stmt = $pdo->prepare("
                    SELECT r.*, c.name as category_name, cust.first_name, cust.last_name 
                    FROM item_requests r 
                    LEFT JOIN categories c ON r.category_id = c.id
                    JOIN customers cust ON r.customer_id = cust.id
                    WHERE r.id = ?
                ");
                $stmt->execute([$id]);
                $request = $stmt->fetch();

                if ($request) {
                    // Safety check: Customer can only see their own request
                    if ($role === 'Customer') {
                        $custStmt = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
                        $custStmt->execute([$user_id]);
                        $cust = $custStmt->fetch();
                        if ($request['customer_id'] != $cust['id']) {
                            http_response_code(403);
                            echo json_encode(['status' => 'error', 'message' => 'Access denied.']);
                            exit;
                        }
                    }
                    echo json_encode(['status' => 'success', 'data' => $request]);
                } else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Request not found.']);
                }
            } elseif ($role === 'Customer') {
                // Get customer's requests
                $stmt = $pdo->prepare("
                    SELECT r.*, c.name as category_name 
                    FROM item_requests r 
                    LEFT JOIN categories c ON r.category_id = c.id
                    JOIN customers cust ON r.customer_id = cust.id
                    WHERE cust.user_id = ?
                    ORDER BY r.created_at DESC
                ");
                $stmt->execute([$user_id]);
                echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            } else {
                // Admin/Staff sees all requests
                $stmt = $pdo->query("
                    SELECT r.*, c.name as category_name, cust.first_name, cust.last_name 
                    FROM item_requests r 
                    LEFT JOIN categories c ON r.category_id = c.id
                    JOIN customers cust ON r.customer_id = cust.id
                    ORDER BY r.created_at DESC
                ");
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
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'Unauthorized.']);
                exit;
            }

            // Get customer_id for the user
            $stmt = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $customer = $stmt->fetch();

            if (!$customer) {
                // If user is not in customers table (e.g. admin testing), create a customer record or error
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Customer profile not found.']);
                exit;
            }

            $stmt = $pdo->prepare("
                INSERT INTO item_requests (customer_id, category_id, product_name, link, description, quantity, notes, budget)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $customer['id'],
                $data['category_id'] ?? null,
                $data['product_name'],
                $data['link'] ?? null,
                $data['description'] ?? '',
                $data['quantity'] ?? 1,
                $data['notes'] ?? '',
                $data['budget'] ?? null
            ]);

            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Request submitted successfully.', 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update request status (Admin / Sourcing Staff)
        requireRole(['Administrator', 'Product Sourcing Officer', 'Order Manager']);
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Request ID required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE item_requests SET status = ?, category_id = ?, notes = ? WHERE id = ?");
            $stmt->execute([
                $data['status'],
                $data['category_id'] ?? null,
                $data['notes'] ?? '',
                $id
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Request updated.']);
        } catch (Exception $e) {
            error_log("Requests PUT Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to update request details.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
        break;
}
