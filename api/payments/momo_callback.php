<?php
// api/payments/momo_callback.php
// Instant Payment Notification (IPN) Webhook Callback for Mobile Money Gateways

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../lib/SMSClient.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Webhook requires POST.']);
    exit();
}

$payloadRaw = file_get_contents('php://input');
$data = json_decode($payloadRaw, true) ?: $_POST;

$orderNumber = $data['order_number'] ?? $data['reference'] ?? null;
$transactionId = $data['transaction_id'] ?? $data['tx_ref'] ?? null;
$amount = floatval($data['amount'] ?? 0);
$status = strtolower($data['status'] ?? '');

if (!$orderNumber || !$amount) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid webhook payload: order_number and amount required.']);
    exit();
}

try {
    $pdo->beginTransaction();

    // Query target order
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE order_number = ? FOR UPDATE");
    $stmt->execute([$orderNumber]);
    $order = $stmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order reference not found.']);
        exit();
    }

    if ($status === 'success' || $status === 'successful' || $status === 'completed') {
        // Record payment entry
        $receiptNumber = 'REC-' . time() . '-' . rand(100, 999);
        $payStmt = $pdo->prepare("
            INSERT INTO payments (order_id, customer_id, amount, method, receipt_number)
            VALUES (?, ?, ?, 'Mobile Money', ?)
        ");
        $payStmt->execute([$order['id'], $order['customer_id'], $amount, $receiptNumber]);

        // Calculate balance updates
        $newAmountPaid = $order['amount_paid'] + $amount;
        $newBalance = max(0, $order['total_amount'] - $newAmountPaid);
        $newOrderStatus = ($newBalance <= 0) ? 'Fully Paid' : 'Partially Paid';

        $updOrd = $pdo->prepare("UPDATE orders SET amount_paid = ?, outstanding_balance = ?, status = ? WHERE id = ?");
        $updOrd->execute([$newAmountPaid, $newBalance, $newOrderStatus, $order['id']]);

        // Dispatch SMS notification if customer phone exists
        $cStmt = $pdo->prepare("SELECT phone FROM customers WHERE id = ?");
        $cStmt->execute([$order['customer_id']]);
        $customerPhone = $cStmt->fetchColumn();

        if ($customerPhone) {
            $sms = new SMSClient($pdo);
            $msg = sprintf("MENSGUY: Payment of GHc%.2f received for Order #%s. Receipt: %s. Outstanding: GHc%.2f", $amount, $orderNumber, $receiptNumber, $newBalance);
            $sms->send($customerPhone, $msg);
        }

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, details) VALUES ('MOMO_PAYMENT_SUCCESS', ?)");
        $auditStmt->execute([sprintf("MoMo payment GHc%.2f processed for Order %s (Tx: %s)", $amount, $orderNumber, $transactionId)]);

        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Payment processed successfully.', 'receipt_number' => $receiptNumber]);
    } else {
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, details) VALUES ('MOMO_PAYMENT_FAILED', ?)");
        $auditStmt->execute([sprintf("MoMo payment failed for Order %s (Status: %s)", $orderNumber, $status)]);
        $pdo->commit();

        echo json_encode(['status' => 'acknowledged', 'message' => 'Failed payment status logged.']);
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("MoMo Webhook Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Webhook processing exception.']);
}
?>
