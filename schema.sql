-- CREATING THE TABLES -- 

-- TABLE CLIENTS;

CREATE TABLE clients (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  phone_number varchar(14) NOT NULL,
  address varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci 

-- TABLE PRODUCTS; 

CREATE TABLE products (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  category enum('drink','food') NOT NULL,
  price decimal(10,2) NOT NULL,
  description varchar(255) NOT NULL,
  image_url varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci 

-- TABLE ORDERS; 

CREATE TABLE orders (
  id int NOT NULL AUTO_INCREMENT,
  client_id int NOT NULL,
  payment_method varchar(100) NOT NULL,
  status enum('received','preparing','finished') NOT NULL DEFAULT 'received',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY client_id (client_id),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

-- TABLE ORDERS_ITEMS; 

CREATE TABLE orders_items (
  id int NOT NULL AUTO_INCREMENT,
  orders_id int NOT NULL,
  product_name varchar(255) NOT NULL,
  quantity int NOT NULL,
  PRIMARY KEY (id),
  KEY orders_id (orders_id),
  CONSTRAINT `orders_items_ibfk_1` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci