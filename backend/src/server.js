require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');
const salesOrderRoutes = require('./routes/salesOrder.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales-orders', salesOrderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});