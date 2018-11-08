const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    nombre: {
        required: true,
        type: String
    },
    direccion: {
        required: true,
        type: String
    },
    localidad: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    prefix_file: String,
    dni: Number
});

const User = mongoose.model('users', usersSchema);

module.exports = User;

