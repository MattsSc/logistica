const mongoose = require('mongoose');

const movilSchema = mongoose.Schema({
    patente: { type: String, required: true},
    nombre: {required: true, type: String},
    peso: {type: Number, default: Boolean.false}
});

const Movil = mongoose.model('moviles', movilSchema);


module.exports = Movil;

