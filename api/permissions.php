<?php
// api/permissions.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT role, module, level FROM role_permissions");
            $rows = $stmt->fetchAll();

            // Transform into a matrix format if helpful, or just return flat rows
            // Let's return flat rows and let the frontend handle transformation for now
            // as it matches the standard pattern we've used so far.
            echo json_encode(['status' => 'success', 'data' => $rows]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update a specific permission
        $data = json_decode(file_get_contents("php://input"), true);
        $role = $data['role'] ?? null;
        $module = $data['module'] ?? null;
        $level = $data['level'] ?? null;

        if (!$role || !$module || !$level) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing role, module or level.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO role_permissions (role, module, level) VALUES (?, ?, ?) 
                                 ON DUPLICATE KEY UPDATE level = VALUES(level)");
            $stmt->execute([$role, $module, $level]);
            echo json_encode(['status' => 'success', 'message' => 'Permission tactical adjustment recorded.']);
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
