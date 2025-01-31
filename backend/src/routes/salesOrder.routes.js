const express = require('express');
const router = express.Router();
const salesOrderController = require('../controllers/salesOrder.controller');

router.get('/', salesOrderController.getSalesOrders);
router.post('/', salesOrderController.createSalesOrder);

module.exports = router; 