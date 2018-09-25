const dbUtils = require('../utils/dbUtils.js');
function createMovil(movil) {
    return {
        patente: movil.patente,
        nombre: movil.nombre
    };
}

function crearOrden(ord) {
    return {
        orderId: ord.orderId,
        nombre: ord.nombre,
        direccion: ord.direccion
    };
}

exports.createDeliveryOrders = () => {
    dbUtils.getByStatus("NEW").then(orders =>{
        if(!orders)
            throw new Error("aa");
        else{
            const newOrders = orders;
            dbUtils.getAllMoviles().then(docs => {
                if(!docs)
                    throw new Error("aa");
                else{
                    const moviles = docs;
                    let result = [];
                    let deliveryOrders= [];
                    let ord=0;

                    moviles.forEach(movil =>{
                        while(movil.peso >= 0 && ord < newOrders.length){
                            if(movil.peso - newOrders[ord].peso >= 0){
                                deliveryOrders.push(crearOrden(newOrders[ord]));
                                movil.peso -= newOrders[ord].peso;
                                ord ++;
                            }else{
                                movil.peso = -1;
                                ord++;
                            }
                        }
                        let partialResult = {};
                        partialResult.orders = [];
                        partialResult.movil = createMovil(movil);
                        Object.assign(partialResult.orders , deliveryOrders);
                        deliveryOrders = [];
                        result.push(partialResult);
                    });

                    return result;
                }
            }).catch(err =>{
                throw new Error(err);
            });
        }
    }).catch(err =>{
        throw new Error(err);
    });
};

exports.getDeliveredOrders = () =>{
    dbUtils.getByStatus("DELIVERED").then(res => {
        if(!res)
            throw new Error("aa");
        else
        {
            let orders ={};
            orders.ordersIds=[];
            res.forEach(order =>{
                orders.ordersIds.push(order.orderId);
            });
            return orders;
        }
    }).catch(err => {
        throw new Error(err);
    })
};