<?php
// api/lib/SMSClient.php
// Modular SMS gateway service adapter (e.g. Hubtel, Arkesel, Twilio)

require_once __DIR__ . '/../config.php';

class SMSClient {
    private $pdo;
    private $apiKey;
    private $senderId;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->loadSettings();
    }

    private function loadSettings() {
        try {
            $stmt = $this->pdo->prepare("SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('sms_api_key', 'sms_sender_id')");
            $stmt->execute();
            $rows = $stmt->fetchAll();
            $settings = [];
            foreach ($rows as $r) {
                $settings[$r['setting_key']] = $r['setting_value'];
            }
            $this->apiKey = $settings['sms_api_key'] ?? getenv('SMS_API_KEY') ?: '';
            $this->senderId = $settings['sms_sender_id'] ?? 'MENSGUY';
        } catch (Exception $e) {
            error_log("SMS Settings Load Error: " . $e->getMessage());
            $this->apiKey = '';
            $this->senderId = 'MENSGUY';
        }
    }

    /**
     * Send transactional SMS payload to recipient phone number.
     */
    public function send($recipientPhone, $messageText) {
        if (empty($this->apiKey)) {
            // Log SMS to audit logs in mock/dev mode when API key is unconfigured
            error_log("SMS (Mock Send to {$recipientPhone}): " . $messageText);
            $this->logAudit("SMS_MOCK_DISPATCH", "To: {$recipientPhone} | Message: {$messageText}");
            return ['status' => 'mock_success', 'message' => 'SMS logged to dev buffer.'];
        }

        // Example HTTP dispatch payload for Arkesel / Hubtel SMS API
        $payload = [
            'sender' => $this->senderId,
            'recipients' => [$recipientPhone],
            'message' => $messageText
        ];

        $ch = curl_init('https://sms.arkesel.com/api/v2/sms/send');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'api-key: ' . $this->apiKey,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $this->logAudit("SMS_DISPATCH", "To: {$recipientPhone} | HTTP {$httpCode}");
        return ['status' => $httpCode === 200 ? 'success' : 'failed', 'raw' => $response];
    }

    private function logAudit($action, $details) {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO audit_logs (action, details) VALUES (?, ?)");
            $stmt->execute([$action, $details]);
        } catch (Exception $e) {
            error_log("Audit Log Error: " . $e->getMessage());
        }
    }
}
?>
