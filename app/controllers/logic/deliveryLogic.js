const service = require('../services/deliveryService.js');

exports.createRoutes = async function (req, res, next) {
    try{
        const result =  await service.getFtpOrdersAndCreateDeliveryOrders(req.query.fileName);
        return res.send(result);
    }catch (e) {
        next(e);
    }
};

exports.createDeliveredOrdersList = async function (req, res, next) {
    try{
        await service.getDeliveredOrders();
        return res.status(200).send();
    }catch (e) {
        next(e);
    }
};