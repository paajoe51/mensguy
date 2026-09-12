<?php
// api/cron/process_installments.php
// Background Cron Job script to enforce installment policies (SRD Section 12)

require_once __DIR__ . '/../config.php';

// Only allow execution via CLI or with secret CRON key
$isCli = (php_sapi_name() === 'cli');
$cronKey = $_GET['key'] ?? '';
$expectedKey = getenv('CRON_SECRET') ?: 'mensguy_cron_secret_2026';

if (!$isCli && $cronKey !== $expectedKey) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Forbidden. CLI or valid CRON secret key required.']);
    exit();
}

try {
    $pdo->beginTransaction();

    $today = new DateTime();
    $logs = [];

    // Fetch active installments
    $stmt = $pdo->prepare("
        SELECT i.*, o.order_number, o.amount_paid, o.total_amount, o.customer_id
        FROM installments i
        JOIN orders o ON i.order_id = o.id
        WHERE i.status = 'Active'
    ");
    $stmt->execute();
    $installments = $stmt->fetchAll();

    foreach ($installments as $plan) {
        $dueDate = new DateTime($plan['due_date']);
        $graceDays = intval($plan['grace_period_days'] ?? 7);
        $penaltyPct = floatval($plan['penalty_percentage'] ?? 30.00);

        if ($today > $dueDate) {
            $daysOverdue = $today->diff($dueDate)->days;

            if ($daysOverdue > $graceDays) {
                // Grace period expired: Transition to Defaulted & Apply 30% deduction policy
                $penaltyAmount = ($plan['total_amount'] * ($penaltyPct / 100));
                $refundableAmount = max(0, $plan['amount_paid'] - $penaltyAmount);

                // Update installment status
                $updInst = $pdo->prepare("UPDATE installments SET status = 'Defaulted' WHERE id = ?");
                $updInst->execute([$plan['id']]);

                // Update linked order status
                $updOrd = $pdo->prepare("UPDATE orders SET status = 'Cancelled' WHERE id = ?");
                $updOrd->execute([$plan['order_id']]);

                // Log audit action
                $logDetails = sprintf(
                    "Installment #%d (Order %s) marked Defaulted. Total: GH¢%.2f, Paid: GH¢%.2f, Penalty (%.0f%%): GH¢%.2f, Refundable: GH¢%.2f",
                    $plan['id'],
                    $plan['order_number'],
                    $plan['total_amount'],
                    $plan['amount_paid'],
                    $penaltyPct,
                    $penaltyAmount,
                    $refundableAmount
                );

                $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, details) VALUES ('INSTALLMENT_DEFAULTED', ?)");
                $auditStmt->execute([$logDetails]);

                $logs[] = $logDetails;
            }
        }
    }

    $pdo->commit();

    $summary = sprintf("Processed %d active installment plans. %d plans defaulted.", count($installments), count($logs));
    echo json_encode([
        'status' => 'success',
        'message' => $summary,
        'defaulted_logs' => $logs
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Installment Cron Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to execute installment background processing.']);
}
?>
