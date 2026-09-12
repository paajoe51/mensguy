-- Complete Database Schema and Seed Data for MENSGUY IMPORT LTD
-- Database Name: mensguy_db

CREATE DATABASE IF NOT EXISTS `mensguy_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mensguy_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `full_name` VARCHAR(100) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('Customer', 'Administrator', 'Accounts Officer', 'Accounts Head', 'Product Sourcing Officer', 'Order Manager', 'Delivery Personnel') NOT NULL DEFAULT 'Customer',
  `status` ENUM('active', 'disabled') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Customers Profile Table
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT,
  `name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) UNIQUE,
  `description` TEXT,
  `images` TEXT, -- JSON array string of image URLs
  `retail_price` DECIMAL(10, 2) NOT NULL,
  `wholesale_price` DECIMAL(10, 2),
  `promo_price` DECIMAL(10, 2),
  `type` ENUM('Warehouse', 'Overseas') NOT NULL DEFAULT 'Warehouse',
  `stock_quantity` INT DEFAULT 0,
  `status` ENUM('active', 'archived') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Inventory Adjustment Logs
CREATE TABLE IF NOT EXISTS `inventory_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `user_id` INT,
  `adjustment` INT NOT NULL,
  `reason` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Overseas Item Requests Table
CREATE TABLE IF NOT EXISTS `item_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `category_id` INT,
  `product_name` VARCHAR(255) NOT NULL,
  `link` TEXT,
  `description` TEXT,
  `quantity` INT NOT NULL DEFAULT 1,
  `budget` DECIMAL(12, 2),
  `notes` TEXT,
  `image` VARCHAR(255),
  `status` ENUM('Pending', 'Under Review', 'Approved', 'Rejected', 'Converted to Order') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` INT NOT NULL,
  `type` ENUM('In-Stock', 'Pre-Order', 'Installment') NOT NULL DEFAULT 'In-Stock',
  `status` ENUM('Pending', 'Payment in Progress', 'Partially Paid', 'Fully Paid', 'Processing', 'Ordered from Supplier', 'In Transit', 'Arrived', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded') DEFAULT 'Pending',
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `amount_paid` DECIMAL(10, 2) DEFAULT 0.00,
  `outstanding_balance` DECIMAL(10, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Order Line Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `method` ENUM('Mobile Money', 'Cash', 'Manual Transfer') NOT NULL,
  `receipt_number` VARCHAR(100) UNIQUE,
  `recorded_by` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Installments Table
CREATE TABLE IF NOT EXISTS `installments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `initial_deposit` DECIMAL(10, 2) NOT NULL,
  `due_date` DATE NOT NULL,
  `grace_period_days` INT DEFAULT 7,
  `penalty_percentage` DECIMAL(5, 2) DEFAULT 30.00,
  `status` ENUM('Active', 'Grace Period', 'Defaulted', 'Completed', 'Refunded') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Overseas Procurement Tracking Table
CREATE TABLE IF NOT EXISTS `procurement` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplier_name` VARCHAR(255) NOT NULL,
  `purchase_cost` DECIMAL(10, 2) NOT NULL,
  `shipping_cost` DECIMAL(10, 2),
  `expected_arrival` DATE,
  `actual_arrival` DATE,
  `status` ENUM('Pending', 'Ordered', 'Shipped', 'In Transit', 'Arrived', 'Closed') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Deliveries Table
CREATE TABLE IF NOT EXISTS `deliveries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `method` ENUM('Customer Pickup', 'Company Delivery', 'Third Party Delivery') NOT NULL DEFAULT 'Company Delivery',
  `status` ENUM('Awaiting Assignment', 'Assigned', 'In Transit', 'Delivered', 'Failed') DEFAULT 'Awaiting Assignment',
  `assigned_to` INT,
  `delivery_address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Finance Logs Table
CREATE TABLE IF NOT EXISTS `finance_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('Business Capital', 'Loan', 'Shares/Investment', 'Customer Pre-Order Payments', 'Other Income', 'Expenditure') NOT NULL,
  `category` VARCHAR(100),
  `amount` DECIMAL(12, 2) NOT NULL,
  `notes` TEXT,
  `spending_officer_id` INT,
  `approval_status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  `approved_by_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`spending_officer_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approved_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. System Settings Table
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) UNIQUE NOT NULL,
  `setting_value` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Audit Logs Table
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `action` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Role Permissions Matrix Table
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role` ENUM('Administrator', 'Accounts Head', 'Accounts Officer', 'Product Sourcing Officer', 'Order Manager', 'Delivery Personnel') NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `level` ENUM('none', 'read', 'write') NOT NULL DEFAULT 'none',
  UNIQUE KEY `uniq_role_module` (`role`, `module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =============================================================================
-- INITIAL DEFAULT SEED DATA
-- Default password for all seed accounts: password
-- Password Hash: $2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C
-- =============================================================================

-- System Settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`) VALUES
('company_name', 'MENSGUY IMPORT LTD'),
('sms_api_key', 'ARKESEL_DEMO_KEY_2026'),
('sms_sender_id', 'MENSGUY'),
('installment_penalty_pct', '30'),
('installment_grace_days', '7')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- Role Permissions Defaults
INSERT INTO `role_permissions` (`role`, `module`, `level`) VALUES
('Accounts Head', 'Executive Dashboard', 'read'),
('Accounts Head', 'Finance Ledger', 'write'),
('Accounts Head', 'Expenditure Approval', 'write'),
('Accounts Head', 'Staff & Governance', 'none'),
('Accounts Officer', 'Executive Dashboard', 'read'),
('Accounts Officer', 'Finance Ledger', 'write'),
('Accounts Officer', 'Expenditure Approval', 'read'),
('Product Sourcing Officer', 'Procurement / Sourcing', 'write'),
('Product Sourcing Officer', 'Executive Dashboard', 'read'),
('Order Manager', 'Installment Config', 'write'),
('Order Manager', 'Logistics / Dispatch', 'write'),
('Order Manager', 'Executive Dashboard', 'read'),
('Delivery Personnel', 'Logistics / Dispatch', 'write')
ON DUPLICATE KEY UPDATE `level` = VALUES(`level`);

-- Users Accounts (Admin, Staff, Customers)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `status`) VALUES
(1, 'admin', 'admin@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Administrator', 'active'),
(2, 'accounts_head', 'accounts_head@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Accounts Head', 'active'),
(3, 'account_officer', 'account_officer@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Accounts Officer', 'active'),
(4, 'sourcing_officer', 'sourcing@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Product Sourcing Officer', 'active'),
(5, 'order_manager', 'order_manager@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Order Manager', 'active'),
(6, 'delivery', 'delivery@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Delivery Personnel', 'active'),
(7, 'john_doe', 'john@example.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Customer', 'active'),
(8, 'jane_smith', 'jane@example.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Customer', 'active')
ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`), `email` = VALUES(`email`);

-- Customer Profiles
INSERT INTO `customers` (`id`, `user_id`, `first_name`, `last_name`, `phone`, `address`) VALUES
(1, 7, 'John', 'Doe', '0551234567', '123 Test Avenue, East Legon, Accra'),
(2, 8, 'Jane', 'Smith', '0247654321', '456 Sample Street, Adum, Kumasi')
ON DUPLICATE KEY UPDATE `phone` = VALUES(`phone`);

-- Categories
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Electronics', 'Smartphones, laptops, TV screens and gadgets'),
(2, 'Home Appliances', 'Refrigerators, washing machines, microwaves'),
(3, 'Cooking Utensils', 'Non-stick pot sets, air fryers, cutlery'),
(4, 'Fashion', 'Designer apparel, footwear, luxury wear'),
(5, 'Accessories', 'Watches, jewelry, bags and travel gear')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Sample Products
INSERT INTO `products` (`id`, `category_id`, `name`, `sku`, `description`, `images`, `retail_price`, `type`, `stock_quantity`, `status`) VALUES
(1, 1, 'iPhone 15 Pro Max 256GB', 'IPH-15PM-256', 'Titanium finish, A17 Pro Chip, 5X Telephoto Camera', '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600"]', 14500.00, 'Warehouse', 12, 'active'),
(2, 1, 'Samsung Galaxy S24 Ultra', 'SAM-S24U-512', 'Galaxy AI, 200MP Camera, Built-in S Pen', '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600"]', 13800.00, 'Overseas', 5, 'active'),
(3, 2, 'Double Door Refrigerator 350L', 'REF-DD-350L', 'Inverter Linear Compressor, Smart Diagnosis', '["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=600"]', 6200.00, 'Warehouse', 8, 'active'),
(4, 3, 'Granite Non-Stick Cookware Set (12-Pcs)', 'CW-GRN-12P', 'PFOA Free granite coating, heat resistant handles', '["https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600"]', 1850.00, 'Warehouse', 25, 'active')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
