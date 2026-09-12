<?php
// api/access_control/session.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit();
}

try {
    if (isset($_SESSION['user_id'])) {
        // Fetch fresh user data just in case roles/status changed
        $stmt = $pdo->prepare("SELECT id, username, email, role, status FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();

        if ($user && $user['status'] === 'active') {
            // Fetch permissions
            $pStmt = $pdo->prepare("SELECT module, level FROM role_permissions WHERE role = ?");
            $pStmt->execute([$user['role']]);
            $permsRaw = $pStmt->fetchAll();
            $permissions = [];
            foreach ($permsRaw as $p) {
                $permissions[$p['module']] = $p['level'];
            }

            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'authenticated' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'customer_id' => $_SESSION['customer_id'] ?? null,
                    'permissions' => $permissions
                ]
            ]);
        } else {
            // User got deleted or disabled
            session_destroy();
            http_response_code(401);
            echo json_encode(['status' => 'error', 'authenticated' => false, 'message' => 'Account is deactivated.']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'authenticated' => false, 'message' => 'Not authenticated.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Server error while checking session.']);
}
