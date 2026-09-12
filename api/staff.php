<?php
// api/staff/index.php
require_once 'config.php';
require_once __DIR__ . '/access_control/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];

// In real app, verify admin privileges before executing
switch ($method) {
    case 'GET':
        try {
            $id = $_GET['id'] ?? null;
            if ($id) {
                $stmt = $pdo->prepare("SELECT id, username, email, full_name, role, status, created_at FROM users WHERE id = ? AND role != 'Customer'");
                $stmt->execute([$id]);
                $staff = $stmt->fetch();
                if ($staff) {
                    echo json_encode(['status' => 'success', 'data' => $staff]);
                } else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Staff member not found.']);
                }
            } else {
                $stmt = $pdo->query("SELECT id, username, email, full_name, role, status, created_at FROM users WHERE role != 'Customer' ORDER BY role, created_at");
                echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Add new staff (Admin only)
        requireRole(['Administrator']);
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['username']) || empty($data['email']) || empty($data['password']) || empty($data['role'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields.']);
            exit;
        }
        try {
            $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO users (username, email, full_name, password_hash, role, status) VALUES (?, ?, ?, ?, ?, 'active')");
            $stmt->execute([$data['username'], $data['email'], $data['full_name'] ?? '', $passwordHash, $data['role']]);
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Staff personnel onboarded.', 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update staff status/role/details
        $authUser = requireAuth();
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? $authUser['id'];
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Staff ID required.']);
            exit;
        }

        // Security: Only Admin can update others. Staff can only update themselves.
        if ($_SESSION['role'] !== 'Administrator' && $_SESSION['user_id'] != $id) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Access denied. Only administrators can update other staff members.']);
            exit;
        }

        try {
            $fields = [];
            $params = [];
            if (isset($data['role'])) {
                $fields[] = "role = ?";
                $params[] = $data['role'];
            }
            if (isset($data['status'])) {
                $fields[] = "status = ?";
                $params[] = $data['status'];
            }
            if (isset($data['email'])) {
                $fields[] = "email = ?";
                $params[] = $data['email'];
            }
            if (isset($data['full_name'])) {
                $fields[] = "full_name = ?";
                $params[] = $data['full_name'];
            }
            if (isset($data['password']) && !empty($data['password'])) {
                $fields[] = "password_hash = ?";
                $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
            }

            if (empty($fields)) {
                echo json_encode(['status' => 'success', 'message' => 'No changes made.']);
                exit;
            }

            $params[] = $id;
            $stmt = $pdo->prepare("UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?");
            $stmt->execute($params);
            echo json_encode(['status' => 'success', 'message' => 'Staff credentials adjusted.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required.']);
            exit;
        }
        try {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND role != 'Administrator'"); // Prevent self-delete or admin delete via this endpoint if needed
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Staff access revoked.']);
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
