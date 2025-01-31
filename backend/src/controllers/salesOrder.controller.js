const pool = require('../config/db.config');
const axios = require('axios');

class SalesOrderController {
  async createSalesOrder(req, res) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { customer_name, customer_email, customer_mobile, items } = req.body;
      
      let total_amount = 0;
      const itemsWithPrices = []; 

      for (const item of items) {
        const productResult = await client.query(
          'SELECT price FROM products WHERE id = $1 AND is_active = true',
          [item.product_id]
        );
        
        if (productResult.rows.length === 0) {
          throw new Error(`Product ${item.product_id} not found or inactive`);
        }
        
        const price = productResult.rows[0].price;
        total_amount += price * item.quantity;
        
        itemsWithPrices.push({
          ...item,
          unit_price: price,
          total_price: price * item.quantity
        });
      }

      const salesOrderResult = await client.query(
        `INSERT INTO sales_orders 
        (customer_name, customer_email, customer_mobile, total_amount) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [customer_name, customer_email, customer_mobile, total_amount]
      );

      const salesOrder = salesOrderResult.rows[0];

      for (const item of itemsWithPrices) {
        await client.query(
          `INSERT INTO sales_order_items 
          (sales_order_id, product_id, quantity, unit_price, total_price) 
          VALUES ($1, $2, $3, $4, $5)`,
          [
            salesOrder.id,
            item.product_id,
            item.quantity,
            item.unit_price,
            item.total_price
          ]
        );
      }

      const orderDetails = {
        order_id: salesOrder.id,
        customer: {
          name: customer_name,
          email: customer_email,
          mobile: customer_mobile
        },
        total_amount,
        items: items
      };

      await axios.post('https://third-party-api.com/salesOrder', orderDetails, {
        headers: {
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        }
      });

      await client.query('COMMIT');
      res.status(201).json(salesOrder);
    } catch (error) {
      console.error('Error creating sales order:', error);
      await client.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }

  async getSalesOrders(req, res) {
    try {
      const {
        name,
        email,
        mobile,
        status,
        minAmount,
        maxAmount,
        startDate,
        endDate,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        page = 1,
        limit = 10
      } = req.query;

      const offset = (page - 1) * limit;
      const params = [];
      let paramCount = 1;

      let query = `
        SELECT 
          so.*,
          COUNT(*) OVER() as total_count,
          json_agg(
            json_build_object(
              'product_id', soi.product_id,
              'quantity', soi.quantity,
              'unit_price', soi.unit_price,
              'total_price', soi.total_price,
              'product_name', p.name
            )
          ) as items
        FROM sales_orders so
        LEFT JOIN sales_order_items soi ON so.id = soi.sales_order_id
        LEFT JOIN products p ON soi.product_id = p.id
        WHERE 1=1
      `;

      if (name) {
        query += ` AND so.customer_name ILIKE $${paramCount}`;
        params.push(`%${name}%`);
        paramCount++;
      }

      if (email) {
        query += ` AND so.customer_email ILIKE $${paramCount}`;
        params.push(`%${email}%`);
        paramCount++;
      }

      if (mobile) {
        query += ` AND so.customer_mobile LIKE $${paramCount}`;
        params.push(`%${mobile}%`);
        paramCount++;
      }

      if (status) {
        query += ` AND so.status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      if (minAmount) {
        query += ` AND so.total_amount >= $${paramCount}`;
        params.push(parseFloat(minAmount));
        paramCount++;
      }

      if (maxAmount) {
        query += ` AND so.total_amount <= $${paramCount}`;
        params.push(parseFloat(maxAmount));
        paramCount++;
      }

      if (startDate) {
        query += ` AND so.created_at >= $${paramCount}`;
        params.push(startDate);
        paramCount++;
      }

      if (endDate) {
        query += ` AND so.created_at <= $${paramCount}`;
        params.push(endDate);
        paramCount++;
      }

      query += ` GROUP BY so.id`;

      const allowedSortFields = ['created_at', 'total_amount', 'status', 'customer_name'];
      const allowedSortOrders = ['ASC', 'DESC'];
      
      const sanitizedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
      const sanitizedSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
      
      query += ` ORDER BY so.${sanitizedSortBy} ${sanitizedSortOrder}`;

      query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);
      
      const response = {
        orders: result.rows,
        pagination: {
          total: parseInt(result.rows[0]?.total_count || 0),
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil((result.rows[0]?.total_count || 0) / limit)
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SalesOrderController();