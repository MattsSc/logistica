const dbUtils = require('../../utils/dbUtils.js');
const orderService = require('./orderService.js');
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
        orden_id: ord.orden_id,
        nombre: ord.cliente.nombre,
        direccion: ord.cliente.direccion
    };
}

exports.guardarOrdenParaEntrega = async (ord) => {
    ord.estado = 'ON_WAY';
    const result = await orderService.createOrder(ord);
    if(result){
        //TODO: descomentar esto para mandar mail.
        //email.mandarMail(ord, "ON_WAY");
    }
};

exports.guardarOrdenNueva = async (ord) => {
    ord.estado = 'NEW';
    const result = await orderService.createOrder(ord);
};

exports.getFtpOrdersAndCreateDeliveryOrders = async () => {
   //TODO: Cambiar a ftp cuando consiga un modulo que funcione

    let newOrders = JSON.parse(fs.readFileSync('files/orders.json', 'utf8'));
    return this.createDeliveryOrders(newOrders);
};

exports.createDeliveryOrders = async (ordenesNuevas) => {
    try{
        const orderesOld = await orderService.getOrders('NEW');

        const moviles = await this.getAllMoviles();

        console.log("Se encontraron " + orderesOld.length + " recibidas anteriormente sin entregar");

        let deliveryOrders = [];
        let result = [];
        let ord=0;

        const orders = orderesOld.concat(ordenesNuevas);

        console.log("Se empieza a crear las lista de entregas");

        await moviles.forEach( movil =>{
            while(movil.peso >= 0 && ord < orders.length){
                const orden = orders[ord];
                if(movil.peso - orden.peso_total >= 0){
                    deliveryOrders.push(crearOrden(orden));
                    this.guardarOrdenParaEntrega(orden);
                    movil.peso -= orden.peso_total;
                    ord ++;
                }else{
                    movil.peso = -1;
                }
            }
            let partialResult = {};
            partialResult.ordenes = [];
            partialResult.movil = createMovil(movil);
            Object.assign(partialResult.ordenes , deliveryOrders);
            deliveryOrders = [];
            result.push(partialResult);
        });

        while(ord < orders.length){
            await this.guardarOrdenNueva(orders[ord]);
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
