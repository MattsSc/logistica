const dbUtils = require('../utils/dbUtils.js');
const email = require('../utils/emailUtils.js');

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

exports.updateStatus = async (orderId, estado) =>{
    try{
        const order = await dbUtils.findOrder(orderId);
        if(order.estado !== estado){
            return dbUtils.patchOrder(orderId, {estado: estado}).then(doc =>{
                if((estado === 'ON_WAY' || estado === 'DELIVERED') && !order.queja){
                    console.log("Se notifica al cliente " + order.cliente.email);
                    email.transporter.sendMail(email.createEmail(order.cliente.email, estado), function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }

                return doc;
            });
        }
    }catch (e) {
        throw new  Error(e);
    }

};

exports.getOrdersByStatus = (estado) => {
    return dbUtils.getAllOrders({estado: estado}).then(docs =>{
        let orders= [];
        docs.forEach(doc =>{ orders.push(doc.orden_id) });
        return {ordenes: orders};
    });
};