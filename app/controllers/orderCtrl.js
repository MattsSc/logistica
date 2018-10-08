const express = require('express');
const router = express.Router();

const service = require('../services/orderService.js');
const validator = require('../../utils/validators.js');

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

router.get('/', async function (req, res) {
    try{
        const estado = req.query.estado || 'DELIVERED';
        let result;

        if(req.query.scheduled){
            console.log("Se ejecuta el schedule, actualizacion de estado y creacion de archivo.");
            result = await service.createEndDayList();
        }else{
            console.log("Se estan buscando las ordenes que esten en " + estado);
            result = await service.getOrdersByStatus(estado);
        }

        res.send(result);
    }catch (e) {
        res.sendStatus(404);
    }
});

module.exports = router;