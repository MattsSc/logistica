const express = require('express');
const router = express.Router();

const service = require('../services/orderService.js');
const validator = require('../../utils/validators.js');

router.get('/', async function (req, res) {
    try{
        const query = {
            estado: req.query.estado || null
        };

        console.log("Se estan buscando las ordenes con estos filtros:" + JSON.stringify(query));
        const result = await service.getOrders(query.estado);

        res.send(result);
    }catch (e) {
        res.sendStatus(404);
    }
});

router.post('/', async function (req, res, next) {
    try{
        console.log("Creando Orden");
        const result = await service.createOrder(req.body, req.headers['x-user'] || null);
        console.log("Orden creada satisfactoriamente");
        res.send(result);
    }catch (e) {
        if(e.name === 'ValidationError'){
            res.status(400).send(e.message);
        }else
            next(e);
    }
});

router.get('/:orderId', async function (req, res) {
    const orderId = req.params.orderId;
    console.log("Se fue a buscar la orden con id " + orderId);
    if(!validator.validateIsNumber(orderId))
        res.status(400).send("El id es solo númerico!");
    else{
        try{
            const doc = await service.findOrder(orderId);
            res.send(doc);
        }catch (e) {
            res.sendStatus(404);
        }
    }
});

router.patch('/:orderId', async function (req, res) {
    const orderId = req.params.orderId;
    console.log("Se actualiza al estado " + req.query.estado + " la orden " + orderId);
    if(validator.validateIsNumber(orderId) && validator.validateBodyForUpdate(req.query.estado)) {
        try{
            const result = await service.updateStatus(req.params.orderId, req.query.estado);
            res.sendStatus(200);
        }catch (e) {
            res.sendStatus(500);
        }
    }else{
        res.status(404).send("Orden id debe ser númerico / El estado no pertenece a los que estan indicados : \"NEW\", \"RECEIVED\", \"ON_WAY\", \"DELIVERED\", \"COMPLETED\"")
    }
});

router.patch('/:orderId/complain', async function (req,res) {
    const orderId = req.params.orderId;
    console.log("Se informa queja a orden " + orderId);
    if(!validator.validateIsNumber(orderId))
        res.status(400).send("El id es solo númerico!");
    else{
        try{
            const result = await service.informComplain(orderId);
            res.sendStatus(200);
        }catch (e) {
           res.sendStatus(500);
        }
    }
});

module.exports = router;