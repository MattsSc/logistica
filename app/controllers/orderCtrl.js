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
        const result = await service.getOrders(query.estado, null);

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

router.get('/:orderId', async function (req, res, next) {
    const orderId = req.params.orderId;
    console.log("Se fue a buscar la orden con id " + orderId);

    try{
        const doc = await service.getOrderById(orderId);
        if(doc != null)
            res.send(doc);
        else
            res.sendStatus(404);
    }catch (e) {
        if(e.name === 'CastError'){
            res.status(400).send(e.message);
        }else
            next(e);
    }
});

router.patch('/:orderId', async function (req, res, next) {
    const orderId = req.params.orderId;
    console.log("Se actualiza la orden");
    try{
        await service.updateOrder(orderId, req.body);
        res.sendStatus(200);
    }catch (e) {
        next(e);
    }
});

router.patch('/:orderId/complain', async function (req,res, next) {
    const orderId = req.params.orderId;
    console.log("Se informa queja a orden " + orderId);
    try{
        await service.informComplain(orderId);
        res.sendStatus(200);
    }catch (e) {
        next(e);
    }
});

module.exports = router;