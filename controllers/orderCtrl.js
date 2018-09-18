const express = require('express');
const router = express.Router();

const service = require('../service/orderService.js');
const global = require('../utils/globalUtils.js');

router.get('/:orderId', function (req, res) {
    service.findOrder(req.params.orderId).then(doc =>{
        res.send(doc);
    }).catch(err => {
        res.send(err);
    });
});

router.patch('/:orderId/complain', function (req,res) {
    service.informComplain(req.params.orderId).then(doc =>{
        res.send(doc);
    }).catch(err =>{
        if(err === global.notFondErrorMessage)
            res.status(404).send(err);
        else
            res.status(500).send(err);
    });
});

router.patch('/:orderId', function (req, res) {
    service.update(req.params.orderId, req.body).then(doc =>{
        res.send(doc);
    }).catch(err =>{
        if(err === global.notFondErrorMessage)
            res.status(404).send(err);
        else
            res.status(500).send(err);
    });
});

module.exports = router;