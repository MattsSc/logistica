const service = require('../../services/orderService.js');

exports.getOrders = async function (req, res) {
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
};

exports.createOrder = async function (req, res, next) {
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
};

exports.getOrderById = async function (req, res, next) {
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
};

exports.updateOrder = async function (req, res, next) {
    const orderId = req.params.orderId;
    console.log("Se actualiza la orden " + orderId);
    try{
        await service.updateOrder(orderId, req.body);
        res.status(200).send();
    }catch (e) {
        next(e);
    }
};

exports.deleteOrder = async function (req, res, next) {
    const orderId = req.params.orderId;
    console.log("Se elimina la orden " + orderId);
    try{
        await service.deleteOrder(orderId);
        console.log("La orden se ha eliminado");
        res.status(200).send();
    }catch (e) {
        if(e.message === '400')
            res.status(412).send('La orden no es nueva, no puede elminarse');
        next(e);
    }
};

exports.setOrderComplain = async function (req,res, next) {
    const orderId = req.params.orderId;
    console.log("Se informa queja a orden " + orderId);
    try{
        await service.informComplain(orderId);
        res.status(200).send();
    }catch (e) {
        if(e.message === '404')
            res.status(404).send();
        next(e);
    }
};