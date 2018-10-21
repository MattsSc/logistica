const estados =["NEW", "RECEIVED", "ON_WAY", "DELIVERED", "COMPLETED"];

exports.validateIsNumber = (value) => {
    return /^\d+$/.test(value);
};

exports.validateBodyForUpdate = (estado) => {
    return estados.indexOf(estado) > -1
};

exports.validateUser = (user) => {
    return (user.email && user.dni && user.localidad && user.direccion && user.password);
};