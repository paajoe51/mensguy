<?php
// api/access_control/register.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$firstName = $data['firstName'] ?? '';
$lastName = $data['lastName'] ?? '';
$phone = $data['phone'] ?? '';

if (empty($username) || empty($email) || empty($password) || empty($firstName) || empty($lastName) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit();
}

try {
    // Check if email or username already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    $stmt->execute([$email, $username]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Email or username already in use.']);
        exit();
    }

    $pdo->beginTransaction();

    // Insert User
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'Customer')");
    $stmt->execute([$username, $email, $passwordHash]);
    $userId = $pdo->lastInsertId();

    // Insert Customer Profile
    $stmt = $pdo->prepare("INSERT INTO customers (user_id, first_name, last_name, phone) VALUES (?, ?, ?, ?)");
    $stmt->execute([$userId, $firstName, $lastName, $phone]);

    $pdo->commit();

    // Auto-login after registration
    $_SESSION['user_id'] = $userId;
    $_SESSION['role'] = 'Customer';
    $_SESSION['email'] = $email;

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful.',
        'user' => [
            'id' => $userId,
            'username' => $username,
            'email' => $email,
            'role' => 'Customer'
        ]
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $e->getMessage()]);
}
?>
