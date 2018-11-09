const dbUtils = require('../../utils/dbUtils.js');
const email = require('../../utils/emailUtils.js');
const validator = require('../../utils/validators.js');

const Order = require('../models/order');
const User = require('../models/user');

const moment = require('moment');

exports.createOrder = async (body, userId) => {
    const orden = new Order(body);

    console.log('El usuario es: ' + userId);

    if(userId !== null){
        const user = await User.findById(userId);
        orden.origen = createOrigen(user);
    }
    return await orden.save();
};

exports.getOrders = async (estado, userId) => {
    try{
        const query = Order.find();

        if(estado)
            query.where('estado',estado);
        if(userId)
            query.where('origen.id', userId);

        return await query.exec();
    }catch (e) {
        next();
    }
};

exports.getOrderById = async (orderId) => {
    const order = await Order.findOne().where('orden_id', orderId).exec();
    if(order){
        return order;
    }else{
        throw new Error('404');
    }
};

exports.updateOrder = async (orderId, newOrder) =>{
    const order = await this.getOrderById(orderId);
    if(order.estado === 'NEW' && newOrder.cliente){
        console.log("Se actualiza el cliente la orden " + orderId);
        order.cliente = newOrder.cliente;
    }
    if(validator.canUpdateStatus(order.estado, newOrder.estado)){
        console.log("Se actualiza al estado " + newOrder.estado +" la orden " + orderId);
        order.estado = newOrder.estado;
        order.fecha_entregado = (newOrder.estado === 'DELIVERED') ? moment().format("YYYY-MM-DD'T'HH:mm:ss") : null ;

        if((newOrder.estado === 'ON_WAY' || newOrder.estado === 'DELIVERED') && !order.queja){
            this.mandarMail(order, newOrder.estado);
        }
    }
    await order.save();
    return order;
};

exports.deleteOrder = async(orderId) =>{
    const order = await this.getOrderById(orderId);
    if(order.estado === 'NEW'){
        console.log("La orden se puede eliminarse");
        return await order.remove();
    }
    else{
        console.log("la order no ed NEW: " +JSON.stringify(order) );
        throw new Error('400');
    }

};

exports.informComplain = async (orderId) =>{
    const order = await this.getOrderById(orderId);
    if(order === null){
        throw new Error("404");
    }else{
        order.queja = true;
        await order.save();
    }
};

exports.createEndDayList = async () => {
    const endDayOrders = await this.getAll({$or:[{estado: 'DELIVERED'}, {estado: 'ON_WAY'}]});
    let result = [];

    //TODO: las que son on_way y se esta haciendo esto,hay que ver si tienen queja para notificar a reclamos.
    endDayOrders.forEach(async doc => {
        result.push(doc.orden_id);
        await this.updateOrder(doc.orden_id, {estado: 'COMPLETED'});
    });

    return {ordenes: result};

};

exports.getAll = (query) => {
    return dbUtils.getAllOrders(query).then(docs => {
        return docs
    }).catch(err => {
        return err;
    });
};

exports.mandarMail = (order, estado) => {
    email.mandarMail(order, estado);
};



function setGetOrderResponse(doc) {
    return {
        id: doc.orden_id,
        estado: doc.estado === 'COMPLETED' ? 'DELIVERED' : doc.estado,
        fecha_entregado : doc.fecha_entregado,
        fecha_recibido: doc.fecha_recibido
    };
}

function createOrigen(user) {
    return {
        id: user._id,
        nombre: user.nombre,
        direccion: user.direccion
    }

}

