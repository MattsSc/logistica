const dbUtils = require('../utils/dbUtils.js');

function setGetOrderResponse(doc) {
    return {
        id: doc.orden_id,
        estado: doc.estado === 'COMPLETED' ? 'DELIVERED' : doc.estado,
        fecha_entregado : doc.fecha_entregado,
        fecha_recibido: doc.fecha_recibido
    };
}

exports.findOrder = (orderId) => {
     return dbUtils.findOrder(orderId).then(doc => {
         if(!doc) throw new Error("Not Found!");
         return setGetOrderResponse(doc);
    });
};

exports.informComplain = (orderId) =>{
    return dbUtils.patchOrder(orderId,{queja: true}).then(doc => {
        return doc;
    });
};

exports.update = (orderId, estado) =>{
    return dbUtils.patchOrder(orderId, {estado: estado}).then(doc =>{
        //Logica de mandar mail
        return doc;
    });
};

exports.getOrdersByStatus = (estado) => {
    return dbUtils.getAllOrders({estado: estado}).then(docs =>{
        let orders= [];
        docs.forEach(doc =>{ orders.push(doc.orden_id) });
        return {ordenes: orders};
    });
};