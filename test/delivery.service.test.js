const assert = require('assert');
const deliveryService = require('../app/services/deliveryService.js');
const simple = require('simple-mock');
const fs = require('fs');


describe('Orders ver si manda mail', function() {

    it('Actualiza a NEW y no manda mail', async function() {
        let newOrders = JSON.parse(fs.readFileSync('files/orders.json', 'utf8'));
        return this.createDeliveryOrders(newOrders);
    });

});