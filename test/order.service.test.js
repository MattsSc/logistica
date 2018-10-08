const assert = require('assert');
const orderService = require('../app/services/orderService.js');
const simple = require('simple-mock');
const fs = require('fs');
const moment = require('moment');


describe('Orders', function() {

    describe('Get Orders by status', async function() {

        it('Check mapping response', async function() {
            let delivered = JSON.parse(fs.readFileSync('./test/resources/ordenes_delivered.json', 'utf8'));

            simple.mock(orderService, 'getAllOrders').returnWith(delivered);

            const result = await orderService.getOrdersByStatus('DELIVERED');

            assert.equal(result.ordenes.length, 3);
            assert.equal(result.ordenes[0], 0);
            assert.equal(result.ordenes[1], 2);
            assert.equal(result.ordenes[2], 5);
        });
    });

    describe('Get Order by Id', async function() {

        it('Get Order ON_WAY', async function() {
            let newOrder = JSON.parse(fs.readFileSync('./test/resources/orden_on_way.json', 'utf8'));

            simple.mock(orderService, 'getOrderById').returnWith(newOrder);

            const result = await orderService.findOrder(1);

            assert.equal(result.id, 0);
            assert.equal(result.estado, 'ON_WAY');
            assert.equal(result.fecha_recibido, "2018-01-01'T'12:00:00");
            assert.equal(result.fecha_entregado, null);
        });

        it('Get Order COMPLETED', async function() {
            let newOrder = JSON.parse(fs.readFileSync('./test/resources/orden_completed.json', 'utf8'));

            simple.mock(orderService, 'getOrderById').returnWith(newOrder);

            const result = await orderService.findOrder(1);

            assert.equal(result.id, 0);
            assert.equal(result.estado, 'DELIVERED');
            assert.equal(result.fecha_recibido, "2018-01-01'T'12:00:00");
            assert.equal(result.fecha_entregado, null);
        });

    });

    describe('Update Orders', function() {

        it('Actualiza a NEW y no manda mail', async function() {
            let ordMock ={estado : 'DELIVERED', queja: false};
            simple.mock(orderService, 'mandarMail').returnWith(true);
            simple.mock(orderService,'getOrderById').returnWith(ordMock);
            simple.mock(orderService,'updateOrder').returnWith(true);

            await orderService.updateStatus(1,'NEW');

            assert.equal(orderService.mandarMail.callCount, 0);
        });

        it('Actualiza a ON_WAY y manda mail', async function() {
            let ordMock ={estado : 'NEW', queja: false};
            simple.mock(orderService, 'mandarMail').returnWith(true);
            simple.mock(orderService,'getOrderById').returnWith(ordMock);
            simple.mock(orderService,'updateOrder').returnWith(true);

            const result = await orderService.updateStatus(1, 'ON_WAY');

            assert.equal(result.fecha_entregado, null);
            assert.equal(orderService.mandarMail.callCount, 1);
        });

        it('Actualiza a DELIVERED per hay queja y  no manda mail', async function() {
            let ordMock ={estado : 'NEW', queja: true};
            simple.mock(orderService, 'mandarMail').returnWith(true);
            simple.mock(orderService,'getOrderById').returnWith(ordMock);
            simple.mock(orderService,'updateOrder').returnWith(true);

            const result = await orderService.updateStatus(1, 'DELIVERED');

            assert.equal(result.fecha_entregado, moment().format("YYYY-MM-DD'T'HH:mm:ss"));
            assert.equal(orderService.mandarMail.callCount, 0);
        });
    });
});