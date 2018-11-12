const orderService = require('./orderService.js');
const movilService = require('./movilService.js');
const fs = require('fs');
const User = require('../models/user');
const ftp =  require('../../utils/ftpUtils.js');


exports.getDeliveredOrders = async () =>{
    const orders = await orderService.getOrders('DELIVERED', null);
    const result = [];
    orders.forEach(order => {
        order.set('estado','COMPLETED');
        result.push({ordenId: order.orden_id})
    });
    this.saveFileInFTP(result);
    orders.forEach(order => {
        order.save();
    });
    return result;
};

exports.getFtpOrdersAndCreateDeliveryOrders = async (fileName) => {
    const user = await User.findOne({prefix_file: fileName});
    console.log('user ' + JSON.stringify(user));
    try{
        let newOrders = await this.getFileFromFTP(fileName);
        console.log("file read");
        return await this.createDeliveryOrders(newOrders, user);
    }catch (e) {
        throw new Error(e);
    }

};

exports.createDeliveryOrders = async (ordenesNuevas, user) => {
    try{
        const orderesOld = await orderService.getOrders('NEW');

        const moviles = await movilService.getMoviles();

        console.log("Se encontraron " + orderesOld.length + " recibidas anteriormente sin entregar");

        let deliveryOrders = [];
        let result = [];
        let ord=0;

        const orders = orderesOld.concat(ordenesNuevas);

        console.log("Se empieza a crear las lista de entregas");

        await moviles.forEach( async movil =>{
            while(movil.peso >= 0 && ord < orders.length){
                const orden = orders[ord];
                if(movil.peso - orden.peso_total >= 0){
                    deliveryOrders.push(crearOrden(orden, user));
                    await guardarOrdenParaEntrega(orden, user);
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
            await guardarOrdenNueva(orders[ord]);
            ord++;
        }

        return result;
    }catch (e) {
        console.log("ha habido un error: " + JSON.stringify(e));
        return e;
    }
};

exports.getFileFromFTP = async (fileName) => {
    await ftp.getFile(fileName);
    console.log("file alredy get");
    return JSON.parse(await fs.readFileSync('files/' + fileName +'.json', 'utf8'));
};

exports.saveFileInFTP = async (bodyFile) =>{
    console.log("save file in ftp");
    await ftp.saveFile(bodyFile);
};

async function guardarOrdenNueva(ord,user) {
    ord.estado = 'ON_WAY';
    await orderService.createOrder(ord, user._id.toString());
}

async function  guardarOrdenParaEntrega(ord,user) {
    console.log("se guarda orden " + JSON.stringify(ord));
    if(ord._id){
        ord.estado = 'ON_WAY';
        await orderService.updateOrder(ord.orden_id, ord);
    }else{
        await guardarOrdenNueva(ord, user);
    }
}

function crearOrden(ord, user) {
    return {
        orden_id: ord.orden_id,
        nombre: ord.cliente.nombre + ' ' + ord.cliente.apellido,
        direccion: ord.cliente.direccion,
        origen: ord.origen ? ord.origen : createOrigen(user)
    };
}

function createMovil(movil) {
    return {
        patente: movil.patente,
        nombre: movil.nombre
    };
}

function createOrigen(user){
    return {
        id: user._id.toString(),
        nombre: user.nombre,
        direccion: user.direccion
    }
}
