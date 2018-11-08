const service = require('../../services/movilService.js');

exports.createMovil = async function (req, res, next) {
    try{
        console.log("Se crea el movil");
        const movil = req.body;
        await service.createMovil(movil);
        res.status(200).send();
    }catch (e) {
        next(e);
    }
};

exports.getMoviles = async function (req, res, next) {
    try{
        console.log("Se estan buscando los moviles");
        const result = await service.getMoviles();
        res.send(result);
    }catch (e) {
        next(e);
    }
};

exports.getMovilById = async function (req, res, next) {
    try{
        const movilId = req.params.movilId;
        const movil = await service.getMovil(movilId);
        res.send(movil);
    }catch (e) {
        next(e);
    }
};

exports.updateMovil = async function (req, res, next) {
    try{
        const movilId = req.params.movilId;
        console.log("se actualiza el movil id: " + movilId);
        const movil = await service.updateMovil(movilId, req.body);
        res.send(movil);
    }catch (e) {
        next(e);
    }
};

exports.deleteMovil = async function (req, res, next) {
    try{
        const movilId = req.params.movilId;
        console.log("se elimina el movil id: " + movilId);
        const movil = await service.deleteMovil(movilId);
        res.status(200).send();
    }catch (e) {
        next(e);
    }
};