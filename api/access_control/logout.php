<?php
// api/access_control/logout.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit();
}

try {
    // Log activity if user is logged in (session already started by config.php)
    if (isset($_SESSION['user_id'])) {
        $logStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action) VALUES (?, 'User Logged Out')");
        $logStmt->execute([$_SESSION['user_id']]);
    }

    // Destroy the session
    $_SESSION = array();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    session_destroy();

    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Logged out successfully.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Logout error.']);
}
