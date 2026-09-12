<?php
// api/finance.php
require_once 'config.php';
require_once __DIR__ . '/access_control/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Require finance administration privileges
$authUser = requireRole(['Administrator', 'Accounts Officer', 'Accounts Head']);

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $type = $_GET['type'] ?? 'dashboard';

        if ($type === 'dashboard') {
            // 1. Total Revenue (Fully Paid + Partially Paid amounts)
            $totalSales = $pdo->query("SELECT SUM(amount_paid) FROM orders WHERE status NOT IN ('Cancelled', 'Refunded')")->fetchColumn() ?: 0;

            // 2. Total Expenditure (Approved logs only)
            $totalExpenses = $pdo->query("SELECT SUM(amount) FROM finance_logs WHERE type = 'Expenditure' AND approval_status = 'Approved'")->fetchColumn() ?: 0;

            // 3. Outstanding Receivables
            $outstanding = $pdo->query("SELECT SUM(outstanding_balance) FROM orders WHERE status NOT IN ('Cancelled', 'Refunded', 'Delivered')")->fetchColumn() ?: 0;

            // 4. Business Loans/Capital
            $capital = $pdo->query("SELECT SUM(amount) FROM finance_logs WHERE type IN ('Business Capital', 'Loan', 'Shares/Investment')")->fetchColumn() ?: 0;

            echo json_encode([
                'status' => 'success',
                'data' => [
                    'revenue' => (float)$totalSales,
                    'profit' => (float)($totalSales - $totalExpenses),
                    'expenses' => (float)$totalExpenses,
                    'outstanding' => (float)$outstanding,
                    'loans' => (float)$capital
                ]
            ]);
        } elseif ($type === 'ledger') {
            // Trial Balance Simulation
            $ledger = [];

            $sales = $pdo->query("SELECT SUM(amount_paid) as amount FROM orders WHERE status != 'Cancelled'")->fetchColumn();
            $ledger[] = ['account' => 'Sales Revenue', 'code' => '4000', 'debit' => 0, 'credit' => (float)$sales];
            $ledger[] = ['account' => 'Accounts Receivable', 'code' => '1100', 'debit' => (float)$pdo->query("SELECT SUM(outstanding_balance) FROM orders WHERE status != 'Cancelled'")->fetchColumn(), 'credit' => 0];

            $logs = $pdo->query("SELECT type, SUM(amount) as total FROM finance_logs WHERE approval_status != 'Rejected' GROUP BY type")->fetchAll();
            foreach ($logs as $log) {
                if ($log['type'] === 'Expenditure') {
                    $ledger[] = ['account' => 'Operational Expenses', 'code' => '5000', 'debit' => (float)$log['total'], 'credit' => 0];
                } elseif ($log['type'] === 'Business Capital') {
                    $ledger[] = ['account' => 'Owner Capital', 'code' => '3000', 'debit' => 0, 'credit' => (float)$log['total']];
                } elseif ($log['type'] === 'Loan') {
                    $ledger[] = ['account' => 'Business Loan', 'code' => '2200', 'debit' => 0, 'credit' => (float)$log['total']];
                }
            }

            echo json_encode(['status' => 'success', 'data' => $ledger]);
        } elseif ($type === 'chart') {
            $revenue = $pdo->query("SELECT DATE_FORMAT(created_at, '%b') as month, SUM(amount_paid) as revenue FROM orders WHERE status != 'Cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH) GROUP BY MONTH(created_at) ORDER BY created_at ASC")->fetchAll();
            $expenses = $pdo->query("SELECT DATE_FORMAT(created_at, '%b') as month, SUM(amount) as expenses FROM finance_logs WHERE type = 'Expenditure' AND approval_status = 'Approved' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH) GROUP BY MONTH(created_at) ORDER BY created_at ASC")->fetchAll();

            $chartData = [];
            foreach ($revenue as $r) {
                $month = $r['month'];
                $ex = 0;
                foreach ($expenses as $e) {
                    if ($e['month'] === $month) $ex = $e['expenses'];
                }
                $chartData[] = [
                    'month' => $month,
                    'revenue' => (float)$r['revenue'],
                    'expenses' => (float)$ex,
                    'profit' => (float)($r['revenue'] - $ex)
                ];
            }

            echo json_encode(['status' => 'success', 'data' => $chartData]);
        } elseif ($type === 'transactions') {
            $query = "(SELECT 'income' as type, 'Sales' as category, CONCAT('ORD-', id) as id, amount, created_at, 'completed' as status, method FROM payments)
                      UNION
                      (SELECT 'expense' as type, category, CONCAT('EXP-', id) as id, amount, created_at, LOWER(approval_status) as status, 'Internal' as method FROM finance_logs WHERE type = 'Expenditure')
                      ORDER BY created_at DESC LIMIT 50";
            $data = $pdo->query($query)->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $data]);
        } elseif ($type === 'expenses') {
            $query = "SELECT f.*, u.username as officer FROM finance_logs f LEFT JOIN users u ON f.spending_officer_id = u.id WHERE f.type = 'Expenditure' ORDER BY f.created_at DESC";
            $data = $pdo->query($query)->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $data]);
        } elseif ($type === 'installments') {
            $query = "SELECT 
                        i.*, 
                        o.order_number, 
                        o.amount_paid, 
                        o.outstanding_balance,
                        c.first_name, 
                        c.last_name, 
                        c.phone, 
                        u.email,
                        (SELECT name FROM products p JOIN order_items oi ON p.id = oi.product_id WHERE oi.order_id = o.id LIMIT 1) as item_name,
                        (SELECT MAX(created_at) FROM payments WHERE order_id = o.id) as last_payment_date
                      FROM installments i
                      JOIN orders o ON i.order_id = o.id
                      JOIN customers c ON o.customer_id = c.id
                      LEFT JOIN users u ON c.user_id = u.id
                      WHERE i.status != 'Refunded'
                      ORDER BY i.due_date ASC";
            $data = $pdo->query($query)->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $data]);
        }
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $type = $_GET['type'] ?? 'expenditure';

        if ($type === 'installment_payment') {
            $pdo->beginTransaction();
            try {
                $planStmt = $pdo->prepare("SELECT order_id FROM installments WHERE id = ?");
                $planStmt->execute([$data['plan_id']]);
                $order_id = $planStmt->fetchColumn();

                $stmt = $pdo->prepare("INSERT INTO payments (order_id, customer_id, amount, method, receipt_number, recorded_by) 
                                       SELECT ?, customer_id, ?, ?, ?, ? FROM orders WHERE id = ?");
                $stmt->execute([
                    $order_id,
                    $data['amount'],
                    $data['method'],
                    $data['transaction_id'],
                    $data['officer_id'],
                    $order_id
                ]);

                $upd = $pdo->prepare("UPDATE orders SET amount_paid = amount_paid + ?, outstanding_balance = outstanding_balance - ? WHERE id = ?");
                $upd->execute([$data['amount'], $data['amount'], $order_id]);

                $check = $pdo->prepare("SELECT outstanding_balance FROM orders WHERE id = ?");
                $check->execute([$order_id]);
                if ($check->fetchColumn() <= 0) {
                    $pdo->prepare("UPDATE installments SET status = 'Completed' WHERE id = ?")->execute([$data['plan_id']]);
                    $pdo->prepare("UPDATE orders SET status = 'Fully Paid' WHERE id = ?")->execute([$order_id]);
                }

                $pdo->commit();
                echo json_encode(['status' => 'success', 'message' => 'Payment recorded successfully']);
            } catch (Exception $e) {
                $pdo->rollBack();
                throw $e;
            }
        } else {
            $stmt = $pdo->prepare("INSERT INTO finance_logs (type, category, amount, notes, spending_officer_id, approval_status) VALUES (?, ?, ?, ?, ?, 'Pending')");
            $stmt->execute([
                $data['type'] ?? 'Expenditure',
                $data['category'],
                $data['amount'],
                $data['notes'] ?? '',
                $data['officer_id']
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Finance log recorded', 'id' => $pdo->lastInsertId()]);
        }
    } elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("UPDATE finance_logs SET approval_status = ?, approved_by_id = ? WHERE id = ?");
        $stmt->execute([
            $data['status'],
            $data['approver_id'],
            $data['id']
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Status updated']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
