-- -----------------------------------------------------
-- Schema quitq_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `quitq_db` DEFAULT CHARACTER SET utf8;
USE `quitq_db`;

-- -----------------------------------------------------
-- 1. Table `users` (Handles Admin, Seller, and Customers)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- Increased length for hashed JWT passwords
  `email` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'seller', 'customer') NOT NULL,
  `name` VARCHAR(100) NULL,
  `contact_number` VARCHAR(15) NULL,
  `address` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- 2. Table `categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- 3. Table `products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `category_id` INT NOT NULL,
  `seller_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_category_idx` (`category_id` ASC),
  INDEX `fk_product_seller_idx` (`seller_id` ASC),
  CONSTRAINT `fk_product_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_seller`
    FOREIGN KEY (`seller_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- 4. Table `cart`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cart` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_cart_user_idx` (`user_id` ASC),
  INDEX `fk_cart_product_idx` (`product_id` ASC),
  CONSTRAINT `fk_cart_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_cart_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- 5. Table `orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(45) DEFAULT 'processing', -- e.g., processing, shipped, delivered
  `shipping_address` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_orders_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- 1. Categories [cite: 74, 101]
INSERT INTO `categories` (`category_name`) VALUES 
('Electronics'), ('Fashion'), ('Home & Furniture'), ('Mobile');

-- 2. Users (Admin, Seller, Customers) [cite: 36, 49, 54]
INSERT INTO `users` (`username`, `password`, `email`, `role`, `name`) VALUES
('super_admin', 'adminpass', 'admin@quitq.com', 'admin', 'System Administrator'),
('electronics_hub', 'sellerpass', 'sales@ehub.com', 'seller', 'E-Hub Electronics'),
('fashion_world', 'sellerpass', 'info@fworld.com', 'seller', 'Fashion World'),
('jdoe_customer', 'pass123', 'john@example.com', 'customer', 'John Doe'),
('asmith_customer', 'pass123', 'alice@example.com', 'customer', 'Alice Smith');

-- 3. Products [cite: 95]
INSERT INTO `products` (`product_name`, `description`, `price`, `stock_quantity`, `category_id`, `seller_id`) VALUES
('Smartphone X', 'Latest 5G smartphone', 699.99, 50, 4, 2),
('Leather Jacket', 'Genuine black leather', 120.00, 20, 2, 3),
('Gaming Laptop', '16GB RAM, 512GB SSD', 1200.00, 10, 1, 2);

-- 4. Sample Queries [cite: 98]
-- View orders for a specific customer
SELECT o.id, o.order_date, o.total_amount, o.status 
FROM orders o JOIN users u ON o.user_id = u.id 
WHERE u.username = 'jdoe_customer';