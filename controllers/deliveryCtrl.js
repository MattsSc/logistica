const express = require('express');
const router = express.Router();
const service = require('../service/deliveryService.js');


router.post('/', function (req, res) {
    service.createDeliveryOrders().then(result =>{
        res.send(result);
    }).catch(err =>{
        res.status(404).send(err);
    });
});

router.get('/',function(req, res){
    service.getDeliveredOrders().then(result =>{
        res.send(result);
    }).catch(err => {
        res.status(404).send(err);
    })
});

module.exports = router;