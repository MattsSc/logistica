const dbUtils = require('../../utils/dbUtils.js');
const email = require('../../utils/emailUtils.js');

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

exports.findOrder = async (orderId) => {
    const order = await this.getOrderById(orderId);
    return setGetOrderResponse(order);
};

exports.informComplain = async (orderId) =>{
    return await this.updateOrder(orderId, {queja: true});
};

exports.updateStatus = async (orderId, estado) =>{
    try{
        const order = await this.getOrderById(orderId);
        if(order.estado !== estado){
            order.estado = estado;
            order.fecha_entregado = (estado === 'DELIVERED') ? moment().format("YYYY-MM-DD'T'HH:mm:ss") : null ;
            const result = this.updateOrder(orderId, {estado: estado});

            if((estado === 'ON_WAY' || estado === 'DELIVERED') && !order.queja){
                this.mandarMail(order, estado);
            }

            return order;
        }
    }catch (e) {
        throw new  Error(e);
    }
};

exports.updateOrder = (orderId, query) => {
    return dbUtils.patchOrder(orderId, query).then(doc =>{
        return doc;
    }).catch(err =>{
        return err;
    });
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

exports.getOrderById = (orderId) => {
    return  dbUtils.findOrder(orderId).then(doc =>{
        return doc;
    }).catch(err =>{
        return err;
    });
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

