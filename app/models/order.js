const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orden_id: {
        required: true,
        type: Number
    },
    peso_total: {
        required: true,
        type: Number
    },
    queja: {
        type: Boolean,
        default: Boolean.false
    },
    fecha_entregado: Date,
    fecha_recibido: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        default: 'NEW',
        enum:['NEW','ON_WAY','DELIVERED','COMPLETED']
    },
    cliente: {
        nombre: {
            required: true,
            type: String
        },
        apellido: {
            required: true,
            type: String
        },
        email: {
            required: true,
            type: String
        },
        direccion: {
            required: true,
            type: String
        }
    },
    origen:{
        id: String,
        nombre: String,
        direccion: String
    }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;

