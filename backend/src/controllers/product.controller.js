const pool = require('../config/db.config');

class ProductController {
  // External API - Get all products
  async getAllProducts(req, res) {
    try {
      const result = await pool.query(
        'SELECT id, name, description, price, sku, stock_quantity FROM products WHERE is_active = true'
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Internal API - Create product
  async createProduct(req, res) {
    const { name, description, price, sku, stock_quantity } = req.body;
    
    try {
      const result = await pool.query(
        'INSERT INTO products (name, description, price, sku, stock_quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, price, sku, stock_quantity]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Internal API - Update product
  async updateProduct(req, res) {
    const id = req.params.id;
    const { name, description, price, sku, stock_quantity } = req.body;

    try {
      const result = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, sku = $4, stock_quantity = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [name, description, price, sku, stock_quantity, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Internal API - Delete product
  async deleteProduct(req, res) {
    const id = req.params.id;

    try {
      const result = await pool.query(
        'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();