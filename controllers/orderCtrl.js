const express = require('express');
const router = express.Router();

const service = require('../service/orderService.js');
const validator = require('../utils/validators.js');

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
    console.log("Se actualiza estado a orden " + orderId);
    if(validator.validateIsNumber(orderId) && validator.validateBodyForUpdate(req.body)) {
        try{
            const result = await service.update(req.params.orderId, req.body);
            res.sendStatus(200);
        }catch (e) {
            res.sendStatus(500);
        }
    }else{
        res.status(404).send("Orden id debe ser numerico / El estado no pertenece a los que estan indicados : \"NEW\", \"RECEIVED\", \"ON_WAY\", \"DELIVERED\", \"COMPLETED\"")
    }
});
module.exports = router;