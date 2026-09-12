<?php
// api/access_control/auth_middleware.php
require_once __DIR__ . '/../config.php';

/**
 * Ensures user is authenticated. Returns user array or halts execution with 401.
 */
function requireAuth() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Authentication required. Please log in.'
        ]);
        exit();
    }
    return [
        'id' => $_SESSION['user_id'],
        'role' => $_SESSION['role'] ?? 'Customer',
        'customer_id' => $_SESSION['customer_id'] ?? null
    ];
}

/**
 * Ensures user has one of the allowed roles.
 */
function requireRole($allowedRoles = []) {
    $user = requireAuth();
    if (!in_array($user['role'], $allowedRoles)) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Forbidden. Restricted access for role: ' . $user['role']
        ]);
        exit();
    }
    return $user;
}

/**
 * Ensures user has specific permission level for a module.
 */
function requirePermission($pdo, $module, $requiredLevel = 'read') {
    $user = requireAuth();
    if ($user['role'] === 'Administrator') {
        return $user;
    }

    $stmt = $pdo->prepare("SELECT level FROM role_permissions WHERE role = ? AND module = ?");
    $stmt->execute([$user['role'], $module]);
    $level = $stmt->fetchColumn();

    if (!$level || $level === 'none') {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Forbidden. Insufficient permissions for module: ' . $module
        ]);
        exit();
    }

    if ($requiredLevel === 'write' && $level !== 'write') {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Forbidden. Write permission required.'
        ]);
        exit();
    }

    return $user;
}
?>
