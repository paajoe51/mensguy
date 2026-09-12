<?php
// api/products.php
require_once 'config.php';
require_once __DIR__ . '/access_control/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? 'products';

// Protect write operations (POST, PUT, DELETE)
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    requireRole(['Administrator', 'Product Sourcing Officer', 'Order Manager']);
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
if ($resource === 'categories') {
    switch ($method) {
        case 'GET':
            try {
                $stmt = $pdo->query("SELECT * FROM categories ORDER BY name ASC");
                echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            try {
                $stmt = $pdo->prepare("INSERT INTO categories (name, description) VALUES (?, ?)");
                $stmt->execute([$data['name'], $data['description'] ?? '']);
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'Category created.', 'id' => $pdo->lastInsertId()]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Category ID required.']);
                exit;
            }
            try {
                $stmt = $pdo->prepare("UPDATE categories SET name=?, description=? WHERE id=?");
                $stmt->execute([$data['name'], $data['description'] ?? '', $id]);
                echo json_encode(['status' => 'success', 'message' => 'Category updated.']);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Category ID required.']);
                exit;
            }
            try {
                $pdo->prepare("DELETE FROM categories WHERE id=?")->execute([$id]);
                echo json_encode(['status' => 'success', 'message' => 'Category deleted.']);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    }
    exit;
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        try {
            if ($id) {
                $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
                $stmt->execute([$id]);
                $product = $stmt->fetch();
                if ($product) {
                    echo json_encode(['status' => 'success', 'data' => $product]);
                } else {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'Product not found.']);
                }
            } else {
                $where = ["p.status != 'archived'"];
                $params = [];
                if (!empty($_GET['category_id'])) {
                    $where[] = "p.category_id = ?";
                    $params[] = $_GET['category_id'];
                }
                if (!empty($_GET['type'])) {
                    $where[] = "p.type = ?";
                    $params[] = $_GET['type'];
                }
                if (!empty($_GET['search'])) {
                    $where[] = "p.name LIKE ?";
                    $params[] = '%' . $_GET['search'] . '%';
                }
                $whereClause = implode(' AND ', $where);
                $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE $whereClause ORDER BY p.created_at DESC");
                $stmt->execute($params);
                echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $stmt = $pdo->prepare("INSERT INTO products (category_id, name, description, images, retail_price, wholesale_price, promo_price, type, stock_quantity, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['category_id'] ?? null,
                $data['name'],
                $data['description'] ?? '',
                $data['images'] ?? '[]',
                $data['retail_price'],
                $data['wholesale_price'] ?? null,
                $data['promo_price'] ?? null,
                $data['type'] ?? 'Warehouse',
                $data['stock_quantity'] ?? 0,
                $data['status'] ?? 'active'
            ]);
            $newId = $pdo->lastInsertId();
            $pdo->prepare("INSERT INTO inventory_logs (product_id, adjustment, reason) VALUES (?, ?, 'Initial Stock')")->execute([$newId, $data['stock_quantity'] ?? 0]);
            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Product created.', 'id' => $newId]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Product ID required.']);
            exit;
        }
        try {
            $stmt = $pdo->prepare("UPDATE products SET name=?, category_id=?, description=?, retail_price=?, wholesale_price=?, promo_price=?, type=?, stock_quantity=?, status=? WHERE id=?");
            $stmt->execute([$data['name'], $data['category_id'] ?? null, $data['description'] ?? '', $data['retail_price'], $data['wholesale_price'] ?? null, $data['promo_price'] ?? null, $data['type'], $data['stock_quantity'], $data['status'], $id]);
            echo json_encode(['status' => 'success', 'message' => 'Product updated.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Product ID required.']);
            exit;
        }
        try {
            $pdo->prepare("UPDATE products SET status = 'archived' WHERE id = ?")->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Product archived.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
        break;
}
