const dbUtils = require('../../utils/dbUtils.js');
const orderService = require('orderService.js');
const fs = require('fs');
const email =  require('../../utils/emailUtils.js');

function createMovil(movil) {
    return {
        patente: movil.patente,
        nombre: movil.nombre
    };
}

function crearOrden(ord) {
    return {
        orderId: ord.orden_id,
        nombre: ord.cliente.nombre,
        direccion: ord.cliente.direccion
    };
}

function guardarOrdenParaEntrega(ord) {
    dbUtils.saveOrder(ord, "ON_WAY").then(doc =>{
        //TODO: descomentar esto para mandar mail.
        //email.mandarMail(ord, "ON_WAY");
    }).catch(err =>{
        return err;
    });

}

function guardarOrdenNueva(ord) {
    dbUtils.saveOrder(ord, "NEW").then(doc =>{
        return doc;
    }).catch(err =>{
        return err;
    });
}

exports.getFtpOrdersAndCreateDeliveryOrders = async () => {
   //TODO: Cambiar a ftp cuando consiga un modulo que funcione

    let newOrders = JSON.parse(fs.readFileSync('files/orders.json', 'utf8'));
    return this.createDeliveryOrders(newOrders);
};

exports.createDeliveryOrders = async (ordenesNuevas) => {
    try{
        const orderesOld = await orderService.getOrdersByStatus('NEW');

        const moviles = await this.getAllMoviles();

        console.log("Se encontraron " + orderesOld.length + " recibidas anteriormente sin entregar");

        let deliveryOrders = [];
        let result = [];
        let ord=0;

        const orders = orderesOld.concat(ordenesNuevas);

        console.log("Se empieza a crear las lista de entregas");

        moviles.forEach(movil =>{
            while(movil.peso >= 0 && ord < orders.length){
                const orden = orders[ord];
                if(movil.peso - orden.peso_total >= 0){
                    deliveryOrders.push(crearOrden(orden));
                    guardarOrdenParaEntrega(orden);
                    movil.peso -= orden.peso_total;
                    ord ++;
                }else{
                    movil.peso = -1;
                }
            }
            let partialResult = {};
            partialResult.orders = [];
            partialResult.movil = createMovil(movil);
            Object.assign(partialResult.orders , deliveryOrders);
            deliveryOrders = [];
            console.log(JSON.stringify(partialResult));
            result.push(partialResult);
        });

        while(ord < orders.length){
            guardarOrdenNueva(orders[ord]);
            ord++;
        }

        return result;
    }catch (e) {
        console.log("ha habido un error: " + JSON.stringify(e));
        return e;
    }
};

exports.getAllMoviles = () => {
    return dbUtils.getAllMoviles().then(docs => {
        return docs;
    }).catch(err => {
        return err;
    })
};