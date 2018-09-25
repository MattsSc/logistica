const estados =["NEW", "RECEIVED", "ON_WAY", "DELIVERED", "COMPLETED"];

exports.validateIsNumber = (value) => {
    return /^\d+$/.test(value);
};

exports.validateBodyForUpdate = (estado) => {
    return estados.indexOf(estado) > -1
};