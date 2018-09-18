const dbUtils = require('../utils/dbUtils.js');

exports.findOrder = (orderId) => {
     return dbUtils.findOrder(orderId).then(doc => {
         if(!doc) throw new Error("not found");
         return doc;
    }).catch(err => {
        throw new Error(err);
    });
};

exports.informComplain = (orderId) =>{
    dbUtils.patchOrder(orderId,{complain: true}).then(doc => {
        return doc;
    }).catch(err =>{
        throw new Error(err);
    });
};

exports.update = (orderId, body) =>{
    dbUtils.patchOrder(orderId, body).then(doc =>{
        //Logica de mandar mail
        return doc;
    }).catch(err =>{
        throw new Error(err);
    });
};