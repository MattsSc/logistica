
const Movil = require('../models/movil');

exports.getMoviles = async () => {
    return await Movil.find();
};

exports.createMovil = async(movil) => {
    const movilModel = new Movil(movil);
    return await movilModel.save();
};

exports.getMovil = async(id) => {
    return await Movil.findById(id);
};

exports.updateMovil = async (id,movil) => {
    delete movil._id;
    return await Movil.findByIdAndUpdate(id, movil,{new:true});
};

exports.deleteMovil = async (id) =>{
    const movil = await Movil.findById(id);
    return await movil.remove();
};