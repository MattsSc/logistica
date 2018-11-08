const express = require('express');
const router = express.Router();

const logic = require('./logic/orderLogic.js');

router.get('/', logic.getOrders);

router.post('/', logic.createOrder);

router.get('/:orderId', logic.getOrderById);

router.patch('/:orderId', logic.updateOrder);

router.delete('/:orderId', logic.deleteOrder);

router.patch('/:orderId/complain', logic.setOrderComplain);

module.exports = router;