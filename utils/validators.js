const estados =["NEW", "ON_WAY", "DELIVERED", "COMPLETED", "CANCELLED"];


exports.canUpdateStatus = (actualStatus, newStatus) => {
    return estados.indexOf(actualStatus) <= estados.indexOf(newStatus);
};