CREATE DATABASE invoice_management;

USE invoice_management;

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    invoice_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    item_name VARCHAR(255),
    item_quantity INT,
    item_price DECIMAL(10, 2),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
