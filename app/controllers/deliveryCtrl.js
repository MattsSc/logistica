const express = require('express');
const router = express.Router();
const service = require('../services/deliveryService.js');


router.post('/createRoutes', async function (req, res) {
    try{
        const result =  await service.getFtpOrdersAndCreateDeliveryOrders();
        return res.send(result);
    }catch (e) {
        res.status(404).send(e);
    }
});

router.post('/createList', async function (req, res, next) {
    try{
        await service.getDeliveredOrders();
        return res.status(200).send();
    }catch (e) {
        next(e);
    }
});

module.exports = router;