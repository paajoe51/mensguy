-- Dummy SQL Data for testing multiple user roles
-- The password for ALL these accounts is: password

-- 1. Accounts Officer
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`) VALUES
('account_officer', 'account_officer@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Accounts Officer');

-- 2. Accounts Head
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`) VALUES
('accounts_head', 'accounts_head@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Accounts Head');

-- 3. Product Sourcing Officer
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`) VALUES
('sourcing_officer', 'sourcing@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Product Sourcing Officer');

-- 4. Order Manager
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`) VALUES
('order_manager', 'order_manager@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Order Manager');

-- 5. Delivery Personnel
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`) VALUES
('delivery', 'delivery@mensguy.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Delivery Personnel');

-- 6. Customer 1
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`) VALUES
('john_doe', 'john@example.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Customer');

SET @last_customer_id = LAST_INSERT_ID();

INSERT INTO `customers` (`user_id`, `first_name`, `last_name`, `phone`, `address`) VALUES
(@last_customer_id, 'John', 'Doe', '0551234567', '123 Test Avenue, Accra');

-- 7. Customer 2
INSERT INTO `users` (`username`, `email`, `password_hash`, `role`) VALUES
('jane_smith', 'jane@example.com', '$2y$12$SCDeOIiaeRn3CdrqHsEE2uiB8XksUxPvPed3HnvawfsMsx.vt/A2C', 'Customer');

SET @last_customer_id2 = LAST_INSERT_ID();

INSERT INTO `customers` (`user_id`, `first_name`, `last_name`, `phone`, `address`) VALUES
(@last_customer_id2, 'Jane', 'Smith', '0247654321', '456 Sample Street, Kumasi');
