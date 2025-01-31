CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create sales_orders table
CREATE TABLE sales_orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sales_order_items table for mapping products to sales orders
CREATE TABLE sales_order_items (
    id SERIAL PRIMARY KEY,
    sales_order_id INTEGER REFERENCES sales_orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better search performance
CREATE INDEX idx_sales_orders_customer_name ON sales_orders(customer_name);
CREATE INDEX idx_sales_orders_customer_email ON sales_orders(customer_email);
CREATE INDEX idx_sales_orders_customer_mobile ON sales_orders(customer_mobile);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_sales_orders_order_date ON sales_orders(order_date);


-- Create an admin user (password: admin123)
INSERT INTO users (email, password, role) 
VALUES ('admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin');

-- Insert Products
INSERT INTO products (name, description, price, sku, stock_quantity) VALUES
('iPhone 14 Pro', 'Latest Apple smartphone with advanced camera system', 999.99, 'IP14P-001', 100),
('Samsung Galaxy S23', 'Flagship Android phone with great performance', 899.99, 'SGS23-001', 150),
('MacBook Pro 16"', 'Powerful laptop for professionals', 2499.99, 'MBP16-001', 50),
('Dell XPS 15', 'Premium Windows laptop', 1799.99, 'DXPS15-001', 75),
('iPad Air', 'Versatile tablet for work and entertainment', 599.99, 'IPAD-001', 200),
('AirPods Pro', 'Premium wireless earbuds with noise cancellation', 249.99, 'APP-001', 300),
('Samsung Galaxy Watch 5', 'Advanced smartwatch with health features', 299.99, 'SGW5-001', 125),
('Sony WH-1000XM4', 'High-end wireless headphones', 349.99, 'SWXM4-001', 80),
('LG OLED C2 65"', 'Premium OLED TV with amazing picture quality', 2299.99, 'LGC2-001', 30),
('Canon EOS R6', 'Professional mirrorless camera', 2499.99, 'CER6-001', 25);

-- Insert Sales Orders
INSERT INTO sales_orders (customer_name, customer_email, customer_mobile, status, total_amount) VALUES
('John Doe', 'john.doe@email.com', '+1-555-0123', 'completed', 1249.98),
('Jane Smith', 'jane.smith@email.com', '+1-555-0124', 'pending', 2499.99),
('Bob Johnson', 'bob.johnson@email.com', '+1-555-0125', 'processing', 899.99),
('Alice Brown', 'alice.brown@email.com', '+1-555-0126', 'completed', 3299.98),
('Charlie Wilson', 'charlie.wilson@email.com', '+1-555-0127', 'shipped', 549.98);

-- Insert Sales Order Items
INSERT INTO sales_order_items (sales_order_id, product_id, quantity, unit_price, total_price) VALUES
-- John Doe's order (iPhone 14 Pro and AirPods Pro)
(1, 1, 1, 999.99, 999.99),
(1, 6, 1, 249.99, 249.99),

-- Jane Smith's order (MacBook Pro)
(2, 3, 1, 2499.99, 2499.99),

-- Bob Johnson's order (Samsung Galaxy S23)
(3, 2, 1, 899.99, 899.99),

-- Alice Brown's order (LG OLED TV and Sony Headphones)
(4, 9, 1, 2299.99, 2299.99),
(4, 8, 1, 349.99, 349.99),

-- Charlie Wilson's order (iPad Air and AirPods Pro)
(5, 5, 1, 599.99, 599.99),
(5, 6, 1, 249.99, 249.99);

-- Insert more varied status orders
INSERT INTO sales_orders (customer_name, customer_email, customer_mobile, status, total_amount) VALUES
('David Lee', 'david.lee@email.com', '+1-555-0128', 'cancelled', 449.98),
('Emma Davis', 'emma.davis@email.com', '+1-555-0129', 'refunded', 2499.99),
('Frank Miller', 'frank.miller@email.com', '+1-555-0130', 'on_hold', 1249.98),
('Grace Taylor', 'grace.taylor@email.com', '+1-555-0131', 'processing', 899.99),
('Henry Wilson', 'henry.wilson@email.com', '+1-555-0132', 'shipped', 3599.98);

-- Insert items for the new orders
INSERT INTO sales_order_items (sales_order_id, product_id, quantity, unit_price, total_price) VALUES
-- David Lee's order
(6, 6, 1, 249.99, 249.99),
(6, 7, 1, 299.99, 299.99),

-- Emma Davis's order
(7, 3, 1, 2499.99, 2499.99),

-- Frank Miller's order
(8, 1, 1, 999.99, 999.99),
(8, 6, 1, 249.99, 249.99),

-- Grace Taylor's order
(9, 2, 1, 899.99, 899.99),

-- Henry Wilson's order
(10, 3, 1, 2499.99, 2499.99),
(10, 8, 1, 349.99, 349.99),
(10, 6, 1, 249.99, 249.99);

-- Insert some orders with multiple quantities of the same item
INSERT INTO sales_orders (customer_name, customer_email, customer_mobile, status, total_amount) VALUES
('Ivy Chen', 'ivy.chen@email.com', '+1-555-0133', 'pending', 1499.97),
('Jack Black', 'jack.black@email.com', '+1-555-0134', 'processing', 2699.97);

INSERT INTO sales_order_items (sales_order_id, product_id, quantity, unit_price, total_price) VALUES
-- Ivy Chen's order (3 AirPods Pro)
(11, 6, 3, 249.99, 749.97),

-- Jack Black's order (3 Samsung Galaxy Watches)
(12, 7, 3, 299.99, 899.97);