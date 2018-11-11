const express = require('express');
const router = express.Router();
const logic = require('./logic/deliveryLogic.js');

router.post('/createList', logic.createDeliveredOrdersList);
router.get('/routes',logic.createRoutes);

module.exports = router;