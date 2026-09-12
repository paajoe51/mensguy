<?php
// api/access_control/login.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$identifier = $data['email'] ?? $data['username'] ?? ''; // Can be email or username
$password = $data['password'] ?? '';

if (empty($identifier) || empty($password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Username/Email and password are required.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {

        if ($user['status'] !== 'active') {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Your account is disabled. Contact support.']);
            exit();
        }

        // Setup session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['full_name'] = $user['full_name'] ?? $user['username'];

        // Optionally, fetch customer ID if they are a customer
        $customerId = null;
        if ($user['role'] === 'Customer') {
            $cStmt = $pdo->prepare("SELECT id FROM customers WHERE user_id = ?");
            $cStmt->execute([$user['id']]);
            $customerId = $cStmt->fetchColumn();
            $_SESSION['customer_id'] = $customerId ?: null;
        }

        // Fetch permissions for the role
        $permissions = [];
        try {
            $pStmt = $pdo->prepare("SELECT module, level FROM role_permissions WHERE role = ?");
            $pStmt->execute([$user['role']]);
            $permsRaw = $pStmt->fetchAll();
            foreach ($permsRaw as $p) {
                $permissions[$p['module']] = $p['level'];
            }
        } catch (Exception $pe) {
            error_log("Permissions Fetch Warning: " . $pe->getMessage());
        }

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful.',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'full_name' => $user['full_name'] ?? $user['username'],
                'role' => $user['role'],
                'customer_id' => $customerId,
                'permissions' => $permissions
            ]
        ]);

        // Log activity
        try {
            $logStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action) VALUES (?, 'User Logged In')");
            $logStmt->execute([$user['id']]);
        } catch (Exception $ae) {
            error_log("Audit Log Warning: " . $ae->getMessage());
        }
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials.']);
    }
} catch (Exception $e) {
    error_log("Login Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Login error. Server log: ' . $e->getMessage()]);
}
