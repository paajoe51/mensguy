<?php
// api/settings/index.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            // Retrieve all settings as a key-value object array
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM system_settings");
            $raw_settings = $stmt->fetchAll();
            $settings = [];
            foreach ($raw_settings as $s) {
                $settings[$s['setting_key']] = $s['setting_value'];
            }
            echo json_encode(['status' => 'success', 'data' => $settings]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Batch update settings
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
            foreach ($data as $key => $val) {
                $stmt->execute([$key, $val, $val]);
            }
            $pdo->commit();
            echo json_encode(['status' => 'success', 'message' => 'Settings updated successfully.']);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
