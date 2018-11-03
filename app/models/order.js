const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

// Connection URL
const mongoUrl = 'mongodb://mongo:pass123@ds151602.mlab.com:51602/logistica';

const connection = mongoose.createConnection(mongoUrl);
autoIncrement.initialize(connection);

const orderSchema = mongoose.Schema({
    orden_id: { type: Number, default: 9100 },
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


orderSchema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'orden_id',
    startAt: 9100,
    incrementBy:2
});
const Order = mongoose.model('orders', orderSchema);


module.exports = Order;

