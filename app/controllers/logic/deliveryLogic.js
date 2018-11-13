const service = require('../../services/deliveryService.js');

exports.createRoutes = async function (req, res, next) {
    try{
        const result =  await service.getFtpOrdersAndCreateDeliveryOrders( req.query.fileName.split('.')[0] );
        res.header("Content-Type", "application/octet-stream");
        res.header('Content-Disposition', 'attachment; filename="rutas.json"');
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