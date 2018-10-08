const express = require('express');
const router = express.Router();
const service = require('../services/deliveryService.js');


router.post('/', async function (req, res) {
    try{
        const result =  await service.getFtpOrdersAndCreateDeliveryOrders();;
        return res.send(result);
    }catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;