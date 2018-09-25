const estados =["NEW", "RECEIVED", "ON_WAY", "DELIVERED", "COMPLETED"];

exports.validateIsNumber = (value) => {
    return /^\d+$/.test(value);
};

exports.validateBodyForUpdate =(body) => {
    return body.estado && estados.indexOf(body.estado) > -1
};